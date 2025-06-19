import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import { cartStore } from "../store/store.js";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const cartCount = cartStore((state) => state.cartCount);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        
        // Fetch related products (same category)
        const relatedResponse = await axios.get(`http://localhost:5000/api/products`);
        const related = relatedResponse.data
          .filter(p => p.category === response.data.category && p._id !== response.data._id)
          .slice(0, 4); // Show up to 4 related products
        setRelatedProducts(related);
        
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch cart items on mount and when cartCount changes
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cart', { withCredentials: true });
        const items = response.data.items.map(item => ({
          id: item._id,
          productId: item.product?._id,
          quantity: item.quantity,
        }));
        setCartItems(items);
      } catch {
        setCartItems([]);
      }
    };
    fetchCart();
  }, [cartCount]);

  const handleAddToCart = async () => {
    setCartMessage('');
    try {
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId: id, quantity },
        { withCredentials: true }
      );
      setCartMessage('Product added to cart!');
      cartStore.getState().fetchAndSetCartCount();
      setTimeout(() => setCartMessage(''), 2000);
    } catch (err) {
      const msg = err.response?.data?.message === 'Authentication required'
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

  if (error || !product) {
    return <div className="error-message">{error || 'Product not found'}</div>;
  }

  // Check if this product is in the cart
  const isInCart = cartItems.some(item => item.productId === id);

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="product-detail-image" />
        </div>
        
        <div className="product-info-section">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <div className="product-price">${product.price}</div>
          
          <div className="product-meta">
            <span className="product-stock">
              {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
            </span>
            <span className="product-category">Category: {product.category}</span>
          </div>

          {product.stock > 0 && (
            <div className="add-to-cart-section">
              {isInCart ? (
                <Link to="/cart" className="add-to-cart-button">View in Cart</Link>
              ) : (
                <>
                  <div className="quantity-selector">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button 
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                  {cartMessage && <div className="cart-message">{cartMessage}</div>}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="related-product-card">
                <Link to={`/product/${relatedProduct._id}`}>
                  <div className="related-product-image-wrapper">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="related-product-image"
                    />
                  </div>
                  <div className="related-product-info">
                    <h3>{relatedProduct.name}</h3>
                    <p className="related-product-price">${relatedProduct.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail; 