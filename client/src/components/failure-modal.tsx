import { ThumbsDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodiacMessages, playfulTips } from "@/lib/zodiac";
import { type Player } from "@shared/schema";

type GameMode = 'romance' | 'spicy';

interface FailureModalProps {
  player: Player;
  gameMode: GameMode;
  score: number;
  matches: number;
  onTryAgain: () => void;
  onChangeMode: () => void;
  onClose: () => void;
}

export default function FailureModal({ 
  player, 
  gameMode, 
  score, 
  matches, 
  onTryAgain, 
  onChangeMode, 
  onClose 
}: FailureModalProps) {
  const zodiacKey = player.zodiacSign.split(' ')[1]?.toLowerCase() || 'aries';
  const zodiacMessage = zodiacMessages[zodiacKey] || zodiacMessages.aries;
  const randomTip = playfulTips[Math.floor(Math.random() * playfulTips.length)];

  const gameModeMessages = {
    romance: [
      "O amor exige paciência! Tente novamente e deixe seu coração te guiar! 💖",
      "Romance é sobre persistência - não desista! 🌹",
      "Toda grande história de amor tem seus desafios! 💕"
    ],
    spicy: [
      "Às vezes você precisa esquentar as coisas devagar! 🔥",
      "Apimente as coisas com mais uma tentativa! 🌶️",
      "Coisas quentes exigem prática! 💋"
    ]
  };

  const modeSpecificMessage = gameModeMessages[gameMode][Math.floor(Math.random() * gameModeMessages[gameMode].length)];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md border-border" data-testid="modal-failure">
        <div className="text-center p-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ThumbsDown className="h-10 w-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4 text-red-400">
            Ops! 😅
          </h3>
          
          <p className="text-muted-foreground mb-6">
            Não foi dessa vez, mas não desista!
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium mb-2">
                Conselho do Signo para <span data-testid="text-zodiac-sign">{player.zodiacSign}</span>:
              </p>
              <p className="text-sm" data-testid="text-zodiac-message">
                {zodiacMessage}
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <p className="text-sm text-accent font-medium">Dica Divertida:</p>
              <p className="text-xs mt-1" data-testid="text-playful-tip">
                {randomTip}
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-primary font-medium">Mensagem do Modo:</p>
              <p className="text-xs mt-1" data-testid="text-mode-message">
                {modeSpecificMessage}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Sua pontuação: <span className="text-accent font-bold">{score}</span></p>
              <p>Pares encontrados: <span className="text-primary font-bold">{matches}/3</span></p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button
              onClick={onTryAgain}
              className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
              data-testid="button-try-again"
            >
              Tentar Novamente
            </Button>
            <Button
              onClick={onChangeMode}
              variant="outline"
              className="flex-1 bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              data-testid="button-change-mode"
            >
              Mudar Modo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
