<script setup>
import BasicSidebar from '@/components/SideBar/BasicSidebar.vue';
import MapComponent from '@/components/Map.vue';
import DetailSidebar from '@/components/SideBar/DetailSidebar.vue';
</script>

<template>
  <div id="app">
    <div class="main-content">
      <!-- <BasicSidebar /> -->
      <DetailSidebar/>
      <MapComponent />
    </div>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  border-right: 1px solid #ddd;
}

.map {
  flex: 1;
  background-color: #e5e5e5;
  /* Use actual map styles in your implementation */
}
</style>
