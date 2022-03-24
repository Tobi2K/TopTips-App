<template>
  <div :key="games" style="height: 100%">
    <div v-for="(item, index) in games.games" :key="index">
      <ion-grid>
        <ion-card style="background: transparent">
          <ion-card-content
            class="ion-no-padding text-light"
            @click="openModal(item)"
            style="background: transparent"
          >
            <ion-card-header v-if="games.special" class="custom-bg-opacity-95">
              <ion-card-title color="light">
                {{ item.game_desc }}
              </ion-card-title>
            </ion-card-header>
            <ion-row class="align-middle custom-bg-opacity-95 border-bottom">
              <ion-col size="7" class="ion-text-end medium-text">
                {{ item.team1_name }}
              </ion-col>
              <ion-col size="3" class="align-middle">
                <img
                  v-if="item.team1_id < 18"
                  :src="'./assets/img/team_' + item.team1_id + '.png'"
                  alt="teamLogo"
                />
                <img
                  v-else
                  :src="'./assets/img/default_team.png'"
                  alt="teamLogo"
                />
              </ion-col>
              <ion-col class="ion-text-center" size="4">{{
                item.game_string
              }}</ion-col>
              <ion-col size="3" class="align-middle">
                <img
                  v-if="item.team2_id < 18"
                  :src="'./assets/img/team_' + item.team2_id + '.png'"
                  alt="teamLogo"
                />
                <img
                  v-else
                  :src="'./assets/img/default_team.png'"
                  alt="teamLogo"
                />
              </ion-col>
              <ion-col size="7" class="ion-text-start medium-text"
                >{{ item.team2_name }}
              </ion-col>
            </ion-row>
            <ion-row class="custom-bg-opacity-95">
              <ion-col size="16" class="ion-text-start small-text"
                >Date: {{ item.date_string }}</ion-col
              >
              <ion-col class="small-text ion-text-center" size="8">
                {{ item.bet_string }}
              </ion-col>
            </ion-row>
          </ion-card-content>
        </ion-card>
      </ion-grid>
    </div>
  </div>
</template>

<script>
import {
  IonCol,
  IonRow,
  IonGrid,
  modalController,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";
import { defineComponent } from "vue";

import GuessModal from "@/components/GuessModal.vue";

export default defineComponent({
  name: "PlayGame",
  props: {
    sectionID: {
      type: Number,
      required: true,
    },
    games: {
      required: true,
    },
  },
  components: {
    IonCol,
    IonRow,
    IonGrid,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
  },
  data() {
    return {
      refresh: false,
    };
  },
  methods: {
    async openModal(item) {
      const guessModal = await modalController.create({
        component: GuessModal,
        componentProps: {
          gameInfo: item,
        },
      });
      await guessModal.present();
      await guessModal.onDidDismiss().then(() => {
        this.refresh = !this.refresh;
      });
    },
  },
});
</script>

<style scoped>
ion-grid {
  --ion-grid-columns: 24;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
