<template>
  <ion-header>
    <ion-toolbar class="ion-color custom-bg text-light">
      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col id="header"> </ion-col>
          <ion-col size="auto">
            <ion-grid>
              <ion-row style="height: 50%">
                <ion-col>
                  <ion-buttons class="align-middle ion-float-right items-end">
                    <ion-button v-if="playTab"
                      fill="clear"
                      @click="changeView"
                      class="ion-float-right"
                    >
                      <ion-icon v-if="sortByMonth" :icon="apps" />
                      <ion-icon v-else :icon="calendar" />
                    </ion-button>
                    <ion-button
                      fill="clear"
                      @click="refreshClicked"
                      class="ion-float-right"
                    >
                      <ion-icon :icon="refresh" />
                    </ion-button>
                    <ion-button
                      fill="clear"
                      @click="goToSettings"
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
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonButton,
  IonButtons,
  IonText,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { refresh, settingsOutline, calendar, apps } from "ionicons/icons";
import { mapState } from "vuex";

export default defineComponent({
  name: "CustomHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
    playTab: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["refresh", "changeView"],
  components: {
    IonHeader,
    IonToolbar,
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
      calendar,
      apps,
    };
  },
  methods: {
    refreshClicked() {
      this.$emit("refresh");
    },
    changeView() {
      this.$emit("changeView");
    },
    goToSettings() {
      this.$router.push("/settings");
    },
  },
  computed: mapState([
    "sortByMonth",
  ]),
});
</script>

<style scoped>
#header {
  background: url(../img/header.png) no-repeat;
  background-size: auto 100%;
}
</style>
