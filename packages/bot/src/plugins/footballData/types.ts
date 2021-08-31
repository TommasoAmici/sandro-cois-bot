export interface Match {
  readonly id: number;
  readonly season: Season;
  readonly utcDate: string;
  readonly status: string;
  readonly attendance: number;
  readonly matchday: number;
  readonly stage: string;
  readonly group: string;
  readonly lastUpdated: string;
  readonly homeTeam: Team;
  readonly awayTeam: Team;
  readonly score: {
    readonly winner: string;
    readonly duration: string;
    readonly fullTime: PartialScore;
    readonly halfTime: PartialScore;
    readonly extraTime?: PartialScore;
    readonly pentalties?: PartialScore;
  };
  readonly goals: Goal[];
  readonly bookings: Booking[];
  readonly substitutions: Substitution[];
  readonly referees: Referee[];
}

export interface Referee {
  readonly id: number;
  readonly name: string;
  readonly nationality?: string;
}

export interface Substitution {
  readonly minute: number;
  readonly team: Team;
  readonly playerOut: Player;
  readonly playerIn: Player;
}

export interface Booking {
  readonly minute: number;
  readonly team: Team;
  readonly player: Player;
  readonly card: string;
}

export interface Goal {
  readonly minute: number;
  readonly type?: string;
  readonly team: Team;
  readonly scorer: Player;
  readonly assist?: Player;
}

export interface PartialScore {
  readonly homeTeam?: number;
  readonly awayTeam?: number;
}

export interface Matches {
  readonly count: number;
  readonly filters: {
    readonly matchday?: string;
  };
  readonly competition: Competition;
  readonly matches: Match[];
}
export interface Table {
  readonly position: number;
  readonly team: Team;
  readonly playedGames: number;
  readonly won: number;
  readonly draw: number;
  readonly lost: number;
  readonly points: number;
  readonly goalsFor: number;
  readonly goalsAgainst: number;
  readonly goalDifference: number;
}

export interface Standing {
  readonly stage: string;
  readonly type: string;
  readonly group?: string;
  readonly table: Table[];
}

export interface Player {
  readonly id: number;
  readonly name: string;
  readonly shirtNumber: number;
  readonly position?: string;
}

export interface Team {
  readonly id: number;
  readonly name: string;
  readonly shortName?: string;
  readonly tla?: string;
  readonly crestUrl?: string;
  readonly coach?: {
    readonly id: number;
    readonly name: string;
    readonly countryOfBirth: string;
    readonly nationality: string;
  };
  readonly captain?: Player;
  readonly lineup?: Player[];
  readonly bench?: Player[];
}

export interface Season {
  readonly id: number;
  readonly startDate: string;
  readonly endDate: string;
  readonly currentMatchday: number;
  readonly availableStages?: string[];
  readonly winner?: Team;
}

export interface Competition {
  readonly id: number;
  readonly area: {
    readonly id: number;
    readonly name: string;
  };
  readonly name: string;
  readonly code: string;
  readonly plan: string;
  readonly lastUpdated: string;
  readonly emblemUrl?: string;
  readonly currentSeason: Season;
  readonly seasons: Season[];
}

export interface Standings {
  readonly filters: object;
  readonly competition: Competition;
  readonly season: Season;
  readonly standings: Standing[];
}
