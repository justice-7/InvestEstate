<script setup>
  import UpdateInfo from "@/components/UpdateInfo.vue";
  import KeywordSection from "@/components/Keyword.vue";
  import LikeItemsSection from "@/components/LikeItem.vue";
  import InquiryListSection from "@/components/UsrList.vue";
</script>

<template>
  <div>
    <div class="main-content">
      <UpdateInfo />
      <KeywordSection />
      <LikeItemsSection />
      <InquiryListSection />
    </div>
  </div>
</template>
    
<style scoped>
  .main-content {
    padding: 20px;
  }
  
  .profile-section,
  .keyword-section,
  .favorites-section,
  .inquiries-section {
    margin-bottom: 20px;
  }
  
  .favorites-section h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .favorite-items {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
</style>
  