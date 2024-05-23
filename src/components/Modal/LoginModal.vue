<script setup>
import { ref } from 'vue';

const emits = defineEmits(['close', 'login']);

const form = ref({
  email: '',
  password: ''
});

const handleSubmit = () => {
  emits('login', form.value);
};

const closeModal = () => {
  emits('close');
};
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">X</button>
      <h2>로그인</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>ID (Email)</label>
          <input type="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="form.password" required />
        </div>
        <button type="submit" class="submit-button">Login</button>
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
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #4B6EC4; /* 변경된 색상 */
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s;
}

.submit-button:hover {
  background-color: #405a9c; /* 변경된 색상 */
  transform: scale(1.05);
}
</style>
