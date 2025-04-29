<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

// Hide legend for BarChart
Chart.defaults.plugins.legend.display = false
Chart.register(...registerables)

const props = defineProps({
  chartData: { type: Object, required: true }
})

const canvas = ref(null)
let chartInstance = null

onMounted(() => {
  if (!canvas.value) return
  chartInstance = new Chart(canvas.value.getContext('2d'), {
    type: 'bar',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { display: false } },
        y: { beginAtZero: true }
      },
      plugins: { legend: { display: false } }
    }
  })
})

// Watch for data changes
watch(() => props.chartData, (newData) => {
  if (chartInstance) {
    chartInstance.data.labels = newData.labels
    chartInstance.data.datasets = newData.datasets
    chartInstance.update()
  }
}, { deep: true })
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;}
</style>
