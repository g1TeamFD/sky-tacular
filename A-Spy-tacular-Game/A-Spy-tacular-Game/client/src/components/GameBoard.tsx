import { Card } from "@/components/ui/card";

interface GameBoardProps {
  board: ({ keyword: string; color: string } | null)[][];
  currentPiece?: {
    blocks: { x: number; y: number; keyword: string }[];
    x: number;
    y: number;
    color: string;
  } | null;
}

const BLOCK_COLORS = [
  'bg-blue-500',
  'bg-yellow-500', 
  'bg-purple-500',
  'bg-green-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-lime-500',
  'bg-rose-500',
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-slate-500'
];


export default function GameBoard({ board, currentPiece }: GameBoardProps) {
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 17;

  const getBlockContent = (row: number, col: number) => {
    // Check if current piece occupies this position
    if (currentPiece) {
      const pieceBlock = currentPiece.blocks.find(
        block => block.x + currentPiece.x === col && block.y + currentPiece.y === row
      );
      if (pieceBlock) {
        return { keyword: pieceBlock.keyword, color: currentPiece.color, type: 'current' };
      }
    }

    // Check board content
    const boardContent = board[row]?.[col];
    if (boardContent) {
      return { keyword: boardContent.keyword, color: boardContent.color, type: 'placed' };
    }

    return null;
  };

  return (
    <Card className="p-1 sm:p-2 bg-card border-2">
      <div 
        className="grid gap-[0.5px] bg-border p-1 rounded-md mx-auto"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
          width: 'min(90vw, 80vh * 10/17, 500px)',
          aspectRatio: `${BOARD_WIDTH}/${BOARD_HEIGHT}`
        }}
      >
        {Array.from({ length: BOARD_HEIGHT }).map((_, row) =>
          Array.from({ length: BOARD_WIDTH }).map((_, col) => {
            const content = getBlockContent(row, col);
            
            return (
              <div
                key={`${row}-${col}`}
                className={`
                  aspect-square rounded-sm flex items-center justify-center text-[8px] font-semibold
                  ${content 
                    ? `${content.color} text-white border border-white/20` 
                    : 'bg-background'
                  }
                  transition-all duration-150
                `}
              >
                {content && (
                  <span className="text-[7px] leading-tight text-center px-[1px] truncate font-bold">
                    {content.keyword.slice(0, 4)}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}