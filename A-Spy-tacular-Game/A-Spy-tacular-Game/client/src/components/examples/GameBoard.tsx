import GameBoard from '../GameBoard';

export default function GameBoardExample() {
  // Mock game board data
  const mockBoard = Array(25).fill(null).map(() => Array(15).fill(null));
  
  // Add some placed blocks
  mockBoard[24] = ['protect', 'nature', 'sustain', 'care', 'green', 'earth', 'love', 'peace', 'hope', 'future', 'unity', 'clean', 'safe', 'pure', 'life'];
  mockBoard[23] = ['respect', null, null, 'river', 'ocean', null, null, null, 'smile', 'kind', null, null, 'help', 'share', 'give'];
  mockBoard[22] = ['diverse', null, null, null, null, null, null, null, 'nice', 'help', null, null, null, null, 'grow'];

  const mockCurrentPiece = {
    blocks: [
      { x: 0, y: 0, keyword: 'unity' },
      { x: 1, y: 0, keyword: 'together' },
      { x: 2, y: 0, keyword: 'harmony' },
      { x: 1, y: 1, keyword: 'balance' }
    ],
    x: 3,
    y: 5
  };

  return (
    <div className="p-6 bg-background">
      <GameBoard board={mockBoard} currentPiece={mockCurrentPiece} />
    </div>
  );
}