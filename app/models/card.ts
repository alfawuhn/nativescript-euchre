export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type Rank = '9' | '10' | 'Jack' | 'Queen' | 'King' | 'Ace';

export class Card {
  constructor(
    public suit: Suit,
    public rank: Rank,
    public isLeftBower: boolean = false
  ) {}

  toString(): string {
    return `${this.rank} of ${this.suit}`;
  }

  // In Euchre, Jack of the same color as trump is the Left Bower
  setAsLeftBower(): void {
    this.isLeftBower = true;
  }
}