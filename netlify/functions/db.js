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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getTravels() {
  console.log('Fetching travels from Supabase...'); // 添加开始日志
  try {
    const { data, error } = await supabase
      .from('travels')
      .select('*');

    if (error) {
      console.error('Error fetching travels:', error);
      throw new Error('Failed to fetch travels');
    }

    console.log('Successfully fetched travels:', data); // 添加成功日志
    return data;
  } catch (error) {
    console.error('Unexpected error in getTravels:', error); // 添加捕获异常日志
    throw error;
  }
}

// export default supabase; // origial export default mode


