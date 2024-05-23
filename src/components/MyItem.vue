<template>
  <div class="my-items">
    <div class="header">
      <h2>내 매물 
        <button class="add-button" @click="toggleModal">+</button>
      </h2>
      <router-link :to="{ name: 'allItem', params: { items: encodeURIComponent(JSON.stringify(items)) } }">
        <button class="view-all-button">전체 보기</button>
      </router-link>
    </div>
    <div class="items-container">
      <div v-for="(item, index) in displayedItems" :key="item.aptDealId" class="item-card">
        <img v-if="item.imageUrls && item.imageUrls.length" :src="item.imageUrls[0]" alt="item image" class="item-image" />
        <div class="item-details">
          <div class="item-tags">
            <span class="tag">{{ item.status }}</span>
            <button class="delete-button" @click="deleteItem(item.aptDealId)">삭제</button>
          </div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <div class="item-footer">
            <span class="date">{{ item.year }}-{{ item.month }}-{{ item.day }}</span>
            <button class="view-button" @click="viewDetails(item.aptDealId)">상세보기</button>
          </div>
        </div>
      </div>
    </div>
    <RegistItemModal v-if="showModal" @submit="addItem" @close="toggleModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../axios';
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
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    items.value = items.value.filter(item => item.aptDealId !== itemId);
    displayedItems.value = items.value.slice(0, 4);
  } catch (error) {
    console.error("There was an error deleting the item!", error);
  }
};

const viewDetails = (itemId) => {
  router.push(`/item-details/${itemId}`);
};

const addItem = async (newItem) => {
  try {
    const response = await axios.post('/api/apt-deal', newItem, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    items.value.push(response.data);
    displayedItems.value = items.value.slice(0, 4);
    toggleModal();
  } catch (error) {
    console.error("There was an error adding the item!", error);
  }
};

const fetchItems = async () => {
  try {
    const response = await axios.get('/api/apt-deal/by-realtor', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    items.value = response.data;
    displayedItems.value = items.value.slice(0, 4);
  } catch (error) {
    console.error("There was an error fetching the items!", error);
  }
};

onMounted(() => {
  fetchItems();
});
</script>

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
