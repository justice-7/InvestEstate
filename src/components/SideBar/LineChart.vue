<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

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
  width: 100%;
  height: 100%;
}
</style>
