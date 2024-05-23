<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler, LineController, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler, LineController, TimeScale);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    required: true,
  },
});

const canvas = ref(null);

let chartInstance = null;

onMounted(() => {
  chartInstance = new ChartJS(canvas.value, {
    type: 'line',
    data: props.chartData,
    options: props.chartOptions,
  });
});

watch(() => props.chartData, (newData) => {
  if (chartInstance) {
    chartInstance.data = newData;
    chartInstance.update();
  }
});

watch(() => props.chartOptions, (newOptions) => {
  if (chartInstance) {
    chartInstance.options = newOptions;
    chartInstance.update();
  }
});
</script>

<style scoped>
canvas {
  width: 400px;
  height: 100%;
}
</style>
