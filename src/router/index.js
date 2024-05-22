import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';
import UsrMyPage from '@/views/UsrMypageView.vue';
import ReaMyPage from '@/views/ReaMypageView.vue';
import AllItemView from '@/views/AllItemView.vue';
import AddressSearchPopup from '@/views/AddrPopup.vue'; // Ensure this path is correct

const routes = [
  {
    path: '/',
    name: 'mainView',
    component: MainView
  },
  {
    path: '/usrMypage',
    name: 'usrMyPage',
    component: UsrMyPage
  },
  {
    path: '/reaMypage',
    name: 'reaMyPage',
    component: ReaMyPage
  },
  {
    path: '/allItem/:items',
    name: 'allItem',
    component: AllItemView,
    props: route => ({ items: route.params.items })
  },
  {
    path: '/address-search-popup',
    name: 'addressSearchPopup',
    component: AddressSearchPopup
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
