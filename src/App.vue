<template>
  <ion-app>
    <ion-router-outlet animated="false" />
    <ion-loading :is-open="loading" message="Please wait..." />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, IonLoading } from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { store } from './store/store';

export default defineComponent({
  name: 'App',
  store,
  components: {
    IonApp,
    IonRouterOutlet,
    IonLoading,
  },
  computed: mapState(['loading']),
});
</script>
