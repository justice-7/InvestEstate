<script setup>
import { ref } from 'vue';
import Map from '@/components/Map.vue';
import DetailSidebar from '@/components/SideBar/DetailSidebar.vue';

const searchResults = ref([]); // 검색 결과 상태 관리
const selectedApt = ref(null); // 선택된 아파트 상태 관리

const handleSearchResults = (results) => {
  searchResults.value = results;
};

const handleSelectApt = (apt) => {
  console.log('Apt selected in MainView:', apt); // 선택된 아파트 로그 출력
  selectedApt.value = apt;
};
</script>

<template>
  <div id="app">
    <div class="main-content">
      <DetailSidebar @search-results="handleSearchResults" :selectedApt="selectedApt" />
      <Map :aptList="searchResults" @select-apt="handleSelectApt" />
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
