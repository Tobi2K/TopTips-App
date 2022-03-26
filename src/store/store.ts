import router from "@/router";
import axios from "axios";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
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
  UPDATE_USER_SEASONS
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
      commit(UPDATE_LOADING, true);
      const token = localStorage.getItem("JWT");
      if (token == "" || token == undefined) {
        commit(UPDATE_LOADING, false);
        return null;
      }
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_HOST + `/user/single`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const data = response.data;
            commit(UPDATE_USER, {
              username: data.name,
              accessToken: token,
            });
            localStorage.setItem("JWT", token);

            commit(UPDATE_LOADING, false);
            router.push("/tabs");
            resolve(data.name);
            dispatch("initEverythingForGame");
          })
          .catch((e) => {
            commit(UPDATE_LOADING, false);
            localStorage.removeItem("groupID");
            console.log(e);
            reject();
          });
      });
    },
    login({ commit, dispatch, state }, user: { email: string; password: string }) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
        axios
          .post(process.env.VUE_APP_HOST + `/auth/login`, {
            email: user.email,
            password: user.password,
          })
          .then((response) => {
            const data = response.data;
            commit(UPDATE_USER, {
              username: data.name,
              accessToken: data.access_token,
            });
            console.log(state.user);
            
            localStorage.setItem("JWT", data.access_token);
            commit(UPDATE_LOADING, false);
            resolve(data.name);
            router.push("/tabs");
            dispatch("initEverythingForGame");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            console.log(error);
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
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
            const data = response.data;
            commit(UPDATE_USER, {
              username: user.username,
              accessToken: data.access_token,
            });
            localStorage.setItem("JWT", data.access_token);

            commit(UPDATE_LOADING, false);
            router.push("/tabs/tab3");
            resolve(user.username);
            dispatch("initEverythingForGame");
            commit(UPDATE_CURRENT_GROUP_ID, -1);
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            console.log(error);
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    initEverythingForGame({ dispatch, commit }) {
      commit(UPDATE_SHOW_GROUP, true);
      dispatch(UPDATE_USER_GROUPS);
    },
    UPDATE_USER_GROUPS({ state, commit }) {
      axios
        .get(process.env.VUE_APP_HOST + `/group/user/all`, {
          headers: { Authorization: `Bearer ${state.user.accessToken}` },
        })
        .then((response) => {
          commit(UPDATE_USER_GROUPS, response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    UPDATE_ALL_GAMES({ state, commit }) {
      if (state.currentGroupID == -1) {
        return null;
      } else {
        axios
          .get(
            process.env.VUE_APP_HOST +
              `/game/all/format/` +
              state.currentGroupID,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_ALL_GAMES, response.data);
          })
          .catch((e) => {
            if (e.response) {
              if (e.response.status == 401) {
                router.push("/");
                localStorage.removeItem("JWT");
              }
            }
          });
      }
    },
    UPDATE_CURRENT_GROUP_ID({ commit, dispatch }, groupID: string) {
      commit(UPDATE_CURRENT_GROUP_ID, groupID);
      localStorage.setItem("groupID", groupID);
      commit(UPDATE_SHOW_GROUP, false);
      dispatch(UPDATE_ALL_GAMES);
      dispatch(UPDATE_GAME_DATA);
      dispatch("refreshScores")
      dispatch("refreshCurrentGameday")
    },
    LOGOUT({ commit }) {
      commit(UPDATE_USER, {
        username: "",
        accessToken: "",
      });
      commit(UPDATE_CURRENT_GROUP_ID, -1);
      commit(UPDATE_GROUP_DATA, null);
      commit(UPDATE_SHOW_GROUP, true);
      localStorage.removeItem("groupID");
      localStorage.removeItem("JWT");
    },
    JOIN_GROUP({ commit, dispatch, state }, passphrase: string) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_HOST + `/group/join`,
            {
              passphrase: passphrase,
            },
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            localStorage.setItem("groupID", response.data);
            commit(UPDATE_CURRENT_GROUP_ID, response.data);
            dispatch("refreshGroups")
            dispatch("refreshScores")
            dispatch(UPDATE_ALL_GAMES);
            commit(UPDATE_SHOW_GROUP, false);
            commit(UPDATE_LOADING, false);
            dispatch(UPDATE_USER_GROUPS);
            dispatch(UPDATE_ALL_GAMES);
            resolve("Success");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            console.log(error);
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
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
        return new Promise((resolve, reject) => {
          axios
            .get(
              process.env.VUE_APP_HOST + `/group/user/` + state.currentGroupID,
              {
                headers: { Authorization: `Bearer ${state.user.accessToken}` },
              }
            )
            .then((response) => {
              commit(UPDATE_GROUP_DATA, response.data);
              commit(UPDATE_LOADING, false);
              dispatch(UPDATE_USER_GROUPS);
              resolve("Done");
            })
            .catch((e) => {
              if (e.response) {
                if (e.response.status == 401) {
                  router.push("/");
                  dispatch(LOGOUT);
                }
              }
              commit(UPDATE_LOADING, false);
              let errorText = "";
              console.log(e);
              if (e.response) {
                // Request made and server responded
                errorText = e.response.data.message;
              } else if (e.request) {
                // The request was made but no response was received
                errorText = e.message;
              } else {
                // Something happened in setting up the request that triggered an Error
                errorText = e.message;
              }
              reject(errorText);
            });
        });
    },
    UPDATE_GAME_DATA({ commit, state }) {
      axios
        .get(process.env.VUE_APP_HOST + `/group/user/` + state.currentGroupID, {
          headers: { Authorization: `Bearer ${state.user.accessToken}` },
        })
        .then((response) => {
          commit(UPDATE_GROUP_DATA, response.data);
          commit(UPDATE_LOADING, false);
        })
        .catch((e) => {
          commit(UPDATE_LOADING, false);
          console.log(e);
        });
    },
    createGroup({ commit, dispatch, state }, group) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
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
          .then(async (response) => {
            localStorage.setItem("groupID", response.data.id);
            commit(UPDATE_CURRENT_GROUP_ID, response.data.id);

            commit(UPDATE_LOADING, false);
            dispatch(UPDATE_ALL_GAMES);
            resolve(response.data.passphrase);
            dispatch("refreshGroups");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            console.log(error);
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    refreshCurrentGameday({commit, state}) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/competition/current/` + state.currentGroupID,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_CURRENT_GAMEDAY, response.data)
            commit(UPDATE_LOADING, false);
            resolve("Success");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    refreshGroups({ commit, dispatch, state }) {
      commit(UPDATE_LOADING, true);
      if (state.currentGroupID == -1) {
        commit(UPDATE_LOADING, false);
        dispatch(UPDATE_USER_GROUPS);
        return;
      }
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/group/user/` + state.currentGroupID,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_LOADING, false);
            commit(UPDATE_GROUP_DATA, response.data);
            dispatch(UPDATE_USER_GROUPS);
            resolve("Success");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            console.log(error);
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    refreshScores({ commit, dispatch, state }) {      
      commit(UPDATE_LOADING, true);
      if (state.currentGroupID == -1) {
        commit(UPDATE_LOADING, false);
        dispatch(UPDATE_USER_GROUPS);
        return;
      }
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/points/all/format/` + state.currentGroupID,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_LOADING, false);
            commit(UPDATE_POINTS_FOR_GROUP, response.data);
            resolve("Success");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    getUserGuess({commit, dispatch, state}, gameID) {
      console.log("Getting Guess");
      
      commit(UPDATE_LOADING, true);
      
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/guess/game/` + gameID + `/` + state.currentGroupID,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_LOADING, false);
            commit(UPDATE_USER_GUESS_FOR_OPEN_GAME, response.data);
            dispatch("getGroupGuesses", gameID)
            resolve(response.data);
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    getGroupGuesses({commit, state}, gameID) {
      commit(UPDATE_LOADING, true);
        axios
          .get(
            process.env.VUE_APP_HOST + `/guess/all/` + gameID + `/` + state.currentGroupID,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_LOADING, false);
            commit(UPDATE_GUESSES_FOR_OPEN_GAME, response.data);
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            console.log(errorText);
      });
    },
    addGuess({commit,state}, details) {
      commit(UPDATE_LOADING, true);
      
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_HOST + `/guess/add/`,
            {
              game: details.game,
              bet: details.bet,
              team1: details.team1,
              team2: details.team2,
              groupID: state.currentGroupID
            },
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then(() => {
            commit(UPDATE_LOADING, false);
            resolve("Success");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    saveName({commit, state}, name) {
      commit(UPDATE_LOADING, true);
      
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_HOST + `/user/name`,
            {
              name: name,
            },
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then(() => {
            commit(UPDATE_LOADING, false);
            commit(UPDATE_USER, {
              username: name,
              accessToken: state.user.accessToken,
            });
            resolve("Success");
          })
          .catch(() => {
            commit(UPDATE_LOADING, false);
            reject("There was an error setting your username!");
          });
      });
    },
    refreshCompetitions({commit, state}, country) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/competition/country/` + country,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_COMPETITIONS, response.data)
            commit(UPDATE_LOADING, false);
            resolve("Success");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    refreshSeasons({commit, state}, competition) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/competition/seasons/` + competition,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_SEASONS, response.data)
            commit(UPDATE_LOADING, false);
            resolve("Success");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    refreshCountries({commit, state}) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/competition/countries`,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_COUNTRIES, response.data)
            commit(UPDATE_LOADING, false);
            resolve("Success");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    refreshSeasonData({commit, state}, season) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/competition/season/` + season,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_NEW_GROUP_SEASON, response.data)
            commit(UPDATE_LOADING, false);
            resolve(response.data);
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    },
    saveGroupName({commit, state, dispatch}, groupName) {
      commit(UPDATE_LOADING, true);
      
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_HOST + `/group/rename/` + state.currentGroupID,
            {
              name: groupName,
            },
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then(() => {
            commit(UPDATE_LOADING, false);
            commit(UPDATE_USER, {
              username: groupName,
              accessToken: state.user.accessToken,
            });
            dispatch("refreshGroups")
            resolve("Success");
          })
          .catch(() => {
            commit(UPDATE_LOADING, false);
            reject("There was an error setting the group name, sorry!");
          });
      });
    },
    leaveGroup({commit, state, dispatch}) {
      commit(UPDATE_LOADING, true);
      
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/group/leave/` + state.currentGroupID,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then(() => {
            localStorage.removeItem("group" + state.currentGroupID);
            commit(UPDATE_CURRENT_GROUP_ID, -1);
            commit(UPDATE_POINTS_FOR_GROUP, null);
            commit(UPDATE_ALL_GAMES, []);
            commit(UPDATE_GROUP_DATA, null);
            commit(UPDATE_SHOW_GROUP, true);
            localStorage.removeItem("groupID");
            dispatch("refreshGroups")
            commit(UPDATE_LOADING, false);
            resolve("Success");
          })
          .catch(() => {
            commit(UPDATE_LOADING, false);
            reject("There was an error leaving the group, sorry!");
          });
      });
    },
    deleteGroup({commit, state, dispatch}) {
      commit(UPDATE_LOADING, true);
      
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/group/delete/` + state.currentGroupID,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then(() => {
            commit(UPDATE_CURRENT_GROUP_ID, -1);
            commit(UPDATE_POINTS_FOR_GROUP, null);
            commit(UPDATE_ALL_GAMES, []);
            commit(UPDATE_GROUP_DATA, null);
            commit(UPDATE_SHOW_GROUP, true);
            localStorage.removeItem("groupID");
            dispatch("refreshGroups")
            commit(UPDATE_LOADING, false);
            resolve("Success");
          })
          .catch(() => {
            commit(UPDATE_LOADING, false);
            reject("There was an error deleting the group, sorry!");
          });
      });
    },
    getUserSeasons({commit,state}) {
      commit(UPDATE_LOADING, true);
      return new Promise((resolve, reject) => {
        axios
          .get(
            process.env.VUE_APP_HOST + `/competition/user`,
            {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            }
          )
          .then((response) => {
            commit(UPDATE_USER_SEASONS, response.data)
            commit(UPDATE_LOADING, false);
            resolve("Success");
          })
          .catch((error) => {
            commit(UPDATE_LOADING, false);
            let errorText = "";
            if (error.response) {
              // Request made and server responded
              errorText = error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              errorText = error.message;
            } else {
              // Something happened in setting up the request that triggered an Error
              errorText = error.message;
            }
            reject(errorText);
          });
      });
    }
  },
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
