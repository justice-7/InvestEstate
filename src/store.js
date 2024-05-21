import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      state.token = '';
      state.user = {};
    }
  },
  actions: {
    async login({ commit }, user) {
      try {
        const response = await axios.post('http://localhost:3000/login', user);
        const token = response.data.token;
        localStorage.setItem('token', token);
        commit('setToken', token);
        // Decode token to get user info
        const userInfo = JSON.parse(atob(token.split('.')[1]));
        commit('setUser', userInfo);
      } catch (error) {
        alert('Invalid email or password');
      }
    },
    logout({ commit }) {
      commit('logout');
      localStorage.removeItem('token');
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user
  }
});

export default store;
