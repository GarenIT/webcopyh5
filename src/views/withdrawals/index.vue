<template>
  <div class="wallet vertical center  body_sec">
    <div class="head">
      <nut-navbar class="navbar" z-index="5" :clickable="false">
        <template #content>
          <span>提款</span>
        </template>
        <template #left>
          <iconpark-icon @click="$router.go(-1)" class="close" icon-id="tongyicontyfanh" size="2.4rem"></iconpark-icon>
        </template>
        <template #right>
          <div class="right-handler">
            <iconpark-icon name="wallrticontongy01" :class="refreshFlag && 'refresh'" size="24" @click="refresh" />
            <iconpark-icon v-if="eyeOpen" name="wallrticontongy02" size="24" @click="changeEyeOpen(false)" />
            <iconpark-icon v-else name="wallrticontongy03" size="24" @click="changeEyeOpen(true)" />
          </div>
        </template>
      </nut-navbar>
    </div>

    <div class="content">
      <nut-form label-position="top" ref="formRef" class=" form-bg">
        <nut-form-item>
          <template #label>
            <div class="label">
              <p>可提款金额</p>
              <p>（锁定金额/所需流水：100/1000）</p>
            </div>
          </template>
          <nut-input v-if="eyeOpen" disabled v-model="formData.maxValue" type="text" />
          <nut-input v-else disabled v-model="hideText" type="text" />
        </nut-form-item>
        <nut-form-item label="选择银行卡">
          <div class="change-bank">
            <div class="selectBank">
              <div class="bankName" v-show="backItemInfo.bank_name">
                <div class="icon">
                  <img :src="`/imgs/bankIcon/bank_logo_${backItemInfo.bank_id}.webp`" />
                </div>
                <span>{{ backItemInfo.bank_name }}</span>
              </div>
              <div class="mantissa">
                <span v-show="backItemInfo.bank_name">尾号：{{
        backItemInfo.account_number.substring(backItemInfo.account_number.length - 4,
          backItemInfo.account_number.length)
      }}</span>
              </div>
            </div>
            <nut-button :bordered="false" block class="change_btn  weight_5 center pointer" @click="showChangeBank">
              新增
            </nut-button>
          </div>
        </nut-form-item>

        <nut-form-item :label="t('rechargeRecord_page_amount')">
          <nut-input size="large" v-model="formData.amount" type="number" :placeholder="t('deposit_page_enterMon')">
            <template #suffix>
              <span class="refresh_icon"></span>
            </template>
          </nut-input>
        </nut-form-item>
        <div class="flex f_wrap kjje_div">
          <p class="kj_item" style="color: #fff;" v-for="(item, index) in chooseMoneyArr"
            @click="chooseFastMon(item.value)" :key="index">
            {{ item.label }}
          </p>
        </div>


        <nut-form-item>
          <template #label>
            <div class="label-capital">
              <p>资金密码</p>
              <nut-switch active-color="#0cc51e" inactive-color="#636a79" class="switch-password"
                v-model="switchPassword" @change="switchChange" />
            </div>
          </template>
          <nut-input v-if="switchPassword" v-model="formData.capitalPassword" placeholder="请输入资金密码"
            :type="!formData.showConfirm ? 'password' : 'text'">
            <template #right>
              <div class="flex item-center" @click="checkShowConfirm">
                <iconpark-icon v-if="!formData.showConfirm" name="wallrticontongy03"></iconpark-icon>
                <iconpark-icon v-if="formData.showConfirm" name="wallrticontongy02"></iconpark-icon>
              </div>
            </template>
          </nut-input>
        </nut-form-item>
      </nut-form>


      <div class="btn_zone flex ">
        <nut-button :bordered="false" class="submit_btn  weight_5 center pointer" block @click="onSubmit">立刻提现
        </nut-button>
      </div>
      <div class="projected justify-center flex item-center">
        <p>预计到账：</p>
        <p>{{ formData.amount }}</p>
      </div>

      <div class="flex align-center justify-center tips" style="margin-top: 12px;">
        <span class="icon" style="margin-right: 6px;">
          <iconpark-icon name="tongyiconhonsts02"></iconpark-icon>
        </span>
        <span style="color: #fff;"> 温馨提示：提款需先将金额转入保险柜 </span>
      </div>
    </div>


    <nut-popup v-model:visible="addBankCardVisible" position="bottom" :style="{ height: '75%' }">
      <AddBankCard @updateMyBankList="getMyBankList" :bankListData="bankListData" @addBankCardVisible="addBankCardUse"
        :myBankData="myBankData" @openChooseBank="openChooseBank" />
    </nut-popup>

    <nut-popup v-model:visible="calibrationVisible" position="bottom" :style="{ height: '75%' }">
      <calibration-info :calibrationVisible="calibrationVisible" :bankListData="bankListData" :myBankData="myBankData"
        @openChooseBank="openChooseBank"></calibration-info>
    </nut-popup>


    <nut-popup v-model:visible="closeCapitalVisible" position="bottom" :style="{ height: '50%' }" @close="capitalClose">
      <div class="capital-content">
        <nut-input v-model="capitalPassword.value" placeholder="点击输入资金密码"
          :type="!capitalPassword.showConfirm ? 'password' : 'text'">
          <template #right>
            <div class="flex item-center" @click="() => { capitalPassword.showConfirm = !capitalPassword.showConfirm }">
              <iconpark-icon v-if="!capitalPassword.showConfirm" name="wallrticontongy03"></iconpark-icon>
              <iconpark-icon v-if="capitalPassword.showConfirm" name="wallrticontongy02"></iconpark-icon>
            </div>
          </template>
        </nut-input>
        <nut-button :bordered="false" class="btn" block @click="capitalConfirm">确定</nut-button>
      </div>
    </nut-popup>


    <!-- 选择银行弹窗 -->
    <chooseBankDialog ref="chooseBankModal" @selectBank="selectBank" />

  </div>
