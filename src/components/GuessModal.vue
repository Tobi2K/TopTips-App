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
              <ion-button @click="closeModal"
                ><ion-icon :icon="close"
              /></ion-button>
            </ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row class="align-middle">
        <ion-col class="ion-text-end" size="5">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="1"
              y="25"
              width="97"
              height="50"
              rx="10"
              :fill="gameInfo.team1_background"
            />
            <text
              font-size="2.5em"
              x="50"
              y="53"
              :fill="gameInfo.team1_text"
              textLength="75"
            >
              {{ gameInfo.team1_abbr }}
            </text>
          </svg>
        </ion-col>
        <ion-col class="ion-text-center" size="2"><h2>vs.</h2></ion-col>
        <ion-col class="ion-text-start" size="5">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="1"
              y="25"
              width="97"
              height="50"
              rx="10"
              :fill="gameInfo.team2_background"
            />
            <text
              font-size="2.5em"
              x="50"
              y="53"
              :fill="gameInfo.team2_text"
              textLength="75"
            >
              {{ gameInfo.team2_abbr }}
            </text>
          </svg>
        </ion-col>
      </ion-row>
      <ion-row v-if="!isUpcoming()">
        <ion-col size="12" class="ion-text-center">
          <span style="font-size: 2em">{{ gameInfo.game_string }}</span>
        </ion-col>
        <ion-col size="12" class="ion-text-center">
          <span style="font-size: 1.3em">{{ gameInfo.bet_string }}</span>
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
        <ion-item>
          <ion-label position="floating">
            {{ gameInfo.bet_name }}
          </ion-label>
          <ion-input v-model="bet" type="number"></ion-input>
        </ion-item>
        <ion-row>
          <ion-col size="6">
            <ion-text color="danger">
              <small>{{ errorText }}</small>
            </ion-text>
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
        <ion-item>
          <ion-label>
            <small>{{ gameInfo.bet_name }}</small>
          </ion-label>
          {{ bet }}
        </ion-item>
        <ion-row>
          <ion-col size="12">
            <ion-text color="danger">
              <small>{{ errorText }}</small>
            </ion-text>
          </ion-col>
        </ion-row>
      </div>
    </ion-grid>
    <game-guesses :gameID="gameInfo.id" :bet="gameInfo.bet_name" />
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
  IonText,
  IonIcon,
  useBackButton,
} from "@ionic/vue";
import { close, send } from "ionicons/icons";
import { defineComponent } from "vue";

import GameGuesses from "@/components/GameGuesses.vue";

import { mapState } from "vuex";

export default defineComponent({
  name: "GuessModal",
  props: {
    gameInfo: Object,
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
    IonText,
    IonIcon,
    GameGuesses,
  },
  data() {
    let pointsTeam1;
    let pointsTeam2;
    let bet;
    return {
      pointsTeam1,
      pointsTeam2,
      bet,
      errorText: "",
    };
  },
  setup(props) {
    const closeModal = () => {
      modalController.dismiss();
    };

    useBackButton(10, () => {
      modalController.dismiss();
    });
    return {
      closeModal,
      close,
      send,
    };
  },
  methods: {
    sendData() {
      if (
        this.pointsTeam1 < 0 ||
        this.pointsTeam2 < 0 ||
        this.bet < 0 ||
        this.pointsTeam1 == undefined ||
        this.pointsTeam2 == undefined ||
        this.bet == undefined
      ) {
        this.errorText = "Bitte überall etwas (≥0) eintragen.";
        setTimeout(() => {
          this.errorText = "";
        }, 3000);
      } else if (new Date(this.gameInfo.date) < new Date()) {
        this.errorText = "Du bist leider zu spät dran :(";
        setTimeout(() => {
          this.errorText = "";
        }, 3000);
      } else {
        this.$store
          .dispatch("addGuess", {
            game: this.gameInfo.id,
            bet: this.bet,
            team1: this.pointsTeam1,
            team2: this.pointsTeam2,
          })
          .then(() => {
            modalController.dismiss();
          })
          .catch((e) => {
            this.errorText = e;
            setTimeout(() => {
              this.errorText = "";
            }, 3000);
          });
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
          this.bet = val.special_bet;
        } else {
          this.pointsTeam1 = "-";
          this.pointsTeam2 = "-";
          this.bet = "-";
        }
      })
      .catch(() => {
        this.$store.dispatch("showErrorToast", "Could not get your guess.");
      });
  },
  computed: mapState(["groupData"]),
});
</script>

<style scoped>
text {
  font-family: monospace;
  text-anchor: middle; /* align center */
  dominant-baseline: middle; /* vertical alignment fix */
}
</style>
