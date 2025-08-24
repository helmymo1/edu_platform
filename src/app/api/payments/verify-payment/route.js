import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return Response.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const { type, courseId, liveLessonId, studentEmail } = checkoutSession.metadata;

    // Verify the student email matches current user
    if (studentEmail !== session.user.email) {
      return Response.json({ error: 'Payment verification failed' }, { status: 403 });
    }

    if (type === 'course_enrollment' && courseId) {
      // Check if enrollment already exists
      const [existingEnrollment] = await sql`
        SELECT id FROM course_enrollments
        WHERE student_email = ${studentEmail} AND course_id = ${parseInt(courseId)}
      `;

      if (!existingEnrollment) {
        // Create enrollment
        await sql`
          INSERT INTO course_enrollments (student_email, course_id, enrolled_at, progress)
          VALUES (${studentEmail}, ${parseInt(courseId)}, NOW(), 0)
        `;

        // Update course enrolled students count
        await sql`
          UPDATE courses
          SET enrolled_students = enrolled_students + 1
          WHERE id = ${parseInt(courseId)}
        `;
      }

      return Response.json({
        success: true,
        type: 'course_enrollment',
        courseId: parseInt(courseId)
      });

    } else if (type === 'live_lesson_booking' && liveLessonId) {
      // Check if booking already exists
      const [existingBooking] = await sql`
        SELECT id FROM live_lesson_bookings
        WHERE student_email = ${studentEmail} AND live_lesson_id = ${parseInt(liveLessonId)}
      `;

      if (!existingBooking) {
        // Create booking
        await sql`
          INSERT INTO live_lesson_bookings (student_email, live_lesson_id, student_name, booking_date)
          VALUES (${studentEmail}, ${parseInt(liveLessonId)}, ${session.user.name || session.user.email}, NOW())
        `;

        // Update live lesson enrolled students count
        await sql`
          UPDATE live_lessons
          SET enrolled_students = enrolled_students + 1
          WHERE id = ${parseInt(liveLessonId)}
        `;
      }

      return Response.json({
        success: true,
        type: 'live_lesson_booking',
        liveLessonId: parseInt(liveLessonId)
      });

    } else {
      return Response.json({ error: 'Invalid payment type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return Response.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}