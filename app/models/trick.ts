import { Card, Suit } from './types';
import { getCardValue, getLeftBowerSuit } from '../utils/card-utils';

export class Trick {
  private cards: Card[] = [];
  private leadSuit: Suit | null = null;
  private readonly trumpSuit: Suit | null;

  constructor(trumpSuit: Suit | null) {
    this.trumpSuit = trumpSuit;
  }

  addCard(card: Card): void {
    if (!this.leadSuit) {
      this.leadSuit = card.suit;
    }
    this.cards.push(card);
  }

  getWinningCardIndex(): number {
    if (!this.cards.length) return -1;

    let winningIndex = 0;
    let winningValue = this.getEffectiveValue(this.cards[0]);

    for (let i = 1; i < this.cards.length; i++) {
      const currentValue = this.getEffectiveValue(this.cards[i]);
      if (currentValue > winningValue) {
        winningValue = currentValue;
        winningIndex = i;
      }
    }

    return winningIndex;
  }

  private getEffectiveValue(card: Card): number {
    if (!this.trumpSuit) return getCardValue(card.rank);

    // Right bower
    if (card.rank === 'Jack' && card.suit === this.trumpSuit) {
      return 20;
    }

    // Left bower
    if (card.rank === 'Jack' && card.suit === getLeftBowerSuit(this.trumpSuit)) {
      return 19;
    }

    // Trump suit
    if (card.suit === this.trumpSuit) {
      return getCardValue(card.rank) + 100;
    }

    // Lead suit
    if (card.suit === this.leadSuit) {
      return getCardValue(card.rank);
    }

    // Off suit
    return 0;
  }

  get cards(): Card[] {
    return this.cards;
  }
}