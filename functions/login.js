import supabase from './db'; // 导入 Supabase 客户端

// 硬编码的登录邮箱和密码
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'password';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    console.log('Login request:', { email, password }); // 打印请求数据

    // 硬编码的登录验证
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log('Login successful'); // 打印成功日志
      res.status(200).json({ success: true });
    } else {
      console.log('Login failed: Invalid credentials'); // 打印失败日志
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    console.log('Method not allowed:', req.method); // 打印错误日志
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
