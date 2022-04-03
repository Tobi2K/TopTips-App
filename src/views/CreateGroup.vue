<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/competition"></ion-back-button>
        </ion-buttons>
        <ion-title>Finalize your group</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="cancel()" class="ion-float-right">
            Cancel
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>Your selected season:</ion-list-header>
        <ion-item>
          <ion-label>
            <h2>{{ seasonData.name }}</h2>
            <h6>
              {{ seasonData.year }}
            </h6>
            <p>
              {{ this.moment(seasonData.start_date).format("DD MMM, YYYY") }} -
              {{ this.moment(seasonData.end_date).format("DD MMM, YYYY") }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>Give your group a name:</ion-list-header>
        <ion-item>
          <ion-input
            v-model="groupName"
            :placeholder="'e.g. ' + seasonData.name"
          ></ion-input>
        </ion-item>
      </ion-list>
      <ion-button
        expand="block"
        fill="clear"
        color="tertiary"
        @click="createGroup()"
      >
        Create Group
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  alertController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonButton,
  IonListHeader,
  IonInput,
} from "@ionic/vue";

import {
  arrowBackCircleOutline,
  arrowForwardCircleOutline,
  settingsOutline,
  refresh,
  chevronDownCircleOutline,
} from "ionicons/icons";

import moment from "moment";

import { defineComponent } from "vue";

import { toClipboard } from "@soerenmartius/vue3-clipboard";
import { showToast } from "@/store/helper";

export default defineComponent({
  name: "Create Group",
  props: {
    season: {
      type: String,
      required: true,
    },
  },
  components: {
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonButton,
    IonLabel,
    IonListHeader,
    IonInput,
  },
  setup() {
    return {
      arrowBackCircleOutline,
      arrowForwardCircleOutline,
      settingsOutline,
      refresh,
      chevronDownCircleOutline,
      moment,
    };
  },
  data() {
    return {
      groupName: "",
      seasonData: [],
    };
  },
  methods: {
    cancel() {
      this.$router.push("/tabs/group");
    },
    async createGroup() {
      if (this.seasonData == []) {
        this.$store.dispatch("handleError", {
          error: null,
          message: "Something went wrong. Please try again later.",
        });
      } else if (this.groupName == "") {
        showToast("Please give your group a name!");
      } else {
        this.$store
          .dispatch("createGroup", {
            groupName: this.groupName,
            seasonID: this.season,
          })
          .then((response) => {
            alertController
              .create({
                header: this.groupName + " was created!",
                subHeader: "Passphrase: " + response,
                message:
                  "Others can join using the passphrase. <br><br> The passphrase can also be found in the group tab later.",
                buttons: [
                  {
                    text: "Copy Passphrase",
                    handler: () => {
                      this.copyPassphrase(response);
                      this.$router.push("/tabs/group");
                    },
                  },
                  {
                    text: "Continue",
                    handler: () => {
                      this.$router.push("/tabs/group");
                    },
                  },
                ],
              })
              .then((val) => val.present())
              .finally(() => (this.groupName = ""));
          })
          .catch(() => {
            this.groupName = "";
            this.$store.dispatch("handleError", {
              error: null,
              message: "Something went wrong. Please try again later.",
            });
          });
      }
    },
    async copyPassphrase(passphrase: string) {
      if (passphrase != "") {
        try {
          toClipboard(passphrase);
          showToast("Passphrase copied to clipboard.");
        } catch (e) {
          showToast("Copy failed. Sorry :(");
        }
      } else {
        showToast("Copy failed. Sorry :(");
      }
    },
  },
  mounted() {
    this.$store.dispatch("checkJWT");
    this.$store
      .dispatch("refreshSeasonData", this.season)
      .then((val) => {
        this.seasonData = val;
      })
      .catch();
  },
});
</script>
