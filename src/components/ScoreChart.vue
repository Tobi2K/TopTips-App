<template>
  <div style="overflow: scroll">
    <div style="min-width: 1000px;">
    <Line
      v-if="loaded"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { IonButton, IonRow, IonCol, IonIcon } from "@ionic/vue";

import { arrowBack, arrowForward, todayOutline } from "ionicons/icons";

import { mapState } from "vuex";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default defineComponent({
  name: "ScoreChart",
  components: {
    IonButton,
    IonRow,
    IonCol,
    IonIcon,
    Line,
  },
  data() {
    return {
      loaded: false,
      chartData: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true
      },
    };
  },
  emits: ["done"],
  methods: {
    generateDistinctColors(count: number): string[] {
      // For small sets, return a predefined palette of highly distinguishable colors
      if (count <= 10) {
        // Carefully selected palette for maximum distinction
        const distinctPalette = [
          "#e6194B", // Red
          "#3cb44b", // Green
          "#4363d8", // Blue
          "#f58231", // Orange
          "#911eb4", // Purple
          "#42d4f4", // Cyan
          "#f032e6", // Magenta
          "#bfef45", // Lime
          "#fabed4", // Pink
          "#469990", // Teal
        ];
        return distinctPalette.slice(0, count);
      }

      // For larger sets, generate evenly spaced colors around the HSL color wheel
      const colors: string[] = [];
      const saturation = 0.75; // High saturation for vibrant colors
      const lightness = 0.5; // Medium lightness for good contrast

      for (let i = 0; i < count; i++) {
        // Distribute hues evenly around the color wheel
        const hue = i * (360 / count);

        // Convert HSL to RGB
        const h = hue / 360;
        const rgb = this.hslToRgb(h, saturation, lightness);

        // Convert RGB to hex
        const hexColor =
          "#" +
          ((1 << 24) | (rgb[0] << 16) | (rgb[1] << 8) | rgb[2])
            .toString(16)
            .slice(1);

        colors.push(hexColor);
      }

      return colors;
    },
    hslToRgb(h: number, s: number, l: number): [number, number, number] {
      let r: number, g: number, b: number;

      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p: number, q: number, t: number): number => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },
    loadData() {
      this.loaded = false;
      const data = {
        labels: this.pointsForGroup[0].slice(2),
        datasets: [] as any[],
      };
      const colors = this.generateDistinctColors(this.pointsForGroup.length - 1);
      for (let i = 0; i < this.pointsForGroup.length; i++) {
        const element = this.pointsForGroup[i];
        if (i == 0) {
          continue;
        }
        const splicedArray = element.slice(2);

        const result: number[] = new Array(splicedArray.length);
        result[0] = splicedArray[0]; // First element stays the same

        // Calculate cumulative sum
        for (let j = 1; j < splicedArray.length; j++) {
          result[j] = result[j - 1] + splicedArray[j];
        }
        data.datasets.push({
          label: element[0],
          data: result,
          borderColor: colors[i - 1],
          backgroundColor: colors[i - 1],
        });
      }

      this.chartData = data;
      this.loaded = true;
    }
  },
  mounted() {
    this.loadData();
  },
  computed: mapState(["pointsForGroup", "groupData"]),
  watch: {
    pointsForGroup() {
      this.loadData();
    },
  },
});
</script>

<style scoped>
table {
  font-size: 120%;
}

th,
td {
  text-align: center;
  width: auto;
  white-space: nowrap;
  padding: 5px 15px;
}

.mt {
  margin-top: 10%;
}

.coolTable tr:nth-child(even) {
  background-color: rgba(120, 120, 120, 0.3);
  white-space: no-wrap;
}

.colNoPaddingLeft {
  --ion-grid-column-padding: 0;
}

.colNoPaddingRight {
  --ion-grid-column-padding: 0;
}
</style>
