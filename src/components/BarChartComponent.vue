<template>
  <div id="barchart">
    <BarChart :height="350" :width="300" :options="chartOptions" :chartData="chartData"/>
  </div>
</template>
<style scoped>
#barchart {
  padding: 1rem;
}
</style>

<script setup>
import {computed} from "vue";
import {BarChart} from 'vue-chart-3';
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  data: Array
})

const chartOptions = {
  scales: {
    y: {
      max: 8000,
    }
  }
}

const chartData = computed(() => ({
  labels: ['F1', 'F2', 'F3'],
  datasets: [
    {
      label: 'Assorbimento fasi',
      barThickness: 10,
      data: props.data,
      backgroundColor: ['#fff477', '#fff477', '#fff477'],
    },
  ],
}))


</script>
