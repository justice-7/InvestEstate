import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useKakao } from 'vue3-kakao-maps/@utils';

import App from './App.vue'
import router from './router'

const {VITE_KAKAO_KEY} = import.meta.env;
useKakao(VITE_KAKAO_KEY);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
