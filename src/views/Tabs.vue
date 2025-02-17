<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/play">
          <ion-icon :icon="dice" />
          <ion-label>Play</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/score">
          <ion-icon :icon="trophyOutline" />
          <ion-label>Score</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/group">
          <ion-icon :icon="peopleCircleOutline" />
          <ion-label>Groups</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { App } from "@capacitor/app";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  alertController,
  useBackButton,
} from "@ionic/vue";
import { dice, trophyOutline, peopleCircleOutline } from "ionicons/icons";
import { useRouter } from "vue-router";

export default {
  name: "MainTabs",
  components: {
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
  },
  setup() {
    const router = useRouter();
    useBackButton(1, () => {
      const currentRoute = router.currentRoute.value.path.split("/")[1];
      const goBackSites = ["settings", "country", "competition", "season", "create"];
      if ((goBackSites.indexOf(currentRoute) > -1)) {
        router.back();
      } else {
        alertController.create({
          header: "Exit app?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                return false;
              },
            },
            {
              text: "Yes",
              role: "confirm",
              handler: () => {
                App.exitApp();
              },
            },
          ],
        }).then((alert) => {
          alert.present();
        });
      }
    });
    return {
      dice,
      trophyOutline,
      peopleCircleOutline,
    };
  },
};
</script>

<style>
.custom-bg {
  background: rgb(55, 67, 91);
  background: linear-gradient(
    90deg,
    rgba(74, 91, 125, 1) 0%,
    rgba(55, 67, 91, 1) 100%
  );
  --background: rgb(55, 67, 91);
  --background: linear-gradient(
    90deg,
    rgba(74, 91, 125, 1) 0%,
    rgba(55, 67, 91, 1) 100%
  );
}

.custom-bg-opacity-95 {
  background: rgb(55, 67, 91);
  background: linear-gradient(
    90deg,
    rgba(55, 67, 91, 0.98) 0%,
    rgba(74, 91, 125, 0.98) 100%
  );
}

.custom-bg-opacity-75 {
  background: rgb(55, 67, 91);
  background: linear-gradient(
    90deg,
    rgba(55, 67, 91, 0.75) 0%,
    rgba(74, 91, 125, 0.75) 100%
  );
}

.small-text {
  font-size: 0.75em;
}

.medium-text {
  font-size: 0.95em;
}

.items-end {
  justify-content: end !important;
}

.align-middle {
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.text-dark {
  color: var(--ion-color-dark-shade);
}

.text-light {
  color: #d7d8da;
}

.border-bottom {
  border-bottom: 0.02em var(--ion-color-step-400) solid;
}
.bg-secondary {
  background-color: var(--ion-color-step-200);
}
.action-sheet-cancel {
  --button-color: #ff4500 !important;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left !important;
}

.toast {
  --width: 60%;
  --border-radius: 20px;
  margin-top: -10%;
  text-align: center;
  --background: rgb(248, 177, 149);
  --background: linear-gradient(
    270deg,
    rgba(248, 177, 149, 1) 0%,
    rgba(246, 114, 128, 1) 25%,
    rgba(192, 108, 132, 1) 50%,
    rgba(108, 91, 123, 1) 75%,
    rgba(53, 92, 125, 1) 100%
  );
  --color: #f2f2f2;
}

.pointer {
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-thumb {
  background: #BDBDBD;
}

::-webkit-scrollbar-thumb:hover {
  background: #6E6E6E;
}
</style>
