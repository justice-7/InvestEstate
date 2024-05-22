<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';

const showChat = ref(false);
const messages = ref([
  { text: '안녕하세요! 투자 도우미입니다. 무엇을 도와드릴까요?', type: 'support', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
]);
const newMessage = ref('');
const isLoading = ref(false);

const toggleChat = () => {
  showChat.value = !showChat.value;
};

const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { text: newMessage.value.trim(), type: 'user', time: currentTime };
    messages.value.push(userMessage);
    const content = newMessage.value.trim();
    newMessage.value = '';
    isLoading.value = true;

    await nextTick();
    scrollToBottom();

    try {
      const asst_id = import.meta.env.VITE_CHATBOT_ASSISTANT_ID; // 실제 asst_id를 입력하세요
      const apiKey = import.meta.env.VITE_OPENAI_KEY;

      // 어시스턴트 검색
      const asst = await axios.get(`https://api.openai.com/v1/assistants/${asst_id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "OpenAI-Beta": "assistants=v1"
        },
      });
      //console.log("asstData", asst.data); // 어시스턴트 데이터 확인

      // 스레드 생성
      const thread = await axios.post(`https://api.openai.com/v1/threads`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "OpenAI-Beta": "assistants=v1"
        },
      });
      const thread_id = thread.data.id;
      //console.log("threadData", thread.data); // 스레드 데이터 확인

      // 스레드에 메시지 추가
      const message = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
        role: "user",
        content: content
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "OpenAI-Beta": "assistants=v1"
        },
      });
      //console.log("messageData", message.data); // 메시지 데이터 확인

      // 어시스턴트 실행
      const run = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
        assistant_id: asst_id,
      }, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v1"
        },
      });
      const run_id = run.data.id;
      //console.log("runData", run.data); // 실행 데이터 확인

      // 실행 상태 확인
      let statesData;
      while (true) {
        const states = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`, {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "OpenAI-Beta": "assistants=v1"
          },
        });
        statesData = states.data;
        //console.log("statesData",statesData);
        if (statesData.status === "completed") {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 응답 확인
      const response = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "OpenAI-Beta": "assistants=v1"
        },
      });
      console.log("responseData", response.data); // 응답 데이터 확인
      //console.log("response[0]",response.data.data[0]);
      // 응답 데이터 추출 (response.data의 첫번쨰)
      const firstMessage = response.data.data[0];
      if (firstMessage && firstMessage.content && firstMessage.content.length > 0) {
        const assistantMessage = firstMessage.content[0].text.value;
        messages.value.push({
          text: assistantMessage,
          type: 'support',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        await nextTick();
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error during the API call:", error);
    } finally {
      isLoading.value = false;
    }
  }
};

const scrollToBottom = () => {
  const chatContent = document.querySelector('.chat-content');
  if (chatContent) {
    chatContent.scrollTop = chatContent.scrollHeight;
  }
};

onMounted(() => {
  console.log('Chat component mounted');
});
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
          <div v-if="isLoading" class="chat-message support">
            <div class="avatar">
              <img src="/public/ChatBotIcon.png" alt="Avatar" />
            </div>
            <div class="message-content loader">
              <img src="/public/ChatLoad.gif" alt="Loading..." />
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
  
  .loader img {
    width: 50px; /* 원하는 크기로 조절 */
    height: 50px; /* 원하는 크기로 조절 */
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
