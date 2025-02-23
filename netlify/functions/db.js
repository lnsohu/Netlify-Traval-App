import { createClient } from '@supabase/supabase-js';

// 从环境变量中读取 Supabase URL 和 Key
const supabaseUrl = process.env.supabase_db_SUPABASE_URL; // 使用 API URL
const supabaseKey = process.env.supabase_db_NEXT_PUBLIC_SUPABASE_ANON_KEY; // 使用 anon key

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing');
}

// 初始化 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// export default supabase; // without debugging
export async function getTravels() {
  const { data, error } = await supabase
    .from('travels')
    .select('*');

  if (error) {
    console.error('Debug db.js: Error fetching travels:', error); // 添加日志
    throw new Error('Debug db.js throw error: Failed to get data from DB travels');
  }

  return data;
}

