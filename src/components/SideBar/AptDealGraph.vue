<template>
  <div>
    <LineChart :chartData="chartData" :chartOptions="chartOptions" />
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';
import LineChart from './LineChart.vue';

const props = defineProps({
  deals: {
    type: Array,
    required: true
  }
});

const chartData = ref({
  labels: props.deals.map(deal => deal.date),
  datasets: [{
    label: 'Price',
    data: props.deals.map(deal => deal.price),
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    fill: true,
  }]
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  hover: {
    mode: 'nearest',
    intersect: true,
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Date',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Price',
      },
    },
  },
});

watch(() => props.deals, (newDeals) => {
  chartData.value.labels = newDeals.map(deal => deal.date);
  chartData.value.datasets[0].data = newDeals.map(deal => deal.price);
});
</script>

<style scoped>
div {
  width: 400px;
 
}
</style>
