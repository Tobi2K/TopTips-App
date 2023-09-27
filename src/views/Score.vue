<template>
  <ion-page>
    <custom-header title="Group Score" @refresh="refreshAll" />
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content> </ion-refresher-content>
      </ion-refresher>
      <ion-fab vertical="bottom" horizontal="start" slot="fixed">
        <ion-fab-button size="small" color="medium">
          <ion-icon :icon="caretUpOutline" />
        </ion-fab-button>

        <ion-fab-list side="top">
          <ion-fab-button color="light" @click="showPointsDesc()">
            <ion-icon :icon="helpCircleOutline" />
          </ion-fab-button>
          <ion-fab-button color="light" @click="getRank()">
            <ion-icon :icon="medalOutline" />
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
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
  IonFab,
  IonFabButton,
  IonIcon,
  alertController,
  IonFabList,
} from "@ionic/vue";

import ScoreSection from "@/components/ScoreSection.vue";

import CustomHeader from "@/components/CustomHeader.vue";

import {
  helpCircleOutline,
  medalOutline,
  caretUpOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";
import { getUserRank, showToast } from "@/store/helper";

export default defineComponent({
  name: "ScoreView",
  components: {
    IonContent,
    IonPage,
    ScoreSection,
    IonRefresher,
    IonRefresherContent,
    CustomHeader,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
  },
  setup() {
    return {
      helpCircleOutline,
      medalOutline,
      caretUpOutline,
    };
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
    async showPointsDesc() {
      alertController
          .create({
            cssClass: "points-alert",
            header: "How are points calculated?",
            message:
            "You get 1 point for: \n" +
            "- Correct Winner\n" +
            "- Correct Goals (per Team)\n" +
            "- Correct Goal Difference\n" +
            "- Perfect Score\n\n" +
            "In total, a maximum of 5 points can be achieved per game. \n\n" +
            "Additionally, to incentivize guessing draws, correctly predicting a tied game gains you a point" +
            " and an exact prediction of a draw a further point. " +
            "With this addition, a perfect draw earns 7 points, " +
            "while a draw with the incorrect goal amount earns 3 points.",
            buttons: ["OK"],
          })
          .then((val) => {
            val.present();
          });
    },
    generateAlert(message: string) {
      showToast(message);
    },
    getRank() {
      getUserRank()
          .then((response) => {
            alertController
                .create({
                  cssClass: "points-alert",
                  header: "You are #" + response.data.rank + " overall.",
                  message:
                "This is your position compared to all other TopTips users. \n\n" +
                "Total Points: " +
                response.data.points +
                "\nYou are part of " +
                response.data.groups +
                " group(s).",
                  buttons: ["Dismiss"],
                })
                .then((alert) => alert.present());
          })
          .catch(() => {
            this.generateAlert("Could not get your rank. Sorry!");
          });
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

<style>
.points-alert .alert-head .alert-title {
  font-size: 18px !important;
}

.points-alert {
  white-space: pre-wrap;
}
</style>
