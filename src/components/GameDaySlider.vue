<template>
  <ion-segment scrollable v-model="this.gameDay" style="height: 48px">
    <ion-segment-button
      v-for="section in games.length"
      :key="section"
      :value="section"
      :id="'segment-' + section"
    >
      <small>Gameday {{ section }}</small>
    </ion-segment-button>
  </ion-segment>
  <div style="height: calc(100% - 48px); overflow-y: scroll">
    <swiper
      :modules="modules"
      style="height: 100%; overflow-y: hidden"
      @swiper="setSwiperRef"
      @activeIndexChange="onSlideChanged"
      :slidesPerView="1"
      :centeredSlides="true"
      :virtual="true"
    >
      <swiper-slide
        v-for="(gameday, index) in games"
        :key="index"
        :virtualIndex="index"
      >
        <play-game
          :sectionID="Number(index)"
          :games="gameday"
          @loaded="sectionLoaded()"
        />
      </swiper-slide>
    </swiper>
  </div>
  <ion-fab
    vertical="bottom"
    horizontal="start"
    slot="fixed"
    v-if="this.ranking.length > 0 || this.activeGamedays.length > 0"
  >
    <ion-fab-button size="small" color="medium"
      ><ion-icon :icon="caretUpOutline"
    /></ion-fab-button>

    <ion-fab-list side="top">
      <ion-fab-button
        color="light"
        @click="openRankingModal()"
        v-if="this.ranking.length > 0"
      >
        <ion-icon :icon="podiumOutline" />
      </ion-fab-button>
      <ion-fab-button
        color="light"
        @click="getGameday()"
        v-if="this.activeGamedays.length > 0"
      >
        <ion-icon :icon="todayOutline" />
      </ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

import {
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonIcon,
  alertController,
  modalController,
  IonFabList,
} from "@ionic/vue";

// Import Swiper styles
import "swiper/css/bundle";

import { Navigation, Pagination, Virtual } from "swiper";

import PlayGame from "@/components/PlayGame.vue";

import { defineComponent } from "vue";
import { mapState } from "vuex";

import { todayOutline, podiumOutline, caretUpOutline } from "ionicons/icons";
import RankingModal from "./RankingModal.vue";

export default defineComponent({
  name: "GameDaySlider",
  props: {
    games: {
      required: true,
    },
  },
  emits: ["segmentValue"],
  components: {
    Swiper,
    SwiperSlide,
    PlayGame,
    IonSegment,
    IonSegmentButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
  },
  setup() {
    return {
      modules: [Navigation, Virtual, Pagination],
      todayOutline,
      podiumOutline,
      caretUpOutline,
    };
  },
  data() {
    return {
      swiperRef: null,
      // gameDay is 1-indexed!
      gameDay: this.$store.state.currentGameday,
      loaded: false,
    };
  },
  methods: {
    setSwiperRef(swiper) {
      this.swiperRef = swiper;
    },
    onSlideChanged() {
      this.gameDay = this.swiperRef.activeIndex + 1;
      this.slideSegments();
    },
    async slideSegments() {
      const segment = document.getElementById("segment-" + this.gameDay);
      if (segment != null) {
        segment.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
    },
    sectionLoaded() {
      if (!this.loaded) {
        this.loaded = true;
        this.gameDay = this.currentGameday;
        this.swiperRef.slideTo(this.gameDay - 1, 0, false);
        this.slideSegments();
      }
    },
    getGameday() {
      alertController
          .create({
            header: "There are games today!",
            message:
            "Gamedays: " + (this.activeGamedays + "").replaceAll(",", ", "),
            buttons: ["Dismiss"],
          })
          .then((alert) => alert.present());
    },
    async openRankingModal() {
      const rankingModal = await modalController.create({
        component: RankingModal,
        componentProps: {
          ranking: this.ranking,
        },
      });
      await rankingModal.present();
    },
  },
  mounted() {
    this.gameDay = this.currentGameday;
    this.slideSegments();
  },
  watch: {
    gameDay(newValue) {
      const slide = newValue - 1;
      this.swiperRef.slideTo(slide, 100, false);
      this.slideSegments();
    },
  },
  computed: mapState(["currentGameday", "activeGamedays", "ranking"]),
});
</script>

<style>
.swiper-slide.swiper-slide-visible.swiper-slide-active {
  overflow-y: scroll;
}

.swiper-slide {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-button-next,
.swiper-button-prev {
  background: rgba(190, 190, 190, 0.5) !important;
  padding: 25px 20px;
  border-radius: 10px;
  color: rgb(231, 229, 229);
}
.swiper-button-disabled {
  display: none;
}

.swiper-pagination {
  overflow-x: scroll;
}

.swiper-pagination-bullet {
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #000;
  opacity: 1;
  background: rgba(0, 0, 0, 0.2);
}

.swiper-pagination-bullet-active {
  color: #fff;
  background: #007aff;
}
</style>
