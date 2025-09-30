import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { 
  GameSessionType, 
  InsertGameSession,
  PlayerAnswerType,
  InsertPlayerAnswer 
} from "@shared/schema";

export function useGameSession() {
  const { user } = useAuth();
  const { toast } = useToast();

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: Omit<InsertGameSession, 'playerId'>) => {
      const res = await apiRequest("POST", "/api/game-session", sessionData);
      return await res.json() as GameSessionType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player/sessions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create game session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<InsertGameSession, 'playerId'>> }) => {
      const res = await apiRequest("PATCH", `/api/game-session/${id}`, updates);
      return await res.json() as GameSessionType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/player/total-score"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update game session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createSession: createSessionMutation.mutate,
    updateSession: updateSessionMutation.mutate,
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    createSessionMutation, // Expose the full mutation for onSuccess callbacks
  };
}

export function usePlayerSessions(limit = 10) {
  const { user } = useAuth();
  
  return useQuery<GameSessionType[]>({
    queryKey: ["/api/player/sessions", limit],
    enabled: !!user,
  });
}

export function usePlayerTotalScore(hoursBack = 24) {
  const { user } = useAuth();
  
  return useQuery<{ totalScore: number; hoursBack: number }>({
    queryKey: ["/api/player/total-score", hoursBack],
    enabled: !!user,
  });
}

export function usePlayerAnswer() {
  const { toast } = useToast();

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: InsertPlayerAnswer) => {
      const res = await apiRequest("POST", "/api/player-answer", answerData);
      return await res.json() as PlayerAnswerType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player/total-score"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit answer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    submitAnswer: submitAnswerMutation.mutate,
    isSubmitting: submitAnswerMutation.isPending,
  };
}

export function useAchievementCard() {
  const { toast } = useToast();

  const requestCardMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/achievement-card", { email });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Achievement card requested!",
        description: "Check the server logs for your achievement details (manual email mode).",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to request achievement card",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    requestCard: requestCardMutation.mutate,
    isRequesting: requestCardMutation.isPending,
  };
}