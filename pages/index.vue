<template>
  <div class="p-8 flex flex-col items-center text-center bg-white">
    <h1 class="text-4xl font-bold text-primary mb-4">Kareem Department Store</h1>
    <p class="text-lg text-gray-700 max-w-2xl mb-6">
      Since 1995, Kareem has been your premier destination for fashion, beauty, home goods, and electronics. Our curated selection and exceptional service make every shopping experience memorable.
    </p>
    <div class="flex gap-4">
      <NuxtLink to="/about" class="bg-primary text-black px-6 py-3 border border-primary rounded-lg text-lg transition hover:bg-blue-300 active:shadow-inner active:bg-blue-300">
        Learn More
      </NuxtLink>
      <NuxtLink to="/contact" class="text-primary px-6 py-3 border border-primary rounded-lg text-lg transition hover:bg-blue-300 active:shadow-inner active:bg-blue-300">
        Contact Us
      </NuxtLink>
    </div>
  </div>
</template>
