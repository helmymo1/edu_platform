import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const timeSlot = searchParams.get('timeSlot');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    let query = `
      SELECT
        ll.*,
        i.name as instructor_name,
        i.avatar_url as instructor_avatar,
        cat.name as category_name,
        cat.slug as category_slug,
        (ll.max_students - ll.enrolled_students) as available_spots
      FROM live_lessons ll
      LEFT JOIN instructors i ON ll.instructor_id = i.id
      LEFT JOIN categories cat ON ll.category_id = cat.id
      WHERE ll.is_active = true
        AND ll.scheduled_date >= CURRENT_DATE
    `;

    const params = [];
    let paramCount = 0;

    // Add category filter
    if (category && category !== 'all') {
      paramCount++;
      query += ` AND cat.slug = $${paramCount}`;
      params.push(category);
    }

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND (
        LOWER(ll.title) LIKE LOWER($${paramCount})
        OR LOWER(i.name) LIKE LOWER($${paramCount})
        OR LOWER(ll.description) LIKE LOWER($${paramCount})
      )`;
      params.push(`%${search}%`);
    }

    // Add time slot filter
    if (timeSlot && timeSlot !== 'all') {
      switch (timeSlot) {
        case 'morning':
          query += ` AND ll.scheduled_time >= '08:00:00' AND ll.scheduled_time < '12:00:00'`;
          break;
        case 'afternoon':
          query += ` AND ll.scheduled_time >= '12:00:00' AND ll.scheduled_time < '18:00:00'`;
          break;
        case 'evening':
          query += ` AND ll.scheduled_time >= '18:00:00' AND ll.scheduled_time < '22:00:00'`;
          break;
      }
    }

    // Order by date and time
    query += ' ORDER BY ll.scheduled_date ASC, ll.scheduled_time ASC';

    // Add pagination
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const lessons = await sql(query, params);

    return Response.json({
      success: true,
      lessons: lessons,
      total: lessons.length
    });

  } catch (error) {
    console.error('Error fetching live lessons:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch live lessons' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      instructor_id,
      category_id,
      scheduled_date,
      scheduled_time,
      duration_hours,
      max_students,
      price,
      level,
      topics
    } = body;

    // Validate required fields
    if (!title || !instructor_id || !category_id || !scheduled_date ||
        !scheduled_time || !duration_hours || !max_students || !price || !level) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO live_lessons (
        title, description, instructor_id, category_id, scheduled_date,
        scheduled_time, duration_hours, max_students, price, level, topics
      ) VALUES (
        ${title}, ${description}, ${instructor_id}, ${category_id}, ${scheduled_date},
        ${scheduled_time}, ${duration_hours}, ${max_students}, ${price}, ${level}, ${topics}
      ) RETURNING *
    `;

    return Response.json({
      success: true,
      lesson: result[0]
    });

  } catch (error) {
    console.error('Error creating live lesson:', error);
    return Response.json(
      { success: false, error: 'Failed to create live lesson' },
      { status: 500 }
    );
  }
}