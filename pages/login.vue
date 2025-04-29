<template>
    <main class="flex items-center justify-center min-h-full w-full rounded-xl bg-gray-100 p-4">
        <div class="w-full max-w-md bg-[#dcf0fd] shadow-lg rounded-xl p-8">
            <h2 class="text-2xl font-bold text-blue-950 text-center mb-6">LOGIN / SIGNUP</h2>
            
            <label class="block text-gray-700">User ID</label>
            <input v-model="email" type="text" placeholder="Enter your email"
            class="w-full p-3 mt-1 rounded-md border text-black border-gray-300 bg-[#dcf0fd] focus:outline-none focus:border-[#1c4375]">
            
            <label class="block text-gray-700 mt-4">Password</label>
            <input v-model="password" type="password" placeholder="Enter your password"
            class="w-full p-3 mt-1 rounded-md border text-black border-gray-300 bg-[#dcf0fd] focus:outline-none focus:border-[#1c4375]">
            
            <!-- Buttons -->
            <button @click="login" class="w-full bg-[#2170d4] text-white p-3 mt-4 rounded-md hover:opacity-80">LOGIN</button>
            <!-- <button @click="signUp" class="w-full bg-[#2170d4] text-white p-3 mt-2 rounded-md hover:opacity-80">SIGN UP</button> -->
            <button @click="googleSignIn" class="w-full bg-red-500 text-white p-3 mt-2 rounded-md hover:opacity-80">SIGN IN WITH GOOGLE</button>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { userStore } from '@/stores/userStore'; // Import the userStore

const email = ref("");
const password = ref("");
const { $auth } = useNuxtApp();
const router = useRouter();

const login = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword($auth, email.value, password.value);
        const user = userCredential.user;
        
        if (user.email === "admin@registra.com") {
            router.push("/dashboard-admin");
        } else {
            router.push("/dashboard");
        }
    } catch (error) {
        alert(error.message);
    }
};

const signUp = async () => {
    try {
        await createUserWithEmailAndPassword($auth, email.value, password.value);
        alert("Account created successfully!");
        router.push("/dashboard");
    } catch (error) {
        alert(error.message);
    }
};

const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup($auth, provider);
        alert("Logged in with Google!");
        router.push("/dashboard");
    } catch (error) {
        console.error('Firebase error:', error);
        alert(error.message);
    }
};
</script>
