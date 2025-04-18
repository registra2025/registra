<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
        {{ error?.statusCode === 403 ? '403' : error?.statusCode || 'Error' }}
      </h1>
      <h2 class="text-xl text-gray-700 dark:text-gray-300 mb-6">
        {{ error?.statusCode === 403 ? 'Access Denied' : error?.message || 'An error occurred' }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ error?.statusCode === 403 
          ? 'Please log in to access this page.' 
          : 'Something went wrong. Please try again.' }}
      </p>
      <div class="space-x-4">
        <button 
          @click="handleError" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          {{ error?.statusCode === 403 ? 'Login' : 'Try Again' }}
        </button>
        <button 
          @click="navigateTo('/')" 
          class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
          Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const error = useError()

const handleError = () => {
  if (error.value?.statusCode === 403) {
    navigateTo('/login', { 
      query: { redirect: error.value?.data?.path || '/dashboard' }
    })
  } else {
    clearError()
  }
}
</script>
