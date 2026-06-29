import React, { useState } from 'react';

const CATALOG_PRODUCTS = [
  {
    id: 'cat-1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    category: 'Audio',
    image: '/products/headphones.png',
    description: 'Active noise-canceling headphones with high-fidelity sound and 40h battery life.',
    color: 'var(--accent-color)'
  },
  {
    id: 'cat-2',
    name: 'Ergonomic Mechanical Keyboard',
    price: 129.50,
    category: 'Peripherals',
    image: '/products/keyboard.png',
    description: 'Hot-swappable mechanical keyboard with custom switches and RGB backlighting.',
    color: '#3b82f6'
  },
  {
    id: 'cat-3',
    name: 'Ultra-Wide Gaming Monitor 34"',
    price: 449.99,
    category: 'Displays',
    image: '/products/monitor.png',
    description: 'Curved QHD display with 144Hz refresh rate and HDR support for immersive gaming.',
    color: '#10b981'
  },
  {
    id: 'cat-4',
    name: 'Smart Fitness Watch',
    price: 249.00,
    category: 'Wearables',
    image: '/products/smartwatch.png',
    description: 'Advanced health tracking, built-in GPS, and up to 7 days of battery life.',
    color: '#f59e0b'
  },
  {
    id: 'cat-5',
    name: 'Noise Cancelling Earbuds',
    price: 159.00,
    category: 'Audio',
    image: '/products/earbuds.png',
    description: 'True wireless earbuds with customizable fit and smart touch controls.',
    color: '#ec4899'
  },
  {
    id: 'cat-6',
    name: 'Professional USB Microphone',
    price: 119.00,
    category: 'Audio',
    image: '/products/microphone.png',
    description: 'Studio-quality condenser microphone for streaming, podcasting, and recording.',
    color: '#8b5cf6'
  },
  {
    id: 'cat-7',
    name: 'Portable SSD 2TB',
    price: 179.99,
    category: 'Storage',
    image: '/products/ssd.png',
    description: 'Ultra-fast read/write speeds up to 1050MB/s in a rugged, compact design.',
    color: '#06b6d4'
  },
  {
    id: 'cat-8',
    name: 'Ergonomic Office Chair',
    price: 349.50,
    category: 'Furniture',
    image: '/products/chair.png',
    description: 'High-back mesh chair with adjustable lumbar support, 3D armrests, and tilt control.',
    color: '#14b8a6'
  }
];

export default function ProductCatalog({ onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // get categories
  const categories = ['All', ...new Set(CATALOG_PRODUCTS.map(p => p.category))];

  // filter search results
  const filteredProducts = CATALOG_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h2 className="catalog-title">Product Catalog</h2>
        <p className="catalog-subtitle">Choose from our curated collection of premium accessories</p>
      </div>

      {/* filters */}
      <div className="catalog-controls">
        <div className="search-box">
          <svg
            className="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              className={`btn btn-filter ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" role="img" aria-label="No products">🔍</span>
          <h3>No products found</h3>
          <p>Try adjusting your search or category filters.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card glass-card">
              <div className="product-visual animate-glow" style={{ '--accent-color-card': product.color }}>
                <img src={product.image} alt={product.name} className="product-image" />
                <span className="product-category-badge" style={{ backgroundColor: `${product.color}20`, color: product.color, border: `1px solid ${product.color}40` }}>
                  {product.category}
                </span>
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">{formatCurrency(product.price)}</span>
                  <button
                    type="button"
                    className="btn btn-primary btn-add-to-cart"
                    onClick={() => onAddToCart(product)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
