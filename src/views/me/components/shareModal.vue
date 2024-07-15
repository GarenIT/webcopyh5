<template>
    <div class="share_content">
        <!-- 分享弹窗 -->
        <nut-dialog teleport="#app" title="" v-model:visible="isShow">
            <div class="share_img">
                <vue-qr id="qrid" text="http://43.199.35.53:8088/index.html" :size="200" logoSrc="/imgs/me/logo.webp"
                    class="qr_code"></vue-qr>
                <img src="/imgs/me/mask.webp" alt="" class="mask_img">
                <div class="share_bottom">
                    <div class="action" @click="copyClick">
                        <img src="/imgs/me/copy.webp" alt="" v-shrink-on-click>
                        <span>复制链接</span>
                    </div>
                    <div class="action" @click="toSave">
                        <img src="/imgs/me/download.webp" alt="" v-shrink-on-click>
                        <span>保存图片</span>
                    </div>
                </div>
                <img src="/imgs/me/close.webp" @click="isShow = false" alt="" v-shrink-on-click class="close">
            </div>
        </nut-dialog>
        <Toast v-model:visible="showToast">{{ toast_value }}</Toast>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { copyFn } from '@/utils/publicMethods'

const toast_value = ref()
const showToast = ref(false)
const props = defineProps({
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
    set: function (value) {
        emit('update:visible', value);
    },
});

// 复制
const copyClick = () => {
    copyFn('http://43.199.35.53:8088/index.html')
    showToast.value = true
    toast_value.value = '复制成功'

}

// 前往下载
const toSave = () => {
    let picData = document.getElementById('qrid') as HTMLImageElement; //生成二维码之后其实是个img
    if (picData) {
        let a = document.createElement('a');
        a.href = picData.src;
        a.download = `image.png`;
        a.click();
        setTimeout(() => {
            a.remove();
        }, 1000);
    }

}

</script>

<style lang='scss' scoped>
.share_img {
    position: relative;
    height: 100%;

    .close {
        position: absolute;
        bottom: 0px;
        left: 106px;
        height: 28px;
    }

    // width: 236px;
    // height: 159px;
    // background: url(/imgs/me/mask.webp);
    // background-size: 100% 100%;
    // background-repeat: no-repeat;

    .qr_code {
        position: absolute;
        top: 46px;
        left: 33px;
        width: 170px;
        height: 170px;
        z-index: 100;
        border-radius: 12px;
    }
}

.mask_img {
    width: 236px;
    height: 159px;
    position: absolute;
    bottom: 35px;
    left: 0;
    right: 0;
    z-index: 10;

}

.share_bottom {
    width: 236px;
    height: 84px;
    position: absolute;
    bottom: 35px;
    left: 0;
    right: 0;
    z-index: 111;
    background: url(/imgs/me/share_bottom.webp);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    justify-content: space-around;

    .action {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        font-size: 11px;
        color: #ffffff;

        img {
            height: 34px;
        }
    }
}

:deep(.nut-popup) {
    background: unset;
}

:deep(.nut-dialog) {
    padding: unset;
    width: 236px;
    height: 300px;

    .nut-dialog__content {
        margin: unset;
    }

    .nut-dialog__footer {
        display: none;
    }
}
</style>