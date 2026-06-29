import React, { useState, useEffect, useRef } from 'react';

export default function CartForm({ onSubmit, editItem, onCancelEdit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  // populate form when editing
  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setPrice(editItem.price.toString());
      setErrors({});
      // autofocus name input
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    } else {
      setName('');
      setPrice('');
      setErrors({});
    }
  }, [editItem]);

  const validate = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Item name is required.';
    } else if (name.trim().length > 30) {
      newErrors.name = 'Item name must be 30 characters or less.';
    }

    const priceNum = parseFloat(price);
    if (!price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(priceNum)) {
      newErrors.price = 'Price must be a valid number.';
    } else if (priceNum <= 0) {
      newErrors.price = 'Price must be greater than ₹0.00.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      price: parseFloat(price),
    });

    // clear if adding new item
    if (!editItem) {
      setName('');
      setPrice('');
      setErrors({});
    }
  };

  const handleCancel = () => {
    setName('');
    setPrice('');
    setErrors({});
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="itemName">Item Name</label>
        <input
          id="itemName"
          ref={nameInputRef}
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          placeholder="e.g. Mechanical Keyboard"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
          }}
          required
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="itemPrice">Price (INR)</label>
        <input
          id="itemPrice"
          type="number"
          step="0.01"
          min="0.01"
          className={`form-control ${errors.price ? 'is-invalid' : ''}`}
          placeholder="0.00"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
          }}
          required
        />
        {errors.price && <span className="error-text">{errors.price}</span>}
      </div>

      <div className="form-actions">
        {editItem ? (
          <>
            <button type="submit" className="btn btn-primary" id="btn-update">
              Update Item
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              id="btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <button type="submit" className="btn btn-primary" id="btn-add">
            Add to Cart
          </button>
        )}
      </div>
    </form>
  );
}
