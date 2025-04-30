<template>
    <div class="flex flex-col items-center justify-center max-h-screen p-4">        
        <!-- Video Stream -->
        <video ref="videoRef" class="border rounded-xl w-80 max-w-md" v-show="isCameraActive"></video>
        
        <!-- Start/Stop Button -->
        <button 
        @click="toggleCamera"
        class="mt-4 px-6 py-3 rounded-lg text-lg font-semibold transition"
        :class="isCameraActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'"
        >
        {{ isCameraActive ? 'Stop' : 'Scan' }}
    </button>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted} from 'vue';
import { BrowserMultiFormatReader } from '@zxing/browser';

const emit = defineEmits();

const videoRef = ref(null);
const barcode = ref('');
const isCameraActive = ref(false);
let codeReader = null;
let videoStream = null;
let beepSound = null;

// Only initialize the beep sound on the client-side
onMounted(() => {
    if (process.client) {
        beepSound = new Audio('/beep.mp3'); // Ensure beep.mp3 is in the /public folder
    }
});

// Start Camera & Scanner
const startCamera = async () => {
    if (!isCameraActive.value) {
        isCameraActive.value = true;
        codeReader = new BrowserMultiFormatReader();
        
        try {
            // Requesting user media for the camera
            videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.value.srcObject = videoStream;
            
            // Start barcode scanning
            codeReader.decodeFromVideoDevice(null, videoRef.value, (result, err) => {
                if (result) {
                    barcode.value = result.text;
                    console.log('Barcode:', result.text);
                    emit('scanBarcode', barcode.value);  // Emit the barcode to the parent
                    if (beepSound) {
                        beepSound.play().catch(error => console.error("Beep sound error:", error));
                    }
                    
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
    console.log("Stopping camera...");
    
    if (isCameraActive.value) {
        // Stop the video stream and reset everything
        isCameraActive.value = false;
        
        // Stop the barcode scanner
        if (codeReader) {
            codeReader.reset(); // Make sure the codeReader is reset properly
            codeReader = null;
        }
        
        // Stop all video tracks (camera streams)
        if (videoStream) {
            videoStream.getTracks().forEach(track => {
                console.log("Stopping track:", track);
                track.stop(); // Stop individual tracks to release camera
            });
            videoStream = null;
        }
        
        // Ensure to clear video reference to fully stop the video display
        if (videoRef.value) {
            videoRef.value.srcObject = null;
        }
        
        // Release the media devices explicitly (important for Firefox)
        navigator.mediaDevices.enumerateDevices().then(devices => {
            devices.forEach(device => {
                if (device.kind === 'videoinput') {
                    console.log("Releasing device:", device);
                    // You can call any additional cleanup here if necessary
                }
            });
        });
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

// Cleanup on page exit
onUnmounted(() => {
    stopCamera();
});
</script>
