const dns = require('dns');

if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const { createClient } = require('@supabase/supabase-js');

function cleanEnv(value) {
  if (!value) {
    return '';
  }
  return String(value).trim().replace(/^['"]|['"]$/g, '');
}

function isApiUrl(value) {
  return value.startsWith('https://') && !value.startsWith('https://postgres');
}

function pickSupabaseUrl() {
  const candidates = [
    process.env.REACT_APP_supabase_db_NEXT_PUBLIC_SUPABASE_URL,
    process.env.REACT_APP_supabase_db_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_DATABASE_URL,
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ].map(cleanEnv);

  return candidates.find(isApiUrl) || '';
}

function pickSupabaseKey() {
  const candidates = [
    process.env.REACT_APP_supabase_db_NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.REACT_APP_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.SUPABASE_ANON_KEY,
  ].map(cleanEnv);

  return candidates.find(Boolean) || '';
}

const supabaseUrl = pickSupabaseUrl();
const supabaseAnonKey = pickSupabaseKey();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing or not an https API URL');
}

try {
  console.log('Supabase API host:', new URL(supabaseUrl).host);
} catch (err) {
  throw new Error('Supabase URL is invalid');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch },
});

module.exports = supabase;
