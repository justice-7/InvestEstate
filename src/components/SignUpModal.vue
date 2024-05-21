<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';

const emits = defineEmits(['close']);

const form = ref({
  email: '',
  password: '',
  name: '',
  phone: '',
  realEstateName: '',
  realEstateLocation: '',
  registrationNumber: ''
});

const handleSubmit = () => {
  console.log('Form data:', form.value);
  // Handle form submission logic here
  emits('close');
};

const closeModal = () => {
  emits('close');
};
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">X</button>
      <h2>회원가입</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>ID (Email)</label>
          <input type="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="form.password" required />
        </div>
        <div class="form-group">
          <label>이름</label>
          <input type="text" v-model="form.name" required />
        </div>
        <div class="form-group">
          <label>Phone number</label>
          <input type="text" v-model="form.phone" required />
        </div>
        <div class="form-group">
          <label>부동산명</label>
          <select v-model="form.realEstateName" required>
            <option value="Mexico">Mexico</option>
            <!-- Add more options as needed -->
          </select>
        </div>
        <div class="form-group">
          <label>부동산 위치</label>
          <select v-model="form.realEstateLocation" required>
            <option value="Mexico">Mexico</option>
            <!-- Add more options as needed -->
          </select>
        </div>
        <div class="form-group">
          <label>등록번호</label>
          <input type="text" v-model="form.registrationNumber" required />
        </div>
        <button type="submit" class="submit-button">Save</button>
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

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
