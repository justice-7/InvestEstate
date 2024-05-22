<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  item: Object
});
</script>

<template>
  <div class="favorite-item">
    <div class="item-image">
      <img v-if="item && item.aptDeal && item.aptDeal.imageUrls && item.aptDeal.imageUrls.length > 0" :src="item.aptDeal.imageUrls[0]" alt="item image"/>
    </div>
    <div class="item-details">
      <h3 v-if="item && item.aptDeal">{{ item.aptDeal.name }}</h3>
      <p v-if="item && item.aptDeal">가격: {{ item.aptDeal.price }}원</p>
      <div class="item-footer" v-if="item && item.aptDeal">
        <button class="remove-button" @click="$emit('remove', item.aptDeal.aptDealId)">삭제</button>
        <button class="view-button">상세보기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorite-item {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.item-image img {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
}

.item-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 10px;
}

.remove-button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 12px;
}

.view-button {
  padding: 5px 10px;
  border: 1px solid #00bcd4;
  background-color: #fff;
  color: #00bcd4;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}
</style>
