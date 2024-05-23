<template>
  <div>
    <LineChart :chartData="chartData" :chartOptions="chartOptions" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import LineChart from './LineChart.vue';

const props = defineProps({
  deals: {
    type: Array,
    required: true
  }
});

const sortedDeals = computed(() => {
  return props.deals.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
});

const chartData = ref({
  labels: sortedDeals.value.map(deal => new Date(deal.date)),
  datasets: [{
    label: 'Price',
    data: sortedDeals.value.map(deal => parseFloat(deal.price.replace(/[^0-9.-]+/g, ""))),
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
  const sortedDeals = newDeals.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  chartData.value.labels = sortedDeals.map(deal => new Date(deal.date));
  chartData.value.datasets[0].data = sortedDeals.map(deal => parseFloat(deal.price.replace(/[^0-9.-]+/g, "")));
});
</script>

<style scoped>
div {
  width: 100%;
}
</style>
