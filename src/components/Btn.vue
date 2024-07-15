<template>
  <!-- 按钮  可设置宽高 -->
  <div class="btn-content" v-shrink-on-click>
    <img src="/imgs/myDiscounts/submitBtn.webp" alt="">
    <div class="submit">
      <slot></slot>
    </div>
  </div>

</template>

<script setup lang='ts'>
import { ref } from 'vue'
const props = defineProps({
  height: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: ''
  },
  fontSize: {
    type: String,
    default: '14px'
  },
})

let height = ref(props.height);
let width = ref(props.width);
let fontSize = ref(props.fontSize);

</script>

<style lang='scss' scoped>
.btn-content {
  position: relative;
  display: inline-block;
  height: v-bind(height);
  width: v-bind(width);

  img {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 10;
  }

  .submit {
    position: absolute;
    z-index: 20;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: v-bind(fontSize);
    color: #ffffff;
    text-wrap: nowrap;
  }

}
</style>