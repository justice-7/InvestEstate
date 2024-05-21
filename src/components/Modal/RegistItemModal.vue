<script setup>
import { ref, defineEmits } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const emit = defineEmits(['submit', 'close']);

const form = ref({
  address: '',
  area: '',
  price: '',
  floor: '',
  year: '',
  household: '',
  content: '',
  imageUrls: [] // 여러 개의 이미지 URL을 저장하기 위한 배열
});

const editorOptions = ref({
  placeholder: '내용을 입력하세요. 사진이나 영상을 업로드할 수 있습니다.',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'video'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  },
});

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        form.value.imageUrls.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }
};

const submitForm = () => {
  emit('submit', { ...form.value });
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>매물 등록하기</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="address">주소</label>
          <input type="text" id="address" v-model="form.address" required />
        </div>

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
          <label for="year">준공년월</label>
          <input type="text" id="year" v-model="form.year" required />
        </div>

        <div class="form-group">
          <label for="household">세대수</label>
          <input type="text" id="household" v-model="form.household" required />
        </div>

        <div class="form-group">
          <label for="content">내용</label>
          <quill-editor v-model="form.content" ref="quillEditor" :options="editorOptions"></quill-editor>
        </div>

        <div class="form-group">
          <label for="image">사진 업로드</label>
          <input type="file" id="image" multiple @change="handleFileUpload" />
        </div>

        <div class="thumbnails">
          <div v-for="(image, index) in form.imageUrls" :key="index" class="thumbnail">
            <img :src="image" alt="Uploaded image" />
          </div>
        </div>

        <button type="submit" class="submit-button">매물 등록하기</button>
        <button type="button" @click="closeModal" class="cancel-button">취소</button>
      </form>
    </div>
  </div>
</template>

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
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input[type="text"],
input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.quill-editor {
  height: 300px;
}

.thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.submit-button,
.cancel-button {
  padding: 12px 20px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  background-color: #4caf50;
  color: #fff;
}

.submit-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #f44336;
  color: #fff;
}

.cancel-button:hover {
  background-color: #e53935;
}
</style>
