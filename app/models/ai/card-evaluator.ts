import { Card, Suit } from '../types';
import { getCardValue, getLeftBowerSuit, isSameColor } from '../../utils/card-utils';

export class CardEvaluator {
  static evaluateCardStrength(card: Card, trumpSuit: Suit | null, leadSuit: Suit | null): number {
    if (!trumpSuit) return getCardValue(card.rank);

    // Right bower
    if (card.rank === 'Jack' && card.suit === trumpSuit) {
      return 20;
    }

    // Left bower
    if (card.rank === 'Jack' && card.suit === getLeftBowerSuit(trumpSuit)) {
      return 19;
    }

    // Trump suit
    if (card.suit === trumpSuit) {
      return getCardValue(card.rank) + 100;
    }

    // Following lead suit
    if (leadSuit && card.suit === leadSuit) {
      return getCardValue(card.rank);
    }

    return getCardValue(card.rank) - 50; // Penalize off-suit cards
  }

  static evaluateHandStrength(hand: Card[], trumpSuit: Suit | null): number {
    return hand.reduce((total, card) => 
      total + this.evaluateCardStrength(card, trumpSuit, null), 0);
  }
}