<template>
  <ion-header>
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-title class="align-middle">{{ groupData.name }}</ion-title>
          </ion-col>
          <ion-col>
            <ion-buttons class="ion-float-right">
              <ion-button @click="toggleName()">
                <ion-icon v-if="showNames" :icon="imageOutline" />
                <ion-icon v-else :icon="textOutline" />
              </ion-button>
              <ion-button @click="closeModal">
                <ion-icon :icon="close" />
              </ion-button>
            </ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row class="align-middle">
        {{ timeString }}
      </ion-row>
      <ion-row class="align-middle" v-if="showNames">
        <ion-col
          class="ion-text-center"
          style="text-decoration: underline"
          size="5"
        >
          <h2>{{ gameInfo.team1_name }}</h2>
        </ion-col>
        <ion-col class="ion-text-center" size="2"><h2>vs.</h2></ion-col>
        <ion-col
          class="ion-text-center"
          style="text-decoration: underline"
          size="5"
        >
          <h2>{{ gameInfo.team2_name }}</h2>
        </ion-col>
      </ion-row>
      <ion-row class="align-middle" v-else>
        <ion-col class="ion-text-end" size="5">
          <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="1"
              y="0"
              width="97"
              height="50"
              rx="10"
              :fill="gameInfo.team1_background"
            />
            <text
              font-size="2.5em"
              x="50"
              y="28"
              :fill="gameInfo.team1_text"
              textLength="75"
              dominant-baseline="middle"
            >
              {{ gameInfo.team1_abbr }}
            </text>
          </svg>
        </ion-col>
        <ion-col class="ion-text-center" size="2"><h2>vs.</h2></ion-col>
        <ion-col class="ion-text-start" size="5">
          <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="1"
              y="0"
              width="97"
              height="50"
              rx="10"
              :fill="gameInfo.team2_background"
            />
            <text
              font-size="2.5em"
              x="50"
              y="28"
              :fill="gameInfo.team2_text"
              textLength="75"
              dominant-baseline="middle"
            >
              {{ gameInfo.team2_abbr }}
            </text>
          </svg>
        </ion-col>
      </ion-row>
      <team-stats v-if="gameInfo.team1_stats && gameInfo.team2_stats" :gameInfo="gameInfo" />
      <div v-if="!isUpcoming()" class="ion-margin-top">
        <ion-row>
          <ion-col class="ion-text-center" style="padding-bottom: 0">
            <span style="font-size: 0.9em; text-decoration: underline"
              >Result:</span
            >
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-center" style="padding-top: 0">
            <span v-if="gameInfo.game_string != '-'" style="font-size: 2em">
              {{ gameInfo.game_string }}
            </span>
            <span v-else style="font-size: 2em"> TBD </span>
          </ion-col>
        </ion-row>
      </div>
      <div v-if="isUpcoming()">
        <ion-row>
          <ion-col>
            <h4><strong>Your Guess:</strong></h4>
          </ion-col>
        </ion-row>

        <ion-item>
          <ion-label position="floating">
            Goals by {{ gameInfo.team1_name }}
          </ion-label>
          <ion-input v-model="pointsTeam1" type="number"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">
            Goals by {{ gameInfo.team2_name }}
          </ion-label>
          <ion-input v-model="pointsTeam2" type="number"></ion-input>
        </ion-item>
        <ion-row>
          <ion-col class="ion-align-items-end">
            <ion-button
              color="success"
              class="ion-float-right"
              @click="sendData()"
              ><p style="margin-right: 5px">Save</p>
              <ion-icon :icon="send"
            /></ion-button>
          </ion-col>
        </ion-row>
      </div>
      <div v-else class="ion-margin-top">
        <ion-row style="font-size: 1.2em">
          <ion-col class="ion-text-start"><strong>Your Guess:</strong></ion-col>
        </ion-row>
        <ion-row
          style="
            border-bottom: 1px solid rgba(211, 211, 211, 0.8);
            font-size: 1.3em;
          "
        >
          <ion-col class="ion-text-center" v-if="pointsTeam1 != '-'">
            {{ pointsTeam1 }} : {{ pointsTeam2 }}
          </ion-col>
          <ion-col class="ion-text-center" v-else>-</ion-col>
          <ion-col
            v-if="points != undefined"
            class="ion-text-center"
          >
            Points: {{ points }}
          </ion-col>
        </ion-row>
      </div>
    </ion-grid>
    <game-guesses :gameID="gameInfo.id" />
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  modalController,
  IonGrid,
  IonCol,
  IonRow,
  IonInput,
  IonItem,
  IonLabel,
  IonIcon,
  useBackButton,
} from "@ionic/vue";
import { close, send, ellipse, helpCircleOutline, textOutline, imageOutline } from "ionicons/icons";
import { defineComponent } from "vue";

import GameGuesses from "@/components/GameGuesses.vue";
import TeamStats from "@/components/TeamStats.vue";

import moment from "moment";

import { mapState } from "vuex";
import { showToast } from "@/store/helper";
export default defineComponent({
  name: "GuessModal",
  props: {
    gameInfo: Object,
    sectionID: { // 0-indexed
      type: Number,
      required: true,
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonGrid,
    IonCol,
    IonRow,
    IonInput,
    IonItem,
    IonLabel,
    IonIcon,
    GameGuesses,
    TeamStats,
  },
  data() {
    let pointsTeam1;
    let pointsTeam2;
    let points;
    return {
      pointsTeam1,
      pointsTeam2,
      points,
      showNames: false,
    };
  },
  setup(props) {
    const closeModal = () => {
      modalController.dismiss();
    };

    useBackButton(10, () => {
      modalController.dismiss();
    });

    let timeString = moment(props.gameInfo.date).fromNow();

    timeString = timeString[0].toUpperCase() + timeString.substr(1);

    return {
      timeString,
      moment,
      closeModal,
      close,
      send,
      ellipse,
      helpCircleOutline,
      imageOutline,
      textOutline,
    };
  },
  methods: {
    sendData() {
      if (
        this.pointsTeam1 < 0 ||
        this.pointsTeam2 < 0 ||
        this.pointsTeam1 == undefined ||
        this.pointsTeam2 == undefined
      ) {
        showToast("Please fill out everything (≥0).");
      } else if (new Date(this.gameInfo.date) < new Date()) {
        showToast("You are too late :(");
      } else {
        this.$store
            .dispatch("addGuess", {
              game: this.gameInfo.id,
              team1: this.pointsTeam1,
              team2: this.pointsTeam2,
              sectionID: this.sectionID, // 0-indexed
            })
            .then(() => {
              modalController.dismiss();
              showToast("Saved guess successfully");
            })
            .catch();
      }
    },
    isUpcoming() {
      return new Date(this.gameInfo.date) > new Date();
    },
    toggleName() {
      this.showNames = !this.showNames;
    },
  },
  mounted() {
    this.$store
        .dispatch("getUserGuess", this.gameInfo.id)
        .then((val) => {
          if (val != "") {
            this.pointsTeam1 = val.score_team1;
            this.pointsTeam2 = val.score_team2;
            this.points = val.points;
          } else if (this.isUpcoming()) {
            this.points = undefined;
          } else {
            this.pointsTeam1 = "-";
            this.pointsTeam2 = "-";
            this.points = undefined;
          }
        })
        .catch();
  },
  computed: mapState(["groupData"]),
});
</script>

<style scoped>
text {
  font-family: monospace;
  text-anchor: middle;
}
</style>
