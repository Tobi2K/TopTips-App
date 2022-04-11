<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            :defaultHref="'/competition' + this.competition"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>Select a season</ion-title>
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
          v-for="season in seasons"
          :key="season"
          @click="selectSeason(season.season_id)"
        >
          <ion-label>
            <h2>{{ season.name }}</h2>
            <h6>
              {{ season.year }}
            </h6>
            <p>
              {{ this.moment(season.start_date).format("DD MMM, YYYY") }} -
              {{ this.moment(season.end_date).format("DD MMM, YYYY") }}
            </p>
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
} from '@ionic/vue';

import {
  arrowBackCircleOutline,
  arrowForwardCircleOutline,
  settingsOutline,
  refresh,
  chevronDownCircleOutline,
} from 'ionicons/icons';

import moment from 'moment';

import { defineComponent } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'ChooseSeason',
  props: {
    competition: {
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
  setup() {
    return {
      arrowBackCircleOutline,
      arrowForwardCircleOutline,
      settingsOutline,
      refresh,
      chevronDownCircleOutline,
      moment,
    };
  },
  methods: {
    cancel() {
      this.$router.push('/tabs/group');
    },
    selectSeason(season: string) {
      this.$router.push('/create/' + season);
    },
  },
  mounted() {
    this.$store.dispatch('checkJWT');
    this.$store.dispatch('refreshSeasons', this.competition);
  },
  computed: mapState(['seasons']),
});
</script>
