import { Card } from './card';
import { Observable } from '@nativescript/core';

export class Player extends Observable {
  private _hand: Card[] = [];
  private _name: string;
  private _score: number = 0;

  constructor(name: string) {
    super();
    this._name = name;
  }

  get hand(): Card[] {
    return this._hand;
  }

  get name(): string {
    return this._name;
  }

  get score(): number {
    return this._score;
  }

  addToHand(cards: Card[]): void {
    this._hand.push(...cards);
    this.notifyPropertyChange('hand', this._hand);
  }

  playCard(index: number): Card {
    const card = this._hand.splice(index, 1)[0];
    this.notifyPropertyChange('hand', this._hand);
    return card;
  }

  addPoint(): void {
    this._score++;
    this.notifyPropertyChange('score', this._score);
  }
}