import { Card, Suit } from '../../types';
import { CardEvaluator } from '../card-evaluator';
import { TeamContext } from './team-context';

export class BidAnalyzer {
  static shouldBid(
    hand: Card[],
    trumpCandidate: Card,
    roundNumber: number,
    context: TeamContext
  ): boolean {
    const handStrength = CardEvaluator.evaluateHandStrength(hand, trumpCandidate.suit);
    const baseThreshold = roundNumber === 1 ? 250 : 200;
    
    // Adjust threshold based on context
    let adjustedThreshold = baseThreshold;

    // More aggressive if partner is dealer (can discard)
    if (context.partnerIndex === context.isDealer) {
      adjustedThreshold -= 20;
    }

    // More aggressive if losing
    if (context.tricksWon < 2) {
      adjustedThreshold -= 15;
    }

    return handStrength > adjustedThreshold;
  }
}