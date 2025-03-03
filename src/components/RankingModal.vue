<template>
  <ion-header>
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-title class="align-middle">{{
              groupData?.season.name
              }}</ion-title>
          </ion-col>
          <ion-col>
            <ion-buttons class="ion-float-right">
              <ion-button @click="closeModal">
                <ion-icon :icon="close" />
              </ion-button>
            </ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-grid class="ion-no-padding ion-padding-vertical">
      <ion-row class="tiny-text ion-margin-bottom">
        <ion-col size="6">
          <ion-item>
            <ion-checkbox v-model="this.games" :checked="this.games" label-placement="end"
              justify="start">Games</ion-checkbox>
          </ion-item>
        </ion-col>
        <ion-col size="6">
          <ion-item>
            <ion-checkbox v-model="this.goals" :checked="this.goals" label-placement="end"
              justify="start">Goals</ion-checkbox>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row class="tiny-text ion-margin-bottom">
        <ion-col size="auto" class="colNoPaddingRight">
          <table class="coolTable">
            <thead>
              <tr class="border-bottom">
                <th>#</th>
                <th class="text-left">Team</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="list in ranking" :key="list">
                <td>{{ list.position }}</td>
                <td class="text-left">{{ list.name }}</td>
              </tr>
            </tbody>
          </table>
        </ion-col>
        <ion-col style="overflow-x: scroll" class="colNoPaddingLeft">
          <table class="coolTable">
            <thead>
              <tr class="border-bottom">
                <th v-if="games">P</th>
                <th v-if="games">W</th>
                <th v-if="games">L</th>
                <th v-if="games">D</th>
                <th v-if="goals">Diff</th>
                <th v-if="goals">+/-</th>
                <th v-if="goals">AVG</th>
                <th v-if="goals">MAX</th>
                <th v-if="goals">MIN</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="list in ranking" :key="list">
                <td v-if="games">
                  {{ list.win * 2 + list.draw }}:{{ list.lose * 2 + list.draw }}
                </td>
                <td v-if="games">{{ list.win }}</td>
                <td v-if="games">{{ list.lose }}</td>
                <td v-if="games">{{ list.draw }}</td>
                <td v-if="goals">{{ list.goals_for - list.goals_against }}</td>
                <td v-if="goals">
                  {{ list.goals_for + "/" + list.goals_against }}
                </td>
                <td v-if="goals">{{ list.goals_avg }}</td>
                <td v-if="goals">{{ list.goals_max }}</td>
                <td v-if="goals">{{ list.goals_min }}</td>
              </tr>
            </tbody>
          </table>
        </ion-col>
      </ion-row>
      <ion-row class="align-middle">
        <small><ion-icon :icon="informationCircleOutline" />
          Leaderboards are updated daily at 04:00 AM, Berlin Time.</small>
      </ion-row>
    </ion-grid>
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
  IonIcon,
  IonCheckbox,
  IonItem,
} from "@ionic/vue";
import { close, informationCircleOutline } from "ionicons/icons";
import { defineComponent } from "vue";

import { mapState } from "vuex";

export default defineComponent({
  name: "RankingModal",
  props: {
    ranking: Array,
    seasonName: String,
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
    IonIcon,
    IonCheckbox,
    IonItem,
  },
  setup() {
    const closeModal = () => {
      modalController.dismiss();
    };

    return {
      closeModal,
      close,
      informationCircleOutline,
    };
  },
  data() {
    return {
      games: true,
      goals: true,
    };
  },
  computed: mapState(["groupData"]),
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
  padding: 5px 15px;
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
</style>
