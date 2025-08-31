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
              <ion-button @click="checkUnsaved(closeModal)">
                <ion-icon :icon="close" />
              </ion-button>
            </ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" :key="index">
    <ion-grid>
      <ion-row>
        <ion-col class="ion-text-start">
          <ion-button
            fill="clear"
            color="dark"
            @click="checkUnsaved(slideLeft)"
            v-if="index > 0"
          >
            <ion-icon slot="icon-only" :icon="caretBack"></ion-icon>
          </ion-button>
        </ion-col>
        <ion-col class="ion-text-end">
          <ion-button
            fill="clear"
            color="dark"
            @click="checkUnsaved(slideRight)"
            v-if="index < games.length - 1"
          >
            <ion-icon slot="icon-only" :icon="caretForward"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
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
      <team-stats
        v-if="gameInfo.team1_stats && gameInfo.team2_stats"
        :gameInfo="gameInfo"
      />
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
          <ion-input
            :label="'Goals by ' + gameInfo.team1_name"
            label-placement="floating"
            v-model="pointsTeam1"
            type="number"
            inputmode="numeric"
            placeholder="Your guess..."
            min="0"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            :label="'Goals by ' + gameInfo.team2_name"
            label-placement="floating"
            v-model="pointsTeam2"
            type="number"
            inputmode="numeric"
            placeholder="Your guess..."
            min="0"
          ></ion-input>
        </ion-item>
        <ion-row>
          <ion-col class="ion-align-items-start">
            <ion-button
              color="medium"
              size="small"
              @click="generateGuess()"
              >
              <ion-icon :icon="dice"
            /></ion-button>
            <ion-button
              color="dark"
              size="small"
              id="show-generate"
              fill="clear"
              >
              <ion-icon :icon="helpCircleOutline"
            /></ion-button>
            <ion-popover
              trigger="show-generate"
              trigger-action="click"
              size="auto"
              alignment="center"
              show-backdrop="false"
            >
              <ion-content class="ion-padding">
                <small>
                  This generates a random score in the range
                  between <b>MIN - 5</b> and <b>MAX + 5</b>,
                  where MIN and MAX are the lowest and highest score by the team, respectively.

                  <br /><br />NOTE: All numbers in the given range are equally likely and the lower bound is at least 20
                  and the upper bound is at most 40.
                </small>
              </ion-content>
            </ion-popover>
          </ion-col>
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
          <ion-col v-if="points != undefined" class="ion-text-center">
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
  alertController,
  modalController,
  IonGrid,
  IonCol,
  IonRow,
  IonInput,
  IonItem,
  IonIcon,
  IonPopover,
} from "@ionic/vue";

import {
  close,
  send,
  ellipse,
  helpCircleOutline,
  textOutline,
  imageOutline,
  caretBack,
  caretForward,
  dice,
} from "ionicons/icons";

import { defineComponent } from "vue";

import GameGuesses from "@/components/GameGuesses.vue";
import TeamStats from "@/components/TeamStats.vue";

import moment from "moment";

