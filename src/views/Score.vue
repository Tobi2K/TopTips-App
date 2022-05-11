<template>
  <ion-page>
    <custom-header title="Group Score" @refresh="refreshAll" />
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content> </ion-refresher-content>
      </ion-refresher>
      <score-section @done="endRefresh" :key="refreshGame" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";

import ScoreSection from "@/components/ScoreSection.vue";

import CustomHeader from "@/components/CustomHeader.vue";

import { refresh, settingsOutline } from "ionicons/icons";

import { defineComponent } from "vue";

export default defineComponent({
  name: "ScoreView",
  components: {
    IonContent,
    IonPage,
    ScoreSection,
    IonRefresher,
    IonRefresherContent,
    CustomHeader,
  },
  data() {
    return {
      refreshGame: false,
      fullList: true,
      target: null as unknown as {
        target: {
          complete: () => void;
        };
      },
    };
  },
  setup() {
    return {
      refresh,
      settingsOutline,
    };
  },
  mounted() {
    this.$store.dispatch("checkJWT");
  },
  methods: {
    refreshAll() {
      this.refreshGame = !this.refreshGame;
    },
    doRefresh(event: { target: { complete: () => void } }) {
      this.refreshAll();
      this.target = event;
    },
    endRefresh() {
      if (this.target != null) {
        this.target.target.complete();
      }
    },
  },
});
</script>

<style scoped>
.tm {
  margin-bottom: 5%;
}
.tm :first-child {
  font-weight: bold;
}
h2 {
  text-align: center;
}
#imgItem {
  margin-top: 10%;
  text-align: center;
  --background: var(--ion-background-color);
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
