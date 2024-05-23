<script setup>
import { ref, onMounted } from 'vue';
import axios from '../axios';
import UpdateInfoModal from '@/components/Modal/UpdateInfoModal.vue';

const showModal = ref(false);
const userInfo = ref({ name: '', email: '' });

function toggleModal() {
  showModal.value = !showModal.value;
  if (!showModal.value) {
    fetchUserInfo();
  }
}

async function fetchUserInfo() {
  try {
    const response = await axios.get('/api/users/info', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    userInfo.value = response.data;
  } catch (error) {
    console.error("There was an error fetching the user info!", error);
  }
}

onMounted(fetchUserInfo);
</script>

<template>
  <div class="user-info-container">
    <h3>나의 정보</h3>
    <div class="user-info">
      <div class="info">
        <div class="name">{{ userInfo.name }}</div>
        <div class="email">{{ userInfo.email }}</div>
      </div>
      <button class="update-button" @click.prevent="toggleModal">개인정보 수정</button>
    </div>
    <UpdateInfoModal v-if="showModal" @close="toggleModal" />
  </div>
</template>

<style scoped>
.user-info-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.user-info-container:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #007bff;
}

.email {
  font-size: 14px;
  color: #555;
}

.update-button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.update-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>
