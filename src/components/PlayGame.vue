<template>
  <div :key="games" style="height: 100%">
    <ion-grid>
      <ion-row>
        <ion-col
          size-xs="24"
          size-lg="12"
          size-xl="8"
          v-for="(item, index) in games.games"
          :key="index"
          style="padding: 0"
        >
          <ion-grid>
            <ion-card style="background: transparent" class="pointer">
              <ion-card-content
                class="ion-no-padding text-light"
                @click="openModal(item)"
                :do="
                  generateGradient(
                    item.team1_background,
                    item.team2_background,
                    item.id
                  )
                "
                :id="'game' + item.id"
              >
                <ion-card-header v-if="games.special">
                  <ion-card-title :style="'color:' + item.team1_text">
                    {{ item.game_desc }}
                  </ion-card-title>
                </ion-card-header>
                <ion-row class="align-middle border-bottom">
                  <ion-col
                    size="6"
                    class="ion-text-end medium-text"
                    style="font-size: 80%"
                  >
                    <span :style="'color:' + item.team1_text">{{
                      item.team1_name
                    }}</span>
                  </ion-col>
                  <ion-col size="4" class="align-middle">
                    <svg
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <text
                        font-size="2.5em"
                        x="50"
                        y="53"
                        :fill="item.team1_text"
                        textLength="75"
                        dominant-baseline="middle"
                      >
                        {{ item.team1_abbr }}
                      </text>
                    </svg>
                  </ion-col>
                  <ion-col
                    class="ion-text-center"
                    size="4"
                    :style="
                      'color:' +
                      (item.team1_text == item.team2_text
                        ? item.team1_text
                        : '#FFFFFF')
                    "
                    >{{ item.game_string }}</ion-col
                  >
                  <ion-col size="4" class="align-middle">
                    <svg
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <text
                        font-size="2.5em"
                        x="50"
                        y="53"
                        :fill="item.team2_text"
                        textLength="75"
                        dominant-baseline="middle"
                      >
                        {{ item.team2_abbr }}
                      </text>
                    </svg>
                  </ion-col>
                  <ion-col size="6" class="ion-text-start medium-text">
                    <small :style="'color:' + item.team2_text">{{
                      item.team2_name
                    }}</small>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col
                    class="ion-text-start small-text"
                    :style="'color:' + item.team1_text"
                    >Date: {{ item.date_string }}</ion-col
                  >
                  <ion-col
                    v-if="item.guessed"
                    class="ion-text-end small-text"
                    :style="'color:' + item.team2_text"
                    ><ion-icon :icon="checkmarkOutline" /> ({{ item.guess }})
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
          </ion-grid>
        </ion-col>
      </ion-row>
    </ion-grid>
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
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { checkmarkOutline } from "ionicons/icons";

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
  emits: ["loaded"],
  setup() {
    return {
      checkmarkOutline,
    };
  },
  components: {
    IonCol,
    IonRow,
    IonGrid,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
  },
  mounted() {
    this.$emit("loaded");
  },
  methods: {
    async openModal(item) {
      const guessModal = await modalController.create({
        component: GuessModal,
        componentProps: {
          gameInfo: item,
          sectionID: this.sectionID, // 0-indexed
        },
      });
      await guessModal.present();
    },
    generateGradient(hex1, hex2, id) {
      const rgb1 = this.hexToRGB(hex1);
      const rgb2 = this.hexToRGB(hex2);

      const game = document.getElementById("game" + id);
      if (game) {
        game.style.background =
          "linear-gradient(to right, " + rgb1 + ", " + rgb2 + ")";
      }
    },
    hexToRGB(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      const rgb = result ?
        {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        } :
        null;

      return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
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

text {
  font-family: monospace;
  text-anchor: middle;
}
</style>
