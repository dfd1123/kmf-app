import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
import react from 'vite-preset-react';
import VitePluginHtmlEnv from 'vite-plugin-html-env';

const dotenv = require('dotenv');
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({ removeDevtoolsInProd: true, injectReact: true }),
    VitePluginHtmlEnv(),
  ],
  define: {
    'process.env': dotenv.config().parsed,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
