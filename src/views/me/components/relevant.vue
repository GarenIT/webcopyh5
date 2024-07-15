<template>
  <div class="me_relevant">
    <div class="item  mb-12" v-for="item in listData" :key="item.id" v-shrink-on-click @click="handleClick(item.id)">
      <div class="mine_code">{{ t(item.label) }}</div>
      <div class="item_icon item_email">
        <nut-badge :dot="myEmail.hasNoRead" color="#E11313" top="10" :hidden="item.id != 1">
          <iconpark-icon :icon-id="item.icon_id" size="2.3rem"></iconpark-icon>
        </nut-badge>
      </div>

    </div>
  </div>

  <Modal v-model:visible="isShow" :title="t('redeem_enter_code')" @close="code = ''">
    <div class="popup_body">
      <div class="info">{{ t('redeem_tip') }}</div>
      <nut-input v-model="code" :placeholder="t('redeem_enter_code')" />
      <!-- <div class="submit" v-shrink-on-click>
        确认
      </div> -->
      <div class="submit_btn">
        <Btn height="44px" width="200px" class="submit" @click="checkCode">{{ t('confirm') }}</Btn>
      </div>
    </div>
  </Modal>
  <Toast v-model:visible="showToast">{{ t(toast_value) }}</Toast>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'
import Modal from '@/components/Modal.vue'
import Btn from '@/components/Btn.vue'
import { User } from '@/store/user';
import { storeToRefs } from 'pinia';
import pinia from '@/store/index';
// import { showNotify } from '@nutui/nutui'
import Toast from '@/components/Toast.vue'
import { NetPacket } from '@/netBase/NetPacket';
import { Net } from '@/net/Net';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetMsgType } from '@/netBase/NetMsgType';
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const store = User(pinia);
const { myEmail } = storeToRefs(store);
const isShow = ref(false)
const router = useRouter()
const code = ref()
const showToast = ref(false)
const toast_value = ref('')

const listData = [
  { label: 'input_label_email', icon_id: 'mineiconmfra01', id: 1 },
  { label: 'mine_myoffer', icon_id: 'mineiconmfra02', id: 2 },
  { label: 'mine_code', icon_id: 'mineiconmfra03', id: 3 },
  { label: 'mine_mydelegate', icon_id: 'mineiconmfra04', id: 4 },
]


//  点击
const handleClick = (num: number) => {
  switch (num) {
    case 1:  // 邮箱
      router.push('/email')
      break;
    case 2:  // 我的优惠
      router.push('/myDiscounts')
      break;
    case 3:  // 兑换码
      isShow.value = true
      break;
    case 4:  // 代理合作
      router.push('/agencyCooperation')

      break;

    default:
      break;
  }

}

// 输入兑换码确定
const checkCode = () => {
  if (!code.value) {
    return
  }
  const query = NetPacket.req_exchange();
  query.code = code.value
  Net.instance.sendRequest(query);
}


/**
 * @description  对应返回result  1-8  参数
 * "invalid_ID": "角色不存在",
 *  "redeem_cannot_be_swap": "推广不能充值",
    "exceeded_daily_limit": "超过当天兑换次数限制",
    "activity_not_open": "活动未开始",
    "code_does_not_exist": "兑换码不存在",
    "code_already_used": "该码已经被领取完了",
    "code_exceeded_limit": "该码的领取次数超过限制",
    "code_can_only_used_once": "抱歉，此充值码只能使用一次",
 */
const notify_exchange = (rs: any) => {
  const type_str: any = {
    0: 'bank_success',
    1: 'invalid_ID',
    2: 'redeem_cannot_be_swap',
    3: 'exceeded_daily_limit',
    4: 'activity_not_open',
    5: 'code_does_not_exist',
    6: 'code_already_used',
    7: 'code_exceeded_limit',
    8: 'code_can_only_used_once',

  }
  toast_value.value = type_str[rs.result]

  showToast.value = true
  if (rs.result == 0) {  // 兑换成功
    isShow.value = false
  }
}

onMounted(() => {
  // email_readed.value = myEmail.value.email_readed;
  // 回执监听
  // 监听邮件已读
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_exchange,
    notify_exchange,
  );

});

onUnmounted(() => {
  // 取消监听
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_exchange, null);

});



</script>

<style lang='scss' scoped>
.me_relevant {
  padding: 0px 15px;
  display: flex;
  flex-wrap: wrap;

  .item {
    background-image: url(/imgs/me/action_bg.webp);
    background-size: 100% 100%;
    height: 70px;
    width: 166px;
    // line-height: 70px;
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
    padding-left: 13px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;

    &:nth-child(1) {
      margin-right: 10px;
    }

    &:nth-child(3) {

      margin-right: 10px;
    }

    .item_icon {
      position: absolute;
      right: 12px;
      height: 32px;
      bottom: 8px;
    }

    .mine_code {
      width: 90px;
      // word-break: break-all
    }

    .item_email {
      bottom: 13px;
    }
  }
}

.submit_btn {
  margin: 38px;
  display: flex;
  justify-content: center;
}




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

.popup_body {
  padding: 50px 15px 20px 15px;

  .info {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
    margin-bottom: 50px;
  }

  .nut-input {
    box-shadow: 0px 4px 4px 0px #00000040 inset;
    border-radius: 8px;
    border-bottom: unset;
    display: flex;
    justify-content: center;
    background: #27155C;
    background-blend-mode: overlay;
    background: radial-gradient(50% 208.33% at 50% 50%, rgba(126, 126, 126, 0.32) 0%, rgba(21, 21, 21, 0.32) 100%);
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.1) 100%);

    &:deep(.input-text) {
      text-align: center !important;
    }


  }

}
</style>