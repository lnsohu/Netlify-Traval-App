import React, { useEffect, useState } from 'react';
import './DisplayPage.css';
import TravelList from '../components/TravelList'; // 导入 TravelList 组件

// 导入 Supabase 客户端和测试连接函数
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

function DisplayPage() {
  const [travel, setTravel] = useState(null);

  // 获取最新一条差旅信息
  const fetchTravels = async () => {
    try {
      // 测试数据库连接
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        console.error('Database connection failed');
        return;
      }

      const debugSupabaseUrl = process.env.REACT_APP_supabase_db_SUPABASE_URL;
      const debugSupabaseAnonKey = process.env.REACT_APP_supabase_db_NEXT_PUBLIC_SUPABASE_ANON_KEY;

      console.log('env debugSupabaseUrl: ', debugSupabaseUrl);
      console.log('env debugSupabaseAnonKey: ', debugSupabaseAnonKey);

      let response;
      try {
        response = await fetch('/.netlify/functions/travels', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('[debug] fetch netlify/functions/travels:', error);
      }

      console.log('[debug] response is: ', response);

      if (response.ok) {
        const data = await response.json();
        const sortedTravels = data.sort((a, b) => new Date(b.outbound_flight_date) - new Date(a.outbound_flight_date));
        const latestTravel = sortedTravels[0];
        setTravel(latestTravel);
      } else {
        console.error('Failed to fetch travels');
      }
    } catch (error) {
      console.error('Error during fetching travels:', error);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchTravels();
  }, []);

  if (!travel) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="display-page">
      <h1>{travel.course_name} - {travel.client_name}</h1> {/* 显示课程名称和客户名称 */}

      {/* 上半部分：差旅详情 */}
      <div className="info-section">
        <h2>航班信息</h2>
        <div className="info-group">
          <div className="info-item">
            <label>去程航班</label>
            <p>{travel.outbound_flight_no}</p>
          </div>
          <div className="info-item">
            <label>起飞时间</label>
            <p>{travel.outbound_departure_time}</p>
          </div>
          <div className="info-item">
            <label>出发日期</label>
            <p>{travel.outbound_flight_date}</p>
          </div>
          <div className="info-item">
            <label>出发机场</label>
            <p>{travel.outbound_airport}</p>
          </div>
          <div className="info-item">
            <label>回程航班</label>
            <p>{travel.return_flight_no}</p>
          </div>
          <div className="info-item">
            <label>返程时间</label>
            <p>{travel.return_departure_time}</p>
          </div>
          <div className="info-item">
            <label>返程日期</label>
            <p>{travel.return_flight_date}</p>
          </div>
          <div className="info-item">
            <label>返程机场</label>
            <p>{travel.return_airport}</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>酒店信息</h2>
        <div className="info-group">
          <div className="info-item">
            <label>酒店名称</label>
            <p>{travel.hotel_name}</p>
          </div>
          <div className="info-item">
            <label>酒店地址</label>
            <p>{travel.hotel_address}</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>课程信息</h2>
        <div className="info-group">
          <div className="info-item">
            <label>上课地址</label>
            <p>{travel.class_address}</p>
          </div>
          <div className="info-item">
            <label>课程时间</label>
            <p>{travel.class_time}</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>联系人信息</h2>
        <div className="info-group">
          <div className="info-item">
            <label>客户联络人</label>
            <p>{travel.client_contact}</p>
          </div>
          <div className="info-item">
            <label>客户电话</label>
            <p>{travel.client_phone}</p>
          </div>
          <div className="info-item">
            <label>会务联络人</label>
            <p>{travel.conference_contact}</p>
          </div>
          <div className="info-item">
            <label>会务电话</label>
            <p>{travel.conference_phone}</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>备注</h2>
        <div className="info-group">
          <div className="info-item">
            <p>{travel.notes}</p>
          </div>
        </div>
      </div>

      {/* 下半部分：往期课程查询 */}
      <TravelList isAdmin={false} /> {/* 使用 TravelList 组件，不显示修改按钮 */}
    </div>
  );
}

export default DisplayPage;
