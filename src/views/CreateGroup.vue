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
      <ion-item lines="none">
        <ion-text color="danger">
          <small>{{ errorText }}</small>
        </ion-text>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  loadingController,
  IonList,
  IonItem,
  IonLabel,
  alertController,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonButton,
  IonListHeader,
  IonInput,
  toastController,
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
    IonText,
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
      errorText: "",
      seasonData: [],
    };
  },
  methods: {
    cancel() {
      this.$router.push("/tabs/tab3");
    },
    async createGroup() {
      const loading = await loadingController.create({
        message: "Please wait...",
      });
      await loading.present();
      if (this.seasonData == []) {
        loading.dismiss();
        this.errorText = "Something went wrong. Please try again later.";
        setTimeout(() => {
          this.errorText = "";
        }, 3000);
      } else if (this.groupName == "") {
        loading.dismiss();
        this.errorText = "Please give your group a name!";
        setTimeout(() => {
          this.errorText = "";
        }, 3000);
      } else {
        this.$store
          .dispatch("createGroup", {
            groupName: this.groupName,
            seasonID: this.season,
          })
          .then(async (response) => {
            loading.dismiss();

            const alert = await alertController.create({
              header: this.groupName + " was created!",
              subHeader: "Passphrase: " + response,
              message:
                "Others can join using the passphrase. <br><br> The passphrase can also be found in the group tab later.",
              buttons: [
                {
                  text: "Copy Passphrase",
                  handler: () => {
                    this.copyPassphrase(response)
                    this.$router.push("/tabs/tab3");
                  },
                },
                {
                  text: "Continue",
                  handler: () => {
                    this.$router.push("/tabs/tab3");
                  },
                },
              ],
            });

            this.groupName = "";
            await alert.present();
          })
          .catch((e) => {
            this.groupName = "";
            this.errorText = "Something went wrong. Please try again later.";

            loading.dismiss();
          });
      }
    },
    async copyPassphrase(passphrase: string) {
      if (passphrase != "") {
        try {
          navigator.clipboard.writeText(passphrase);
          toastController
            .create({
              message: "Passphrase copied to clipboard.",
              duration: 2000,
            })
            .then((value) => {
              value.present();
            });
        } catch (e) {
          toastController
            .create({
              message: "Copy failed. Sorry :(",
              duration: 2000,
            })
            .then((value) => {
              value.present();
            });
        }
      } else {
        toastController
            .create({
              message: "Copy failed. Sorry :(",
              duration: 2000,
            })
            .then((value) => {
              value.present();
            });
      }
    },
  },
  mounted() {
    this.$store.dispatch("refreshSeasonData", this.season).then((val) => {
        this.seasonData = val
    }).catch((e)=> {
      this.errorText = e;
      setTimeout(() => {
        this.errorText = "";
      }, 3000);
    })
  },
});
</script>
