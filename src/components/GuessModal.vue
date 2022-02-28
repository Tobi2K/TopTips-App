<template>
  <ion-header>
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-title class="align-middle">{{ title }}</ion-title>
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
        <ion-col class="ion-text-end">
          <img
            :src="'./assets/img/team_' + gameInfo.team1_id + '.png'"
            alt="teamLogo"
          />
        </ion-col>
        <ion-col class="ion-text-center"><h2>vs.</h2></ion-col>
        <ion-col class="ion-text-start">
          <img
            :src="'./assets/img/team_' + gameInfo.team2_id + '.png'"
            alt="teamLogo"
          />
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h4><strong>Dein Tipp:</strong></h4>
        </ion-col>
      </ion-row>
      <ion-row class="align-middle">
        <ion-col size="1" class="align-middle">
          <img
            :src="'./assets/img/team_' + gameInfo.team1_id + '.png'"
            alt="teamLogo"
          />
        </ion-col>
        <ion-col>
          <ion-item>
            <ion-label position="floating">
              Tore von {{ gameInfo.team1_name }}
            </ion-label>
            <ion-input v-model="pointsTeam1" type="number"></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row class="align-middle">
        <ion-col size="1" class="align-middle">
          <img
            :src="'./assets/img/team_' + gameInfo.team2_id + '.png'"
            alt="teamLogo"
          />
        </ion-col>
        <ion-col>
          <ion-item>
            <ion-label position="floating">
              Tore von {{ gameInfo.team2_name }}
            </ion-label>
            <ion-input v-model="pointsTeam2" type="number"></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row class="align-middle">
        <ion-col>
          <ion-item>
            <ion-label position="floating">
              {{ gameInfo.bet_name }}
            </ion-label>
            <ion-input v-model="bet" type="number"></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
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
            ><p style="margin-right: 5px">Absenden</p>
            <ion-icon :icon="send"
          /></ion-button>
        </ion-col>
      </ion-row>
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

import axios from "axios";

export default defineComponent({
  name: "GuessModal",
  props: {
    title: {
      type: String,
      default: "Wrong Text",
    },
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
  setup() {
    const closeModal = () => {
      modalController.dismiss();
    };

    useBackButton(10, () => {
      console.log("Handler was called!");
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
        const token = localStorage.getItem("JWT");
        axios
          .post(
            process.env.VUE_APP_HOST + `/guess/add`,
            {
              game: this.gameInfo.id,
              bet: this.bet,
              team1: this.pointsTeam1,
              team2: this.pointsTeam2,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .catch((e) => {
            console.log(e);
          });
        modalController.dismiss();
      }
    },
  },
  mounted() {
    const gameID = this.gameInfo.id;
    const myID = localStorage.getItem("myID");
    const token = localStorage.getItem("JWT");
    axios
      .get(process.env.VUE_APP_HOST + `/guess/game/` + gameID + `/` + myID, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // JSON responses are automatically parsed.
        this.pointsTeam1 = response.data.score_team1;
        this.pointsTeam2 = response.data.score_team2;
        this.bet = response.data.special_bet;
      })
      .catch((e) => {
        console.log(e);
      });
  },
});
</script>
