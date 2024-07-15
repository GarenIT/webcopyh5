<template>
  <div class="body vertical center ">
    <!-- 充值列表选择 -->
    <div :class="`flex space_between item_list ${curDepositWay.payname === item.payname ? 'active' : ''}`"
      v-for="(item, index) in usdtRecharge" :key="index">
      <div class="flex align_center item_list_l">
        <div class="bank_icon">
          <img :src="`/imgs/payment/icon/icon_${item.payname}.webp`" />
        </div>
        <div class="bank-txt">
          <div class="flex bank_name">
            <span class="bank_payName">{{ t(`api_${item.payname}`) }}</span>
            <a class="wh-icon" @click="onCloseSm"></a>
          </div>
          <div class="bank_limit">{{ item.minrecharge }} ~ {{ item.maxrecharge }}</div>
        </div>
      </div>
      <div class="item_list_r">
        <a @click="chooseWay(item)"> {{ t('deposit_page_use') }} </a>
      </div>
    </div>

    <!-- 充值说明 -->
    <nut-dialog class="deposit_sm_modal" :visible="showSmModal" :mask-closable="false">
      <div class="form_card">
        <div class="form_container vertical">
          <div class="header rel center">
            <span class="weight_5 ">{{ t('deposit_page_instructions') }}</span>
            <span class="close abs center pointer ">
              <Close @click="onCloseSm" icon-id="Group39368" color="#fff" size="1.5em" />
            </span>
          </div>
          <div class="body vertical center ">
            <div class="flex align_center justify_center sm_txt">
              <span>占位图</span>
            </div>
            <div class="flex space_between bank_list_item">
              <a v-for="(item, index) in usdtRecharge" :key="index">
                <img :src="`/imgs/payment/icon/icon_${item.payname}.webp`" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nut-dialog>


  </div>
</template>

<script setup lang='ts'>
import { useI18n } from "vue-i18n";
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Net } from '@/net/Net';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetPacket } from '@/netBase/NetPacket';
import { NetMsgType } from '@/netBase/NetMsgType';
import { Close } from '@nutui/icons-vue';
import { showToast } from '@nutui/nutui';
import { Local } from "@/utils/storage";
import { bankPayMethods, bankPayType } from "@/utils/publicMethods";


const { t } = useI18n();
const router = useRouter();
const showSmModal = ref(false);
const usdtRecharge = ref<any>(); // 充值银行列表
const legalRecharge = ref<any>([]);
const curDepositWay = ref({ payname: '' }); // 当前选择的充值方式

const baseMtdList = { label: t('addBank_page_pChoose'), value: -1, minrecharge: 0, maxrecharge: 0, paymethod: '' }
// 充值方式列表
const mtdList = ref<any>([{ ...baseMtdList }]);
const baseDcList = { label: t('deposit_page_notOffer'), value: 0 }
// 优惠列表
const dcList = ref<any>([{ ...baseDcList }]);
const discountList = ref<any>([]);

const chooseBank = ref({ label: '', value: '' }); // 选择的银行卡

// 重置
const resetData = () => {
  curDepositWay.value = { payname: '' }
  mtdList.value = [{ ...baseMtdList }]
  dcList.value = [{ ...baseDcList }]
  chooseBank.value = { label: '', value: '' }
}
// 获取充值信息
const getShopInfo = () => {
  const req = NetPacket.req_get_shop_info();
  Net.instance.sendRequest(req);
}
const handleShopInfoRes = (rs: any) => {
  resetData();
  // console.log('666', rs.rechargelist_by_paymenttype)
  // 匹配出银行的支付方式
  const newArr = [...rs.rechargelist_by_paymenttype].filter((item: any) => bankPayMethods.includes(item.paymenttype));
  // 为了赋值 payname 字段
  newArr.forEach((item: any) => {
    bankPayType.forEach((item_1: any) => {
      if (item.paymenttype === item_1.paymenttype) {
        item.payname = item_1.payname
      }
    })
  })
  console.log('-----', newArr)
  const bankNewObj: any = newArr.find((item: any) => item.payname === 'bankcard');
  const bankAll: any = [];
  if (bankNewObj.paymethod) {
    bankNewObj.paymethod.split(',').map((item: any, index: any) => {
      bankAll.push({
        maxrecharge: bankNewObj.maxrecharge,
        minrecharge: bankNewObj.minrecharge,
        paymenttype: 100 + index, // 银行转账 100,  网银直连 101， 扫码支付 102
        paymethod: item, // 没有用到
        payname: `bankcard_${index}`
      })
    })
  }
  // 非银行的支付方式
  const notBankArr = newArr.filter((item: any) => item.payname !== 'bankcard');
  usdtRecharge.value = bankAll.concat(notBankArr);
  // 需要过滤 limit 为 0 的数据
  discountList.value = rs.discount_list.filter((item: any) => item.limit)
  discountList.value.forEach((dc: any) => dcList.value.push({ label: dc.name, value: dc.discount_ID }));
  console.log('-------', usdtRecharge.value)
  usdtRecharge.value.map((item: any) => {
    legalRecharge.value.push(item);
    mtdList.value.push(
      {
        minrecharge: item.minrecharge,
        maxrecharge: item.maxrecharge,
        paymethod: item.paymethod,
        payname: item.payname,
        label: t(`api_${item.payname}`),
        value: item.paymenttype
      }
    );
  })
  Local.set('depositWayObj', { legalRecharge: legalRecharge.value, mtdList: mtdList.value })
  // emit('haveBankList', usdtRecharge.value.length > 0)
  // console.log('======', usdtRecharge.value)
};

const onCloseSm = () => {
  // showSmModal.value = !showSmModal.value
}
// 去充值
const goToDeposit = () => {
  if (!curDepositWay.value.payname) {
    return showToast.fail(t('method_error'));
  }
  router.push(`/depositNext`);
}
// 选择充值方式
const chooseWay = (data: any) => {
  Local.set('curDepositWay', data);
  // form.value.method = data.paymenttype
  curDepositWay.value = data;
  goToDeposit();
}

onMounted(() => {
  setTimeout(() => {
    getShopInfo();
  }, 600)
  // 获取银行信息
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_req_get_shop_info, handleShopInfoRes);
})
onUnmounted(() => {
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_req_get_shop_info, null);
})

</script>

<style lang='scss' scoped>
.body {
  height: 100vw;
  padding: 10px;
  color: #fff;

  .item_list {
    border-radius: 10px;
    width: 355px;
    height: 60px;
    padding: 10px;
    background: url(/imgs/payment/listBg.webp) center no-repeat;
    background-size: 100%;

    &.active {
      background-image: url(/imgs/payment/listBg_active.webp);
    }

    .item_list_l {
      .bank_icon {
        margin-right: 10px;

        img {
          width: 36px;
          height: 36px;
        }
      }

      .bank-txt {
        .bank_name {
          color: #93b4ff;

          .bank_payName {
            max-width: 160px;
            min-width: 60px;
          }

          .wh-icon {
            margin-left: 5px;
            width: 16px;
            height: 16px;
            background: url(/imgs/payment/wh.webp) center no-repeat;
            background-size: 100%;
          }
        }

        .bank_limit {
          font-size: 12px;
          color: #ffdc82;
        }
      }
    }

    .item_list_r {
      a {
        display: inline-block;
        text-align: center;
        width: 90px;
        height: 32px;
        line-height: 32px;
        background: url('/imgs/payment/go-btn.webp') center no-repeat;
        background-size: 100%;
      }
    }

  }
}
</style>