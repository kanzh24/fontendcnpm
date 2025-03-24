import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
// import './styles/Statistics.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const fallbackImage = require(`../../assets/images/image01.jpg`);

const Statistics = () => {
  const pieData = {
    labels: ['Đồ ăn', 'Đồ uống', 'Khác'],
    datasets: [{ label: 'Doanh thu', data: [5000, 3000, 2000], backgroundColor: ['#dad9d9', '#ff6f00', '#424242'] }],
  };

  const lineData = {
    labels: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5'],
    datasets: [{ label: 'Doanh thu theo ngày', data: [2000, 2500, 3000, 4000, 5000], fill: false, borderColor: '#ff6f00' }],
  };

  const topProducts = [
    { id: 1, name: 'Pizza Margherita', price: 150000, quantity: 2, image: null },
    { id: 2, name: 'Cà phê sữa đá', price: 30000, quantity: 1, image: null },
    // Thêm dữ liệu để kiểm tra overflow
    { id: 3, name: 'Trà sữa trân châu', price: 45000, quantity: 3, image: null },
    { id: 4, name: 'Bánh mì pate', price: 25000, quantity: 5, image: null },
    { id: 5, name: 'Nước cam ép', price: 35000, quantity: 2, image: null },
    { id: 6, name: 'Phở bò', price: 60000, quantity: 1, image: null },
  ];

  return (
    <div className="statistics-container">
      <h2>Thống kê bán hàng</h2>
      <div className="charts-section">
        <div className="chart-box">
          <h3>Biểu đồ doanh thu</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart-box">
          <h3>Doanh thu theo ngày</h3>
          <Line data={lineData} />
        </div>
        <div className="chart-box">
          <div className="top-products-section">
            <h3>Các món bán chạy nhất</h3>
            <ul className="top-products-list">
              {topProducts.map((item) => (
                <li key={item.id} className="top-product-item">
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    className="top-product-image"
                  />
                  <div className="top-product-details">
                    <span className="top-product-name">{item.name}</span>
                    <span className="top-product-price">{item.price.toLocaleString()} VND</span>
                  </div>
                  <span className="top-product-quantity">{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;