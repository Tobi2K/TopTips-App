<template>
  <ion-header>
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-title class="align-middle">{{ title }}</ion-title>
          </ion-col>
          <ion-col>
            <ion-buttons class="ion-float-right">
              <ion-button @click="closeModal">
                <ion-icon :icon="close" />
              </ion-button>
            </ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <ion-list-header> User Settings </ion-list-header>
      <ion-item @click="presentEditUsernamePrompt()">
        <ion-label>Edit Username</ion-label>
      </ion-item>
    </ion-list>

    <ion-list>
      <ion-list-header> General Settings </ion-list-header>
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
            <p style="margin-right: 5px">Abmelden</p>
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
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  modalController,
  IonGrid,
  IonCol,
  IonRow,
  IonLabel,
  IonItem,
  IonIcon,
  IonText,
  useBackButton,
  IonList,
  IonListHeader,
  loadingController,
  alertController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { logOutOutline, close, send, moon, sunny } from "ionicons/icons";

import axios from "axios";
import { LOGOUT } from "@/store/mutation-types";

export default defineComponent({
  name: "SettingsModal",
  props: {
    title: {
      type: String,
      default: "Wrong Text",
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonGrid,
    IonCol,
    IonRow,
    IonLabel,
    IonItem,
    IonIcon,
    IonText,
    IonList,
    IonListHeader,
  },
  setup() {
    const closeModal = () => {
      modalController.dismiss();
    };
    useBackButton(10, () => {
      console.log("Handler was called!");
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
    };
  },
  methods: {
    async sendName() {
      const token = localStorage.getItem("JWT");
      const loading = await loadingController.create({
        message: "Please wait...",
      });

      await loading.present();
      if (this.username != "")
        axios
          .post(
            process.env.VUE_APP_HOST + `/user/name`,
            {
              name: this.username,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(() => {
            loading.dismiss();
          })
          .catch((e) => {
            loading.dismiss();
            this.errorText = "There was an error setting your username!";
            setTimeout(() => {
              this.errorText = "";
            }, 3000);
            console.log(e);
          });
      else {
        loading.dismiss();
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
            handler: () => {
              console.log("Confirm Cancel");
            },
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
  },
  mounted() {
    const token = localStorage.getItem("JWT");
    axios
      .get(process.env.VUE_APP_HOST + `/user/single`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.username = response.data.name;
      })
      .catch((e) => {
        console.log(e);
      });
  },
});
</script>
