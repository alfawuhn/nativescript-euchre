export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type Rank = '9' | '10' | 'Jack' | 'Queen' | 'King' | 'Ace';
export type Team = 'NS' | 'EW';  // North-South or East-West teams

export interface TrickResult {
  winningCard: Card;
  winningPlayerIndex: number;
  points: number;
}

export interface GameState {
  trumpSuit: Suit | null;
  currentPlayerIndex: number;
  dealerIndex: number;
  scores: Record<Team, number>;
  phase: 'bidding' | 'playing';
}