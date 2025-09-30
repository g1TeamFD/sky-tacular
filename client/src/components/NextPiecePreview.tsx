import { Card } from "@/components/ui/card";

interface NextPiecePreviewProps {
  piece: {
    blocks: { x: number; y: number; keyword: string }[];
  } | null;
}

export default function NextPiecePreview({ piece }: NextPiecePreviewProps) {
  if (!piece) return null;

  // Find the bounds of the piece to center it
  const minX = Math.min(...piece.blocks.map(b => b.x));
  const maxX = Math.max(...piece.blocks.map(b => b.x));
  const minY = Math.min(...piece.blocks.map(b => b.y));
  const maxY = Math.max(...piece.blocks.map(b => b.y));
  
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  return (
    <Card className="p-4 space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground text-center">Next Piece</h4>
      
      <div className="flex justify-center">
        <div 
          className="grid gap-[1px] bg-border p-2 rounded-md"
          style={{
            gridTemplateColumns: `repeat(${Math.max(width, 4)}, 1fr)`,
            gridTemplateRows: `repeat(${Math.max(height, 4)}, 1fr)`,
          }}
        >
          {Array.from({ length: Math.max(height, 4) }).map((_, row) =>
            Array.from({ length: Math.max(width, 4) }).map((_, col) => {
              const adjustedX = col + minX;
              const adjustedY = row + minY;
              
              const block = piece.blocks.find(
                b => b.x === adjustedX && b.y === adjustedY
              );

              return (
                <div
                  key={`${row}-${col}`}
                  className={`
                    w-6 h-6 rounded-sm flex items-center justify-center text-[8px] font-semibold
                    ${block 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/30'
                    }
                  `}
                >
                  {block && (
                    <span className="text-center leading-tight truncate">
                      {block.keyword.slice(0, 4)}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}