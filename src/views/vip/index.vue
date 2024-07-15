<template>
  <div class="vip">
    <scroll-view class="main-content">
      <div class="vip-top">
        <nut-swiper ref="swiperRef" @change="onChange">
          <nut-swiper-item v-for="(item, index) in levelListData" :key="index">
            <img :src="`/imgs/vip/level_${item.key}.webp`" alt="vip" style="height: 100%; width: 92%; margin-left: 4%"
              draggable="false">

            <div class="swiper_item_list">
              <div class="swiper_item_top">
                <div class="flex align_center item_top_rule">{{ t('level_page_rule') }}</div>
                <div class="item-top-num">{{ t('level_page_needBet') }}{{ countNeedBet(item.key) }}</div>
              </div>
              <!-- 进度条 -->
              <div class="item_pro">
                <span v-show="vipProcss(item).rate > 0" class="pro_inner" :style="`width: ${vipProcss(item).rateStr}`"> </span>
              </div>
              <div class="flex space_between align_center swiper_item_bottom">
                <div class="flex space_between align_center bottom_l">
                  <div class="flex align_center bottom_l-l">
                    <span> {{ t('level_page_wash_reward') }}: </span>
                    <span class="c-txt">{{ levelDataAll.daily_rebate || 0 }}</span>
                  </div>
                  <div class="flex align_center bottom_l_r">
                    <span class="icon_xmjl"></span>
                    <span class="jl_txt"> {{ t('level_page_wash_record') }} </span>
                  </div>
                </div>
                <div class="button bottom_r flex align_center justify_center"
                  :style="'background-image: url(/imgs/vip/level_btn_' + item.key + '.webp)'">
                  {{ t('level_page_lq') }}
                </div>
              </div>
            </div>
          </nut-swiper-item>
        </nut-swiper>
        <!--  跳转会员等级规则/洗码记录/领取按钮 -->
        <div class="swiper_click_btn">
          <div class="click_rule" @click="goToRule"></div>
          <div class="flex space_between click_bottom">
            <span @click="goToXmRecord"></span>
            <span class="lq_btn" @click="getRebate"></span>
          </div>

        </div>
        <!-- 轮播切换 -->
        <div class="swiper_btns flex space_between">
          <div class="swiper_btn swiper_btn_l" @click="handlePrev">
            <div class="icon">
            </div>
          </div>
          <div class="swiper_btn swiper_btn_r" @click="handleNext">
            <div class="icon">
            </div>
          </div>
        </div>
        <div class="vip_t_txt_all">
          <div class="vip_t_bg"></div>
          <div class="vip_t_txt flex">
            <span>VIP{{ curTab === 1 ? 9 : (curTab === 2 ? 10 : curTab - 2) }}</span>
            <span>VIP{{ curTab === 1 ? 10 : curTab - 1 }}</span>
            <span>VIP{{ curTab }}</span>
            <span>VIP{{ curTab === 9 ? 10 : (curTab === 10 ? 1 : curTab + 1) }}</span>
            <span>VIP{{ curTab === 9 ? 1 : (curTab === 10 ? 2 : curTab + 2) }}</span>
          </div>
        </div>

      </div>

      <div class="vip-content">
        <div class="flex space_between align_center vip_c_top">
          <span>Lv.{{ curTab }} {{ t('level_page_privilege') }}</span>
          <div class="c_top_r flex align_center">
            <span @click="openLevelRule">{{ t('level_page_paiTitle') }}</span>
            <span class="icon"></span>
          </div>
        </div>

        <div class="level_list_sec">
          <div class="list_item" v-for="(item, index) in levelDyData" :key="index">
            <div v-show="item.levelArr.includes(curTab)" class="flex align_center list_item_l">
              <span class="icon_xx"></span>
              <div class="title_big"> {{ item.title }} </div>
              <!--              <div> {{ item.titleSec }} </div>-->
            </div>
            <div class="flex space_between f_wrap list_item_r">
              <div v-show="item_1?.levelArr.includes(curTab)" class="list_item_r_item"
                v-for="(item_1, index_1) in item.child" :key="index + index_1">
                <div :class="`flex space_between list_item_bg ${item_1?.levelArr.includes(curTab) ? '' : 'not'}`">
                  <div class="item_l_txt">
                    <p class="flex align_center">{{ item_1.name }} </p>
                    <div v-show="index < 2" class="flex align_center justify_center vip_rate">
                      {{ item_1.icon === 'level_js' ? // 晋级奖励
          curVipLevelRewardConfig.promotional_reward_status.money :
          (item_1.icon === 'level_lj' ? // 每月礼金
            curVipLevelRewardConfig.gift_money_amount :
            toFixedNumber(Number(curVipLevelRewardConfig.ratio.split(',')[index_1]) * 100) + '%'
          )
                      }}
                    </div>
                  </div>
                  <div :class="`item_img img_${item_1.icon}`">
                    <img :src="`/imgs/vip/${item_1.icon}.webp`">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </scroll-view>

    <Modal v-model:visible="ruleModal" :title="t('level_page_paiTitle')">
      <div class="popup_body">
        <div class="form_card">
          <div class="form_container vertical">
            <div class="body vertical center">
              <div class="list_tip"> {{ t('level_page_paiRule_1') }} </div>
              <div class="list_tip"> {{ t('level_page_paiRule_2') }} </div>
              <div class="list_tip"> {{ t('level_page_paiRule_3') }} </div>
            </div>
          </div>
        </div>
        <div class="submit_btn flex justify_center">
          <Btn height="44px" width="200px" @click="ruleModal = false" class="submit">{{ t('home_page_confirm') }}</Btn>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from "vue-i18n";
