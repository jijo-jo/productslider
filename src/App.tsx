
import React, { useState } from 'react';
import ProductCard from './components/ProductCards';
import { productsData} from './data/products';
import './App.css'; 
import { CSSProperties } from 'react';

function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!isSwiping) {
      setIsSwiping(true);
      setSwipeDirection(direction);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setSwipeDirection(null);
        setIsSwiping(false);
        const swipedProduct = productsData[currentIndex % productsData.length];
        if (direction === 'right' && swipedProduct) {
          console.log(`Liked Product ID: ${swipedProduct.id}`);
        } else if (direction === 'left' && swipedProduct) {
          console.log(`Passed Product ID: ${swipedProduct.id}`);
        } else if (direction === 'up' && swipedProduct) {
          console.log(`Add to cart Product ID: ${swipedProduct.id}`);
        }
      }, 300); 
    }
  };

  const visibleCardsCount = 3; 
  const startIndex = currentIndex % productsData.length;

  const stackedCards = productsData
  .slice(startIndex, startIndex + visibleCardsCount)
  .map((product, index) => {
    const cardStyle: CSSProperties = {
      zIndex: visibleCardsCount - index,
      transform: `translateY(${index * 10}px) scale(${1 - index * 0.05})`,
      opacity: 1 - index * 0.15,
    };
    return (
      <ProductCard
        key={product.id}
        product={product}
        swipeDirection={index === 0 ? swipeDirection : null}
        isSwiping={index === 0 ? isSwiping : false}
        onSwipe={index === 0 ? handleSwipe : () => {}}
        style={cardStyle} 
      />
    );
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-80 h-auto max-w-md">
        {stackedCards}
        {!productsData.length && <div>No products available.</div>}
      </div>
    </div>
  );
}

export default App;
