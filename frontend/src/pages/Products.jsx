import { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';
import { Link } from 'react-router-dom';
import { cartStore } from "../store/store.js";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', { withCredentials: true });
      const items = response.data.items.map(item => ({
        id: item._id,
        productId: item.product?._id,
        quantity: item.quantity,
      }));
      setCartItems(items);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCart();
  }, []);

  const handleAddToCart = async (productId) => {
    setCartMessage('');
    try {
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      setCartMessage('Product added to cart!');
      fetchCart();
      cartStore.getState().fetchAndSetCartCount();
      setTimeout(() => setCartMessage(''), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message === 'Authentication required'
          ? 'Please log in to add to cart.'
          : 'Failed to add to cart.';
      setCartMessage(msg);
      setTimeout(() => setCartMessage(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <div className="error-content">
            <div className="error-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="error-text">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <h2 className="products-title">Our Collection</h2>
        {cartMessage && (
          <div className="cart-message">
            <span className="cart-message-text">{cartMessage}</span>
          </div>
        )}
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`} className="product-link">
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name" style={{fontSize: '1.2rem'}}>{product.name}</h3>
                  <p className="product-description" style={{fontSize: '.8rem'}}>{product.description}</p>
                  <div className="product-meta">
                    <span className="product-price" style={{fontSize: '1rem',color: 'black'}}>${product.price}</span>
                    {product.stock > 0 && (
                      <span className="product-stock">In Stock: {product.stock}</span>
                    )}
                  </div>
                </div>
              </Link>
              <div className="product-overlay">
                {product.stock > 0 ? (
                  <>
                    <Link
                      to={`/product/${product._id}`}
                      className="product-action-button view-details"
                    >
                      View Details
                    </Link>
                    {cartItems.some(item => item.productId === product._id) ? (
                      <Link to="/cart" className="product-action-button view-cart">
                        View in Cart
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="product-action-button add-to-cart"
                      >
                        Add to Cart
                      </button>
                    )}
                  </>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products; 