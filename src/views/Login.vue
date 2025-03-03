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
              <ion-button
                class="ion-float-right"
                fill="clear"
                @click="showHelpAlert()"
              >
                <ion-icon :icon="helpCircleOutline" />
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
            <ion-input
              label="Username"
              label-placement="floating"
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
            <ion-input
              label="Password"
              label-placement="floating"
              v-model="password"
              :type="show_password ? 'text' : 'password'"
              name="Password"
              clear-input
              clear-on-edit="false"
              @keyup.enter="sendData"
            ></ion-input>
          </ion-item>
          <ion-item lines="none" class="ion-margin-top">
            <ion-checkbox
              color="secondary"
              label-placement="end"
              justify="start"
              v-model="show_password"
              :modelValue="show_password"
              @keyup.enter="show_password = !show_password"
            >Show password</ion-checkbox>
          </ion-item>
        </ion-row>
        <ion-row class="centered-row bottom-row">
          <ion-item lines="none">
            <ion-checkbox
              color="secondary"
              label-placement="end"
              justify="start"
              v-model="loggedin"
              :modelValue="loggedin"
              @keyup.enter="loggedin = !loggedin"
            >Stay logged in</ion-checkbox>
          </ion-item>
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
          <ion-item lines="none">
            <ion-button
              fill="none"
              size="small"
              style="width: 100%; --color: var(--ion-color-primary)"
              @click="presentForgotPasswordPrompt"
              >Forgot Password?</ion-button
            >
          </ion-item>
        </ion-row>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
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
  alertController,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { showToast } from "@/store/helper";
// @ts-ignore
import { moon, sunny, helpCircleOutline } from "ionicons/icons";

export default defineComponent({
  name: "LoginView",
  components: {
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
  setup() {
    return {
      moon,
      sunny,
      helpCircleOutline,
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
      password: "",
      show_password: false,
      loggedin: false,
    };
  },
  methods: {
    sendData() {
      if (this.username == "" || this.password == "") {
        showToast("Please fill out everything!");
      } else {
        this.$store
            .dispatch("login", {
              name: this.username,
              password: this.password,
              loggedin: this.loggedin,
            })
            .then((response) => {
              this.greet(response[0]);
              this.$router.push("/tabs");
              this.clearInputs();
              if (!response[1]) {
                this.thereWasNoEmail();
              }
            });
      }
    },
    async resetPassword(name: string) {
      if (name != "") {
        this.$store.dispatch("resetPassword", name);
      } else {
        this.$store.dispatch("handleError", {
          error: null,
          message: "There was an error setting your username!",
        });
      }
    },
    async presentForgotPasswordPrompt() {
      const alert = await alertController.create({
        header: "Reset Password",
        message: "Please enter your username. You will receive a new password at the email you set. " +
          "If you don't have an email address set, please contact me at toptips@kalmbach.dev",
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
            text: "Reset Password",
            handler: (value) => {
              this.username = value.username;
              this.resetPassword(value.username);
            },
          },
        ],
      });
      return alert.present();
    },
    async showHelpAlert() {
      const alert = await alertController.create({
        cssClass: "points-alert",
        header: "Hi there, welcome to TopTips! ",
        message: "Log in or register to use the app. \n\n" +
        "If you have any suggestions, questions or complaints, feel free to contact me at toptips@kalmbach.dev.",
        buttons: [
          {
            text: "Close",
            role: "cancel",
            cssClass: "secondary",
          },
        ],
      });
      return alert.present();
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
    async thereWasNoEmail() {
      const alert = await alertController
          .create({
            header: "Please enter your email!",
            message:
                        "For additional security and the ability to reset your password," +
                        " you are required to enter your email. Thank you very much.",
            buttons: [
              {
                text: "Save",
                handler: (val) => {
                  if (!this.validateEmail(val.email)) {
                    showToast("Please enter a valid email!");
                  } else {
                    this.$store.dispatch("updateEmail", val.email).then((response) => {
                      if (response) {
                        showToast(response);
                      }
                      this.clearInputs();
                      alert.dismiss();
                    }).catch(() => {
                    });
                  }
                  return false;
                },
              },
            ],
            inputs: [
              {
                name: "email",
                type: "email",
                placeholder: "test@example.com",
              },
            ],
            backdropDismiss: false,
          });

      await alert.present();
    },
    validateEmail(email: string) {
      const regexp = new RegExp(
          // eslint-disable-next-line max-len
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
      if (regexp.test(email)) {
        return true;
      } else return false;
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

.points-alert .alert-head .alert-title {
  font-size: 18px !important;
}

.points-alert {
  white-space: pre-wrap;
}
</style>
