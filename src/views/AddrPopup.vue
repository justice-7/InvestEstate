<template>
  <div class="search-popup">
    <h2>주소 검색</h2>
    <div class="search-bar">
      <input type="text" placeholder="예) 판교역로 166, 분당 주공, 백현동 532" v-model="searchQuery">
      <button @click="performSearch">검색</button>
    </div>
    <div class="search-results" v-if="searchResults.length">
      <p>검색 결과:</p>
      <ul>
        <li v-for="(result, index) in searchResults" :key="index" @click="selectAddress(result)">
          <div class="result-item">
            <span class="postal-code">({{ result.jibun }}) </span>
            <div class="address-info">
              <p class="address"> {{ result.name }}</p>
              <p class="extra-info">{{ result.sidoName }} {{ result.gugunName }} {{ result.dongName }}</p>
            </div>
            <div class="view-links">
              <a href="#" @click.stop>영문보기</a>
              <a href="#" @click.stop>지도</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '../axios';

const searchQuery = ref('');
const searchResults = ref([]);

const performSearch = async () => {
  try {
    const response = await axios.get('/api/address/search', {
      params: { query: searchQuery.value },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    searchResults.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
};

const selectAddress = (result) => {
  console.log(result);
  const fullAddress = `${result.sidoName} ${result.gugunName} ${result.dongName} (${result.jibun}) ${result.name}`;
  window.opener.postMessage({ aptId: result.aptId, address: fullAddress }, '*');
  window.close();
};
</script>

<style scoped>
.search-popup {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #45a049;
}

.search-results {
  margin-top: 20px;
}

.search-results ul {
  list-style: none;
  padding: 0;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
}

.result-item:hover {
  background-color: #f0f0f0;
}

.address-info {
  flex-grow: 1;
}

.address {
  font-size: 16px;
  margin: 0;
}

.extra-info {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.view-links a {
  margin-left: 10px;
  color: #4caf50;
  text-decoration: none;
}

.view-links a:hover {
  text-decoration: underline;
}
</style>
