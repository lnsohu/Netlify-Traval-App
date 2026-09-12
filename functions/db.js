console.log('[debug]: go into db.js');
import { createClient } from '@supabase/supabase-js';
console.log('[debug]: import supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_supabase_db_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_supabase_db_NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 输出环境变量以进行调试
console.log('supabase_db_SUPABASE_URL:', supabaseUrl);
console.log('supabase_db_NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing:', {
    supabaseUrl: supabaseUrl ? '***' : 'undefined', // 避免直接输出敏感信息
    supabaseAnonKey: supabaseAnonKey ? '***' : 'undefined',
  });
  throw new Error('Supabase environment variables are missing');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('[debug]: created supaBase client');

export default supabase; // 使用默认导出
