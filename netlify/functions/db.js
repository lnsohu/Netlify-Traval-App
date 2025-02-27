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

// 测试功能：列出 travels 表的表结构
const testSupabaseConnection = async () => {
  try {
    console.log('[debug]: Testing Supabase connection...');

    // 查询 travels 表的结构（假设表中有数据）
    const { data, error } = await supabase
      .from('travels')
      .select('*')
      .limit(1); // 只查询一条记录，避免返回过多数据

    if (error) {
      console.error('Error fetching table structure:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Travels table structure (first row):', data[0]);
    } else {
      console.log('Travels table is empty.');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// 调用测试函数
testSupabaseConnection();


export default supabase; // 使用默认导出
