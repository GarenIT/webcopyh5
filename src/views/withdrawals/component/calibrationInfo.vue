<template>

  <div class="calibration">
    <div class="title">
      <p>请先完善取款信息</p>
    </div>

    <div class="content">
      <div class="bank">

        <div class="add-bank-text form-title">
          <p>{{ t('paymentManagement_page_add_one_bank') }}</p>
          <img :src="bankFlag ? '/imgs/wallet/addBankClose.webp' : '/imgs/wallet/fulfillment.webp'" alt="">
        </div>
        <div class="bank-form item-form" v-if="bankFlag">
          <nut-form ref="bankFormRef" label-position="top" class=" bank-add-form" :model-value="bankForm">
            <nut-form-item label="选择银行">
              <div class="choose_bank flex">
                <div class="choose_bank_l flex item-center">
                  <span class="bank_cicon">
                    <img :src="`/imgs/bankIcon/bank_logo_${chooseBank.value}.webp`" :alt="chooseBank.label" />
                  </span>
                  <span class="bank_cname"> {{ chooseBank.label }} </span>
                </div>
                <nut-button :bordered="false" block class="change_btn  weight_5 center pointer"
                  @click="showChangeBank">新增</nut-button>
              </div>
            </nut-form-item>

            <nut-form-item :label="'银行卡号'" path="bankCode">
              <nut-input size="large" v-model="bankForm.bankCode" :placeholder="'请输入银行卡号'">
                <template #suffix>
                  <span class="refresh_icon"></span>
                </template>
              </nut-input>
            </nut-form-item>


            <nut-form-item :label="'银行账户名'" path="accountName">
              <nut-input size="large" :disabled="!!cardholder_name" v-model="bankForm.accountName"
                :placeholder="'请输入银行账户名'">
                <template #suffix>
                  <span class="refresh_icon"></span>
                </template>
              </nut-input>
            </nut-form-item>

            <div class="flex item-center justify-center btn">
              <nut-button :bordered="false" block class="change_btn  weight_5 center pointer" @click="submitBank">
                确认</nut-button>
            </div>
          </nut-form>
        </div>

        <div v-else class="bank-finish item-finish item-form">
          <div class="bank-list flex justify-center">
            <div class="bank-item flex item-center space-between">
              <div class="bank-l-icon">
                <img :src="`/imgs/bankIcon/bank_logo_${bankForm.bank}.webp`" alt="nodata">
              </div>
              <div class="bank-l-name">
                <p>
                  <span>{{ bankForm.bankName }}</span>
                  <span>*******</span>
                </p>
                <p>{{ formatNumberString(bankForm.bankCode + '') }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="phone">
        <div class="add-bank-text form-title">
          <p>请绑定手机信息</p>
          <img :src="phoneFlag ? '/imgs/wallet/addBankClose.webp' : '/imgs/wallet/fulfillment.webp'" alt="">
        </div>

        <div v-if="phoneFlag" class="phone-form item-form">
          <nut-form ref="phoneFormRef" label-position="top" :model-value="phoneForm">

            <nut-form-item label="手机号" path="phone">
              <div class="flex">
                <div class="phone-hand">
                  <p>+84</p>
                </div>
                <nut-input clearable size="large" v-model="phoneForm.phone" :placeholder="'请输入手机号'"></nut-input>
              </div>
            </nut-form-item>


            <nut-form-item :label="'验证码'" path="phoneCode">
              <div class="flex phoneCode">
                <nut-input clearable size="large" v-model="phoneForm.phoneCode" :placeholder="'请输入6位数验证码'"></nut-input>

                <nut-button :bordered="false" :loading="phoneCodeLoading" @click="submitSendPhoneCode"
                  :disabled="phoneCodeDisabled" block class="change_btn  weight_5 center pointer">{{ phoneCodeText
                  }}</nut-button>
              </div>

            </nut-form-item>

            <div class="flex item-center justify-center btn">
              <nut-button :bordered="false" block class="change_btn  weight_5 center pointer" @click="submitPhone">
                确认</nut-button>
            </div>

          </nut-form>
        </div>

        <div v-else class="phone-finish item-finish item-form">
          <div class="bank-list flex">
            <div class="bank-item flex item-center">
              <div class="bank-l-icon">
                <img src="/imgs/wallet/phone.webp" alt="nodata">
              </div>
              <div class="bank-l-name" style="margin-left: 40px;">
                <p style="margin-bottom: 10px;">
                  <span>+84</span>
                </p>
                <p>{{ maskNumberPhone(phoneForm.phone) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="capital">
        <div class="add-bank-text form-title">
          <p>设置资金密码</p>
          <img :src="capitalFlag ? '/imgs/wallet/addBankClose.webp' : '/imgs/wallet/fulfillment.webp'" alt="">
        </div>

        <div class="capital-form item-form" v-if="capitalFlag">
          <nut-form ref="capital FormRef" label-position="top" :model-value="capitalForm">

            <nut-form-item label="设置密码" path="phone">
              <nut-input clearable size="large" v-model="capitalForm.capitalPin" :placeholder="'请输入资金密码'"></nut-input>
            </nut-form-item>


            <nut-form-item :label="'重复密码'" path="phoneCode">
              <nut-input clearable size="large" v-model="capitalForm.capitalPinAgain"
                :placeholder="'请确认资金密码'"></nut-input>

            </nut-form-item>

            <div class="flex item-center justify-center btn">
              <nut-button :bordered="false" block class="change_btn  weight_5 center pointer"
                @click="submitCapital">
                确认</nut-button>
            </div>

          </nut-form>
        </div>

        <div v-else class="capital-finish item-finish item-form">
          <div>
            <p>设置完成</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">

import { onMounted, onUnmounted, ref, watch } from "vue";
import { MessageEvent2 } from "@/net/MessageEvent2";
import { NetMsgType } from "@/netBase/NetMsgType";
import { showToast } from "@nutui/nutui";
import { Net } from "@/net/Net";
import { NetPacket } from "@/netBase/NetPacket";
import { useI18n } from "vue-i18n";
import { verifyMobile } from "@/utils/validateTools.ts";
import { aaa, bbb, getDeviceId, getRandomSign } from "@/net/Utils";

import { storeToRefs } from 'pinia';
import pinia from '@/store';
import { User } from '@/store/user';
import { IP } from "@/utils/publicMethods.ts";
import { needLoginApi } from "@/utils/storage.ts";
const UserStore = User(pinia);
const { info: userInfo, roleInfo } = storeToRefs(UserStore);


const { t } = useI18n();

const props = defineProps<{
  bankListData: any
  calibrationVisible: any
  myBankData: any
}>()

const emit = defineEmits<{
  openChooseBank: any
}>()

onMounted(() => {

  if (props.myBankData.list && props.myBankData.list.length) {
    setmyDataData(props.myBankData.list, 'array')
  }

  if (props.myBankData.withdraw_pwd) {
    setmyDataData(props.myBankData.withdraw_pwd, 'pwd')
  }

  if (props.myBankData.phone) {
    setmyDataData(props.myBankData.phone, 'phone')
  }

  if (props.myBankData.cardholder_name) {
    cardholder_name.value = props.myBankData.cardholder_name
  }




})

watch(
  () => props.myBankData.cardholder_name,
  (count) => {
    cardholder_name.value = count
  })

watch(
  () => props.bankListData,
  (count: any) => {
    chooseBank.value = count
    bankForm.value.bank = count.value
    bankForm.value.bankName = count.label
  })

watch(
  () => props.myBankData.list,
  (count: any) => {
    if (count.length) {
      setmyDataData(count, 'array')
    }
  })

watch(
  () => props.myBankData.withdraw_pwd,
  (count: string) => {
    if (count) {
      setmyDataData(count, 'pwd')
    }
  })

const setmyDataData = (count: any, key: string) => {
  if (key === 'array' && count.length) {
    bankFlag.value = false
    bankForm.value.bank = count[0].bank_id
    bankForm.value.bankCode = count[0].account_number
    bankForm.value.bankName = count[0].bank_name
  }

  if (key === 'phone') {
    phoneForm.value.phone = count.phone
    phoneFlag.value = false;
  }

  if (key === 'pwd') {
    capitalFlag.value = false;
  }
}


const cardholder_name = ref('')

watch(
  () => props.myBankData.cardholder_name,
  (count: string) => {
    bankForm.value.accountName = count
    cardholder_name.value = count

  })


const bankFlag = ref(true)
const phoneFlag = ref(true)
const capitalFlag = ref(true)

// 银行
const bankForm = ref({
  bank: 0, // 银行ID
  bankName: '',// 银行名称
  bankCode: '',
  accountName: '',
})

const submitBank = () => {
  if (!bankForm.value.bank) return showToast.fail('请选择银行');
  if (!bankForm.value.bankCode) return showToast.fail('请输入银行卡号');
  if (!bankForm.value.accountName) return showToast.fail('请输入银行卡账户名');
  const req = NetPacket.req_new_bank_card_info();
  req.bank_id = bankForm.value.bank;
  req.account_number = bankForm.value.bankCode;
  req.cardholder_name = bankForm.value.accountName;
  Net.instance.sendRequest(req);
}

// result: 2 // 1 成功，2 失败
const handleAddBank = (res: any) => {
  if (res.result === 1) {
    bankFlag.value = false
    showToast.success(t('paymentManagement_page_addBankSuc'));
  } else {
    showToast.fail(t('paymentManagement_page_addBankFail'));
  }
};

const chooseBank = ref({ label: '', value: '' }); // 选择的银行卡
const showChangeBank = () => {
  emit('openChooseBank')
}


// 手机
const phoneForm = ref({
  codeValue: '84',
  phone: '',
  phoneCode: '',
})
const submitPhone = async () => {

  let phoneFormat = verifyMobile(phoneForm.value.codeValue, phoneForm.value.phone)
  if (!phoneFormat) return showToast.fail(t('home_page_phoneNumberFormatIncorrect'));
  if (!phoneForm.value.phoneCode) return showToast.fail(t('home_page_enterSmsCode'));


  let req = NetPacket.req_bind_modify_email();
  req.email = phoneForm.value.codeValue + phoneForm.value.phone;
  req.username = userInfo.value?.full_name;
  req.captcha = phoneForm.value.phoneCode;
  req.operate_type = 3;
  req.agent_id = roleInfo.value.id; //Local.get('agentid')
  req.aaa = aaa;
  req.bbb = bbb;
  // req.ip = await IP();
  req.ip = await IP();
  let id = await getDeviceId();
  req.sign = getRandomSign(id);
  Net.instance.sendRequest(req);
}


const phoneCodeText = ref<string | number>('发送')
const phoneCodeDisabled = ref(false);
const phoneCodeLoading = ref(false)
// 验证码
const submitSendPhoneCode = () => {

  let phoneFormat = verifyMobile(phoneForm.value.codeValue, phoneForm.value.phone)
  if (!phoneFormat) return showToast.fail(t('home_page_phoneNumberFormatIncorrect'));

  phoneCodeLoading.value = true;
  const req = NetPacket.req_get_mobile_sms_code();
  req.mobile = phoneForm.value.codeValue + phoneForm.value.phone;


  req.operate_type = 1;
  Net.instance.sendRequest(req);
}

const handleSMSback = (res: any) => {
  phoneCodeLoading.value = false;
  if (res.code == 1) {
    if (res.message) {
      showToast.success(t(res.message));
    }
    let timer = 60;
    phoneCodeDisabled.value = true;
    phoneCodeText.value = timer;
    let timeInterval = setInterval(() => {
      phoneCodeText.value = timer--;
      if (timer <= 0) {
        clearInterval(timeInterval);
        phoneCodeDisabled.value = false;
        phoneCodeText.value = '发送';
      }
    }, 1000);
  } else {
    phoneCodeDisabled.value = false;
  }
}

// 返回是否绑定成功--手机号
const handleChangeEmail = (res: any) => {
  if (res.code == 1) {
    showToast.success(t(res.message));
    needLoginApi();
    setTimeout(() => {
      phoneFlag.value = false
    }, 3000);
  } else {
    showToast.fail(t(res.message));
  }
}


// 资金密码
const capitalForm = ref({
  capitalPin: '',
  capitalPinAgain: '',
})

const submitCapital = () => {
  console.log(capitalForm.value, '--capitalForm.value--');
  if (!capitalForm.value.capitalPin) return showToast.fail('请输入资金密码');
  if (!capitalForm.value.capitalPinAgain) return showToast.fail('请确认资金密码');
  if ((capitalForm.value.capitalPin !== capitalForm.value.capitalPinAgain)) return showToast.fail('密码不一致');

  let req = NetPacket.req_bind_or_modify_withdraw_password();
  req.operate_type = 1;
  req.old_password = '';
  req.new_password = capitalForm.value.capitalPin;
  req.role_id = roleInfo.value?.id;
  req.new_password_confirm = capitalForm.value.capitalPinAgain;
  Net.instance.sendRequest(req);
  capitalFlag.value = false;
}

const handleBindOrModifyWithdrawPassword = (res: any) => {
  if (res.code == 1) {
    showToast.success(t(res.message));
    capitalFlag.value = false;
    needLoginApi();
  }
};


// 字符串判断
const formatNumberString = (input: string): string => {
  // 空字符串判断
  if (!input || input.length <= 4) {
    return '**** **** **** ****';
  }

  // 移除所有非数字字符
  const digitsOnly = input.replace(/\D/g, '');

  // 计算星号的数量，确保至少有4组
  const starsCount = 4 - Math.ceil(digitsOnly.length / 4);

  // 生成星号字符串
  const stars = '****'.repeat(starsCount);

  // 将数字字符串分割成四部分
  let parts = [];
  for (let i = 0; i < digitsOnly.length; i += 4) {
    parts.push(digitsOnly.substring(i, i + 4));
  }

  // 如果数字不足16位，前面的星号
  if (digitsOnly.length < 16) {
    parts.unshift(stars);
  }

  // 确保最后一部分是原始字符串的最后四位
  if (digitsOnly.length > 4) {
    parts[parts.length - 1] = digitsOnly.substring(digitsOnly.length - 4);
  }

  // 将分割后的字符串和星号组合
  return parts.join(' ');
};


const maskNumberPhone = (numStr: string): string => {
  // 首先，我们找到第一个非数字字符的位置，如果没有，则认为是字符串的末尾
  const firstNonDigitIndex = numStr.search(/\D/);

  // 如果没有非数字字符，我们只保留前三个数字，其余用星号替换
  if (firstNonDigitIndex === -1) {
    return numStr.substring(0, 3) + '****' + numStr.substring(numStr.length - 1);
  }

  // 如果有非数字字符，我们保留第一个数字和最后一个非数字字符之间的部分
  const firstPart = numStr.substring(0, firstNonDigitIndex);
  const lastPart = numStr.substring(firstNonDigitIndex);
  //
  // // 计算需要用星号替换的部分的长度
  // const maskLength = numStr.length - (firstPart.length + lastPart.length);

  // 返回格式化后的字符串
  return firstPart + '****' + lastPart;
};



onMounted(() => {

  // 绑定手机号
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bind_modify_email, handleChangeEmail);

  // 绑定银行卡
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_new_bank_card_info, handleAddBank);

  // 发送验证码
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_get_mobile_sms_code, handleSMSback);

  // 绑定资金密码
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bind_or_modify_withdraw_password, handleBindOrModifyWithdrawPassword);
})