</template>


<script setup lang="ts">

import { useI18n } from "vue-i18n";
import { onMounted, onUnmounted, ref } from "vue";
import { MessageEvent2 } from "@/net/MessageEvent2";
import { NetMsgType } from "@/netBase/NetMsgType";
import AddBankCard from "@/views/withdrawals/component/addBankCard.vue";
import CalibrationInfo from "./component/calibrationInfo.vue";
import { Net } from "@/net/Net";
import { NetPacket } from "@/netBase/NetPacket";
import chooseBankDialog from '@/views/deposit/chooseBankDialog.vue';


import { storeToRefs } from 'pinia';
import pinia from "@/store";
import { User } from '@/store/user';
import { showToast } from "@nutui/nutui";

const { t } = useI18n();

const UserStore = User(pinia);
const { info: userInfo, roleInfo } = storeToRefs(UserStore);

const chooseBankModal = ref();
// 打开银行弹窗
const openChooseBank = () => {
  chooseBankModal.value.onCloseBank();
}

const closeCapitalVisible = ref(false)


const bankListData = ref(
  { value: 0, label: '' }
)
// 选择银行
const selectBank = (e: any) => {
  bankListData.value = e
  // chooseBank.value = e;
}


// 新增银行卡
const addBankCardVisible = ref(false)

// 校验弹窗
const calibrationVisible = ref(false)

const formData = ref({
  maxValue: '0',
  amount: '',
  capitalPassword: '',
  showConfirm: false
})

const backItemInfo = ref({
  bank_id: 0,
  bank_name: '',
  account_number: ''
})

const showChangeBank = () => {
  addBankCardVisible.value = !addBankCardVisible.value
}


// 选择银行信息
const addBankCardUse = (item: any, key: string, index: number) => {

  if (key === 'isUse') {
    backItemInfo.value.bank_id = item.bank_id
    backItemInfo.value.bank_name = item.bank_name
    backItemInfo.value.account_number = item.account_number
    myBankData.value.isUse = index
  }
  addBankCardVisible.value = false
}

// 选择快捷金额
const chooseFastMon = (e: any) => {
  formData.value.amount = e.toString()
}
const chooseMoneyArr = [
  { label: '100,000', value: 100000 },
  { label: '200,000', value: 200000 },
  { label: '500,000', value: 500000 },
  { label: '1,000,000', value: 1000000 },
  { label: '10,000,000', value: 10000000 },
  { label: '100,000,000', value: 100000000 },
];


const capitalPassword = ref({
  value: '',
  showConfirm: false,

})
const switchPassword = ref(true)
const checkShowConfirm = () => {
  formData.value.showConfirm = !formData.value.showConfirm
}

const capitalConfirm = () => {
  if (!capitalPassword.value.value) return showToast.fail('请输入资金密码')
  closeCapitalVisible.value = false
  switchPassword.value = false
  // formData.value.capitalPassword =  capitalPassword.value.value
}

const switchChange = (e: boolean) => {
  if (!e) {
    closeCapitalVisible.value = true
  }
}

const capitalClose = () => {
  if (!capitalPassword.value.value) {
    switchPassword.value = true
  }

}


const onSubmit = () => {
  if (!backItemInfo.value.bank_id) {
    return showToast.fail(t('paymentManagement_page_chBank'))
  }

  if (formData.value.amount < myBankData.value.min_withdraw_money) {
    return showToast.fail(t('withdraw_page_minAmount', { minAmount: myBankData.value.min_withdraw_money }))
  }
  if (formData.value.amount > myBankData.value.max_withdraw_money) {
    return showToast.fail(t('withdraw_page_maxAmount', { maxAmount: myBankData.value.max_withdraw_money }))
  }

  if (myBankData.value.calibrationVisible) {
    calibrationVisible.value = true
  } else {
    handleSubmit()
  }


  // calibrationVisible.value = true
}

