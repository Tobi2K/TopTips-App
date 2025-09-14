<template>
  <ion-list v-if="groupData != null">
    <ion-list-header style="font-size: 150%; text-decoration: underline;">Current Group</ion-list-header>
    <ion-item>
      <ion-label>
        <ion-row>
          <ion-col style="padding-left: 0">
            <h2><strong>Name:</strong> {{ groupData.name }}</h2>
          </ion-col>
          <ion-col>
            <ion-text @click="openGroupModal()" class="ion-float-right pointer">
              <ion-icon :icon="pencilOutline" />
            </ion-text>
          </ion-col>
        </ion-row>
        <ion-row v-if="groupData.passphrase">
          <ion-col style="padding-left: 0">
            <strong>Passphrase: </strong>
            <span class="passphrase" @click="copyPassphrase(groupData.passphrase)">{{ groupData.passphrase }}</span>
          </ion-col>
          <ion-col>
            <ion-text @click="copyPassphrase(groupData.passphrase)" class="ion-float-right pointer">
              <ion-icon :icon="copyOutline" />
            </ion-text>
          </ion-col>
        </ion-row>
        <p v-else>
          <strong>Passphrase:</strong> Ask the owner ({{ groupData.owner.name }}) for the passphrase
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-label>
        <h2><strong>Season:</strong> {{ groupData.season.name }}</h2>
        <p>
          <strong>Duration:</strong>
          {{ this.moment(groupData.season.start_date).format("DD MMM, YYYY") }}
          -
          {{ this.moment(groupData.season.end_date).format("DD MMM, YYYY") }}
        </p>
        <p style="color: red;" v-if="groupData.season.important == 0">
          {{ groupData.season.name }} is not actively synced as there is not enough interest! Let me know at <a
            href="mailto:admin@toptips.page">admin@toptips.page</a> if you want to play this season.
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-label>
        <h2><strong>Members:</strong></h2>
        <p v-for="member in groupData.members" :key="member">
          {{ member }}
        </p>
      </ion-label>
    </ion-item>
    <ion-list-header v-if="android"><b>Notifications for {{ groupData.name }}.</b></ion-list-header>
    <ion-item v-if="android">
      <ion-toggle @ionChange="
        toggleStatus('group' + groupData.id, groupData.name)
        " :value="groupData.id" :checked="getStatus('group' + groupData.id)">
        <small>Group information (e.g. perfect games).</small>
      </ion-toggle>
    </ion-item>
    <ion-item v-if="android">
      <ion-toggle @ionChange="toggleStatus('season' + groupData.season.id, groupData.season.name)"
        :value="groupData.season.id" :checked="getStatus('season' + groupData.season.id)">
        <small>Pending games (at 12 PM, Berlin Time).</small>
      </ion-toggle>
    </ion-item>
    <ion-item lines="none">
      <ion-label>
        <p><i>You can configure email notifications for this group in the app settings.</i></p>
      </ion-label>
      <small></small>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import {
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  modalController,
  IonToggle,
  isPlatform
} from "@ionic/vue";
import { defineComponent } from "vue";

import { copyOutline, pencilOutline } from "ionicons/icons";

import moment from "moment";

import { mapState } from "vuex";
import { FCM } from "@capacitor-community/fcm";
import EditGroupModalVue from "./EditGroupModal.vue";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
import { showToast } from "@/store/helper";

export default defineComponent({
  name: "CurrentGroup",
  setup() {
    const android = isPlatform("android") && !isPlatform("pwa") && !isPlatform("mobileweb");
    return {
      moment,
      copyOutline,
      pencilOutline,
      android,
    };
  },
  components: {
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonRow,
    IonCol,
    IonIcon,
    IonText,
    IonToggle,
  },
  methods: {
    async copyPassphrase(passphrase: string) {
      if (passphrase != "") {
        try {
          toClipboard(passphrase);
          showToast("Passphrase copied to clipboard.");
        } catch (e) {
          showToast("Copy failed. Sorry :(");
        }
      } else {
        showToast("Copy failed. Sorry :(");
      }
    },
    async openGroupModal() {
      const groupModal = await modalController.create({
        component: EditGroupModalVue,
      });
      await groupModal.present();
    },
    toggleStatus(id: string, name: string) {
      const escapedID = id.replaceAll(":", "");
      if (localStorage.getItem(escapedID) == "true") {
        // unsubscribe
        FCM.unsubscribeFrom({ topic: escapedID })
          .then(() => {
            localStorage.setItem(escapedID, "false");
            this.generateAlert("Unsubscribed from notifications for " + name);
          })
          .catch(() => this.generateAlert("Operation failed. Sorry!"));
      } else {
        // subscribe
        FCM.subscribeTo({ topic: escapedID })
          .then(() => {
            localStorage.setItem(escapedID, "true");
            this.generateAlert("Subscribed to notifications for " + name);
          })
          .catch(() => this.generateAlert("Operation failed. Sorry!"));
      }
    },
    getStatus(id: string) {
      const escapedID = id.replaceAll(":", "");
      return localStorage.getItem(escapedID) == "true";
    },
    generateAlert(message: string) {
      showToast(message);
    },
  },
  computed: mapState(["groupData"]),
});
</script>


<style scoped>
@font-face {
  font-family: "Consolas";
  src: url("../font/Consolas.ttf");
}

.passphrase {
  font-family: "Consolas";
  padding: 4px;
  border-radius: 5px;
  background-color: rgba(120, 120, 120, 0.3);
  cursor: pointer;
}
</style>
