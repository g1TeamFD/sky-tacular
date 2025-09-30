import GameControls from '../GameControls';

export default function GameControlsExample() {
  const handleMoveLeft = () => console.log('Move left triggered');
  const handleMoveRight = () => console.log('Move right triggered');
  const handleMoveDown = () => console.log('Move down triggered');
  const handleRotate = () => console.log('Rotate triggered');

  return (
    <div className="p-6 bg-background flex justify-center">
      <GameControls
        onMoveLeft={handleMoveLeft}
        onMoveRight={handleMoveRight}
        onMoveDown={handleMoveDown}
        onRotate={handleRotate}
      />
    </div>
  );
}