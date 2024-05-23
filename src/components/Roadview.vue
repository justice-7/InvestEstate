<script setup>
import { onMounted, watch } from 'vue';

const props = defineProps({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
});

onMounted(() => {
  var roadviewContainer = document.getElementById('roadview'); // 로드뷰를 표시할 div
  var roadview = new kakao.maps.Roadview(roadviewContainer); // 로드뷰 객체
  var roadviewClient = new kakao.maps.RoadviewClient(); // 좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

  function setRoadview(lat, lng) {
    var position = new kakao.maps.LatLng(lat, lng);
    roadviewClient.getNearestPanoId(position, 50, function(panoId) {
      roadview.setPanoId(panoId, position); // panoId와 중심좌표를 통해 로드뷰 실행
    });
  }

  setRoadview(props.lat, props.lng);

  watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
    setRoadview(newLat, newLng);
  });
});
</script>

<template>
  <div>
    <div id="roadview" class="roadview"></div>
  </div>
</template>

<style scoped>
.roadview {
  width: 100%;
  height: 500px; /* 원하는 높이로 설정 */
}
</style>