const handleSubmit = () => {
  const req = NetPacket.req_apply_withdraw();
  req.money = formData.value.amount;
  req.bank_card_id = backItemInfo.value.account_number || ''
  req.bank_id = backItemInfo.value.bank_id || 0;
  req.passwd = formData.value.capitalPassword || capitalPassword.value.value
  req.way = 1; // 1 银行卡，2 USTD
  Net.instance.sendRequest(req);
};

// 0=>申请成功, 1=>申请失败
const handleWithDrawSubmit = (res: any) => {
  if (res.result === 0) {
    showToast.success(t('withdraw_page_subSucces'))
  } else {
    showToast.fail(t('withdraw_page_subFail'))

  }
}


const getMyBankList = () => {
  const req = NetPacket.req_bank_card_info_list();
  Net.instance.sendRequest(req);
}


const myBankData = ref({
  list: [],
  cardholder_name: '',
  withdraw_pwd: '',
  phone: '',
  min_withdraw_money: '',
  max_withdraw_money: '',
  calibrationVisible: false,
  isUse: 0
})

const handleMyBankList = (res: any) => {
  if (!res?.bank_card_info_list.length) {
    calibrationVisible.value = true
    myBankData.value.calibrationVisible = true
  } else {
    let data = res?.bank_card_info_list[0]
    backItemInfo.value.bank_id = data.bank_id
    backItemInfo.value.bank_name = data.bank_name
    backItemInfo.value.account_number = data.account_number
    myBankData.value.list = res?.bank_card_info_list || []
  }

  if (!userInfo.value.mobile) {
    calibrationVisible.value = true
    myBankData.value.calibrationVisible = true
  } else {
    myBankData.value.phone = userInfo.value.mobile
  }

  if (!roleInfo.value.withdraw_pwd) {
    calibrationVisible.value = true
    myBankData.value.calibrationVisible = true
  } else {
    myBankData.value.withdraw_pwd = roleInfo.value.withdraw_pwd
  }

  myBankData.value.calibrationVisible = !(res?.bank_card_info_list.length && userInfo.value.mobile && roleInfo.value.withdraw_pwd);

  myBankData.value.cardholder_name = res?.cardholder_name || ''
  myBankData.value.min_withdraw_money = res?.min_withdraw_money || 0
  myBankData.value.max_withdraw_money = res?.max_withdraw_money || 0

}


const isCanWithdraw = ref(false)
const handleCanWithdraw = (res: any) => {
  isCanWithdraw.value = !res.rlt;
  setCanWithDrawMon();
};
// 设置可提现金额
const setCanWithDrawMon = () => {
  if (isCanWithdraw.value) {
    formData.value.maxValue = roleInfo.value.bank_money + ''
  } else { // 不可以提现，可提现金额置为 0
    formData.value.maxValue = '0'
  }
}

const initReq = () => {
  Net.instance.sendRequest(NetPacket.req_can_withdraw());
  refreshFlag.value = false
};


// 头部刷新
const refreshFlag = ref(false); //刷新标记
const refresh = () => {
  refreshFlag.value = !refreshFlag.value
  getMyBankList()
  initReq()
}
// 金额显示隐藏
const eyeOpen = ref(false); // 余额是否可见
const hideText = ref("*****")
const changeEyeOpen = (value: boolean) => {
  eyeOpen.value = value;
}


onMounted(() => {

  // 可提现金额
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_can_withdraw, handleCanWithdraw);
  setTimeout(() => initReq(), 600);
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_apply_withdraw, handleWithDrawSubmit);


  getMyBankList()
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bank_card_info_list, handleMyBankList);

})


onUnmounted(() => {

  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bank_card_info_list, null);

  // 可提现金额
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_can_withdraw, null);
  setTimeout(() => initReq(), 600);

  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_apply_withdraw, null);

});

</script>

