<template>
  <div class="form-select-wrap">
    <div class="form-select" @click="selectClick">
      <span>{{ selectItem?.label }}</span>
      <iconpark-icon name="signicon09" color="#ebe9f3" size="20" class="refresh"
                     :class="{ rotate: isSelect }"></iconpark-icon>
    </div>
    <div class="options-box" v-if="isSelect">
      <div
          class="option"
          :class="{ active: item.value === selectValue }" v-for="item in options"
          @click="optionClick(item.value)">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Options {
  label: string,
  value: string | number
}

const props = defineProps<{
  options: Options[]
}>()
const emits = defineEmits(["change"])

// 选中option的value
const selectValue = defineModel()
// 选中的option
const selectItem = computed(() => {
  return props.options.find(item => item.value == selectValue.value)
})

const isSelect = ref(false)
const selectClick = () => {
  isSelect.value = !isSelect.value
}

const optionClick = (value: string | number) => {
  isSelect.value = false
  if (value === selectValue.value) return
  selectValue.value = value
  emits("change")
}
</script>

<style scoped lang="scss">
.form-select-wrap {
  flex: 1;
  position: relative;
  span{
    display: flex;
    align-items: center;
  }

  .form-select {
    box-sizing: border-box;
    width: 96%;
    height: 24px;
    border-radius: 5px;
    margin-left: 6px;
    display: flex;
    color: #ffffff;
    padding: 2px 5px;
    position: relative;
    z-index: 10;
    justify-content: space-between;
    background: radial-gradient(87.04% 93.77% at 50% 13.97%, #4C36B3 0.17%, #3A2786 74.42%, #3C279A 100%);
  }

  .options-box {
    position: absolute;
    right: -5px;
    left: 5px;
    height: 100px;
    border-radius: 12px;
    background: rgba(51, 29, 143, 0.9);
    z-index: 100;
    padding: 5px 0;
    overflow: auto;

    .option {
      padding: 3px 0 5px;
      margin: 0 5px 3px;
      position: relative;
      font-size: 12px;

      &::after {
        content: "";
        width: 100%;
        height: 1px;
        opacity: 0.5;
        background-image: linear-gradient(to right, rgba(172, 177, 186, 0) 0%, #c8ccd2 50%, rgba(144, 149, 156, 0) 100%);
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }

    & > .option:last-child {
      &::after {
        display: none;
      }
    }
  }

  .active {
    color: #fff;
  }

  .refresh {
    transition: .3s;
  }

  .rotate {
    transform: rotate(180deg);
  }
}
</style>