<template>
  <div class="chart-wrapper">
    <div class="bar-wrapper">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
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
.chart-wrapper {
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}
.bar-wrapper {
  width: 100%;
  height: 220px;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
