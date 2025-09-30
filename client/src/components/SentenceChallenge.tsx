import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit3, Send, Star } from "lucide-react";

interface SentenceChallengeProps {
  sentence: {
    id: string;
    template: string;
    answer: string;
    keywords: string[];
  };
  availableKeywords: string[];
  onSubmit: (answer: string, points: number) => void;
  onSkip: () => void;
  isVisible: boolean;
}

export default function SentenceChallenge({ 
  sentence, 
  availableKeywords, 
  onSubmit, 
  onSkip,
  isVisible 
}: SentenceChallengeProps) {
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [showEdit, setShowEdit] = useState(false);
  const [calculatedPoints, setCalculatedPoints] = useState(0);

  // Reset state only when modal opens or sentence changes
  useEffect(() => {
    if (!isVisible) return;
    
    setTimeLeft(20);
    setAnswer('');
    setShowEdit(false);
  }, [isVisible, sentence.id]);

  // Timer effect separate from reset logic
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onSkip();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onSkip]);

  useEffect(() => {
    // Calculate points in real-time
    const words = answer.toLowerCase().split(/\s+/).filter(word => 
      word.length > 2 && !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'].includes(word)
    );
    
    let points = 0;
    
    words.forEach(word => {
      // Base point for meaningful word
      points += 1;
      
      // Bonus for using keywords from blocks
      if (availableKeywords.some(keyword => keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase()))) {
        points += 2;
      }
      
      // Check similarity to answer key (simplified)
      if (sentence.answer.toLowerCase().includes(word)) {
        points *= 2; // Double points for answer key match
      }
    });
    
    setCalculatedPoints(Math.max(0, points));
  }, [answer, availableKeywords, sentence.answer]);

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer, calculatedPoints);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 space-y-6 animate-in fade-in-0 scale-in-95 duration-300">
        {/* Header with timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Complete the Sentence</h3>
          </div>
          <Badge variant={timeLeft <= 5 ? "destructive" : "outline"} className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeLeft}s
          </Badge>
        </div>

        {/* Sentence template */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-base leading-relaxed">
            {sentence.template.split('_____').map((part, index, array) => (
              <span key={index}>
                {part}
                {index < array.length - 1 && (
                  <span className="inline-block mx-2 px-3 py-1 bg-primary/10 border-2 border-dashed border-primary rounded text-primary font-medium">
                    _____
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>


        {/* Answer input */}
        <div className="space-y-3">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="resize-none min-h-20"
            data-testid="input-sentence-answer"
          />
          
          {/* Real-time points preview */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Estimated points:</span>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary" data-testid="text-estimated-points">
                {calculatedPoints}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onSkip}
            className="flex-1"
            data-testid="button-skip-challenge"
          >
            Skip
          </Button>
          
          {!showEdit ? (
            <Button
              onClick={() => setShowEdit(true)}
              disabled={!answer.trim()}
              className="flex-1"
              data-testid="button-preview-answer"
            >
              Preview ({calculatedPoints} pts)
            </Button>
          ) : (
            <div className="flex gap-2 flex-1">
              <Button
                variant="outline"
                onClick={() => setShowEdit(false)}
                data-testid="button-edit-answer"
              >
                Edit
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="flex-1"
                data-testid="button-submit-answer"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}