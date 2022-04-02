<template>
  <ion-page>
    <custom-header title="Group Management" @refresh="refreshAll" />
    <ion-content :fullscreen="true" id="mainSlide">
      <ion-list>
        <ion-item v-if="userGroups">
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
        <ion-item @click="presentJoinGroupPrompt()">
          <ion-label>Join Group</ion-label>
        </ion-item>
        <ion-item @click="goToCreateGroup()">
          <ion-label>Create New Group</ion-label>
        </ion-item>
      </ion-list>
      <current-group v-if="groupData != null" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  alertController,
  IonList,
} from "@ionic/vue";

import CustomHeader from "@/components/CustomHeader.vue";

import {
  arrowBackCircleOutline,
  arrowForwardCircleOutline,
  settingsOutline,
  refresh,
  copyOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";

import { useStore } from "@/store/store";
import { mapState } from "vuex";
import {
  JOIN_GROUP,
  UPDATE_CURRENT_GROUP_ID,
  UPDATE_USER_GROUPS,
} from "@/store/mutation-types";

import CurrentGroup from "@/components/CurrentGroup.vue";

export default defineComponent({
  name: "Group",
  components: {
    IonContent,
    IonPage,
    CustomHeader,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonList,
    CurrentGroup,
  },
  setup() {
    const store = useStore();

    return {
      store,
      arrowBackCircleOutline,
      arrowForwardCircleOutline,
      settingsOutline,
      refresh,
      copyOutline,
    };
  },
  data() {
    return {
      username: "",
      groupPass: "",
      groups: [],
      groupID: this.$store.state.currentGroupID,
      group: null as any,
    };
  },
  methods: {
    async refreshAll() {
      this.$store.dispatch("refreshGroups");
      this.$store.dispatch(UPDATE_USER_GROUPS);
    },
    selectedGroup(groupID: string) {
      this.$store.dispatch(UPDATE_CURRENT_GROUP_ID, groupID);
      //this.refreshAll();
    },

    async presentJoinGroupPrompt() {
      const alert = await alertController.create({
        header: "Join Group",
        inputs: [
          {
            name: "passphrase",
            id: "passphraseID",
            placeholder: "Enter Group Passphrase",
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Join",
            handler: (value) => {
              this.groupPass = value.passphrase;
              this.joinGroup(value.passphrase);
            },
          },
        ],
      });
      return alert.present();
    },
    goToCreateGroup() {
      this.$router.push("/country");
    },
    async joinGroup(passphrase: string) {
      this.$store.dispatch(JOIN_GROUP, passphrase);
    },
  },
  mounted() {
    this.$store.dispatch("checkJWT");
    this.$store.dispatch("initGroup");
  },
  watch: {
    groupID() {
      this.refreshAll();
    },
  },
  computed: mapState([
    "groupData",
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
