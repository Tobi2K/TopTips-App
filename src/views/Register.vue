<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="text-center">
        <ion-grid class="ion-no-padding">
          <ion-row>
            <ion-col>
              <ion-title class="align-middle"> Top Tips - Register </ion-title>
            </ion-col>
            <ion-col>
              <ion-button
                class="ion-float-right"
                v-if="light"
                fill="clear"
                @click="toggleTheme()"
              >
                <ion-icon :icon="moon" />
              </ion-button>
              <ion-button
                class="ion-float-right"
                v-else
                fill="clear"
                color="dark"
                @click="toggleTheme()"
              >
                <ion-icon :icon="sunny" />
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="center-vertically">
        <ion-row class="centered-row">
          <ion-item>
            <ion-label position="floating">Username</ion-label>
            <ion-input
              v-model="username"
              type="text"
              name="Username"
              clear-input
              @keyup.enter="sendData"
            ></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="centered-row">
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input
              v-model="email"
              type="email"
              name="Email"
              clear-input
              @keyup.enter="sendData"
            ></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="centered-row">
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input
              v-model="password"
              type="password"
              name="Password"
              clear-input
              @keyup.enter="sendData"
            ></ion-input>
          </ion-item>
        </ion-row>

        <ion-row class="centered-row bottom-row">
          <ion-item lines="none" style="width: 100%">
            <ion-button
              @click="sendData"
              expand="block"
              size="large"
              class="custom-bg"
              style="width: 100%"
            >
              Register
            </ion-button>
          </ion-item>
          <ion-item lines="none" style="width: 100%">
            <ion-button
              fill="none"
              size="small"
              style="width: 100%; --color: var(--ion-color-primary)"
              @click="this.$router.push('/')"
              >Login
            </ion-button>
          </ion-item>
        </ion-row>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonLabel,
  IonPage,
  IonItem,
  IonInput,
  IonContent,
  IonRow,
  IonButton,
  IonTitle,
  IonCol,
  IonGrid,
  IonToolbar,
  IonHeader,
  toastController,
  IonIcon,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { moon, sunny } from "ionicons/icons";
import { showToast } from "@/store/helper";

export default defineComponent({
  name: "Tabs",
  components: {
    IonLabel,
    IonPage,
    IonItem,
    IonInput,
    IonContent,
    IonRow,
    IonButton,
    IonTitle,
    IonCol,
    IonGrid,
    IonToolbar,
    IonHeader,
    IonIcon,
  },
  data() {
    let light = true;
    const x = document.getElementsByTagName("body")[0].classList;
    if (x.contains("dark")) {
      light = false;
    }
    return {
      moon,
      sunny,
      light,
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async sendData() {
      if (this.username == "" || this.email == "" || this.password == "") {
        showToast("Please fill out everything!");
      } else if (!this.validateEmail(this.email)) {
        showToast("Please enter a valid email!");
      } else {
        this.$store
          .dispatch("register", {
            username: this.username,
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            this.greet(response);
            this.$router.push("/tabs/tab3");
            this.clearInputs();
          })
          .catch();
      }
    },
    validateEmail(email: string) {
      const regexp = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if (regexp.test(email)) {
        return true;
      } else return false;
    },
    clearInputs() {
      this.username = "";
      this.email = "";
      this.password = "";
    },
    greet(name: string) {
      toastController
        .create({
          message: "Welcome to the game, " + name + "!",
          duration: 2000,
          cssClass: "toast",
          position: "middle",
        })
        .then((toast) => toast.present());
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
  },
  mounted() {
    if (localStorage.getItem("dark") == "t") {
      document.getElementsByTagName("body")[0].classList.add("dark");
    }
  },
});
</script>

<style scoped>
.centered-row {
  width: 60%;
  margin-left: 20%;
  margin-top: 5%;
  text-align: center;
}

.bottom-row {
  bottom: 50px;
}

#imgItem {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
}

ion-item {
  --background: rgba(0, 0, 0, 0);
  width: 100%;
}
</style>
