import { useState } from 'react';
import SentenceChallenge from '../SentenceChallenge';

export default function SentenceChallengeExample() {
  const [isVisible, setIsVisible] = useState(true);

  const mockSentence = {
    id: '1',
    template: 'We must _____ our planet for future generations.',
    answer: 'protect',
    keywords: ['protect', 'care', 'sustain', 'preserve']
  };

  const mockKeywords = ['protect', 'nature', 'sustain', 'care', 'green', 'earth', 'love', 'peace', 'hope', 'future'];

  const handleSubmit = (answer: string, points: number) => {
    console.log('Answer submitted:', answer, 'Points:', points);
    setIsVisible(false);
    // Reset after 3 seconds for demo
    setTimeout(() => setIsVisible(true), 3000);
  };

  const handleSkip = () => {
    console.log('Challenge skipped');
    setIsVisible(false);
    // Reset after 3 seconds for demo
    setTimeout(() => setIsVisible(true), 3000);
  };

  return (
    <div className="p-6 bg-background min-h-96 relative">
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          {isVisible ? 'Sentence challenge is active!' : 'Challenge completed. Will restart in 3 seconds...'}
        </p>
      </div>
      
      <SentenceChallenge
        sentence={mockSentence}
        availableKeywords={mockKeywords}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
        isVisible={isVisible}
      />
    </div>
  );
}