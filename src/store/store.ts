// @ts-ignore

import router from "@/router";
import axios from "axios";
import { stat } from "fs";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import {
  UPDATE_CURRENT_GAMEDAY,
  UPDATE_GUESSES_FOR_OPEN_GAME,
  UPDATE_USER_GUESS_FOR_OPEN_GAME,
  UPDATE_POINTS_FOR_GROUP,
  UPDATE_USER,
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
    access_token: string;
  };
  competitions: any[];
  seasons: any[];
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
    guessesForOpenGame: null,
    userGuessForOpenGame: {},
    pointsForGroup: null,
    user: {
      username: "",
      accessToken: "",
    },
    competitions: [],
    seasons: [],
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
    [UPDATE_COMPETITIONS](state, competitions) {
      state.competitions = competitions;
    },
    [UPDATE_SEASONS](state, seasons) {
      state.seasons = seasons;
    },
    [UPDATE_NEW_GROUP_SEASON](state, newGroupSeason) {
      state.newGroupSeason = newGroupSeason;
    },
    [UPDATE_NEW_GROUP_PASSPHRASE](state, passphrase) {
      state.newGroupPassphrase = passphrase;
    },
    [UPDATE_GROUP_DATA](state, groupData) {
      state.groupData = groupData;
      console.log("GROUP", groupData);
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
    checkStatus({ commit }) {
      commit(UPDATE_LOADING, true);
      const token = localStorage.getItem("JWT");
      if (!token) {
        commit(UPDATE_LOADING, false);
        return null;
      }

      const groupID = localStorage.getItem("groupID");
      if (groupID) {
        commit(UPDATE_CURRENT_GROUP_ID, groupID);
        commit(UPDATE_SHOW_GROUP, false);
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
          })
          .catch((e) => {
            commit(UPDATE_LOADING, false);
            localStorage.removeItem("groupID");
            console.log(e);
            reject();
          });
      });
    },
    login({ commit, dispatch }, user: { email: string; password: string }) {
      commit(UPDATE_LOADING, true);
      const groupID = localStorage.getItem("groupID");
      if (groupID) {
        commit(UPDATE_CURRENT_GROUP_ID, groupID);
        commit(UPDATE_SHOW_GROUP, false);
      }
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
            localStorage.setItem("JWT", data.access_token);
            console.log(data.access_token);

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
      const groupID = localStorage.getItem("groupID");
      if (!groupID) {
        commit(UPDATE_SHOW_GROUP, true);
      } else {
        commit(UPDATE_SHOW_GROUP, false);
        commit(UPDATE_CURRENT_GROUP_ID, Number(groupID));
        dispatch(UPDATE_ALL_GAMES);
        dispatch("initGroup");
      }
      dispatch(UPDATE_USER_GROUPS);
    },
    UPDATE_USER_GROUPS({ state, commit }) {
      axios
        .get(process.env.VUE_APP_HOST + `/group/user/all`, {
          headers: { Authorization: `Bearer ${state.user.accessToken}` },
        })
        .then((response) => {
          console.log(response.data);

          commit(UPDATE_USER_GROUPS, response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    UPDATE_ALL_GAMES({ state, commit }) {
      if (state.currentGroupID == -1) {
        console.log("F");

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
            console.log("updating games", response.data);

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
    },
    LOGOUT({ commit }) {
      commit(UPDATE_USER, {
        username: "",
        accessToken: "",
      });
      commit(UPDATE_CURRENT_GROUP_ID, -1);
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
    //refreshScores({ commit }) {},
    //refreshGames({ commit }) {},
  },
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
