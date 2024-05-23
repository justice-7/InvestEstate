<script setup>
import { ref, watch } from 'vue';
import axios from 'axios'; // axios 인스턴스를 가져옵니다.

const emits = defineEmits(['close']);

const form = ref({
  nickname: '박싸피',
  email: 'wjddml0702@naver.com',
  phone: '010-1234-1234',
  password: '●●●●'
});

const isFormValid = ref(false);

function closeModal() {
  emits('close');
}

async function submitForm() {
  try {
    await axios.put('http://localhost:8080/api/users/update', {
      name: form.value.nickname,
      email: form.value.email,
      phoneNumber: form.value.phone,
      password: form.value.password,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    console.log('Form submitted:', form.value);
    closeModal();
  } catch (error) {
    console.error("There was an error updating the user info!", error);
  }
}

function validateForm() {
  isFormValid.value = form.value.nickname && form.value.email && form.value.phone && form.value.password;
}

// Watch for changes in the form and validate
watch(form, validateForm, { deep: true });
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">X</button>
      <h2>개인정보 수정</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label>닉네임</label>
          <input type="text" v-model="form.nickname" required />
        </div>
        <div>
          <label>이메일</label>
          <input type="email" v-model="form.email" required />
        </div>
        <div>
          <label>전화번호</label>
          <input type="text" v-model="form.phone" required />
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" v-model="form.password" required />
        </div>
        <button type="submit" :disabled="!isFormValid">수정하기</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

form div {
  margin-bottom: 10px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 5px;
}

form button {
  background-color: #4B6EC4;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
}

form button:disabled {
  background-color: #ccc;
}

form button:hover:enabled {
  background-color: #3a54a1;
}
</style>
