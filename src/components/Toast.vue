<template>
    <!--Toast 组件-->
    <div class="toast-content" v-if="visible">
        <slot></slot>
    </div>

</template>

<script setup lang='ts'>
import { watch } from 'vue'
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:visible']);
watch(() => props.visible, val => {
    if (val) {
        setTimeout(() => {
            emit('update:visible', false);
        }, 2000);
    }
})


</script>

<style lang='scss' scoped>
.toast-content {
    width: 100%;
    position: fixed;
    top: 45%;
    background: url(/imgs/duihuanmts.webp) center;
    background-size: 100%;
    background-repeat: no-repeat;
    height: 34px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    color: #fff;
    animation: fade 2s ease-in-out 1;

}

@keyframes fade {
    0% {
        top: 45%;
    }

    50% {
        top: 45%;
    }

    100% {
        top: 35%;
        opacity: 0.6;
    }


}
</style>