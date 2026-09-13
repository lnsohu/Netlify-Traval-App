const supabase = require('./db');

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

function parseBody(event) {
  if (!event.body) {
    return {};
  }
  return typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
}

exports.handler = async (event) => {
  const method = event.httpMethod;
  const query = event.queryStringParameters || {};
  const id = query.id;

  try {
    if (method === 'GET') {
      if (id) {
        const { data, error } = await supabase
          .from('travels')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Database query failed:', error);
          return json(500, { error: 'Database query failed', details: error });
        }

        if (data) {
          return json(200, data);
        }
        return json(404, { error: 'Travel not found' });
      }

      const { data, error } = await supabase.from('travels').select('*');

      if (error) {
        console.error('Database query failed:', error);
        return json(500, { error: 'Database query failed', details: error });
      }

      return json(200, data || []);
    }

    if (method === 'POST') {
      const { data, error } = await supabase
        .from('travels')
        .insert([parseBody(event)])
        .select();

      if (error) {
        console.error('Database insert failed:', error);
        return json(500, { error: 'Database insert failed', details: error });
      }

      return json(201, { message: 'Travel info added successfully', data });
    }

    if (method === 'PUT') {
      if (!id) {
        return json(400, { error: 'ID is required for update' });
      }

      const { data, error } = await supabase
        .from('travels')
        .update(parseBody(event))
        .eq('id', id);

      if (error) {
        console.error('Database update failed:', error);
        return json(500, { error: 'Database update failed', details: error });
      }

      return json(200, { message: 'Travel info updated successfully', data });
    }

    return json(405, { message: `Method ${method} not allowed` });
  } catch (err) {
    console.error('Server error:', err);
    return json(500, { error: 'Internal server error', details: err.message });
  }
};
