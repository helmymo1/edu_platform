import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { liveLessonId, redirectURL } = await request.json();

    if (!liveLessonId) {
      return Response.json({ error: 'Live lesson ID is required' }, { status: 400 });
    }

    // Get live lesson details
    const [liveLesson] = await sql`
      SELECT ll.*, i.name as instructor_name
      FROM live_lessons ll
      LEFT JOIN instructors i ON ll.instructor_id = i.id
      WHERE ll.id = ${liveLessonId} AND ll.is_active = true
    `;

    if (!liveLesson) {
      return Response.json({ error: 'Live lesson not found' }, { status: 404 });
    }

    // Check if lesson is in the future
    const now = new Date();
    const lessonDateTime = new Date(`${liveLesson.scheduled_date} ${liveLesson.scheduled_time}`);

    if (lessonDateTime < now) {
      return Response.json({ error: 'Cannot book past live lessons' }, { status: 400 });
    }

    // Check if user is already booked
    const [existingBooking] = await sql`
      SELECT id FROM live_lesson_bookings
      WHERE student_email = ${session.user.email} AND live_lesson_id = ${liveLessonId}
    `;

    if (existingBooking) {
      return Response.json({ error: 'Already booked for this live lesson' }, { status: 400 });
    }

    // Check if lesson is full
    if (liveLesson.enrolled_students >= liveLesson.max_students) {
      return Response.json({ error: 'Live lesson is fully booked' }, { status: 400 });
    }

    // Get or create Stripe customer
    const [user] = await sql`
      SELECT stripe_id FROM auth_users WHERE email = ${session.user.email}
    `;

    let stripeCustomerId = user?.stripe_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || session.user.email,
      });
      stripeCustomerId = customer.id;

      await sql`
        UPDATE auth_users
        SET stripe_id = ${stripeCustomerId}
        WHERE email = ${session.user.email}
      `;
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Live Lesson: ${liveLesson.title}`,
              description: `Live interactive lesson with ${liveLesson.instructor_name} on ${new Date(liveLesson.scheduled_date).toLocaleDateString()}`,
            },
            unit_amount: Math.round(liveLesson.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${redirectURL || process.env.NEXT_PUBLIC_APP_URL}/lesson-success?session_id={CHECKOUT_SESSION_ID}&lesson_id=${liveLessonId}`,
      cancel_url: `${redirectURL || process.env.NEXT_PUBLIC_APP_URL}/live-lessons`,
      metadata: {
        liveLessonId: liveLessonId.toString(),
        studentEmail: session.user.email,
        type: 'live_lesson_booking'
      }
    });

    return Response.json({ url: checkoutSession.url });

  } catch (error) {
    console.error('Live lesson checkout error:', error);
    return Response.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}