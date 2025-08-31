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
            <span
              class="passphrase"
              @click="copyPassphrase(groupData.passphrase)"
              >{{ groupData.passphrase }}</span
            >
          </ion-col>
          <ion-col>
            <ion-text
              @click="copyPassphrase(groupData.passphrase)"
              class="ion-float-right pointer"
            >
              <ion-icon :icon="copyOutline" />
            </ion-text>
          </ion-col>
        </ion-row>
        <p v-else>
          <strong>Passphrase:</strong> Ask the owner ({{
            groupData.owner.name
          }}) for the passphrase
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
          {{ groupData.season.name }} is not actively synced as there is not enough interest! Let me know at <a href="mailto:admin@toptips.page">admin@toptips.page</a> if you want to play this season.
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
} from "@ionic/vue";
import { defineComponent } from "vue";

import { copyOutline, pencilOutline } from "ionicons/icons";

import moment from "moment";

import { mapState } from "vuex";
import EditGroupModalVue from "./EditGroupModal.vue";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
import { showToast } from "@/store/helper";

export default defineComponent({
  name: "CurrentGroup",
  setup() {
    return {
      moment,
      copyOutline,
      pencilOutline,
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
