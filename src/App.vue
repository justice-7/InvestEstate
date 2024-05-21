<script setup>
import Header from './components/Header.vue';
</script>

<template>
  <div id="app">
    <Header/>
    <main class="main-content">
      <router-view />
    </main>
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
