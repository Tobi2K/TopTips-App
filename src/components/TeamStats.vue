<template>
  <ion-row class="align-middle" v-if="gameInfo.team1_stats.position && gameInfo.team2_stats.position">
    <ion-col class="ion-text-center" size="5">
      #{{ gameInfo.team1_stats.position }}
    </ion-col>
    <ion-col class="ion-text-center" size="2">Rank</ion-col>
    <ion-col class="ion-text-center" size="5">
      #{{ gameInfo.team2_stats.position }}
    </ion-col>
  </ion-row>
  <ion-row class="align-middle" v-if="gameInfo.team1_stats.history.result && gameInfo.team2_stats.history.result">
    <ion-col class="ion-text-center" size="5">
      <span v-for="i in gameInfo.team1_stats.history.result" :key="i">
        <ion-icon v-if="i == 'W'" style="color: green" :icon="checkmarkCircle" />
        <ion-icon v-if="i == 'L'" style="color: red" :icon="closeCircle" />
        <ion-icon v-if="i == 'D'" style="color: orange" :icon="removeCircle" />
      </span>
    </ion-col>
    <ion-col class="ion-text-center" size="2">
      <ion-icon id="click-trigger" :icon="helpCircleOutline" />
      <ion-popover trigger="click-trigger" trigger-action="click" size="auto" alignment="center" show-backdrop="false">
        <ion-content class="ion-padding">
          <small>
            5 most recent games (from left to right)
            <ul>
              <li>Win: Green <ion-icon :icon="checkmarkCircleOutline" /></li>
              <li>Loss: Red <ion-icon :icon="closeCircleOutline" /></li>
              <li>Draw: Orange <ion-icon :icon="removeCircleOutline" /></li>
            </ul>
          </small>
        </ion-content>
      </ion-popover>
    </ion-col>
    <ion-col class="ion-text-center" size="5">
      <span v-for="i in gameInfo.team2_stats.history.result" :key="i">
        <ion-icon v-if="i == 'W'" style="color: green" :icon="checkmarkCircle" />
        <ion-icon v-if="i == 'L'" style="color: red" :icon="closeCircle" />
        <ion-icon v-if="i == 'D'" style="color: orange" :icon="removeCircle" />
      </span>
    </ion-col>
  </ion-row>

  <ion-row v-if="showStats">
    <ion-col class="ion-text-center">
      <ion-button fill="clear" size="small" @click="setMoreStats(false)">Hide</ion-button>
    </ion-col>
  </ion-row>
  <ion-row v-if="!showStats">
    <ion-col class="ion-text-center">
      <ion-button fill="clear" size="small" @click="setMoreStats(true)">More stats</ion-button>
    </ion-col>
  </ion-row>

  <ion-row class="tiny-text ion-margin-bottom" v-if="showStats">
    <ion-col size="12" class="ion-text-center">
      <h6>General Stats</h6>
    </ion-col>
    <ion-col size="6" style="overflow-x: scroll; border-right: 1px solid #939393;" class="colNoPaddingRight">
      <table class="coolTable mx-auto">
        <thead>
          <tr class="border-bottom">
            <th>W</th>
            <th>L</th>
            <th>D</th>
            <th>+/-</th>
            <th>AVG</th>
            <th>MAX</th>
            <th>MIN</th>
          </tr>
        </thead>
        <tbody>
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
            <td>{{ gameInfo.team1_stats.goals_avg }}</td>
            <td>{{ gameInfo.team1_stats.goals_max }}</td>
            <td>{{ gameInfo.team1_stats.goals_min }}</td>
          </tr>
        </tbody>
      </table>
    </ion-col>
    <ion-col size="6" style="overflow-x: scroll; border-left: 1px solid #939393;" class="colNoPaddingLeft">
      <table class="coolTable mx-auto">
        <thead>
          <tr class="border-bottom">
            <th>W</th>
            <th>L</th>
            <th>D</th>
            <th>+/-</th>
            <th>AVG</th>
            <th>MAX</th>
            <th>MIN</th>
          </tr>
        </thead>
        <tbody>
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
            <td>{{ gameInfo.team2_stats.goals_avg }}</td>
            <td>{{ gameInfo.team2_stats.goals_max }}</td>
            <td>{{ gameInfo.team2_stats.goals_min }}</td>
          </tr>
        </tbody>
      </table>
    </ion-col>
  </ion-row>
  <ion-row v-if="showStats">
    <ion-col v-if="showEvenMoreStats" class="ion-text-center">
      <ion-button fill="clear" size="small" @click="setEvenMoreStats(false)">Hide extended stats</ion-button>
    </ion-col>
    <ion-col v-if="!showEvenMoreStats" class="ion-text-center">
      <ion-button fill="clear" size="small" @click="setEvenMoreStats(true)">Even more stats</ion-button>
    </ion-col>
  </ion-row>
  <ion-row class="tiny-text ion-margin-bottom" v-if="showEvenMoreStats">
    <ion-col size="12" class="ion-text-center">
      <h6>Past Results</h6>
    </ion-col>
    <ion-col size="6" style="overflow-x: scroll; border-right: 1px solid #939393;" class="colNoPaddingRight">
      <table class="coolTable mx-auto">
        <thead>
          <tr class="border-bottom">
            <th v-for="i in Array.from({ length: gameInfo.team1_stats.history.scores_home_team.length }, (_, index) => index)" :key="i">
              <ion-icon v-if="gameInfo.team1_stats.history.result[i] == 'W'" style="color: green" :icon="checkmarkCircle" />
              <ion-icon v-if="gameInfo.team1_stats.history.result[i] == 'L'" style="color: red" :icon="closeCircle" />
              <ion-icon v-if="gameInfo.team1_stats.history.result[i] == 'D'" style="color: orange" :icon="removeCircle" />
              {{ gameInfo.team1_stats.history.scores_home_team[i] }} - {{ gameInfo.team1_stats.history.scores_away_team[i] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="name in gameInfo.team1_stats.history.other_team_name" :key="name">vs. {{ name }}</td>
          </tr>
        </tbody>
      </table>
    </ion-col>
    <ion-col size="6" style="overflow-x: scroll; border-left: 1px solid #939393;" class="colNoPaddingLeft">
      <table class="coolTable mx-auto">
        <thead>
          <tr class="border-bottom">
            <th v-for="i in Array.from({ length: gameInfo.team2_stats.history.scores_home_team.length }, (_, index) => index)" :key="i">
              <ion-icon v-if="gameInfo.team2_stats.history.result[i] == 'W'" style="color: green" :icon="checkmarkCircle" />
              <ion-icon v-if="gameInfo.team2_stats.history.result[i] == 'L'" style="color: red" :icon="closeCircle" />
              <ion-icon v-if="gameInfo.team2_stats.history.result[i] == 'D'" style="color: orange" :icon="removeCircle" />
              {{ gameInfo.team2_stats.history.scores_home_team[i] }} - {{ gameInfo.team2_stats.history.scores_away_team[i] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="name in gameInfo.team2_stats.history.other_team_name" :key="name">vs. {{ name }}</td>
          </tr>
        </tbody>
      </table>
    </ion-col>
  </ion-row>

  <ion-row class="tiny-text ion-margin-bottom" v-if="showEvenMoreStats">
    <ion-col size="12" class="ion-text-center">
      <h6>Head to Head</h6>
      Only showing results from competitions that have been used (by anyone) in TopTips.
      <br>
    </ion-col>
    <ion-col size="12" class="ion-text-center">
      <table class="coolTable mx-auto">
        <tbody>
          <tr>
            <td>Games played:</td>
            <td>{{ gameInfo.home_team_won + gameInfo.away_team_won + gameInfo.draw_count }}</td>
          </tr>
          <tr>
            <td>Wins {{ gameInfo.team1_name }}:</td>
            <td>{{ gameInfo.home_team_won }}</td>
          </tr>
          <tr>
            <td>Wins {{ gameInfo.team2_name }}:</td>
            <td>{{ gameInfo.away_team_won }}</td>
          </tr>
          <tr>
            <td>Draws:</td>
            <td>{{ gameInfo.draw_count }}</td>
          </tr>
        </tbody>
      </table>
    </ion-col>
  </ion-row>

  <ion-row class="tiny-text ion-margin-bottom" v-if="showEvenMoreStats" v-for="game in gameInfo.head_to_head" :key="game" style="border-bottom: 1px solid grey;">
    <ion-col size="12" class="ion-text-center">
      {{ this.moment(game.game.date).format("DD MMM, YYYY") }}
    </ion-col>
    <ion-col size="5" class="ion-text-center" style="font-size: 120%;">
      <b v-if="game.team1_won">{{ game.game.team1.name }}</b><span v-else>{{ game.game.team1.name }}</span>
    </ion-col>
    <ion-col size="2" class="ion-text-center" style="font-size: 120%;">
      {{ game.game.score_team1 }} - {{ game.game.score_team2 }}
    </ion-col>
    <ion-col size="5" class="ion-text-center" style="font-size: 120%;">
      <b v-if="game.team2_won">{{ game.game.team2.name }}</b><span v-else>{{ game.game.team2.name }}</span>
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
import { ellipse, helpCircleOutline, closeCircle, checkmarkCircle, removeCircle, closeCircleOutline, checkmarkCircleOutline, removeCircleOutline } from "ionicons/icons";
import { defineComponent } from "vue";

import moment from "moment";

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
      showEvenMoreStats: false,
    };
  },
  setup() {
    return {
      ellipse,
      helpCircleOutline,
      closeCircle,
      checkmarkCircle,
      removeCircle,
      closeCircleOutline,
      checkmarkCircleOutline,
      removeCircleOutline,
      moment,
    };
  },
  methods: {
    setMoreStats(bool) {      
      this.showStats = bool;
      if (!bool) {
        this.showEvenMoreStats = false
      }
    },
    setEvenMoreStats(bool) {
      this.showEvenMoreStats = bool;
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
