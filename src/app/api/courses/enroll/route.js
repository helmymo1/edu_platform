import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { course_id, student_email } = body;

    // Validate required fields
    if (!course_id || !student_email) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if course exists and is published
    const courseCheck = await sql`
      SELECT id, title, price FROM courses
      WHERE id = ${course_id} AND is_published = true
    `;

    if (courseCheck.length === 0) {
      return Response.json(
        { success: false, error: 'Course not found or not available' },
        { status: 404 }
      );
    }

    // Check if student is already enrolled
    const existingEnrollment = await sql`
      SELECT id FROM course_enrollments
      WHERE course_id = ${course_id} AND student_email = ${student_email}
    `;

    if (existingEnrollment.length > 0) {
      return Response.json(
        { success: false, error: 'You are already enrolled in this course' },
        { status: 400 }
      );
    }

    // Use transaction to enroll student and update enrollment count
    const [enrollment, updatedCourse] = await sql.transaction([
      sql`
        INSERT INTO course_enrollments (course_id, student_email)
        VALUES (${course_id}, ${student_email})
        RETURNING *
      `,
      sql`
        UPDATE courses
        SET enrolled_students = enrolled_students + 1
        WHERE id = ${course_id}
        RETURNING *
      `
    ]);

    return Response.json({
      success: true,
      enrollment: enrollment[0],
      message: 'Successfully enrolled in the course!'
    });

  } catch (error) {
    console.error('Error enrolling in course:', error);

    // Handle unique constraint violation (duplicate enrollment)
    if (error.code === '23505') {
      return Response.json(
        { success: false, error: 'You are already enrolled in this course' },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}