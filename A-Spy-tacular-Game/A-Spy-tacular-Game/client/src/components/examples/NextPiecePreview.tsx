import NextPiecePreview from '../NextPiecePreview';

export default function NextPiecePreviewExample() {
  const mockPiece = {
    blocks: [
      { x: 0, y: 0, keyword: 'hope' },
      { x: 1, y: 0, keyword: 'future' },
      { x: 1, y: 1, keyword: 'bright' },
      { x: 2, y: 1, keyword: 'tomorrow' }
    ]
  };

  return (
    <div className="p-6 bg-background max-w-sm">
      <NextPiecePreview piece={mockPiece} />
    </div>
  );
}