// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
   //  ssr: true,
    modules: ['@pinia/nuxt'],
    compatibilityDate: '2024-11-01',
    vue: {
      compilerOptions: {
        isCustomElement: tag => tag === 'marquee'
      }
    },
    devtools: { enabled: true },
    // pages: false,
    css: ['@/assets/css/main.css'],
    app: {
      head: {
        link: [
          { rel: 'icon', type: 'image/png', href: '/registra_logo_rm.png' }
        ]
      }
    },
    vite: {
        plugins: [
            tailwindcss(),
        ]
    },
    // ssr: false
});
