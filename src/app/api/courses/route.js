import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'popular';
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    let query = `
      SELECT
        c.*,
        i.name as instructor_name,
        i.avatar_url as instructor_avatar,
        cat.name as category_name,
        cat.slug as category_slug
      FROM courses c
      LEFT JOIN instructors i ON c.instructor_id = i.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.is_published = true
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
        LOWER(c.title) LIKE LOWER($${paramCount})
        OR LOWER(i.name) LIKE LOWER($${paramCount})
        OR LOWER(c.description) LIKE LOWER($${paramCount})
      )`;
      params.push(`%${search}%`);
    }

    // Add sorting
    switch (sortBy) {
      case 'price-low':
        query += ' ORDER BY c.price ASC';
        break;
      case 'price-high':
        query += ' ORDER BY c.price DESC';
        break;
      case 'rating':
        query += ' ORDER BY c.rating DESC';
        break;
      case 'newest':
        query += ' ORDER BY c.created_at DESC';
        break;
      default: // popular
        query += ' ORDER BY c.enrolled_students DESC';
    }

    // Add pagination
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const courses = await sql(query, params);

    return Response.json({
      success: true,
      courses: courses,
      total: courses.length
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch courses' },
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
      thumbnail_url,
      price,
      level,
      duration_hours
    } = body;

    // Validate required fields
    if (!title || !instructor_id || !category_id || !price || !level) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    const result = await sql`
      INSERT INTO courses (
        title, slug, description, instructor_id, category_id,
        thumbnail_url, price, level, duration_hours, is_published
      ) VALUES (
        ${title}, ${slug}, ${description}, ${instructor_id}, ${category_id},
        ${thumbnail_url}, ${price}, ${level}, ${duration_hours}, true
      ) RETURNING *
    `;

    return Response.json({
      success: true,
      course: result[0]
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return Response.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}