import React, { useState, useEffect, useRef, TouchEvent, MouseEvent } from 'react';
import './Events.css';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

// Interface for concert/event data
interface Event {
  id: string;
  artist: string;
  title: string;
  description: string;
  imageUrl: string;
  venue: string;
  location: string;
  startDate: string; // ISO date string
  ticketLink: string;
}

// Generated future dates for events
const getFutureDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Sample concert events for our artists
const concertEvents: Event[] = [
  {
    id: 'e1',
    artist: 'Logic',
    title: 'Under Pressure Tour',
    description: 'Experience Logic live with his iconic album performed in full, featuring special guests and unreleased tracks.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/Logic_-_Under_Pressure_%28Deluxe_Edition%29.jpg/220px-Logic_-_Under_Pressure_%28Deluxe_Edition%29.jpg',
    venue: 'Madison Square Garden',
    location: 'New York, NY',
    startDate: '2025-09-15T00:00:00.000Z', // 15 days from now
    ticketLink: '#'
  },
  {
    id: 'e2',
    artist: 'The Weeknd',
    title: 'After Hours Tour',
    description: 'The Weeknd brings his chart-topping hits to life with an immersive audiovisual experience you won\'t forget.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png',
    venue: 'Crypto.com Arena',
    location: 'Los Angeles, CA',
    startDate: getFutureDate(30), // 30 days from now
    ticketLink: '#'
  },
  {
    id: 'e3',
    artist: 'Billie Eilish',
    title: 'World Tour 2025',
    description: 'Billie Eilish returns with her biggest world tour yet, featuring songs from her entire discography.',
    imageUrl: 'https://www.billboard.com/wp-content/uploads/media/Billie-Eilish-Bad-Guy-screenshot-2019-billboard-1500.jpg',
    venue: 'O2 Arena',
    location: 'London, UK',
    startDate: '2025-06-09T00:00:00.000Z', // 9th of June 2025
    ticketLink: '#'
  },
  {
    id: 'e4',
    artist: 'Marko Glass',
    title: 'Urban Trap Experience',
    description: 'Join Marko Glass for an unforgettable night of trap music with guest performers from the underground scene.',
    imageUrl: 'https://images.genius.com/199959a75bd7b76d5c81e92018402658.1000x1000x1.png',
    venue: 'Barclays Center',
    location: 'Brooklyn, NY',
    startDate: getFutureDate(20), // 20 days from now
    ticketLink: '#'
  },
  {
    id: 'e5',
    artist: 'BTS',
    title: 'K-Pop Sensation World Tour',
    description: 'BTS brings their electrifying performances to fans worldwide with this spectacular concert experience.',
    imageUrl: 'https://i1.wp.com/stephanieeffevottu.com/wp-content/uploads/2023/06/20230609_100516.jpg?fit=1200%2C800&ssl=1',
    venue: 'Rose Bowl Stadium',
    location: 'Pasadena, CA',
    startDate: getFutureDate(60), // 60 days from now
    ticketLink: '#'
  },
  {
    id: 'e6',
    artist: 'Slipknot',
    title: 'Heavy Metal Mayhem',
    description: 'Prepare for an intense night with Slipknot as they deliver their signature sound and theatrical performance.',
    imageUrl: 'https://i8.amplience.net/i/naras/slipknot_MI0005599206-MN0000750742',
    venue: 'Download Festival',
    location: 'Donington Park, UK',
    startDate: getFutureDate(75), // 75 days from now
    ticketLink: '#'
  }
];

// Component for countdown timer
interface CountdownProps {
  targetDate: string;
}

const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return (
    <div className="countdown-container">
      <div className="countdown-title">Countdown to Event</div>
      <div className="countdown-timer">
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.days}</div>
          <div className="countdown-label">Days</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.hours}</div>
          <div className="countdown-label">Hours</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.minutes}</div>
          <div className="countdown-label">Minutes</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.seconds}</div>
          <div className="countdown-label">Seconds</div>
        </div>
      </div>
    </div>
  );
};

