import { Card, Suit } from '../types';
import { CardEvaluator } from './card-evaluator';

export class PlayStrategy {
  selectBestCard(
    hand: Card[],
    trumpSuit: Suit,
    leadSuit: Suit | null,
    playedCards: Card[],
    isLeadPlayer: boolean
  ): number {
    if (isLeadPlayer) {
      return this.selectLeadCard(hand, trumpSuit);
    }

    return this.selectFollowCard(hand, trumpSuit, leadSuit!, playedCards);
  }

  private selectLeadCard(hand: Card[], trumpSuit: Suit): number {
    // Leading strategy: Lead with high non-trump cards first
    let bestIndex = 0;
    let bestScore = -Infinity;

    hand.forEach((card, index) => {
      if (card.suit !== trumpSuit) {
        const score = CardEvaluator.evaluateCardStrength(card, null, null);
        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      }
    });

    // If only trump cards remain, play lowest trump
    if (bestScore === -Infinity) {
      bestIndex = this.findLowestTrump(hand, trumpSuit);
    }

    return bestIndex;
  }

  private selectFollowCard(
    hand: Card[],
    trumpSuit: Suit,
    leadSuit: Suit,
    playedCards: Card[]
  ): number {
    const followingSuitCards = hand.filter(card => card.suit === leadSuit);

    // Must follow suit if possible
    if (followingSuitCards.length > 0) {
      return this.selectBestFollowingSuitCard(hand, followingSuitCards, playedCards);
    }

    // Can't follow suit, try to trump if partner isn't winning
    const partnerWinning = this.isPartnerWinning(playedCards);
    if (!partnerWinning) {
      const trumpCards = hand.filter(card => card.suit === trumpSuit);
      if (trumpCards.length > 0) {
        return this.findLowestTrump(hand, trumpSuit);
      }
    }

    // Throw off lowest card
    return this.findLowestCard(hand);
  }

  private selectBestFollowingSuitCard(
    hand: Card[],
    followingSuitCards: Card[],
    playedCards: Card[]
  ): number {
    const highestPlayed = this.getHighestPlayedCard(playedCards);
    
    // Try to win if possible
    const winningCards = followingSuitCards.filter(card => 
      CardEvaluator.evaluateCardStrength(card, null, null) > 
      CardEvaluator.evaluateCardStrength(highestPlayed, null, null)
    );

    if (winningCards.length > 0) {
      // Play lowest winning card
      const lowestWinner = winningCards.reduce((lowest, card) => 
        CardEvaluator.evaluateCardStrength(card, null, null) <
        CardEvaluator.evaluateCardStrength(lowest, null, null) ? card : lowest
      );
      return hand.indexOf(lowestWinner);
    }

    // Can't win, play lowest card
    return hand.indexOf(followingSuitCards[0]);
  }

  private findLowestTrump(hand: Card[], trumpSuit: Suit): number {
    let lowestIndex = 0;
    let lowestScore = Infinity;

    hand.forEach((card, index) => {
      if (card.suit === trumpSuit) {
        const score = CardEvaluator.evaluateCardStrength(card, trumpSuit, null);
        if (score < lowestScore) {
          lowestScore = score;
          lowestIndex = index;
        }
      }
    });

    return lowestIndex;
  }

  private findLowestCard(hand: Card[]): number {
    let lowestIndex = 0;
    let lowestScore = Infinity;

    hand.forEach((card, index) => {
      const score = CardEvaluator.evaluateCardStrength(card, null, null);
      if (score < lowestScore) {
        lowestScore = score;
        lowestIndex = index;
      }
    });

    return lowestIndex;
  }

  private getHighestPlayedCard(playedCards: Card[]): Card {
    return playedCards.reduce((highest, card) => 
      CardEvaluator.evaluateCardStrength(card, null, null) >
      CardEvaluator.evaluateCardStrength(highest, null, null) ? card : highest
    );
  }

  private isPartnerWinning(playedCards: Card[]): boolean {
    if (playedCards.length < 2) return false;
    const partnerCardIndex = playedCards.length - 2;
    const highestCard = this.getHighestPlayedCard(playedCards);
    return playedCards[partnerCardIndex] === highestCard;
  }
}