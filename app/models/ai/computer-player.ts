import { Player } from '../player';
import { Card, Suit } from '../types';
import { CardEvaluator } from './card-evaluator';
import { BidAnalyzer } from './partnership/bid-analyzer';
import { PlayAnalyzer } from './partnership/play-analyzer';
import { PartnershipTracker, TeamContext } from './partnership/team-context';

export class ComputerPlayer extends Player {
  private context: TeamContext | null = null;

  constructor(name: string) {
    super(name);
  }

  setGameContext(playerIndex: number, dealerIndex: number, tricksWon: number): void {
    this.context = PartnershipTracker.createContext(playerIndex, dealerIndex, tricksWon);
  }

  decideBid(trumpCandidate: Card, roundNumber: number): boolean {
    if (!this.context) return false;
    
    return BidAnalyzer.shouldBid(
      this.hand,
      trumpCandidate,
      roundNumber,
      this.context
    );
  }

  chooseCard(
    trumpSuit: Suit,
    leadSuit: Suit | null,
    playedCards: Card[],
    isLeadPlayer: boolean
  ): number {
    if (!this.context) return 0;

    if (isLeadPlayer) {
      return this.selectLeadCard(trumpSuit);
    }

    return PlayAnalyzer.analyzePlay(
      this.hand,
      trumpSuit,
      leadSuit,
      playedCards,
      this.context
    );
  }

  private selectLeadCard(trumpSuit: Suit): number {
    // Lead high non-trump cards first
    let bestIndex = 0;
    let bestScore = -Infinity;

    this.hand.forEach((card, index) => {
      if (card.suit !== trumpSuit) {
        const score = CardEvaluator.evaluateCardStrength(card, null, null);
        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      }
    });

    return bestScore > -Infinity ? bestIndex : 0;
  }
}