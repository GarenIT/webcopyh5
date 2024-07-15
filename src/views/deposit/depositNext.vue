<template>
  <div class="deposit_sm_modal">
    <!-- 充值第二步 -->
    <div class="body vertical center  body_sec">
      <nut-form label-position="top" ref="formRef" class="">
        <nut-form-item :label="t('rechargeRecord_page_method')">
          <div class="flex choose_bank">
            <div class="flex align_center choose_bank_l bank_way"
              style="width: 100%;background-image: url(/imgs/payment/inputBgFull.webp)">
              <span class="bank_cicon">
                <img :src="`/imgs/payment/icon/icon_${curDepositWay.payname}.webp`" />
              </span>
              <span class="bank_cname"> {{ t(`api_${curDepositWay.payname}`) }} </span>
            </div>
          </div>
        </nut-form-item>
        <nut-form-item class="yh_item" :label="t('level_page_code')">
          <div class="select_dis">
            <nut-menu>
              <nut-menu-item v-model="form.discount" :options="dcList" @change="clickChoose"/>
            </nut-menu>
          </div>
          <!-- 选择优惠后 -->
          <div v-if="form.discount" class="choose_yh">
            <div>{{ t('deposit_page_upperLimit') }}：{{ curDiscount.limit }}</div>
            <div>{{ t('deposit_page_giftRatio') }}：{{ curDiscount.ratio }}%</div>
            <div>{{ t('deposit_page_multiple') }}：{{ curDiscount.require }}X</div>
            <div>{{ t('deposit_page_minimum') }}：{{ curDiscount.threshold }}</div>
            <div>{{ t('deposit_page_venues') }}：{{ curDiscount.restrict }}</div>
          </div>
        </nut-form-item>
<!--        <nut-form-item class="yh_item" :label="t('level_page_code')">
          <div :class="`select_dis flex space_between ${showYouh ? 'active' : ''}`" @click="chooseYouh">
            <span>
              <template v-if="form.discount">
                {{ discountList.find((item: any) => item.discount_ID === form.discount).name }}
              </template>
              <template v-else>
                {{ t('deposit_page_notOffer') }}
              </template>
            </span>
            <span class="s-icon"></span>
          </div>
           选择优惠后
          <div v-if="form.discount" class="choose_yh">
            <div>{{ t('deposit_page_upperLimit') }}：{{ curDiscount.limit }}</div>
            <div>{{ t('deposit_page_giftRatio') }}：{{ curDiscount.ratio }}%</div>
            <div>{{ t('deposit_page_multiple') }}：{{ curDiscount.require }}X</div>
            <div>{{ t('deposit_page_venues') }}：{{ curDiscount.restrict }}</div>
          </div>
        </nut-form-item>-->
        <!-- 银行卡充值独有 -->
        <nut-form-item v-if="curDepositWay.payname.indexOf('bankcard') > -1" :label="t('addBank_page_pChooseBank')">
          <div class="flex choose_bank">
            <div class="flex align_center choose_bank_l">
              <span class="bank_cicon" v-if="chooseBank.value"> <img
                  :src="`/imgs/bankIcon/bank_logo_${chooseBank.value}.webp`" :alt="chooseBank.label" /> </span>
              <span class="bank_cname"> {{ chooseBank.label }} </span>
            </div>
            <nut-button :bordered="false" class="change_btn" @click="showChangeBank"> {{ t('deposit_page_changeWay')
              }} </nut-button>
          </div>
        </nut-form-item>
        <nut-form-item :label="t('rechargeRecord_page_amount')">
          <nut-input v-model.trim="form.amount" :placeholder="t('deposit_page_enterMon')">
            <template #right>
              <a class="refresh_icon" @click="form.amount = ''"></a>
            </template>
          </nut-input>
        </nut-form-item>
        <div class="flex f_wrap kjje_div">
          <a class="kj_item" v-for="(item, index) in chooseMoneyArr" @click="chooseFastMon(item.value)" :key="index">
            {{ item.label }}
          </a>
        </div>
      </nut-form>
      <div class="btn_zone flex ">
        <nut-button class="submit_btn  weight_5 center pointer" :disabled="loading" block @click="onSubmit">{{
          t('deposit_page_rechargeNow') }}</nut-button>
      </div>
      <div class="cz-tips">
        <div class="txt" v-show="Number(form.amount) > 0"> {{ t('deposit_page_arrival') }}：{{ form.amount }} </div>
        <div class="flex align_center justify_center tip">
          <span class="icon"></span>
          <span> {{ t('deposit_page_depositTips') }} </span>
        </div>
      </div>
    </div>

    <!-- 选择优惠 -->
<!--    <nut-action-sheet v-model:visible="showYouh" :title="t('addBank_page_pChoose')" :menu-items="dcList"
      @choose="clickChoose" />-->

    <!-- 选择银行弹窗 -->
    <chooseBankDialog ref="chooseBankModal" :isDepositBank="true" @selectBank="selectBank" />

  </div>
</template>

