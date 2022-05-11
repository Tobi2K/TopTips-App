<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="text-center">
        <ion-grid class="ion-no-padding">
          <ion-row>
            <ion-col>
              <ion-title class="align-middle"> Top Tips - Login </ion-title>
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
            <ion-label position="floating">Name</ion-label>
            <ion-input
              v-model="username"
              type="text"
              name="Name"
              inputmode="text"
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
        <ion-row class="centered-row">
          <ion-item lines="none">
            <ion-checkbox
              color="secondary"
              slot="start"
              v-model="loggedin"
              :modelValue="loggedin"
              @keyup.enter="loggedin = !loggedin"
            />
            <ion-label> Stay logged in</ion-label>
          </ion-item>
        </ion-row>
        <ion-row class="centered-row bottom-row">
          <ion-item lines="none">
            <ion-button
              @click="sendData"
              expand="block"
              size="large"
              class="custom-bg"
              style="width: 100%"
              >Login</ion-button
            >
          </ion-item>
          <ion-item lines="none">
            <ion-button
              fill="none"
              size="small"
              style="width: 100%; --color: var(--ion-color-primary)"
              @click="this.$router.push('/register')"
              >Register</ion-button
            >
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
  IonCheckbox,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { moon, sunny } from "ionicons/icons";
import { showToast } from "@/store/helper";

export default defineComponent({
  name: "LoginView",
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
    IonCheckbox,
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
      password: "",
      loggedin: false,
    };
  },
  methods: {
    sendData() {
      if (this.username == "" || this.password == "") {
        showToast("Please fill out everything");
      } else {
        this.$store
            .dispatch("login", {
              name: this.username,
              password: this.password,
              loggedin: this.loggedin,
            })
            .then((response) => {
              this.greet(response);
              this.$router.push("/tabs");
              this.clearInputs();
            });
      }
    },
    clearInputs() {
      this.username = "";
      this.password = "";
    },
    greet(name: string) {
      toastController
          .create({
            message: "Welcome back, " + name + "!",
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
    this.$store.dispatch("checkStatus").then((response) => {
      if (response) {
        this.greet(response);
        this.$router.push("/tabs");
      }
      this.clearInputs();
    });
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

<style>
.center-vertically {
  position: relative;
  width: 100%;
  top: 40%;
  transform: translateY(-50%);
}
</style>
