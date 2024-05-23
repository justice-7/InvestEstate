<script setup>
import { ref } from 'vue';
import axios from '../../axios';
import AptDealGraph from './AptDealGraph.vue';

const showFilters = ref(false);
const selectedArea = ref(null);
const selectedType = ref([]);
const searchText = ref("");
const searchResults = ref([]);
const selectedDeal = ref(null);
const relatedDeals = ref([]);
const inquiryMessage = ref("");
const isFavorite = ref(false);
const emit = defineEmits(['search-results']);

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function selectArea(area) {
  selectedArea.value = area;
}

function toggleType(type) {
  const index = selectedType.value.indexOf(type);
  if (index >= 0) {
    selectedType.value.splice(index, 1);
  } else {
    selectedType.value.push(type);
  }
}

function resetFilters() {
  selectedArea.value = null;
  selectedType.value = [];
  searchText.value = "";
  searchResults.value = [];
}

async function searchAptDeals() {
  try {
    const response = await axios.get('/api/apt-deal/search', {
      params: {
        searchText: searchText.value,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    searchResults.value = response.data;
    console.log("조회 데이터", response.data);
    
    emit('search-results', response.data); // 이벤트 발생
  } catch (error) {
    console.error("There was an error searching the apartment deals!", error);
  }
}

async function fetchRelatedDeals(aptId) {
  try {
    const response = await axios.get(`/api/apt-deal/related/${aptId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    relatedDeals.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error("There was an error fetching related deals!", error);
  }
}

function selectDeal(deal) {
  selectedDeal.value = deal;
  fetchRelatedDeals(deal.aptId);
  checkIfFavorite(deal.aptDealId);
}

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

async function addFavorite(aptDealId) {
  try {
    await axios.post(`/api/favorites/${aptDealId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    isFavorite.value = true;
    alert("매물 찜이 완료되었습니다.");
  } catch (error) {
    console.error("Error adding favorite", error);
    alert("매물 찜에 실패했습니다.");
  }
}

async function removeFavorite(aptDealId) {
  try {
    await axios.delete(`/api/favorites/${aptDealId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    isFavorite.value = false;
    alert("매물 찜이 취소되었습니다.");
  } catch (error) {
    console.error("Error removing favorite", error);
    alert("매물 찜 취소에 실패했습니다.");
  }
}

async function checkIfFavorite(aptDealId) {
  try {
    const response = await axios.get(`/api/favorites/${aptDealId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    isFavorite.value = response.data.isFavorite;
  } catch (error) {
    console.error("Error checking favorite status", error);
  }
}

async function createInquiry() {
  try {
    const inquiryRequest = {
      aptDealId: selectedDeal.value.aptDealId,
      message: inquiryMessage.value
    };
    await axios.post('/api/inquiries', inquiryRequest, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    alert("문의가 성공적으로 전송되었습니다.");
    inquiryMessage.value = "";
  } catch (error) {
    console.error("Error creating inquiry", error);
    alert("문의 전송에 실패했습니다.");
  }
}
</script>

<template>
  <div class="search-container">
    <div class="search-bar">
      <button class="filter-button" @click="toggleFilters">⚙️</button>
      <input v-model="searchText" type="text" placeholder="검색어를 입력하세요" />
      <button class="search-button" @click="searchAptDeals">🔍</button>
    </div>

    <div v-if="showFilters" class="filters">
      <!-- 필터 섹션 생략 -->
    </div>

    <div v-if="selectedDeal" class="selected-deal">
      <button @click="selectedDeal = null">🔙 목록으로 돌아가기</button>
      <div class="deal-header">
        <h3>{{ selectedDeal.name }}</h3>
        <button class="favorite-button" @click="isFavorite ? removeFavorite(selectedDeal.aptDealId) : addFavorite(selectedDeal.aptDealId)">
          {{ isFavorite ? '❤️' : '🤍' }}
        </button>
      </div>
      <p>가격: {{ selectedDeal.price }}원</p>
      <p>주소: {{ selectedDeal.jibun }}</p>
      <p>면적: {{ selectedDeal.area }}</p>
      <p>층: {{ selectedDeal.floor }}</p>
      <div class="inquiry">
        <textarea v-model="inquiryMessage" placeholder="문의 내용을 입력하세요"></textarea>
        <button @click="createInquiry">매물 문의</button>
      </div>

      <div v-if="relatedDeals.length" class="related-deals">
        <h3>관련 매물 목록</h3>
        <AptDealGraph :deals="relatedDeals" />
        <ul>
          <li v-for="deal in relatedDeals" :key="deal.aptDealId" class="result-item">
            <span class="result-name">{{ deal.name }}</span>
            <span class="result-price">{{ deal.price }}원</span>
            <span class="result-date">{{ formatDate(deal.year, deal.month, deal.day) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="searchResults.length" class="search-results">
      <h3>검색 결과</h3>
      <ul>
        <li v-for="deal in searchResults" :key="deal.aptDealId" class="result-item" @click="selectDeal(deal)">
          <span class="result-name">{{ deal.name }}</span>
          <span class="result-price">{{ deal.price }}원</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  padding: 10px;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-bottom: 10px;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  padding: 5px 10px;
  border-radius: 20px;
}

.search-bar button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
}

.filter-button {
  margin-right: 5px;
}

.filters {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.filter-option {
  margin-bottom: 20px;
}

.filter-option label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.filter-values {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.buttons button {
  flex: 1 1 calc(33.333% - 10px);
  padding: 10px;
  background: #e5e5e5;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.buttons button.active {
  background-color: #007bff;
  color: white;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
}

.reset-button,
.apply-button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  margin: 5px;
}

.reset-button {
  background-color: #fff;
  border: 1px solid #ddd;
}

.apply-button {
  background-color: #007bff;
  color: #fff;
}

.search-results {
  margin-top: 20px;
}

.search-results h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.search-results ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.result-item:hover {
  background-color: #f1f1f1;
}

.result-name {
  font-size: 16px;
  font-weight: bold;
}

.result-price {
  font-size: 14px;
  color: #888;
}

.selected-deal {
  margin-top: 20px;
}

.selected-deal .deal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.selected-deal button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
  margin-bottom: 10px;
}

.selected-deal h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.inquiry {
  margin-top: 20px;
}

.inquiry textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}

.inquiry button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.related-deals {
  margin-top: 20px;
}

.related-deals h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.related-deals ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.related-deals .result-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.related-deals .result-name {
  font-size: 16px;
  font-weight: bold;
}

.related-deals .result-price {
  font-size: 14px;
  color: #888;
}

.related-deals .result-date {
  font-size: 12px;
  color: #aaa;
}
</style>
