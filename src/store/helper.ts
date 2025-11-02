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
 * Gets the ranking for the current season.
 * @param {string} path needs to be /standing/ + yourGroupID
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function getRanking(
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
 * Updates the users password
 * @param {{ oldPass: string, newPass: string }} parameter the old and new password
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function changePassword(parameter: {
  oldPassword: string;
  newPassword: string;
}): Promise<AxiosResponse<any, any>> {
  return axios.post(process.env.VUE_APP_HOST + "/auth/updatePass", parameter, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Resets the users password
 * @param {{ name: string }} parameter the username
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function resetPassword(parameter: {
  name: string;
}): Promise<AxiosResponse<any, any>> {
  return axios.post(process.env.VUE_APP_HOST + "/auth/forgot", parameter, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Deletes the users account
 * @param {{ password: string }} parameter the account password
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function deleteAccount(parameter: {
  password: string;
}): Promise<AxiosResponse<any, any>> {
  return axios.post(process.env.VUE_APP_HOST + "/auth/delete", parameter, {
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
 * Gets all email subscriptions for the user
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function requestUserSubscriptions(): Promise<
  AxiosResponse<any, any>
> {
  return axios.get(process.env.VUE_APP_HOST + "/email/subscribed", {
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
 * Subscribes a user to email notifications
 * @param {{seasonID: string, isToday: boolean}} parameter ID of the season and whether to subscribe to on the same day
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function subscribeEmail(parameter: {
  seasonID: string;
  isToday: boolean;
}): Promise<AxiosResponse<any, any>> {
  return axios.post(process.env.VUE_APP_HOST + "/email/subscribe", parameter, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

/**
 * Subscribes a user to email notifications
 * @param {{seasonID: string, isToday: boolean}} parameter ID of the season and if to unsubscribe to on the same day
 * @return {Promise<AxiosResponse<any, any>>} axios request promise
 */
export async function unsubscribeEmail(parameter: {
  seasonID: string;
  isToday: boolean;
}): Promise<AxiosResponse<any, any>> {
  return axios.post(
    process.env.VUE_APP_HOST + "/email/unsubscribe",
    parameter,
    {
      headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
    },
  );
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

/**
 * Generates a danger toast to be shown at the bottom of the screen
 * @param {string} toastMessage the message to be displayed
 */
export async function showDangerToast(toastMessage: string) {
  toastController
    .create({
      message: toastMessage,
      duration: 2000,
      color: "danger",
    })
    .then((value) => {
      value.present();
    });
}
