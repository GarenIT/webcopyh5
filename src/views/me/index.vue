<template>
    <div class="me">
        <userInfo></userInfo>

        <div class="scroll_area">
            <scroll-view class="main_content">
                <relevant></relevant>
                <div class="action_list">
                    <nut-collapse v-model="val">
                        <nut-collapse-item :name="item.name" v-for="item in collapse_list" :key="item.id">
                            <template #icon> <iconpark-icon class="close" icon-id="mineiconfangx02"
                                    size="1.3rem"></iconpark-icon> </template>
                            <template #title>
                                <div class="item_left">
                                    <iconpark-icon class="close mr-4" :icon-id="item.icon"
                                        size="1.3rem"></iconpark-icon>
                                    <span>{{ t(item.label) }}</span>
                                </div>
                            </template>
                            <div style="padding:0 6px">
                                <div class="list-sub_item mb-10" v-shrink-on-click v-for="opt in item.subList"
                                    :key="opt.id" @click="handleClick(opt)">
                                    <div class="item-left">
                                        <iconpark-icon class="close mr-9" :icon-id="opt.icon"
                                            size="1.3rem"></iconpark-icon>
                                        <span>{{ t(opt.label) }}</span>
                                    </div>
                                    <iconpark-icon class="close mr-9" icon-id="mineiconfangx03"
                                        size="1.3rem"></iconpark-icon>
                                </div>
                            </div>

                        </nut-collapse-item>
                    </nut-collapse>
                    <!-- 其他 -->
                    <div class="other_list_item mb-10" v-shrink-on-click v-for="item in list" :key="item.id"
                        @click="goToPage(item)">
                        <div class="item_left">
                            <iconpark-icon :icon-id="item.icon" size="1.3rem" class="mr-4"></iconpark-icon>
                            <span>{{ t(item.label) }}</span>
                        </div>
                    </div>
                </div>
                <!-- 退出登录 -->
                <div class="sign_out" v-if="hasLogin">
                    <Btn height="45px" width="260px" class="submit" @click="signOut">
                        <div class="flex_align_center">
                            <iconpark-icon icon-id="mineiconrcasc06" size="1.3rem" class="mr-4"></iconpark-icon>
                            <span>{{ t('mine_mylogout') }}</span>
                        </div>
                    </Btn>
                </div>
                <!-- <group></group> -->
            </scroll-view>
        </div>
        <!-- 分享弹窗 -->
        <shareModal v-model:visible="visible"></shareModal>
        <!-- 有奖反馈 -->
        <Modal v-model:visible="isShow" :title="t('rewarded_feedback')" @close="content = ''">
            <div class="popup_body">
                <div class="info">请输入您要反馈的信息</div>
                <nut-textarea v-model="content" :placeholder="placeholder" :rows="6" />
                <!-- <div class="submit" v-shrink-on-click>
        确认
      </div> -->
                <div class="submit_btn">
                    <Btn height="44px" v-shrink-on-click width="200px" class="submit" @click="submit">提交</Btn>
                </div>
            </div>
        </Modal>
        <Toast v-model:visible="showToast">{{ t(toast_value) }}</Toast>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import userInfo from './components/userInfo.vue'
import relevant from './components/relevant.vue'
// import group from './components/group.vue'
import ScrollView from '@/components/ScrollView.vue'
import Modal from '@/components/Modal.vue'
import { Net } from '@/net/Net';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetPacket } from '@/netBase/NetPacket';
import { NetMsgType } from '@/netBase/NetMsgType';
import { User } from '@/store/user';
import { Page } from '@/store/page';
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia';
import pinia from '@/store/index';
import { Local } from '@/utils/storage';
import shareModal from './components/shareModal.vue'
import { handleOpenLink } from '@/utils/publicMethods'
import { aaa, bbb } from '@/net/Utils';
import Toast from '@/components/Toast.vue'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const store = User(pinia);
const pageStore = Page(pinia);
const router = useRouter()
const visible = ref(false)
const isShow = ref(false)  // 有奖反馈控制
const content = ref('')
const placeholder = '若反馈的bug被确认为有效bug，则会随机抽取反馈该bug的用户给予奖励'
const { serviceUrlObj, settings } = storeToRefs(pageStore);
const { roleInfo, hasLogin } = storeToRefs(store);
const val = ref([])
const showToast = ref(false)
const toast_value = ref('')
const collapse_list = [
    {
        label: 'records_center', icon: 'mineiconrcasc01', id: 1, name: 'record',
        subList: [{ label: 'recharge_record', icon: 'mineiconrcasc013', id: 1, route: 'recharge_record' }, // 充值记录
        { label: 'mine_mywithdraw', icon: 'mineiconrcasc014', id: 2, route: 'withdraw_record' },  // 提款记录
        { label: 'mine_mybet', icon: 'mineiconrcasc015', id: 3, route: 'bet_record' },  // 投注记录
        { label: 'mine_myaudit', icon: 'mineiconrcasc011', id: 4, route: 'account_record' }, // 账变记录
        { label: 'rakeback_records', icon: 'mineiconrcasc012', id: 5, route: 'audit_record' },// 流水记录
        { label: 'route_page_washRecord', icon: 'mineiconrcasc012', id: 6, route: 'wash_record' },
        ]
    },
    {
        label: 'mine_myservice', icon: 'mineiconrcasc02', id: 2, name: 'service', subList: [
            { label: 'home_page_onlineService', icon: 'mineiconrcasc021', id: 6, url: 'service_live_url' },
            { label: 'Message', icon: 'mineiconrcasc022', id: 7, url: 'service_message_url' },
            { label: 'telegram', icon: 'mineiconrcasc023', id: 8, url: 'service_tg_url' },
        ]
    },
    {
        label: 'app', icon: 'mineiconrcasc03', id: 3, name: 'app', subList: [
            { label: 'share', icon: 'mineiconrcasc031', id: 9 },
            { label: 'download', icon: 'mineiconrcasc032', id: 10 },
        ]
    },
]
const list = [
    { label: 'mine_mypay', icon: 'mineiconrcasc011', id: 1, url: '/paymentManagement' }, // 支付管理
    { label: 'security_setting', icon: 'mineiconrcasc04', id: 2, url: '/securitySettings' }, // 安全设置
    { label: 'rewarded_feedback', icon: 'mineiconrcasc05', id: 3 },  // 有奖反馈
]


