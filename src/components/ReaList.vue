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
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead th {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

tbody td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

tbody tr td input[type="checkbox"] {
  cursor: pointer;
}
</style>
