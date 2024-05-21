<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const items = ref([]);

onMounted(() => {
  try {
    const itemsParam = route.params.items;
    const paramsItems = itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : [];
    items.value = paramsItems;
  } catch (error) {
    console.error('Error parsing items:', error);
    items.value = [];
  }
});

const deleteItem = (index) => {
  items.value.splice(index, 1);
};
</script>

<template>
  <div class="all-items">
    <h2>전체 매물 목록</h2>
    <div class="items-container">
      <div v-for="(item, index) in items" :key="item.id" class="item-card">
        <img :src="item.imageUrls[0]" alt="item image" class="item-image" />
        <div class="item-details">
          <div class="item-tags">
            <span class="tag">{{ item.status }}</span>
            <button class="delete-button" @click="deleteItem(index)">삭제</button>
          </div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <div class="item-footer">
            <span class="date">{{ item.date }}</span>
            <button class="view-button">상세보기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.all-items {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.items-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item-card {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
}

.item-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item-tags {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 5px;
}

.tag {
  background-color: #00bcd4;
  color: #fff;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 12px;
}

.delete-button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 12px;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 10px;
}

.date {
  font-size: 12px;
  color: #888;
}

.view-button {
  padding: 5px 10px;
  border: 1px solid #00bcd4;
  background-color: #fff;
  color: #00bcd4;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}
</style>
