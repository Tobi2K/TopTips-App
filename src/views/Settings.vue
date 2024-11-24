<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <ion-buttons slot="end">
          <ion-back-button
            text="Go back"
            defaultHref="/tabs/play"
            class="ion-float-right"
          >
          </ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <h3>General Settings</h3>
        <ion-row>
          <ion-col size="12">
            <ion-button
              v-if="light"
              color="medium"
              @click="toggleTheme()"
              expand="full"
            >
              <p style="margin-right: 5px">Change Theme</p>
              <ion-icon :icon="moon" />
            </ion-button>
            <ion-button
              v-else
              color="medium"
              @click="toggleTheme()"
              expand="full"
            >
              <p style="margin-right: 5px">Change Theme</p>
              <ion-icon :icon="sunny" />
            </ion-button>
          </ion-col>
          <ion-col size="12">
            <ion-button @click="presentEditUsernamePrompt()" expand="full">
              <p style="margin-right: 5px">Edit Username</p>
              <ion-icon :icon="createOutline" />
            </ion-button>
          </ion-col>
          <ion-col size="12">
            <ion-button @click="presentChangePasswordPrompt()" expand="full">
              <p style="margin-right: 5px">Change Password</p>
              <ion-icon :icon="lockOpenOutline" />
            </ion-button>
          </ion-col>
          <ion-col size="12">
            <ion-button color="danger" @click="logout" expand="full">
              <p style="margin-right: 5px">Logout</p>
              <ion-icon :icon="logOutOutline" />
            </ion-button>
          </ion-col>
          <ion-col size="12">
            <ion-button
              v-if="!showDeleteButton"
              fill="clear"
              color="danger"
              size="small"
              @click="showDeleteButton = true">
              <p style="margin-right: 5px">Show Delete Account Button</p>
            </ion-button>
            <ion-button v-if="showDeleteButton" color="danger" @click="deleteAccount" expand="full">
              <p style="margin-right: 5px">Delete Account</p>
              <ion-icon :icon="trashOutline" />
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-list>
      <ion-list>
        <h3>Device Notification Settings</h3>
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
          distribution or perfect games).</ion-list-header
        >
        <div v-if="groupNoti">
          <ion-item v-for="group in userGroups" :key="group">
            <ion-toggle
              @ionChange="
                toggleStatus('group' + group.group.id, group.group.name)
              "
              :value="group.group.id"
              :checked="getStatus('group' + group.group.id)"
            >
            {{ group.group.name }}
            </ion-toggle>
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
        <ion-list-header>Notifications for pending games (at 12 PM CEST).</ion-list-header>
        <div v-if="gameNoti">
          <ion-item v-for="season in userSeasons" :key="season">
            <ion-toggle
              @ionChange="toggleStatus('season' + season.id, season.name)"
              :value="season.id"
              :checked="getStatus('season' + season.id)"
            >
              {{ season.name }} <small>({{ season.competition.country }})</small>
            </ion-toggle>
          </ion-item>
        </div>
      </ion-list>

      <ion-list>
        <h3>Email Notification Settings</h3>
        <p>
          You will receive a notification (at 12:15 PM CEST) via the email used to register. Please add <a href="mailto:toptips@kalmbach.dev">toptips@kalmbach.dev</a> to your email contacts for optimal delivery.
        </p>
        <ion-row>
          <ion-col>
            <h6>Game Notifications</h6>
          </ion-col>
          <ion-col>
            <ion-button
              class="ion-float-right"
              v-if="emailNoti"
              fill="clear"
              @click="emailNoti = !emailNoti"
            >
              Hide
            </ion-button>
            <ion-button
              class="ion-float-right"
              v-else
              fill="clear"
              @click="emailNoti = !emailNoti"
            >
              Show
            </ion-button>
          </ion-col>
        </ion-row>
        <ion-list-header>Notifications for pending games.</ion-list-header>
        <div v-if="emailNoti">
          <div v-for="subscription in userSubscriptions" :key="subscription">
            <ion-item>
              <ion-toggle
                @ionChange="subscribeEmail(subscription, true)"
                :value="subscription.day_of"
                :checked="subscription.day_of"
              >
                Day-Of Notifications for {{ subscription.season.name }} <small>({{ subscription.season.competition.country }})</small>
              </ion-toggle>
              </ion-item>
              <ion-item>
              <ion-toggle
                @ionChange="subscribeEmail(subscription, false)"
                :value="subscription.day_before"
                :checked="subscription.day_before"
              >
                Day-Before Notifications for {{ subscription.season.name }} <small>({{ subscription.season.competition.country }})</small> 
              </ion-toggle>
            </ion-item>
          </div>
        </div>
      </ion-list>
      
      <p style="text-align: center; margin-top: 100px;">
        <small>
          If you have any suggestions, questions or complaints, feel free to contact me at
          <a href="mailto:tobias@kalmbach.dev">tobias@kalmbach.dev</a>.
          <br />
          <a href="https://kalmbach.dev/privacy.html">Privacy Policy</a> |
          <a href="https://kalmbach.dev/imprint.html">Imprint</a>
        </small>
      </p>

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
  IonCol,
  IonRow,
  IonItem,
  IonIcon,
  IonList,
  IonListHeader,
  alertController,
  IonToggle,
  IonBackButton,
  IonItemDivider,
  IonPage,
} from "@ionic/vue";
import { defineComponent } from "vue";

