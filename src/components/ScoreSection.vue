<template>
  <div v-if="pointsForGroup">
    <h2 v-if="groupData" class="text-center">{{ groupData.name }}</h2>
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
          <th
            v-for="(title, index) in pointsForGroup[0]"
            :key="title"
            :id="'title-' + index"
          >
            {{ title }}
          </th>
        </tr>
        <tr v-for="list in pointsForGroup.slice(1)" :key="list">
          <td v-for="item in list" :key="item">{{ item }}</td>
        </tr>
      </table>
    </div>
  </div>
  <div class="mt text-center" v-else>Please select a group.</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { IonButton, IonRow, IonCol, IonIcon } from "@ionic/vue";

import { arrowBack, arrowForward } from "ionicons/icons";
import { mapState } from "vuex";

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
      const element = document.getElementById("title-0");
      if (element != null)
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
    },
    goRight() {
      const element = document.getElementById(
        "title-" + (this.pointsForGroup[0].length - 1)
      );
      if (element != null)
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
    },
  },
  mounted() {
    this.$store
      .dispatch("refreshScores")
      .then(() => {
        this.$emit("done");
      })
      .catch();
  },
  computed: mapState(["pointsForGroup", "groupData"]),
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

.text-center {
  text-align: center;
}
</style>
