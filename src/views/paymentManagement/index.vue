<template>
  <div class="content">
    <scroll-view class="main-content">
      <div class="bank_list">
        <div :class="`flex align_center space_between bank_list_item ${index === 0 ? 'active' : ''}`" v-for="(item, index) in myBankList" :key="index">
          <div class="flex align_center list_item_l">
            <img :src="`/imgs/bankIcon/bank_logo_${item.bank_id}.webp`" />
          </div>
          <div class="list_item_c">
            <div class="flex space_between list_item_c_top">
              <span> {{item.bank_name}} </span>
              <span> {{maskNameString(myBankName)}} </span>
            </div>
            <div class="list_item_c_bottom">
              {{maskString(item.account_number)}}
            </div>
          </div>
          <div class="flex align_center f_wrap list_item_r">
            <span v-if="index === 0" class="flex align_center justify_center"> {{ t('paymentManagement_page_default_bank') }} </span>
            <template v-else>
              <span class="flex align_center justify_center sh_color" @click="removeBank(item)"> {{ t('paymentManagement_page_delete') }} </span>
              <span class="flex align_center justify_center mr_color" @click="doDefaultBank(item)"> {{ t('paymentManagement_page_set_default') }} </span>
            </template>
          </div>
        </div>

        <div v-if="myBankList?.length < 6" class="flex f_wrap align_center justify_center bank_list_item add_bank" @click="openAddBank">
          <div class="add_icon"></div>
          <div>{{ t('paymentManagement_page_new_bank') }}</div>
        </div>

        <div v-if="myBankList?.length > 0" class="flex align_center bottom_tip">
          <span class="gth-icon"></span>
          {{ t('paymentManagement_page_max_bank', {num: myBankList?.length || 0}) }}
        </div>
      </div>
    </scroll-view>
    <!-- 删除弹窗 -->
    <Modal v-model:visible="showDelBankRef" :title="t('paymentManagement_page_tips')">
      <div class="popup_body">
        <div class="form_card">
          <div class="form_container vertical">
            <div class="body vertical center">
              {{operateType === 'del' ? t('paymentManagement_page_tipContent') : t('paymentManagement_page_set_xw_default')}}
            </div>
          </div>
        </div>
        <div class="submit_btn flex justify_center">
          <Btn :disabled="loading" height="44px" width="200px" @click="operateBank" class="submit">{{t('home_page_confirm')}}</Btn>
        </div>
      </div>
    </Modal>
    <!-- 添加银行弹窗 -->
    <AddBank ref="addMyBankModal" v-if="showAddBankRef" @getMyBindBankList="getMyBankList" :myBankName="myBankName" :myBankList="myBankList" />

  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {onMounted, onUnmounted, ref} from "vue";
import {MessageEvent2} from "@/net/MessageEvent2";
import {NetMsgType} from "@/netBase/NetMsgType";
import {Net} from "@/net/Net";
import {NetPacket} from "@/netBase/NetPacket";
import {showToast} from "@nutui/nutui";
import ScrollView from "@/components/ScrollView.vue";
import Modal from "@/components/Modal.vue";
import Btn from "@/components/Btn.vue";
import AddBank from './AddBank.vue';

const { t } = useI18n();
const addMyBankModal = ref();
const showDelBankRef = ref(false);
const showAddBankRef = ref(false);
const myBankList = ref();
const myBankName = ref(); // 如果有已经绑定的银行卡姓名，下次绑定需要一致
const loading = ref(false)
const curOperate = ref({}); // 当前操作的数据
const operateType = ref(); // 操作类型，del 删除，default 设为默认银行卡

