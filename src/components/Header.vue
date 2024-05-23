<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from '../axios';
import SignUpModal from './Modal/SignUpModal.vue';
import LoginModal from './Modal/LoginModal.vue';

const showSignUpModal = ref(false);
const showLoginModal = ref(false);
const showNotifications = ref(false);
const isLoggedIn = ref(localStorage.getItem('accessToken') !== null);
const userRole = ref(localStorage.getItem('userRole'));
const notifications = ref([]);

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
    localStorage.setItem('userRole', response.data.role);
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
    localStorage.setItem('userRole', response.data.role);
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
  localStorage.removeItem('userRole');
  isLoggedIn.value = false;
  userRole.value = null;
};

const fetchNotifications = async () => {
  if (!showNotifications.value) {
    try {
      const response = await axios.get('/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      notifications.value = response.data;
      await markAllAsRead();
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }
  showNotifications.value = !showNotifications.value;
};

const markAllAsRead = async () => {
  try {
    await axios.post('/api/notifications/mark-all-read', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-icon') && !event.target.closest('.notification-dropdown')) {
    showNotifications.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<template>
  <header class="header">
    <router-link to="/" class="logo">Minseo Home</router-link>
    <div class="header-links">
      <template v-if="isLoggedIn">
        <div class="notification-icon" @click.stop="fetchNotifications">
          <i class="fas fa-bell"></i>
          <div v-if="showNotifications" class="notification-dropdown">
            <p v-if="notifications.length === 0" class="no-notifications">새로운 알림이 없습니다.</p>
            <ul v-else>
              <li v-for="notification in notifications" :key="notification.notificationDate">
                <span class="notification-date">{{ formatDate(notification.notificationDate) }}</span>
                <span class="notification-text">{{ notification.aptDealName }}</span>
              </li>
            </ul>
          </div>
        </div>
        <router-link v-if="userRole === 'USER'" to="/usrMypage" class="login-link">
          <i class="fas fa-user-circle user-icon"></i>USER MYPAGE
        </router-link>
        <router-link v-if="userRole === 'REA'" to="/reaMypage" class="login-link">
          <i class="fas fa-user-circle user-icon"></i>REA MYPAGE
        </router-link>
        <button class="user-link" @click.prevent="logout">
          LOGOUT
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  font-family: 'Roboto', sans-serif;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-sizing: border-box;
  transition: background-color 0.3s;
}

.header:hover {
  background-color: #ffffff;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #343a40;
  text-decoration: none;
}

.header-links {
  display: flex;
  align-items: center;
}

.user-link, .login-link, .notification-icon {
  margin-right: 20px;
  text-decoration: none;
  color: #343a40;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.3s;
}

.user-link:hover, .login-link:hover, .notification-icon:hover {
  color: #007bff;
}

.user-icon {
  margin-right: 5px;
}

.join-button {
  padding: 8px 15px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.join-button:hover {
  background-color: #0056b3;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  font-size: 20px;
}

.notification-dropdown {
  position: absolute;
  top: 35px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1001;
}

.notification-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notification-dropdown li {
  padding: 12px 15px;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s;
}

.notification-dropdown li:hover {
  background-color: #f8f9fa;
}

.notification-dropdown li:last-child {
  border-bottom: none;
}

.notification-date {
  font-size: 14px;
  color: #6c757d;
}

.notification-text {
  font-size: 16px;
  color: #343a40;
}

.no-notifications {
  padding: 15px;
  text-align: center;
  color: #6c757d;
  font-size: 16px;
}
</style>
