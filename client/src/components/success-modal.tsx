import { ThumbsUp, Share } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Player } from "@shared/schema";

type GameMode = 'romance' | 'spicy';

interface SuccessModalProps {
  player: Player;
  gameMode: GameMode;
  score: number;
  matches: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export default function SuccessModal({ 
  player, 
  gameMode, 
  score, 
  matches, 
  onPlayAgain, 
  onClose 
}: SuccessModalProps) {
  const handleShare = () => {
    const text = `Acabei de ganhar ${score} pontos jogando Acerte e Ganhe no modo ${gameMode === 'romance' ? 'Romance' : 'Picante'}! 🎉`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Acerte e Ganhe',
        text,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md border-border" data-testid="modal-success">
        <div className="text-center p-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ThumbsUp className="h-10 w-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4 text-green-400">
            Incrível! 🎉
          </h3>
          
          <p className="text-muted-foreground mb-6">
            Você encontrou todos os pares! Ótimo trabalho!
          </p>
          
          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="text-sm space-y-1">
              <p>Pontuação Final: <span className="font-bold text-accent">{score}</span></p>
              <p>Pares Encontrados: <span className="font-bold text-primary">{matches}/3</span></p>
            </div>
            <p className="text-sm mt-3 text-green-400 font-medium" data-testid="text-success-message">
              Parabéns {player.name}! Sua determinação de {player.zodiacSign.split(' ')[1]} valeu a pena! 🌟
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Button
              onClick={onPlayAgain}
              className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
              data-testid="button-play-again"
            >
              Jogar Novamente
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 bg-secondary text-secondary-foreground hover:opacity-90"
              data-testid="button-share"
            >
              Compartilhar
              <Share className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
