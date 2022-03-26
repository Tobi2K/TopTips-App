import { Store } from "vuex";

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    currentGameday: number;
    guessesForOpenGame: any[] | null;
    userGuessForOpenGame: {
      pointsTeam1: number;
      pointsTeam2: number;
      bet: number;
    };
    pointsForGroup: any[] | null;
    user: {
      username: string;
      accessToken: string;
    };
    countries: any[],
    competitions: any[];
    seasons: any[];
    userSeasons: any[];
    newGroupSeason: {
      name: string;
      year: number;
      start_date: Date;
      end_date: Date;
    };
    newGroupPassphrase: string;
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
    userGroups: any[];
    currentGroupID: number;
    allGames: any[];
    showSelectGroup: boolean;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
