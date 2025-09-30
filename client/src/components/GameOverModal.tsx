import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trophy, Mail, RotateCcw, Star, Target } from "lucide-react";
import { calculatePersonaCards } from "@shared/schema";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
});

interface GameOverModalProps {
  isVisible: boolean;
  finalScore: number;
  totalAccumulatedScore: number;
  level: number;
  linesCleared: number;
  storedEmail: string;
  onRestart: () => void;
  onEmailSubmit: (email: string) => void;
  onClearEmail: () => void;
  onClose: () => void;
}

export default function GameOverModal({
  isVisible,
  finalScore,
  totalAccumulatedScore,
  level,
  linesCleared,
  storedEmail,
  onRestart,
  onEmailSubmit,
  onClearEmail,
  onClose
}: GameOverModalProps) {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);

  const personaCardsEarned = calculatePersonaCards(totalAccumulatedScore);
  const canGetPersonaCards = totalAccumulatedScore >= 50;
  const hasStoredEmail = !!storedEmail;
  
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    try {
      await onEmailSubmit(values.email);
      setEmailSubmitted(true);
      form.reset();
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    form.reset();
    setEmailSubmitted(false);
    onRestart();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 animate-in fade-in-0 scale-in-95 duration-300">
        {/* Header */}
        <div className="text-center space-y-2">
          <Trophy className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl font-bold">Game Over</h2>
          <p className="text-muted-foreground">Great job learning about sustainability!</p>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary" data-testid="text-final-score">
                {finalScore.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">This Game</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary" data-testid="text-accumulated-score">
                {totalAccumulatedScore.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">24h Total</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              Level {level}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {linesCleared} Lines
            </Badge>
          </div>
        </div>

        {/* Persona Cards Section */}
        {canGetPersonaCards && (
          <div className="space-y-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="text-center space-y-2">
              <Target className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-semibold text-primary">Persona Cards Available!</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>You've earned {personaCardsEarned} Persona Card{personaCardsEarned !== 1 ? 's' : ''}!</p>
                <p className="text-xs">
                  {hasStoredEmail 
                    ? `Your Persona Cards will be sent to ${storedEmail}. Play more to earn more!`
                    : "Leave your email to save your score to exchange into Persona Cards later - 50 points = 1 Persona Card. Play more to earn more Persona Cards = snapshots of your Sustainability Mindset in Action."
                  }
                </p>
              </div>
            </div>

            {hasStoredEmail ? (
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  Persona Cards automatically saved to your account ({storedEmail})!
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChangeEmail(true)}
                  className="mt-2 text-xs"
                  data-testid="button-change-email"
                >
                  Change Email
                </Button>
              </div>
            ) : !emailSubmitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            data-testid="input-achievement-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage data-testid="error-achievement-email" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    data-testid="button-request-achievement-card"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Email for Persona Cards"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  Email saved! You'll receive {personaCardsEarned} Persona Card{personaCardsEarned !== 1 ? 's' : ''} soon.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Save Game Session Section */}
        {!canGetPersonaCards && (
          <div className="space-y-4 p-4 bg-muted/50 border rounded-lg">
            <div className="text-center space-y-2">
              <Mail className="w-8 h-8 text-muted-foreground mx-auto" />
              <h3 className="font-semibold">Your Game Session</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="text-xs">
                  Score: {finalScore} points • Level: {level} • Sentences completed and answers saved
                </p>
              </div>
            </div>

            {hasStoredEmail ? (
              <div className="text-center p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Session automatically saved to your account ({storedEmail})!
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChangeEmail(true)}
                  className="mt-2 text-xs"
                  data-testid="button-change-session-email"
                >
                  Change Email
                </Button>
              </div>
            ) : !emailSubmitted ? (
              <>
                <div className="text-center space-y-1 mb-3">
                  <p className="text-sm text-muted-foreground">Want to keep track of your progress?</p>
                  <p className="text-xs text-muted-foreground">
                    Provide your email to save your progress and all your creative answers for future reference.
                  </p>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              data-testid="input-session-email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage data-testid="error-session-email" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                      variant="outline"
                      data-testid="button-save-session"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Saving..." : "Save My Game Session"}
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <div className="text-center p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Game session saved! Your progress and answers are now recorded with your email.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Change Email Modal */}
        {showChangeEmail && (
          <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="text-center space-y-2">
              <h4 className="font-semibold text-orange-700 dark:text-orange-300">Change Email Address</h4>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Current: {storedEmail}
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter new email address"
                          data-testid="input-change-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage data-testid="error-change-email" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="sm"
                    data-testid="button-save-new-email"
                  >
                    {isSubmitting ? "Updating..." : "Update Email"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChangeEmail(false)}
                    data-testid="button-cancel-change-email"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onClearEmail();
                      setShowChangeEmail(false);
                    }}
                    data-testid="button-clear-email"
                  >
                    Clear Email
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-close-game"
          >
            Close
          </Button>
          <Button
            onClick={handleRestart}
            className="flex-1"
            data-testid="button-restart-game"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>

        {/* Continue Progress Note */}
        <p className="text-xs text-center text-muted-foreground">
          {hasStoredEmail 
            ? `All future games will be automatically saved to ${storedEmail}`
            : "Return within 24 hours to continue accumulating your score!"
          }
        </p>
      </Card>
    </div>
  );
}