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
          style="cursor: pointer;"
        >
          <ion-label>
            <h2>{{ competition.name }}</h2>
          </ion-label>
        </ion-item>
      </ion-list>
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
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonButton,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "ChooseCompetition",
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
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonButton,
    IonLabel,
  },
  methods: {
    cancel() {
      this.$router.push("/tabs/group");
    },
    selectCompetition(competition: string) {
      this.$router.push("/season/" + competition);
    },
  },
  mounted() {
    this.$store.dispatch("checkJWT");
    this.$store.dispatch("refreshCompetitions", this.country);
  },
  computed: mapState(["competitions"]),
});
</script>
