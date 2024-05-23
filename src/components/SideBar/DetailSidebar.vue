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
        <input type="range" min="1000" max="500000" />
        <div class="filter-values">
          <span>1,000만원</span>
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
      <div class="deal-info">
        <span><span class="label">건축년도:</span> <span class="value">{{ selectedDeal.builtYear }}</span></span>
        <span><span class="label">동 이름:</span> <span class="value">{{ selectedDeal.dongName }}</span></span>
        <span><span class="label">지번:</span> <span class="value">{{ selectedDeal.jibun }}</span></span>
        <span><span class="label">이름:</span> <span class="value">{{ selectedDeal.name }}</span></span>
      </div>

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
  margin-top: 15px;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  background-color: #f7f9fc;
  border-radius: 20px;
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
  padding: 20px;
  background-color: #ffffff;
  font-family: 'Roboto', sans-serif;
  border-radius: 20px;
  border: 1px solid #ccc; /* 테두리 추가 */
}

.filter-option {
  margin-bottom: 20px;
}

.filter-option label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.filter-option input[type="range"] {
  width: 100%;
  margin-bottom: 10px;
  -webkit-appearance: none; /* Safari와 Chrome에서 기본 스타일 제거 */
  appearance: none; /* 기타 브라우저에서 기본 스타일 제거 */
  background: #ddd; /* 기본 배경 색상 */
  height: 5px;
  border-radius: 5px;
  outline: none;
}

.filter-option input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #4B6EC4; /* 이미지 색상 */
  cursor: pointer;
  border-radius: 50%;
}

.filter-option input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #4B6EC4; /* 이미지 색상 */
  cursor: pointer;
  border-radius: 50%;
}

.filter-values {
  display: flex;
  justify-content: space-between;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
}

.buttons button {
  margin: 5px;
  padding: 10px 15px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  border-radius: 20px;
}

.buttons button.active {
  background-color: #4B6EC4; /* 이미지 색상 */
  color: #fff;
  border-color: #4B6EC4; /* 이미지 색상 */
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* 버튼 사이의 간격 조정 */
}

.reset-button, .apply-button {
  padding: 10px 20px;
  border: none;
  background-color: #4B6EC4; /* 이미지 색상 */
  color: #fff;
  cursor: pointer;
  border-radius: 20px;
  flex-grow: 1; /* 버튼을 동일한 비율로 확장 */
}

.reset-button {
  background-color: #6c757d;
}

.reset-button:hover {
  background-color: #5a6268;
}

.apply-button {
  background-color: #4B6EC4; /* 이미지 색상 */
}

.apply-button:hover {
  background-color: #405a9c; /* 조금 더 어두운 이미지 색상 */
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
  border: 1px solid #4B6EC4; /* 테두리 색상 변경 */
  border-radius: 20px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.result-item:hover {
  background-color: #f1f1f1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.result-item .item-details {
  display: flex;
  flex-direction: column;
}

.result-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.result-price {
  font-size: 16px;
  color: #888;
}

.selected-deal {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

.selected-deal .deal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 10px;
}

.selected-deal h3 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.selected-deal button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 8px 12px;
  color: #4B6EC4;
  transition: color 0.3s, background-color 0.3s;
  border-radius: 20px;
}

.selected-deal button:hover {
  background-color: #4B6EC4;
  color: #fff;
}

.selected-deal .deal-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.selected-deal .deal-info span {
  font-size: 16px;
  color: #555;
}

.selected-deal .deal-info span.label {
  font-weight: 700;
  color: #333;
  margin-right: 10px;
}

.selected-deal .deal-info span.value {
  font-weight: 400;
  color: #555;
}

.inquiry {
  margin-top: 30px;
}

.inquiry textarea {
  width: 90%;
  height: 120px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-bottom: 20px;
  font-size: 16px;
}

.inquiry button {
  padding: 12px 20px;
  background-color: #4B6EC4; /* 이미지 색상 */
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.inquiry button:hover {
  background-color: #405a9c; /* 조금 더 어두운 이미지 색상 */
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
  border-radius: 20px;
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
