import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { alertController, IonicVue, toastController } from "@ionic/vue";

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
    .use(IonicVue)
    .use(router)
    .use(store, key)
    .use(VueClipboard);

const newMajor = () => {
  alertController.create({
    header: "Update Required!",
    message: "There is an important update available.<br>" +
        "Correct functionality cannot be ensured, therefore you must update in order to proceed.",
    buttons: [
      {
        text: "Update",
        handler: () => {
          window.open("https://play.google.com/store/apps/details?id=app.kalmbach.dev");
          return false;
        },
      },
    ],
    backdropDismiss: false,
  }).then((alert) => {
    alert.present();
  });
};
const updateAvailable = (message: string) => {
  toastController
      .create({
        message: message,
        duration: 4000,
        buttons: [
          {
            text: "Update",
            handler: () => {
              window.open("https://play.google.com/store/apps/details?id=app.kalmbach.dev");
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

      const new1 = Number(splitNewestVersion[0]);
      const new2 = Number(splitNewestVersion[1]);
      const new3 = Number(splitNewestVersion[2]);
      const curr1 = Number(splitAppVersion[0]);
      const curr2 = Number(splitAppVersion[1]);
      const curr3 = Number(splitAppVersion[2]);
      if (new1 > curr1) {
        newMajor();
        return;
      } else if (new1 == curr1) {
        if (new2 > curr2) {
          updateAvailable("Recommended update available :)");
        } else if (new2 == curr2 && new3 > curr3) {
          updateAvailable("Optional update available :)");
        }
      }
    }
  } catch (error) {
    // error can be ignored
  }

  app.mount("#app");
});
