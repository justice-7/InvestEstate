<script setup>
import { ref } from 'vue';
import axios from '../../axios'; // axios 인스턴스를 가져옵니다.

const showFilters = ref(false);
const selectedArea = ref(null);
const selectedType = ref([]);
const searchText = ref("");
const searchResults = ref([]);
const selectedDeal = ref(null); // 선택된 거래 상세 정보를 저장하는 변수
const inquiryMessage = ref(""); // 문의 메시지를 저장하는 변수

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
    const response = await axios.get('/api/apt-deal', {
      params: {
        searchText: searchText.value,
        // 필요한 경우 priceMin, priceMax, area 등의 추가 필터링 파라미터를 여기에 추가
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 인증 헤더 추가
      }
    });
    searchResults.value = response.data;
  } catch (error) {
    console.error("There was an error searching the apartment deals!", error);
  }
}

function selectDeal(deal) {
  selectedDeal.value = deal;
}

async function addFavorite(aptDealId) {
  try {
    await axios.post(`/api/favorites/${aptDealId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 인증 헤더 추가
      }
    });
    alert("매물 찜이 완료되었습니다.");
  } catch (error) {
    console.error("Error adding favorite", error);
    alert("매물 찜에 실패했습니다.");
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
        Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 인증 헤더 추가
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
        <input type="range" min="10" max="500" />
        <div class="filter-values">
          <span>10$</span>
          <span>500$</span>
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
      <h3>{{ selectedDeal.name }}</h3>
      <p>가격: {{ selectedDeal.price }}원</p>
      <p>주소: {{ selectedDeal.dongName }}</p>
      <p>면적: {{ selectedDeal.area }}</p>
      <p>층: {{ selectedDeal.floor }}</p>
      <!-- 더 많은 상세 정보들 -->
      <button @click="addFavorite(selectedDeal.aptDealId)">매물 찜</button>
      <div class="inquiry">
        <textarea v-model="inquiryMessage" placeholder="문의 내용을 입력하세요"></textarea>
        <button @click="createInquiry">매물 문의</button>
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
</style>
