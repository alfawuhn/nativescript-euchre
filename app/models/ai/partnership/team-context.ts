import { Card, Suit, Team } from '../../types';

export interface TeamContext {
  partnerIndex: number;
  team: Team;
  tricksWon: number;
  isDealer: boolean;
}

export class PartnershipTracker {
  private static getTeam(playerIndex: number): Team {
    return playerIndex % 2 === 0 ? 'NS' : 'EW';
  }

  static getPartnerIndex(playerIndex: number): number {
    return (playerIndex + 2) % 4;
  }

  static createContext(playerIndex: number, dealerIndex: number, tricksWon: number): TeamContext {
    return {
      partnerIndex: this.getPartnerIndex(playerIndex),
      team: this.getTeam(playerIndex),
      tricksWon,
      isDealer: playerIndex === dealerIndex
    };
  }
}