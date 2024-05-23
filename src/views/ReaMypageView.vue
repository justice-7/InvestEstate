<script setup>
import MyItem from '@/components/MyItem.vue';
import ReaList from '@/components/ReaList.vue';
import UserInfo from '@/components/UserInfo.vue';
</script>

<template>
  <div>
    <div class="container">
      <UserInfo />
      <section class="my-items-section">
        <MyItem />
      </section>
      <section class="inquiries-section">
        <ReaList />
      </section>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 20px;
  padding: 20px;
}

.my-items-section,
.inquiries-section {
  margin-top: 20px;
}

.add-button {
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}
</style>
