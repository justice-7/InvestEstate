<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['remove']);
</script>

<template>
  <div class="favorite-item">
    <div class="item-image">
      <img v-if="item?.aptInfo?.imageUrls?.length" :src="item.aptInfo.imageUrls[0]" alt="item image"/>
    </div>
    <div class="item-details">
      <h3>{{ item?.aptInfo?.name }}</h3>
      <div class="item-footer">
        <button class="remove-button" @click="$emit('remove', item.aptId)">삭제</button>
        <button class="view-button">상세보기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorite-item {
  width: 250px;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.favorite-item:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.item-image img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 15px;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item-details h3 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 15px;
}

.remove-button {
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.3s ease;
}

.remove-button:hover {
  color: #d9363e;
}

.view-button {
  padding: 8px 12px;
  border: 1px solid #4B6EC4; /* 이미지 색상 */
  background-color: #fff;
  color: #4B6EC4; /* 이미지 색상 */
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.view-button:hover {
  background-color: #4B6EC4; /* 이미지 색상 */
  color: #fff;
}
</style>
