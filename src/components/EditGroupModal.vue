<template>
  <ion-header>
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-title v-if="groupData" class="align-middle">{{
              groupData.name
            }}</ion-title>
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
    <ion-list v-if="groupData && groupData.passphrase">
      <ion-list-header> Admin Settings </ion-list-header>
      <ion-row>
        <ion-col size="12">
          <ion-button
            color="medium"
            expand="block"
            @click="presentEditGroupNamePrompt()"
          >
            <p style="margin-right: 5px">Edit Group Name</p>
            <ion-icon :icon="pencilOutline" />
          </ion-button>
        </ion-col>
        <ion-col size="12">
          <ion-button
            color="danger"
            expand="block"
            @click="presentDeleteGroupPrompt()"
          >
            <p style="margin-right: 5px">Delete Group</p>
            <ion-icon :icon="trashOutline" />
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-list>
    <ion-list v-else>
      <ion-list-header> User Settings </ion-list-header>
      <ion-row>
        <ion-col size="12">
          <ion-button
            color="medium"
            expand="block"
            @click="presentLeaveGroupPrompt()"
          >
            <p style="margin-right: 5px">Leave Group</p>
            <ion-icon :icon="exitOutline" />
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-list>
    <ion-item lines="none">
      <small>For notifications check the app settings.</small>
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
  IonItem,
  IonIcon,
  useBackButton,
  IonList,
  IonListHeader,
  alertController,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import {
  pencilOutline,
  trashOutline,
  exitOutline,
  close,
} from 'ionicons/icons';

import { mapState } from 'vuex';

export default defineComponent({
  name: 'EditGroupModal',
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
    IonItem,
    IonIcon,
    IonList,
    IonListHeader,
  },
  setup() {
    const closeModal = () => {
      modalController.dismiss();
    };
    useBackButton(10, () => {
      modalController.dismiss();
    });
    return {
      closeModal,
      trashOutline,
      pencilOutline,
      exitOutline,
      close,
    };
  },
  data() {
    return {
      groupName: '',
    };
  },
  methods: {
    async sendName() {
      if (this.groupName != '') {
        this.$store.dispatch('saveGroupName', this.groupName);
      } else {
        this.$store.dispatch('handleError', {
          error: null,
          message: 'There was an error setting the group name, sorry!',
        });
      }
    },
    async leaveGroup() {
      this.$store
          .dispatch('leaveGroup')
          .then(() => {
            modalController.dismiss();
          })
          .catch();
    },
    async deleteGroup() {
      this.$store
          .dispatch('deleteGroup')
          .then(() => {
            modalController.dismiss();
          })
          .catch();
    },
    async presentEditGroupNamePrompt() {
      const alert = await alertController.create({
        header: 'Edit Group Name',
        inputs: [
          {
            name: 'groupName',
            id: 'groupnameID',
            value: this.groupName,
            placeholder: 'Group Name',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Save Name',
            handler: (value) => {
              this.groupName = value.groupName;
              this.sendName();
            },
          },
        ],
      });
      return alert.present();
    },
    async presentLeaveGroupPrompt() {
      const alert = await alertController.create({
        header: 'Leave Group',
        message:
          'Are you sure you want to leave ' +
          this.groupName +
          '? <br> <br> THIS ACTION CANNOT BE UNDONE. YOUR GUESSES WILL BE DELETED!',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Leave',
            cssClass: 'danger',
            handler: () => {
              this.leaveGroup();
            },
          },
        ],
      });
      return alert.present();
    },
    async presentDeleteGroupPrompt() {
      const alert = await alertController.create({
        header: 'Delete Group',
        message:
          'Are you sure you want to delete ' +
          this.groupName +
          '? <br><br> THIS ACTION CANNOT BE UNDONE. ALL GUESSES WILL BE DELETED!',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            cssClass: 'danger',
            handler: () => {
              this.deleteGroup();
            },
          },
        ],
      });
      return alert.present();
    },
  },
  mounted() {
    this.groupName = this.$store.state.groupData.name;
  },
  computed: mapState(['groupData']),
});
</script>

<style>
.danger {
  color: red !important;
}
</style>
