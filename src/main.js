import { createApp, h } from 'vue'
import App from './App.vue'
import VueGoogleMaps from '@fawmi/vue-google-maps';
import { createPinia } from "pinia";
import i18n from "@/i18n";

const pinia = createPinia();

const app = createApp({
  render: () => h(App),
  i18n
})
  .use(VueGoogleMaps, {
    load: {
      v: '3.53',
      key: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
      libraries: ['places']
    },
})
  .use(i18n());

app.use(pinia);
app.mount('#app');
