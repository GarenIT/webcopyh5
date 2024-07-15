<template>
  <div class="addBankCard">
    <div class="content">

      <div class="bank-list" v-for="(item, index) in bankList" :key="index">
        <div class="bank-item flex">
          <div class="bank-l-icon">
            <img :src="`/imgs/bankIcon/bank_logo_${item.bank_id}.webp`" :alt="item?.bank_name"/>
          </div>
          <div class="bank-l-name">
            <div class="info-text">
              <p>
                <span>{{ item.bank_name }}</span>
                <span>*******</span>
              </p>
              <p>{{ formatNumberString(item.account_number + '') }}</p>
            </div>
            <div class="utilization-bank">
              <div @click="bankCheck(index, 'isUse')" :class="['btn-bank', item.isUse ? '' : 'btn-bank-use']">
                {{ item.isUse ? '使用中' : '选择' }}
              </div>
              <div @click="bankCheck(index, 'isDefault')"
                   :class="['btn-bank', item.isDefault ? '' : 'btn-bank-default']">
                {{ item.isDefault ? '默认卡片' : '设为默认' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-20" v-if="!(bankList.length >= 6)">
        <div class="bank-list-add" v-show="!addBankFlag">
          <div class="center" @click="flagBank(true)">
            <img src="/imgs/wallet/bankAdd.webp" alt="nodata">
            <span>添加新银行卡</span>
          </div>
        </div>


      </div>

      <div class="tip" v-show="!addBankFlag">
        <p>
          <span><iconpark-icon name="tongyiconhonsts02"></iconpark-icon></span>
          <span>每个用户最多添加6张银行卡，您已拥有{{bankList.length}}张</span>
        </p>
      </div>


      <div class="form">
        <nut-form ref="formRef" label-position="top" v-show="addBankFlag" class=" bank-add-form"
                  :model-value="form">
          <div class="add-bank-text">
            <p>{{ t('paymentManagement_page_add_one_bank') }}</p>
            <img src="/imgs/wallet/addBankClose.webp" alt="nodata" @click="flagBank(false)">
          </div>

          <nut-form-item label="选择银行">
            <div class="choose_bank flex">
              <div class="choose_bank_l flex item-center">
                        <span class="bank_cicon">
                          <img :src="`/imgs/bankIcon/bank_logo_${chooseBank.value}.webp`" :alt="chooseBank.label"/>
                        </span>
                <span class="bank_cname"> {{ chooseBank.label }} </span>
              </div>
              <nut-button :bordered="false" block class="change_btn  weight_5 center pointer"
                          @click="showChangeBank">新增
              </nut-button>
            </div>
          </nut-form-item>

          <nut-form-item :label="'银行卡号'" path="bankCode">
            <nut-input size="large" v-model="form.bankCode" :placeholder="'请输入银行卡号'">
              <template #suffix>
                <span class="refresh_icon"></span>
              </template>
            </nut-input>
          </nut-form-item>


          <nut-form-item :label="'银行账户名'" path="accountName">
            <nut-input size="large" :disabled="!!cardholder_name" v-model="form.accountName"
                       :placeholder="'请输入银行账户名'">
              <template #suffix>
                <span class="refresh_icon"></span>
              </template>
            </nut-input>
          </nut-form-item>


          <nut-button :bordered="false" block class="change_btn  weight_5 center pointer" @click="submit"> 确认
          </nut-button>
        </nut-form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, ref, watch} from "vue";
import {showToast} from "@nutui/nutui";
import {Net} from "@/net/Net";
import {NetPacket} from "@/netBase/NetPacket";
import {useI18n} from "vue-i18n";
import {MessageEvent2} from "@/net/MessageEvent2";
import {NetMsgType} from "@/netBase/NetMsgType";

const {t} = useI18n();


const props = defineProps<{
  myBankData: any
  bankListData: any
}>()

const emit = defineEmits<{
  openChooseBank: any
  addBankCardVisible: any
  updateMyBankList: any
}>()

onMounted(() => {

  if (props.myBankData.list && props.myBankData.list.length) {
    setBankList(props.myBankData.list)
  }

  if (props.myBankData.cardholder_name) {
    cardholder_name.value = props.myBankData.cardholder_name
    form.value.accountName = props.myBankData.cardholder_name
  }


})

const cardholder_name = ref('')
const bankList = ref<any>([])

watch(
    () => props.bankListData,
    (count: any) => {
      chooseBank.value = count
      form.value.bank = count.value
      form.value.bankName = count.label

    })

watch(
    () => props.myBankData.cardholder_name,
    (count: string) => {
      cardholder_name.value = count
      form.value.accountName = count
    })

watch(
    () => props.myBankData.list,
    (count: any) => {

      setBankList(count)
    })

const setBankList = (count: any) => {


  let num = props.myBankData.isUse || 0
  bankList.value = count.map((item: any, index: number) => {
    if (index === num) {
      item.isUse = true
      item.isUse = true
    } else {
      item.isUse = false
      item.isUse = false
    }

    return item
  })
}


const form = ref({
  bank: '',
  bankCode: '',
  bankName: '',
  accountName: '',
})

const chooseBank = ref({label: '', value: ''}); // 选择的银行卡

const submit = () => {
  if (!form.value.bank) {return showToast.fail(t('paymentManagement_page_chBank'))}

  if (!form.value.bankCode) {
    return showToast.fail(t('paymentManagement_page_chCardNo'))
  }

  if (!form.value.accountName) {
    return showToast.fail('请输入银行卡账户')
  }
  const req = NetPacket.req_new_bank_card_info();
  req.bank_id = form.value.bank;
  req.account_number = form.value.bankCode;
  req.cardholder_name = form.value.accountName;
  Net.instance.sendRequest(req);
}

// result: 2 // 1 成功，2 失败
const handleAddBank = (res: any) => {
  if (res.result === 1) {
    emit('updateMyBankList')
    flagBank(false)
    showToast.success(t('paymentManagement_page_addBankSuc'));
  } else {
    showToast.fail(t('paymentManagement_page_addBankFail'));
  }
};


const showChangeBank = () => {
  emit('openChooseBank')
}


const bankCheck = (index: number, key: string) => {
  let data: any = bankList.value;
  if (!data[index][key]) {
    data.forEach((item: any, i: number) => {
      item[key] = index === i;
      return item;
    });
  }
  emit('addBankCardVisible', data[index], key, index)
};


const addBankFlag = ref<Boolean>(false)
const flagBank = (flag: Boolean) => {
  addBankFlag.value = flag
};

onMounted(() => {
  // 绑定银行卡
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_new_bank_card_info, handleAddBank);

})


