import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { courseId, redirectURL } = await request.json();

    if (!courseId) {
      return Response.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Get course details
    const [course] = await sql`
      SELECT c.*, i.name as instructor_name
      FROM courses c
      LEFT JOIN instructors i ON c.instructor_id = i.id
      WHERE c.id = ${courseId} AND c.is_published = true
    `;

    if (!course) {
      return Response.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is already enrolled
    const [existingEnrollment] = await sql`
      SELECT id FROM course_enrollments
      WHERE student_email = ${session.user.email} AND course_id = ${courseId}
    `;

    if (existingEnrollment) {
      return Response.json({ error: 'Already enrolled in this course' }, { status: 400 });
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
              name: course.title,
              description: `Learn ${course.title} with ${course.instructor_name}`,
              images: course.thumbnail_url ? [course.thumbnail_url] : [],
            },
            unit_amount: Math.round(course.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${redirectURL || process.env.NEXT_PUBLIC_APP_URL}/course-success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`,
      cancel_url: `${redirectURL || process.env.NEXT_PUBLIC_APP_URL}/courses`,
      metadata: {
        courseId: courseId.toString(),
        studentEmail: session.user.email,
        type: 'course_enrollment'
      }
    });

    return Response.json({ url: checkoutSession.url });

  } catch (error) {
    console.error('Course checkout error:', error);
    return Response.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}