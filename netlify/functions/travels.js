console.log('[debug]: go into travel.js');
import supabase from './db'; // 默认方式导入 Supabase 客户端
// import { getTravels } from './db'; // 使用命名导入

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    // 从路径参数中获取 ID
    const id = req.query.id || req.query[0]; // 支持路径参数和查询参数
    console.log(`Received ID for query: ${id}`); // 调试信息

    if (id) {
      console.log(`Triggering single record query for ID: ${id}`); // 调试信息
      try {
        const { data, error } = await supabase
          .from('travels')
          .select('*')
          .eq('id', id) // 根据 ID 查询
          .single(); // 只获取一条记录

        if (error) {
          console.error('Database query failed:', error);
          return res.status(500).json({ error: 'Database query failed', details: error });
        }

        if (data) {
          return res.status(200).json(data);
        } else {
          return res.status(404).json({ error: 'Travel not found' });
        }
      } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
      }
    } else {
      // 获取所有差旅信息
      try {
        const { data, error } = await supabase.from('travels').select('*');

        if (error) {
          console.error('Database query failed:', error);
          return res.status(500).json({ error: 'Database query failed', details: error });
        }

        res.status(200).json(data);
      } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
      }
    }
  } else if (method === 'POST') {
    // 处理 POST 请求的逻辑（新增记录）
    console.log('Received POST request to add new travel info'); // 调试信息
    try {
      const { data, error } = await supabase
        .from('travels')
        .insert([req.body]) // 插入新记录
        .select(); // 返回插入的数据

      if (error) {
        console.error('Database insert failed:', error);
        return res.status(500).json({ error: 'Database insert failed', details: error });
      }

      res.status(201).json({ message: 'Travel info added successfully', data });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  } else if (method === 'PUT') {
    // 处理 PUT 请求的逻辑（更新记录）
    const id = req.query.id || req.query[0]; // 获取路径参数中的 ID
    console.log(`Received ID for update: ${id}`); // 调试信息

    if (!id) {
      return res.status(400).json({ error: 'ID is required for update' });
    }

    try {
      const { data, error } = await supabase
        .from('travels')
        .update(req.body) // 更新请求体中的数据
        .eq('id', id); // 根据 ID 更新

      if (error) {
        console.error('Database update failed:', error);
        return res.status(500).json({ error: 'Database update failed', details: error });
      }

      res.status(200).json({ message: 'Travel info updated successfully', data });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
