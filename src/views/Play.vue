<template>
  <ion-page>
    <custom-header
      v-if="groupData"
      :title="'Guessing in ' + groupData.name"
      @refresh="refreshAll"
    />
    <custom-header v-else title="Tips" @refresh="refreshAll" />
    <ion-content :fullscreen="true" id="mainSlide">
      <ion-grid v-if="showSelectGroup" class="ion-padding" style="max-width: 600px">
        <ion-row class="align-middle">
          <h3 v-if="userGroups.length > 0" class="text-center">Your groups:</h3>
          <h3 v-else class="text-center">
            You aren't part of any groups. Head over to the 'Groups' tab to
            create one.
          </h3>
        </ion-row>
        <ion-row class="ion-align-items-center">
          <ion-col v-for="group in userGroups" :key="group">
            <ion-button
              :value="group.group.id"
              color="medium"
              @click="selectedGroup(group.group.id)"
              expand="block"
            >
              {{
                group.group.name.length > 10
                  ? group.group.name.substr(0, 10) + "\u2026"
                  : group.group.name
              }}
              <ion-icon
                :icon="peopleCircleOutline"
                style="margin-left: 5px; margin-right: 3px"
                v-if="group.memberCount"
              />
              {{ group.memberCount }}
              <ion-icon
                :icon="podiumOutline"
                style="margin-left: 5px; margin-right: 3px"
                v-if="group.rank"
              />
              {{ group.rank }}
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <game-day-slider v-else :games="allGames" :key="allGames" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
  IonIcon,
} from "@ionic/vue";

import GameDaySlider from "@/components/GameDaySlider.vue";

import CustomHeader from "@/components/CustomHeader.vue";

import {
  arrowBackCircleOutline,
  arrowForwardCircleOutline,
  settingsOutline,
  refresh,
  chevronDownCircleOutline,
  peopleCircleOutline,
  podiumOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";
import { useStore } from "@/store/store";
import { mapState } from "vuex";

export default defineComponent({
  name: "PlayView",
  components: {
    IonContent,
    IonPage,
    GameDaySlider,
    CustomHeader,
    IonButton,
    IonRow,
    IonCol,
    IonGrid,
    IonIcon,
  },
  setup() {
    const store = useStore();

    return {
      store,
      arrowBackCircleOutline,
      arrowForwardCircleOutline,
      settingsOutline,
      refresh,
      chevronDownCircleOutline,
      peopleCircleOutline,
      podiumOutline,
    };
  },
  data() {
    return {
      groupID: this.$store.state.currentGroupID,
    };
  },
  methods: {
    async refreshAll() {
      this.$store.dispatch("UPDATE_ALL_GAMES");
    },
    selectedGroup(groupID: number) {
      this.$store.dispatch("UPDATE_CURRENT_GROUP_ID", groupID);
      this.groupID = 0;
    },
  },
  mounted() {
    this.$store.dispatch("checkJWT");
  },
  watch: {
    groupID(newValue) {
      if (newValue != 0) this.refreshAll();
    },
  },
  computed: mapState([
    "allGames",
    "showSelectGroup",
    "userGroups",
    "currentGroupID",
    "groupData",
  ]),
});
</script>

<style scoped>
#mainSlide::before {
  opacity: 0.5;
}
</style>
