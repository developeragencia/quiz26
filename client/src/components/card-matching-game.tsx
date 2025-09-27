import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, RotateCcw, Info } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Player } from "@shared/schema";

type GameMode = 'romance' | 'spicy';

interface GameCard {
  id: number;
  symbol: string;
  type: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface CardMatchingGameProps {
  player: Player;
  gameMode: GameMode;
  onGameWon: (score: number, matches: number) => void;
  onGameLost: (score: number, matches: number) => void;
}

const cardSymbols = {
  romance: ['💖', '💕', '💘', '🌹', '💝', '💗'],
  spicy: ['🔥', '🌶️', '💋', '🍑', '🍆', '🍒']
};

export default function CardMatchingGame({ player, gameMode, onGameWon, onGameLost }: CardMatchingGameProps) {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const saveGameResultMutation = useMutation({
    mutationFn: async (data: { playerId: string; gameMode: string; score: number; matches: number; completed: number }) => {
      const res = await apiRequest("POST", "/api/game-results", data);
      return res.json();
    },
  });

  const initializeGame = () => {
    const symbols = cardSymbols[gameMode];
    const gameCards: GameCard[] = [];
    let cardId = 0;

    // Create 3 sets of matching cards (total 18 cards, 6x3)
    symbols.forEach((symbol, typeIndex) => {
      for (let i = 0; i < 3; i++) {
        gameCards.push({
          id: cardId++,
          symbol,
          type: typeIndex.toString(),
          isFlipped: false,
          isMatched: false,
        });
      }
    });

    // Shuffle the cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setMatches(0);
    setAttempts(0);
  };

  useEffect(() => {
    initializeGame();
  }, [gameMode]);

  const handleCardClick = (cardId: number) => {
    if (isChecking || flippedCards.length >= 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setIsChecking(true);
      
      setTimeout(() => {
        checkForMatch(newFlippedCards, newAttempts);
        setIsChecking(false);
      }, 1000);
    }
  };

  const checkForMatch = (flippedCardIds: number[], currentAttempts: number = attempts) => {
    const [card1Id, card2Id] = flippedCardIds;
    const card1 = cards.find(c => c.id === card1Id);
    const card2 = cards.find(c => c.id === card2Id);

    if (card1 && card2 && card1.type === card2.type) {
      // Match found
      const newMatchedCards = [...matchedCards, card1Id, card2Id];
      setMatchedCards(newMatchedCards);
      setMatches(prev => prev + 1);
      setScore(prev => prev + 10);

      // Check if we have 3 matches (3 pairs = win)
      if (matches + 1 >= 3) {
        const finalScore = score + 10;
        const finalMatches = matches + 1;
        saveGameResultMutation.mutate({
          playerId: player.id,
          gameMode,
          score: finalScore,
          matches: finalMatches,
          completed: 1,
        });
        onGameWon(finalScore, finalMatches);
      }
    } else {
      // No match
      if (currentAttempts >= 5) {
        // Game over after too many attempts
        saveGameResultMutation.mutate({
          playerId: player.id,
          gameMode,
          score,
          matches,
          completed: 0,
        });
        onGameLost(score, matches);
      }
    }

    setFlippedCards([]);
  };

  const showHint = () => {
    const unmatched = cards.filter(card => !matchedCards.includes(card.id));
    const cardTypes = unmatched.map(card => card.type);
    const duplicates = cardTypes.filter((type, index) => cardTypes.indexOf(type) !== index);
    
    if (duplicates.length > 0) {
      const hintType = duplicates[0];
      const hintCards = unmatched.filter(card => card.type === hintType).slice(0, 2);
      
      hintCards.forEach(card => {
        const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
        cardElement?.classList.add('ring-2', 'ring-accent');
        setTimeout(() => {
          cardElement?.classList.remove('ring-2', 'ring-accent');
        }, 2000);
      });

      toast({
        title: "Dica",
        description: "Procure pelas cartas destacadas!",
      });
    }
  };

  const modeName = gameMode === 'romance' ? 'Modo Romance' : 'Modo Picante';
  const playerInitial = player.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <Card className="mb-8 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground" data-testid="text-player-initial">
                    {playerInitial}
                  </span>
                </div>
                <div>
                  <p className="font-semibold" data-testid="text-player-name">{player.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <span data-testid="text-player-zodiac">{player.zodiacSign}</span> | 
                    <span className="ml-1" data-testid="text-game-mode">{modeName}</span>
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent" data-testid="text-score">{score}</p>
                    <p className="text-xs text-muted-foreground">Pontos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary" data-testid="text-matches">{matches}/3</p>
                    <p className="text-xs text-muted-foreground">Pares</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary" data-testid="text-attempts">{attempts}/5</p>
                    <p className="text-xs text-muted-foreground">Tentativas</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Instructions */}
        <div className="bg-muted rounded-lg p-4 mb-8 border-l-4 border-accent">
          <p className="text-sm">
            <Info className="inline h-4 w-4 text-accent mr-2" />
            Encontre 3 pares iguais para ganhar! Você tem 5 tentativas. Clique nas cartas para virá-las e revelar os símbolos.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto mb-8">
          {cards.map((card) => {
            const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id);
            const isMatched = matchedCards.includes(card.id);
            
            return (
              <div
                key={card.id}
                className={`card-flip relative h-24 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
                data-card-id={card.id}
                data-testid={`card-${card.id}`}
                onClick={() => handleCardClick(card.id)}
                style={{ opacity: isMatched ? 0.6 : 1 }}
              >
                <div className="card-front absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg border-2 border-border flex items-center justify-center">
                  <span className="text-2xl text-primary-foreground">?</span>
                </div>
                <div className="card-back absolute inset-0 bg-card rounded-lg border-2 border-accent flex items-center justify-center">
                  <span className="text-2xl">{card.symbol}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Game Actions */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={showHint}
            className="mr-4 bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            data-testid="button-hint"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Dica
          </Button>
          <Button
            variant="outline"
            onClick={initializeGame}
            className="bg-secondary text-secondary-foreground hover:opacity-90"
            data-testid="button-restart"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Novo Jogo
          </Button>
        </div>
      </div>
    </div>
  );
}
