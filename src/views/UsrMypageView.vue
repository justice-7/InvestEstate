<script setup>
import UserInfo from "@/components/UserInfo.vue";
import KeywordSection from "@/components/Keyword.vue";
import LikeItemsSection from "@/components/LikeItem.vue";
import InquiryListSection from "@/components/UsrList.vue";
</script>

<template>
  <div class="my-page">
    <div class="section">
      <UserInfo />
    </div>
    <div class="section">
      <KeywordSection />
    </div>
    <div class="section">
      <LikeItemsSection />
    </div>
    <div class="section">
      <InquiryListSection />
    </div>
  </div>
</template>

<style scoped>
.my-page {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

.section {
  margin-bottom: 20px;
}

.section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.favorite-items {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.favorite-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 1 1 calc(33.333% - 20px);
  box-sizing: border-box;
}

.favorite-item h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.favorite-item p {
  font-size: 14px;
  color: #555;
}
</style>
