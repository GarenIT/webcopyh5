<template>
    <div class="email_container">
        <div class="main">
            <div class="tab">
                <div :class="{ tab_ac: tab_id == 1 }" @click="tab_id = 1">{{ t('message_center') }}</div>
                <div :class="{ tab_ac: tab_id == 2 }" @click="tab_id = 2">{{ t('reward_email') }}</div>
            </div>

            <div class="attention mt-10">
                {{ t('7_days') }}
            </div>

            <div v-if="myEmail[tab_id == 1 ? 'list' : 'rewardList'].length > 0">
                <div class="list_item" v-shrink-on-click v-for="item in myEmail[tab_id == 1 ? 'list' : 'rewardList']"
                    :key="item.email_id" @click="viewInfo(item)">
                    <div class="left">
                        <iconpark-icon class="close mr-9" icon-id="youxiconyxbt02" size="2rem"></iconpark-icon>
                        <nut-badge :dot="isDot(item)" color="#E11313" right="-5">
                            <span>{{ item.title }}</span>
                        </nut-badge>

                    </div>
                    <div>{{ getTime(item.recv_time) }}</div>

                </div>
            </div>
            <div v-else class="no_data">
                {{ t('nomore_data') }}
            </div>
        </div>
        <div>
        </div>
        <Modal v-model:visible="isShow" title="邮件标题">
            <div class="popup_body">
                <div>
                    <span class="title"> {{ t('email_title') }}</span>
                    <div class="content">{{ itemInfo?.title }}</div>
                </div>
                <div class="mt-12">
                    <span class="title">{{ t('email_content') }}</span>
                    <div class="content h_150">{{ itemInfo?.content }}</div>
                </div>
                <div class="mt-12" v-if="tab_id == 2">
                    <span class="title mb-8">{{ t('attachment') }}</span>
                    <div class="content email_file">
                        <div class="flex_align_center">
                            <img src="/imgs/email/dollar.webp" alt="">
                            <span> <nut-price :price="itemInfo?.attachments[0].award_value" size="small"
                                    style="color:#fff;" :decimal-digits="0" thousands :need-symbol="false" /></span>
                        </div>
                        <Btn height="32px" width="99px" class="submit mr-2" v-if="!receive_email_id" @click="getAward">
                            {{ t('vip_collect') }}</Btn>
                        <span class="mr-5" v-else> {{ t('received') }}</span>


                    </div>
                </div>

                <div class="submit_btn">
                    <Btn height="44px" width="200px" class="submit" @click="isShow = false">{{ t('confirm') }}</Btn>
                </div>
            </div>
        </Modal>
        <Toast v-model:visible="showToast">{{ t(toast_value) }}</Toast>
    </div>
</template>

<script setup lang="ts">
// import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from 'vue'
import { User } from '@/store/user';
import { storeToRefs } from 'pinia';
import pinia from '@/store/index';
import Modal from '@/components/Modal.vue'
import { NetPacket } from '@/netBase/NetPacket';
import { Net } from '@/net/Net';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetMsgType } from '@/netBase/NetMsgType';
import Toast from '@/components/Toast.vue'
// import { showNotify } from '@nutui/nutui'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const store = User(pinia);
const { myEmail } = storeToRefs(store);
const isShow = ref(false)
// const router = useRouter();
const tab_id = ref(1)
const itemInfo = ref();
const receive_email_id = ref();
const showToast = ref(false)
const toast_value = ref('')

// 邮件查看详情
const viewInfo = (item: any) => {
    isShow.value = true;
    itemInfo.value = item;
    if (!myEmail.value.email_readed.includes(item.email_id)) {
        const query = NetPacket.req_read_email();
        query.email_id = item.email_id;
        Net.instance.sendRequest(query);
    }
};
// 附件领取
const getAward = () => {
    const query = NetPacket.req_get_email_attachments();
    query.email_id = itemInfo.value.email_id;
    Net.instance.sendRequest(query);
};




const getTime = (value: any) => {
    return `${value.year}-${setZero(value.month)}-${setZero(value.day)} ${setZero(value.hour)}:${setZero(value.minute)}:${setZero(value.second)}`;
};

const setZero = (value: any) => {
    return value > 9 ? value : '0' + value;
};

// 邮件是否未读
const isDot = (item: any) => {
    return !myEmail.value.email_readed.includes(item.email_id)
}
//邮箱已读
const resultRead_email = (rs: any) => {
    let email_id;
    if (rs.email_id.indexOf('-') > -1) {
        email_id = rs.email_id.slice(1)
    } else {
        email_id = rs.email_id
    }

    if (!myEmail.value.email_readed.includes(email_id)) {
        myEmail.value.email_readed.push(email_id);
    }
    const sb = new Set(myEmail.value.email_readed);
    myEmail.value.hasNoRead = myEmail.value.email_id_list.some((x: any) => !sb.has(x))
};

//通知附件领取成功回执
const resultAttachments = (rs: any) => {
    receive_email_id.value = rs.email_id
    if (rs.email_id) {
        toast_value.value = 'bank_success'
        showToast.value = true
    }
}



onMounted(() => {
    // email_readed.value = myEmail.value.email_readed;
    // 回执监听
    // 监听邮件已读
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_read_email,
        resultRead_email,
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
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_read_email, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_get_email_attachments, null);
});

</script>

<style lang="scss" scoped>
.email_container {
    padding: 0 10px 10px;

    .top {
        box-sizing: border-box;

        // width: 99%;
        height: 45px;
        background: radial-gradient(87.04% 93.77% at 50% 13.97%, #4C36B3 0.17%, #3A2786 74.42%, #3C279A 100%);
        box-shadow: 0px 1px 1px 0px #00000063;

        box-shadow: 0px 2px 2px 0px #00000057;

        box-shadow: 0px 5px 3px 0px #00000033;

        box-shadow: 0px 8px 3px 0px #0000000F;

        box-shadow: 0px 4px 4px 0px #00000066;
        border-radius: 12px;
        display: flex;
        align-items: center;
        color: #ffffff;
        position: relative;
        padding-left: 10px;

        img {
            height: 40px
        }

        span {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);

        }
    }
}

.main {
    // padding: 0 10px;
}

.tab {
    margin-top: 16px;
    background: url(/imgs/email/nav_bar.webp) center;
    background-size: 100%;
    background-repeat: no-repeat;
    height: 45px;
    display: flex;
    align-items: center;
    padding: 0 4px;

    div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #C0C2DB;
    }

    .tab_ac {
        background: url(/imgs/email/email_btn.webp) center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
        height: 34px;
        // margin-top: 5px;
    }
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
        display: flex;
        align-items: center;

        img {
            margin-bottom: -12px;
        }
    }
}

.no_data {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    font-size: 24px;
}

.popup_body {
    padding: 15px;
}

.title {
    color: #C0C2DB;
    font-size: 12px;
    margin-bottom: 8px;
    display: inline-block;
}

.content {
    padding-left: 15px;
    height: 36px;
    display: flex;
    color: #ffffff;
    align-items: center;
    border-radius: 8px;
    background: #27155C;
    box-shadow: 0px 4px 4px 0px #00000040 inset;
}

.email_file {
    display: flex;
    justify-content: space-between;

    img {
        height: 20px;
        width: 20px;
    }
}

.h_150 {
    min-height: 150px;
    padding: 15px;
    align-items: flex-start;
}

.submit_btn {
    display: flex;
    justify-content: center;
    margin: 30px;

}
</style>
