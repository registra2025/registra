<template>
    <aside v-show="isSidebarOpen" class="w-full h-full">
        <!-- Sidebar Content Wrapper (scrollable) -->
        <div class="flex flex-col items-center px-6 py-4 h-fit">
            <NuxtLink to="/dashboard-admin" class="flex justify-center">
                <img src="/reg_logo_rm.png" alt="Logo" class="w-[200px] h-[200px] object-contain max-w-full max-h-full md:w-[270px] md:h-[200px] sm:w-[120px] sm:h-[120px]"/>
            </NuxtLink>
            <!-- Navigation Links -->
            <div class="flex flex-col gap-2 w-full overflow-y-auto mt-2">
                <NuxtLink to="/dashboard-admin" class="min-h-[49px] bg-[#c0e6fd] rounded-[7px] flex items-center text-blue-950 pl-4 text-xl sm:text-2xl md:text-2xl font-normal hover:bg-[#95d7fb] active:bg-[#95d7fb]">
                    DASHBOARD
                </NuxtLink>
                <NuxtLink to="/inventory" class="min-h-[49px] bg-[#c0e6fd] rounded-[7px] flex items-center pl-4 text-blue-950 text-xl sm:text-2xl md:text-2xl font-normal hover:bg-[#95d7fb] active:bg-[#95d7fb]">
                    INVENTORY
                </NuxtLink>
                <NuxtLink to="/stock-record" class="min-h-[49px] bg-[#c0e6fd] rounded-[7px] flex items-center pl-4 text-blue-950 text-xl sm:text-2xl md:text-2xl font-normal hover:bg-[#95d7fb] active:bg-[#95d7fb]">
                    STOCK RECORD
                </NuxtLink>
                <NuxtLink to="/performance" class="min-h-[49px] bg-[#c0e6fd] rounded-[7px] flex items-center pl-4 text-blue-950 text-xl sm:text-2xl md:text-2xl font-normal hover:bg-[#95d7fb] active:bg-[#95d7fb]">
                    PERFORMANCE
                </NuxtLink>
                <!-- <NuxtLink to="/sales-receipt" class="min-h-[49px] bg-[#c0e6fd] rounded-[7px] flex items-center pl-4 text-blue-950 text-xl sm:text-2xl md:text-2xl font-normal hover:bg-[#95d7fb] active:bg-[#95d7fb]">
                    SALES RECEIPTS
                </NuxtLink> -->
                <NuxtLink to="/customer-sales" class="min-h-[49px] bg-[#c0e6fd] rounded-[7px] flex items-center pl-4 text-blue-950 text-xl sm:text-2xl md:text-2xl font-normal hover:bg-[#95d7fb] active:bg-[#95d7fb]">
                    CUSTOMER SALES
                </NuxtLink>
                <NuxtLink to="/customer-receipts" class="min-h-[49px] bg-[#c0e6fd] rounded-[7px] flex items-center pl-4 text-blue-950 text-xl sm:text-2xl md:text-2xl font-normal hover:bg-[#95d7fb] active:bg-[#95d7fb]">
                    CUSTOMER RECEIPTS
                </NuxtLink>
            </div>
        </div>
    </aside>
</template>

<script setup>
defineProps(["isSidebarOpen"]);
</script>
