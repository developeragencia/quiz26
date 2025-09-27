import { type Player, type InsertPlayer, type GameResult, type InsertGameResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Player methods
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayerByInstagram(instagram: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  
  // Game result methods
  createGameResult(result: InsertGameResult): Promise<GameResult>;
  getPlayerGameResults(playerId: string): Promise<GameResult[]>;
  getLeaderboard(gameMode: string, limit?: number): Promise<(GameResult & { playerName: string })[]>;
}

export class MemStorage implements IStorage {
  private players: Map<string, Player>;
  private gameResults: Map<string, GameResult>;

  constructor() {
    this.players = new Map();
    this.gameResults = new Map();
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayerByInstagram(instagram: string): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(
      (player) => player.instagram.toLowerCase() === instagram.toLowerCase(),
    );
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = { 
      ...insertPlayer, 
      id,
      createdAt: new Date()
    };
    this.players.set(id, player);
    return player;
  }

  async createGameResult(insertResult: InsertGameResult): Promise<GameResult> {
    const id = randomUUID();
    const gameResult: GameResult = { 
      ...insertResult,
      id,
      score: insertResult.score ?? 0,
      matches: insertResult.matches ?? 0,
      completed: insertResult.completed ?? 0,
      createdAt: new Date()
    };
    this.gameResults.set(id, gameResult);
    return gameResult;
  }

  async getPlayerGameResults(playerId: string): Promise<GameResult[]> {
    return Array.from(this.gameResults.values()).filter(
      (result) => result.playerId === playerId,
    );
  }

  async getLeaderboard(gameMode: string, limit = 10): Promise<(GameResult & { playerName: string })[]> {
    const results = Array.from(this.gameResults.values())
      .filter((result) => result.gameMode === gameMode && result.completed === 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results.map(result => {
      const player = this.players.get(result.playerId);
      return {
        ...result,
        playerName: player?.name || 'Unknown'
      };
    });
  }
}

export const storage = new MemStorage();
