<template>
  <ion-grid v-if="guessesForOpenGame.length > 0">
    <ion-row>
      <ion-col>
        <h6><strong>Group guesses:</strong></h6>
      </ion-col>
    </ion-row>
    <ion-row
      v-for="guess in guessesForOpenGame"
      :key="guess"
      style="border-bottom: 1px solid rgba(211, 211, 211, 0.8)"
    >
      <ion-col class="ion-text-start">{{ guess.name }}:</ion-col>
      <ion-col class="ion-text-center">
        {{ guess.guess_string }}
      </ion-col>
      <ion-col class="ion-text-center small-text">
        {{ bet }}: {{ guess.bet }}
      </ion-col>
      <ion-col
        v-if="guess.points != undefined"
        class="ion-text-center small-text"
      >
        Points: {{ guess.points }}
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import { IonCol, IonRow, IonGrid } from '@ionic/vue';
import { defineComponent } from 'vue';

import { mapState } from 'vuex';

export default defineComponent({
  name: 'GameGuesses',
  props: {
    gameID: {
      type: Number,
      required: true,
    },
    bet: {
      type: String,
      required: true,
    },
  },
  components: {
    IonCol,
    IonRow,
    IonGrid,
  },
  data() {
    const guesses = [];
    return {
      guesses,
    };
  },
  computed: mapState(['guessesForOpenGame']),
});
</script>
