<script setup>
import { ref, watch } from 'vue';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

const map = ref();
const markerList = ref([]);

// props 정의
const props = defineProps({
  aptList: {
    type: Array,
    default: () => [],
  }
});

const emit = defineEmits(['select-apt']);

const onLoadKakaoMap = async (mapRef) => {
  map.value = mapRef;
};


watch(
  () => props.aptList,
  (newList) => {
    
    markerList.value = newList.map((apt) => ({
      aptId: apt.aptId,
      name:apt.name,
      lat: apt.lat,
      lng: apt.lng,
      visible: false,
      buildYear: apt.buildYear,
      dongCode: apt.dongCode,
      dongName: apt.dongName,
      jibun: apt.jibun,
    }));

    if (markerList.value.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();

      markerList.value.forEach((marker) => {
        bounds.extend(new window.kakao.maps.LatLng(marker.lat, marker.lng));
      });

      map.value.setBounds(bounds);
    }
  }
);


// 클릭한 마커 정보 부모에게 전달
const aptInfo = (apt) => {
  emit('select-apt', apt);
};

const mouseOverKakaoMapMarker = (markerItem) => {
  markerItem.visible = true;
};

const mouseOutKakaoMapMarker = (markerItem) => {
  markerItem.visible = false;
};

</script>

<template>
  <KakaoMap
    :lat="33.450705"
    :lng="126.570667" 
    :draggable="true"
    @onLoadKakaoMap="onLoadKakaoMap"
    style="width: 100%; height: 100%"
    >
      <KakaoMapMarker
        v-for="(marker, index) in markerList"
        :key="index"
        :lat="marker.lat"
        :lng="marker.lng"
        :infoWindow="{ content: marker.name, visible: marker.visible }"
        :clickable="true"

        @mouseOverKakaoMapMarker="mouseOverKakaoMapMarker(marker)"
        @mouseOutKakaoMapMarker="mouseOutKakaoMapMarker(marker)"
        @onClickKakaoMapMarker="aptInfo(marker)"
      />
  </KakaoMap>
</template>

<style scoped>
/* 스타일 코드 */
</style>
