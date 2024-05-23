<script setup>
import { ref } from 'vue';
import BasicSidebar from '@/components/SideBar/BasicSidebar.vue';
import Map from '@/components/Map.vue';
import DetailSidebar from '@/components/SideBar/DetailSidebar.vue';

import MapTest from '@/components/MapTest.vue';
const searchResults = ref([]); // 검색 결과 상태 관리

const handleSearchResults = (results) => {
  searchResults.value = results;
};
</script>

<template>
  <div id="app">
    <div class="main-content">
      <!-- <BasicSidebar /> -->
      <DetailSidebar @search-results="handleSearchResults"/>
      <Map :aptList="searchResults" />
      <!-- <MapTest/> -->
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
