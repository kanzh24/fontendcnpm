import React from 'react';
// import '../styles/ProductList.css';

const ProductList = ({ products, addToCart }) => {
  return (
    <div className="product-list-container">
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <h4>Remaining {product.soldCount}</h4>
            <p>{product.price.toLocaleString()} VND</p>
            <button onClick={() => addToCart(product)}>
              Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;