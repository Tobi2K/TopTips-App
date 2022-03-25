<template>
  <ion-list v-if="groupData != null">
    <ion-list-header>Current Group</ion-list-header>
    <ion-item>
      <ion-label>
        <ion-row>
          <ion-col style="padding-left: 0">
            <h2><strong>Name:</strong> {{ groupData.name }}</h2>
          </ion-col>
          <ion-col>
            <ion-text @click="openGroupModal()" class="ion-float-right">
              <ion-icon :icon="pencilOutline" />
            </ion-text>
          </ion-col>
        </ion-row>
        <ion-row v-if="groupData.passphrase">
          <ion-col style="padding-left: 0">
            <strong>Passphrase:</strong> {{ groupData.passphrase }}
          </ion-col>
          <ion-col>
            <ion-text
              @click="copyPassphrase(groupData.passphrase)"
              class="ion-float-right"
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
  toastController,
  IonText,
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { copyOutline, pencilOutline } from "ionicons/icons";

import moment from "moment";

import { mapState } from "vuex";
import EditGroupModalVue from "./EditGroupModal.vue";

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
          navigator.clipboard.writeText(passphrase);
          toastController
            .create({
              message: "Passphrase copied to clipboard.",
              duration: 2000,
            })
            .then((value) => {
              value.present();
            });
        } catch (e) {
          toastController
            .create({
              message: "Copy failed. Sorry :(",
              duration: 2000,
            })
            .then((value) => {
              value.present();
            });
        }
      } else {
        toastController
          .create({
            message: "Copy failed. Sorry :(",
            duration: 2000,
          })
          .then((value) => {
            value.present();
          });
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
