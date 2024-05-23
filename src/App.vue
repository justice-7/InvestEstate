<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import FloatingChat from './components/FloatingChat.vue';

const route = useRoute();
const showHeader = computed(() => route.name !== 'addressSearchPopup');
</script>

<template>
  <div id="app">
    <Header v-if="showHeader" />
    <main class="main-content">
      <router-view />
    </main>
    <FloatingChat />
  </div>
</template>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

.main-content {
  padding-top: 40px; /* Adjust this value based on the height of your header */
}
</style>