import { Net } from '@/net/Net';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetPacket } from '@/netBase/NetPacket';
import { NetMsgType } from '@/netBase/NetMsgType';
import { showToast } from '@nutui/nutui';
import { storeToRefs } from "pinia";
import pinia from "@/store";
import { User } from '@/store/user';
import ScrollView from '@/components/ScrollView.vue'
import Btn from "@/components/Btn.vue";
import Modal from "@/components/Modal.vue";
import { useRouter } from "vue-router";
import { toFixedNumber } from "@/utils/publicMethods.ts";

const router = useRouter();
const store = User(pinia);
const { VIPinfo }: any = storeToRefs(store);
const { t } = useI18n();
const ruleModal = ref(false);
const swiperRef = ref();
const baseVipLevelRewardConfig = [ // 基本数据
  {
    "level": 1,
    "target_bet_money": 0,
    "promotional_reward_status": {
      "status": 0,
      "money": 0
    },
    "gift_money_amount": 0,
    "ratio": "0.004, 0.006, 0.004, 0.0005, 0.006, 0.004"
  },
  {
    "level": 2,
    "target_bet_money": 12500000,
    "promotional_reward_status": {
      "status": 0,
      "money": 28000
    },
    "gift_money_amount": 38000,
    "ratio": "0.004, 0.007, 0.004, 0.0005, 0.007, 0.004"
  },
  {
    "level": 3,
    "target_bet_money": 50000000,
    "promotional_reward_status": {
      "status": 0,
      "money": 100000
    },
    "gift_money_amount": 150000,
    "ratio": "0.0045, 0.0075, 0.0045, 0.0005, 0.008, 0.0045"
  },
  {
    "level": 4,
    "target_bet_money": 150000000,
    "promotional_reward_status": {
      "status": 0,
      "money": 300000
    },
    "gift_money_amount": 380000,
    "ratio": "0.005, 0.008, 0.005, 0.001, 0.0085, 0.005"
  },
  {
    "level": 5,
    "target_bet_money": 500000000,
    "promotional_reward_status": {
      "status": 0,
      "money": 880000
    },
    "gift_money_amount": 1280000,
    "ratio": "0.0055, 0.0085, 0.0055, 0.001, 0.009, 0.0055"
  },
  {
    "level": 6,
    "target_bet_money": 2000000000,
    "promotional_reward_status": {
      "status": 0,
      "money": 3380000
    },
    "gift_money_amount": 4680000,
    "ratio": "0.006, 0.009, 0.006, 0.001, 0.0095, 0.006"
  },
  {
    "level": 7,
    "target_bet_money": 8000000000,
    "promotional_reward_status": {
      "status": 0,
      "money": 13800000
    },
    "gift_money_amount": 15000000,
    "ratio": "0.0065, 0.01, 0.0065, 0.0015, 0.01, 0.0065"
  },
  {
    "level": 8,
    "target_bet_money": 16000000000,
    "promotional_reward_status": {
      "status": 0,
      "money": 26000000
    },
    "gift_money_amount": 28000000,
    "ratio": "0.007, 0.0105, 0.007, 0.0015, 0.0105, 0.007"
  },
  {
    "level": 9,
    "target_bet_money": 32000000000,
    "promotional_reward_status": {
      "status": 0,
      "money": 50000000
    },
    "gift_money_amount": 53800000,
    "ratio": "0.0075, 0.0105, 0.0075, 0.002, 0.011, 0.0075"
  },
  {
    "level": 10,
    "target_bet_money": 150000000000,
    "promotional_reward_status": {
      "status": 0,
      "money": 238000000
    },
    "gift_money_amount": 258000000,
    "ratio": "0.008, 0.012, 0.008, 0.002, 0.012, 0.008"
  }
]
const levelDataAll: any = ref({
  current_vip_level: 0,
  daily_rebate: 0,
  total_bet_money: 0,
  vip_level_reward_config: [...baseVipLevelRewardConfig],
});
const curVipLevelRewardConfig = ref({ ...levelDataAll.value.vip_level_reward_config[0] }); // 默认第一条
const loading = ref(false);
const curTab = ref(1);
const levelListData = ref(
  [
    { level: 'VIP1', key: 1 },
    { level: 'VIP2', key: 2 },
    { level: 'VIP3', key: 3 },
    { level: 'VIP4', key: 4 },
    { level: 'VIP5', key: 5 },
    { level: 'VIP6', key: 6 },
    { level: 'VIP6', key: 7 },
    { level: 'VIP6', key: 8 },
    { level: 'VIP6', key: 9 },
    { level: 'VIP6', key: 10 },
  ]
);
const levelDyData = ref(
  [
    {
      key: 'vip', title: t('level_page_vip'), titleSec: 'VIP GIFT MONEY', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      child: [
        { name: t('level_page_bonus'), icon: 'level_js', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { name: t('level_page_month_gift'), icon: 'level_lj', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      ]
    },
    {
      key: 'chip', title: t('level_page_code'), titleSec: 'CHIP DISCOUNT', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      child: [
        { name: t('level_page_live_bet'), icon: 'level_live', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { name: t('level_page_slot_bet'), icon: 'level_game', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { name: t('level_page_sport_bet'), icon: 'level_sport', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { name: t('level_page_lottery'), icon: 'level_lottery', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { name: t('level_page_chess'), icon: 'level_chess', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { name: t('level_page_eSport'), icon: 'level_esport', levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      ]
    },
    {
      key: 'enjoy', title: t('level_page_privileges'), titleSec: 'ENJOY PRIVILEGES', levelArr: [4, 5, 6, 7, 8, 9, 10],
      child: [
        { name: t('level_page_manager'), icon: 'level_vip', levelArr: [4, 5, 6, 7, 8, 9, 10] },
        { name: t('level_page_access'), icon: 'level_deposit', levelArr: [4, 5, 6, 7, 8, 9, 10] },
        { name: t('level_page_activity'), icon: 'level_promo', levelArr: [4, 5, 6, 7, 8, 9, 10] },
        { name: t('level_page_domain'), icon: 'level_ym', levelArr: [7, 8, 9, 10] },
      ]
    },
    {
      key: 'tq', title: t('level_page_private'), titleSec: 'PRIVATE PRIVILEGES', levelArr: [8, 9, 10],
      child: [
        { name: t('level_page_secretary'), icon: 'level_sw', levelArr: [8, 9, 10] },
        { name: t('level_page_reception'), icon: 'level_gb', levelArr: [8, 9, 10] },
        { name: t('level_page_month_gift'), icon: 'level_lj', levelArr: [8, 9, 10] },
      ]
    },
  ]
);

const onChange = (index: any) => {
  curTab.value = index + 1
}
const handlePrev = () => {
  swiperRef.value?.prev()
}
const handleNext = () => {
  swiperRef.value?.next()
}
// 跳转到会员等级规则
const goToRule = () => {
  router.push(`/vip/rule`)
}
// 获取等级数据
// const queryData = () => {
//   loading.value = true
//   setTimeout(() => {
//     loading.value = false
//   }, 300)
//   const query = NetPacket.req_vip_info();
//   Net.instance.sendRequest(query);
// }

// 数据处理
const resultHandle = (res: any) => {
  console.log('level-data--------', res, VIPinfo.value)
  setTimeout(() => {
    loading.value = false
  }, 300)
  // levelDataAll.value = res;
  if (Object.keys(VIPinfo.value).length > 0) {
    levelDataAll.value = VIPinfo.value;
    curTab.value = levelDataAll.value.current_vip_level;
    setCurLevel();
    swiperRef.value.to(Number(VIPinfo.value.current_vip_level) - 1); // 跳转到对应的层级轮播
  }
}
// money: 0, result: 2 // 1 成功，2 失败
const resultHandleClaim = (res: any) => {
  setTimeout(() => {
    loading.value = false
  }, 300)
  if (res.result === 1) {
    showToast.success(`${t('level_page_getScu')} ${res.money}`)
    levelDataAll.value.daily_rebate = 0; //领取成功重置奖励
  } else {
    showToast.fail(t('level_page_getFail'))
  }
}
// 打开等级规则弹窗
const openLevelRule = () => {
  ruleModal.value = true;
}
// 计算所需投注
const countNeedBet = (key: any) => {
  if (levelDataAll.value.vip_level_reward_config && levelDataAll.value.vip_level_reward_config.length) {
    // const targetArr = levelDataAll.value.vip_level_reward_config[Number(levelDataAll.value.current_vip_level) + 1]
    const targetArr = levelDataAll.value.vip_level_reward_config.find((item: any) => item.level === Number(key))
    const targetMon = targetArr.target_bet_money;
    return targetMon || 0;
    // return targetMon - Number(levelDataAll.value.total_bet_money) || 0;
  } else {
    return 0;
  }

}
// 计算vip 等级进度
const vipProcss = (data: any) => {
  if (levelDataAll.value.vip_level_reward_config && levelDataAll.value.vip_level_reward_config.length) {
    // levelDataAll.value.total_bet_money = 2654000;
    // const curIndex = levelDataAll.value.current_vip_level == 10 ? 0 : Number(levelDataAll.value.current_vip_level) + 1;
    const curIndex = data.key - 1;
    const targetArr = levelDataAll.value.vip_level_reward_config[curIndex]
    const targetMon = targetArr?.target_bet_money;
    const rate = Number(targetMon) === 0 ? 100 : (Number(levelDataAll.value.total_bet_money) / targetMon) * 100; // 如果 targetMon 为 0 则进度是 100
    const obj = {
      rate: rate,
      rateStr: `${rate}%`
    }
    // console.log('-----', rate, levelDataAll.value.total_bet_money)
    return obj;
  } else {
    return {
      rate: 0,
      rateStr: `0%`
    }
  }

}
// 领取返水奖励 ， 是哪个接口
const getRebate = () => {
  console.log('领取---')
  if (levelDataAll.value.daily_rebate === 0) {
    return showToast.fail(t('level_page_notAward'))
  }
  loading.value = true
  const query = NetPacket.req_vip_daily_claim();
  Net.instance.sendRequest(query);

}
// 洗码记录
const goToXmRecord = () => {
  router.push(`/wash_record`);
}
// 设置 选中当前等级数据
const setCurLevel = () => {
  curVipLevelRewardConfig.value = levelDataAll.value.vip_level_reward_config.find((item: any) => item.level === curTab.value)
}

watch(
  () => curTab.value,
  (n) => {
    if (n) {
      setCurLevel();
    }
  }
);
watch(
  () => VIPinfo.value,
  (n) => {
    if (n) {
      levelDataAll.value = n;
      setCurLevel();
    }
  }
);

onMounted(() => {
  // queryData();
  resultHandle('');
  // MessageEvent2.addMsgEvent(
  //   NetMsgType.msgType.msg_notify_vip_info,
  //   resultHandle,
  // );
  // 领取反水奖励
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_vip_claim_status,
    resultHandleClaim,
  );
})
onUnmounted(() => {
  // MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_vip_info, null);
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_vip_claim_status, null);
})

</script>

<style lang='scss' scoped>
.vip {
  height: 100vh;
  color: #fff;

  .main-content {
    height: calc(100vh - 70px);
  }

  .vip-top {
    position: relative;
    margin-top: 6px;

    :deep(.nut-swiper) {
      .nut-swiper-inner {
        height: 184px !important;
      }
    }

    .swiper_item_list {
      position: absolute;
      bottom: 23px;
      font-size: 2.5vw;
      width: 321px;
      height: 80px;
      transform: translate(27px, 14px);

      .swiper_item_top {
        .item_top_rule {
          //transform: scale(.87);
          padding-left: 20px;
        }

        .item-top-num {
          margin-top: 7px;
        }
      }

      .item_pro {
        margin: 4.5px 0 0;
        position: relative;
        flex: auto;
        height: 8px;
        //border-radius: 20px;
        //box-shadow: inset 0 0 4px 0 #000;
        //background-blend-mode: color-burn, overlay, normal;
        //background: url(/imgs/level/level_pro_jd.webp) center no-repeat;

        .pro_inner {
          max-width: 100%;
          display: inline-block;
          height: 6px;
          position: absolute;
          left: 0;
          top: 2px;
          border-radius: 12px;
          box-shadow: inset 0 0 8px 0 #fff;
          border-style: solid;
          border-width: 1px;
          background: linear-gradient(90deg, #FA7800 0%, #FBCA37 100%);
        }
      }

      .swiper_item_bottom {
        height: 30px;
        margin-top: 5px;

        .bottom_l {
          font-size: 2.5vw;
          width: 225px;

          .bottom_l-l {
            padding-left: 28px;

            .c-txt {
              font-size: 16px;
              color: #FFD56D;
            }
          }

          .bottom_l_r {
            max-width: 60px;
            line-height: 10px;

            .icon_xmjl {
              width: 20px;
              height: 20px;
              background: url(/imgs/vip/vip_icon_jilv.webp) center no-repeat;
              background-size: 100%;
            }
            .jl_txt {
              width: 50px;
            }
          }
        }

        .bottom_r {
          width: 88px;
          height: 28px;
          background-size: 100%;
        }
      }
    }

    .swiper_click_btn {
      width: 320px;
      position: absolute;
      z-index: 9;
      left: 50%;
      bottom: 58px;
      transform: translateX(-50%);

      .click_rule {
        width: 90px;
        height: 20px;
        margin-bottom: 35px;
      }

      .click_bottom {
        height: 28px;

        span {
          flex: 1;
        }

        .lq_btn {
          flex: none;
          width: 100px;
        }
      }

    }

    .swiper_btns {
      width: 100%;
      position: absolute;
      top: 44%;
      transform: translateY(-50%);
      z-index: 1;
    }

    .swiper_btn {
      border-radius: 0 5px 5px 0;
      border: 1px solid rgba(255, 255, 255, .7);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 42px;
      -webkit-backdrop-filter: blur(1px);
      backdrop-filter: blur(1px);
      box-shadow: 0.5px 0.5px 0 0 rgba(255, 255, 255, 0.5);
      background-color: rgba(0, 0, 0, 0.2);

      .icon {
        width: 10px;
        height: 12px;
        background: url(/imgs/vip/icon_jt.webp) center no-repeat;
        background-size: 100%;
      }

      &.swiper_btn_l {
        border-left: 0;
      }

      &.swiper_btn_r {
        border-radius: 5px 0 0 5px;
        border-right: 0;

        .icon {
          transform: rotate(180deg);
        }
      }
    }

    .vip_t_txt_all {
      .vip_t_bg {
        margin-top: 6px;
        height: 20px;
        background: url(/imgs/vip/vip_txt_bg.webp) center no-repeat;
        background-size: 100%;
      }

      .vip_t_txt {
        span {
          flex: 1;
          text-align: center;
          font-size: 12px;

          &:first-child,
          &:nth-child(5) {
            color: #4D4D61;
          }

          &:nth-child(2),
          &:nth-child(4) {
            color: #7E7F98;
          }

          &:nth-child(3) {
            position: relative;
            font-size: 16px;
            font-weight: bold;
            background: -webkit-linear-gradient(45deg, #C4B8FF, #FFC8B6);
            /* Chrome, Safari */
            background: linear-gradient(45deg, #C4B8FF, #FFC8B6);
            /* 标准语法 */
            -webkit-background-clip: text;
            /* Chrome, Safari */
            background-clip: text;
            -webkit-text-fill-color: transparent;
            /* Chrome, Safari */
            color: transparent;

            /* 其他浏览器 */
            &::after {
              display: inline-block;
              position: absolute;
              content: '';
              width: 36px;
              height: 11px;
              left: 20px;
              top: 9px;
              background: url(/imgs/vip/icon_yq.webp) center no-repeat;
              background-size: 100%;
            }
          }
        }
      }

    }


  }

  .vip-content {
    position: relative;
    border-radius: 8px;
    margin: 14px auto;
    width: 355px;
    background-image: radial-gradient(circle at 50% 22%, #281d57 15%, #151522 98%);

    .vip_c_top {
      position: absolute;
      font-size: 16px;
      padding: 0 14px 5px;
      width: 100%;
      height: 40px;
      background: url(/imgs/vip/list_top.webp) center no-repeat;
      background-size: 100%;
      border-radius: 8px 8px 0 0;

      .c_top_r {
        font-size: 12px;
        color: #c0c2db;

        .icon {
          width: 14px;
          height: 14px;
          margin-left: 4px;
          background: url(/imgs/vip/icon_wh.webp) center no-repeat;
          background-size: 100%;
        }
      }
    }

    .level_list_sec {
      padding: 50px 14px 14px;
      border: 1px solid #646CFF;
      border-top: 0;
      border-radius: 8px;

      .list_item {
        .list_item_l {
          font-size: 16px;
          margin-bottom: 8px;

          .icon_xx {
            width: 14px;
            height: 14px;
            background: url(/imgs/vip/icon_xx.webp) center no-repeat;
            background-size: 100%;
          }
        }

        .list_item_r {
          .list_item_r_item {
            position: relative;
            font-size: 2.8vw;
            width: 160px;
            height: 68px;
            margin-bottom: 10px;
            padding: 5px 0 5px 15px;
            background: url(/imgs/vip/bg_item.webp) center no-repeat;
            background-size: 100%;

            &::after {
              position: absolute;
              display: block;
              content: '';
              width: 18px;
              height: 18px;
              background: url(/imgs/vip/icon_list_top.webp) center no-repeat;
              background-size: 100%;
              top: -5px;
              right: -5px;
            }

            .list_item_bg {
              .item_l_txt {
                p {
                  margin-top: 5px;
                  height: 32px;
                  line-height: 14px;
                }

                .vip_rate {
                  width: 62px;
                  height: 22px;
                  background: url(/imgs/vip/rate_bg.webp) center no-repeat;
                  background-size: 100%;
                }
              }

              .item_img {
                width: 61px;
                height: 51px;
                margin-top: 2px;

                img {
                  width: 100%;
                }

                &.img_level_live {
                  img {
                    width: 94%;
                  }
                }

                &.img_level_game {
                  img {
                    width: 86%;
                  }
                }

                &.img_level_sport {
                  img {
                    width: 89%;
                  }
                }

              }
            }
          }

        }

      }
    }
  }

}

// 规则
.popup_body {
  color: #fff;

  .form_card {
    padding: 16px 20px;
    color: #c0c2db;
    font-size: 13px;
  }

  .btn-content {
    margin: 0 auto 25px;
  }
}
</style>