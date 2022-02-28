<template>
  <ion-list>
    <ion-item>
      <ion-label>Spieltag auswählen</ion-label>
      <ion-select
        placeholder="Auswählen"
        cancel-text="Abbrechen"
        interface="action-sheet"
        v-model="secSelection"
      >
        <div v-for="day in 34" :key="day">
          <ion-select-option :value="day">
            Spieltag {{ day }}
          </ion-select-option>
        </div>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label>Datum</ion-label>
      <ion-datetime
        cancel-text="Abbrechen"
        done-text="OK"
        display-format="DD MMMM YYYY"
        year-values="2021, 2022"
        month-names="Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember"
        placeholder="Auswählen"
        v-model="dateSelection"
      ></ion-datetime>
    </ion-item>
    <ion-button style="float: right" @click="sendDate()" color="tertiary">
      Abschicken
    </ion-button>
  </ion-list>
  <ion-list>
    <ion-item v-for="item in section" :key="item">
      <ion-label>Spieltag {{ item.section_id }}</ion-label>
      {{
        new Date(item.starting_date).toLocaleString("de-DE", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })
      }}
    </ion-item>
  </ion-list>
</template>

<script>
import {
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  name: "SetDate",
  components: {
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonButton,
  },
  data() {
    return {
      secSelection: 0,
      dateSelection: "",
      section: [],
    };
  },
  methods: {
    sendDate() {
      const token = localStorage.getItem("JWT");
      if (this.secSelection > 0 && this.dateSelection != "")
        axios
          .post(
            process.env.VUE_APP_HOST + `/section/` + this.secSelection,
            {
              date: this.dateSelection,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(() => {
            this.secSelection = 0;
            this.dateSelection = "";
          })
          .catch((e) => {
            console.log(e);
          });
      this.refreshSection();
    },
    refreshSection() {
      const token = localStorage.getItem("JWT");
      axios
        .get(process.env.VUE_APP_HOST + `/section/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.section = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.refreshSection();
  },
});
</script>
