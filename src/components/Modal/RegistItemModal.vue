<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>매물 등록하기</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="address">주소</label>
          <input type="text" id="address" @click="openAddressPopup" v-model="form.address" placeholder="주소" readonly>
        </div>

        <div class="form-group">
          <label for="aptName">아파트 이름</label>
          <input type="text" id="aptName" v-model="form.name" readonly>
        </div>

        <div class="form-group">
          <label for="dongName">동 이름</label>
          <input type="text" id="dongName" v-model="form.dongName" readonly>
        </div>

        <div class="form-group">
          <label for="sidoName">시/도</label>
          <input type="text" id="sidoName" v-model="form.sidoName" readonly>
        </div>

        <div class="form-group">
          <label for="gugunName">구/군</label>
          <input type="text" id="gugunName" v-model="form.gugunName" readonly>
        </div>

        <div class="form-group">
          <label for="jibun">지번</label>
          <input type="text" id="jibun" v-model="form.jibun" readonly>
        </div>

        <!-- 숨긴 부분 시작 -->
        <div v-if="false" class="form-group">
          <label for="lat">위도</label>
          <input type="text" id="lat" v-model="form.lat" readonly>
        </div>

        <div v-if="false" class="form-group">
          <label for="lng">경도</label>
          <input type="text" id="lng" v-model="form.lng" readonly>
        </div>
        <!-- 숨긴 부분 끝 -->

        <div class="form-group">
          <label for="area">평수</label>
          <input type="text" id="area" v-model="form.area" required />
        </div>

        <div class="form-group">
          <label for="price">금액</label>
          <input type="text" id="price" v-model="form.price" required />
        </div>

        <div class="form-group">
          <label for="floor">층수</label>
          <input type="text" id="floor" v-model="form.floor" required />
        </div>

        <div class="form-group">
          <label for="content">내용</label>
          <input type="text" id="content" v-model="form.content" required />
        </div>

        <div class="form-group">
          <label for="imageUrls">이미지 URL</label>
          <textarea id="imageUrls" v-model="form.imageUrls" placeholder="이미지 URL을 쉼표로 구분하여 입력"></textarea>
        </div>

        <button type="submit" class="submit-button" :disabled="isSubmitting">매물 등록하기</button>
        <button type="button" @click="closeModal" class="cancel-button">취소</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from '../../axios';

const emit = defineEmits(['submit', 'close']);

const form = ref({
  address: '',
  name: '',
  dongName: '',
  sidoName: '',
  gugunName: '',
  jibun: '',
  lat: '',
  lng: '',
  area: '',
  price: '',
  floor: '',
  content: '',
  imageUrls: '', // 수정됨: URL을 쉼표로 구분하여 입력
  aptId: null // 추가
});

const isSubmitting = ref(false); // 추가

const submitForm = async () => {
  if (isSubmitting.value) return; // 이미 제출 중이면 리턴
  isSubmitting.value = true; // 제출 시작

  try {
    // imageUrls를 배열로 변환
    const imageUrlsArray = form.value.imageUrls.split(',').map(url => url.trim());
    const formData = { ...form.value, imageUrls: imageUrlsArray };

    emit('submit', formData);
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false; // 제출 완료
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  submitForm();
};

const closeModal = () => {
  emit('close');
};

const handleMessage = async (event) => {
  if (event.origin === window.location.origin && event.data.aptId) {
    form.value.aptId = event.data.aptId; // aptId 저장
    form.value.address = event.data.address;
    try {
      const response = await axios.get('/api/address/details', {
        params: { aptId: event.data.aptId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const details = response.data;
      form.value.name = details.name;
      form.value.dongName = details.dongName;
      form.value.sidoName = details.sidoName;
      form.value.gugunName = details.gugunName;
      form.value.jibun = details.jibun;
      form.value.lat = details.lat;
      form.value.lng = details.lng;
    } catch (error) {
      console.error('Error fetching address details:', error);
    }
  }
};

const openAddressPopup = () => {
  window.open('/address-search-popup', '주소 검색', 'width=600,height=400');
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #4B6EC4;
}

.submit-button,
.cancel-button {
  padding: 12px 20px;
  margin: 10px 5px 0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s;
}

.submit-button {
  background-color: #4B6EC4;
  color: #fff;
}

.submit-button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.submit-button:hover:enabled {
  background-color: #405a9c;
  transform: scale(1.05);
}

.cancel-button {
  background-color: #f44336;
  color: #fff;
}

.cancel-button:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}
</style>
