<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const apartments = ref([
  { name: "민서 아파트", price: "100만원", liked: false },
  { name: "민서 아파트", price: "100만원", liked: false }
]);

const selectedApartment = ref(null);
const showFilters = ref(false);

// Filters state
const selectedArea = ref(null);
const selectedType = ref([]);

function selectApartment(index) {
  selectedApartment.value = index;
}

function toggleLike(index) {
  apartments.value[index].liked = !apartments.value[index].liked;
}

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

const sidebarWidth = ref('200px');

let isResizing = false;
const startWidth = ref(0);
const startX = ref(0);

const handleMouseDown = (e) => {
  isResizing = true;
  startWidth.value = parseInt(sidebarWidth.value, 10);
  startX.value = e.clientX;
};

const handleMouseMove = (e) => {
  if (isResizing) {
    const newWidth = startWidth.value + (e.clientX - startX.value);
    sidebarWidth.value = `${newWidth}px`;
  }
};

const handleMouseUp = () => {
  isResizing = false;
};

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div :style="{ width: sidebarWidth }" class="sidebar">
    <div class="search-bar">
      <input type="text" placeholder="지역 검색" />
      <button class="filter-button" @click="toggleFilters">⚙️</button>
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
    <div class="location">
      <span>강남구</span>
    </div>
    <table class="apartment-table">
      <thead>
        <tr>
          <th>아파트명</th>
          <th>가격</th>
          <th>찜</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(apartment, index) in apartments"
          :key="index"
          :class="{ selected: index === selectedApartment }"
          @click="selectApartment(index)"
        >
          <td>{{ apartment.name }}</td>
          <td>{{ apartment.price }}</td>
          <td>
            <button class="wishlist-button" @click.stop="toggleLike(index)">
              <span v-if="apartment.liked">❤️</span>
              <span v-else>🤍</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="resizer" @mousedown="handleMouseDown"></div>
  </div>
</template>

<style scoped>
.sidebar {
  border-right: 1px solid #ddd;
  padding: 10px;
  font-family: Arial, sans-serif;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 5px;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
}

.filter-button {
  background: none;
  border: none;
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

.location {
  padding: 5px;
  background-color: #f5f5f5;
}

.apartment-table {
  width: 100%;
  border-collapse: collapse;
}

.apartment-table th,
.apartment-table td {
  padding: 10px;
  text-align: left;
}

.apartment-table tbody tr {
  cursor: pointer;
}

.apartment-table tbody tr.selected {
  background-color: #ffe5e5;
}

.wishlist-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.resizer {
  width: 5px;
  height: 100%;
  background: #ccc;
  position: absolute;
  top: 0;
  right: 0;
  cursor: ew-resize;
}
</style>
