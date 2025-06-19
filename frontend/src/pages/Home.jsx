import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import authStore from "../store/store.js";

function Home() {
  const currentUser = authStore((state) => state.currentUser);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        // Get only the first 6 products for the home page
        setProducts(response.data.slice(0, 6));
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Clothzy Store</h1>
            <p className="hero-description">
              Discover amazing products at great prices. Shop now and enjoy our
              wide selection of items.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="hero-button primary">
                Shop Now
              </Link>
              <Link to="/products" className="hero-button secondary">
                View Collection
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://chlothzy.shop/assets/hero_img-uMuzwHEB.png" alt="Clothzy Hero" />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="featured-products-container">
          <h2 className="section-title">All Products</h2>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
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
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-overlay">
                      <Link to={`/product/${product._id}`} className="product-action-button view-cart">
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name" style={{fontSize: '1.2rem'}}>{product.name}</h3>
                    <p className="product-description" style={{fontSize: '.8rem'}}>{product.description}</p>
                    <div className="product-meta">
                      <span className="product-price" style={{fontSize: '1rem',color: 'black'}} >${product.price}</span>
                      {product.stock > 0 && (
                        <span className="product-stock" style={{fontSize: '.8rem'}}>In Stock: {product.stock}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
         
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Quality Products</h3>
              <p className="feature-description">
                We offer only the best quality products for our customers.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">
                Quick and reliable delivery to your doorstep.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Easy Shopping</h3>
              <p className="feature-description">
                Simple and secure shopping experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="categories-container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products" className="category-card">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1adWTqo23A94wcByxX7EO0v0801VvjUO4TuJAcKaPdeKXH11RvU5YXOqJxWal_S62xE0&usqp=CAU"
                alt="Category 1"
              />
              <div className="category-content">
                <h3>New Arrivals</h3>
                <span>Shop Now</span>
              </div>
            </Link>
            <Link to="/products" className="category-card">
              <img
                src="https://hips.hearstapps.com/hmg-prod/images/pritika-swarup-wearing-a-brown-blusa-white-shoes-and-black-news-photo-1672741251.jpg?crop=0.668xw:1.00xh;0,0&resize=640:*"
                alt="Category 2"
              />
              <div className="category-content">
                <h3>Best Sellers</h3>
                <span>Shop Now</span>
              </div>
            </Link>
            <Link to="/products" className="category-card">
              <img
                src="https://southernscholar.com/cdn/shop/articles/Men_s-Summer-Fashion-613288.jpg?v=1708105317&width=1100"
                alt="Category 3"
              />
              <div className="category-content">
                <h3>Special Offers</h3>
                <span>Shop Now</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
