import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.supabase_db_SUPABASE_URL;
const supabaseAnonKey = process.env.supabase_db_NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing:', {
    supabaseUrl: supabaseUrl ? '***' : 'undefined', // 避免直接输出敏感信息
    supabaseAnonKey: supabaseAnonKey ? '***' : 'undefined',
  });
  throw new Error('Supabase environment variables are missing');
}

// 输出环境变量以进行调试
console.log('supabase_db_SUPABASE_URL:', supabaseUrl);
console.log('supabase_db_NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; // origial export default mode


