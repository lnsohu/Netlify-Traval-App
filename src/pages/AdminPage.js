import React, { useState } from 'react';
import './AdminPage.css'; // 导入 CSS 文件
import TravelList from '../components/TravelList'; // 导入 TravelList 组件

function AdminPage() {
  // 声明状态变量
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 新增状态变量
  const [currentTravelId, setCurrentTravelId] = useState(null); // 记录当前修改的差旅 ID
  const [travelInfo, setTravelInfo] = useState({
    course_name: '',
    city: '',
    outbound_flight_no: '',
    outbound_departure_time: '',
    outbound_flight_date: '',
    outbound_airport: '',
    return_flight_no: '',
    return_departure_time: '',
    return_flight_date: '',
    return_airport: '',
    hotel_name: '',
    hotel_address: '',
    class_address: '',
    class_time: '',
    client_contact: '',
    client_phone: '',
    conference_contact: '',
    conference_phone: '',
    notes: '',
    client_name: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/.netlify/functions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true); // 更新登录状态
      } else {
        alert(data.message || 'Login failed'); // 显示登录失败提示
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.'); // 显示错误提示
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const url = isEditing ? `//.netlify/functions/travels?id=${currentTravelId}` : '//.netlify/functions/travels'; // 使用查询参数
    const method = isEditing ? 'PUT' : 'POST'; // 根据是新增还是修改选择请求方式
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(travelInfo),
    });
    if (response.ok) {
      alert(isEditing ? 'Travel info updated!' : 'Travel info submitted!');
      setTravelInfo({ // 清空输入框
        course_name: '',
        city: '',
        outbound_flight_no: '',
        outbound_departure_time: '',
        outbound_flight_date: '',
        outbound_airport: '',
        return_flight_no: '',
        return_departure_time: '',
        return_flight_date: '',
        return_airport: '',
        hotel_name: '',
        hotel_address: '',
        class_address: '',
        class_time: '',
        client_contact: '',
        client_phone: '',
        conference_contact: '',
        conference_phone: '',
        notes: '',
        client_name: '',
      });
      setIsEditing(false); // 重置编辑状态
      setCurrentTravelId(null); // 清除当前差旅 ID
    } else {
      alert('Failed to submit travel info');
    }
  } catch (error) {
    console.error('Error during submission:', error);
    alert('Failed to submit travel info. Please try again.');
  }
};

  const handleEdit = async (travelId) => {
  console.log(`AdminPage Fetching travel info for ID: ${travelId}`); // Debug log
  // alert(`当前差旅 ID: ${travelId}`); // 调试信息
  try {
    const response = await fetch(`//.netlify/functions/travels?id=${travelId}`, { // 使用查询参数
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      setTravelInfo(data); // 填充编辑框
      setIsEditing(true); // 设置为编辑状态
      setCurrentTravelId(travelId); // 记录当前编辑的差旅 ID
    } else {
      console.error('Failed to fetch travel info for editing');
    }
  } catch (error) {
    console.error('Error during fetching travel info:', error);
  }
};

  if (!isLoggedIn) {
    return (
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
    );
  }

  return (
    <div className="travel-form-container">
      <h2>行程管理</h2>
      <form onSubmit={handleSubmit} className="travel-form">
        <div className="form-group">
          <label htmlFor="course_name">课程名称</label>
          <input
            type="text"
            id="course_name"
            value={travelInfo.course_name}
            onChange={(e) => setTravelInfo({ ...travelInfo, course_name: e.target.value })}
            required
          />
        </div>
        <div className="form-group row">
          <div className="form-group-item">
            <label htmlFor="city">城市</label>
            <input
              type="text"
              id="city"
              value={travelInfo.city}
              onChange={(e) => setTravelInfo({ ...travelInfo, city: e.target.value })}
              required
            />
          </div>
          <div className="form-group-item">
            <label htmlFor="client_name">客户名称</label>
            <input
              type="text"
              id="client_name"
              value={travelInfo.client_name}
              onChange={(e) => setTravelInfo({ ...travelInfo, client_name: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="form-group-item">
            <label htmlFor="outbound_flight_no">去程航班</label>
            <input
              type="text"
              id="outbound_flight_no"
              value={travelInfo.outbound_flight_no}
              onChange={(e) => setTravelInfo({ ...travelInfo, outbound_flight_no: e.target.value })}
            />
          </div>
          <div className="form-group-item">
            <label htmlFor="outbound_departure_time">起飞时间</label>
            <input
              type="text"
              id="outbound_departure_time"
              value={travelInfo.outbound_departure_time}
              onChange={(e) => setTravelInfo({ ...travelInfo, outbound_departure_time: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="form-group-item">
            <label htmlFor="outbound_flight_date">出发日期</label>
            <input
              type="date"
              id="outbound_flight_date"
              value={travelInfo.outbound_flight_date}
              onChange={(e) => setTravelInfo({ ...travelInfo, outbound_flight_date: e.target.value })}
              required
            />
          </div>
          <div className="form-group-item">
            <label htmlFor="outbound_airport">出发机场</label>
            <input
              type="text"
              id="outbound_airport"
              value={travelInfo.outbound_airport}
              onChange={(e) => setTravelInfo({ ...travelInfo, outbound_airport: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="form-group-item">
            <label htmlFor="return_flight_no">回程航班</label>
            <input
              type="text"
              id="return_flight_no"
              value={travelInfo.return_flight_no}
              onChange={(e) => setTravelInfo({ ...travelInfo, return_flight_no: e.target.value })}
            />
          </div>
          <div className="form-group-item">
            <label htmlFor="return_departure_time">返程时间</label>
            <input
              type="text"
              id="return_departure_time"
              value={travelInfo.return_departure_time}
              onChange={(e) => setTravelInfo({ ...travelInfo, return_departure_time: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="form-group-item">
            <label htmlFor="return_flight_date">返程日期</label>
            <input
              type="date"
              id="return_flight_date"
              value={travelInfo.return_flight_date}
              onChange={(e) => setTravelInfo({ ...travelInfo, return_flight_date: e.target.value })}
              required
            />
          </div>
          <div className="form-group-item">
            <label htmlFor="return_airport">返程机场</label>
            <input
              type="text"
              id="return_airport"
              value={travelInfo.return_airport}
              onChange={(e) => setTravelInfo({ ...travelInfo, return_airport: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="hotel_name">酒店名称</label>
          <input
            type="text"
            id="hotel_name"
            value={travelInfo.hotel_name}
            onChange={(e) => setTravelInfo({ ...travelInfo, hotel_name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="hotel_address">酒店地址</label>
          <input
            type="text"
            id="hotel_address"
            value={travelInfo.hotel_address}
            onChange={(e) => setTravelInfo({ ...travelInfo, hotel_address: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="class_address">上课地址</label>
          <input
            type="text"
            id="class_address"
            value={travelInfo.class_address}
            onChange={(e) => setTravelInfo({ ...travelInfo, class_address: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="class_time">课程时间</label>
          <input
            type="text"
            id="class_time"
            value={travelInfo.class_time}
            onChange={(e) => setTravelInfo({ ...travelInfo, class_time: e.target.value })}
            required
          />
        </div>
        <div className="form-group row">
          <div className="form-group-item">
            <label htmlFor="client_contact">客户联络人</label>
            <input
              type="text"
              id="client_contact"
              value={travelInfo.client_contact}
              onChange={(e) => setTravelInfo({ ...travelInfo, client_contact: e.target.value })}
            />
          </div>
          <div className="form-group-item">
            <label htmlFor="client_phone">客户电话</label>
            <input
              type="text"
              id="client_phone"
              value={travelInfo.client_phone}
              onChange={(e) => setTravelInfo({ ...travelInfo, client_phone: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="form-group-item">
            <label htmlFor="conference_contact">会务联络人</label>
            <input
              type="text"
              id="conference_contact"
              value={travelInfo.conference_contact}
              onChange={(e) => setTravelInfo({ ...travelInfo, conference_contact: e.target.value })}
            />
          </div>
          <div className="form-group-item">
            <label htmlFor="conference_phone">会务电话</label>
            <input
              type="text"
              id="conference_phone"
              value={travelInfo.conference_phone}
              onChange={(e) => setTravelInfo({ ...travelInfo, conference_phone: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="notes">备注</label>
          <input
            type="text"
            id="notes"
            value={travelInfo.notes}
            onChange={(e) => setTravelInfo({ ...travelInfo, notes: e.target.value })}
          />
        </div>
        <button type="submit" className="btn">{isEditing ? '更新' : '提交'}</button> {/* 更新按钮文本 */}
      </form>

      {/* 添加 TravelList 组件 */}
      <div className="travel-list-section">
        <TravelList isAdmin={true} onEdit={handleEdit} /> {/* 传递 handleEdit 函数 */}
      </div>
    </div>
  );
}

export default AdminPage;
