import router from "@/router";
import { toastController } from "@ionic/vue";
import axios from "axios";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import {
  getAllGames,
  getCompetitions,
  getCountries,
  getCurrentGameday,
  getGroups,
  getScores,
  getSeasons,
  getSingleGuess,
  getSingleUser,
  getUserGroups,
  joinGroup,
  requestDeleteGroup,
  requestGroupGuesses,
  requestLeaveGroup,
  requestUserSeasons,
  sendGroupName,
  setUserName,
} from "./helper";
import {
  UPDATE_CURRENT_GAMEDAY,
  UPDATE_GUESSES_FOR_OPEN_GAME,
  UPDATE_USER_GUESS_FOR_OPEN_GAME,
  UPDATE_POINTS_FOR_GROUP,
  UPDATE_USER,
  UPDATE_COUNTRIES,
  UPDATE_COMPETITIONS,
  UPDATE_SEASONS,
  UPDATE_NEW_GROUP_SEASON,
  UPDATE_NEW_GROUP_PASSPHRASE,
  UPDATE_GROUP_DATA,
  UPDATE_USER_GROUPS,
  UPDATE_CURRENT_GROUP_ID,
  UPDATE_ALL_GAMES,
  UPDATE_SHOW_GROUP,
  UPDATE_LOADING,
  LOGOUT,
  UPDATE_GAME_DATA,
  UPDATE_USER_SEASONS,
} from "./mutation-types";

