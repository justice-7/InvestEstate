<script setup>
import { KakaoMap } from 'vue3-kakao-maps';

// props 정의
const props = defineProps({
  aptList: {
    type: Array,
    required: true
  }
});

</script>

<template>
  <!-- <KakaoMap :lat="36.34" :lng="127.77" :level="14" :markerCluster="{ markers: "props.aptList" }" /> -->
  <KakaoMap :lat="33.450701" :lng="126.570667" :markerList="props.aptList" width=100% height="100%" />
</template>