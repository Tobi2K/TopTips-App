<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="text-center">
        <ion-grid class="ion-no-padding">
          <ion-row>
            <ion-col>
              <ion-title class="align-middle"> Top Tipps - Login </ion-title>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item
        lines="none"
        style="text-align: center; width: 100%"
        id="imgItem"
      >
        <img src="@/img/login.png" alt="customPic" />
      </ion-item>
      <ion-row class="centered-row">
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input
            v-model="email"
            type="email"
            name="Email"
            inputmode="email"
            clear-input
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
          ></ion-input>
        </ion-item>
      </ion-row>

      <ion-row class="centered-row">
        <ion-text color="danger" style="width: 100%">
          {{ errorText }}
        </ion-text>
      </ion-row>

      <ion-row class="centered-row bottom-row">
        <ion-item lines="none" style="width: 100%">
          <ion-button
            @click="sendData"
            expand="block"
            size="large"
            style="width: 100%"
            >Login</ion-button
          >
        </ion-item>
        <ion-item lines="none" style="width: 100%">
          <ion-button
            fill="none"
            size="small"
            style="width: 100%; --color: var(--ion-color-primary)"
            @click="this.$router.push('/register')"
            >Register</ion-button
          >
        </ion-item>
      </ion-row>
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
  IonText,
  IonTitle,
  IonCol,
  IonGrid,
  IonToolbar,
  IonHeader,
  toastController,
} from "@ionic/vue";

import { defineComponent } from "vue";

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
    IonText,
    IonTitle,
    IonCol,
    IonGrid,
    IonToolbar,
    IonHeader,
  },
  data() {
    return {
      email: "",
      password: "",
      errorText: "",
    };
  },
  methods: {
    sendData() {
      if (this.email == "" || this.password == "") {
        this.errorText = "Bitte überall etwas ausfüllen!";
        setTimeout(() => {
          this.errorText = "";
        }, 3000);
      } else {
        this.$store
          .dispatch("login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            this.greet(response);
            this.clearInputs();
          })
          .catch((errorText) => {
            this.errorText = errorText;
            setTimeout(() => {
              this.errorText = "";
            }, 3000);
          });
      }
    },
    clearInputs() {
      this.email = "";
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
  },
  mounted() {
    this.$store
      .dispatch("checkStatus")
      .then((response) => {
        if (response) this.greet(response);
        this.clearInputs();
      })
      .catch(() => {
        console.log("No login found.");
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
</style>