<script setup lang='ts'>
import { useI18n } from "vue-i18n";
import { onMounted, onUnmounted, ref, watch } from 'vue';
// import { useRouter } from 'vue-router';
import { Net } from '@/net/Net';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetPacket } from '@/netBase/NetPacket';
import { NetMsgType } from '@/netBase/NetMsgType';
import { Local } from "@/utils/storage";
import { showToast } from '@nutui/nutui';
import chooseBankDialog from './chooseBankDialog.vue';


const { t } = useI18n();
// const router = useRouter();
const chooseBankModal = ref();
const legalRecharge = ref<any>(Local.get('depositWayObj')?.legalRecharge || []);
const chooseWay = Local.get('curDepositWay')
const curDiscountData = Local.get('curDiscountData') || {id: 0}; // 从我的优惠过来
const curDepositWay = ref(chooseWay); // 当前选择的充值方式
const curDiscount = ref({ limit: 0, ratio: 0, require: 0, restrict: '', threshold: 0 }); // 优惠
// console.log('-----99', legalRecharge.value)
// 充值提交参数
const dataParams = {
  // country: 1,
  method: -1,
  discount: 0, // 优惠
  amount: '',
  bank: null, // 银行
  bankMethod: 100, // 银行支付方式，对应传给后端参数 type
}

const form = ref( // 存款表单提交
  { ...dataParams }
);
const baseMtdList = { label: t('addBank_page_pChoose'), value: -1, minrecharge: 0, maxrecharge: 0, paymethod: '' }
// 充值方式列表
const mtdList = ref<any>(Local.get('depositWayObj')?.mtdList || [{ ...baseMtdList }]);
const baseDcList = { text: t('deposit_page_notOffer'), value: 0, limit: 999999 }
// 优惠列表
const dcList = ref<any>([{ ...baseDcList }]);
const discountList = ref<any>([]);
const loading = ref(false);// 是否提交中
const chooseMoneyArr = [
  { label: '100,000', value: 100000 },
  { label: '200,000', value: 200000 },
  { label: '500,000', value: 500000 },
  { label: '1,000,000', value: 1000000 },
  { label: '10,000,000', value: 10000000 },
  { label: '100,000,000', value: 100000000 },
];
const chooseBank = ref({ label: '', value: '' }); // 选择的银行卡
// const showYouh = ref(false);

// 选择优惠
// const chooseYouh = () => {
//   showYouh.value = true
// }
const clickChoose = (item: any) => {
  console.log('----999', item)
  form.value.discount = item
}

// 打开银行弹窗
const openChooseBank = () => {
  chooseBankModal.value.onCloseBank();
}
// 重置
const resetData = () => {
  // curDepositWay.value = { payname: '' }
  // form.value = { ...dataParams }
  // mtdList.value = [{ ...baseMtdList }]
  // dcList.value = [{ ...baseDcList }]
  // chooseBank.value = { label: '', value: '' }
  form.value.discount = curDiscountData?.id; // 从我的优惠带过来已选择的优惠
  form.value.method = curDepositWay.value.paymenttype
}
// 获取充值信息
const getShopInfo = () => {
  const req = NetPacket.req_get_shop_info();
  Net.instance.sendRequest(req);
}
const handleShopInfoRes = (rs: any) => {
  resetData();
  // 需要过滤 limit 为 0 的数据
  discountList.value = rs.discount_list.filter((item: any) => item.limit)
  discountList.value.forEach((dc: any) => dcList.value.push({ text: dc.name, value: dc.discount_ID }));
};


const onSubmit = () => {
  // 如果是银行卡方式，需要选择银行
  if (legalRecharge.value.find((item: any) => item.paymenttype === form.value.method)?.payname.indexOf('bankcard') > -1 && !form.value.bank) {
    return showToast.fail(t('paymentManagement_page_chBank'))
  }
  // 获取到当前支付方式的最低最高充值金额
  const curObj = mtdList.value.find((item: any) => item.value === form.value.method)
  console.log('&&&&&', curObj)
  if (form.value.amount < curObj.minrecharge) {
    return showToast.fail(t('deposit_page_minAmount', { minAmount: curObj.minrecharge }))
  }
  if (form.value.amount > curObj.maxrecharge) {
    return showToast.fail(t('deposit_page_maxAmount', { maxAmount: curObj.maxrecharge }))
  }
  loading.value = true;
  handleSubmit()
}

