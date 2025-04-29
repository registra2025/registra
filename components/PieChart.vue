<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  chartData: { type: Object, required: true }
})

const canvas = ref(null)
let chartInstance = null

onMounted(() => {
  if (!canvas.value) return
  chartInstance = new Chart(canvas.value.getContext('2d'), {
    type: 'pie',
    data: props.chartData,
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  })
})

// Watch for data changes and update chart
watch(() => props.chartData, (newData) => {
  if (chartInstance) {
    chartInstance.data = newData
    chartInstance.update()
  }
}, { deep: true })
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;
}
</style>
