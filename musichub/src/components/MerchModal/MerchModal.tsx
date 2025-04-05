// src/components/MerchModal/MerchModal.tsx
import React, { useState, useEffect } from 'react';
import './MerchModal.css'; // Ensure CSS is imported
import { X } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Import useCart hook

// Define the interface for a merchandise item
export interface MerchItem {
  id: string;          // Unique product ID
  title: string;
  description: string;
  imageUrl: string;
  price: string;       // Price as string (e.g., "$24.99")
  type: 'merch';       // Item type identifier
  sizes?: string[];    // Optional sizes
  colors?: string[];   // Optional colors
  variants?: string[]; // Optional variants
}

// Props for the MerchModal component
interface MerchModalProps {
  item: MerchItem;     // The merch item to display
  isOpen: boolean;     // Controls modal visibility
  onClose: () => void; // Function to call when closing the modal
}

const MerchModal: React.FC<MerchModalProps> = ({ item, isOpen, onClose }) => {
  // Use the cart context to get the addToCart function
  const { addToCart } = useCart();

  // State for selected options and quantity
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Effect to reset selections when the item changes or modal opens/closes
  useEffect(() => {
    if (isOpen && item) {
        // Set defaults when modal opens with a new item
        setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0] : null);
        setSelectedColor(item.colors && item.colors.length > 0 ? item.colors[0] : null);
        setSelectedVariant(item.variants && item.variants.length > 0 ? item.variants[0] : null);
        setQuantity(1); // Reset quantity
    }
    // No need to clear state on close if defaults are set on open
  }, [isOpen, item]); // Depend on isOpen and item

  // Don't render the modal if it's not open
  if (!isOpen || !item) return null;

  // Handler for the "Add to Cart" button
  const handleAddToCartClick = () => {
    // Call the addToCart function from the context
    addToCart(item, quantity, {
        size: selectedSize,
        color: selectedColor,
        variant: selectedVariant
    });

    // Provide user feedback (can be replaced with a toast notification)
    alert(`${quantity} x ${item.title} added to your cart!`);

    onClose(); // Close the modal after adding the item
  };

  // Handler for quantity input changes
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    // Update quantity, ensuring it's at least 1 and a valid number
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
  };

    // Handler for quantity increment/decrement buttons
    const changeQuantity = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };


  // Handler for clicks on the modal backdrop (to close the modal)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click target is the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Determine if options are available
  const hasSizes = item.sizes && item.sizes.length > 0;
  const hasColors = item.colors && item.colors.length > 0;
  const hasVariants = item.variants && item.variants.length > 0;

  return (
    <div className="merch-modal-backdrop" onClick={handleBackdropClick}>
      <div className="merch-modal-content" role="dialog" aria-modal="true" aria-labelledby="merch-modal-title">
        {/* Close Button */}
        <button className="merch-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="merch-modal-grid">
          {/* Image Column */}
          <div className="merch-modal-image-container">
            <img src={item.imageUrl} alt={item.title} className="merch-modal-image" />
          </div>

          {/* Details Column */}
          <div className="merch-modal-details">
            <h2 id="merch-modal-title" className="merch-modal-title">{item.title}</h2>
            <p className="merch-modal-price">{item.price}</p>
            <p className="merch-modal-description">{item.description}</p>

            {/* Variant Selector */}
            {hasVariants && (
              <div className="merch-modal-options">
                <label className="option-label" htmlFor={`variant-select-${item.id}`}>Variant:</label>
                <div className="variant-options" id={`variant-select-${item.id}`}>
                  {item.variants?.map(variant => (
                    <button
                      key={variant}
                      className={`variant-option ${selectedVariant === variant ? 'selected' : ''}`}
                      onClick={() => setSelectedVariant(variant)}
                      type="button"
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {hasSizes && (
              <div className="merch-modal-options">
                <label className="option-label" htmlFor={`size-select-${item.id}`}>Size:</label>
                <div className="size-options" id={`size-select-${item.id}`}>
                  {item.sizes?.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      type="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {hasColors && (
              <div className="merch-modal-options">
                <label className="option-label" htmlFor={`color-select-${item.id}`}>Color:</label>
                <div className="color-options" id={`color-select-${item.id}`}>
                  {item.colors?.map(color => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.toLowerCase() }} // Basic color swatch
                      title={color} // Tooltip for color name
                      aria-label={`Select color ${color}`}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="merch-modal-quantity">
              <label htmlFor={`quantity-${item.id}`} className="option-label">Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => changeQuantity(-1)}
                  aria-label="Decrease quantity"
                  type="button"
                  disabled={quantity <= 1} // Disable decrement if quantity is 1
                >-</button>
                <input
                  id={`quantity-${item.id}`}
                  type="number" // Use number input type
                  min="1"        // Minimum value
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                  aria-label="Item quantity"
                />
                <button
                  className="quantity-btn"
                  onClick={() => changeQuantity(1)}
                  aria-label="Increase quantity"
                  type="button"
                >+</button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="add-to-cart-btn" onClick={handleAddToCartClick} type="button">
              Add to Cart
            </button>
          </div> {/* End details column */}
        </div> {/* End grid */}
       {/* CORRECTED LINE BELOW */}
      </div> {/* End modal content */}
    </div> /* End backdrop */
  );
};

export default MerchModal;