// 功能点击
const handleClick = (item: any) => {
    if (item.route) {
        return router.push({
            name: item.route
        })
    }
    switch (item.id) {
        case 1:
            break;
        case 6:  // 在线客服
        case 7:  // Message
        case 8:  // 小飞机
            handleOpenLink(serviceUrlObj.value[item.url])
            break;
        case 9:  // 分享
            visible.value = true
            break;
        case 10:  // 下载
            handleOpenLink(settings.value.appDownTipList.app_down_url)
            break;
        default:
            break;
    }
}

const signOut = async () => {
    Local.remove('user')
    await store.setHasLogin(false)
    await User(pinia).getUserLoginInfo(null)
    await User(pinia).setLoadingEnd(false)
    location.href = '/'
}

const goToPage = (item: any) => {
    if (item.url) {
        router.push(`${item.url}`)
    }
    // 有奖反馈
    if (item.id == 3) {
        isShow.value = true
    }
}
// 有奖反馈提交
const submit = () => {
    if (!content.value) {
        return
    }
    const query = NetPacket.req_submit_suggest();
    query.aaa = aaa;
    query.bbb = bbb;
    query.role_id = roleInfo.value?.id
    query.content = content.value
    Net.instance.sendRequest(query);
}

const notify_suggest = (rs: any) => {
    isShow.value = false
    if (rs.code == 1) {
        toast_value.value = 'bank_success'
        showToast.value = true
    }

}



onMounted(() => {
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_nodify_submit_suggest,
        notify_suggest,
    );
})
onUnmounted(() => {
    // 取消监听
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_nodify_submit_suggest, null);

});

</script>

<style lang='scss' scoped>
.me {
    background-image: radial-gradient(circle at 50% 11%, #361e79, #202137 97%);
    // height: 100vh;
    padding-top: 10px;
    overflow: hidden;

    .scroll_area {
        width: 100%;
        height: 80vh;
        box-sizing: border-box;
    }

    .main_content {
        height: 70vh;
        box-sizing: border-box;
    }
}

.action_list {
    margin-top: 15px;
    padding: 0 15px;

    .item_left {
        display: flex;
        align-items: center;

        img {
            height: 20px;
            margin-right: 4px;
        }

        span {
            color: #FFFFFF;
            font-weight: 500;
            font-size: 13px;
        }
    }

    &:deep(.nut-collapse-item) {
        .nut-collapse__item-wrapper__content {
            padding: unset;
            background: unset;
        }

        .nut-collapse-item__title {
            margin-bottom: 10px;
            height: 45px;
            background: url(/imgs/me/list_bg.webp);
            background-size: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 14px;
            color: #FFFFFF;
            font-weight: 500;
            font-size: 13px;

            &::after {
                border: unset
            }
        }
    }
}

.other_list_item {
    height: 45px;
    background: url(/imgs/me/list_bg.webp);
    background-size: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;

    .item_left {
        display: flex;
        align-items: center;

        img {
            height: 20px;
            margin-right: 4px;
        }

        span {
            color: #FFFFFF;
            font-weight: 500;
            font-size: 13px;
        }
    }

    .arrow {
        height: 16px
    }
}

.list-sub_item {
    height: 43px;
    background: url(/imgs/me/sub_bg.webp);
    background-size: 100%;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    box-sizing: border-box;

    .item-left {
        display: flex;
        align-items: center;

        img {
            height: 20px;
            margin-right: 4px;
        }

        span {
            color: #FFFFFF;
            font-weight: 500;
            font-size: 13px;
        }
    }

    .arrow {
        height: 16px
    }
}

.sign_out {
    display: flex;
    justify-content: center;
    margin-top: 30px;
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

.submit_btn {
    margin: 38px;
    display: flex;
    justify-content: center;
}

.popup_body {
    padding: 15px 15px 10px 15px;

    .info {
        font-size: 12px;
        color: #C0C2DB;
        text-align: left;
        margin-bottom: 6px;
    }

    .nut-textarea {
        box-shadow: 0px 4px 4px 0px #00000040 inset;
        border-radius: 8px;
        border-bottom: unset;
        display: flex;
        justify-content: center;
        background: #27155C;
        background-blend-mode: overlay;
        padding: 10px;
        background: radial-gradient(50% 208.33% at 50% 50%, rgba(126, 126, 126, 0.32) 0%, rgba(21, 21, 21, 0.32) 100%);
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.1) 100%);

        &:deep(.input-text) {
            text-align: center !important;
        }

        &:deep(.nut-textarea__textarea) {
            color: #ffffff
        }
    }
}
</style>