// define your typings for the store state
export interface State {
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
  countries: any[];
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
  loading: boolean;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore({
  state: {
    currentGameday: 0,
    guessesForOpenGame: {},
    userGuessForOpenGame: {},
    pointsForGroup: null,
    user: {
      username: "",
      accessToken: "",
    },
    countries: [],
    competitions: [],
    seasons: [],
    userSeasons: [],
    newGroupSeason: {},
    newGroupPassphrase: "",
    groupData: null,
    userGroups: [],
    currentGroupID: -1,
    allGames: [],
    showSelectGroup: true,
    loading: false,
  },
  mutations: {
    [UPDATE_CURRENT_GAMEDAY](state, gameday) {
      state.currentGameday = gameday;
    },
    [UPDATE_GUESSES_FOR_OPEN_GAME](state, guesses) {
      state.guessesForOpenGame = guesses;
    },
    [UPDATE_USER_GUESS_FOR_OPEN_GAME](state, userGuess) {
      state.userGuessForOpenGame = userGuess;
    },
    [UPDATE_POINTS_FOR_GROUP](state, pointsForGroup) {
      state.pointsForGroup = pointsForGroup;
    },
    [UPDATE_USER](state, user) {
      state.user.accessToken = user.accessToken;
      state.user.username = user.username;
    },
    [UPDATE_COUNTRIES](state, countries) {
      state.countries = countries;
    },
    [UPDATE_COMPETITIONS](state, competitions) {
      state.competitions = competitions;
    },
    [UPDATE_SEASONS](state, seasons) {
      state.seasons = seasons;
    },
    [UPDATE_USER_SEASONS](state, userSeasons) {
      state.userSeasons = userSeasons;
    },
    [UPDATE_NEW_GROUP_SEASON](state, newGroupSeason) {
      state.newGroupSeason = newGroupSeason;
    },
    [UPDATE_NEW_GROUP_PASSPHRASE](state, passphrase) {
      state.newGroupPassphrase = passphrase;
    },
    [UPDATE_GROUP_DATA](state, groupData) {
      state.groupData = groupData;
    },
    [UPDATE_USER_GROUPS](state, groups) {
      state.userGroups = groups;
    },
    [UPDATE_CURRENT_GROUP_ID](state, groupID) {
      state.currentGroupID = groupID;
    },
    [UPDATE_ALL_GAMES](state, games) {
      state.allGames = games;
    },
    [UPDATE_SHOW_GROUP](state, bool) {
      state.showSelectGroup = bool;
    },
    [UPDATE_LOADING](state, bool) {
      state.loading = bool;
    },
  },
  actions: {
    checkStatus({ commit, dispatch }) {
      const token = localStorage.getItem("JWT");
      if (token == "" || token == undefined) {
        return null;
      }
      commit(UPDATE_LOADING, true);
      return new Promise((resolve) => {
        getSingleUser()
          .then((response) => {
            commit(UPDATE_USER, {
              username: response.data.name,
              accessToken: token,
            });
            localStorage.setItem("JWT", token);
            resolve(response.data.name);
            commit(UPDATE_SHOW_GROUP, true);
            dispatch(UPDATE_USER_GROUPS);
          })
          .catch(() => console.log("Failed to log back in."))
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    login({ commit, dispatch }, user: { email: string; password: string }) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve) => {
        axios
          .post(process.env.VUE_APP_HOST + `/auth/login`, {
            email: user.email,
            password: user.password,
          })
          .then((response) => {
            commit(UPDATE_USER, {
              username: response.data.name,
              accessToken: response.data.access_token,
            });

            localStorage.setItem("JWT", response.data.access_token);
            resolve(response.data.name);
            commit(UPDATE_SHOW_GROUP, true);
            dispatch(UPDATE_USER_GROUPS);
          })
          .catch((error) => {
            let errorText = "";
            if (error.response) {
              errorText = error.response.data.message;
            } else {
              errorText = error.message;
            }
            dispatch("handleError", {
              error: error,
              message: errorText,
            });
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    register(
      { commit, dispatch },
      user: { username: string; email: string; password: string }
    ) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
        axios
          .post(process.env.VUE_APP_HOST + `/auth/register`, {
            username: user.username,
            email: user.email,
            password: user.password,
          })
          .then((response) => {
            commit(UPDATE_USER, {
              username: user.username,
              accessToken: response.data.access_token,
            });
            localStorage.setItem("JWT", response.data.access_token);
            resolve(user.username);
            commit(UPDATE_SHOW_GROUP, true);
            dispatch(UPDATE_USER_GROUPS);
            commit(UPDATE_CURRENT_GROUP_ID, -1);
          })
          .catch((error) => {
            let errorText = "";
            if (error.response) {
              errorText = error.response.data.message;
            } else {
              errorText = error.message;
            }
            dispatch("handleError", {
              error: error,
              message: errorText,
            });
            reject(errorText);
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    UPDATE_USER_GROUPS({ dispatch, commit }) {
      getUserGroups()
        .then((response) => {
          commit(UPDATE_USER_GROUPS, response.data);
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "Failed to update groups.",
          });
        });
    },
    UPDATE_ALL_GAMES({ state, dispatch, commit }) {
      if (state.currentGroupID == -1) {
        return null;
      } else {
        getAllGames(`/game/all/format/` + state.currentGroupID)
          .then((response) => {
            commit(UPDATE_ALL_GAMES, response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to update games.",
            });
          });
      }
    },
    UPDATE_CURRENT_GROUP_ID({ commit, dispatch }, groupID: string) {
      commit(UPDATE_CURRENT_GROUP_ID, groupID);
      commit(UPDATE_SHOW_GROUP, false);
      dispatch(UPDATE_ALL_GAMES);
      dispatch(UPDATE_GAME_DATA);
      dispatch("refreshScores");
      dispatch("refreshCurrentGameday");
    },
    LOGOUT({ commit }) {
      commit(UPDATE_USER, {
        username: "",
        accessToken: "",
      });
      commit(UPDATE_CURRENT_GROUP_ID, -1);
      commit(UPDATE_GROUP_DATA, null);
      commit(UPDATE_SHOW_GROUP, true);
      localStorage.removeItem("JWT");
    },
    JOIN_GROUP({ commit, dispatch }, passphrase: string) {
      commit(UPDATE_LOADING, true);
      joinGroup({ passphrase: passphrase })
        .then((response) => {
          commit(UPDATE_CURRENT_GROUP_ID, response.data);
          dispatch("refreshGroups");
          dispatch("refreshScores");
          commit(UPDATE_SHOW_GROUP, false);
          dispatch(UPDATE_USER_GROUPS);
          dispatch(UPDATE_ALL_GAMES);
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "Failed to join group.",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    initGroup({ commit, dispatch, state }) {
      commit(UPDATE_USER, {
        username: state.user.username,
        accessToken: localStorage.getItem("JWT"),
      });
      commit(UPDATE_LOADING, true);
      if (state.currentGroupID == -1 || state.currentGroupID == null) {
        dispatch(UPDATE_USER_GROUPS);
        commit(UPDATE_LOADING, false);
      } else
        getGroups(`/group/user/` + state.currentGroupID)
          .then((response) => {
            commit(UPDATE_GROUP_DATA, response.data);
            dispatch(UPDATE_USER_GROUPS);
          })
          .catch((e) => {
            let errorText = "";
            if (e.response) {
              errorText = e.response.data.message;
            } else {
              errorText = e.message;
            }
            dispatch("handleError", {
              error: e,
              message: errorText,
            });
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
    },
    UPDATE_GAME_DATA({ commit, dispatch, state }) {
      getGroups(`/group/user/` + state.currentGroupID)
        .then((response) => {
          commit(UPDATE_GROUP_DATA, response.data);
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "Failed to update game data.",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    createGroup({ commit, dispatch, state }, group) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve) => {
        axios
          .post(
            process.env.VUE_APP_HOST + `/group/new/`,
            {
              groupName: group.groupName,
              seasonID: group.seasonID,
            },
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_CURRENT_GROUP_ID, response.data.id);
            commit(UPDATE_SHOW_GROUP, false);
            dispatch(UPDATE_ALL_GAMES);
            resolve(response.data.passphrase);
            dispatch("refreshGroups");
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to create group.",
            });
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    refreshCurrentGameday({ commit, state }) {
      commit(UPDATE_LOADING, true);
      getCurrentGameday(`/competition/current/` + state.currentGroupID)
        .then((response) => {
          commit(UPDATE_CURRENT_GAMEDAY, response.data);
        })
        .catch()
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    refreshGroups({ commit, dispatch, state }) {
      commit(UPDATE_LOADING, true);
      if (state.currentGroupID == -1) {
        commit(UPDATE_LOADING, false);
        dispatch(UPDATE_USER_GROUPS);
        return;
      }
      getGroups(`/group/user/` + state.currentGroupID)
        .then((response) => {
          commit(UPDATE_GROUP_DATA, response.data);
          dispatch(UPDATE_USER_GROUPS);
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "Failed to update groups.",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    refreshScores({ commit, dispatch, state }) {
      commit(UPDATE_LOADING, true);
      if (state.currentGroupID == -1) {
        commit(UPDATE_LOADING, false);
        dispatch(UPDATE_USER_GROUPS);
        return;
      }
      return new Promise((resolve) => {
        getScores(`/points/all/format/` + state.currentGroupID)
          .then((response) => {
            commit(UPDATE_POINTS_FOR_GROUP, response.data);
            resolve("Success");
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to update scores.",
            });
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    getUserGuess({ commit, dispatch, state }, gameID) {
      commit(UPDATE_LOADING, true);

      return new Promise((resolve) => {
        getSingleGuess(`/guess/game/` + gameID + `/` + state.currentGroupID)
          .then((response) => {
            commit(UPDATE_USER_GUESS_FOR_OPEN_GAME, response.data);
            dispatch("getGroupGuesses", gameID);
            resolve(response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Could not get your guess.",
            });
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    getGroupGuesses({ commit, dispatch, state }, gameID) {
      commit(UPDATE_LOADING, true);
      requestGroupGuesses(`/guess/all/` + gameID + `/` + state.currentGroupID)
        .then((response) => {
          commit(UPDATE_GUESSES_FOR_OPEN_GAME, response.data);
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "Failed to get group guesses.",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    addGuess({ commit, dispatch, state }, details) {
      commit(UPDATE_LOADING, true);

      return new Promise((resolve) => {
        axios
          .post(
            process.env.VUE_APP_HOST + `/guess/add/`,
            {
              game: details.game,
              bet: details.bet,
              team1: details.team1,
              team2: details.team2,
              groupID: state.currentGroupID,
            },
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then(() => {
            resolve("");
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to save your guess.",
            });
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    saveName({ commit, dispatch, state }, name) {
      commit(UPDATE_LOADING, true);
      setUserName({ name: name })
        .then(() => {
          commit(UPDATE_USER, {
            username: name,
            accessToken: state.user.accessToken,
          });
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "There was an error setting your username.",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    refreshCompetitions({ commit, dispatch }, country) {
      commit(UPDATE_LOADING, true);
      getCompetitions(`/competition/country/` + country)
        .then((response) => {
          commit(UPDATE_COMPETITIONS, response.data);
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "Failed to update competitions.",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    refreshSeasons({ commit, dispatch }, competition) {
      commit(UPDATE_LOADING, true);
      getSeasons(`/competition/seasons/` + competition)
        .then((response) => {
          commit(UPDATE_SEASONS, response.data);
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "Failed to update seasons.",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    refreshCountries({ commit, dispatch }) {
      commit(UPDATE_LOADING, true);
      getCountries()
        .then((response) => {
          commit(UPDATE_COUNTRIES, response.data);
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "Failed to update countries.",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    refreshSeasonData({ commit, dispatch, state }, season) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve) => {
        axios
          .get(process.env.VUE_APP_HOST + `/competition/season/` + season, {
            headers: { Authorization: `Bearer ${state.user.accessToken}` },
          })
          .then((response) => {
            commit(UPDATE_NEW_GROUP_SEASON, response.data);
            resolve(response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to refresh current season.",
            });
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    saveGroupName({ commit, state, dispatch }, groupName) {
      commit(UPDATE_LOADING, true);
      sendGroupName(`/group/rename/` + state.currentGroupID, {
        name: groupName,
      })
        .then(() => {
          commit(UPDATE_USER, {
            username: groupName,
            accessToken: state.user.accessToken,
          });
          dispatch("refreshGroups");
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "There was an error setting the group name, sorry!",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    leaveGroup({ commit, state, dispatch }) {
      commit(UPDATE_LOADING, true);

      return new Promise((resolve) => {
        requestLeaveGroup(`/group/leave/` + state.currentGroupID)
          .then(() => {
            localStorage.removeItem("group" + state.currentGroupID);
            commit(UPDATE_CURRENT_GROUP_ID, -1);
            commit(UPDATE_POINTS_FOR_GROUP, null);
            commit(UPDATE_ALL_GAMES, []);
            commit(UPDATE_GROUP_DATA, null);
            commit(UPDATE_SHOW_GROUP, true);
            dispatch("refreshGroups");
            resolve("Success");
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "There was an error leaving the group, sorry!",
            });
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    deleteGroup({ commit, state, dispatch }) {
      commit(UPDATE_LOADING, true);

      return new Promise((resolve) => {
        requestDeleteGroup(`/group/delete/` + state.currentGroupID)
          .then(() => {
            commit(UPDATE_CURRENT_GROUP_ID, -1);
            commit(UPDATE_POINTS_FOR_GROUP, null);
            commit(UPDATE_ALL_GAMES, []);
            commit(UPDATE_GROUP_DATA, null);
            commit(UPDATE_SHOW_GROUP, true);
            dispatch("refreshGroups");
            resolve("Success");
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "There was an error deleting the group, sorry!",
            });
          })
          .finally(() => {
            commit(UPDATE_LOADING, false);
          });
      });
    },
    getUserSeasons({ commit, dispatch }) {
      commit(UPDATE_LOADING, true);
      requestUserSeasons()
        .then((response) => {
          commit(UPDATE_USER_SEASONS, response.data);
        })
        .catch((e) => {
          dispatch("handleError", {
            error: e,
            message: "Failed to get your current seasons.",
          });
        })
        .finally(() => {
          commit(UPDATE_LOADING, false);
        });
    },
    handleError({ commit, dispatch }, { error, message }) {
      if (error && error.response && error.response.status == 401) {
        router.push("/");
        dispatch(LOGOUT);
      } else {
        commit(UPDATE_LOADING, false);
        toastController
          .create({
            message: message,
            duration: 2000,
            color: "danger",
          })
          .then((value) => {
            value.present();
          });
      }
    },
    checkJWT({ dispatch }) {
      getSingleUser().catch((error) => {
        if (error.response) {
          if (error.response.status == 401) {
            router.push("/");
            dispatch(LOGOUT);
            return false;
          } else return true;
        } else return true;
      });
    },
  },
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
