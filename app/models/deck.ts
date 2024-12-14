import { Card, Suit, Rank } from './types';

export class Deck {
  private cards: Card[] = [];
  private topCard: Card | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks: Rank[] = ['9', '10', 'Jack', 'Queen', 'King', 'Ace'];

    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push(new Card(suit, rank));
      }
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    // Set top card for bidding
    this.topCard = this.cards[0];
  }

  deal(numCards: number): Card[] {
    return this.cards.splice(1, numCards); // Start from index 1 to preserve top card
  }

  getTopCard(): Card {
    return this.topCard!;
  }
}