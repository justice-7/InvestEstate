<script setup>
import { ref } from 'vue';

const inquiries = ref([
  {
    name: "Full Name",
    email: "email@example.com",
    apartment: "민서 아파트",
    date: "2024.05.14 / 13:03:34",
    phone: "010-1234-5678",
    confirmed: true
  }
]);

function deleteInquiry(index) {
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
            <input type="checkbox" v-model="inquiry.confirmed" />
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
