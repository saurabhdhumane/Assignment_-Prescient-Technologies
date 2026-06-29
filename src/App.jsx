import React, { useState, useEffect } from 'react';
import CartItem from './components/CartItem';
import CartForm from './components/CartForm';
import Toast from './components/Toast';
import ProductCatalog from './components/ProductCatalog';
import './App.css';

// default items
const INITIAL_CART = [
  { id: '1', name: 'Premium Wireless Headphones', price: 199.99 },
  { id: '2', name: 'Ergonomic Mechanical Keyboard', price: 129.50 },
  { id: '3', name: 'Ultra-Wide Gaming Monitor 34"', price: 449.99 }
];

function App() {
  // load cart state
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('swiftcart_items');
    return savedCart ? JSON.parse(savedCart) : INITIAL_CART;
  });

  const [activeTab, setActiveTab] = useState('cart');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [toasts, setToasts] = useState([]);

  // sync to local storage
  useEffect(() => {
    localStorage.setItem('swiftcart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // show alerts
  const showToast = (message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // submit (handles both add/edit)
  const handleFormSubmit = (data) => {
    if (editingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? { ...item, name: data.name, price: data.price } : item
        )
      );
      showToast(`Updated "${data.name}" in your cart.`, 'success');
      setEditingItem(null);
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: data.name,
        price: data.price,
      };
      setCartItems((prevItems) => [newItem, ...prevItems]);
      showToast(`Added "${data.name}" to your cart.`, 'success');
    }
  };

  // edit item
  const handleEditSelect = (item) => {
    setEditingItem(item);
    setShowForm(true);
    showToast(`Editing "${item.name}"...`, 'info');
  };

  // cancel edit
  const handleCancelEdit = () => {
    setEditingItem(null);
    showToast('Editing cancelled.', 'info');
  };

  // delete item
  const handleRemoveItem = (id) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    if (!itemToRemove) return;

    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
    }

    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    showToast(`Removed "${itemToRemove.name}" from cart.`, 'danger');
  };

  // add catalog item to cart
  const handleAddToCart = (product) => {
    const newItem = {
      id: Date.now().toString(),
      name: product.name,
      price: product.price,
    };
    setCartItems((prevItems) => [newItem, ...prevItems]);
    showToast(`Added "${product.name}" to your cart.`, 'success');
  };

  // order calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15.00;
  const total = subtotal + tax + shipping;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="app-container">
      {/* toasts */}
      <Toast toasts={toasts} onRemoveToast={removeToast} />

      {/* header */}
      <header className="app-header">
        <div className="logo-container">
          <span className="logo-icon">🛒</span>
          <h1 className="logo-text">SwiftCart</h1>
        </div>
        <div className="cart-badge" id="cart-badge-summary">
          <span>Cart Summary</span>
          <strong>({cartItems.length} items)</strong>
        </div>
      </header>

      {/* tabs navigation */}
      <nav className="app-nav">
        <button
          type="button"
          className={`nav-tab ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          <span>🛒</span> Cart Dashboard
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <span>📦</span> Products Catalog
        </button>
      </nav>

      {/* dashboard content */}
      {activeTab === 'cart' ? (
        <main className="dashboard-grid">
          
          {/* shopping cart */}
          <section className="glass-card" aria-label="Shopping Cart">
            <div className="card-title">
              <span>Shopping Cart</span>
              <button 
                type="button" 
                className="btn btn-secondary"
                id="btn-toggle-add-form"
                onClick={() => {
                  setShowForm(!showForm);
                  if (editingItem) setEditingItem(null);
                }}
              >
                {showForm ? 'Hide Form' : 'Add Item'}
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon" role="img" aria-label="Empty cart">🛍️</span>
                  <h3>Your cart is empty</h3>
                  <p>Add some items on the right to get started, or browse our catalog!</p>
                  <div className="empty-state-action">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setActiveTab('catalog')}
                    >
                      Browse Products Catalog
                    </button>
                  </div>
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onEdit={handleEditSelect}
                    onRemove={handleRemoveItem}
                    isEditing={editingItem?.id === item.id}
                  />
                ))
              )}
            </div>

            {/* cost summary */}
            {cartItems.length > 0 && (
              <div className="summary-card">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Tax (8%):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
                <div className="summary-row total">
                  <span>Order Total:</span>
                  <span className="total-price" id="cart-total-price">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* edit/add form panel */}
          {showForm && (
            <section className="glass-card" id="form-container" aria-label={editingItem ? 'Edit Item Form' : 'Add Item Form'}>
              <h2 className="card-title" id="form-title">
                {editingItem ? 'Edit Cart Item' : 'Add New Item'}
              </h2>
              <CartForm
                onSubmit={handleFormSubmit}
                editItem={editingItem}
                onCancelEdit={handleCancelEdit}
              />
            </section>
          )}

        </main>
      ) : (
        <ProductCatalog onAddToCart={handleAddToCart} />
      )}
    </div>
  );
}

export default App;
