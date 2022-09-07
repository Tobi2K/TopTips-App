import { toastController } from "@ionic/vue";
import axios, { AxiosResponse } from "axios";
import { store } from "./store";

/**
 * Gets all competitions for a country
 * @param {string} path needs to be /competition/country/ + yourCountry
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getCompetitions(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets all groups for a user
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getUserGroups(): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + "/group/user/all", {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets all games for a group
 * @param {string} path needs to be /game/all/format/ + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getAllGames(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets all currently active gamedays (i.e. gameday with a game today)
 * @param {string} path needs to be /game/days/active/ + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getActiveGamedays(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Requests to join a group
 * @param {{ passphrase: string }} parameter passes the passphrase
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function joinGroup(parameter: {
  passphrase: string;
}): Promise<AxiosResponse<any, any>> {
  return axios.post(process.env.VUE_APP_HOST + "/group/join", parameter, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets the current gameday for a group
 * @param {string} path needs to be /competition/current/ + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getCurrentGameday(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets info for the current group
 * @param {string} path needs to be /group/user/ + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getGroups(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets all points for the current group
 * @param {string} path needs to be /points/all/format/ + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getScores(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets the user guess for a specified game in a specified group
 * @param {string} path needs to be /guess/game/ + gameID + / + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getSingleGuess(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets all guesses for a specified game in a specified group
 * @param {string} path needs to be /guess/all/ + gameID + / + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function requestGroupGuesses(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Sets the users name
 * @param {{ passphrase: string }} parameter the new username
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function setUserName(parameter: {
  name: string;
}): Promise<AxiosResponse<any, any>> {
  return axios.post(process.env.VUE_APP_HOST + "/user/name", parameter, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets all seasons for a competition
 * @param {string} path needs to be /competition/seasons/ + yourCompetition
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getSeasons(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets all countries that have a competition
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getCountries(): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + "/competition/countries", {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Changes group name
 * @param {string} path needs to be /group/rename/ + yourGroupID
 * @param {{ passphrase: string }} parameter the new group name
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function sendGroupName(
    path: string,
    parameter: { name: string },
): Promise<AxiosResponse<any, any>> {
  return axios.post(process.env.VUE_APP_HOST + path, parameter, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Request to leave a group
 * @param {string} path needs to be /group/leave/ + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function requestLeaveGroup(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Request to delete a group
 * @param {string} path needs to be /group/delete/ + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function requestDeleteGroup(
    path: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets all seasons for the user
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function requestUserSeasons(): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + "/competition/user", {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets user data
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getSingleUser(): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + "/user/single", {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets the overall user rank
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getUserRank(): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + "/points/user/rank", {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Gets the newest app version
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getVersion(): Promise<AxiosResponse<any, any>> {
  return axios.get(process.env.VUE_APP_HOST + "/version", {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Generates a toast to be shown at the bottom of the screen
 * @param {string} toastMessage the message to be displayed
 */
export async function showToast(toastMessage: string) {
  toastController
      .create({
        message: toastMessage,
        duration: 2000,
      })
      .then((value) => {
        value.present();
      });
}