import {
  logOutOutline,
  close,
  send,
  moon,
  sunny,
  createOutline,
  lockOpenOutline,
  trashOutline,
} from "ionicons/icons";

import { mapState } from "vuex";

import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from "@capacitor/push-notifications";
import { showToast } from "@/store/helper";

export default defineComponent({
  name: "SettingsView",
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
    IonItem,
    IonIcon,
    IonList,
    IonListHeader,
    IonToggle,
  },
  setup() {
    async () => {
      await PushNotifications.requestPermissions();
      await PushNotifications.register();
    };

    return {
      logOutOutline,
      close,
      send,
      moon,
      sunny,
      createOutline,
      lockOpenOutline,
      trashOutline,
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
      username: "",
      oldPass: "",
      newPass: "",
      repeatPass: "",
      gameNoti: false,
      emailNoti: false,
      groupNoti: false,
      showDeleteButton: false,
      consequences: false,
      deletePassword: "",
    };
  },
  methods: {
    async sendName(name: string) {
      if (name != "") {
        this.$store.dispatch("saveName", name).then(() => {
          this.$router.push("/");
        });
      } else {
        this.$store.dispatch("handleError", {
          error: null,
          message: "There was an error setting your username!",
        });
      }
    },
    async presentEditUsernamePrompt() {
      const alert = await alertController.create({
        header: "Edit Username",
        message: "You will be logged out.",
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
              this.sendName(value.username);
            },
          },
        ],
      });
      return alert.present();
    },
    sendChangePassword(oldPass: string, newPass: string, repeatPass: string) {
      if (oldPass == "" || newPass == "" || repeatPass == "") {
        this.$store.dispatch("handleError", {
          error: null,
          message: "Please fill in everything!",
        });
        return false;
      }
      if (newPass == repeatPass) {
        this.$store.dispatch("changePassword", { "oldPass": oldPass, "newPass": newPass }).then(() => {
          this.$router.push("/");
        });
      } else {
        this.$store.dispatch("handleError", {
          error: null,
          message: "There was an error setting your password!",
        });
        return false;
      }
    },
    async presentChangePasswordPrompt() {
      this.oldPass = "";
      this.newPass = "";
      this.repeatPass = "";
      const alert = await alertController.create({
        header: "Change Password",
        message: "You will be logged out.",
        inputs: [
          {
            name: "oldPass",
            id: "oldPassID",
            type: "password",
            value: this.oldPass,
            placeholder: "Your Old Password",
          },
          {
            name: "newPass",
            id: "newPassID",
            type: "password",
            value: this.newPass,
            placeholder: "Your New Password",
          },
          {
            name: "repeatPass",
            id: "repeatPassID",
            type: "password",
            value: this.repeatPass,
            placeholder: "Repeat Your New Password",
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Save Password",
            id: "SavePasswordID",
            handler: (value) => {
              if (value.newPass != value.repeatPass) {
                this.$store.dispatch("handleError", {
                  error: null,
                  message: "Your passwords do not match!",
                });
                return false;
              }
              this.oldPass = value.oldPass;
              this.newPass = value.newPass;
              return this.sendChangePassword(value.oldPass, value.newPass, value.repeatPass);
            },
          },
        ],
      });
      return alert.present();
    },
    async deleteAccount() {
      const alert = await alertController.create({
        cssClass: "points-alert",
        header: "Are you sure you want to delete your account?",
        message: "THIS ACTION CANNOT BE UNDONE. YOUR GUESSES, GROUPS AND SETTINGS WILL BE DELETED!",
        inputs: [
          {
            label: "Yes, I understand the consequences.",
            type: "checkbox",
            checked: this.consequences,
            value: this.consequences,
            name: "consequences",
            id: "consequencesID",
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Yes, delete",
            handler: (value) => {
              if (value.length == 0) {
                this.generateAlert("Please check the checkbox.");
                return false;
              }
              this.reallyDeleteAccount();
            },
          },
        ],
      });
      return alert.present();
    },
    async reallyDeleteAccount() {
      const alert = await alertController.create({
        header: "Please enter your password to continue.",
        message: "THIS ACTION CANNOT BE UNDONE. YOUR GUESSES, GROUPS AND SETTINGS WILL BE DELETED!",
        inputs: [
          {
            name: "password",
            id: "passwordID",
            value: this.deletePassword,
            type: "password",
            placeholder: "Your password",
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "DELETE ACCOUNT",
            handler: (value) => {
              this.deletePassword = value.password;
              this.sendDeleteAccount(value.password);
            },
          },
        ],
      });
      return alert.present();
    },
    sendDeleteAccount(password: string) {
      if (password != "") {
        this.$store.dispatch("deleteAccount", password).then(() => {
          this.$router.push("/");
        });
      } else {
        this.$store.dispatch("handleError", {
          error: null,
          message: "There was an error deleting your account!",
        });
      }
      this.deletePassword = "";
      this.consequences = false;
      this.showDeleteButton = false;
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
      this.$store.dispatch("LOGOUT");
      this.$router.push("/");
    },
    toggleStatus(id: string, name: string) {
      const escapedID = id.replaceAll(":", "");
      if (localStorage.getItem(escapedID) == "true") {
        // unsubscribe
        FCM.unsubscribeFrom({ topic: escapedID })
            .then(() => {
              localStorage.setItem(escapedID, "false");
              this.generateAlert("Unsubscribed from notifications for " + name);
            })
            .catch(() => this.generateAlert("Operation failed. Sorry!"));
      } else {
        // subscribe
        FCM.subscribeTo({ topic: escapedID })
            .then(() => {
              localStorage.setItem(escapedID, "true");
              this.generateAlert("Subscribed to notifications for " + name);
            })
            .catch(() => this.generateAlert("Operation failed. Sorry!"));
      }
    },
    getStatus(id: string) {
      const escapedID = id.replaceAll(":", "");
      return localStorage.getItem(escapedID) == "true";
    },
    subscribeEmail(subscription: { day_of: boolean; season: { id: any; }; day_before: boolean; }, dayOf: boolean) {
      if (dayOf) {
        subscription.day_of = !subscription.day_of
        if (subscription.day_of) {
          this.$store.dispatch("subscribeEmail", {"seasonID": subscription.season.id, "isToday": dayOf});
        } else {
          this.$store.dispatch("unsubscribeEmail", {"seasonID": subscription.season.id, "isToday": dayOf});
        }
      } else {
        subscription.day_before = !subscription.day_before
        if (subscription.day_before) {
          this.$store.dispatch("subscribeEmail", {"seasonID": subscription.season.id, "isToday": dayOf});
        } else {
          this.$store.dispatch("unsubscribeEmail", {"seasonID": subscription.season.id, "isToday": dayOf});
        }
      }
    },
    generateAlert(message: string) {
      showToast(message);
    },
  },
  mounted() {
    this.$store.dispatch("checkJWT");
    this.username = this.$store.state.user.username;
    this.$store.dispatch("getUserSeasons");
    this.$store.dispatch("getUserSubscriptions");
  },
  computed: mapState(["userSeasons", "userGroups", "userSubscriptions"]),
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
