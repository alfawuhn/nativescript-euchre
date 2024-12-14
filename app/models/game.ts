import { Observable } from '@nativescript/core';
import { Deck } from './deck';
import { Player } from './player';
import { ComputerPlayer } from './ai/computer-player';
import { Trick } from './trick';
import { TeamScore } from './team';
import { Card, Suit, Team, GameState } from './types';

export class EuchreGame extends Observable {
  private deck: Deck;
  private players: (Player | ComputerPlayer)[] = [];
  private teamScore: TeamScore;
  private currentTrick: Trick | null = null;
  private state: GameState = {
    trumpSuit: null,
    currentPlayerIndex: 0,
    dealerIndex: 0,
    scores: { 'NS': 0, 'EW': 0 },
    phase: 'bidding'
  };

  constructor() {
    super();
    this.deck = new Deck();
    this.teamScore = new TeamScore();
    this.initializePlayers();
  }

  get gameState(): GameState {
    return this.state;
  }

  get currentTrickDisplay(): string {
    return this.currentTrick?.cards.map(card => card.toString()).join(' ') || '';
  }

  get trumpSuitDisplay(): string {
    return this.state.trumpSuit ? `Trump: ${this.state.trumpSuit}` : 'Bidding Phase';
  }

  private initializePlayers(): void {
    this.players = [
      new ComputerPlayer('North'),
      new ComputerPlayer('East'),
      new Player('South'),
      new ComputerPlayer('West')
    ];
  }

  private dealCards(): void {
    this.deck.shuffle();
    // Deal 5 cards to each player
    for (let i = 0; i < this.players.length; i++) {
      const cards = this.deck.deal(5);
      this.players[i].addToHand(cards);
    }
  }

  startNewGame(): void {
    this.deck = new Deck();
    this.deck.shuffle();
    this.dealCards();
    this.state.phase = 'bidding';
    this.state.currentPlayerIndex = (this.state.dealerIndex + 1) % 4;
    this.notifyPropertyChange('gameState', this.state);
    
    if (this.state.currentPlayerIndex !== 2) { // If not human player
      this.handleComputerTurn();
    }
  }

  setTrumpSuit(suit: Suit): void {
    this.state.trumpSuit = suit;
    this.state.phase = 'playing';
    this.currentTrick = new Trick(suit);
    this.notifyPropertyChange('gameState', this.state);
    this.notifyPropertyChange('trumpSuitDisplay', this.trumpSuitDisplay);

    if (this.state.currentPlayerIndex !== 2) {
      this.handleComputerTurn();
    }
  }

  private handleComputerTurn(): void {
    setTimeout(() => {
      const currentPlayer = this.players[this.state.currentPlayerIndex] as ComputerPlayer;
      
      if (this.state.phase === 'bidding') {
        const shouldBid = currentPlayer.decideBid(this.deck.getTopCard(), 1);
        if (shouldBid) {
          this.setTrumpSuit(this.deck.getTopCard().suit);
        } else {
          this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % 4;
          this.notifyPropertyChange('gameState', this.state);
          
          if (this.state.currentPlayerIndex !== 2) {
            this.handleComputerTurn();
          }
        }
      } else if (this.state.phase === 'playing') {
        const cardIndex = currentPlayer.chooseCard(
          this.state.trumpSuit!,
          this.currentTrick?.leadSuit || null,
          this.currentTrick?.cards || [],
          !this.currentTrick?.leadSuit
        );
        this.playCard(this.state.currentPlayerIndex, cardIndex);
      }
    }, 1000);
  }

  playCard(playerIndex: number, cardIndex: number): void {
    if (this.state.phase !== 'playing' || 
        playerIndex !== this.state.currentPlayerIndex || 
        !this.currentTrick) return;

    const player = this.players[playerIndex];
    const card = player.playCard(cardIndex);
    this.currentTrick.addCard(card);
    this.notifyPropertyChange('currentTrickDisplay', this.currentTrickDisplay);

    if (this.currentTrick.cards.length === 4) {
      this.resolveTrick();
    } else {
      this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % 4;
      this.notifyPropertyChange('gameState', this.state);
      
      if (this.state.currentPlayerIndex !== 2) {
        this.handleComputerTurn();
      }
    }
  }

  private resolveTrick(): void {
    if (!this.currentTrick) return;

    const winningIndex = this.currentTrick.getWinningCardIndex();
    const winningPlayerIndex = (this.state.currentPlayerIndex + winningIndex + 1) % 4;
    const winningTeam = winningPlayerIndex % 2 === 0 ? 'NS' : 'EW';
    
    this.state.scores[winningTeam]++;
    this.notifyPropertyChange('gameState', this.state);

    // Start new trick
    this.currentTrick = new Trick(this.state.trumpSuit!);
    this.state.currentPlayerIndex = winningPlayerIndex;
    this.notifyPropertyChange('currentTrickDisplay', this.currentTrickDisplay);

    if (this.state.currentPlayerIndex !== 2) {
      this.handleComputerTurn();
    }
  }
}