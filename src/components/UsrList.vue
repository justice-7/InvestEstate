<script setup>
import { ref, onMounted } from 'vue';
import axios from '../axios'; // 기본 설정된 Axios 인스턴스를 가져옵니다.

const inquiries = ref([]);

// 컴포넌트가 마운트될 때 문의 목록을 가져옴
onMounted(async () => {
  await fetchInquiries();
});

async function fetchInquiries() {
  try {
    const response = await axios.get('/api/inquiries/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    inquiries.value = response.data;
  } catch (error) {
    console.error("There was an error fetching the inquiries!", error);
  }
}

function deleteInquiry(index) {
  // 여기에서는 실제 삭제 기능은 구현하지 않고, 목록에서만 제거합니다.
  inquiries.value.splice(index, 1);
}
</script>

<template>
  <div class="inquiry-list">
    <h2>문의 목록</h2>
    <table class="inquiry-table">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Apartment</th>
          <th>Date</th>
          <th>Phone</th>
          <th>Confirmed</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(inquiry, index) in inquiries" :key="index">
          <td>{{ inquiry.name }}</td>
          <td>{{ inquiry.email }}</td>
          <td>{{ inquiry.apartment }}</td>
          <td>{{ inquiry.date }}</td>
          <td>{{ inquiry.phone }}</td>
          <td>
            <input type="checkbox" v-model="inquiry.confirmed" disabled />
          </td>
          <td>
            <button class="delete-button" @click="deleteInquiry(index)">취소</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.inquiry-list {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.inquiry-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.inquiry-table th,
.inquiry-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.delete-button {
  background-color: #6200ea;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #3700b3;
}
</style>