<style scoped lang="scss">
.wallet {
  height: 100vw;
  padding: 10px;

  .right-handler {
    display: flex;
    gap: 15px;
  }

  .refresh {
    animation: refresh 1s linear infinite;
  }

  @keyframes refresh {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  form {
    --nut-form-item-label-font-size: 12px;
    padding: 16px 20px;
    object-fit: contain;
    border-radius: 8px;
    //box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
    //background-blend-mode: color-burn, overlay, normal;
    //background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), radial-gradient(circle at 50% 50%, #7e7e7e, #151515 65%), linear-gradient(to bottom, var(--bg-decreased-1), var(--bg-decreased-1));
    background: url(/imgs/bankIcon/form-bg.webp) no-repeat;
    background-size: 100% 100%;

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

          .nut-input,
          select {
            width: 100%;
            background-blend-mode: color-burn, overlay, normal;
            background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), radial-gradient(circle at 50% 50%, #7e7e7e, #151515 99%), linear-gradient(to bottom, var(--inputfield), var(--inputfield));
            border: 1px solid #322c59;
            border-radius: 8px;
            padding: 9px 8px;
            background-color: #180c3f;
          }

        }
      }
    }

    .label {
      display: flex;

      p {
        white-space: nowrap;
        font-size: 12px;
        color: #c0c2db;
      }
    }

    :deep(.nut-cell__title) {
      padding-right: 0;
    }

    .label-capital {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;


      .switch-password {

        width: 36px;
        height: 16px;
      }

      :deep(.switch-password) {
        --nut-switch-inside-open-transform: translateX(170%);
        --nut-switch-inside-close-transform: translateX(10%);

      }
    }

    .change-bank {
      display: flex;
      align-items: center;

      .selectBank {
        display: flex;
        align-items: center;
        cursor: pointer;
        //justify-content: center;
        width: 195px;
        height: 39px;
        border-radius: 8px;
        border: 1px solid rgba(50, 44, 89, 1);
        background-color: rgba(29, 14, 74, 1);
        margin-right: 12px;

        .bankName {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 90px;
          height: 28px;
          margin-right: 8px;
          margin-left: 8px;
          border-radius: 6px;
          background-image: radial-gradient(circle at 50% 14%, #4c36b3 0%, #3a2786 38%, #3c279a 51%);

          .icon {
            width: 18px;
            height: 18px;
            margin-right: 5px;
            background-color: #fff;

            img {
              width: 18px;
              height: 18px;
            }
          }

          span {
            width: calc(110px - 18px);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }

        .mantissa {
          font-size: 14px;

        }
      }
    }

  }

  .btn_zone {

    .cancel_btn {
      color: #fff;
      width: 100%;
      border-radius: 12px;
      border-style: solid;
      background-image: linear-gradient(to bottom, #4c36b3 100%, #3a2786 28%, #3c279a 0%);
    }

    .submit_btn {
      margin: 20px auto 10px;
      font-size: 16px;
      border: 0;
      width: 200px;
      height: 43px;
      border-radius: 12px;
      background: url(/imgs/payment/sub_btn.webp) center no-repeat;
      background-size: cover;
      color: #fff;

      &.fixed_bg {
        background-size: 100% 112%;
      }
    }
  }

  .projected {
    margin-top: 8px;
    font-size: 12px;
    color: #60d580;
  }

  .tips {
    margin-top: 6px;
    line-height: 10px;
    gap: 4px;

    .icon {
      display: inline-block;
      width: 12px;
      height: 12px;
      background: url(/imgs/payment/error_icon.webp) center no-repeat;
      background-size: 100%;
    }
  }
}

.body_sec {
  .refresh_icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(/imgs/payment/Vector.webp) center no-repeat;
    background-size: 100%;

    &.search_icon {
      background-image: url(/imgs/payment/search_icon.webp);
    }
  }

  .kjje_div {
    gap: 9px;
    margin-bottom: 12px;

    .kj_item {
      width: 99px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: url(/imgs/payment/monBg.webp) center no-repeat;
      background-size: 100%;
    }
  }


  .choose_bank {
    gap: 10px !important;
  }
}


// 默认按钮样式
.change_btn {
  border-radius: 0;
  font-size: 16px;
  color: #fff;
  text-align: center;
  width: 110px;
  height: 39px;
  line-height: 39px;
  background: url(/imgs/payment/sub_btn.webp) center no-repeat;
  background-size: 100% 100%;
  padding: 0;
  border: 0;
}

.change_btn:active {
  border-radius: 0;
  font-size: 16px;
  color: #fff;
  text-align: center;
  width: 110px;
  height: 39px;
  line-height: 39px;
  background: url(/imgs/payment/go-btn.webp) center no-repeat;
  background-size: 100%;
  padding: 0;
  border: 0;
}


.capital-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 57px;
  height: 100%;
  border: none;
  background-image: radial-gradient(circle at 50% 11%, #361e79, #202137 97%);

  .nut-input {
    width: 100%;
    background: #1d0e4a;
    border: 1px solid #322c59;
    border-radius: 8px;
    padding: 9px 8px;
  }

  .btn {
    width: 200px;
    height: 43px;
    margin-top: 20px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    line-height: 39px;
    background: url(/imgs/payment/go-btn.webp) 40% 85% no-repeat;
    background-size: 100%;
    padding: 0;
    border: 0;
    border-radius: 12px;
  }
}
</style>
