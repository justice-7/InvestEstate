import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';
import UsrMyPage from '@/views/UsrMypageView.vue';

const routes = [
  {
    path: '/',
    name: 'MainView',
    component: MainView
  },
  {
    path: '/mypage',
    name: 'UsrMyPage',
    component: UsrMyPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