onUnmounted(() => {


  // 绑定手机号
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bind_modify_email, null);

  // 绑定银行卡
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_new_bank_card_info, null);

  // 发送验证码
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_get_mobile_sms_code, null);

  // 绑定资金密码
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bind_or_modify_withdraw_password, null);

});

</script>

<style scoped lang="scss">
@import "../form.scss";

.calibration {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  background-image: radial-gradient(circle at 50% 11%, #361e79, #202137 97%);

  .title {
    padding-top: 14px;
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
    text-align: center;
    color: #fff;
  }

  .content {
    background-blend-mode: color-burn, overlay, normal;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), radial-gradient(circle at 50% 51%, #7e7e7e, #151515 123%), linear-gradient(to bottom, #27155c, #27155c);

    &>div {
      overflow-y: auto;
      border-radius: 8px;
      backdrop-filter: blur(4px);
      margin: 0 10px 14px;
      padding: 14px 0 0;
      background-color: #130931;

      .form-title {
        display: flex;
        align-items: center;
        padding: 0 20px;
        justify-content: space-between;
        font-size: 14px;
        font-weight: normal;
        margin-bottom: 14px;
        color: #fff;

        img {
          cursor: pointer;
        }
      }

      .item-form {
        padding: 14px 20px 38px;
        background-color: #130931;

      }

      .bank-list {
        display: flex;
        width: 100%;
        overflow-y: auto;

        .bank-item {
          font-size: 14px;
          width: 374px;
          height: 80px;
          background: url(/imgs/payment/bankBg.webp) center no-repeat;
          background-size: 100%;

          //&:active {
          //  transform: scale(.95);
          //}
          .bank-l-icon {
            width: 48px;
            height: 48px;
            margin-left: 14px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 100%;
              height: 100%;
              //margin-left: 18px;
            }
          }

          .bank-l-name {
            p {
              color: #fff;
              //text-align: center;
              margin-right: 17px;

              span {
                color: #fff;
              }
            }

            p:nth-child(1) {
              span:nth-child(2) {
                margin-left: 6px;
                font-size: 14px;
              }
            }

            p:nth-child(2) {
              text-align: right;
              font-size: 16px;
              margin-top: 12px;
              font-weight: 600;
            }

            //max-width: 120px;
          }
        }
      }
    }


    .btn {
      margin-top: 20px;
    }

    .bank {
      .bank-form {
        .bank-add-form {
          .add-bank-text {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            font-weight: normal;
            margin-bottom: 14px;
            color: #fff;

            img {
              cursor: pointer;
            }
          }


          .choose_bank {
            flex-flow: nowrap !important;
            gap: 10px !important;

            .choose_bank_l {
              width: 195px;
              height: 39px;
              background: url(/imgs/payment/inputBg.webp) center no-repeat;
              background-size: 100%;

              .bank_cicon {
                width: 24px;
                height: 24px;
              }

              .bank_cname {
                width: 220px;
                line-height: 16px;
              }
            }

            .change_btn {

              width: 110px;
              height: 38px;
            }
          }
        }
      }

    }


    .phone {
      .phone-form {
        .phone-hand {
          width: 50px;
          height: 39px;
          margin: 0 10px 0 0;
          padding: 9px 10px 9px 8px;
          border-radius: 8px;
          background-image: radial-gradient(circle at 50% 14%, #4c36b3 0%, #3a2786 65%, #3c279a 87%);
        }

        .phoneCode {
          .change_btn {
            width: 110px;
            height: 38px;
            margin-left: 10px;
          }
        }
      }
    }

    .capital {
      .capital-finish {
        &>div {
          width: 315px;
          height: 39px;
          line-height: 39px;
          margin: 14px 0 0;
          border-radius: 8px;
          color: #0dd27a;
          text-align: center;
          font-size: 14px;
          border: none;
          background-image: radial-gradient(circle at 50% 14%, #4c36b3 0%, #3a2786 17%, #3c279a 23%);
        }
      }

    }
  }

  .change_btn {
    width: 200px;
    height: 42.9px;
  }
}
</style>
