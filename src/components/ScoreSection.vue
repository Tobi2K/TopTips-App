<template>
  <div v-if="pointsForGroup">
    <h2 v-if="groupData" class="text-center">{{ groupData.name }}</h2>
    <ion-row>
      <ion-col size="4">
        <ion-button @click="goLeft()" fill="clear" color="medium">
          <ion-icon :icon="arrowBack" />
        </ion-button>
      </ion-col>
      <ion-col size="4" style="text-align: center">
        <ion-button @click="goCurrent()" fill="clear" color="medium">
          <ion-icon :icon="todayOutline" />
        </ion-button>
      </ion-col>
      <ion-col size="4">
        <ion-button @click="goRight()" class="ion-float-right" fill="clear" color="medium">
          <ion-icon :icon="arrowForward" />
        </ion-button>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col size="auto" class="colNoPaddingRight">
        <table class="coolTable ion-float-right">
          <thead>
            <tr>
              <th>
                {{ pointsForGroup[0][0] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="list in pointsForGroup.slice(1)" :key="list">
              <td>{{ list[0] }}</td>
            </tr>
          </tbody>
        </table>
      </ion-col>
      <ion-col size="auto" class="colNoPaddingLeft">
        <table class="coolTable ion-float-right">
          <thead>
            <tr>
              <th>
                {{ pointsForGroup[0][1] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="list in pointsForGroup.slice(1)" :key="list">
              <td>{{ list[1] }}</td>
            </tr>
          </tbody>
        </table>
      </ion-col>
      <ion-col style="overflow-x: scroll" class="colNoPaddingLeft">
        <table class="coolTable">
          <thead>
            <tr>
              <th v-for="(title, index) in pointsForGroup[0].slice(2)" :key="title" :id="'title-' + index">
                {{ title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="list in pointsForGroup.slice(1)" :key="list">
              <td v-for="item in list.slice(2)" :key="item">{{ item }}</td>
            </tr>
          </tbody>
        </table>
      </ion-col>
    </ion-row>
  </div>
  <div class="mt text-center" v-else>Please select a group.</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { IonButton, IonRow, IonCol, IonIcon } from "@ionic/vue";

import { arrowBack, arrowForward, todayOutline } from "ionicons/icons";

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
      todayOutline,
    };
  },
  emits: ["done"],
  methods: {
    goLeft() {
      const element = document.getElementById("title-0");
      if (element != null) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    },
    goRight() {
      const element = document.getElementById(
        "title-" + (this.pointsForGroup[0].length - 3),
      );
      if (element != null) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    },
    goCurrent() {
      const element = document.getElementById(
        "title-" + (this.$store.state.currentGameday - 1),
      );
      if (element != null) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
      }
    },
  },
  mounted() {
    this.$store
      .dispatch("refreshScores")
      .then(() => {
        this.$emit("done");
        const element = document.getElementById(
          "title-" + (this.$store.state.currentGameday - 1),
        );
        if (element != null) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          });
        }
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
