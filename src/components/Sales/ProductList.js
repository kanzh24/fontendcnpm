import React, { useEffect, useState } from 'react';
import { remaining } from '../../api/api';

const ProductList = ({ products, addToCart }) => {
  const [stockData, setStockData] = useState({}); // State để lưu trữ số lượng tồn kho từ API
  const [selectedProduct, setSelectedProduct] = useState(null); // State cho modal chi tiết sản phẩm

  // Fetch remaining stock for all products
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const productIds = products.map((product) => product.id);
        // Gọi API remaining cho từng product ID
        const stock = await Promise.all(
          productIds.map((id) => remaining(id))
        );
        // Map dữ liệu tồn kho thành object { productId: availableQuantity }
        const stockMap = stock.reduce((acc, curr, index) => {
          acc[productIds[index]] = curr.availableQuantity ?? 0;
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

  // Hàm mở modal khi nhấp vào sản phẩm
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Hàm thêm vào giỏ hàng từ modal
  const handleAddToCartFromModal = (product, remainingStock) => {
    addToCart(product, remainingStock);
    closeModal();
  };

  // Hàm kiểm tra sản phẩm hết hàng
  const isOutOfStock = (product, remainingStock) =>
    (remainingStock ?? product.remaining ?? 0) <= 0;

  return (
    <div className="product-list-container">
      <div className="product-grid">
        {products.map((product) => {
          // Sử dụng số lượng tồn kho từ API hoặc fallback về product.remaining
          const remainingStock = stockData[product.id] ?? product.remaining ?? 0;
          const outOfStock = isOutOfStock(product, remainingStock);

          return (
            <div
              key={product.id}
              className="product-item"
              onClick={() => handleProductClick(product)}
            >
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <h4 style={{ color: outOfStock ? 'red' : 'inherit' }}>
                Remaining: {remainingStock}
              </h4>
              <p>{Number(product.price).toLocaleString('vi-VN')} VND</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                  if (!outOfStock) addToCart(product, remainingStock);
                }}
                disabled={outOfStock}
                style={{
                  opacity: outOfStock ? 0.5 : 1,
                  cursor: outOfStock ? 'not-allowed' : 'pointer',
                }}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal chi tiết sản phẩm */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
              ×
            </button>
            <img src={selectedProduct.image_url} alt={selectedProduct.name} />
            <h3>{selectedProduct.name}</h3>
            <h4>
              Remaining:{' '}
              {stockData[selectedProduct.id] ?? selectedProduct.remaining ?? 0}
            </h4>
            <p>
              Price: {Number(selectedProduct.price).toLocaleString('vi-VN')} VND
            </p>
            <button
              onClick={() =>
                handleAddToCartFromModal(
                  selectedProduct,
                  stockData[selectedProduct.id] ?? selectedProduct.remaining
                )
              }
              disabled={isOutOfStock(
                selectedProduct,
                stockData[selectedProduct.id] ?? selectedProduct.remaining
              )}
              style={{
                opacity: isOutOfStock(
                  selectedProduct,
                  stockData[selectedProduct.id] ?? selectedProduct.remaining
                )
                  ? 0.5
                  : 1,
                cursor: isOutOfStock(
                  selectedProduct,
                  stockData[selectedProduct.id] ?? selectedProduct.remaining
                )
                  ? 'not-allowed'
                  : 'pointer',
              }}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;