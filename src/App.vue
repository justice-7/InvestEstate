<template>
  <div id="app">
    <Header/>
    <router-view />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';

</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
}
</style>
