import React, { useState } from 'react';
import './TicketModal.css';
import { X, Calendar, MapPin, Clock, CreditCard, Ticket, User, Plus, Minus } from 'lucide-react';

// Define the event interface
interface Event {
  id: string;
  artist: string;
  title: string;
  venue: string;
  location: string;
  startDate: string;
  imageUrl: string;
}

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, event }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState('standard');
  const [step, setStep] = useState(1); // 1: Select tickets, 2: Payment details, 3: Confirmation
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // If no event or the modal is closed, don't render
  if (!isOpen || !event) return null;

  // Price calculation based on ticket type
  const ticketPrices = {
    standard: 49.99,
    vip: 99.99,
    platinum: 149.99
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormattedTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDecreaseTicketCount = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };

  const handleIncreaseTicketCount = () => {
    if (ticketCount < 10) { // Limit to 10 tickets per purchase
      setTicketCount(ticketCount + 1);
    }
  };

  const handleTicketTypeChange = (type: 'standard' | 'vip' | 'platinum') => {
    setSelectedTicketType(type);
  };

  const calculateTotal = () => {
    return ticketPrices[selectedTicketType as keyof typeof ticketPrices] * ticketCount;
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value
    });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle payment processing here
    handleNextStep();
  };

  return (
    <div className="ticket-modal-overlay" onClick={onClose}>
      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="ticket-modal-header">
          <img src={event.imageUrl} alt={event.title} className="event-image" />
          <div className="event-info-header">
            <h2>{event.title}</h2>
            <p className="artist-name">{event.artist}</p>
          </div>
        </div>

        {step === 1 && (
          <div className="ticket-selection-step">
            <div className="event-details-summary">
              <div className="detail-item">
                <Calendar size={18} />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="detail-item">
                <Clock size={18} />
                <span>{getFormattedTime(event.startDate)}</span>
              </div>
              <div className="detail-item">
                <MapPin size={18} />
                <span>{event.venue}, {event.location}</span>
              </div>
            </div>

            <h3>Select Ticket Type</h3>
            <div className="ticket-types">
              <div 
                className={`ticket-type ${selectedTicketType === 'standard' ? 'selected' : ''}`}
                onClick={() => handleTicketTypeChange('standard')}
              >
                <div className="ticket-type-header">
                  <Ticket size={18} />
                  <h4>Standard</h4>
                </div>
                <p className="ticket-price">${ticketPrices.standard}</p>
                <p className="ticket-description">General admission, standard seating</p>
              </div>

              <div 
                className={`ticket-type ${selectedTicketType === 'vip' ? 'selected' : ''}`}
                onClick={() => handleTicketTypeChange('vip')}
              >
                <div className="ticket-type-header">
                  <Ticket size={18} />
                  <h4>VIP</h4>
                </div>
                <p className="ticket-price">${ticketPrices.vip}</p>
                <p className="ticket-description">Premium seating, exclusive merchandise</p>
              </div>

              <div 
                className={`ticket-type ${selectedTicketType === 'platinum' ? 'selected' : ''}`}
                onClick={() => handleTicketTypeChange('platinum')}
              >
                <div className="ticket-type-header">
                  <Ticket size={18} />
                  <h4>Platinum</h4>
                </div>
                <p className="ticket-price">${ticketPrices.platinum}</p>
                <p className="ticket-description">Front-row seats, backstage access, meet & greet</p>
              </div>
            </div>

            <h3>Number of Tickets</h3>
            <div className="ticket-quantity">
              <button 
                className="quantity-button"
                onClick={handleDecreaseTicketCount}
                disabled={ticketCount <= 1}
              >
                <Minus size={18} />
              </button>
              <span className="ticket-count">{ticketCount}</span>
              <button 
                className="quantity-button"
                onClick={handleIncreaseTicketCount}
                disabled={ticketCount >= 10}
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="ticket-summary">
              <div className="summary-row">
                <span>Tickets ({ticketCount})</span>
                <span>${(ticketPrices[selectedTicketType as keyof typeof ticketPrices] * ticketCount).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Booking Fee</span>
                <span>$5.00</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${(calculateTotal() + 5).toFixed(2)}</span>
              </div>
            </div>

            <button className="ticket-button" onClick={handleNextStep}>Proceed to Payment</button>
          </div>
        )}

        {step === 2 && (
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
                  <span>Tickets ({ticketCount})</span>
                  <span>${(ticketPrices[selectedTicketType as keyof typeof ticketPrices] * ticketCount).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Booking Fee</span>
                  <span>$5.00</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${(calculateTotal() + 5).toFixed(2)}</span>
                </div>
              </div>

              <div className="button-group">
                <button type="button" className="back-button" onClick={handlePreviousStep}>Back</button>
                <button type="submit" className="ticket-button">Complete Purchase</button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="confirmation-step">
            <div className="confirmation-icon">✓</div>
            <h3>Ticket Purchase Successful!</h3>
            <p>Thank you for your purchase. Your tickets for <strong>{event.title}</strong> have been confirmed.</p>
            
            <div className="ticket-details">
              <div className="detail-item">
                <Calendar size={18} />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="detail-item">
                <MapPin size={18} />
                <span>{event.venue}, {event.location}</span>
              </div>
              <div className="detail-item">
                <Ticket size={18} />
                <span>{ticketCount} × {selectedTicketType.charAt(0).toUpperCase() + selectedTicketType.slice(1)} Tickets</span>
              </div>
            </div>
            
            <p className="confirmation-message">A confirmation email has been sent to your registered email address with your e-tickets attached.</p>
            
            <button className="ticket-button" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketModal;

