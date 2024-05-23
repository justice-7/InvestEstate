<script setup>
import { ref } from 'vue';

const emits = defineEmits(['close', 'signup', 'realtor-signup']);

const activeTab = ref('general');

const form = ref({
  email: '',
  password: '',
  name: '',
  phone: '',
  realEstateName: '',
  realEstateLocation: '',
  licenseNumber: ''
});

const handleTabChange = (tab) => {
  activeTab.value = tab;
};

const submitForm = () => {
  if (activeTab.value === 'general') {
    emits('signup', {
      email: form.value.email,
      password: form.value.password,
      name: form.value.name,
      phonenumber: form.value.phone,
      role: 'USER'
    });
  } else if (activeTab.value === 'agent') {
    emits('realtor-signup', {
      email: form.value.email,
      password: form.value.password,
      name: form.value.name,
      phonenumber: form.value.phone,
      role: 'REA',
      realEstateName: form.value.realEstateName,
      registrationNumber: form.value.licenseNumber,
      location: form.value.realEstateLocation
    });
  }
};
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">X</button>
      <h2>회원가입</h2>
      <div class="tab-buttons">
        <button
          :class="{ active: activeTab === 'general' }"
          @click="handleTabChange('general')"
        >
          일반 사용자
        </button>
        <button
          :class="{ active: activeTab === 'agent' }"
          @click="handleTabChange('agent')"
        >
          부동산 업자
        </button>
      </div>
      <form @submit.prevent="submitForm" class="form">
        <div class="form-group email-group">
          <label>ID (Email)</label>
          <div class="email-input">
            <input type="email" v-model="form.email" required />
            <button class="verify-button">중복 확인</button>
          </div>
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
        <div v-if="activeTab === 'agent'">
          <div class="form-group">
            <label>부동산명</label>
            <input type="text" v-model="form.realEstateName" required />
          </div>
          <div class="form-group">
            <label>부동산 위치</label>
            <input type="text" v-model="form.realEstateLocation" required />
          </div>
          <div class="form-group">
            <label>등록번호</label>
            <input type="text" v-model="form.licenseNumber" required />
          </div>
        </div>
        <button type="submit" class="submit-button">SignUp</button>
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
  color: #333;
}

.tab-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-buttons button {
  padding: 10px 20px;
  background: none;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.tab-buttons button.active {
  background-color: #4B6EC4;
  color: white;
  border-color: #4B6EC4;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.email-group {
  display: flex;
  flex-direction: column;
}

.email-input {
  display: flex;
  align-items: center;
}

.email-input input {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.verify-button {
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: #4B6EC4;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.verify-button:hover {
  background-color: #3a54a1;
}

.form-group input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4B6EC4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #3a54a1;
}
</style>
