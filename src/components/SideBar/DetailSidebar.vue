<script setup>
import { ref } from 'vue';
import RoadviewComponent from '@/components/Roadview.vue';

const showFilters = ref(false);
const showRoadview = ref(false);
const selectedArea = ref(null);
const selectedType = ref([]);
const isFavorite = ref(false);

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
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
}
</script>

<template>
  <div class="detail-sidebar">
    <div class="apartment-header">
      <h2>민서 아파트</h2>
      <div class="action-buttons">
        <button class="favorite-button" @click="toggleFavorite">
          <span v-if="isFavorite">❤️</span>
          <span v-else>🤍</span>
        </button>
        <button class="inquiry-button">문의</button>
      </div>
    </div>
    <div class="search-bar">
      <button class="filter-button" @click="toggleFilters">⚙️</button>
      <input type="text" placeholder="경기 과천시 갈현동 과천대로 8길 68" />
      <button class="search-button">🔍</button>
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
        <button class="apply-button">적용하기</button>
      </div>
    </div>

    <div class="basic-info">
      <p>주소: 경기 과천시 갈현동 과천대로8길 68</p>
      <p>준공날짜: 2023년 6월 건축</p>
      <p>세대수: 총 472세대</p>
      <p>동수: 총 8개동</p>
      <div class="statistics">
        <div>관심상지수 <span>224명</span></div>
        <div>검색 단지순위 <span>23위</span></div>
        <div>최근 6개월간 매물수 <span>23회</span></div>
      </div>
      <div class="buttons">
        <button @click="showRoadview = !showRoadview">로드뷰</button>
        <button>항공뷰</button>
        <button>네이버평면도</button>
      </div>
    </div>
    
    <div class="price-trend">
      <h3>매매/전세 가격변동</h3>
      <!-- 여기에 차트 컴포넌트가 들어갈 수 있습니다 -->
      <div class="chart-placeholder">[차트]</div>
    </div>
    <div class="contact">
      <span>강민서</span>
      <span>kangminseo@naver.com</span>
      <span>조아 아파트</span>
    </div>
    <RoadviewComponent v-if="showRoadview" />
  </div>
</template>

<style scoped>
.detail-sidebar {
  border-right: 1px solid #ddd;
  padding: 10px;
  font-family: Arial, sans-serif;
  width: 300px;
}

.apartment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.apartment-header h2 {
  margin: 0;
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.favorite-button,
.inquiry-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
}

.favorite-button span {
  font-size: 20px;
}

.inquiry-button {
  background-color: #007bff;
  color: white;
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

.basic-info {
  margin-top: 10px;
  font-size: 14px;
}

.basic-info p {
  margin: 5px 0;
}

.statistics {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-weight: bold;
}

.statistics div {
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.buttons button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
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

.price-trend {
  margin-top: 20px;
}

.chart-placeholder {
  height: 200px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  line-height: 200px;
  color: #888;
}

.contact {
  margin-top: 20px;
  font-size: 14px;
}
</style>
