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
    console.log(response.data);
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
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.inquiry-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.inquiry-table th,
.inquiry-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  border-right: 1px solid #ddd; /* Add right border for column separation */
}

.inquiry-table th {
  background-color: #4B6EC4;
  color: #fff;
  font-weight: 600;
}

.inquiry-table td {
  color: #555;
}

.inquiry-table tr:last-child td {
  border-bottom: none;
}

.inquiry-table th:last-child,
.inquiry-table td:last-child {
  border-right: none; /* Remove right border for the last column */
}

.delete-button {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #d9363e;
}

.delete-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.3);
}

.inquiry-table input[type="checkbox"] {
  cursor: default;
}
</style>
