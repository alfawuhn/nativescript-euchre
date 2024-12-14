import { Team } from './types';

export class TeamScore {
  private scores: Record<Team, number> = {
    'NS': 0,
    'EW': 0
  };

  addPoints(team: Team, points: number): void {
    this.scores[team] += points;
  }

  getScore(team: Team): number {
    return this.scores[team];
  }

  getWinningTeam(): Team | null {
    if (this.scores['NS'] >= 10) return 'NS';
    if (this.scores['EW'] >= 10) return 'EW';
    return null;
  }
}