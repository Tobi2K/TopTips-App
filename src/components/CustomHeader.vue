<template>
  <ion-header>
    <ion-toolbar class="ion-color custom-bg text-light">
      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col size="2">
            <img src="@/img/logo.svg" style="height: 100%" alt="HBL Logo" />
          </ion-col>
          <ion-col>
            <ion-grid style="height: 100%">
              <ion-row style="height: 50%">
                <ion-col>
                  <ion-title class="align-middle"> Top Tipps </ion-title>
                </ion-col>
                <ion-col>
                  <ion-buttons class="align-middle ion-float-right items-end">
                    <ion-button
                      fill="clear"
                      @click="refreshClicked"
                      class="ion-float-right"
                    >
                      <ion-icon :icon="refresh" />
                    </ion-button>
                    <ion-button
                      fill="clear"
                      @click="openModal"
                      class="ion-float-right"
                    >
                      <ion-icon :icon="settingsOutline" />
                    </ion-button>
                  </ion-buttons>
                </ion-col>
              </ion-row>
              <ion-row style="height: 50%">
                <ion-col>
                  <ion-text
                    class="align-middle ion-padding-end ion-justify-content-end"
                  >
                    {{ title }}
                  </ion-text>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonButton,
  IonButtons,
  IonText,
  modalController,
} from "@ionic/vue";

import SettingsModal from "@/components/SettingsModal.vue";

import { defineComponent } from "vue";
import { refresh, settingsOutline } from "ionicons/icons";

export default defineComponent({
  name: "CustomHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  emits: ["refresh"],
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonCol,
    IonRow,
    IonIcon,
    IonButton,
    IonButtons,
    IonText,
  },
  setup() {
    return {
      refresh,
      settingsOutline,
    };
  },
  methods: {
    refreshClicked() {
      this.$emit("refresh");
    },
    async openModal() {
      const settingsModal = await modalController.create({
        component: SettingsModal,
        componentProps: {
          title: "Settings",
        },
      });
      await settingsModal.present();
    },
  },
});
</script>
