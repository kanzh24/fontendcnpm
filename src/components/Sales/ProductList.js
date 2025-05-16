import React, { useEffect, useState } from 'react';
import { remaining } from '../../api/api';

const ProductList = ({ products, addToCart }) => {
  const [stockData, setStockData] = useState({});

  // Fetch remaining stock for all products
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const productIds = products.map((product) => product.id);
        // Assuming `remaining` API accepts a product ID and returns { drinkId, drinkName, availableQuantity }
        const stock = await Promise.all(
          productIds.map((id) => remaining(id)) // Adjust if API uses orderId or other identifier
        );
        // Map stock data to product IDs, extracting availableQuantity
        const stockMap = stock.reduce((acc, curr, index) => {
          acc[productIds[index]] = curr.availableQuantity ?? 0; // Use availableQuantity or fallback to 0
          return acc;
        }, {});
        setStockData(stockMap);
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    };

    if (products.length > 0) {
      fetchStock();
    }
  }, [products]);

  return (
    <div className="product-list-container">
      <div className="product-grid">
        {products.map((product) => {
          // Use API-fetched stock (availableQuantity) or fallback to product.remaining
          const remainingStock = stockData[product.id] ?? product.remaining ?? 0;
          const isOutOfStock = remainingStock <= 0;

          return (
            <div key={product.id} className="product-item">
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <h4 style={{ color: isOutOfStock ? 'red' : 'inherit' }}>
                Remaining: {remainingStock}
              </h4>
              <p>{Number(product.price).toLocaleString('vi-VN')} VND</p>
              <button
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
                style={{
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                }}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;