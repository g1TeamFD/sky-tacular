import ScoreDisplay from '../ScoreDisplay';

export default function ScoreDisplayExample() {
  return (
    <div className="p-6 bg-background max-w-sm">
      <ScoreDisplay 
        score={2850}
        level={3}
        lines={27}
        totalAccumulatedScore={4200}
      />
    </div>
  );
}