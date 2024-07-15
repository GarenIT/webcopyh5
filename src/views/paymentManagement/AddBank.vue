<template>
  <div class="addBank_sm_modal">
    <nut-action-sheet v-model:visible="showAddModal">
      <div class="body vertical center  body_sec">
        <nut-form label-position="top" ref="formRef" class="">
          <div class="flex space_between add_title">
            <span>{{ t('paymentManagement_page_add_one_bank') }}</span>
            <span class="close_icon" @click="closeAddBankModal"></span>
          </div>
          <nut-form-item :label="t('addBank_page_pChooseBank')">
            <div class="flex space_between choose_bank">
              <div class="flex align_center choose_bank_l">
                <span class="bank_cicon" v-if="chooseBank.value"> <img
                    :src="`/imgs/bankIcon/bank_logo_${chooseBank.value}.webp`" :alt="chooseBank.label" /> </span>
                <span class="bank_cname"> {{ chooseBank.label }} </span>
              </div>
              <nut-button :bordered="false" class="change_btn" @click="showChangeBank"> {{ t('deposit_page_changeWay')
                }} </nut-button>
            </div>
          </nut-form-item>
          <nut-form-item :label="t('addBank_page_bankCard')">
            <nut-input v-model.trim="form.cardNo" :placeholder="t('paymentManagement_page_chCardNo')" clearable />
          </nut-form-item>
          <nut-form-item :label="t('addBank_page_name')">
            <nut-input v-model.trim="form.name" :disabled="!!props.myBankName"
              :placeholder="t('paymentManagement_page_chName')" clearable />
          </nut-form-item>

          <div class="btn_zone flex ">
            <nut-button class="submit_btn  weight_5 center pointer" :disabled="loading" block @click="onSubmit">{{
      t('home_page_confirm') }}</nut-button>
          </div>
          <div v-show="!(form.bank && form.cardNo && form.name)" class="cz-tips">
            <div class="flex align_center justify_center tip">
              <span class="icon"></span>
              <span> {{ t('paymentManagement_page_error_msg') }} </span>
            </div>
          </div>
        </nut-form>
        <div v-if="myBankList?.length > 0" class="flex align_center bottom_tip">
          <span class="gth-icon"></span>
          {{ t('paymentManagement_page_max_bank', {num: myBankList?.length || 0}) }}
        </div>
      </div>
    </nut-action-sheet>
    <!-- 选择银行弹窗 -->
    <chooseBankDialog ref="chooseBankModal" @selectBank="selectBank" />
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from "vue-i18n";
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { Net } from '@/net/Net';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetPacket } from '@/netBase/NetPacket';
import { NetMsgType } from '@/netBase/NetMsgType';
import { showToast } from '@nutui/nutui';
import chooseBankDialog from '../deposit/chooseBankDialog.vue';

const emit = defineEmits(["getMyBindBankList"]);
const props = defineProps({
  myBankName: {
    type: String,
    default: () => ''
  },
  myBankList: {
    type: Array,
    default: () => []
  }
})
const { t } = useI18n();
const showAddModal = ref(false);
const chooseBankModal = ref();

// 提交参数
const dataParams = {
  // currency: null,
  bank: '',
  cardNo: '',
  name: '',
  code: '',
}
const form = ref( // 表单提交
  { ...dataParams }
);
const loading = ref(false);// 是否提交中
const chooseBank = ref({ label: '', value: '' }); // 选择的银行卡

const onSubmit = () => {
  // 第二次绑定银行卡需要验证是否已绑定手机号
  // if (!userInfo.value.mobile && props.myBankName) {
  //   return Message.error(t('addBank_page_notPhone'))
  // }
  if (!form.value.bank) {
    return showToast.fail(t('paymentManagement_page_chBank'))
  }
  if (!form.value.cardNo) {
    return showToast.fail(t('paymentManagement_page_chCardNo'))
  }
  if (!form.value.name) {
    return showToast.fail(t('paymentManagement_page_chName'))
  }
  // 第二次绑定银行卡需要验证是否输入验证码
  // if (!form.data.code && props.myBankName) {
  //   return Message.error(t('home_page_enterVerificationCode'))
  // }
  handleSubmit()
};
// 绑定银行卡提交
const handleSubmit = () => {
  const req = NetPacket.req_new_bank_card_info();
  req.bank_id = form.value.bank;
  req.account_number = form.value.cardNo;
  req.cardholder_name = form.value.name;
  Net.instance.sendRequest(req);
};
// result: 2 // 1 成功，2 失败
const handleAddBank = (res: any) => {
  if (res.result === 1) {
    closeAddBankModal();
    emit('getMyBindBankList'); // 刷新列表
    showToast.success(t('paymentManagement_page_addBankSuc'))
  } else {
    showToast.fail(t('paymentManagement_page_addBankFail'))
  }
}
const setBaseData = () => {
  // 已经有绑定过银行卡，需要验证手机验证码
  // if (props.myBankName) {
  //   form.fields.code.showRight = true
  // }
  form.value.name = props.myBankName;
}

