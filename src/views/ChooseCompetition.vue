<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/country"></ion-back-button>
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
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonButton,
} from "@ionic/vue";

import {
  settingsOutline,
  refresh,
  chevronDownCircleOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "Choose Competition",
  props: {
    country: {
      type: String,
      required: true,
    },
  },
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
      settingsOutline,
      refresh,
      chevronDownCircleOutline,
    };
  },
  data() {
    return {
      errorText: "",
    };
  },
  methods: {
    cancel() {
      this.$router.push("/tabs/tab3");
    },
    selectCompetition(competition: string) {
      this.$router.push("/season/" + competition);
    },
  },
  async mounted() {
    if (!(await this.$store.dispatch("checkJWT"))) return;
    this.$store.dispatch("refreshCompetitions", this.country).catch((e) => {
      this.errorText = e;
      setTimeout(() => {
        this.errorText = "";
      }, 3000);
    });
  },
  computed: mapState(["competitions"]),
});
</script>
