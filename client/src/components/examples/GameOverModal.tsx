import { useState } from 'react';
import GameOverModal from '../GameOverModal';

export default function GameOverModalExample() {
  const [isVisible, setIsVisible] = useState(true);

  const handleRestart = () => {
    console.log('Game restart triggered');
    setIsVisible(false);
    // Reset after 3 seconds for demo
    setTimeout(() => setIsVisible(true), 3000);
  };

  const handleEmailSubmit = (email: string) => {
    console.log('Achievement card requested for:', email);
  };

  const handleClose = () => {
    console.log('Game closed');
    setIsVisible(false);
    // Reset after 3 seconds for demo
    setTimeout(() => setIsVisible(true), 3000);
  };

  return (
    <div className="p-6 bg-background min-h-96 relative">
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          {isVisible ? 'Game Over modal is active!' : 'Modal closed. Will restart in 3 seconds...'}
        </p>
      </div>
      
      <GameOverModal
        isVisible={isVisible}
        finalScore={2850}
        totalAccumulatedScore={5670}
        level={4}
        linesCleared={35}
        onRestart={handleRestart}
        onEmailSubmit={handleEmailSubmit}
        onClose={handleClose}
      />
    </div>
  );
}