// Main Events component
const Events: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [eventsPerPage, setEventsPerPage] = useState(3);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // For touch/swipe functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Calculate total events
  const totalEvents = concertEvents.length;
  
  // Calculate max slide index to prevent going beyond the end
  const maxSlideIndex = Math.max(0, totalEvents - eventsPerPage);
  
  // Update events per page based on window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      if (window.innerWidth >= 1024) {
        setEventsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setEventsPerPage(2);
      } else {
        setEventsPerPage(1);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      // Make sure currentIndex doesn't exceed maxSlideIndex after resize
      if (currentIndex > maxSlideIndex) {
        setCurrentIndex(maxSlideIndex);
      }
    };
  }, [windowWidth, maxSlideIndex]);
  
  // Handle previous navigation
  const handlePrevious = () => {
    if (isTransitioning || currentIndex <= 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => prevIndex - 1);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  // Handle next navigation
  const handleNext = () => {
    if (isTransitioning || currentIndex >= maxSlideIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => prevIndex + 1);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  // Calculate which indicator is active based on the current event index
  const getActiveIndicator = (index: number) => {
    return index === currentIndex;
  };
  
  const handleDotClick = (index: number) => {
    if (isTransitioning || index < 0 || index > maxSlideIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  // Touch handlers for swipe gesture
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (isTransitioning) return;
    
    setIsDragging(true);
    setStartPosition(e.touches[0].clientX);
    setCurrentTranslate(0);
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    const translate = currentPosition - startPosition;
    
    // Restrict movement if at the beginning or end
    if ((currentIndex <= 0 && translate > 0) || (currentIndex >= maxSlideIndex && translate < 0)) {
      // Add resistance to the drag
      setCurrentTranslate(translate * 0.2);
    } else {
      setCurrentTranslate(translate);
    }
  };
  
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // If the user has dragged more than 100px, change the slide
    if (Math.abs(currentTranslate) > 100) {
      if (currentTranslate > 0 && currentIndex > 0) {
        handlePrevious();
      } else if (currentTranslate < 0 && currentIndex < maxSlideIndex) {
        handleNext();
      }
    }
    setCurrentTranslate(0);
  };
  
  // Mouse handlers for drag gesture
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isTransitioning) return;
    
    e.preventDefault();
    setIsDragging(true);
    setStartPosition(e.clientX);
    setCurrentTranslate(0);
  };
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentPosition = e.clientX;
    const translate = currentPosition - startPosition;
    
    // Restrict movement if at the beginning or end
    if ((currentIndex <= 0 && translate > 0) || (currentIndex >= maxSlideIndex && translate < 0)) {
      // Add resistance to the drag
      setCurrentTranslate(translate * 0.2);
    } else {
      setCurrentTranslate(translate);
    }
  };
  
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // If the user has dragged more than 100px, change the slide
    if (Math.abs(currentTranslate) > 100) {
      if (currentTranslate > 0 && currentIndex > 0) {
        handlePrevious();
      } else if (currentTranslate < 0 && currentIndex < maxSlideIndex) {
        handleNext();
      }
    }
    setCurrentTranslate(0);
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setCurrentTranslate(0);
    }
  };
  
  // Format date for display
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
  
  // Get the total number of pages (for indicator dots)
  const totalPages = Math.ceil(totalEvents / eventsPerPage);
  
  // Generate the correct number of indicators
  const totalIndicators = maxSlideIndex + 1;
  
  return (
    <div className="events-section">
      <div className="events-header">
        <h1>Upcoming Concerts & Events</h1>
        <p>Catch your favorite artists live with these upcoming events</p>
      </div>
      
      <div 
        className="events-carousel"
        ref={carouselRef}
      >
        <div 
          className={`carousel-container ${isDragging ? 'dragging' : ''}`}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            transform: isDragging ? `translateX(${currentTranslate}px)` : 'translateX(0)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Card track to hold all cards in a sliding track */}
          <div className="card-track" style={{ 
            transform: `translateX(${-currentIndex * (100 / eventsPerPage)}%)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}>
            {concertEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="card-position"
                style={{
                  padding: '0 0.5rem', // Match the padding we set in CSS
                }}
              >
                <div 
                  className="event-card"
                >
                  <img src={event.imageUrl} alt={event.title} className="event-image" />
                  <div className="event-details">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-artist"><strong>{event.artist}</strong></p>
                    
                    <div className="event-info">
                      <Calendar size={16} />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    
                    <div className="event-info">
                      <MapPin size={16} />
                      <span>{event.venue}, {event.location}</span>
                    </div>
                    
                    <p className="event-description">{event.description}</p>
                    <CountdownTimer targetDate={event.startDate} />
                    <a href={event.ticketLink} className="event-button">
                      Get Tickets
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
             
        <div className="carousel-indicators">
          {Array.from({ length: totalIndicators }).map((_, index) => (
            <div 
              key={index}
              className={`carousel-indicator ${getActiveIndicator(index) ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;