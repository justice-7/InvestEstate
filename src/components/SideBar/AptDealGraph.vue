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
  labels: props.deals.map(deal => new Date(deal.date)),
  datasets: [{
    label: 'Price',
    data: props.deals.map(deal => parseFloat(deal.price.replace(/[^0-9.-]+/g, ""))),
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    fill: false, // 선만 보이도록 설정
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
      type: 'time', // 시간 축으로 설정
      time: {
        unit: 'day', // 단위 설정
        tooltipFormat: 'yyyy-MM-dd',
        displayFormats: {
          day: 'yyyy-MM-dd' // 일 단위로 표시
        }
      },
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
  chartData.value.labels = newDeals.map(deal => new Date(deal.date));
  chartData.value.datasets[0].data = newDeals.map(deal => parseFloat(deal.price.replace(/[^0-9.-]+/g, "")));
});
</script>

<style scoped>
div {
  width: 100%;
}
</style>