const showAddBankModal = () => {
  showAddModal.value = true
}
const closeAddBankModal = () => {
  showAddModal.value = false
}
// 打开银行弹窗
const openChooseBank = () => {
  chooseBankModal.value.onCloseBank();
}
// 更换银行弹窗
const showChangeBank = () => {
  openChooseBank();
}

// 选择银行
const selectBank = (e: any) => {
  form.value.bank = e.value;
  chooseBank.value = e;
}

watch(
  () => showAddModal.value,
  (n) => {
    if (n) { // 重置
      form.value.bank = '';
      form.value.cardNo = '';
      chooseBank.value = { label: '', value: '' };
    }
  }
)
onMounted(() => {
  // getBankList();
  setBaseData();
  // MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_bank_name_list, handleBankList);
  // 绑定银行卡
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_new_bank_card_info, handleAddBank);
  // 监听手机号验证码返回
  // MessageEvent2.addMsgEvent(
  //     NetMsgType.msgType.msg_notify_get_mobile_sms_code,
  //     handleSMSback
  // );
})
onUnmounted(() => {
  // 取消监听
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_req_bank_name_list, null);
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_req_new_bank_card_info, null);
  // MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_get_mobile_sms_code, null);
})

defineExpose({
  showAddBankModal
});

</script>

<style lang='scss' scoped>
.addBank_sm_modal {
  color: #fff;

  // 弹窗重置样式
  :deep(.nut-popup) {
    border-radius: 0;
  }

  :deep(.nut-action-sheet) {
    background: #27155c;
    width: 100%;
    height: 80vh;
    bottom: 0;
    top: auto;
  }

  .body {
    padding: 20px 10px 0;

    form {
      padding: 16px 20px;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
      background-blend-mode: color-burn, overlay, normal;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), radial-gradient(circle at 50% 50%, #7e7e7e, #151515 73%), linear-gradient(to bottom, #27155c, #27155c);

      .add_title {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        .close_icon {
          width: 18px;
          height: 18px;
          background: url(/imgs/payment/close_icon.webp) center no-repeat;
          background-size: 100%;
        }
      }

      :deep(.nut-cell-group__wrap) {
        box-shadow: none;
        background: none;
        margin: 0;

        .nut-cell {
          background: none;
          padding: 0;
          margin-bottom: 14px;

          &::after {
            border: none;
          }

          &.nut-form-item {
            .nut-input {
              width: 100%;
              background: #1d0e4a;
              border: 1px solid #322c59;
              border-radius: 8px;
              padding: 9px 8px;
            }

          }
        }
      }

      .choose_bank_l {
        width: 195px;
        height: 39px;
        padding-left: 6px;
        background: url(/imgs/payment/inputBg.webp) center no-repeat;
        background-size: 100%;

        .bank_cicon {
          width: 28px;
          height: 28px;
          margin-right: 8px;
          border-radius: 50%;
          background: #fff;
          border: solid 1.5px #d6cdff;

          img {
            width: 26px;
            height: 26px;
            border-radius: 50%;
          }
        }

        .bank_cname {
          line-height: 16px;
        }
      }

      .change_btn {
        margin-left: 10px;
        border-radius: 0;
        font-size: 16px;
        color: #fff;
        text-align: center;
        width: 110px;
        height: 39px;
        line-height: 39px;
        background: url('/imgs/payment/go-btn.webp') center no-repeat;
        background-size: 100%;
        padding: 0;
        border: 0;
      }

    }

    .bottom_tip {
      padding: 13px 20px;
      font-size: 12px;
      color: #c0c2db;

      .gth-icon {
        margin-right: 4px;
        width: 12px;
        height: 12px;
        background: url(/imgs/payment/gth.webp) center no-repeat;
        background-size: 100%;
      }
    }

    .btn_zone {

      .submit_btn {
        color: #fff;
        margin: 20px auto 10px;
        font-size: 16px;
        border: 0;
        width: 200px;
        height: 43px;
        border-radius: 12px;
        background: url(/imgs/payment/sub_btn.webp) center no-repeat;
        background-size: cover;
      }
    }

  }

  .body_sec {
    .cz-tips {
      font-size: 12px;
      text-align: center;
      color: #D16363;

      .tip {
        line-height: 10px;

        .icon {
          margin-right: 4px;
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url(/imgs/payment/error_icon.webp) center no-repeat;
          background-size: 100%;
        }
      }
    }
  }

}
</style>
