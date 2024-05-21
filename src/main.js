import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useKakao } from 'vue3-kakao-maps/@utils';

import App from './App.vue'
import router from './router'

useKakao('81509deb9bdfe01adf622e3554b1fcfe');

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
