import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { getRevenueStatistics, getProductStatistics, getDashboardStatistics, deleteStockImport } from '../../api/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const fallbackImage = require(`../../assets/images/image01.jpg`);

const Statistics = () => {
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState({
    averageOrderValue: 0,
    totalOrders: 0,
    totalRevenue: 0,
    dailyRevenue: [],
  });
  const [productsData, setProductsData] = useState([]);
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [{ label: 'Doanh thu theo ngày', data: [], fill: false, borderColor: '#ff6f00' }],
  });
  const [filterType, setFilterType] = useState('dashboard');
  const [customDateRange, setCustomDateRange] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [totalSold, setTotalSold] = useState(0);

  // Load thống kê mặc định khi component mount
  useEffect(() => {
    fetchStatistics();
  }, [filterType, customDateRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      let statsResponse, productsResponse;

      // Thống kê mặc định (dashboard)
      if (filterType === 'dashboard') {
        const dashboardData = await getDashboardStatistics();
        statsResponse = {
          averageOrderValue: dashboardData.revenue.averageOrderValue,
          totalOrders: dashboardData.revenue.totalOrders,
          totalRevenue: dashboardData.revenue.totalRevenue,
          dailyRevenue: dashboardData.dailyRevenue,
        };
        productsResponse = dashboardData.products.topSellingProducts || [];
        // console.log(dashboardData)
        
        // Dùng totalSold từ API thay vì tính lại từ topSellingProducts
        setTotalSold(dashboardData.revenue.totalOrders || 0);
      } else {
        // Thống kê theo bộ lọc (ngày, tuần, tháng, tùy chỉnh)
        const params = { dateType: filterType };
        if (filterType === 'custom') {
          params.startDate = customDateRange.startDate;
          params.endDate = customDateRange.endDate;
        }
        statsResponse = await getRevenueStatistics(params);
        let getProduct = await getProductStatistics({ dateType: filterType === 'custom' ? 'week' : filterType }) || [];
        productsResponse = getProduct.products
        // console.log(productsResponse)
        // Tính tổng số lượng sản phẩm bán ra nếu không có totalSold từ API
        const totalSoldCount = statsResponse.totalOrders;
        setTotalSold(totalSoldCount);
      }

      // Cập nhật thông tin tổng quan
      setStatsData({
        averageOrderValue: statsResponse.averageOrderValue || 0,
        totalOrders: statsResponse.totalOrders || 0,
        totalRevenue: statsResponse.totalRevenue || 0,
        dailyRevenue: statsResponse.dailyRevenue || [],
      });

      // Cập nhật biểu đồ đường (doanh thu theo ngày)
      setLineData({
        labels: statsResponse.dailyRevenue.map((day) => day.date),
        datasets: [
          {
            label: 'Doanh thu theo ngày',
            data: statsResponse.dailyRevenue.map((day) => day.revenue),
            fill: false,
            borderColor: '#ff6f00',
          },
        ],
      });

      // Cập nhật danh sách sản phẩm bán chạy
      setProductsData(productsResponse);
    } catch (err) {
      setError('Failed to load statistics: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type !== 'custom') {
      setCustomDateRange({ startDate: '', endDate: '' });
    }
  };

  // Xử lý thay đổi khoảng thời gian tùy chỉnh
  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý áp dụng bộ lọc tùy chỉnh
  const applyCustomFilter = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      setFilterType('custom');
    } else {
      setError('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
    }
  };

  return (
    <div className="statistics-container">
      <h2>Thống kê bán hàng</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Bộ lọc */}
      <div className="filter-section">
        <button
          className={`filter-button ${filterType === 'day' ? 'active' : ''}`}
          onClick={() => handleFilterChange('day')}
        >
          Theo ngày
        </button>
        <button
          className={`filter-button ${filterType === 'week' ? 'active' : ''}`}
          onClick={() => handleFilterChange('week')}
        >
          Theo tuần
        </button>
        <button
          className={`filter-button ${filterType === 'month' ? 'active' : ''}`}
          onClick={() => handleFilterChange('month')}
        >
          Theo tháng
        </button>
        <button
          className={`filter-button ${filterType === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleFilterChange('dashboard')}
        >
          Mặc định
        </button>
        <div className="custom-date-filter">
          <input
            type="date"
            name="startDate"
            value={customDateRange.startDate}
            onChange={handleCustomDateChange}
            placeholder="Ngày bắt đầu"
          />
          <input
            type="date"
            name="endDate"
            value={customDateRange.endDate}
            onChange={handleCustomDateChange}
            placeholder="Ngày kết thúc"
          />
          <button className="apply-custom-button" onClick={applyCustomFilter}>
            Áp dụng
          </button>
        </div>
      </div>

      {/* Nội dung thống kê */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="charts-section">
          {/* Cột 1: Tổng quan */}
          <div className="chart-box">
            <h3>Tổng quan</h3>
            <div className="overview-item">
              <p><strong>Tổng doanh thu:</strong> {statsData.totalRevenue.toLocaleString()} VND</p>
            </div>
            <div className="overview-item">
              <p><strong>Doanh thu trung bình:</strong> {statsData.averageOrderValue.toLocaleString()} VND</p>
            </div>
            <div className="overview-item">
              <p><strong>Số lượng sản phẩm bán ra:</strong> {totalSold}</p>
            </div>
          </div>

          {/* Cột 2: Doanh thu theo ngày */}
          <div className="chart-box">
            <h3>Doanh thu theo ngày</h3>
            <Line data={lineData} />
          </div>

          {/* Cột 3: Top sản phẩm bán chạy */}
          <div className="chart-box">
            <div className="top-products-section">
              <h3>Các món bán chạy nhất</h3>
              <ul className="top-products-list">
                {productsData.length > 0 ? (
                  productsData.map((item) => (
                    <li key={item.id} className="top-product-item">
                      <img
                        src={item.image_url || fallbackImage}
                        alt={item.name}
                        className="top-product-image"
                      />
                      <div className="top-product-details">
                        <span className="top-product-name">{item.name}</span>
                        <span className="top-product-price">{parseFloat(item.price).toLocaleString()} VND</span>
                      </div>
                      <span className="top-product-quantity">{item.soldCount}</span>
                    </li>
                  ))
                ) : (
                  <p>Không có sản phẩm nào.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;