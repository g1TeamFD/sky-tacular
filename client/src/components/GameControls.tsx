import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown, RotateCw } from "lucide-react";

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  disabled?: boolean;
}

export default function GameControls({ 
  onMoveLeft, 
  onMoveRight, 
  onMoveDown, 
  onRotate, 
  disabled = false 
}: GameControlsProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        size="icon"
        variant="outline"
        onClick={onMoveLeft}
        disabled={disabled}
        data-testid="button-move-left"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        onClick={onRotate}
        disabled={disabled}
        data-testid="button-rotate"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
      >
        <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        onClick={onMoveDown}
        disabled={disabled}
        data-testid="button-move-down"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
      >
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        onClick={onMoveRight}
        disabled={disabled}
        data-testid="button-move-right"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
    </div>
  );
}