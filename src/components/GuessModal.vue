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
              <ion-button @click="closeModal">
                <ion-icon :icon="close"/>
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
      <ion-row class="align-middle">
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
      <ion-row class="align-middle" v-if="gameInfo.team1_position && gameInfo.team2_position">
        <ion-col class="ion-text-center" size="5" >
          #{{ gameInfo.team1_position }}
        </ion-col>
        <ion-col class="ion-text-center" size="2">Rank</ion-col>
        <ion-col class="ion-text-center" size="5">
          #{{ gameInfo.team2_position }}
        </ion-col>
      </ion-row>
      <ion-row class="align-middle" v-if="gameInfo.team1_history && gameInfo.team2_history">
        <ion-col class="ion-text-center" size="5" >
          <span v-for="i in gameInfo.team1_history" :key="i">
            <ion-icon v-if="i == 'W'" style="color:green" :icon="ellipse" />
            <ion-icon v-if="i == 'L'" style="color:red" :icon="ellipse" />
          </span>
        </ion-col>
        <ion-col class="ion-text-center" size="2">
          <ion-icon id="click-trigger" :icon="helpCircleOutline"/>
          <ion-popover
            trigger="click-trigger"
            trigger-action="click"
            size="auto"
            alignment="center"
            show-backdrop="false"
          >
            <ion-content class="ion-padding">
              <small>
                5 most recent games (from left to right)
                <ul>
                  <li>Win: Green</li>
                  <li>Loss: Red</li>
                  <li>Draw: Not shown</li>
                </ul>
              </small>
              </ion-content>
          </ion-popover>
        </ion-col>
        <ion-col class="ion-text-center" size="5">
          <span v-for="i in gameInfo.team2_history" :key="i">
            <ion-icon v-if="i == 'W'" style="color:green" :icon="ellipse" />
            <ion-icon v-if="i == 'L'" style="color:red" :icon="ellipse" />
          </span>
        </ion-col>
      </ion-row>
      <ion-row v-if="!isUpcoming()">
        <ion-col class="ion-text-center">
          <span style="font-size: 2em">{{ gameInfo.game_string }}</span>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h4><strong>Your Guess:</strong></h4>
        </ion-col>
      </ion-row>
      <div v-if="isUpcoming()" class="abc">
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
      <div v-else>
        <ion-item>
          <ion-label>
            <small>Goals by {{ gameInfo.team1_name }}</small>
          </ion-label>
          {{ pointsTeam1 }}
        </ion-item>
        <ion-item>
          <ion-label>
            <small>Goals by {{ gameInfo.team2_name }}</small>
          </ion-label>
          {{ pointsTeam2 }}
        </ion-item>
        <ion-item v-if="points != undefined">
          <ion-label>
            <small>Points</small>
          </ion-label>
          {{ points }}
        </ion-item>
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
  IonPopover,
} from "@ionic/vue";
import { close, send, ellipse, helpCircleOutline } from "ionicons/icons";
import { defineComponent } from "vue";

import GameGuesses from "@/components/GameGuesses.vue";

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
    IonPopover,
  },
  data() {
    let pointsTeam1;
    let pointsTeam2;
    let points;
    return {
      pointsTeam1,
      pointsTeam2,
      points,
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
