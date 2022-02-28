<template>
  <div>
    <ion-row>
      <ion-col size="6">
        <ion-button @click="goLeft()" fill="clear" color="medium">
          <ion-icon :icon="arrowBack" />
        </ion-button>
      </ion-col>
      <ion-col size="6">
        <ion-button
          @click="goRight()"
          class="ion-float-right"
          fill="clear"
          color="medium"
        >
          <ion-icon :icon="arrowForward" />
        </ion-button>
      </ion-col>
    </ion-row>
    <div class="container" style="overflow-x: scroll">
      <table style="white-space: no-wrap">
        <tr>
          <th id="players">Spieler</th>
          <th id="total"><strong>Gesamt</strong></th>
          <th v-for="index in gamedays" :key="index" :id="'day-' + index">
            Spieltag {{ index }}
          </th>
        </tr>
        <tr v-for="(list, index) in playerPoints" :key="index">
          <td v-for="item in list" :key="item">{{ item }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import {
  loadingController,
  IonButton,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/vue";

import { arrowBack, arrowForward } from "ionicons/icons";

export default defineComponent({
  name: "ScoreSection",
  components: {
    IonButton,
    IonRow,
    IonCol,
    IonIcon,
  },
  setup() {
    return {
      arrowBack,
      arrowForward,
    };
  },
  data() {
    const playerPoints: any[] = [[]];
    return {
      playerPoints,
      gamedays: 0,
      refreshPoints: false,
    };
  },
  emits: ["done"],
  methods: {
    goLeft() {
      const element = document.getElementById("players");
      if (element != null)
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
    },
    goRight() {
      const element = document.getElementById("day-" + this.gamedays);
      if (element != null)
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
    },
  },
  async mounted() {
    const token = localStorage.getItem("JWT");
    const loading = await loadingController.create({
      message: "Please wait...",
    });

    const groupID = localStorage.getItem("groupID");

    await loading.present();
    axios
      .get(process.env.VUE_APP_HOST + `/points/all/format/` + groupID, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // JSON responses are automatically parsed.
        this.playerPoints = response.data;
        this.gamedays = this.playerPoints[0].length - 2;
        loading.dismiss();
        this.$emit("done");
      })
      .catch((e) => {
        loading.dismiss();
        if (e.response) {
          if (e.response.status == 401) {
            this.$router.push("/");
            localStorage.removeItem("JWT");
          }
        }
        loading.dismiss();
        console.log(e);
      });
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
  padding: 5px 15px;
}
</style>
