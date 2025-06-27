// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:true,
  components:true,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules:['@nuxtjs/tailwindcss','@nuxt/icon'],
  build: {
    transpile: ['@nuxt/icon']
  },
  
})