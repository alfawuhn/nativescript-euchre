import { Card, Suit } from '../../types';
import { CardEvaluator } from '../card-evaluator';
import { TeamContext } from './team-context';

export class PlayAnalyzer {
  static analyzePlay(
    hand: Card[],
    trumpSuit: Suit,
    leadSuit: Suit | null,
    playedCards: Card[],
    context: TeamContext
  ): number {
    const partnerCard = this.getPartnerCard(playedCards, context.partnerIndex);
    const isPartnerWinning = this.isCardWinning(partnerCard, playedCards, trumpSuit, leadSuit);

    if (isPartnerWinning) {
      return this.selectSavingPlay(hand, trumpSuit, leadSuit);
    }

    return this.selectAggressivePlay(hand, trumpSuit, leadSuit, playedCards);
  }

  private static getPartnerCard(playedCards: Card[], partnerIndex: number): Card | null {
    const partnerPosition = partnerIndex % playedCards.length;
    return playedCards[partnerPosition] || null;
  }

  private static isCardWinning(
    card: Card | null,
    playedCards: Card[],
    trumpSuit: Suit,
    leadSuit: Suit | null
  ): boolean {
    if (!card) return false;
    
    return !playedCards.some(played => 
      CardEvaluator.evaluateCardStrength(played, trumpSuit, leadSuit) >
      CardEvaluator.evaluateCardStrength(card, trumpSuit, leadSuit)
    );
  }

  private static selectSavingPlay(
    hand: Card[],
    trumpSuit: Suit,
    leadSuit: Suit | null
  ): number {
    // Play lowest valid card to save stronger cards
    let lowestScore = Infinity;
    let lowestIndex = 0;

    hand.forEach((card, index) => {
      if (leadSuit && card.suit !== leadSuit && hand.some(c => c.suit === leadSuit)) {
        return; // Must follow suit if possible
      }

      const score = CardEvaluator.evaluateCardStrength(card, trumpSuit, leadSuit);
      if (score < lowestScore) {
        lowestScore = score;
        lowestIndex = index;
      }
    });

    return lowestIndex;
  }

  private static selectAggressivePlay(
    hand: Card[],
    trumpSuit: Suit,
    leadSuit: Suit | null,
    playedCards: Card[]
  ): number {
    // Try to win the trick with the lowest winning card
    let lowestWinningScore = Infinity;
    let lowestWinningIndex = -1;
    const highestPlayedScore = Math.max(...playedCards.map(card => 
      CardEvaluator.evaluateCardStrength(card, trumpSuit, leadSuit)
    ));

    hand.forEach((card, index) => {
      if (leadSuit && card.suit !== leadSuit && hand.some(c => c.suit === leadSuit)) {
        return; // Must follow suit if possible
      }

      const score = CardEvaluator.evaluateCardStrength(card, trumpSuit, leadSuit);
      if (score > highestPlayedScore && score < lowestWinningScore) {
        lowestWinningScore = score;
        lowestWinningIndex = index;
      }
    });

    return lowestWinningIndex >= 0 ? lowestWinningIndex : this.selectSavingPlay(hand, trumpSuit, leadSuit);
  }
}