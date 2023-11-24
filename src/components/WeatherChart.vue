<template>
  <div class="chart-container">
    <canvas :id="id"></canvas>
    <loader-spinner v-if="props.isLoading" />
  </div>
</template>

<script setup>
import Chart from 'chart.js/auto';
import { defineProps, watch, ref, onMounted, onUnmounted } from 'vue';
import LoaderSpinner from '@/components/LoaderSpinner';

const props = defineProps(['data', 'isLoading']);
const id = String(new Date().getTime());
let chart;

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  recreateChart();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

watch(() => props.data, () => {
  recreateChart();
});

const recreateChart = () => {
  if (!chart) {
    createChart();
  } else {
    chart.destroy();
    createChart();
  }
};

const createChart = () => {
  chart = new Chart(
    document.getElementById(id),
    {
      type: 'line',
      data: {
        labels: props.data.labels,
        datasets: [
          {
            label: props.data.title,
            data: props.data.data,
            fill: false,
            borderColor: '#4fade1',
            tension: 0.1
          }
        ]
      }
    }
  );
};

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">
.chart-container {
  position: relative;
  width: 80%;
  margin: 15px auto;

  @media only screen and (max-width: 480px) {
    width: 100%;
  }
}

</style>