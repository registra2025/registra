<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useRouter } from '#app';

const router = useRouter();
const videoRef = ref(null);
const barcode = ref('');
const isCameraActive = ref(false);
let codeReader = null;
let videoStream = null;
let beepSound = null;

// Only initialize the beep sound on the client-side
onMounted(() => {
  if (process.client) {
    beepSound = new Audio('/beep.mp3');
  }
});

// Start Camera & Scanner
const startCamera = async () => {
  if (!isCameraActive.value) {
    isCameraActive.value = true;
    codeReader = new BrowserMultiFormatReader();

    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.value.srcObject = videoStream;

      codeReader.decodeFromVideoDevice(null, videoRef.value, (result, err) => {
        if (result) {
          barcode.value = result.text;
          if (beepSound) {
            beepSound.play().catch(error => console.error("Beep sound error:", error));
          }
          // Navigate to items page with the scanned barcode
          router.push(`/products/itemsad?barcode=${barcode.value}`);
          stopCamera();
        }
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      isCameraActive.value = false;
    }
  }
};

// Stop Camera & Scanner
const stopCamera = () => {
  if (isCameraActive.value) {
    isCameraActive.value = false;
    if (codeReader) {
      codeReader.reset();
      codeReader = null;
    }
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      videoStream = null;
    }
    if (videoRef.value) {
      videoRef.value.srcObject = null;
    }
  }
};

// Toggle Camera On/Off
const toggleCamera = () => {
  if (isCameraActive.value) {
    stopCamera();
  } else {
    startCamera();
  }
};

// Manual barcode submission
const submitBarcode = () => {
  if (barcode.value) {
    router.push(`/products/itemsad?barcode=${barcode.value}`);
  }
};

// Cleanup on page exit
onUnmounted(() => {
  stopCamera();
});
</script>

<template>
  <div class="flex flex-col items-center justify-center max-h-screen p-4">
    <h1 class="text-2xl font-bold text-blue-950 mb-4">Scan Product Barcode</h1>

    <!-- Video Stream -->
    <video ref="videoRef" class="border w-full max-w-md" v-show="isCameraActive"></video>

    <!-- Editable Barcode Input -->
    <div class="mt-4 w-full max-w-md">
      <label class="block text-[#2170d4] text-lg font-semibold mb-1">Scanned Code:</label>
      <div class="flex gap-2">
        <input 
          type="text" 
          v-model="barcode" 
          class="w-full px-4 py-2  border rounded-lg text-lg"
        />
        <!-- <button 
          @click="submitBarcode"
          class="px-4 py-2 bg-[#2966b1] text-white rounded-lg hover:bg-[#1e4c8a]"
        >
          Submit
        </button> -->
      </div>
    </div>

    <!-- Start/Stop Button -->
    <button @click="toggleCamera" class="mt-4 px-6 py-3 bg-[#2170d4] text-white rounded-lg hover:bg-blue-400">
      {{ isCameraActive ? 'Stop Camera' : 'Start Camera' }}
    </button>
  </div>
</template>
