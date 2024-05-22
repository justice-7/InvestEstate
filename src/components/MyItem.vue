<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios'; // axios 인스턴스 가져오기
import RegistItemModal from '@/components/Modal/RegistItemModal.vue';

const items = ref([]);
const showModal = ref(false);
const displayedItems = ref([]);
const router = useRouter();

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const deleteItem = async (itemId) => {
  try {
    await axios.delete(`/api/apt-deal/${itemId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 인증 헤더 추가
      }
    });
    items.value = items.value.filter(item => item.aptDealId !== itemId);
    displayedItems.value = items.value.slice(0, 4); // 첫 4개 아이템만 반환
  } catch (error) {
    console.error("There was an error deleting the item!", error);
  }
};

const viewDetails = (itemId) => {
  router.push(`/item-details/${itemId}`);
};

const addItem = (newItem) => {
  items.value.push({
    id: items.value.length + 1,
    name: newItem.address,
    description: newItem.content,
    date: new Date().toISOString().split('T')[0],
    status: '판매중',
    imageUrls: newItem.imageUrls, // 업로드된 이미지 URL 배열 사용
    liked: false
  });
  displayedItems.value = items.value.slice(0, 4); // 첫 4개 아이템만 반환
  toggleModal(); // 아이템을 추가한 후 모달 닫기
};

const fetchItems = async () => {
  try {
    const response = await axios.get('/api/apt-deal/by-realtor', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 인증 헤더 추가
      }
    });
    items.value = response.data;
    displayedItems.value = items.value.slice(0, 4); // 첫 4개 아이템만 반환
  } catch (error) {
    console.error("There was an error fetching the items!", error);
  }
};

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <div class="my-items">
    <div class="header">
      <h2>내 매물 <button class="add-button" @click="toggleModal">+</button></h2>
      <!-- router-link를 사용하여 전체 보기로 네비게이션 -->
      <router-link :to="{ name: 'allItem', params: { items: encodeURIComponent(JSON.stringify(items)) } }">
        <button class="view-all-button">전체 보기</button>
      </router-link>
    </div>
    <div class="items-container">
      <div v-for="(item, index) in displayedItems" :key="item.aptDealId" class="item-card">
        <!-- 대표 사진만 보여줌 -->
        <img v-if="item.imageUrls && item.imageUrls.length" :src="item.imageUrls[0]" alt="item image" class="item-image" />
        <div class="item-details">
          <div class="item-tags">
            <span class="tag">{{ item.status }}</span>
            <button class="delete-button" @click="deleteItem(item.aptDealId)">삭제</button>
          </div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <div class="item-footer">
            <span class="date">{{ item.date }}</span>
            <button class="view-button" @click="viewDetails(item.aptDealId)">상세보기</button>
          </div>
        </div>
      </div>
    </div>
    <RegistItemModal v-if="showModal" @submit="addItem" @close="toggleModal" />
  </div>
</template>

<style scoped>
.my-items {
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  font-size: 18px;
  margin: 0;
}

.add-button {
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}

.view-all-button {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
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