// 充值提交
const handleSubmit = () => {
  const req = NetPacket.req_recharge_from_third();
  req.amount = form.value.amount;
  req.channel_type = form.value.method; // 接口返回的 paymenttype 值乘以100
  req.bank_channel_type = legalRecharge.value.find((item: any) => item.paymenttype === form.value.method)?.payname.indexOf('bankcard') > -1 ? form.value.bank : 0; // 只有选择银行的时候才有，usdt 是 0
  req.type = form.value.bankMethod; // 只有选择银行的时候才有，银行支付方式
  req.got_discount = form.value.discount;
  console.log('=======充值提交参数', req)
  Net.instance.sendRequest(req);
};
const handleDepositSubmit = (res: any) => {
  console.log('---', res)
  loading.value = false;
  if (res.code === -1) {
    showToast.fail(t(res.msg)); // 如 recharge_channel_type_is_not_supported
  } else { // code 0 成功
    showToast.success(t('deposit_page_depSuccess'))
    form.value.amount = ''; // 重置
    Local.remove('curDiscountData'); // 重置
    if (res.url.indexOf('http') > -1 || res.url.indexOf('https') > -1) {
      setTimeout(() => {
        window.open(res.url);
      }, 2000)
    }

  }
}
// 选择快捷金额
const chooseFastMon = (e: any) => {
  form.value.amount = e.toString()
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

// 切换优惠
watch(
  () => form.value.discount,
  (n) => {
    curDiscount.value = discountList.value.find((item: any) => item.discount_ID === n)
  }
)

onMounted(() => {
  setTimeout(() => {
    getShopInfo();
  }, 600)
  // 获取银行信息
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_get_shop_info, handleShopInfoRes);
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_recharge_from_third, handleDepositSubmit);
})
onUnmounted(() => {
  Local.remove('curDiscountData'); // 重置
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_req_get_shop_info, null);
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_recharge_from_third, null);
})

</script>

<style lang='scss' scoped>
.deposit_sm_modal {
  color: #fff;

  .body {
    padding: 10px;

    form {
      padding: 16px 20px;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
      background-blend-mode: color-burn, overlay, normal;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), radial-gradient(circle at 50% 50%, #7e7e7e, #151515 73%), linear-gradient(to bottom, #27155c, #27155c);

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
            .select_dis {
              width: 100%;
              background: #1d0e4a;
              border: 1px solid #322c59;
              border-radius: 8px;
              padding: 9px 8px;

              .s-icon {
                width: 24px;
                height: 24px;
                background: url(/imgs/inputSuffix.webp) center no-repeat;
                background-size: 100%;
                transition: .3s;
              }

              &.active {
                .s-icon {
                  transform: rotate(180deg);
                }
              }
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
          //width: 195px;
          line-height: 16px;
        }

        &.bank_way {
          .bank_cicon {
            background: none;
            border: 0;

            img {
              width: 28px;
              height: 28px;
              border-radius: 0;
            }
          }

          .bank_cname {
            line-height: 39px;
          }

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

    .sm-txt {
      font-size: 24px;
      width: 375px;
      height: 250px;
      margin: 0 auto;
      background: #17a1fb;
    }

    .bank-list-item {
      width: 100%;

      a {
        img {
          width: 30px;
          height: 30px;
        }
      }
    }

    .btn_zone {

      .submit_btn {
        margin: 20px auto 10px;
        font-size: 16px;
        border: 0;
        width: 200px;
        height: 43px;
        color: var(--c-bg-6);
        border-radius: 12px;
        background: url(/imgs/payment/sub_btn.webp) center no-repeat;
        background-size: cover;

        &.fixed_bg {
          background-size: 100% 112%;
        }
      }
    }

  }

  .body_sec {
    .refresh_icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url(/imgs/payment/Vector.webp) center no-repeat;
      background-size: 100%;
    }

    .kjje_div {

      .kj_item {
        width: 99px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        margin-bottom: 9px;
        background: url(/imgs/payment/monBg.webp) center no-repeat;
        background-size: 100%;

        &:not(:nth-child(3n+1)) {
          margin-left: 9px;
        }
      }
    }

    .cz-tips {
      font-size: 12px;
      text-align: center;
      color: #D16363;

      .txt {
        color: #60D580;
        margin-bottom: 10px;
      }

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

    .yh_item {
      :deep(.n-form-item-blank) {
        display: block;
      }

      .choose_yh {
        font-size: 14px;
        color: #8e82c2;
        height: 160px;
        padding: 10px;
        background: url(/imgs/payment/yh_bg.webp) center no-repeat;
        background-size: 100%;

        >div {
          margin-bottom: 10px;
        }
      }
      :deep(.nut-menu) {
        .nut-menu__bar {
          background: transparent !important;
        }
        .nut-icon {
          color: #8e82c2;
        }
      }
    }

  }

}
// 选择优惠
//:deep(.nut-action-sheet) {
//  min-height: 180px;
//  max-height: 360px;
//  background: #27155c;
//  width: 100%;
//  * {
//    background: #27155c;
//    color: #fff;
//  }
//  .nut-action-sheet__title {
//    border-color: #322c59;
//    position: fixed;
//    width: 100%;
//  }
//  .nut-action-sheet__menu {
//    padding-top: 40px;
//  }
//}
// 选择优惠
:deep(.nut-overlay) {
  top: 15px;
  background: rgba(0, 0, 0, .1);
}
:deep(.nut-menu) {
  .nut-popup {
    width: 315px;
    left: 30px;
    top: 15px;
    background: #27155c;
    border-radius: 8px;
    * {
      color: #fff;
    }
  }

}
</style>
