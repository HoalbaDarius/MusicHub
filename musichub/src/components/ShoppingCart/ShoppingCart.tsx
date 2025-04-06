// src/components/ShoppingCart/ShoppingCart.tsx
import React, { useState } from 'react';
import { useCart, CartItem } from '../../context/CartContext'; // Adjust path if needed
import { Trash2, Plus, Minus, X, CreditCard, User, Calendar, MapPin, Ticket, ShoppingBag } from 'lucide-react';
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
  
  // State for checkout modal
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Review Cart, 2: Payment details, 3: Confirmation
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Handle opening checkout modal
  const handlePurchase = () => {
    if (itemCount <= 0) return; // Don't proceed if cart is empty
    setIsCheckoutModalOpen(true);
    setCheckoutStep(1); // Reset to first step
  };

  // Close checkout modal and reset
  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    // Optionally reset state after animation completes
    setTimeout(() => {
      setCheckoutStep(1);
      setPaymentInfo({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      });
    }, 300);
  };

  // Handle step navigation
  const handleNextStep = () => {
    setCheckoutStep(checkoutStep + 1);
  };

  const handlePreviousStep = () => {
    setCheckoutStep(checkoutStep - 1);
  };

  // Handle payment form changes
  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process payment here
    handleNextStep();
  };

  // Handle complete purchase (final step)
  const handleCompletePurchase = () => {
    closeCheckoutModal();
    clearCart();
    onNavigate('main');
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

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="ticket-modal-overlay" onClick={closeCheckoutModal}>
          <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeCheckoutModal}>
              <X size={24} />
            </button>
            
            <div className="ticket-modal-header">
              <img src={cartItems[0]?.imageUrl || 'https://via.placeholder.com/600x200'} alt="Order" className="event-image" />
              <div className="event-info-header">
                <h2>Complete Your Purchase</h2>
                <p className="artist-name">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
              </div>
            </div>

            {/* Review Cart Step */}
            {checkoutStep === 1 && (
              <div className="ticket-selection-step">
                <div className="event-details-summary">
                  <div className="detail-item">
                    <ShoppingBag size={18} />
                    <span>{itemCount} Item{itemCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <h3>Order Summary</h3>
                <div className="checkout-items-summary">
                  {cartItems.map(item => {
                    const itemPrice = parsePrice(item.price);
                    const itemSubtotal = itemPrice * item.quantity;
                    
                    return (
                      <div key={item.cartItemId} className="checkout-item">
                        <img src={item.imageUrl} alt={item.title} className="checkout-item-image" />
                        <div className="checkout-item-details">
                          <h4>{item.title}</h4>
                          <div className="checkout-item-options">
                            {item.selectedVariant && <span>Variant: {item.selectedVariant}</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            {item.selectedColor && (
                              <span>Color: {item.selectedColor}</span>
                            )}
                            <span>Quantity: {item.quantity}</span>
                          </div>
                          <div className="checkout-item-price">{formatCurrency(itemSubtotal)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="ticket-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>$5.00</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount + 5)}</span>
                  </div>
                </div>

                <button className="ticket-button" onClick={handleNextStep}>Proceed to Payment</button>
              </div>
            )}

            {/* Payment Step */}
            {checkoutStep === 2 && (
              <div className="payment-step">
                <h3>Payment Information</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>
                      <User size={18} />
                      <span>Cardholder Name</span>
                    </label>
                    <input 
                      type="text" 
                      name="cardName" 
                      value={paymentInfo.cardName}
                      onChange={handlePaymentInfoChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <CreditCard size={18} />
                      <span>Card Number</span>
                    </label>
                    <input 
                      type="text" 
                      name="cardNumber" 
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentInfoChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        name="expiryDate" 
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentInfoChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input 
                        type="text" 
                        name="cvv" 
                        value={paymentInfo.cvv}
                        onChange={handlePaymentInfoChange}
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="ticket-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>$5.00</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>{formatCurrency(totalAmount + 5)}</span>
                    </div>
                  </div>

                  <div className="button-group">
                    <button type="button" className="ticket-button" onClick={handlePreviousStep}>Back</button>
                    <button type="submit" className="ticket-button">Complete Purchase</button>
                  </div>
                </form>
              </div>
            )}

            {/* Confirmation Step */}
            {checkoutStep === 3 && (
              <div className="confirmation-step">
                <div className="confirmation-icon">✓</div>
                <h3>Order Successful!</h3>
                <p>Thank you for your purchase. Your order has been confirmed.</p>
                
                <div className="ticket-details">
                  <div className="detail-item">
                    <ShoppingBag size={18} />
                    <span>{itemCount} Item{itemCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={18} />
                    <span>Shipping to your address</span>
                  </div>
                </div>
                
                <p className="confirmation-message">A confirmation email has been sent to your registered email address with your order details.</p>
                
                <button className="ticket-button" onClick={handleCompletePurchase}>Return to Store</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;