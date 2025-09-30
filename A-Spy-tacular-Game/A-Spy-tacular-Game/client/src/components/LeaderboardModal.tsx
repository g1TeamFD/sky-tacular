import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award, Clock } from 'lucide-react';

interface LeaderboardEntry {
  playerEmail: string;
  totalScore: number;
  totalPlays: number;
  completedSentences: number;
  achievementCards: number;
  daysStreak: number;
  lastActive: string;
  lastActiveDate: string;
  averagePlaysPerDay: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  lastUpdated: string;
}

export default function LeaderboardModal() {
  const [open, setOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/leaderboard?limit=10');
      
      if (!response.ok) {
        throw new Error('Failed to load leaderboard');
      }
      
      const data = await response.json();
      setLeaderboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when modal opens
  useEffect(() => {
    if (open) {
      fetchLeaderboard();
    }
  }, [open]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 1:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-xs"
          data-testid="button-leaderboard"
        >
          <Trophy className="w-3 h-3" />
          Leaders
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {loading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-3">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchLeaderboard}
                data-testid="button-retry-leaderboard"
              >
                Try Again
              </Button>
            </div>
          )}

          {leaderboardData && !loading && (
            <>
              <div className="space-y-1">
                {leaderboardData.leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No players yet!</p>
                    <p className="text-xs text-muted-foreground">Be the first to appear on the leaderboard.</p>
                  </div>
                ) : (
                  leaderboardData.leaderboard.map((player, index) => (
                    <div 
                      key={`${player.playerEmail}-${index}`}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate"
                      data-testid={`leaderboard-entry-${index}`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {getRankIcon(index)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate" data-testid={`player-email-${index}`}>
                            {player.playerEmail}
                          </span>
                          {player.achievementCards > 0 && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {player.achievementCards} cards
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span data-testid={`total-score-${index}`}>
                            {player.totalScore.toLocaleString()} pts
                          </span>
                          <span data-testid={`completed-sentences-${index}`}>
                            {player.completedSentences} sentences
                          </span>
                          <span className="flex items-center gap-1" data-testid={`days-streak-${index}`}>
                            <Clock className="w-3 h-3" />
                            {player.daysStreak}d streak
                          </span>
                        </div>
                      </div>

                      {/* Last Active */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-muted-foreground" data-testid={`last-active-${index}`}>
                          {player.lastActive}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Updated: {new Date(leaderboardData.lastUpdated).toLocaleTimeString()}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={fetchLeaderboard}
                    className="h-6 px-2 text-xs"
                    data-testid="button-refresh-leaderboard"
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}