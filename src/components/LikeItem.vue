<script setup>
defineProps({
  item: Object
});
</script>


<!-- item 넘겨 주기 -->
<template>
  <div class="favorite-item">
    <!-- <div class="item-image">
      <img :src="item.image" alt="item image" />
    </div>
    <div class="item-details">
      <div class="item-tags">
        <span class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
      </div>
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
      <div class="item-footer">
        <span class="date">{{ item.date }}</span>
        <button class="remove-button" @click="$emit('remove')">삭제</button>
        <button class="view-button">상세보기</button>
      </div>
    </div> -->
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

.item-tags {
  margin-bottom: 5px;
}

.tag {
  background-color: #00bcd4;
  color: #fff;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 12px;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 10px;
}

.date {
  font-size: 12px;
  color: #888;
}

.remove-button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 12px;
  margin-right: 10px;
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