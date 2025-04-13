
import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { Product } from '../data/products';
import './ProductCard.css'; 

interface ProductCardProps {
  product: Product;
  swipeDirection: 'left' | 'right' | 'up' | null;
  isSwiping: boolean;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  style?: CSSProperties; 
}

const ProductCard: React.FC<ProductCardProps> = ({ product, swipeDirection, isSwiping, onSwipe, style }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchX, setTouchX] = useState<number>(0);
  const [touchY, setTouchY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [translateX, setTranslateX] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);

  useEffect(() => {
    if (swipeDirection) {
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease-out';
        if (swipeDirection === 'right') {
          cardRef.current.style.transform = 'translateX(500px) rotate(30deg)';
        } else if (swipeDirection === 'left') {
          cardRef.current.style.transform = 'translateX(-500px) rotate(-30deg)';
        } else if (swipeDirection === 'up') {
          cardRef.current.style.transform = 'translateY(-500px) rotate(-5deg)';
        }
      }
    } else if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
      setTranslateX(0);
      setTranslateY(0);
      setRotation(0);
    }
  }, [swipeDirection]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setTranslateX(0);
    setTranslateY(0);
    setRotation(0);
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || isSwiping) return;

    const deltaX = e.touches[0].clientX - touchStart.x;
    const deltaY = e.touches[0].clientY - touchStart.y;

    setTouchX(deltaX);
    setTouchY(deltaY);
    setTranslateX(deltaX);
    setTranslateY(deltaY);
    setRotation(deltaX * 0.02); 

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${deltaX * 0.02}deg)`;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || isSwiping) return;

    const swipeThreshold = 80;
    const swipeUpThreshold = -50;

    if (touchX > swipeThreshold) {
      onSwipe('right');
    } else if (touchX < -swipeThreshold) {
      onSwipe('left');
    } else if (touchY < swipeUpThreshold && Math.abs(touchX) < swipeThreshold / 2) {
      onSwipe('up');
    } else {
     
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease-out';
        cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
      }
      setTranslateX(0);
      setTranslateY(0);
      setRotation(0);
    }

    setTouchStart(null);
    setTouchX(0);
    setTouchY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart({ x: e.clientX, y: e.clientY });
    setTranslateX(0);
    setTranslateY(0);
    setRotation(0);
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!touchStart || isSwiping) return;

    const deltaX = e.clientX - touchStart.x;
    const deltaY = e.clientY - touchStart.y;

    setTouchX(deltaX);
    setTouchY(deltaY);
    setTranslateX(deltaX);
    setTranslateY(deltaY);
    setRotation(deltaX * 0.02);

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${deltaX * 0.02}deg)`;
    }
  };

  const handleMouseUp = () => {
    if (!touchStart || isSwiping) return;

    const swipeThreshold = 80;
    const swipeUpThreshold = -50;

    if (touchX > swipeThreshold) {
      onSwipe('right');
    } else if (touchX < -swipeThreshold) {
      onSwipe('left');
    } else if (touchY < swipeUpThreshold && Math.abs(touchX) < swipeThreshold / 2) {
      onSwipe('up');
    } else {
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease-out';
        cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
      }
      setTranslateX(0);
      setTranslateY(0);
      setRotation(0);
    }

    setTouchStart(null);
    setTouchX(0);
    setTouchY(0);
  };

  return (
    <div
      ref={cardRef}
      className="product-card bg-white rounded-xl shadow-md w-full h-auto p-4 relative cursor-grab"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} 
      style={style} 
    >
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md mb-2" />
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
      <div className="flex items-center">
        <span className="text-xl font-bold text-indigo-600 mr-2">₹{product.price}</span>
        {product.originalPrice && (
          <span className="text-gray-500 line-through text-sm mr-2">₹{product.originalPrice}</span>
        )}
        {typeof product.discountPercentage === 'number' && product.discountPercentage > 0 && (
          <span className="text-green-500 text-sm">({product.discountPercentage}% off)</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;