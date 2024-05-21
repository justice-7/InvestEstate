<script setup>
import { ref } from 'vue';
import UpdateInfoModal from './UpdateInfoModal.vue';

const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <div class="update-info">
    <div class="info">
      <div class="name">강민서</div>
      <div class="email">kangminseo@naver.com</div>
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
