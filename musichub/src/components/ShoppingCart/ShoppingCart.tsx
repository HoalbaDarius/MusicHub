// src/components/ShoppingCart/ShoppingCart.tsx
import React from 'react';
import { useCart, CartItem } from '../../context/CartContext'; // Adjust path if needed
import { Trash2, Plus, Minus } from 'lucide-react';
import './ShoppingCart.css'; // Create this CSS file next

interface ShoppingCartProps {
    // Function to navigate to other pages (passed from App.tsx)
    onNavigate: (page: 'main' | 'events' | 'cart') => void;
}

// Helper to format currency (consider moving to a utils file if used elsewhere)
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD' // Adjust currency code if needed
    }).format(amount);
};

// Helper function to parse price string (e.g., "$24.99") to number
const parsePrice = (priceString: string): number => {
    const numericString = priceString.replace(/[^0-9.]/g, '');
    const price = parseFloat(numericString);
    return isNaN(price) ? 0 : price;
};


const ShoppingCart: React.FC<ShoppingCartProps> = ({ onNavigate }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount // Use if needed, e.g., for summary or checkout button text
  } = useCart();

  const totalAmount = getCartTotal();
  const itemCount = getCartItemCount(); // Get the total count for display

  // Placeholder function for handling the purchase action
  const handlePurchase = () => {
      if (itemCount <= 0) return; // Don't proceed if cart is empty
      // In a real app, this would redirect to a checkout page or integrate with a payment gateway
      alert(`Proceeding to checkout with ${itemCount} item(s) for a total of ${formatCurrency(totalAmount)}. (Checkout functionality not implemented)`);
      // Optionally clear the cart after initiating "purchase"
      // clearCart();
      // Optionally navigate to a confirmation page or back home
      // onNavigate('main');
  };

   // Handler for changing quantity via buttons
   const handleQuantityChange = (cartItemId: string, change: number) => {
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity >= 1) {
            updateQuantity(cartItemId, newQuantity);
        } else {
            // Optional: automatically remove if quantity drops below 1,
            // or rely on the updateQuantity logic to keep it at 1.
            // removeFromCart(cartItemId);
        }
    }
};

  return (
    // Use content-section for consistent padding/margins if defined globally
    <div className="shopping-cart-page content-section">
      <h1 className="cart-title">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is currently empty.</p>
          <button onClick={() => onNavigate('main')} className="btn btn-primary shop-now-btn">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          {/* Cart Items List */}
          <ul className="cart-items-list">
            {cartItems.map((item) => {
              const itemPrice = parsePrice(item.price);
              const itemSubtotal = itemPrice * item.quantity;

              return (
                <li key={item.cartItemId} className="cart-item">
                  <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h2 className="cart-item-title">{item.title}</h2>
                    {/* Display selected options if they exist */}
                    <div className="cart-item-options">
                      {item.selectedVariant && <span>Variant: {item.selectedVariant}</span>}
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && (
                          <span>Color: {item.selectedColor}
                           {/* Optional: Show color swatch */}
                           <span className="cart-item-color-swatch" style={{ backgroundColor: item.selectedColor.toLowerCase() }}></span>
                          </span>
                        )}
                    </div>
                    <p className="cart-item-price">Unit Price: {formatCurrency(itemPrice)}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <label htmlFor={`qty-${item.cartItemId}`} className="sr-only">Quantity</label>
                     <div className="quantity-controls cart-quantity-controls">
                        <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.cartItemId, -1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        >-</button>
                        <input
                            id={`qty-${item.cartItemId}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.cartItemId, parseInt(e.target.value) || 1)}
                            className="quantity-input cart-quantity-input"
                            aria-label="Item quantity"
                         />
                        <button
                         className="quantity-btn"
                         onClick={() => handleQuantityChange(item.cartItemId, 1)}
                         aria-label="Increase quantity"
                        >+</button>
                     </div>
                  </div>
                  <div className="cart-item-subtotal">
                    Subtotal: {formatCurrency(itemSubtotal)}
                  </div>
                  <div className="cart-item-remove">
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="remove-item-btn"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Cart Summary and Actions */}
          <div className="cart-summary">
            <div className="cart-total">
              <strong>Total ({itemCount} item{itemCount !== 1 ? 's' : ''}): {formatCurrency(totalAmount)}</strong>
            </div>
            <div className="cart-actions">
              <button onClick={clearCart} className="btn btn-secondary clear-cart-btn">
                Clear Cart
              </button>
              <button onClick={handlePurchase} className="btn btn-primary purchase-btn" disabled={itemCount <= 0}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;