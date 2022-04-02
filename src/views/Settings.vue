<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <ion-buttons slot="end">
          <ion-back-button
            text="Go back"
            defaultHref="/tabs/tab1"
            class="ion-float-right"
          >
          </ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <h3>General Settings</h3>
        <ion-list-header>User Settings</ion-list-header>
        <ion-item @click="presentEditUsernamePrompt()">
          <ion-label>Edit Username</ion-label>
        </ion-item>
        <ion-list-header>Application Settings</ion-list-header>
        <ion-row>
          <ion-col size="6">
            <ion-button v-if="light" color="medium" @click="toggleTheme()">
              <p style="margin-right: 5px">Change Theme</p>
              <ion-icon :icon="moon" />
            </ion-button>
            <ion-button v-else color="medium" @click="toggleTheme()">
              <p style="margin-right: 5px">Change Theme</p>
              <ion-icon :icon="sunny" />
            </ion-button>
          </ion-col>
          <ion-col size="6">
            <ion-button color="danger" class="ion-float-right" @click="logout">
              <p style="margin-right: 5px">Logout</p>
              <ion-icon :icon="logOutOutline" />
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-list>
      <ion-item lines="none">
        <ion-text color="danger">
          <small>{{ errorText }}</small>
        </ion-text>
      </ion-item>
      <ion-list>
        <h3>Notification Settings</h3>
        <p>
          These settings are device-wide. Even when logging out, notifications
          are still received.
        </p>
        <ion-row>
          <ion-col>
            <h6>Group Notifications</h6>
          </ion-col>
          <ion-col>
            <ion-button
              class="ion-float-right"
              v-if="groupNoti"
              fill="clear"
              @click="groupNoti = !groupNoti"
            >
              Hide
            </ion-button>
            <ion-button
              class="ion-float-right"
              v-else
              fill="clear"
              @click="groupNoti = !groupNoti"
            >
              Show
            </ion-button>
          </ion-col>
        </ion-row>
        <ion-list-header
          >Notifications for group information (e.g. point
          distribution).</ion-list-header
        >
        <div v-if="groupNoti">
          <ion-item v-for="group in userGroups" :key="group">
            <ion-label>
              <h2>{{ group.group.name }}</h2>
            </ion-label>
            <ion-toggle
              @ionChange="
                toggleStatus('group' + group.group.id, group.group.name)
              "
              :value="group.group.id"
              :checked="getStatus('group' + group.group.id)"
            />
          </ion-item>
        </div>
        <ion-item-divider />
        <ion-row>
          <ion-col>
            <h6>Game Notifications</h6>
          </ion-col>
          <ion-col>
            <ion-button
              class="ion-float-right"
              v-if="gameNoti"
              fill="clear"
              @click="gameNoti = !gameNoti"
            >
              Hide
            </ion-button>
            <ion-button
              class="ion-float-right"
              v-else
              fill="clear"
              @click="gameNoti = !gameNoti"
            >
              Show
            </ion-button>
          </ion-col>
        </ion-row>
        <ion-list-header>Notifications for pending games.</ion-list-header>
        <div v-if="gameNoti">
          <ion-item v-for="season in userSeasons" :key="season">
            <ion-label>
              <h2>{{ season.name }}</h2>
              <small>{{ season.competition.country }}</small>
            </ion-label>
            <ion-toggle
              @ionChange="toggleStatus(season.season_id, season.name)"
              :value="season.season_id"
              :checked="getStatus(season.season_id)"
            />
          </ion-item>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  modalController,
  IonCol,
  IonRow,
  IonLabel,
  IonItem,
  IonIcon,
  IonText,
  useBackButton,
  IonList,
  IonListHeader,
  alertController,
  IonToggle,
  IonBackButton,
  IonItemDivider,
  IonPage,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { logOutOutline, close, send, moon, sunny } from "ionicons/icons";

import { LOGOUT } from "@/store/mutation-types";

import { mapState } from "vuex";

import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from "@capacitor/push-notifications";

export default defineComponent({
  name: "Settings",
  components: {
    IonBackButton,
    IonItemDivider,
    IonPage,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonCol,
    IonRow,
    IonLabel,
    IonItem,
    IonIcon,
    IonText,
    IonList,
    IonListHeader,
    IonToggle,
  },
  setup() {
    async () => {
      await PushNotifications.requestPermissions();
      await PushNotifications.register();
    };
    const closeModal = () => {
      modalController.dismiss();
    };
    useBackButton(10, () => {
      modalController.dismiss();
    });
    return {
      closeModal,
      logOutOutline,
      close,
      send,
      moon,
      sunny,
    };
  },
  data() {
    let light = true;
    const x = document.getElementsByTagName("body")[0].classList;
    if (x.contains("dark")) {
      light = false;
    }
    return {
      light,
      errorText: "",
      username: "",
      gameNoti: false,
      groupNoti: false,
    };
  },
  methods: {
    async sendName() {
      if (this.username != "")
        this.$store.dispatch("saveName", this.username).catch((e) => {
          this.errorText = e;
          setTimeout(() => {
            this.errorText = "";
          }, 3000);
        });
      else {
        this.errorText = "There was an error setting your username!";
        setTimeout(() => {
          this.errorText = "";
        }, 3000);
      }
    },
    async presentEditUsernamePrompt() {
      const alert = await alertController.create({
        header: "Edit Username",
        inputs: [
          {
            name: "username",
            id: "usernameID",
            value: this.username,
            placeholder: "Your Username",
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Save Name",
            handler: (value) => {
              this.username = value.username;
              this.sendName();
            },
          },
        ],
      });
      return alert.present();
    },
    toggleTheme() {
      const x = document.getElementsByTagName("body")[0].classList;
      if (x.contains("dark")) {
        localStorage.setItem("dark", "f");
      } else {
        localStorage.setItem("dark", "t");
      }
      this.light = !this.light;
      x.toggle("dark");
    },
    logout() {
      this.$store.dispatch(LOGOUT);
      localStorage.removeItem("JWT");
      modalController.dismiss();
      this.$router.push("/");
    },
    toggleStatus(id: string, name: string) {
      const escapedID = id.replaceAll(":", "");
      if (localStorage.getItem(escapedID) == "true") {
        // unsubscribe
        FCM.unsubscribeFrom({ topic: escapedID })
          .then(() => {
            localStorage.setItem(escapedID, "false");
            this.generateAlert(`Unsubscribed from notifications for ` + name);
          })
          .catch(() => this.generateAlert("Operation failed. Sorry!"));
      } else {
        // subscribe
        FCM.subscribeTo({ topic: escapedID })
          .then(() => {
            localStorage.setItem(escapedID, "true");
            this.generateAlert(`Subscribed to notifications for ` + name);
          })
          .catch(() => this.generateAlert("Operation failed. Sorry!"));
      }
    },
    getStatus(id: string) {
      const escapedID = id.replaceAll(":", "");
      return localStorage.getItem(escapedID) == "true";
    },
    generateAlert(message: string) {
      this.$store.dispatch("showToast", message);
    },
  },
  mounted() {
    this.$store.dispatch("checkJWT");
    this.username = this.$store.state.user.username;
    this.$store.dispatch("getUserSeasons").catch((e) => {
      this.errorText = e;
      setTimeout(() => {
        this.errorText = "";
      }, 3000);
    });
  },
  computed: mapState(["userSeasons", "userGroups"]),
});
</script>

<style scoped>
ion-list,
ion-item,
ion-item * {
  background: rgba(0, 0, 0, 0);
  --background: rgba(0, 0, 0, 0);
}
</style>