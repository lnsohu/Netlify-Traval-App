const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_supabase_db_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_supabase_db_NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
