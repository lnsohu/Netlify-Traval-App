exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Method ${event.httpMethod} not allowed` }),
    };
  }

  let email;
  let password;
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    email = body.email;
    password = body.password;
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Invalid request body' }),
    };
  }

  const ADMIN_EMAIL = 'admin@example.com';
  const ADMIN_PASSWORD = 'password';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  }

  return {
    statusCode: 401,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: false, message: 'Invalid credentials' }),
  };
};
