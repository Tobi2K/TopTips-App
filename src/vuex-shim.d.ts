import { Store } from "vuex";

declare module "@vue/runtime-core" {
  interface State {
    currentGameday: number;
    guessesForOpenGame: Guess[] | null;
    userGuessForOpenGame: {
      pointsTeam1: number;
      pointsTeam2: number;
      bet: number;
    };
    pointsForGroup: (string | number)[] | null;
    user: {
      username: string;
      accessToken: string;
    };
    countries: Country[];
    competitions: Competition[];
    seasons: Season[];
    userSeasons: Season[];
    newGroupSeason: {
      name: string;
      year: number;
      start_date: Date;
      end_date: Date;
    };
    groupData: {
      id: number;
      name: string;
      passphrase?: string;
      owner: {
        name: string;
      };
      season: {
        name: string;
        start_date: Date;
        end_date: Date;
      };
      members: string[];
    };
    userGroups: Group[];
    currentGroupID: number;
    allGames: GameDay[];
    showSelectGroup: boolean;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

export interface State {
  currentGameday: number;
  guessesForOpenGame: Guess[] | null;
  userGuessForOpenGame: {
    pointsTeam1: number;
    pointsTeam2: number;
    bet: number;
  };
  pointsForGroup: (string | number)[] | null;
  user: {
    username: string;
    accessToken: string;
  };
  countries: Country[];
  competitions: Competition[];
  seasons: Season[];
  userSeasons: Season[];
  newGroupSeason: {
    name: string;
    year: number;
    start_date: Date;
    end_date: Date;
  };
  groupData: {
    id: number;
    name: string;
    passphrase?: string;
    owner: {
      name: string;
    };
    season: {
      name: string;
      start_date: Date;
      end_date: Date;
    };
    members: string[];
  };
  userGroups: Group[];
  currentGroupID: number;
  allGames: GameDay[];
  showSelectGroup: boolean;
  loading: boolean;
}

export interface Guess {
  name: string;
  guess_string: string;
  bet: number;
  points: number;
}

export interface Country {
  country: string;
}

export interface Competition {
  id: number;
  competition_id: string;
  name: string;
  gender: string;
  country: string;
}

export interface Season {
  id: number;
  season_id: string;
  name: string;
  start_date: string;
  end_date: string;
  year: string;
  important: number;
  current_gameday: number;
  competition: Competition;
}

export interface Group {
  id: number;
  group: {
    id: number;
    name: string;
    passphrase: string | null;
    owner: {
      name: string;
    };
    season: Season;
  };
}

export interface GameDay {
  games: FormattedGame[];
  special: boolean;
}

export interface FormattedGame {
  id: number;
  date: string;
  date_string: string;
  team1_id: number;
  team1_abbr: string;
  team1_background: string;
  team1_text: string;
  team2_id: number;
  team2_abbr: string;
  team2_background: string;
  team2_text: string;
  team1_name: string;
  team2_name: string;
  bet_name: string;
  bet_string: string;
  game_string: string;
  game_desc: string | null;
}
