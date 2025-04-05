import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { alertController, IonicVue, toastController, isPlatform } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import { store, key } from "./store/store";

import { VueClipboard } from "@soerenmartius/vue3-clipboard";

import "./registerServiceWorker";

const app = createApp(App)
    .use(IonicVue, {
      innerHTMLTemplatesEnabled: true,
      mode: "md",
    })
    .use(router)
    .use(store, key)
    .use(VueClipboard);

const newMajor = (android: boolean) => {
  alertController.create({
    cssClass: "points-alert",
    header: "Update Required!",
    message: "There is an important update available.\n" +
        "Correct functionality cannot be ensured, therefore you must" +
        (android ? " update " : " reload ") +
        "in order to proceed." +
        (android ? "" : " You might have to full-reload (Ctrl + F5) if you're using a browser. If you have a home screen shortcut on iPhone, remove it and re-add it by going to https://toptips.page."),
    buttons: [
      {
        text: (android ? "Update" : "Reload"),
        handler: () => {
          if (android) {
            window.open("https://play.google.com/store/apps/details?id=app.kalmbach.dev");
          } else {
            location.reload();
          }
          return false;
        },
      },
    ],
    backdropDismiss: false,
  }).then((alert) => {
    alert.present();
  });
};
const updateAvailable = (message: string, android: boolean) => {
  toastController
      .create({
        message: message,
        duration: 4000,
        buttons: [
          {
            text: (android ? "Update" : "Reload"),
            handler: () => {
              if (android) {
                window.open("https://play.google.com/store/apps/details?id=app.kalmbach.dev");
              } else {
                location.reload();
              }
            },
          },
        ],
      })
      .then((value) => {
        value.present();
      });
};

router.isReady().then(async () => {
  try {
    const newestVersion = await store.dispatch("getVersion");
    const appVersion = require("../package.json").version;
    if (newestVersion && newestVersion !== appVersion) {
      const splitNewestVersion = (newestVersion as string).split(".");
      const splitAppVersion = appVersion.split(".");

      const android = isPlatform("android") && !isPlatform("pwa") && !isPlatform("mobileweb");

      const new1 = Number(splitNewestVersion[0]);
      const new2 = Number(splitNewestVersion[1]);
      const new3 = Number(splitNewestVersion[2]);
      const curr1 = Number(splitAppVersion[0]);
      const curr2 = Number(splitAppVersion[1]);
      const curr3 = Number(splitAppVersion[2]);
      if (new1 > curr1) {
        newMajor(android);
        return;
      } else if (new1 == curr1) {
        if (new2 > curr2) {
          updateAvailable(
              "Recommended update available :)",
              android,
          );
        } else if (new2 == curr2 && new3 > curr3) {
          updateAvailable(
              "Optional update available :)",
              android,
          );
        }
      }
    }
  } catch (error) {
    // error can be ignored
  }

  app.mount("#app");
});
