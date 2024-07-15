<!-- 公共弹窗 -->
<template>
    <Teleport to="body">
        <div class="notice_dialog_popup">
            <nut-popup :close-on-click-overlay="false" v-model:visible="show" :z-index="999">

                <div class="notice_dialog_content">
                    <div class="notice_dialog_main" :class="['notice_dialog_' + (noticeList[currIndex] ? noticeList[currIndex].type : '')]">
                        <div class="notice_title">{{ noticeTitle }}</div>

                        <div style="background-color: #fff;padding: 0 30px 20px 30px">
                            <div class="notice_dialog_swiper">
                            <nut-swiper v-if="!loading" style="height: 180px;width:235px;" @change="changSwiper">
                                <nut-swiper-item v-for="(item, i) in noticeList" :key="i" style="height: 180px;">
                                    <div class="notice_dialog_item">
                                        <div class="notice_dialog_title">{{ t(item.title) }}</div>
                                        <div class="notice_dialog_text">{{ t(item.content) }}</div>
                                    </div>
                                </nut-swiper-item>
                            </nut-swiper>
                        </div>

                        <div class="notice_dialog_btn" @click="close">{{ t('home_page_confirm') }}</div>

                        <div class="notice_dialog_tip" @click="checked = !checked">
                            <span style="font-size: 16px;display: flex;flex-direction: column;justify-content: center;">
                                <iconpark-icon v-if="!checked" name="tancicongxqd01"></iconpark-icon>
                                <iconpark-icon v-if="checked" name="tancicongxqd02"></iconpark-icon>
                            </span>
                            <span style="margin-left: 5px;">{{ t('home_page_notice_donttip') }}</span>
                        </div>
                        </div>
                    </div>

                    <div class="dots">
                        <div class="dot" :class="{ 'active_dot': currIndex == i }" :data-id="item.id" v-for="(item, i) in noticeList"
                            :key="i"></div>
                    </div>

                    <div class="close" @click="close">
                        <iconpark-icon name="tongyiconguanb01"></iconpark-icon>
                    </div>
                </div>
            </nut-popup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import pinia from '@/store/index';
import { storeToRefs } from 'pinia';
import { User } from '@/store/user';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userInfo = User(pinia);
const { noticeList } = storeToRefs(userInfo);

// 弹窗状态
const show = ref(false)
const loading = ref(false)
const open = () => {
    show.value = true
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 100)
}
const close = () => {
    if (checked.value) {
        let localIds = []
        try {
            localIds = JSON.parse(localStorage.getItem('readed_notice_ids') || '[]')
        } catch {
            localIds = []
        }
        localIds.push(...noticeList.value.map((item: any) => item.title))

        if (localIds.length > 100) { // 最多保留100条id
            localIds = localIds.slice(localIds.length - 100, localIds.length)
        }

        localStorage.setItem('readed_notice_ids', JSON.stringify(localIds))
    }
    show.value = false
}


// 指示器
const currIndex = ref(0)
const changSwiper = (i: number) => {
    currIndex.value = i
}

// 不再打开
const checked = ref(false)


// type: 公告类型:0=一般公告，1=维护公告，2=系统公告,
const noticeTitleMap: any = {
    0: t('home_page_notice_title'),
    1: t('home_page_notice_fixtitle'),
    2: t('home_page_notice_systitle'),
}
const noticeTitle = computed(() => {
    let tile = t('home_page_notice_title')
    try {
        tile = noticeTitleMap[noticeList.value[currIndex.value].type]
    } catch {
        tile = t('home_page_notice_title')
    }
    return tile
})

defineExpose({
    open,
    close,
})
</script>

<style lang="scss">
.notice_dialog_popup {
    .nut-popup {
        background-color: rgba(0, 0, 0, 0);
    }
}

.notice_dialog_content {
    div {
        box-sizing: border-box;
        user-select: none;
    }

    .notice_dialog_main {
        position: relative;
        border-radius: 12px;
        background-image: url('/imgs/home/notice_bg_0.webp');
        background-repeat: no-repeat;
        background-size: 100% auto;
        width: 283px;
        height: 396px;
        padding: 120px 0 0 0;
        border-radius: 12px;
        overflow: hidden;
        
        .notice_title {
            font-size: 24px;
            font-weight: 900;
            color: #fff;
            position: absolute;
            top: 34px;
            left: 30px;
        }

        .notice_dialog_swiper {
            height: 180px;
            width: 100%;
            margin-bottom: 12px;
        }

        .notice_dialog_btn {
            width: 208px;
            height: 38px;
            flex-grow: 0;
            border-radius: 48px;
            background-color: #5811cb;
            margin: 0 auto;
            font-size: 15px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .notice_dialog_tip {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #a5a5b6;
            margin-top: 13px;
        }

        .notice_dialog_item {
            font-size: 12px;
            height: 100%;
            overflow-y: auto;

            .notice_dialog_title {
                margin-bottom: 10px;
                color: #61617d;
            }
            .notice_dialog_text {
                color: #61617d;

            }
        }

    }

    .notice_dialog_1 {
        background-image: url('/imgs/home/notice_bg_1.webp');
    }

    .notice_dialog_2 {
        background-image: url('/imgs/home/notice_bg_2.webp');
    }

    .dots {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 7px;

        .dot {
            width: 8px;
            height: 8px;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 4px;
            margin: 0 3px;
            transition: all .2s ease;
        }

        .active_dot {
            width: 39px;
        }
    }

    .close {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: solid 2px #fff;
        background-color: rgba(217, 217, 217, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        margin: 22px auto 0 auto;
    }
}
</style>