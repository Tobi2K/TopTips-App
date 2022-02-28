<template>
  <ion-page>
    <custom-header title="Group Management" @refresh="refreshAll" />
    <ion-content :fullscreen="true" id="mainSlide">
      <ion-list>
        <ion-item v-if="userGroups">
          <ion-label>Select Group</ion-label>
          <ion-select
            interface="action-sheet"
            placeholder="Select One"
            v-model="groupID"
            :key="userGroups"
            @ionChange="selectedGroup(groupID)"
          >
            <ion-select-option
              v-for="group in userGroups"
              :key="group"
              :value="group.group.id"
              >{{ group.group.name }}</ion-select-option
            >
          </ion-select>
        </ion-item>
        <ion-item @click="presentJoinGroupPrompt()">
          <ion-label>Join Group</ion-label>
        </ion-item>
        <ion-item @click="goToCreateGroup()">
          <ion-label>Create New Group</ion-label>
        </ion-item>
      </ion-list>

      <ion-list v-if="groupData != null">
        <ion-list-header>Current Group</ion-list-header>
        <ion-item>
          <ion-label>
            <h2><strong>Name:</strong> {{ groupData.name }}</h2>
            <ion-row v-if="groupData.passphrase">
              <ion-col style="padding-left: 0"
                ><strong>Passphrase:</strong>
                {{ groupData.passphrase }}</ion-col
              >
              <ion-col>
                <ion-text @click="copyPassphrase()" class="ion-float-right">
                  <ion-icon :icon="copyOutline" />
                </ion-text>
              </ion-col>
            </ion-row>
            <p v-else>
              <strong>Passphrase:</strong> Ask the owner ({{
                groupData.owner.name
              }}) for the passphrase
            </p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <h2><strong>Season:</strong> {{ groupData.season.name }}</h2>
            <p>
              <strong>Duration:</strong>
              {{
                this.moment(groupData.season.start_date).format("DD MMM, YYYY")
              }}
              -
              {{
                this.moment(groupData.season.end_date).format("DD MMM, YYYY")
              }}
            </p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <h2><strong>Members:</strong></h2>
            <p v-for="member in groupData.members" :key="member">
              {{ member }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-item lines="none">
        <ion-text color="danger">
          <small>{{ errorText }}</small>
        </ion-text>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  loadingController,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  alertController,
  IonText,
  IonRow,
  IonIcon,
  IonCol,
  toastController,
} from "@ionic/vue";

import CustomHeader from "@/components/CustomHeader.vue";

import {
  arrowBackCircleOutline,
  arrowForwardCircleOutline,
  settingsOutline,
  refresh,
  copyOutline,
} from "ionicons/icons";

import moment from "moment";

import { defineComponent } from "vue";
import axios from "axios";
import router from "@/router";
import useClipboard from "vue-clipboard3";

import { useStore } from "@/store/store";
import { mapState } from "vuex";
import { JOIN_GROUP, UPDATE_CURRENT_GROUP_ID } from "@/store/mutation-types";

/*axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error) {
      if (error.response) {
        if (error.response.status == 401) {
          router.push("/");
          localStorage.removeItem("JWT");
        }
      }
    } else throw error;
  }
);*/

export default defineComponent({
  name: "Group",
  components: {
    IonContent,
    IonPage,
    CustomHeader,
    IonList,
    IonListHeader,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonText,
    IonRow,
    IonIcon,
    IonCol,
  },
  setup() {
    const store = useStore();
    console.log(store);

    return {
      store,
      arrowBackCircleOutline,
      arrowForwardCircleOutline,
      settingsOutline,
      refresh,
      copyOutline,
      moment,
    };
  },
  data() {
    return {
      username: "",
      groupPass: "",
      errorText: "",
      groups: [],
      groupID: localStorage.getItem("groupID"),
      group: null as any,
    };
  },
  methods: {
    async refreshAll() {
      this.groupID = localStorage.getItem("groupID");
      const token = localStorage.getItem("JWT");
      const loading = await loadingController.create({
        message: "Please wait...",
      });
      //await loading.present();
      axios
        .get(process.env.VUE_APP_HOST + `/group/user/` + this.groupID, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.group = response.data;
        })
        .catch((e) => {
          console.log(e);
          loading.dismiss();
        });
      axios
        .get(process.env.VUE_APP_HOST + `/group/user/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.groups = response.data;
          loading.dismiss();
        })
        .catch((e) => {
          console.log(e);
          loading.dismiss();
        });
    },
    selectedGroup(groupID: string) {
      this.$store.dispatch(UPDATE_CURRENT_GROUP_ID, groupID);
      //this.refreshAll();
    },

    async presentJoinGroupPrompt() {
      const alert = await alertController.create({
        header: "Join Group",
        inputs: [
          {
            name: "passphrase",
            id: "passphraseID",
            placeholder: "Enter Group Passphrase",
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
            text: "Join",
            handler: (value) => {
              this.groupPass = value.passphrase;
              this.joinGroup(value.passphrase);
            },
          },
        ],
      });
      return alert.present();
    },
    async goToCreateGroup() {
      this.$router.push("/competition");
    },
    async joinGroup(passphrase: string) {
      this.$store
        .dispatch(JOIN_GROUP, passphrase)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          this.errorText = error;
          setTimeout(() => {
            this.errorText = "";
          }, 3000);
        });
    },
    async copyPassphrase() {
      if (this.group && this.group.passphrase) {
        const { toClipboard } = useClipboard();
        try {
          await toClipboard(this.group.passphrase);
          toastController
            .create({
              message: "Passphrase copied to clipboard.",
              duration: 2000,
            })
            .then((value) => {
              value.present();
            });
        } catch (e) {
          toastController
            .create({
              message: "Copy failed. Sorry :(",
              duration: 2000,
            })
            .then((value) => {
              value.present();
            });
        }
      }
    },
  },
  async mounted() {
    this.$store.dispatch("initGroup").catch((error) => {
      this.errorText = error;
      setTimeout(() => {
        this.errorText = "";
      }, 3000);
    });
  },
  watch: {
    groupID(newValue) {
      localStorage.setItem("groupID", newValue);

      this.refreshAll();
    },
  },
  computed: mapState([
    "groupData",
    "showSelectGroup",
    "userGroups",
    "currentGroupID",
  ]),
});
</script>

<style scoped>
#mainSlide::before {
  opacity: 0.5;
}
</style>
