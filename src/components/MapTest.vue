<script setup>
import { ref, watchEffect } from 'vue';
import { KakaoMap } from 'vue3-kakao-maps';

// props 정의
const props = defineProps({
  aptList: {
    type: Array,
    required: true
  }
});

// aptList 데이터 확인 및 변경 감지
watchEffect(() => {
  //console.log('aptList updated:', props.aptList);
  // 여기에 aptList가 변경되었을 때 실행할 코드를 추가합니다.

});
</script>

<template>
  <KakaoMap 
    :lat="36.34" 
    :lng="127.77" 
    :level="14" 
    :markerCluster="{ markers: aptList }" 
    width="100%" 
    height="100%"
  />
</template>

<style scoped>
/* 스타일 코드 */
</style>
