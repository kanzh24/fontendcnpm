import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDrinks } from '../api/api';
import Header from '../components/Sales/Header';
import SidebarSale from '../components/Sales/SideBarSale';
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
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const addToCart = (product, remaining) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity + 1 > (remaining || 0)) {
          toast.error(`Số lượng vượt quá tồn kho (${remaining} sản phẩm)`, {
            toastId: `add-to-cart-exceed-${product.id}`,
          });
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevItems, { ...product, quantity: 1, remaining: remaining }];
    });
    toast.success("Thêm vào giỏ hàng thành công")
  };

  return (
    <div className="sales-page">
      <Header isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      <div className="sales-content">
        <div className="sales-main">
          {error && <p className="error-message">{error}</p>}
          <ProductList products={filteredDrinks} addToCart={addToCart} />
          <Cart
            cartItems={cartItems}
            setCartItems={setCartItems}
            isOpen={isCartOpen}
            setIsOpen={setIsCartOpen}
          />
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