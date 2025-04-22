<template>
    <div class="flex flex-col items-center justify-center text-center p-8">
      <h1 class="text-4xl font-bold text-[#2170d4] mb-4">Welcome to REGISTRA POS System</h1>
      <p class="text-lg text-gray-700 max-w-2xl">
        Managing your business transactions and inventory has never been easier! Our POS system helps you streamline operations,
        track inventory in real-time, and improve customer service.
      </p>
  
      <div class="flex gap-4 mt-6">
        <NuxtLink to="/about" class="bg-[#2170d4] text-white px-6 py-3 rounded-lg text-lg">
          Learn More
        </NuxtLink>
        <NuxtLink to="/login" class="border border-[#2170d4] text-[#2170d4] px-6 py-3 rounded-lg text-lg">
          Get Started
        </NuxtLink>
      </div>
  
      <div class="mt-10 max-w-4xl">
        <h2 class="text-2xl font-semibold text-[#2170d4] mb-3">Why Choose a POS System?</h2>
        <p class="text-gray-700 text-md mb-4">
          A POS (Point of Sale) system enhances business efficiency by:
        </p>
        <ul class="text-gray-700 text-left list-disc list-inside">
          <li>Tracking inventory in real-time, reducing stock shortages</li>
          <li>Automating sales transactions and improving accuracy</li>
          <li>Generating insightful reports to help you make data-driven decisions</li>
          <li>Improving customer experience with faster checkout processes</li>
        </ul>
      </div>
    </div>
  </template>
  