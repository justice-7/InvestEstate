<script setup>
import { ref } from 'vue';

const inquiries = ref([
  {
    id: 1,
    listing: "민서 아파트",
    info: {
      name: "일반 사용자 이름",
      email: "email@example.com"
    },
    date: "2024.05.14 / 13:03:34",
    phone: "010-1234-5678",
    status: false
  },
  {
    id: 2,
    listing: "민서 아파트",
    info: {
      name: "일반 사용자 이름",
      email: "email@example.com"
    },
    date: "2024.05.14 / 13:03:34",
    phone: "010-1234-5678",
    status: false
  }
]);

const toggleStatus = (index) => {
  inquiries.value[index].status = !inquiries.value[index].status;
};
</script>

<template>
  <div class="inquiry-list">
    <h2>문의 목록</h2>
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>매물명</th>
          <th>정보</th>
          <th>일시</th>
          <th>전화</th>
          <th>완료</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(inquiry, index) in inquiries" :key="inquiry.id">
          <td>{{ inquiry.id }}</td>
          <td>{{ inquiry.listing }}</td>
          <td>
            <div>{{ inquiry.info.name }}</div>
            <div>{{ inquiry.info.email }}</div>
          </td>
          <td>{{ inquiry.date }}</td>
          <td>{{ inquiry.phone }}</td>
          <td>
            <input type="checkbox" :checked="inquiry.status" @change="toggleStatus(index)" />
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
