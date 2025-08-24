import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { live_lesson_id, student_email, student_name } = body;

    // Validate required fields
    if (!live_lesson_id || !student_email || !student_name) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if lesson exists and has available spots
    const lessonCheck = await sql`
      SELECT
        id, title, max_students, enrolled_students,
        (max_students - enrolled_students) as available_spots
      FROM live_lessons
      WHERE id = ${live_lesson_id} AND is_active = true
    `;

    if (lessonCheck.length === 0) {
      return Response.json(
        { success: false, error: 'Live lesson not found or inactive' },
        { status: 404 }
      );
    }

    const lesson = lessonCheck[0];
    if (lesson.available_spots <= 0) {
      return Response.json(
        { success: false, error: 'No available spots for this lesson' },
        { status: 400 }
      );
    }

    // Check if student is already booked
    const existingBooking = await sql`
      SELECT id FROM live_lesson_bookings
      WHERE live_lesson_id = ${live_lesson_id} AND student_email = ${student_email}
    `;

    if (existingBooking.length > 0) {
      return Response.json(
        { success: false, error: 'You are already booked for this lesson' },
        { status: 400 }
      );
    }

    // Use transaction to book the lesson and update enrollment count
    const [booking, updatedLesson] = await sql.transaction([
      sql`
        INSERT INTO live_lesson_bookings (live_lesson_id, student_email, student_name)
        VALUES (${live_lesson_id}, ${student_email}, ${student_name})
        RETURNING *
      `,
      sql`
        UPDATE live_lessons
        SET enrolled_students = enrolled_students + 1
        WHERE id = ${live_lesson_id}
        RETURNING *
      `
    ]);

    return Response.json({
      success: true,
      booking: booking[0],
      message: 'Successfully booked for the live lesson!'
    });

  } catch (error) {
    console.error('Error booking live lesson:', error);

    // Handle unique constraint violation (duplicate booking)
    if (error.code === '23505') {
      return Response.json(
        { success: false, error: 'You are already booked for this lesson' },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: 'Failed to book live lesson' },
      { status: 500 }
    );
  }
}