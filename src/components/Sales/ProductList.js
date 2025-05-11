import React from 'react';

const ProductList = ({ products, addToCart }) => {
  return (
    <div className="product-list-container">
      <div className="product-grid">
        {products.map((product) => {
          const isOutOfStock = (product.remaining || product.soldCount || 0) <= 0; // Check if remaining is 0 or less
          return (
            <div key={product.id} className="product-item">
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <h4 style={{ color: isOutOfStock ? 'red' : 'inherit' }}>
                Remaining {product.remaining || product.soldCount || 0}
              </h4>
              <p>{Number(product.price).toLocaleString('vi-VN')} VND</p>              <button
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