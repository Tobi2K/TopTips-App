<template>
  <div class="ion-text-center">
    <ion-button
      fill="outline"
      @click="flipPlacements()"
      size="small"
      color="medium"
    >
      <ion-icon
        v-if="!showPlacements"
        slot="start"
        :icon="trophyOutline"
      ></ion-icon>
      <div v-if="!showPlacements">Show Placements</div>
      <ion-icon
        v-if="showPlacements"
        slot="start"
        :icon="statsChartOutline"
      ></ion-icon>
      <div v-if="showPlacements">Show Score</div>
    </ion-button>
  </div>
  <div style="overflow: scroll">
    <div style="min-width: 1000px" v-if="loaded">
      <Line
        v-if="!showPlacements"
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
      />
      <Line
        v-else
        id="my-chart-id"
        :options="chartOptionsPlacement"
        :data="chartDataPlacement"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { IonButton, IonIcon } from "@ionic/vue";

import { statsChartOutline, trophyOutline } from "ionicons/icons";

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
  Legend,
);

export default defineComponent({
  name: "ScoreChart",
  components: {
    IonButton,
    IonIcon,
    Line,
  },
  setup() {
    return {
      statsChartOutline,
      trophyOutline,
    };
  },
  data() {
    return {
      loaded: false,
      showPlacements: false,
      chartData: {},
      chartDataPlacement: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
      },
      chartOptionsPlacement: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            reverse: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
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
      let r: number;
      let g: number; 
      let b: number;

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
    findLastNonZeroIndex(list: any[]): number {
      list = list.slice(2);
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] !== 0) {
          return i;
        }
      }
      return list.length; // No non-zero value found
    },
    flipPlacements() {
      this.showPlacements = !this.showPlacements;
    },
    convertScoresToPlacements(scores: number[][]): number[][] {
      const numColumns = scores[0].length;
      const placements: number[][] = scores.map(() => []);

      // For each column (gameday)
      for (let col = 0; col < numColumns; col++) {
        // Get all scores for this column with their row indices
        const columnScores = scores.map((row, idx) => ({
          score: row[col],
          rowIndex: idx,
        }));

        // Sort by score descending (highest score = 1st place)
        columnScores.sort((a, b) => b.score - a.score);

        // Assign placements with tie handling
        let currentPlacement = 1;
        for (let i = 0; i < columnScores.length; i++) {
          const item = columnScores[i];

          // Check if this score ties with the previous one
          if (i > 0 && columnScores[i - 1].score === item.score) {
            // Same placement as previous
            placements[item.rowIndex][col] =
              placements[columnScores[i - 1].rowIndex][col];
          } else {
            // New placement
            placements[item.rowIndex][col] = currentPlacement;
          }

          currentPlacement++;
        }
      }

      return placements;
    },
    getPlacements(datasets: any[]) {
      const labels = datasets.map((dataset) => dataset.label);
      const borderColors = datasets.map((dataset) => dataset.borderColor);
      const backgroundColors = datasets.map(
        (dataset) => dataset.backgroundColor,
      );
      const scoreData = datasets.map((dataset) => dataset.data);

      const placementData = this.convertScoresToPlacements(scoreData);

      const datasetsConverted = placementData.map((data, index) => ({
        label: labels[index],
        data: data,
        borderColor: borderColors[index],
        backgroundColor: backgroundColors[index],
      }));

      return datasetsConverted;
    },
    loadData() {
      this.loaded = false;
      const firstNonZero = this.pointsForGroup
        .slice(1)
        .map(this.findLastNonZeroIndex);
      let end = this.pointsForGroup[0].length;

      if (!firstNonZero.includes(-1)) {
        end = Math.max(...firstNonZero) + 3; // +3 to account for slicing and zero-based index
      }
      const data = {
        labels: this.pointsForGroup[0].slice(2, end),
        datasets: [] as any[],
      };
      const colors = this.generateDistinctColors(
        this.pointsForGroup.length - 1,
      );
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

      const otherDatasets = this.getPlacements(data.datasets);

      const dataPlacements = {
        labels: data.labels,
        datasets: otherDatasets,
      };

      this.chartDataPlacement = dataPlacements;
      this.chartData = data;
      this.loaded = true;
    },
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
