import React, { useEffect, useState } from 'react';
import './TravelList.css';

function TravelList({ isAdmin, onEdit }) {
  const [recentTravels, setRecentTravels] = useState([]);
  const [filter, setFilter] = useState({ city: '', courseName: '', clientName: '' });

  // 获取所有差旅信息
  const fetchTravels = async () => {
    try {
      const response = await fetch('/api/travels', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        const sortedTravels = data.sort((a, b) => new Date(b.outbound_flight_date) - new Date(a.outbound_flight_date));
        setRecentTravels(sortedTravels);
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

  // 处理过滤条件变化
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // 处理查询
  const handleSearch = async () => {
    try {
      const response = await fetch('/api/travels', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        // 根据过滤条件筛选数据
        const filteredTravels = data.filter((item) => {
          return (
            item.city.includes(filter.city) &&
            item.course_name.includes(filter.courseName) &&
            item.client_name.includes(filter.clientName)
          );
        });
        setRecentTravels(filteredTravels);
      } else {
        console.error('Failed to fetch travels');
      }
    } catch (error) {
      console.error('Error during fetching travels:', error);
    }
  };

  return (
    <div className="info-section">
      <h2>往期课程</h2>

      {/* 查询文本框 */}
      <div className="filter-group">
        <input
          type="text"
          name="city"
          placeholder="城市"
          value={filter.city}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="courseName"
          placeholder="课程名称"
          value={filter.courseName}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="clientName"
          placeholder="客户名称"
          value={filter.clientName}
          onChange={handleFilterChange}
        />
        <button onClick={handleSearch}>查询</button>
      </div>

      <table className="travel-table">
        <thead>
          <tr>
            <th>城市</th>
            <th>课程名称</th>
            <th>客户名称</th>
            {isAdmin && <th>操作</th>} {/* 如果是管理员，显示操作列 */}
          </tr>
        </thead>
        <tbody>
          {recentTravels.map((item) => (
            <tr key={item.id}>
              <td>{item.city}</td>
              <td>{item.course_name}</td>
              <td>{item.client_name}</td>
              {isAdmin && ( // 如果是管理员，显示修改按钮
                <td>
                  <button onClick={() => onEdit(item.id)}>修改</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TravelList;