onUnmounted(() => {

  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_new_bank_card_info, null);

});


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

  if (starsCount === -1) return '**** **** **** ****'

  // 生成星号字符串
  const stars = '****'.repeat(starsCount);

  console.log(digitsOnly, '--digitsOnly--');


  // 将数字字符串分割成四部分
  let parts = [];
  for (let i = 0; i < digitsOnly.length; i += 4) {


    parts.push(digitsOnly.substring(i, i + 4));
  }

  // 如果数字不足16位，补齐前面的星号
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
</script>

<style scoped lang="scss">
@import "../form.scss";

.px-20 {
  padding: 0 20px;
}

.addBankCard {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  background-image: radial-gradient(circle at 50% 11%, #361e79, #202137 97%);

  .content {
    padding-bottom: 20px;
    background-image: radial-gradient(circle at 50% 11%, #361e79, #202137 97%);
    .bank-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 auto 30px;
      overflow-y: auto;
      //padding: 0 20px;
      .bank-item {
        justify-content: start;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        //width: 335px;
        height: 80px;
        padding: 14px 12px;
        border-radius: 6px;
        background: url(/imgs/payment/bankBg.webp) center no-repeat;
        background-size: 100%;
        flex-flow: nowrap !important;

        .bank-l-icon {
          margin-left: 4px;
          img {
            width: 48px;
            height: 48px;
          }
        }

        .bank-l-name {
          margin-left: 35px;
          flex: 1;
          display: flex;
          justify-content: space-between;
          width: 100%;


          .utilization-bank {
            display: flex;
            align-items: center;
            flex-direction: column;

            .btn-bank {
              width: 66px;
              height: 20px;
              line-height: 22px;
              text-align: center;
              border: none !important;
              font-size: 12px;
              color: rgba(192, 194, 219, 1);
              border-radius: 15px;
              background-color: #211051;

            }

            .btn-bank-use {
              color: rgba(255, 255, 255, 1);
              background-color: rgba(12, 196, 30, 1);
            }

            .btn-bank-default {
              color: rgba(255, 255, 255, 1);
              background-color: rgba(19, 130, 231, 1);
            }

            .btn-bank:nth-child(2) {
              margin-top: 10px;
            }
          }

          .info-text {
            color: #fff;

            p {
              white-space: nowrap;
              font-size: 12px;
              margin-right: 10px;
            }

            p:nth-child(1) {
              span:nth-child(2) {
                margin-left: 10px;

              }
            }

            p:nth-child(2) {
              margin-top: 12px;
              text-align: right;
              font-size: 16px;
              font-weight: 600;
            }
          }

          //max-width: 120px;
        }

        //.bank-l-name {
        //  padding-right: 18px;
        //  display: flex;
        //  align-items: center;
        //  justify-content: space-between;
        //  flex: 1;
        //  margin-left: 37px;
        //
        //}
      }
    }
    .bank-list-add {
      cursor: pointer;
      font-size: 14px;
      width: 335px;
      height: 80px;
      padding: 0 18px 0 18px;
      gap: 8px 12px;
      background-color: rgba(29, 14, 74, 1);
      box-shadow: 0 4.47px 4.47px 0 rgba(0, 0, 0, 0.25) inset;
      border: 3px solid rgba(78, 59, 153, 1);
      border-radius: 10px;

      .center {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        img {
          width: 30px;
          height: 30px;
        }

        span {
          margin-top: 6px;
          color: rgba(142, 130, 194, 1);
          font-size: 13px;
        }
      }
    }

    .tip {
      padding: 0 20px;
      margin-top: 15px;
      span {
        color: #c0c2db;
        font-size: 11px;
      }
      span:nth-of-type(2) {
        margin-left: 6px;
      }
    }
  }

  .form {
    padding: 0 10px;
    background-image: radial-gradient(circle at 50% 11%, #361e79, #202137 97%);

    .bank-add-form {
      padding: 14px 20px;
      background-color: #130931;
      border-radius: 10px;

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
            margin-left: 8px;
            margin-right: 6px;
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

  .change_btn {
    display: inline-block;
    text-align: center;
    color: #fff;
    background: url(/imgs/payment/go-btn.webp) 80% 85% no-repeat;
    background-size: 100%;
    padding: 0;
    border: 0;
    line-height: 39px;
  }
}
</style>
