<template>
  <ion-page>
    <custom-header
      v-if="groupData"
      :title="'Guessing in ' + groupData.name"
      @refresh="refreshAll"
    />
    <custom-header v-else title="Tips" @refresh="refreshAll" />
    <ion-content :fullscreen="true" id="mainSlide">
      <ion-grid
        v-if="showSelectGroup"
        class="ion-padding"
        style="max-width: 600px"
      >
        <div v-if="activeGroups.length + pastGroups.length > 0">
          <ion-row v-if="activeGroups.length > 0" class="align-middle">
            <h3 class="text-center">Your active groups:</h3>
          </ion-row>
          <ion-row
            v-if="activeGroups.length > 0"
            class="ion-align-items-center"
          >
            <ion-col v-for="group in activeGroups" :key="group">
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
          <ion-row v-if="pastGroups.length > 0" class="align-middle">
            <h3 class="text-center">Your past groups:</h3>
          </ion-row>
          <ion-row v-if="pastGroups.length > 0" class="ion-align-items-center">
            <ion-col v-for="group in pastGroups" :key="group">
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
        </div>
        <div v-else>
          <ion-row class="align-middle">
            <h3 class="text-center">
              You aren't part of any groups. Head over to the 'Groups' tab to
              create one.
            </h3>
          </ion-row>
        </div>
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
  peopleCircleOutline,
  podiumOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";
import { useStore } from "@/store/store";
import { mapState } from "vuex";

import moment from "moment";

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
      peopleCircleOutline,
      podiumOutline,
      moment,
    };
  },
  data() {
    const tmpUserGroups = this.$store.state.userGroups;

    const activeGroups = tmpUserGroups.filter((el: { group: { season: { end_date: moment.MomentInput; }; }; }) => {
      return this.moment().isSameOrBefore(this.moment(el.group.season.end_date).add(7, "d"));
    });
    const pastGroups = tmpUserGroups.filter((el: { group: { season: { end_date: moment.MomentInput; }; }; }) => {
      return !this.moment().isSameOrBefore(this.moment(el.group.season.end_date).add(7, "d"));
    });

    return {
      groupID: this.$store.state.currentGroupID,
      activeGroups,
      pastGroups,
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
    if (this.showSelectGroup && this.userGroups.length == 1) {
      this.selectedGroup(this.userGroups[0].group.id);
    }
  },
  watch: {
    groupID(newValue) {
      if (newValue != 0) this.refreshAll();
    },
    userGroups(newValue) {
      this.activeGroups = newValue.filter((el: { group: { season: { end_date: moment.MomentInput; }; }; }) => {
        return this.moment().isSameOrBefore(this.moment(el.group.season.end_date).add(7, "d"));
      });
      this.pastGroups = newValue.filter((el: { group: { season: { end_date: moment.MomentInput; }; }; }) => {
        return !this.moment().isSameOrBefore(this.moment(el.group.season.end_date).add(7, "d"));
      });
      if (this.showSelectGroup && newValue.length == 1) {
        this.selectedGroup(newValue[0].group.id);
      }
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
