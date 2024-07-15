import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import NutUIResolver from '@nutui/auto-import-resolver'
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import requireTransform from 'vite-plugin-require-transform';
import path from 'path'
const alias: Record<string, string> = {
  '@': path.resolve(__dirname, 'src'),
  'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
  '@components': path.resolve(__dirname, 'src/components'),
  '#': path.resolve(__dirname, './'),
};
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag === "iconpark-icon",
        },
      },
    }),
    Components({
      resolvers: [NutUIResolver()],
    }),
    requireTransform({
      fileRegex: /.ts$|.vue$/,
    }),
    vueSetupExtend()
  ],
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       /**如果引入多个文件，可以使用
  //      * '@import "@/assets/scss/globalVariable1.scss";
  //      * @import"@/assets/scss/globalVariable2.scss";'
  //     **/
  //       javascriptEnabled: true,
  //       additionalData: '@import "@/assets/resetStyle.scss";',
  //     }
  //   }
  // },
  resolve: { alias },
  server: {
    host: '0.0.0.0',
    port: 3000,

  },
  build: {
    outDir: 'dist', // 修改输出文件夹名称
    chunkSizeWarningLimit: 1000,
    rollupOptions: {  // 将资源分类到各自文件夹
      output: {
        chunkFileNames: 'resource/js/[name]-[hash].js',
        entryFileNames: 'resource/js/[name]-[hash].js',
        assetFileNames: 'resource/[ext]/[name]-[hash].[ext]',
        compact: true,
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
    target: 'esnext',
    minify: 'terser',
    // cssCodeSplit: true, // 启用 CSS 代码拆分
    // sourcemap: true, // 构建后是否生成 source map 文件
    terserOptions: { //去除console和debugger
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
