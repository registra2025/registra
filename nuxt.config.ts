// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
   //  ssr: true,
    modules: ['@pinia/nuxt'],
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    // pages: false,
    css: ['@/assets/css/main.css'],
    vite: {
        plugins: [
            tailwindcss(),
        ]
    },
    // components: true,
    // ssr: false
//     postcss: {
//         plugins: {
//             tailwindcss: {},
//             autoprefixer: {},
//         },
//   },
});
