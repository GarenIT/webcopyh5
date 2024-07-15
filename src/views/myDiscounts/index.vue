<template>
    <!-- 我的优惠 -->
    <div class="discount_container">
        <div class="main">
            <nut-tabs v-model="tab_id" title-scroll title-gutter="10">
                <nut-tab-pane :title="t(item.label)" :pane-key="item.id" v-for="(item, g) in tab_list" :key="g">
                </nut-tab-pane>
            </nut-tabs>
            <scroll-view class="main_content">

                <div v-if="filterData.length > 0" :key="filterData.length">
                    <div class="list_item" v-for="item in filterData" :key="item.tag">
                        <div class="left">
                            <div class="left_btn">
                                {{ t(type_obj[item.tag]) }}
                            </div>
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="apply" @click="receiveClick(item)"
                            v-if="['System', 'VIP_related'].includes(item.tag)">
                            {{ t('promo_page_receive') }} </div>
                        <div class="apply" @click="applyClick(item)" v-else>
                            {{ t('offer_apply') }}
                        </div>
                    </div>
                </div>
                <div v-show="filterData.length == 0" class="no_data">
                    {{ t('nomore_data') }}
                </div>
            </scroll-view>
        </div>
        <div>
            <Toast v-model:visible="showToast">{{ toast_value }}</Toast>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { NetPacket } from '@/netBase/NetPacket';
import { Net } from '@/net/Net';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetMsgType } from '@/netBase/NetMsgType';
import { useI18n } from "vue-i18n";
import Toast from '@/components/Toast.vue'
import { Local } from "@/utils/storage";

const { t } = useI18n();
const router = useRouter();
const tab_id = ref(1)
const listData = ref([])
const showToast = ref(false)
const toast_value = ref('')

const tab_list = [
    { label: 'promo_page_all', id: 1 },
    { label: 'promo_page_guDing', id: 'constant' },
    { label: 'promo_page_depositZen', id: 'deposit' },
    { label: 'promo_page_system', id: 'System' },
    { label: 'promo_page_vipZen', id: 'VIP_related' },
]
const type_obj: any = {
    constant: 'promo_page_guDing',
    deposit: 'promo_page_depositZen',
    System: 'promo_page_system',
    VIP_related: 'promo_page_vipZen',
}

const filterData: any = computed(() => {
    const list = listData.value.filter((item: any) => item.tag == tab_id.value)
    return tab_id.value == 1 ? listData.value : list
})


// 获取优惠数据
const handleNotify = (rs: any) => {
    listData.value = rs.promo
}

// 申请
const applyClick = (data: any) => {
    Local.set('curDiscountData', data); // 当前选择的优惠，需要带到充值页面
    router.push('/deposit')
}

// 立即领取
const receiveClick = (item: any) => {
    const query = NetPacket.req_get_email_attachments();
    query.email_id = item.details;
    Net.instance.sendRequest(query);
}

//通知附件领取成功回执
const resultAttachments = (rs: any) => {
    if (rs.email_id) {
        showToast.value = true
        toast_value.value = t('promo_page_applySuc')
        const query = NetPacket.req_activites();
        query.show = 1;
        Net.instance.sendRequest(query);
    }
}

onMounted(() => {
    const query = NetPacket.req_activites();
    query.show = 1;
    Net.instance.sendRequest(query);


    // 回执监听
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_activites,
        handleNotify,
    );
    // 通知附件领取成功
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_get_email_attachments,
        resultAttachments,
    );
});

onUnmounted(() => {
    // 取消监听
    // MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_email_list, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_activites, null)

    // 通知附件领取成功
    MessageEvent2.removeMsgEvent(
        NetMsgType.msgType.msg_notify_get_email_attachments,
        null,
    );
});
</script>

<style lang="scss" scoped>
.discount_container {
    padding: 0 10px 10px;
}

.main {
    &:deep(.nut-tabs__titles .nut-tabs__titles-item) {
        min-width: 50px;
        font-size: 12px;
    }

    // padding: 0 10px;
}


.attention {
    color: #A2A5DE;
    font-size: 12px;
    text-align: center;
}

.list_item {
    height: 47px;
    background-size: 100%;
    background: linear-gradient(180deg, #110D24 -79.5%, #2C205C 59.76%, #261771 107.74%);
    box-shadow: 0px 1px 1px 0px #00000063;

    box-shadow: 0px 2px 2px 0px #00000057;

    box-shadow: 0px 5px 3px 0px #00000033;

    box-shadow: 0px 8px 3px 0px #0000000F;

    box-shadow: 0px 2px 5px 0px #00000057;

    // background: url(/imgs/email/list_bg.webp) center;
    // background-repeat: no-repeat;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    padding: 0 10px;
    margin-top: 10px;

    .left {
        flex: 1;
        display: flex;
        align-items: center;

        .left_btn {
            width: 95px;
            height: 30px;
            box-sizing: border-box;
            border-radius: 4px;
            display: flex;
            font-weight: 700;
            justify-content: center;
            align-items: center;
            box-shadow: 0px 1px 1px 0px #00000063;
            box-shadow: 0px 2px 2px 0px #00000057;
            background: radial-gradient(87.04% 93.77% at 50% 13.97%, #4C36B3 0.17%, #3A2786 74.42%, #3C279A 100%);

        }

        span {
            flex: 1;
            color: #93B4FF;
            font-size: 12px;
            margin-left: 5px;
            margin-right: 1px;

        }
    }

    .apply {
        background: url(/imgs/myDiscounts/apply_btn.png) center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 32px;
        width: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.main_content {
    height: calc(100vh - 150px);
}

.no_data {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    font-size: 24px;
}
</style>
