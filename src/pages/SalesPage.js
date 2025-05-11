import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDrinks, createOrder } from '../api/api';
import Header from '../components/Sales/Header';
import ProductList from '../components/Sales/ProductList';
import Cart from '../components/Sales/Cart';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SalesPage = () => {
  const { tableId } = useParams();
  const [drinks, setDrinks] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const drinksData = await getDrinks();
        console.log(drinksData);
        setDrinks(drinksData);
      } catch (err) {
        setError('Không thể tải dữ liệu: ' + (err.message || 'Lỗi máy chủ'));
        toast.error('Không thể tải danh sách sản phẩm!');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${tableId}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [tableId]);

  useEffect(() => {
    localStorage.setItem(`cart-${tableId}`, JSON.stringify(cartItems));
  }, [cartItems, tableId]);

  const filteredDrinks = drinks.filter((drink) => {
    if (category === 'all') return true;
    return drink.category === category;
  });

const addToCart = (product) => {
  setCartItems((prevItems) => {
    const existingItem = prevItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Kiểm tra nếu số lượng mới vượt quá remaining
      if (existingItem.quantity + 1 > (product.remaining || 0)) {
        toast.error(`Số lượng vượt quá tồn kho (${product.remaining} sản phẩm)`, {
          toastId: `add-to-cart-exceed-${product.id}`,
        });
        return prevItems; // Không tăng số lượng
      }
      // Tăng số lượng nếu hợp lệ
      return prevItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }

    // Thêm sản phẩm mới với quantity = 1 và lưu remaining
    return [...prevItems, { ...product, quantity: 1, remaining: product.remaining }];
  });
};

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống!');
      setError('Giỏ hàng trống');
      return;
    }

    try {
      const orderData = {
        tableId: tableId,
        orderItems: cartItems.map((item) => ({
          drinkId: parseInt(item.id),
          quantity: parseInt(item.quantity),
        })),
      };
      console.log(orderData);
      await createOrder(orderData);

      toast.success('Đặt món thành công!');
      setCartItems([]);
      localStorage.removeItem(`cart-${tableId}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi máy chủ';
      setError('Không thể tạo đơn hàng: ' + errorMessage);
      toast.error('Không thể tạo đơn hàng: ' + errorMessage);
    }
  };

  return (
    <div className="sales-page">
      <Header />
      <div className="sales-content">
        <div className="sales-main">
          {error && <p className="error-message">{error}</p>}
          <ProductList products={filteredDrinks} addToCart={addToCart} />
          <Cart cartItems={cartItems} setCartItems={setCartItems} handleCheckout={handleCheckout} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default SalesPage;