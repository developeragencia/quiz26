import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlayerSchema, insertGameResultSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create or get player
  app.post("/api/players", async (req, res) => {
    try {
      const playerData = insertPlayerSchema.parse(req.body);
      
      // Check if player already exists by Instagram
      const existingPlayer = await storage.getPlayerByInstagram(playerData.instagram);
      if (existingPlayer) {
        return res.json(existingPlayer);
      }
      
      const player = await storage.createPlayer(playerData);
      res.json(player);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get player by ID
  app.get("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.getPlayer(req.params.id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Save game result
  app.post("/api/game-results", async (req, res) => {
    try {
      const resultData = insertGameResultSchema.parse(req.body);
      const result = await storage.createGameResult(resultData);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get player's game history
  app.get("/api/players/:playerId/results", async (req, res) => {
    try {
      const results = await storage.getPlayerGameResults(req.params.playerId);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get leaderboard for a game mode
  app.get("/api/leaderboard/:gameMode", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(req.params.gameMode, limit);
      res.json(leaderboard);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
