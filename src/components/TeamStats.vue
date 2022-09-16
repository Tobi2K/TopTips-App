<template>
  <ion-row
    class="align-middle"
    v-if="gameInfo.team1_stats.position && gameInfo.team2_stats.position"
  >
    <ion-col class="ion-text-center" size="5">
      #{{ gameInfo.team1_stats.position }}
    </ion-col>
    <ion-col class="ion-text-center" size="2">Rank</ion-col>
    <ion-col class="ion-text-center" size="5">
      #{{ gameInfo.team2_stats.position }}
    </ion-col>
  </ion-row>
  <ion-row
    class="align-middle"
    v-if="gameInfo.team1_stats.history && gameInfo.team2_stats.history"
  >
    <ion-col class="ion-text-center" size="5">
      <span v-for="i in gameInfo.team1_stats.history" :key="i">
        <ion-icon v-if="i == 'W'" style="color: green" :icon="ellipse" />
        <ion-icon v-if="i == 'L'" style="color: red" :icon="ellipse" />
        <ion-icon v-if="i == 'D'" style="color: orange" :icon="ellipse" />
      </span>
    </ion-col>
    <ion-col class="ion-text-center" size="2">
      <ion-icon id="click-trigger" :icon="helpCircleOutline" />
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
              <li>Draw: Orange</li>
            </ul>
          </small>
        </ion-content>
      </ion-popover>
    </ion-col>
    <ion-col class="ion-text-center" size="5">
      <span v-for="i in gameInfo.team2_stats.history" :key="i">
        <ion-icon v-if="i == 'W'" style="color: green" :icon="ellipse" />
        <ion-icon v-if="i == 'L'" style="color: red" :icon="ellipse" />
        <ion-icon v-if="i == 'D'" style="color: orange" :icon="ellipse" />
      </span>
    </ion-col>
  </ion-row>
  <ion-row class="tiny-text ion-margin-bottom" v-if="showStats">
    <ion-col size="5" style="overflow-x: scroll" class="colNoPaddingRight">
      <table class="coolTable mx-auto">
        <tr class="border-bottom">
          <th>W</th>
          <th>L</th>
          <th>D</th>
          <th>+/-</th>
        </tr>
        <tr>
          <td>{{ gameInfo.team1_stats.win }}</td>
          <td>{{ gameInfo.team1_stats.lose }}</td>
          <td>{{ gameInfo.team1_stats.draw }}</td>
          <td>
            {{
              gameInfo.team1_stats.goals_for +
              "/" +
              gameInfo.team1_stats.goals_against
            }}
          </td>
        </tr>
      </table>
    </ion-col>
    <ion-col class="ion-text-center" size="2">
        <ion-button fill="clear" size="small" @click="setMoreStats(false)" expand="block">
            Hide
        </ion-button>
    </ion-col>
    <ion-col size="5" style="overflow-x: scroll" class="colNoPaddingLeft">
      <table class="coolTable mx-auto">
        <tr class="border-bottom">
          <th>W</th>
          <th>L</th>
          <th>D</th>
          <th>+/-</th>
        </tr>
        <tr>
          <td>{{ gameInfo.team2_stats.win }}</td>
          <td>{{ gameInfo.team2_stats.lose }}</td>
          <td>{{ gameInfo.team2_stats.draw }}</td>
          <td>
            {{
              gameInfo.team2_stats.goals_for +
              "/" +
              gameInfo.team2_stats.goals_against
            }}
          </td>
        </tr>
      </table>
    </ion-col>
  </ion-row>
  <ion-row v-else>
    <ion-col class="ion-text-center">
        <ion-button fill="clear" size="small" @click="setMoreStats(true)">More stats</ion-button>
    </ion-col>
  </ion-row>
</template>

<script>
import {
  IonContent,
  IonCol,
  IonRow,
  IonIcon,
  IonPopover,
  IonButton,
} from "@ionic/vue";
import { ellipse, helpCircleOutline } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "TeamStats",
  props: {
    gameInfo: Object,
  },
  components: {
    IonContent,
    IonCol,
    IonRow,
    IonIcon,
    IonPopover,
    IonButton,
  },
  data() {
    return {
      showStats: false,
    };
  },
  setup() {
    return {
      ellipse,
      helpCircleOutline,
    };
  },
  methods: {
    setMoreStats(bool) {
      this.showStats = bool;
    },
  },
});
</script>

<style scoped>
table {
  font-size: 120%;
}
th,
td {
  text-align: center;
  width: auto;
  white-space: nowrap;
  padding: 5px 10px;
}

.mt {
  margin-top: 10%;
}

.tiny-text {
  font-size: 0.55em;
}

.coolTable tr:nth-child(even) {
  background-color: rgba(120, 120, 120, 0.3);
  white-space: no-wrap;
}

.colNoPaddingLeft {
  --ion-grid-column-padding: 0;
}

.colNoPaddingRight {
  --ion-grid-column-padding: 0;
}
.mx-auto {
  margin-right: auto;
  margin-left: auto;
}
</style>
