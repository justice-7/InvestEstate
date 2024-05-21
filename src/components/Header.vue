<script setup>
import { ref } from 'vue';
import SignUpModal from './SignUpModal.vue';
import LoginModal from './LoginModal.vue';

const showSignUpModal = ref(false);
const showLoginModal = ref(false);
const isLoggedIn = ref(false);

const toggleSignUpModal = () => {
  showSignUpModal.value = !showSignUpModal.value;
};

const toggleLoginModal = () => {
  showLoginModal.value = !showLoginModal.value;
};

const handleLogin = (loginData) => {
  console.log('User logged in with data:', loginData);
  isLoggedIn.value = true;
};

const logout = () => {
  isLoggedIn.value = false;
};
</script>

<template>
  <header class="header">
    <router-link to="/" class="logo">logo</router-link>
    <div class="header-links">
      <template v-if="isLoggedIn">
        <router-link to="/mypage" class="login-link">
          <span class="user-icon">👤</span>마이페이지
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
    <SignUpModal v-if="showSignUpModal" @close="toggleSignUpModal" />
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
