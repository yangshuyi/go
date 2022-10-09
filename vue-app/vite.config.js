import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: [{find: '@', replacement: resolve(__dirname, 'src')}],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: '";',
      },
    },
  },
  build:{
    outDir: '../www',
  },
  define: {
    'process.env': { name: '哈哈哈', age: 12 }
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8089/cst',
  //       changeOrigin: true,
  //       // rewrite: function(path) { path.replace(/^\/api/, '');}
  //     },
  //     '/logger': {
  //       target: 'https://aitest.cccdrp.cn/statistics-web',
  //       changeOrigin: true,
  //       rewrite: (path)=>path.replace("/logger", '')
  //     },
  //   },
  // }
});

//
// adb install .\platforms\android\app\build\outputs\apk\debug\app-debug.apk