import { mapState } from "vuex";
import { showToast, showDangerToast } from "@/store/helper";
export default defineComponent({
  name: "GuessModal",
  props: {
    gameIndex: {
      type: Number,
      required: true,
    },
    games: {
      type: Object,
      required: true,
    },
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
    IonIcon,
    IonPopover,
    GameGuesses,
    TeamStats,
  },
  data() {
    let pointsTeam1;
    let pointsTeam2;
    let savedPointsTeam1;
    let savedPointsTeam2;
    let points;
    const index = this.gameIndex;
    const gameInfo = this.games[index];

    let timeString = moment(gameInfo.date).fromNow();

    let minTeam1 = 20;
    let maxTeam1 = 35;
    let minTeam2 = 20;
    let maxTeam2 = 35;

    if (gameInfo.team1_stats) {
      const stats = gameInfo.team1_stats;
      if ((stats.win + stats.draw + stats.lose) > 5) {
        minTeam1 = Math.max(stats.goals_min - 5, minTeam1);
        maxTeam1 = Math.min(stats.goals_max + 5, 40);
      }
    }

    if (gameInfo.team2_stats) {
      const stats = gameInfo.team2_stats;
      if ((stats.win + stats.draw + stats.lose) > 5) {
        minTeam2 = Math.max(stats.goals_min - 5, minTeam2);
        maxTeam2 = Math.min(stats.goals_max + 5, 40);
      }
    }

    timeString = timeString[0].toUpperCase() + timeString.substr(1);
    return {
      timeString,
      pointsTeam1,
      pointsTeam2,
      savedPointsTeam1,
      savedPointsTeam2,
      points,
      index,
      gameInfo,
      showNames: false,
      minTeam1,
      maxTeam1,
      minTeam2,
      maxTeam2,
      saved: true,
    };
  },
  setup() {
    const closeModal = () => {
      modalController.dismiss();
    };

    return {
      moment,
      closeModal,
      close,
      send,
      ellipse,
      helpCircleOutline,
      imageOutline,
      textOutline,
      caretBack,
      caretForward,
      dice,
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
        showDangerToast("Please fill out everything (≥0).");
      } else if (new Date(this.gameInfo.date) < new Date()) {
        showDangerToast("You are too late :(");
      } else if (!/^[0-9]+$/.test(this.pointsTeam1) || !/^[0-9]+$/.test(this.pointsTeam2)) {
        showDangerToast("Only use numbers!");
      } else if (this.pointsTeam1 > 2147483647 || this.pointsTeam2 > 2147483647) {
        showDangerToast("That number is too large! Use something smaller.")
      } else {
        this.$store
            .dispatch("addGuess", {
              game: this.gameInfo.id,
              team1: this.pointsTeam1,
              team2: this.pointsTeam2,
              sectionID: this.sectionID, // 0-indexed
            })
            .then(() => {
              showToast("Saved guess successfully");
              this.savedPointsTeam1 = this.pointsTeam1;
              this.savedPointsTeam2 = this.pointsTeam2;
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
    slideRight() {
      if (this.index < this.games.length - 1) {
        const tempIndex = this.index + 1;

        this.gameInfo = this.games[tempIndex];
        let timeString = moment(this.gameInfo.date).fromNow();

        timeString = timeString[0].toUpperCase() + timeString.substr(1);

        this.timeString = timeString;

        this.index = tempIndex;

        this.getUserGuess()
      }
    },
    slideLeft() {
      if (this.index > 0) {
        const tempIndex = this.index - 1;

        this.gameInfo = this.games[tempIndex];
        let timeString = moment(this.gameInfo.date).fromNow();

        timeString = timeString[0].toUpperCase() + timeString.substr(1);

        this.timeString = timeString;

        this.index = tempIndex;

        this.getUserGuess()
      }
    },
    generateGuess() {
      this.pointsTeam1 = Math.floor(Math.random() * (this.maxTeam1 - this.minTeam1 + 1)) + this.minTeam1;
      this.pointsTeam2 = Math.floor(Math.random() * (this.maxTeam2 - this.minTeam2 + 1)) + this.minTeam2;

      showToast("Generated random guess. Remember to save!");
    },
    checkUnsaved(doThis) {
      if (this.pointsTeam1 == this.savedPointsTeam1 && this.pointsTeam2 == this.savedPointsTeam2) {
        doThis()
      } else {
        alertController
          .create({
            cssClass: "points-alert",
            header: "Unsaved changes!",
            message:
          "It seems you have unsaved guesses. Make sure to save them! \n<small><small>If this is false and the notice persists, contact <a href='mailto:admin@toptips.page'>admin@toptips.page</a></small></small>",
            buttons: [
              {
                text: "Take me back",
                role: "cancel",
              },
              {
                text: "Don't save",
                handler: () => {
                  doThis();
                },
              },
            ],
          })
          .then((val) => val.present());
      }
    },
    getUserGuess() {
      this.$store
            .dispatch("getUserGuess", this.gameInfo.id)
            .then((val) => {
              if (val != "") {
                this.pointsTeam1 = val.score_team1;
                this.savedPointsTeam1 = val.score_team1;
                this.pointsTeam2 = val.score_team2;
                this.savedPointsTeam2 = val.score_team2;
                this.points = val.points;
              } else if (this.isUpcoming()) {
                this.pointsTeam1 = "-";
                this.savedPointsTeam1 = "-";
                this.pointsTeam2 = "-";
                this.savedPointsTeam2 = "-";
                this.points = undefined;
              } else {
                this.pointsTeam1 = "-";
                this.savedPointsTeam1 = "-";
                this.pointsTeam2 = "-";
                this.savedPointsTeam2 = "-";
                this.points = undefined;
              }
            })
            .catch();
    }
  },
  mounted() {
    this.getUserGuess()
  },
  watch: {
    pointsTeam1() {
      this.saved = false
    },
    pointsTeam2() {
      this.saved = false
    },
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
