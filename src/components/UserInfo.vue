<script setup>
import { ref, onMounted } from 'vue';
import axios from '../axios'; // axios 인스턴스를 가져옵니다.
import UpdateInfoModal from '@/components/Modal/UpdateInfoModal.vue';

const showModal = ref(false);
const userInfo = ref({ name: '', email: '' });

function toggleModal() {
  showModal.value = !showModal.value;
  if (!showModal.value) {
    fetchUserInfo(); // 모달이 닫힐 때 사용자 정보를 다시 가져옴
  }
}

// 사용자 정보를 가져오는 함수
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

// 컴포넌트가 마운트될 때 사용자 정보를 가져옴
onMounted(fetchUserInfo);
</script>

<template>
  <div class="update-info">
    <div class="info">
      <div class="name">{{ userInfo.name }}</div>
      <div class="email">{{ userInfo.email }}</div>
    </div>
    <button class="update-button" @click.prevent="toggleModal">개인정보 수정</button>
    <UpdateInfoModal v-if="showModal" @close="toggleModal" />
  </div>
</template>

<style scoped>
.update-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  font-family: Arial, sans-serif;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.email {
  font-size: 12px;
  color: #888;
}

.update-button {
  padding: 5px 10px;
  border: none;
  background-color: #000;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}
</style>
