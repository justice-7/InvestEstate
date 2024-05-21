<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import RegistItemModal from '@/components/Modal/RegistItemModal.vue';

const items = ref([
  {
    id: 1,
    name: "OO 아파트",
    description: "서울 특별시 역삼동 테헤란로",
    date: "2024.05.10",
    status: "판매중",
    imageUrls: ["path/to/image1.jpg"],
    liked: false
  },
  {
    id: 2,
    name: "OO 아파트",
    description: "서울 특별시 역삼동 테헤란로",
    date: "2024.05.10",
    status: "판매중",
    imageUrls: ["path/to/image2.jpg"],
    liked: false
  },
  {
    id: 3,
    name: "OO 아파트",
    description: "서울 특별시 역삼동 테헤란로",
    date: "2024.05.10",
    status: "판매중",
    imageUrls: ["path/to/image3.jpg"],
    liked: false
  },
  {
    id: 4,
    name: "OO 아파트",
    description: "서울 특별시 역삼동 테헤란로",
    date: "2024.05.10",
    status: "판매중",
    imageUrls: ["path/to/image4.jpg"],
    liked: false
  },
  {
    id: 5,
    name: "OO 아파트",
    description: "서울 특별시 역삼동 테헤란로",
    date: "2024.05.10",
    status: "판매중",
    imageUrls: ["path/to/image5.jpg"],
    liked: false
  }
]);

const showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const deleteItem = (index) => {
  items.value.splice(index, 1);
};

const viewDetails = () => {
  router.push('/'); // 메인화면(지도를 보여주되 해당 매물 정보 보여주기
};

// 첫 4개 아이템만 반환
const displayedItems = computed(() => {
  return items.value.slice(0, 4);
});

const addItem = (newItem) => {
  items.value.push({
    id: items.value.length + 1,
    name: newItem.address,
    description: newItem.content,
    date: new Date().toISOString().split('T')[0],
    status: '판매중',
    imageUrls: newItem.imageUrls, // 업로드된 이미지 URL 배열 사용
    liked: false
  });
  toggleModal(); // 아이템을 추가한 후 모달 닫기
};
</script>

<template>
  <div class="my-items">
    <div class="header">
      <h2>내 매물 <button class="add-button" @click="toggleModal">+</button></h2>
      <!-- router-link를 사용하여 전체 보기로 네비게이션 -->
      <router-link :to="{ name: 'allItem', params: { items: encodeURIComponent(JSON.stringify(items)) } }">
        <button class="view-all-button">전체 보기</button>
      </router-link>
    </div>
    <div class="items-container">
      <div v-for="(item, index) in displayedItems" :key="item.id" class="item-card">
        <!-- 대표 사진만 보여줌 -->
        <img :src="item.imageUrls[0]" alt="item image" class="item-image" v-if="item.imageUrls.length" />
        <div class="item-details">
          <div class="item-tags">
            <span class="tag">{{ item.status }}</span>
            <button class="delete-button" @click="deleteItem(index)">삭제</button>
          </div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <div class="item-footer">
            <span class="date">{{ item.date }}</span>
            <button class="view-button" @click="viewDetails">상세보기</button>
          </div>
        </div>
      </div>
    </div>
    <RegistItemModal v-if="showModal" @submit="addItem" @close="toggleModal" />
  </div>
</template>

<style scoped>
.my-items {
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  font-size: 18px;
  margin: 0;
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

.view-all-button {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}

.items-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item-card {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.item-image {
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
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 5px;
}

.tag {
  background-color: #00bcd4;
  color: #fff;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 12px;
}

.delete-button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
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
