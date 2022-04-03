<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/group"></ion-back-button>
        </ion-buttons>
        <ion-title>Select a country</ion-title>
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
          v-for="country in countries"
          :key="country"
          @click="selectCountry(country.country)"
        >
          <ion-label>
            <h2>{{ country.country }}</h2>
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

import {
  arrowBackCircleOutline,
  arrowForwardCircleOutline,
  settingsOutline,
  refresh,
  chevronDownCircleOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "Choose Competition",
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
  setup() {
    return {
      arrowBackCircleOutline,
      arrowForwardCircleOutline,
      settingsOutline,
      refresh,
      chevronDownCircleOutline,
    };
  },
  methods: {
    cancel() {
      this.$router.push("/tabs/group");
    },
    selectCountry(country: string) {
      this.$router.push("/competition/" + country);
    },
  },
  mounted() {
    this.$store.dispatch("checkJWT");
    this.$store.dispatch("refreshCountries");
  },
  computed: mapState(["countries"]),
});
</script>
