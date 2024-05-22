<script setup>
import { ref } from 'vue';
import axios from '../axios'; // 기본 설정된 Axios 인스턴스를 가져옵니다.
import SignUpModal from './Modal/SignUpModal.vue';
import LoginModal from './Modal/LoginModal.vue';

const showSignUpModal = ref(false);
const showLoginModal = ref(false);
const isLoggedIn = ref(localStorage.getItem('accessToken') !== null);
const userRole = ref(localStorage.getItem('userRole')); // 사용자 역할 저장

const toggleSignUpModal = () => {
  showSignUpModal.value = !showSignUpModal.value;
};

const toggleLoginModal = () => {
  showLoginModal.value = !showLoginModal.value;
};

const handleLogin = async (loginData) => {
  try {
    const response = await axios.post('/api/auth/login', loginData);
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('userRole', response.data.role); // 사용자 역할 저장
    isLoggedIn.value = true;
    userRole.value = response.data.role;
    toggleLoginModal();
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const handleSignUp = async (signUpData) => {
  try {
    await axios.post('/api/auth/signup', signUpData);
    toggleSignUpModal();
    alert('회원가입이 완료되었습니다. 로그인 해주세요.');
  } catch (error) {
    console.error('Sign up failed:', error);
    alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
  }
};

const handleRealtorSignUp = async (signUpData) => {
  try {
    const response = await axios.post('/api/auth/realtor-signup', signUpData);
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('userRole', response.data.role); // 사용자 역할 저장
    isLoggedIn.value = true;
    userRole.value = response.data.role;
    toggleSignUpModal();
    alert('부동산 업자 회원가입이 완료되었습니다.');
  } catch (error) {
    console.error('Realtor sign up failed:', error);
    alert('부동산 업자 회원가입에 실패했습니다. 다시 시도해 주세요.');
  }
};

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole'); // 사용자 역할 제거
  isLoggedIn.value = false;
  userRole.value = null;
};
</script>

<template>
  <header class="header">
    <router-link to="/" class="logo">logo</router-link>
    <div class="header-links">
      <template v-if="isLoggedIn">
        <router-link v-if="userRole === 'USER'" to="/usrMypage" class="login-link">
          <span class="user-icon">👤</span>usr마이페이지
        </router-link>
        <router-link v-if="userRole === 'REA'" to="/reaMypage" class="login-link">
          <span class="user-icon">👤</span>rea마이페이지
        </router-link>
        <button class="user-link" @click.prevent="logout">
          로그아웃
        </button>
      </template>
      <template v-else>
        <button class="user-link" @click.prevent="toggleLoginModal">
          로그인
        </button>
        <button class="user-link" @click.prevent="toggleSignUpModal">
          회원가입
        </button>
      </template>
    </div>
    <SignUpModal v-if="showSignUpModal" @close="toggleSignUpModal" @signup="handleSignUp" @realtor-signup="handleRealtorSignUp" />
    <LoginModal v-if="showLoginModal" @close="toggleLoginModal" @login="handleLogin" />
  </header>
</template>


<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  font-family: Arial, sans-serif;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-sizing: border-box;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.header-links {
  display: flex;
  align-items: center;
}

.user-link {
  margin-right: 15px;
  text-decoration: none;
  color: purple;
  cursor: pointer;
}

.user-icon {
  margin-right: 5px;
}

.login-link {
  margin-right: 15px;
  text-decoration: none;
  color: purple;
}

.join-button {
  padding: 5px 10px;
  border: none;
  background-color: #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}
</style>
