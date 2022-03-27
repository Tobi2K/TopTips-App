<template>
  <ion-segment scrollable v-model="gameDay" style="height: 48px">
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
        <play-game :sectionID="Number(index)" :games="gameday" />
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue.js";

import { IonSegment, IonSegmentButton } from "@ionic/vue";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";

import SwiperCore, { Navigation, Pagination, Virtual } from "swiper";

// install Swiper modules
SwiperCore.use([Navigation, Virtual, Pagination]);

import PlayGame from "@/components/PlayGame.vue";

import { defineComponent } from "vue";
import { mapState } from "vuex";

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
  },
  data() {
    return {
      swiperRef: null,
      // gameDay is 1-indexed!
      gameDay: 1,
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
      if (segment != null)
        segment.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
    },
  },
  mounted() {
    this.gameDay = this.currentGameday;

    setTimeout(() => {
      this.slideSegments();
    }, 3000);

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.slideSegments();
      }, 3000 + i * 1000);
    }
  },
  watch: {
    gameDay(newValue) {
      this.swiperRef.slideTo(newValue - 1, 100, false);
      this.slideSegments();
    },
  },
  computed: mapState(["currentGameday"]),
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
