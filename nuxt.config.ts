// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 开启 ssr
  ssr: false,

  // 模块
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  // UI 配置
  ui: {
    global: true,
    icons: ['mdi']
  },

  // 应用配置
  app: {
    head: {
      title: 'ER图生成器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // 开发工具
  devtools: { enabled: false },

  // nitro 配置
  nitro: {
    typescript: {
      strict: true
    }
  },

  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: false
  },

  compatibilityDate: '2025-01-09'
})