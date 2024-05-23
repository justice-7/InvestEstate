<script setup>
import { ref, watch } from 'vue';
import axios from '../../axios';
import AptDealGraph from './AptDealGraph.vue';
import Roadview from '../Roadview.vue';

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
const props = defineProps({
  selectedApt: {
    type: Object,
    default: null,
  }
});

watch(
  () => props.selectedApt,
  (newApt) => {
    if (newApt) {
      console.log('Selected Apt:', JSON.stringify(newApt, null, 2));  // selectedApt 변경 시 콘솔에 JSON 형식으로 출력
      selectDeal(newApt);
    }
  },
  { immediate: true }
);

watch(
  () => relatedDeals.value,
  (newDeals) => {
    //console.log('Related Deals Updated:', JSON.stringify(newDeals, null, 2));  // relatedDeals 변경 시 콘솔에 출력
  },
  { deep: true }
);

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
    console.log("aptDealData", response.data);
  } catch (error) {
    console.error("There was an error fetching related deals!", error);
  }
}

function selectDeal(deal) {
  selectedDeal.value = deal;
  fetchRelatedDeals(deal.aptId);
  checkIfFavorite(deal.aptId);
}

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

async function addFavorite(aptId) {
  try {
    await axios.post(`/api/favorites/${aptId}`, {}, {
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

async function removeFavorite(aptId) {
  try {
    await axios.delete(`/api/favorites/${aptId}`, {
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

async function checkIfFavorite(aptId) {
  try {
    const response = await axios.get(`/api/favorites/${aptId}`, {
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
      aptId: selectedDeal.value.aptId,
      content: inquiryMessage.value
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
      <div class="filter-option">
        <label>금액</label>
        <input type="range" min="10" max="1000" />
        <div class="filter-values">
          <span>1000만원</span>
          <span>500,000만원</span>
        </div>
      </div>
      <div class="filter-option">
        <label>면적</label>
        <div class="buttons">
          <button
            v-for="area in ['10평 이하', '10평대', '20평대', '30평대', '40평대', '50평 이상']"
            :key="area"
            :class="{ active: selectedArea === area }"
            @click="selectArea(area)"
          >{{ area }}</button>
        </div>
      </div>
      <div class="filter-option">
        <label>유형</label>
        <div class="buttons">
          <button
            v-for="type in ['아파트', '오피스텔', '빌라', '원룸', '투룸+', '상가']"
            :key="type"
            :class="{ active: selectedType.includes(type) }"
            @click="toggleType(type)"
          >{{ type }}</button>
        </div>
      </div>
      <div class="filter-actions">
        <button class="reset-button" @click="resetFilters">초기화</button>
        <button class="apply-button" @click="searchAptDeals">적용하기</button>
      </div>
    </div>

    <div v-if="selectedDeal" class="selected-deal">
      <button @click="selectedDeal = null">🔙 목록으로 돌아가기</button>
      <div class="deal-header">
        <h3>{{ selectedDeal.name }}</h3>
        <button class="favorite-button" @click="isFavorite ? removeFavorite(selectedDeal.aptId) : addFavorite(selectedDeal.aptId)">
          {{ isFavorite ? '❤️' : '🤍' }}
        </button>
      </div>
      <p>건축년도: {{ selectedDeal.builtYear }}</p>
      <p>동 이름: {{ selectedDeal.dongName }}</p>
      <p>지번: {{ selectedDeal.jibun }}</p>
      <p>이름: {{ selectedDeal.name }}</p>

      <!-- Roadview Component -->
      <Roadview v-if="selectedDeal.lat && selectedDeal.lng" :lat="selectedDeal.lat" :lng="selectedDeal.lng" />

      <div class="inquiry">
        <textarea v-model="inquiryMessage" placeholder="문의 내용을 입력하세요"></textarea>
        <button @click="createInquiry">매물 문의</button>
      </div>

      <div v-if="relatedDeals.length" class="related-deals">
        <h3>관련 매물 목록</h3>
        <AptDealGraph :deals="relatedDeals" :key="relatedDeals.length" />
        <ul>
          <li v-for="deal in relatedDeals" :key="deal.aptDealId" class="result-item">
            <span class="result-name">{{ deal.name }}</span>
            <span class="result-price">{{ deal.price }}만원</span>
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
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  background-color: #f7f9fc;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 30px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 15px;
  border-radius: 30px;
  font-size: 16px;
}

.search-bar button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  margin-left: 10px;
}

.filter-button {
  margin-right: 10px;
}

.filters {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-option {
  margin-bottom: 20px;
}

.filter-option label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.filter-values {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.buttons button {
  flex: 1 1 calc(33.333% - 10px);
  padding: 10px;
  background: #007bff;
  color: #fff;
  border: 1px solid #007bff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buttons button:hover {
  background-color: #0056b3;
}

.buttons button.active {
  background-color: #0056b3;
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
  margin: 10px;
}

.reset-button {
  background-color: #6c757d;
  color: #fff;
}

.reset-button:hover {
  background-color: #5a6268;
}

.apply-button {
  background-color: #007bff;
  color: #fff;
}

.apply-button:hover {
  background-color: #0056b3;
}

.search-results {
  margin-top: 30px;
}

.search-results h3 {
  font-size: 22px;
  margin-bottom: 20px;
}

.search-results ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.result-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.result-item:hover {
  background-color: #f1f1f1;
}

.result-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.result-price {
  font-size: 16px;
  color: #888;
}

.selected-deal {
  margin-top: 30px;
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
  font-size: 18px;
  padding: 10px 15px;
  color: #007bff;
  transition: color 0.3s;
}

.selected-deal button:hover {
  color: #0056b3;
}

.selected-deal h3 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.inquiry {
  margin-top: 30px;
}

.inquiry textarea {
  width: 90%;
  height: 120px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 16px;
}

.inquiry button {
  padding: 12px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.inquiry button:hover {
  background-color: #0056b3;
}

.related-deals {
  margin-top: 30px;
}

.related-deals h3 {
  font-size: 22px;
  margin-bottom: 20px;
}

.related-deals ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.related-deals .result-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.related-deals .result-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.related-deals .result-price {
  font-size: 16px;
  color: #888;
}

.related-deals .result-date {
  font-size: 14px;
  color: #aaa;
}
</style>
