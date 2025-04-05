import React, { useState } from 'react';
import './MerchModal.css';
import { X } from 'lucide-react';

export interface MerchItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  type: 'merch';
  sizes?: string[]; // Optional sizes for clothing items
  colors?: string[]; // Optional colors
  variants?: string[]; // Other optional variants
}

interface MerchModalProps {
  item: MerchItem;
  isOpen: boolean;
  onClose: () => void;
}

const MerchModal: React.FC<MerchModalProps> = ({ item, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    item.sizes && item.sizes.length > 0 ? item.sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    item.colors && item.colors.length > 0 ? item.colors[0] : null
  );
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    item.variants && item.variants.length > 0 ? item.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    // In a real app, this would add the item to a cart state/context
    console.log('Added to cart:', {
      ...item,
      selectedSize,
      selectedColor,
      selectedVariant,
      quantity
    });
    
    // Show confirmation and close modal
    alert(`Added ${item.title} to cart!`);
    onClose();
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal when clicking outside (on the backdrop)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isClothing = item.sizes && item.sizes.length > 0;
  const hasVariants = item.variants && item.variants.length > 0;

  return (
    <div className="merch-modal-backdrop" onClick={handleBackdropClick}>
      <div className="merch-modal-content">
        <button className="merch-modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="merch-modal-grid">
          <div className="merch-modal-image-container">
            <img src={item.imageUrl} alt={item.title} className="merch-modal-image" />
          </div>
          
          <div className="merch-modal-details">
            <h2 className="merch-modal-title">{item.title}</h2>
            <p className="merch-modal-price">{item.price}</p>
            <p className="merch-modal-description">{item.description}</p>
            
            {hasVariants && (
              <div className="merch-modal-options">
                <label className="option-label">Variant:</label>
                <div className="variant-options">
                  {item.variants?.map(variant => (
                    <button
                      key={variant}
                      className={`variant-option ${selectedVariant === variant ? 'selected' : ''}`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {isClothing && (
              <div className="merch-modal-options">
                <label className="option-label">Size:</label>
                <div className="size-options">
                  {item.sizes?.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {item.colors && item.colors.length > 0 && (
              <div className="merch-modal-options">
                <label className="option-label">Color:</label>
                <div className="color-options">
                  {item.colors.map(color => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="merch-modal-quantity">
              <label htmlFor="quantity" className="option-label">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >-</button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                />
                <button 
                  className="quantity-btn" 
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>
            
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchModal;