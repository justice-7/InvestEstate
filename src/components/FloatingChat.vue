<script setup>
import { ref } from 'vue';

const showChat = ref(false);
const messages = ref([
  { text: 'Hello! I am your online consultant. How can I help you?', type: 'support', time: '10:10' },
  { text: "Hi, I can't log in into my account.", type: 'user', time: '10:12' }
]);
const newMessage = ref('');

const toggleChat = () => {
  showChat.value = !showChat.value;
};

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messages.value.push({ text: newMessage.value.trim(), type: 'user', time: currentTime });
    newMessage.value = '';
  }
};
</script>

<template>
  <div>
    <button class="floating-button" @click="toggleChat">
      💬
    </button>
    <div v-if="showChat" class="chat-window">
      <div class="chat-header">
        <span>챗봇에게 물어보세요</span>
        <button class="close-button" @click="toggleChat">x</button>
      </div>
      <div class="chat-content">
        <div v-for="(message, index) in messages" :key="index" :class="['chat-message', message.type]">
          <div v-if="message.type === 'support'" class="avatar">
            <img src="/public/ChatBotIcon.png" alt="Avatar" />
          </div>
          <div class="message-content">
            <p>{{ message.text }}</p>
            <span class="time">{{ message.time }}</span>
          </div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="chat-input-form">
        <input v-model="newMessage" type="text" placeholder="Type your message..." class="chat-input" />
        <button type="submit" class="send-button">▶</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 1000; /* Ensure the button is on top */
}

.floating-button:hover {
  background-color: #0056b3;
}

.chat-window {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  height: 400px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000; /* Ensure the chat window is on top */
}

.chat-header {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.chat-content {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.chat-message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
}

.chat-message.user {
  justify-content: flex-end;
}

.chat-message.support {
  justify-content: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
}

.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  position: relative;
}

.message-content p {
  margin: 0;
}

.user .message-content {
  background-color: #e0e0e0;
  color: #000;
  border-bottom-right-radius: 0;
}

.support .message-content {
  background-color: #007bff;
  color: #fff;
  border-bottom-left-radius: 0;
}

.time {
  display: block;
  margin-top: 5px;
  font-size: 0.75rem;
  color: #888;
  text-align: right;
}

.chat-input-form {
  display: flex;
  border-top: 1px solid #ddd;
  padding: 10px;
}

.chat-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>
