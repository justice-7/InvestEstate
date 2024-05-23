<script setup>
import { ref, onMounted } from 'vue';
import axios from '../axios'; // axios 인스턴스를 가져옵니다.

const inquiries = ref([]);

const toggleStatus = async (index) => {
  inquiries.value[index].status = inquiries.value[index].status === 'pending' ? 'completed' : 'pending';
  // 상태 변경을 서버에 반영
  await axios.put(`/api/inquiries/${inquiries.value[index].inquiryId}`, {
    status: inquiries.value[index].status
  });
};

const fetchInquiries = async () => {
  try {
    const response = await axios.get('/api/inquiries/realtor', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    console.log(response.data);
    inquiries.value = response.data;
  } catch (error) {
    console.error("Error fetching inquiries", error);
  }
};

onMounted(() => {
  fetchInquiries();
});
</script>

<template>
  <div class="inquiry-list">
    <h2>문의 목록</h2>
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>매물 ID</th>
          <th>내용</th>
          <th>상태</th>
          <th>완료</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(inquiry, index) in inquiries" :key="inquiry.inquiryId">
          <td>{{ inquiry.inquiryId }}</td>
          <td>{{ inquiry.aptId }}</td>
          <td>{{ inquiry.content }}</td>
          <td>{{ inquiry.status }}</td>
          <td>
            <input type="checkbox" :checked="inquiry.status === 'completed'" @change="toggleStatus(index)" />
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
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: auto;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

thead th {
  background-color: #4B6EC4;
  color: #fff;
  padding: 15px;
  text-align: left;
  font-weight: bold;
  border-right: 1px solid #ddd; /* 열 구분선 추가 */
}

thead th:last-child {
  border-right: none; /* 마지막 열의 구분선 제거 */
}

tbody td {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd; /* 열 구분선 추가 */
  color: #555;
}

tbody td:last-child {
  border-right: none; /* 마지막 열의 구분선 제거 */
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

tbody tr td input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #4B6EC4; /* 체크박스 색상 */
}
</style>
