<template>
  <Teleport to="body">
    <!-- 弹窗组件 -->
    <nut-popup v-model:visible="isShow" style="borderRadius:15px;background:transparent" customClass="pop-class">
      <div class="popup-header">
        {{ title }}
        <iconpark-icon icon-id="tongyiconguanb01" size="1.1rem" class="close_icon"
          @click="isShow = false"></iconpark-icon>
      </div>
      <div class="popup-body">
        <slot></slot>
      </div>
    </nut-popup>
  </Teleport>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
// import { useRouter } from 'vue-router'
// import { Net } from '@/utils/net/Net';
// import { MessageEvent2 } from '@/utils/net/MessageEvent2';
// import { NetPacket } from '@/utils/net/NetPacket';
// import { NetMsgType } from '@/utils/net/NetMsgType';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:visible', 'close']);
const isShow = computed({
  get: function () {
    return props.visible;
  },
  set: function (value: any) {
    emit('update:visible', value);
    emit('close');

  },
});




</script>

<style lang='scss' scoped>
.popup-header {
  width: calc(100vw - 30px);
  height: 42px;
  line-height: 42px;
  display: flex;
  justify-content: center;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 15px 15px 0px 0px;
  position: relative;
  font-size: 16px;
  color: #FFFFFF;
  font-weight: 500;
  background: radial-gradient(87.04% 93.77% at 50% 13.97%, #4C36B3 0.17%, #3A2786 74.42%, #3C279A 100%);

  .close_icon {
    position: absolute;
    right: 10px;
    top: 14px;
  }
}

.popup-body {
  min-height: 150px;
  background: #291B64;
}
</style>