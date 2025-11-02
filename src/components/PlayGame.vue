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
            <ion-card style="background: transparent; margin-top: 4px; margin-bottom: 8px; margin-left: 0px; margin-right: 0px;" class="pointer">
              <ion-card-content
                class="ion-no-padding text-light"
                @click="openModal(index, this.games.games)"
                :do="
                  generateGradient(
                    item.team1_background,
                    item.team2_background,
                    item.id
                  )
                "
                :id="'game' + item.id"
              >
                <ion-card-header v-if="item.game_desc">
                  <ion-card-title :style="'color:' + item.team1_text">
                    {{ item.game_desc }}
                  </ion-card-title>
                </ion-card-header>
                <ion-row>
                  <ion-col class="ion-no-padding" :style="
                      'color:' +
                      (item.team1_text == item.team2_text
                        ? item.team1_text
                        : '#FFFFFF')
                    "><span class="date-heading line-left line-right"><span>{{ item.date_string }}</span></span></ion-col>
                </ion-row>
                <ion-row class="align-middle border-bottom">
                  <ion-col
                    size="6"
                    class="ion-text-end medium-text"
                    style="font-size: 75%"
                  >
                    <span :style="'color:' + item.team1_text">{{
                      item.team1_short_name
                    }}</span>
                  </ion-col>
                  <ion-col size="4" class="align-middle">
                    <svg
                      width='100%'
                      height='100%'
                      viewBox="0 0 100 70"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <text
                        font-size="2.5em"
                        x="50"
                        y="38"
                        :fill="item.team1_text"
                        textLength="75"
                        dominant-baseline="middle"
                      >
                        {{ item.team1_abbr }}
                      </text>
                    </svg>
                  </ion-col>
                  <ion-col
                    class="ion-text-center small-text-on-mobile"
                    size="4"
                    :style="
                      'color:' +
                      (item.team1_text == item.team2_text
                        ? item.team1_text
                        : '#FFFFFF')
                    "
                    >
                    <span v-if="item.game_string == '-' && item.guessed"><ion-icon :icon="checkmarkOutline" /></span>
                    <span v-else-if="item.game_string == '-' && moment(item.date).isSame(moment().endOf('day'), 'day')">!</span>
                    <span v-else>{{ item.game_string }}</span>
                    </ion-col
                  >
                  <ion-col size="4" class="align-middle">
                    <svg
                      width='100%'
                      height='50%'
                      viewBox="0 0 100 70"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <text
                        font-size="2.5em"
                        x="50"
                        y="38"
                        :fill="item.team2_text"
                        textLength="75"
                        dominant-baseline="middle"
                      >
                        {{ item.team2_abbr }}
                      </text>
                    </svg>
                  </ion-col>
                  <ion-col size="6" class="ion-text-start medium-text"
                    style="font-size: 75%">
                    <span :style="'color:' + item.team2_text">{{
                      item.team2_short_name
                    }}</span>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <!-- <ion-col
                    class="ion-text-start small-text"
                    :style="'color:' + item.team1_text"
                    >Date: {{ item.date_string }}</ion-col
                  > -->
                  <!-- <ion-col
                    v-if="item.guessed"
                    class="ion-text-end small-text"
                    :style="'color:' + item.team2_text"
                    ><ion-icon :icon="checkmarkOutline" /> ({{ item.guess }})
                  </ion-col> -->
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

import moment from "moment";

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
      moment,
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
    async openModal(index, games) {
      const guessModal = await modalController.create({
        component: GuessModal,
        componentProps: {
          gameIndex: index,
          games: games,
          sectionID: this.sectionID, // 0-indexed
        },
        cssClass: ["bigmodal"],
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

.date-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70%;
}
.date-heading span {
  margin: 0 15px;
}
.date-heading:before,
.date-heading:after {
  background: #717171;
  height: 1px;
  flex: 1;
  content: '';
}
.date-heading.left:after {
  background: none;
}
.date-heading.right:before {
  background: none;
}

</style>

<style>
@media (min-height: 900px) and (min-width: 900px) {
.bigmodal {
  --width: 850px !important;
  --height: 850px !important;
}
}

@media (max-width: 400px) {
.small-text-on-mobile {
  font-size: small;
}

}
</style>
