<script setup>
import { ref } from 'vue';
import axios from 'axios';

const newKeyword = ref("");
const keywords = ref(["강민서", "좋은 아파트", "정보 보기"]);

function addKeyword() {
  if (newKeyword.value && keywords.value.length < 10) {
    keywords.value.push(newKeyword.value);
    saveKeywordToDatabase(newKeyword.value);
    newKeyword.value = "";
  } else if (keywords.value.length >= 10) {
    alert("10개 이상 등록할 수 없습니다.");
  }
}

async function saveKeywordToDatabase(keyword) {
  try {
    await axios.post('http://localhost:8080/keywords/add', keyword, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (error) {
    console.error("There was an error saving the keyword!", error);
  }
}

function removeKeyword(index) {
  keywords.value.splice(index, 1);
}
</script>

<template>
  <div class="keyword-settings">
    <h2>관심 키워드 설정 (10개 미만)</h2>
    <div class="input-container">
      <input
        type="text"
        v-model="newKeyword"
        @keyup.enter="addKeyword"
        placeholder="키워드를 입력하세요"
      />
    </div>
    <div class="keywords">
      <div
        v-for="(keyword, index) in keywords"
        :key="index"
        class="keyword"
      >
        {{ keyword }}
        <button class="remove-button" @click="removeKeyword(index)">X</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.keyword-settings {
  font-family: Arial, sans-serif;
}

h2 {
  font-size: 16px;
  margin-bottom: 10px;
}

.input-container {
  margin-bottom: 10px;
}

.input-container input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword {
  padding: 5px 10px;
  background-color: #00bcd4;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.remove-button {
  background: none;
  border: none;
  color: #fff;
  margin-left: 5px;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}
</style>
