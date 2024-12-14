import { Suit, Rank } from '../models/types';

export function isSameColor(suit1: Suit, suit2: Suit): boolean {
  return (
    (suit1 === 'Hearts' && suit2 === 'Diamonds') ||
    (suit1 === 'Diamonds' && suit2 === 'Hearts') ||
    (suit1 === 'Clubs' && suit2 === 'Spades') ||
    (suit1 === 'Spades' && suit2 === 'Clubs')
  );
}

export function getCardValue(rank: Rank): number {
  const values: Record<Rank, number> = {
    '9': 9,
    '10': 10,
    'Jack': 11,
    'Queen': 12,
    'King': 13,
    'Ace': 14
  };
  return values[rank];
}

export function getLeftBowerSuit(trumpSuit: Suit): Suit {
  const pairs: Record<Suit, Suit> = {
    'Hearts': 'Diamonds',
    'Diamonds': 'Hearts',
    'Clubs': 'Spades',
    'Spades': 'Clubs'
  };
  return pairs[trumpSuit];
}