import router from "@/router";
import { State } from "@/vuex-shim";
import { toastController } from "@ionic/vue";
import axios from "axios";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import * as helper from "./helper";

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
    userSubscriptions: [],
    newGroupSeason: {},
    groupData: null,
    userGroups: [],
    currentGroupID: -1,
    allGames: [],
    showSelectGroup: true,
    loading: false,
    activeGamedays: [],
    ranking: [],
  },
  mutations: {
    UPDATE_CURRENT_GAMEDAY(state, gameday) {
      state.currentGameday = gameday;
    },
    UPDATE_GUESSES_FOR_OPEN_GAME(state, guesses) {
      state.guessesForOpenGame = guesses;
    },
    UPDATE_USER_GUESS_FOR_OPEN_GAME(state, userGuess) {
      state.userGuessForOpenGame = userGuess;
    },
    UPDATE_POINTS_FOR_GROUP(state, pointsForGroup) {
      state.pointsForGroup = pointsForGroup;
    },
    UPDATE_USER(state, user) {
      state.user.accessToken = user.accessToken;
      state.user.username = user.username;
    },
    UPDATE_COUNTRIES(state, countries) {
      state.countries = countries;
    },
    UPDATE_COMPETITIONS(state, competitions) {
      state.competitions = competitions;
    },
    UPDATE_SEASONS(state, seasons) {
      state.seasons = seasons;
    },
    UPDATE_USER_SEASONS(state, userSeasons) {
      state.userSeasons = userSeasons;
    },
    UPDATE_USER_SUBSCRIPTIONS(state, userSubscriptions) {
      state.userSubscriptions = userSubscriptions;
    },
    UPDATE_NEW_GROUP_SEASON(state, newGroupSeason) {
      state.newGroupSeason = newGroupSeason;
    },
    UPDATE_GROUP_DATA(state, groupData) {
      state.groupData = groupData;
    },
    UPDATE_USER_GROUPS(state, groups) {
      state.userGroups = groups;
    },
    UPDATE_CURRENT_GROUP_ID(state, groupID) {
      state.currentGroupID = groupID;
    },
    UPDATE_ALL_GAMES(state, games) {
      state.allGames = games;
    },
    UPDATE_SHOW_GROUP(state, bool) {
      state.showSelectGroup = bool;
    },
    UPDATE_LOADING(state, bool) {
      state.loading = bool;
    },
    UPDATE_ACTIVE_GAMEDAYS(state, days) {
      state.activeGamedays = days;
    },
    UPDATE_RANKING(state, ranking) {
      state.ranking = ranking;
    },
  },
  actions: {
    checkStatus({ commit, dispatch }) {
      const token = localStorage.getItem("JWT");
      if (token == "" || token == undefined) {
        return null;
      }
      commit("UPDATE_LOADING", true);
      return new Promise((resolve) => {
        axios
            .get(process.env.VUE_APP_HOST + "/user/single", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              commit("UPDATE_USER", {
                username: response.data.name,
                accessToken: token,
              });
              localStorage.setItem("JWT", token);
              resolve(response.data.name);
              commit("UPDATE_SHOW_GROUP", true);
              dispatch("UPDATE_USER_GROUPS");
            })
            .catch()
            .finally(() => {
              commit("UPDATE_LOADING", false);
            });
      });
    },
    login(
        { commit, dispatch },
        user: { name: string; password: string; loggedin: boolean },
    ) {
      commit("UPDATE_LOADING", true);
      return new Promise((resolve) => {
        axios
            .post(process.env.VUE_APP_HOST + "/auth/login", {
              name: user.name,
              password: user.password,
            })
            .then((response) => {
              commit("UPDATE_USER", {
                username: response.data.name,
                accessToken: response.data.access_token,
              });

              if (user.loggedin) {
                localStorage.setItem("JWT", response.data.access_token);
              }

              if (response.data.email) {
                resolve([response.data.name, true]);
              } else {
                resolve([response.data.name, false]);
              }
              commit("UPDATE_SHOW_GROUP", true);
              dispatch("UPDATE_USER_GROUPS");
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    register(
        { commit, dispatch },
        user: { username: string; email: string; password: string; loggedin: boolean },
    ) {
      commit("UPDATE_LOADING", true);
      return new Promise((resolve, reject) => {
        axios
            .post(process.env.VUE_APP_HOST + "/auth/register", {
              name: user.username,
              email: user.email,
              password: user.password,
            })
            .then((response) => {
              commit("UPDATE_USER", {
                username: user.username,
                accessToken: response.data.access_token,
              });
              if (user.loggedin) {
                localStorage.setItem("JWT", response.data.access_token);
              }
              commit("UPDATE_SHOW_GROUP", true);
              dispatch("UPDATE_USER_GROUPS");
              commit("UPDATE_CURRENT_GROUP_ID", -1);
              resolve(user.username);
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    updateEmail(
        { commit, dispatch, state },
        email: string,
    ) {
      commit("UPDATE_LOADING", true);
      return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.VUE_APP_HOST + "/auth/update",
                {
                  email: email,
                },
                {
                  headers: { Authorization: `Bearer ${state.user.accessToken}` },
                },
            )
            .then(() => {
              resolve("Thanks");
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    UPDATE_USER_GROUPS({ dispatch, commit }) {
      helper
          .getUserGroups()
          .then((response) => {
            commit("UPDATE_USER_GROUPS", response.data);
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
        commit("UPDATE_LOADING", true);
        helper
            .getAllGames("/game/all/format/" + state.currentGroupID)
            .then((response) => {
              commit("UPDATE_ALL_GAMES", response.data);
            })
            .catch((e) => {
              dispatch("handleError", {
                error: e,
                message: "Failed to update games.",
              });
            })
            .finally(() => {
              commit("UPDATE_LOADING", false);
            });
        helper
            .getActiveGamedays("/game/days/active/" + state.currentGroupID)
            .then((response) => {
              commit("UPDATE_ACTIVE_GAMEDAYS", response.data);
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
      commit("UPDATE_CURRENT_GROUP_ID", groupID);
      commit("UPDATE_SHOW_GROUP", false);
      dispatch("UPDATE_ALL_GAMES");
      dispatch("UPDATE_GAME_DATA");
      dispatch("UPDATE_RANKING");
      dispatch("refreshScores");
      dispatch("refreshCurrentGameday");
    },
    LOGOUT({ commit }) {
      commit("UPDATE_USER", {
        username: "",
        accessToken: "",
      });
      commit("UPDATE_CURRENT_GROUP_ID", -1);
      commit("UPDATE_GROUP_DATA", null);
      commit("UPDATE_POINTS_FOR_GROUP", null);
      commit("UPDATE_RANKING", []);
      commit("UPDATE_SHOW_GROUP", true);
      localStorage.removeItem("JWT");
    },
    JOIN_GROUP({ commit, dispatch }, passphrase: string) {
      commit("UPDATE_LOADING", true);
      helper
          .joinGroup({ passphrase: passphrase })
          .then((response) => {
            commit("UPDATE_CURRENT_GROUP_ID", response.data);
            dispatch("refreshGroups");
            dispatch("refreshScores");
            commit("UPDATE_SHOW_GROUP", false);
            dispatch("UPDATE_USER_GROUPS");
            dispatch("UPDATE_ALL_GAMES");
            dispatch("UPDATE_RANKING");
          })
          .catch((e) => {
            let errorText = "Failed to join group.";
            if (e.response) {
              errorText = e.response.data.message;
            } else if (e.message && e.message != "") {
              errorText = e.message;
            }
            dispatch("handleError", {
              error: e,
              message: errorText,
            });
          })
          .finally(() => {
            commit("UPDATE_LOADING", false);
          });
    },
    initGroup({ commit, dispatch, state }) {
      commit("UPDATE_LOADING", true);
      if (state.currentGroupID == -1 || state.currentGroupID == null) {
        dispatch("UPDATE_USER_GROUPS");
        commit("UPDATE_LOADING", false);
      } else {
        helper
            .getGroups("/group/user/" + state.currentGroupID)
            .then((response) => {
              commit("UPDATE_GROUP_DATA", response.data);
              dispatch("UPDATE_USER_GROUPS");
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
              commit("UPDATE_LOADING", false);
            });
      }
    },
    UPDATE_GAME_DATA({ commit, dispatch, state }) {
      helper
          .getGroups("/group/user/" + state.currentGroupID)
          .then((response) => {
            commit("UPDATE_GROUP_DATA", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to update game data.",
            });
          });
    },
    UPDATE_RANKING({ commit, dispatch, state }) {
      helper
          .getRanking("/standing/" + state.currentGroupID)
          .then((response) => {
            commit("UPDATE_RANKING", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to update game data.",
            });
          });
    },
    createGroup({ commit, dispatch, state }, group) {
      commit("UPDATE_LOADING", true);
      return new Promise((resolve) => {
        axios
            .post(
                process.env.VUE_APP_HOST + "/group/new/",
                {
                  groupName: group.groupName,
                  seasonID: group.seasonID,
                },
                {
                  headers: { Authorization: `Bearer ${state.user.accessToken}` },
                },
            )
            .then((response) => {
              commit("UPDATE_CURRENT_GROUP_ID", response.data.id);
              commit("UPDATE_SHOW_GROUP", false);
              dispatch("UPDATE_USER_GROUPS");
              dispatch("UPDATE_ALL_GAMES");
              dispatch("UPDATE_RANKING");
              resolve(response.data.passphrase);
              dispatch("refreshGroups");
              dispatch("refreshScores");
            })
            .catch((e) => {
              dispatch("handleError", {
                error: e,
                message: "Failed to create group.",
              });
            })
            .finally(() => {
              commit("UPDATE_LOADING", false);
            });
      });
    },
    refreshCurrentGameday({ commit, state }) {
      helper
          .getCurrentGameday("/competition/current/" + state.currentGroupID)
          .then((response) => {
            commit("UPDATE_CURRENT_GAMEDAY", response.data);
          })
          .catch();
    },
    refreshGroups({ commit, dispatch, state }) {
      if (state.currentGroupID == -1) {
        dispatch("UPDATE_USER_GROUPS");
        return;
      }
      helper
          .getGroups("/group/user/" + state.currentGroupID)
          .then((response) => {
            commit("UPDATE_GROUP_DATA", response.data);
            dispatch("UPDATE_USER_GROUPS");
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to update groups.",
            });
          });
    },
    refreshScores({ commit, dispatch, state }) {
      if (state.currentGroupID == -1) {
        dispatch("UPDATE_USER_GROUPS");
        return;
      }
      return new Promise((resolve) => {
        helper
            .getScores("/points/all/format/" + state.currentGroupID)
            .then((response) => {
              commit("UPDATE_POINTS_FOR_GROUP", response.data);
              resolve("Success");
            })
            .catch((e) => {
              dispatch("handleError", {
                error: e,
                message: "Failed to update scores.",
              });
            });
      });
    },
    getUserGuess({ commit, dispatch, state }, gameID) {
      commit("UPDATE_LOADING", true);

      return new Promise((resolve) => {
        helper
            .getSingleGuess("/guess/game/" + gameID + "/" + state.currentGroupID)
            .then((response) => {
              commit("UPDATE_USER_GUESS_FOR_OPEN_GAME", response.data);
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    getGroupGuesses({ commit, dispatch, state }, gameID) {
      commit("UPDATE_LOADING", true);
      helper
          .requestGroupGuesses(
              "/guess/all/" + gameID + "/" + state.currentGroupID,
          )
          .then((response) => {
            commit("UPDATE_GUESSES_FOR_OPEN_GAME", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to get group guesses.",
            });
          })
          .finally(() => {
            commit("UPDATE_LOADING", false);
          });
    },
    addGuess({ commit, dispatch, state }, details) {
      commit("UPDATE_LOADING", true);

      return new Promise((resolve) => {
        axios
            .post(
                process.env.VUE_APP_HOST + "/guess/add/",
                {
                  game: details.game,
                  team1: details.team1,
                  team2: details.team2,
                  groupID: state.currentGroupID,
                },
                {
                  headers: { Authorization: `Bearer ${state.user.accessToken}` },
                },
            )
            .then(() => {
              const section = details.sectionID;
              let id = -1;
              const gameday = (state.allGames[section] as any).games;
              gameday.filter((val: { id: any }, index: any) => {
                if (val.id == details.game) id = index;
              });
              if (id != -1) {
                (state.allGames[section] as any).games[id].guess =
                details.team1 + " : " + details.team2;
                (state.allGames[section] as any).games[id].guessed = true;
              }
              resolve("");
            })
            .catch((e) => {
              dispatch("handleError", {
                error: e,
                message: "Failed to save your guess.",
              });
            })
            .finally(() => {
              commit("UPDATE_LOADING", false);
            });
      });
    },
    saveName({ commit, dispatch }, name: string) {
      commit("UPDATE_LOADING", true);
      return new Promise((resolve) => {
        helper
            .setUserName({ name: name })
            .then(() => {
              dispatch("LOGOUT");
              resolve("Done");
            })
            .catch((e) => {
              let errorText = "Failed to change name";
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    changePassword({ commit, dispatch }, passwords: {oldPass: string, newPass: string}) {
      commit("UPDATE_LOADING", true);
      return new Promise((resolve) => {
        helper
            .changePassword({ oldPassword: passwords.oldPass, newPassword: passwords.newPass })
            .then(() => {
              dispatch("LOGOUT");
              resolve("Done");
            })
            .catch((e) => {
              let errorText = "Failed to change password";
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    resetPassword({ commit, dispatch }, name: string) {
      commit("UPDATE_LOADING", true);
      return new Promise((resolve) => {
        helper
            .resetPassword({ name: name })
            .then(() => {
              resolve("Done");
            })
            .catch((e) => {
              let errorText = "Failed to reset password!";
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    deleteAccount({ commit, dispatch }, password: string) {
      commit("UPDATE_LOADING", true);
      return new Promise((resolve) => {
        helper
            .deleteAccount({ password: password })
            .then(() => {
              dispatch("LOGOUT");
              resolve("Done");
            })
            .catch((e) => {
              let errorText = "Failed to delete account!";
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    refreshCompetitions({ commit, dispatch }, country) {
      commit("UPDATE_LOADING", true);
      helper
          .getCompetitions("/competition/country/" + country)
          .then((response) => {
            commit("UPDATE_COMPETITIONS", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to update competitions.",
            });
          })
          .finally(() => {
            commit("UPDATE_LOADING", false);
          });
    },
    refreshSeasons({ commit, dispatch }, competition) {
      commit("UPDATE_LOADING", true);
      helper
          .getSeasons("/competition/seasons/" + competition)
          .then((response) => {
            commit("UPDATE_SEASONS", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to update seasons.",
            });
          })
          .finally(() => {
            commit("UPDATE_LOADING", false);
          });
    },
    refreshCountries({ commit, dispatch }) {
      commit("UPDATE_LOADING", true);
      helper
          .getCountries()
          .then((response) => {
            commit("UPDATE_COUNTRIES", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to update countries.",
            });
          })
          .finally(() => {
            commit("UPDATE_LOADING", false);
          });
    },
    refreshSeasonData({ commit, dispatch, state }, season) {
      commit("UPDATE_LOADING", true);
      return new Promise((resolve) => {
        axios
            .get(process.env.VUE_APP_HOST + "/competition/season/" + season, {
              headers: { Authorization: `Bearer ${state.user.accessToken}` },
            })
            .then((response) => {
              commit("UPDATE_NEW_GROUP_SEASON", response.data);
              resolve(response.data);
            })
            .catch((e) => {
              dispatch("handleError", {
                error: e,
                message: "Failed to refresh current season.",
              });
            })
            .finally(() => {
              commit("UPDATE_LOADING", false);
            });
      });
    },
    saveGroupName({ commit, state, dispatch }, groupName: string) {
      commit("UPDATE_LOADING", true);
      helper
          .sendGroupName("/group/rename/" + state.currentGroupID, {
            name: groupName,
          })
          .then(() => {
            commit("UPDATE_USER", {
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
            commit("UPDATE_LOADING", false);
          });
    },
    leaveGroup({ commit, state, dispatch }) {
      commit("UPDATE_LOADING", true);

      return new Promise((resolve) => {
        helper
            .requestLeaveGroup("/group/leave/" + state.currentGroupID)
            .then(() => {
              localStorage.removeItem("group" + state.currentGroupID);
              commit("UPDATE_CURRENT_GROUP_ID", -1);
              commit("UPDATE_POINTS_FOR_GROUP", null);
              commit("UPDATE_ALL_GAMES", []);
              commit("UPDATE_ACTIVE_GAMEDAYS", []);
              commit("UPDATE_RANKING", []);
              commit("UPDATE_GROUP_DATA", null);
              commit("UPDATE_SHOW_GROUP", true);
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    deleteGroup({ commit, state, dispatch }) {
      commit("UPDATE_LOADING", true);

      return new Promise((resolve) => {
        helper
            .requestDeleteGroup("/group/delete/" + state.currentGroupID)
            .then(() => {
              commit("UPDATE_CURRENT_GROUP_ID", -1);
              commit("UPDATE_POINTS_FOR_GROUP", null);
              commit("UPDATE_ALL_GAMES", []);
              commit("UPDATE_ACTIVE_GAMEDAYS", []);
              commit("UPDATE_RANKING", []);
              commit("UPDATE_GROUP_DATA", null);
              commit("UPDATE_SHOW_GROUP", true);
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
              commit("UPDATE_LOADING", false);
            });
      });
    },
    getUserSeasons({ commit, dispatch }) {
      commit("UPDATE_LOADING", true);
      helper
          .requestUserSeasons()
          .then((response) => {
            commit("UPDATE_USER_SEASONS", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to get your current seasons.",
            });
          })
          .finally(() => {
            commit("UPDATE_LOADING", false);
          });
    },
    getUserSubscriptions({ commit, dispatch }) {
      commit("UPDATE_LOADING", true);
      helper
          .requestUserSubscriptions()
          .then((response) => {            
            commit("UPDATE_USER_SUBSCRIPTIONS", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to get your subscriptions.",
            });
          })
          .finally(() => {
            commit("UPDATE_LOADING", false);
          });
    },
    subscribeEmail({ commit, dispatch }, parameter: { seasonID: string, isToday: boolean }) {
      commit("UPDATE_LOADING", true);
      helper
          .subscribeEmail(parameter)
          .then((response) => {
            console.log(response.data);
            
            commit("UPDATE_USER_SUBSCRIPTIONS", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to add your subscriptions.",
            });
          })
          .finally(() => {
            commit("UPDATE_LOADING", false);
          });
    },
    unsubscribeEmail({ commit, dispatch }, parameter: { seasonID: string, isToday: boolean }) {
      commit("UPDATE_LOADING", true);
      helper
          .unsubscribeEmail(parameter)
          .then((response) => {
            console.log(response.data);
            
            commit("UPDATE_USER_SUBSCRIPTIONS", response.data);
          })
          .catch((e) => {
            dispatch("handleError", {
              error: e,
              message: "Failed to add your subscriptions.",
            });
          })
          .finally(() => {
            commit("UPDATE_LOADING", false);
          });
    },
    handleError({ commit, dispatch }, { error, message }) {
      if (error && error.response && error.response.status == 401) {
        router.push("/");
        dispatch("LOGOUT");
      } else {
        commit("UPDATE_LOADING", false);
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
      helper.getSingleUser().catch((error) => {
        if (error.response) {
          if (error.response.status == 401) {
            router.push("/");
            dispatch("LOGOUT");
            return false;
          } else return true;
        } else return true;
      });
    },
    getVersion() {
      return helper
          .getVersion()
          .then((val) => {
            return val.data;
          })
          .catch((error) => {
            return undefined;
          });
    },
    UPDATE_LOADING({ commit }, bool) {
      commit("UPDATE_LOADING", bool);
    },
  },
});

/**
 * Creates a Vuex Store
 * @return {Store<State>} the generated store
 */
export function useStore(): Store<State> {
  return baseUseStore(key);
}
