/* eslint-disable */
import { Store } from "vuex";
import VueRouter, { Route } from "@ionic/vue-router";

declare module "@vue/runtime-core" {
  interface State {
    currentGameday: number;
    guessesForOpenGame: Guess[] | null;
    userGuessForOpenGame: {
      pointsTeam1: number;
      pointsTeam2: number;
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
    userSubscriptions: Season[];
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
    $router: VueRouter;
  }
}

export interface State {
  currentGameday: number;
  guessesForOpenGame: Guess[] | null;
  userGuessForOpenGame: {
    pointsTeam1: number;
    pointsTeam2: number;
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
  userSubscriptions: [];
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
  activeGamedays: Number[];
  ranking: TeamDetails[];
}

export interface Guess {
  name: string;
  guess_string: string;
  points: number;
}

export interface Country {
  country: string;
}

export interface Competition {
  id: number;
  competition_id: string;
  name: string;
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

export interface EmailNotify {
  id: number;
  user_id: string;
  season_id: string;
  day_of: boolean;
  day_before: boolean;
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
  memberCount: number;
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
  game_string: string;
  game_desc: string | null;
}

export interface TeamDetails {
  name: string;
  team_id: number;
  position: number;
  win: number;
  draw: number;
  lose: number;
  goals_for: number;
  goals_against: number;
  points: number;
  history: string;
}