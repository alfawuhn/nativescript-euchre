import { Observable } from '@nativescript/core';
import { EuchreGame } from './models/game';
import { Suit } from './models/types';

export class MainViewModel extends Observable {
  private game: EuchreGame;

  constructor() {
    super();
    this.game = new EuchreGame();
    this.startNewGame();
  }

  startNewGame(): void {
    this.game.startNewGame();
  }

  get currentPlayer() {
    return this.game.gameState.currentPlayerIndex === 2 ? this.game.players[2] : null;
  }

  get phase() {
    return this.game.gameState.phase;
  }

  get trumpSuitDisplay() {
    return this.game.trumpSuitDisplay;
  }

  get currentTrickDisplay() {
    return this.game.currentTrickDisplay;
  }

  onCardTap(args: any): void {
    const cardIndex = args.index;
    this.game.playCard(2, cardIndex); // 2 is the human player index
  }

  onSuitSelect(suit: Suit): void {
    if (this.phase === 'bidding') {
      this.game.setTrumpSuit(suit);
    }
  }
}