import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Get enrolled courses
    const enrolledCourses = await sql`
      SELECT
        ce.id as enrollment_id,
        ce.enrolled_at,
        ce.progress,
        ce.completed_at,
        c.id as course_id,
        c.title,
        c.description,
        c.thumbnail_url,
        c.price,
        c.level,
        c.duration_hours,
        c.total_lessons,
        i.name as instructor_name,
        i.avatar_url as instructor_avatar
      FROM course_enrollments ce
      JOIN courses c ON ce.course_id = c.id
      LEFT JOIN instructors i ON c.instructor_id = i.id
      WHERE ce.student_email = ${userEmail}
      ORDER BY ce.enrolled_at DESC
    `;

    // Get live lesson bookings
    const liveLessonBookings = await sql`
      SELECT
        llb.id as booking_id,
        llb.booking_date,
        llb.attended,
        ll.id as lesson_id,
        ll.title,
        ll.description,
        ll.scheduled_date,
        ll.scheduled_time,
        ll.timezone,
        ll.duration_hours,
        ll.price,
        ll.level,
        ll.meeting_url,
        i.name as instructor_name,
        i.avatar_url as instructor_avatar
      FROM live_lesson_bookings llb
      JOIN live_lessons ll ON llb.live_lesson_id = ll.id
      LEFT JOIN instructors i ON ll.instructor_id = i.id
      WHERE llb.student_email = ${userEmail}
      ORDER BY ll.scheduled_date ASC, ll.scheduled_time ASC
    `;

    // Separate upcoming and past live lessons
    const now = new Date();
    const upcomingLessons = [];
    const pastLessons = [];

    liveLessonBookings.forEach(lesson => {
      const lessonDateTime = new Date(`${lesson.scheduled_date} ${lesson.scheduled_time}`);
      if (lessonDateTime > now) {
        upcomingLessons.push(lesson);
      } else {
        pastLessons.push(lesson);
      }
    });

    // Calculate stats
    const totalCoursesEnrolled = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(course => course.completed_at).length;
    const totalLiveLessons = liveLessonBookings.length;
    const attendedLessons = pastLessons.filter(lesson => lesson.attended).length;

    return Response.json({
      stats: {
        totalCoursesEnrolled,
        completedCourses,
        totalLiveLessons,
        attendedLessons,
        upcomingLessonsCount: upcomingLessons.length
      },
      enrolledCourses,
      upcomingLessons,
      pastLessons
    });

  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return Response.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}