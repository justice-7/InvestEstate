<script setup>
import { ref, onMounted } from 'vue';
import axios from '../axios'; // axios 인스턴스를 가져옵니다.
import FavoriteItem from './FavoriteItem.vue';

const favoriteItems = ref([]);

async function fetchFavoriteItems() {
  try {
    const response = await axios.get('/api/favorites', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    favoriteItems.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error("There was an error fetching the favorite items!", error);
  }
}

async function removeFavoriteItem(aptId) {
  try {
    await axios.delete(`/api/favorites/${aptId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    favoriteItems.value = favoriteItems.value.filter(item => item.aptId !== aptId);
  } catch (error) {
    console.error("There was an error removing the favorite item!", error);
  }
}

onMounted(fetchFavoriteItems);
</script>

<template>
  <div class="favorites-section">
    <h2>관심 아파트</h2>
    <div class="favorite-items">
      <FavoriteItem
        v-for="item in favoriteItems"
        :key="item.aptId"
        :item="item"
        @remove="removeFavoriteItem"
      />
    </div>
  </div>
</template>

<style scoped>
.favorites-section {
  margin-bottom: 20px;
}

.favorites-section h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.favorite-items {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
