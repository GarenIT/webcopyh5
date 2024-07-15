<template>
  <!-- 选择银行弹窗 -->
  <div class="deposit_sm_modal">
    <nut-dialog :no-footer="true" :onClosed="listenClose" :visible="showBankModal">
      <div class="form_card">
        <div class="form_container vertical">
          <div class="header rel center">
            <span class="weight_5 ">{{ t('paymentManagement_page_chBank') }}</span>
            <span class="close abs center pointer ">
            </span>
          </div>
          <div class="body vertical center  body_sec">
            <nut-input @input="handleInput" v-model="bankName" :placeholder="t('deposit_page_inputBank')" >
              <template #right>
                <a class="refresh_icon search_icon"></a>
              </template>
            </nut-input>
            <div class="flex f_wrap bank_list">
              <div class="flex align_center bank_item" v-for="(item, index) in bkList" @click="clickBank(item)" :key="index">
                <span class="bank_l_icon">
                   <img :src="`/imgs/bankIcon/bank_logo_${item.value}.webp`" :alt="item.label"/>
                </span>
                <span class="bank_l_name"> {{item.label}} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nut-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, onUnmounted} from 'vue';
import {useI18n} from "vue-i18n";
import { Net } from '@/net/Net';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetPacket } from '@/netBase/NetPacket';
import { NetMsgType } from '@/netBase/NetMsgType';

const props = defineProps({
  isDepositBank: {
    type: Boolean,
    default: () => false
  },
})
const emit = defineEmits(['selectBank']);
const { t } = useI18n();
const showBankModal = ref(false);
const bankName = ref();
// 银行列表
const bkList = ref<any>([]);
const originBkList = ref<any>([]);

const onCloseBank = () => {
  console.log('----', showBankModal.value)
  showBankModal.value = true
}
const getBankList = () => {
  const req = NetPacket.req_bank_name_list();
  Net.instance.sendRequest(req);
};
const handleBankList = (res: any) => {
  console.log('------aaaa', res)
  bkList.value = res.bank_name_list.map((item: any) => {return {value: item.bank_id, label: item.bank_name}});
  originBkList.value = [...bkList.value];
}
// 充值单独用的银行列表
const getDepositBankList = () => {
  const req = NetPacket.req_pay_name_list();
  Net.instance.sendRequest(req);
}
// 充值获取的银行列表
const handleBankAllList = (res: any) => {
  console.log('------bbb', res)
  bkList.value = res.pay_name_list.map((item: any) => { return { value: item.pay_id, label: item.pay_name } });
  originBkList.value = [...bkList.value];
}
// 输入字符串匹配银行
const handleInput = (v: string) => {
  // console.log('----', v)
  v = bankName.value
  if (v) {
    const newArr: any = [];
    originBkList.value.map((item: any) => {
      const str = item.label
      const reg = new RegExp(v, 'i')
      const isHas = str.match(reg)
      if (isHas) {
        newArr.push(item)
      }
    })
    bkList.value = newArr
  } else {
    bkList.value = [...originBkList.value]
  }
}
// 选择银行
const clickBank = (e: any) => {
  showBankModal.value = false;
  emit('selectBank', e)
}

// 监听关闭回调
const listenClose = () => {
  showBankModal.value = false;
}

onMounted(() => {
  if (props.isDepositBank) {
    getDepositBankList();
  } else {
    getBankList();
  }

  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_bank_name_list, handleBankList);
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_pay_name_list, handleBankAllList);
})
onUnmounted(() => {
  // 取消监听
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_req_bank_name_list, null);
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_req_pay_name_list, null);
});


defineExpose({
  onCloseBank
});

</script>

<style lang="scss" scoped>
.deposit_sm_modal {
  // 弹窗重置样式
  :deep(.nut-popup) {
    background: #27155c;
    width: 100%;
    height: 76%;
    bottom: -38%;
    top: auto;
    border-radius: 0;
    .nut-dialog {
      width: 100%;
      padding: 14px 30px 0;

      .nut-dialog__content {
        margin: 0;
        max-height: none;
      }
    }
  }
  .form_card {
    color: #fff;
    font-size: 16px;
    .header {
      text-align: left;
    }
    .body {
      :deep(.nut-input) {
        margin: 14px 0 18px;
        background: #1d0e4a;
        border: 1px solid #322c59;
        border-radius: 8px;
        padding: 9px 8px;
      }
      .refresh_icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url(/imgs/payment/search_icon.webp) center no-repeat;
        background-size: 100%;

      }

    }
  }

    // 选择银行
  .bank_list {
    width: 100%;
    //min-width: 492px;
    margin: 0 auto;
    max-height: 105vw;
    overflow-y: auto;

    .bank_item {
      cursor: pointer;
      font-size: 12px;
      width: 151px;
      height: 39px;
      margin-bottom: 13px;
      background: url(/imgs/payment/bankBg.webp) center no-repeat;
      background-size: 100%;

      &:not(:nth-child(2n+1)) {
        margin-left: 13px;
      }

      &:active {
        transform: scale(.95);
      }
      .bank_l_icon {
        display: flex;
        width: 24px;
        height: 24px;
        margin-left: 6px;
        border-radius: 50%;
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
      .bank_l_name {
        max-width: 105px;
        margin-left: 15px;
      }
    }
  }
}
</style>
