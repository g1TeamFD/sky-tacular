import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  level: number;
  lines: number;
  totalAccumulatedScore?: number;
}

export default function ScoreDisplay({ score, level, lines, totalAccumulatedScore }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-right">
        <div className="text-lg sm:text-2xl font-bold text-primary" data-testid="text-current-score">
          {score.toLocaleString()}
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground">
          {lines} Thoughts Cleared
        </div>
      </div>
      
      {totalAccumulatedScore && totalAccumulatedScore >= 50 && (
        <Badge variant="default" className="flex items-center gap-1 text-xs">
          <Target className="w-3 h-3" />
          Card!
        </Badge>
      )}
    </div>
  );
}