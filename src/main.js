import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import { useKakao } from 'vue3-kakao-maps';

const kakaoKey = import.meta.env.VITE_KAKAO_KEY;

useKakao(kakaoKey, ['clusterer', 'services', 'drawing']); // 각 라이브러리는 ',(콤마)'로 구분합니다.

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