// 获取已绑定的银行账号
const getMyBankList = () => {
  loading.value = true
  const req = NetPacket.req_bank_card_info_list();
  Net.instance.sendRequest(req);
}
const handleMyBankList = (res: any) => {
  console.log('------99', res)
  setTimeout(() => {
    loading.value = false
  }, 300)
  myBankName.value = res.cardholder_name || '';
  showAddBankRef.value = true;
  myBankList.value = res.bank_card_info_list.reverse();
}
// 删除银行
const removeBank = (item: any) => {
  operateType.value = 'del';
  showDelBankRef.value = true;
  curOperate.value = item;
  console.log(item);
};
const operateBank = (item: any) => {
  item = curOperate.value;
  loading.value = true
  let req;
  if (operateType.value === 'del') { // 删除
    req = NetPacket.req_del_bank_card_info();
  } else { // 设为默认银行卡
    req = NetPacket.req_set_default_bankcard();
  }
  req.bankcard = `${item.bank_id}_${item.account_number}`;
  Net.instance.sendRequest(req);
}
const handleDelBankList = (res: any) => {
  loading.value = false;
  showDelBankRef.value = false
  if (res.result === 0) {
    showToast.success(t('proxy_page_caoZuo'))
    getMyBankList();
  } else {
    showToast.fail(t('proxy_page_caoZuoFail'))
  }
}
// 设置默认银行
const doDefaultBank = (item: any) => {
  operateType.value = 'default';
  showDelBankRef.value = true;
  curOperate.value = item;
};
// 设置默认银行
const handleDefaultBank = (res: any) => {
  loading.value = false;
  showDelBankRef.value = false
  if (res.rlt === 0) {
    showToast.success(t('proxy_page_caoZuo'))
    getMyBankList();
  } else {
    showToast.fail(t('proxy_page_caoZuoFail'))
  }
}

// 银行卡，显示前3位和后4位
const maskString = (str: any) => {
  if (str.length <= 7) {
    return str.replace(/./g, "***");
  }
  return str.substr(0, 3) + "**** ****" + str.substr(-4);
}
// 真实姓名显示
const maskNameString = (str: any) => {
  return str.substr(0, 1) + "**";
}

// 打开添加银行弹窗
const openAddBank = () => {
  addMyBankModal.value.showAddBankModal();
}

onMounted(() => {
  setTimeout(() => {
    getMyBankList();
    MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bank_card_info_list, handleMyBankList);
    MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_del_bank_card_info, handleDelBankList);
    MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_set_default_bankcard, handleDefaultBank);
  }, 500)
});
onUnmounted(() => {
  // 取消监听
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_bank_card_info_list, null);
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_del_bank_card_info, null);
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_set_default_bankcard, null);
});


</script>

<style scoped lang="scss">
.content {
  font-size: 12px;
  margin: 10px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
  background-blend-mode: color-burn, overlay, normal;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), radial-gradient(circle at 50% 50%, #7e7e7e, #151515 72%), linear-gradient(to bottom, var(--bg-decreased-1), var(--bg-decreased-1));

  .bank_list {
    padding: 14px 10px;
    .bank_list_item {
      width: 331px;
      height: 76px;
      padding: 14px;
      margin-bottom: 14px;
      border: 2px solid #4e3b99;
      border-radius: 6px;
      //background: #3a2786;
      background: url(/imgs/payment/mockBank.webp) center no-repeat;
      background-size: 100%;

      /*默认卡片*/
      &.active {
        border-color: #0cc41e;;
      }

      .list_item_l {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        padding: 12px 6px 13px;
        border: solid 3px #d6cdff;
        background-color: #fff;
        img {
          max-width: 45px;
        }
      }
      .list_item_c {
        width: 160px;
        color: #fff;
        margin-left: 15px;
        .list_item_c_bottom {
          margin-top: 5px;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .list_item_r {
        width: 66px;
        color: #c0c2db;
        span {
          font-size: 2.8vw;
          width: 100%;
          height: 20px;
          border-radius: 15px;
          background-color: #211051;
          &:first-child {
            margin-bottom: 8px;
          }
          &.sh_color {
            color: #fff;
            background: #0cc41e;
          }
          &.mr_color{
            color: #fff;
            background: #1382e7;
          }
        }

      }

      &.add_bank {
        background-image: radial-gradient(circle at 50% 11%, #361e79, #202137 97%);
        > div {
          width: 100%;
          color: #4e3b99;
          text-align: center;
        }
        .add_icon {
          width: 24px;
          height: 24px;
          background: url(/imgs/payment/add_icon.webp) center no-repeat;
          background-size: 100%;
        }
      }

    }

    .bottom_tip {
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

  }

}
.popup_body {
  .body {
    font-size: 14px;
    color: #fff;
    text-align: center;
    padding: 30px;
  }
}
</style>
