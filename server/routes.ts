import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { sendAchievementCard } from "./sendgrid";
import { 
  insertGameSessionSchema,
  insertPlayerAnswerSchema,
  insertAchievementCardSchema,
  calculatePersonaCards
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes: /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Game session routes
  app.post("/api/game-session", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const sessionData = insertGameSessionSchema.parse({
        ...req.body,
        playerEmail: req.user.email
      });
      
      const session = await storage.createGameSession(sessionData);
      
      // Update static JSON file
      storage.updateStaticGameSessionsFile().catch(console.error);
      
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Anonymous game session routes
  app.post("/api/anonymous-session", async (req, res) => {
    try {
      const sessionData = insertGameSessionSchema.parse({
        ...req.body,
        playerEmail: req.body.playerEmail || null // Allow null for anonymous sessions
      });
      
      const session = await storage.createGameSession(sessionData);
      
      // Update static JSON file
      storage.updateStaticGameSessionsFile().catch(console.error);
      
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.patch("/api/anonymous-session/:id", async (req, res) => {
    try {
      const sessionId = req.params.id;
      
      // Check session exists
      const existingSession = await storage.getGameSession(sessionId);
      if (!existingSession) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Allow updates to anonymous sessions
      const allowedFields = [
        'score', 'level', 'completedSentences', 'sessionDuration', 
        'linesCleared', 'piecesPlaced', 'sentencesAttempted', 'sentencesCompleted',
        'deviceType', 'browserInfo', 'ipAddress', 'country', 'region', 
        'personaCardsEarned', 'endedAt', 'playerEmail'
      ] as const;
      
      const allowedUpdates: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          // Handle endedAt field conversion from string to Date
          if (field === 'endedAt' && req.body[field]) {
            allowedUpdates[field] = new Date(req.body[field]);
          } else {
            allowedUpdates[field] = req.body[field];
          }
        }
      }
      
      const session = await storage.updateGameSession(sessionId, allowedUpdates);
      
      // Update static JSON file
      storage.updateStaticGameSessionsFile().catch(console.error);
      
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.patch("/api/game-session/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const sessionId = req.params.id;
      
      // Check ownership first
      const existingSession = await storage.getGameSession(sessionId);
      if (!existingSession) {
        return res.status(404).json({ message: "Session not found" });
      }
      if (existingSession.playerEmail !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Validate and restrict updates - only allow score, level, and completedSentences
      const allowedFields = ['score', 'level', 'completedSentences'] as const;
      const allowedUpdates: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          allowedUpdates[field] = req.body[field];
        }
      }
      
      const session = await storage.updateGameSession(sessionId, allowedUpdates);
      
      // Update static JSON file
      storage.updateStaticGameSessionsFile().catch(console.error);
      
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/game-session/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const sessionId = req.params.id;
      const session = await storage.getGameSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Check ownership
      if (session.playerEmail !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/player/sessions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const sessions = await storage.getPlayerSessions(req.user.email, limit);
      
      res.json(sessions);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/player/total-score", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const hoursBack = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const totalScore = await storage.getPlayerTotalScore(req.user.email, hoursBack);
      
      res.json({ totalScore, hoursBack });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Player answer routes
  app.post("/api/player-answer", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const answerData = insertPlayerAnswerSchema.parse(req.body);
      
      // Check session ownership before creating answer
      const session = await storage.getGameSession(answerData.sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      if (session.playerEmail !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const answer = await storage.createPlayerAnswer(answerData);
      res.status(201).json(answer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Anonymous player answer route
  app.post("/api/anonymous-answer", async (req, res) => {
    try {
      const answerData = insertPlayerAnswerSchema.parse(req.body);
      
      // Check session exists before creating answer
      const session = await storage.getGameSession(answerData.sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const answer = await storage.createPlayerAnswer(answerData);
      res.status(201).json(answer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/session/:sessionId/answers", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const sessionId = req.params.sessionId;
      
      // Check session ownership first
      const session = await storage.getGameSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      if (session.playerEmail !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const answers = await storage.getSessionAnswers(sessionId);
      res.json(answers);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Achievement card route
  app.post("/api/achievement-card", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Security: Only allow sending to authenticated user's email
      const email = req.user.email;
      
      // Check if user already has a recent achievement card
      const hasRecent = await storage.hasRecentAchievementCard(email, 24);
      if (hasRecent) {
        return res.status(400).json({ message: "Achievement card already sent in the last 24 hours" });
      }
      
      // Get player's total score for the last 24 hours
      const totalScore = await storage.getPlayerTotalScore(req.user.email, 24);
      
      if (totalScore < 50) {
        return res.status(400).json({ message: "Minimum score of 50 points required for achievement card" });
      }
      
      // Send email
      const emailSent = await sendAchievementCard(email, totalScore);
      
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send achievement card email" });
      }
      
      // Record the achievement card
      const card = await storage.createAchievementCard({
        email,
        totalScore
      });
      
      res.status(201).json({ message: "Achievement card sent successfully", card });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // JSON Export route - accessible without authentication for admin purposes
  app.get("/api/export/game-sessions.json", async (req, res) => {
    try {
      // Get all game sessions with answers
      const data = await storage.getAllGameSessionsWithAnswers();
      
      // Set JSON response headers
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="ecoBlocks-game-sessions-${new Date().toISOString().split('T')[0]}.json"`);
      
      res.json({
        exportDate: new Date().toISOString(),
        totalSessions: data.length,
        data: data
      });
    } catch (error) {
      console.error('JSON Export Error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Export failed' });
    }
  });

  // Leaderboard route - public endpoint for game feature
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboardData = await storage.getLeaderboardData(limit);
      
      res.json({
        leaderboard: leaderboardData,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Leaderboard Error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to load leaderboard' });
    }
  });

  // CSV Export route - accessible without authentication for admin purposes
  app.get("/api/export/player-data.csv", async (req, res) => {
    try {
      // Get all game sessions with answers
      const data = await storage.getAllGameSessionsWithAnswers();
      
      // CSV headers
      const csvHeaders = [
        'Play ID',
        'Player Email', 
        'Session Start Time',
        'Session End Time',
        'Session Duration (seconds)',
        'Final Score',
        'Level Reached',
        'Lines Cleared',
        'Pieces Placed',
        'Sentences Attempted',
        'Sentences Completed',
        'Persona Cards Earned',
        'Device Type',
        'Browser Info',
        'Country',
        'Region',
        'Sentence ID',
        'Sentence Template',
        'Player Answer',
        'Answer Score',
        'Answer Timestamp'
      ].join(',');
      
      // Convert data to CSV rows
      const csvRows = data.map(row => [
        row.playId,
        row.playerEmail,
        row.sessionStartTime ? row.sessionStartTime.toISOString() : '',
        row.sessionEndTime ? row.sessionEndTime.toISOString() : '',
        row.sessionDuration,
        row.score,
        row.level,
        row.linesCleared,
        row.piecesPlaced,
        row.sentencesAttempted,
        row.sentencesCompleted,
        calculatePersonaCards(row.score),
        row.deviceType,
        `"${row.browserInfo.replace(/"/g, '""')}"`, // Escape quotes in browser info
        row.country,
        row.region,
        row.sentenceId,
        `"${row.sentenceTemplate.replace(/"/g, '""')}"`, // Escape quotes
        `"${row.playerAnswer.replace(/"/g, '""')}"`, // Escape quotes
        row.answerScore,
        row.answerTimestamp ? row.answerTimestamp.toISOString() : ''
      ].join(','));
      
      // Combine headers and rows
      const csvContent = [csvHeaders, ...csvRows].join('\n');
      
      // Set CSV response headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="ecoBlocks-player-data-${new Date().toISOString().split('T')[0]}.csv"`);
      
      res.send(csvContent);
    } catch (error) {
      console.error('CSV Export Error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Export failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
