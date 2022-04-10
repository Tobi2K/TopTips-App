import { toastController } from "@ionic/vue";
import axios from "axios";
import { store } from "./store";

export async function getCompetitions(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getUserGroups() {
  return axios.get(process.env.VUE_APP_HOST + `/group/user/all`, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getAllGames(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function joinGroup(parameter: any) {
  return axios.post(process.env.VUE_APP_HOST + `/group/join`, parameter, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getCurrentGameday(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getGroups(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getScores(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getSingleGuess(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function requestGroupGuesses(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function setUserName(parameter: any) {
  return axios.post(process.env.VUE_APP_HOST + `/user/name`, parameter, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getSeasons(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getCountries() {
  return axios.get(process.env.VUE_APP_HOST + `/competition/countries`, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function sendGroupName(path: string, parameter: any) {
  return axios.post(process.env.VUE_APP_HOST + path, parameter, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function requestLeaveGroup(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function requestDeleteGroup(path: string) {
  return axios.get(process.env.VUE_APP_HOST + path, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function requestUserSeasons() {
  return axios.get(process.env.VUE_APP_HOST + `/competition/user`, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getSingleUser() {
  return axios.get(process.env.VUE_APP_HOST + `/user/single`, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

export async function getUserRank() {
  return axios.get(process.env.VUE_APP_HOST + `/points/user/rank`, {
    headers: { Authorization: `Bearer ${store.state.user.accessToken}` },
  });
}

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
