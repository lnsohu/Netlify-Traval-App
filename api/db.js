import { createClient } from '@supabase/supabase-js';

// 从环境变量中读取 Supabase URL 和 Key
const supabaseUrl = process.env.supabase_db_SUPABASE_URL; // 使用 API URL
const supabaseKey = process.env.supabase_db_NEXT_PUBLIC_SUPABASE_ANON_KEY; // 使用 anon key

// 初始化 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
