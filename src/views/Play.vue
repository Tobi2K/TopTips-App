<template>
  <ion-page>
    <custom-header title="Tipps" @refresh="refreshAll" />
    <ion-content :fullscreen="true" id="mainSlide">
      <ion-item v-if="showSelectGroup">
        <ion-label>Select Group</ion-label>
        <ion-select
          interface="action-sheet"
          placeholder="Select One"
          v-model="groupID"
          :key="userGroups"
          @ionChange="selectedGroup(groupID)"
        >
          <ion-select-option
            v-for="group in userGroups"
            :key="group"
            :value="group.group.id"
            >{{ group.group.name }}</ion-select-option
          >
        </ion-select>
      </ion-item>
      <game-day-slider v-else :games="allGames" :key="allGames" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  loadingController,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonItem,
} from "@ionic/vue";

import GameDaySlider from "@/components/GameDaySlider.vue";

import CustomHeader from "@/components/CustomHeader.vue";

import {
  arrowBackCircleOutline,
  arrowForwardCircleOutline,
  settingsOutline,
  refresh,
  chevronDownCircleOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "@/store/store";
import { mapState } from "vuex";
import {
  UPDATE_ALL_GAMES,
  UPDATE_CURRENT_GROUP_ID,
} from "@/store/mutation-types";

export default defineComponent({
  name: "Play",
  components: {
    IonContent,
    IonPage,
    GameDaySlider,
    CustomHeader,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonItem,
  },
  setup() {
    const store = useStore();
    console.log(store);

    return {
      store,
      arrowBackCircleOutline,
      arrowForwardCircleOutline,
      settingsOutline,
      refresh,
      chevronDownCircleOutline,
    };
  },
  data() {
    return {
      groupID: localStorage.getItem("groupID"),
    };
  },
  methods: {
    async refreshAll() {
      this.$store.dispatch(UPDATE_ALL_GAMES);
    },
    selectedGroup(groupID: string) {
      this.$store.dispatch(UPDATE_CURRENT_GROUP_ID, groupID);
      this.groupID = "";
      this.refreshAll();
    },
  },

  watch: {
    groupID(newValue) {
      localStorage.setItem("groupID", newValue);
      this.refreshAll();
    },
  },
  computed: mapState([
    "allGames",
    "showSelectGroup",
    "userGroups",
    "currentGroupID",
  ]),
});
</script>

<style scoped>
#mainSlide::before {
  opacity: 0.5;
}
</style>
