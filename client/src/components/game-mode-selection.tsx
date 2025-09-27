import { Heart, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Player } from "@shared/schema";

type GameMode = 'romance' | 'spicy';

interface GameModeSelectionProps {
  player: Player;
  onModeSelected: (mode: GameMode) => void;
}

export default function GameModeSelection({ player, onModeSelected }: GameModeSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Escolha Seu Desafio
        </h2>
        <p className="text-muted-foreground mb-12 text-lg">
          Selecione um modo de jogo e encontre 3 pares para ganhar!
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="border-border hover:border-primary transition-all cursor-pointer transform hover:scale-105"
            data-testid="card-romance-mode"
            onClick={() => onModeSelected('romance')}
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-pink-400">Modo Romance</h3>
              <p className="text-muted-foreground mb-6">Um desafio divertido com temas românticos</p>
              <div className="flex justify-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-border hover:border-primary transition-all cursor-pointer transform hover:scale-105"
            data-testid="card-spicy-mode"
            onClick={() => onModeSelected('spicy')}
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Modo Picante</h3>
              <p className="text-muted-foreground mb-6">Um desafio mais ousado e emocionante</p>
              <div className="flex justify-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <div className="inline-flex items-center space-x-4 bg-muted rounded-full px-6 py-3">
            <span className="text-sm font-medium">Jogador:</span>
            <span className="text-accent font-semibold" data-testid="text-player-name">
              {player.name}
            </span>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm" data-testid="text-player-zodiac">
              {player.zodiacSign}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
