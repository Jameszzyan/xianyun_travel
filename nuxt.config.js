import pkg from './package'

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: "闲云旅游网", // 修改title
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_1168872_ehvuah8v57g.css'}, // 新增全局字体样式
      {rel:"stylesheet",type:'text/css', href:"https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css"}
    ],
    script:[
      {src:"https://webapi.amap.com/maps?v=1.4.15&key=31b1cb9437f926245afa7b9db5800e88"}
    ],
  },

  

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'assets/main.css', // 新增自定义的页面过渡样式（文件来自3.4.1）
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios',
    { src: '@/plugins/localStorage', ssr: false },
    {
      src: '~/plugins/vue-quill-editor',
      ssr: false
    }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // https://axios.nuxtjs.org/setup
    '@nuxtjs/axios'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // baseURL: "http://157.122.54.189:9095" // 新增备用地址
    baseURL: "http://157.122.54.189:9095" // 新增axios默认请求路径 		  
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/]
  },
  router:{
    middleware:'routeMiddleware'
  }
}