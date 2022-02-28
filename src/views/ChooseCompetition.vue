<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/tab3"></ion-back-button>
        </ion-buttons>
        <ion-title>Select a competition</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="cancel()" class="ion-float-right">
            Cancel
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item
          v-for="competition in competitions"
          :key="competition"
          @click="selectCompetition(competition.competition_id)"
        >
          <ion-label>
            <h2>{{ competition.name }}</h2>
            <p>
              Gender:
              {{ competition.gender.toUpperCase() }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-item lines="none">
        <ion-text color="danger">
          <small>{{ errorText }}</small>
        </ion-text>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  loadingController,
  IonList,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  alertController,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonListHeader,
} from "@ionic/vue";

import {
  arrowBackCircleOutline,
  arrowForwardCircleOutline,
  settingsOutline,
  refresh,
  chevronDownCircleOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  name: "Choose Competition",
  components: {
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonText,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonButton,
    IonLabel,
  },
  setup() {
    return {
      arrowBackCircleOutline,
      arrowForwardCircleOutline,
      settingsOutline,
      refresh,
      chevronDownCircleOutline,
    };
  },
  data() {
    return {
      errorText: "",
      competitions: [],
    };
  },
  methods: {
    cancel() {
      this.$router.push("/tabs/tab3");
    },
    selectCompetition(competition: string) {
      console.log(competition);

      this.$router.push("/season/" + competition);
    },
  },
  async mounted() {
    const loading = await loadingController.create({
      message: "Please wait...",
    });
    await loading.present();
    const token = localStorage.getItem("JWT");
    axios
      .get(process.env.VUE_APP_HOST + `/competition/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.competitions = response.data;

        loading.dismiss();
      })
      .catch((e) => {
        console.log(e);

        loading.dismiss();
      });
  },
});
</script>
