import { useState } from "react";
import RegistrationForm from "@/components/registration-form";
import GameModeSelection from "@/components/game-mode-selection";
import CardMatchingGame from "@/components/card-matching-game";
import SuccessModal from "@/components/success-modal";
import FailureModal from "@/components/failure-modal";
import { type Player } from "@shared/schema";

type GameMode = 'romance' | 'spicy';
type Screen = 'registration' | 'mode-selection' | 'game';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('registration');
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameMatches, setGameMatches] = useState(0);

  const handlePlayerRegistered = (registeredPlayer: Player) => {
    setPlayer(registeredPlayer);
    setCurrentScreen('mode-selection');
  };

  const handleModeSelected = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentScreen('game');
  };

  const handleGameWon = (score: number, matches: number) => {
    setGameScore(score);
    setGameMatches(matches);
    setShowSuccessModal(true);
  };

  const handleGameLost = (score: number, matches: number) => {
    setGameScore(score);
    setGameMatches(matches);
    setShowFailureModal(true);
  };

  const handlePlayAgain = () => {
    setShowSuccessModal(false);
    setShowFailureModal(false);
    setGameScore(0);
    setGameMatches(0);
  };

  const handleChangeMode = () => {
    setShowFailureModal(false);
    setCurrentScreen('mode-selection');
    setGameMode(null);
    setGameScore(0);
    setGameMatches(0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentScreen === 'registration' && (
        <RegistrationForm onPlayerRegistered={handlePlayerRegistered} />
      )}
      
      {currentScreen === 'mode-selection' && player && (
        <GameModeSelection 
          player={player} 
          onModeSelected={handleModeSelected} 
        />
      )}
      
      {currentScreen === 'game' && player && gameMode && (
        <CardMatchingGame 
          player={player}
          gameMode={gameMode}
          onGameWon={handleGameWon}
          onGameLost={handleGameLost}
        />
      )}

      {showSuccessModal && player && gameMode && (
        <SuccessModal
          player={player}
          gameMode={gameMode}
          score={gameScore}
          matches={gameMatches}
          onPlayAgain={handlePlayAgain}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showFailureModal && player && gameMode && (
        <FailureModal
          player={player}
          gameMode={gameMode}
          score={gameScore}
          matches={gameMatches}
          onTryAgain={handlePlayAgain}
          onChangeMode={handleChangeMode}
          onClose={() => setShowFailureModal(false)}
        />
      )}
    </div>
  );
}
