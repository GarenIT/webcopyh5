<template>
  <div class="level_content">
    <scroll-view class="main_content">
      <div class="level_rules">
        <div class="level_list">
          <div class="flex space_around le_l_header">
            <span> {{ t('level_page_member') }} </span>
            <span> {{ t('level_page_pBet') }} </span>
            <span> {{ t('level_page_bonus') }} </span>
            <span> {{ t('level_page_monGift') }} </span>
          </div>
          <div class="flex align_center le_l_content">
            <div class="le_l_l le_l_l_sec">
              <div class="flex space_around le_l_l_tr" v-for="(item, index) in vipLevelRewardConfig" :key="index">
                <span> VIP{{ item.level }} </span>
                <span> {{ item.target_bet_money }} </span>
                <span> {{ item.promotional_reward_status.money || '-' }} </span>
                <span> {{ item.gift_money_amount || '-' }} </span>
              </div>
            </div>
          </div>

        </div>

        <div class="level_tip_content">
          {{ t('level_page_rule_1') }}<br>
          {{ t('level_page_rule_2') }}<br>
          {{ t('level_page_rule_3') }}<br>
          {{ t('level_page_rule_4') }}<br>
          {{ t('level_page_rule_5') }}<br>
          {{ t('level_page_rule_6') }}
        </div>

        <div class="level_tip level_tip_sec"> {{ t('level_page_mAward') }} </div>
        <div class="level_list level_list_sec">
          <div class="flex space_around le_l_header">
            <span> {{ t('level_page_member') }} </span>
            <span> {{ t('level_page_live') }} </span>
            <span> {{ t('home_page_slot') }} </span>
            <span> {{ t('home_page_sportsGame') }} </span>
            <span> {{ t('home_page_lotteryGame') }} </span>
            <span> {{ t('home_page_pokerGame') }} </span>
            <span> {{ t('home_page_eSports') }} </span>
          </div>
          <div class="flex align_center le_l_content">
            <div class="le_l_l le_l_l_sec">
              <div class="flex space_around le_l_l_tr" v-for="(item, index) in vipLevelRewardConfig" :key="index">
                <span> VIP{{ item.level }} </span>
                <template v-for="(item_1) in item.ratio.split(',')">
                  <span> {{ toFixedNumber(Number(item_1) * 100) + '%' }} </span>
                </template>
              </div>
            </div>
          </div>

        </div>
        <div class="level_tip_content">
          {{ t('level_page_rule_sec_1') }}<br>
          {{ t('level_page_rule_sec_2') }}<br>
          {{ t('level_page_rule_sec_3') }}<br>
          {{ t('level_page_rule_sec_4') }}<br>
          {{ t('level_page_rule_sec_5') }}<br>
          {{ t('level_page_rule_sec_6') }}<br>
          {{ t('level_page_rule_sec_7') }}<br>
          {{ t('level_page_rule_sec_8') }}<br>
          {{ t('level_page_rule_sec_9') }}<br>
          {{ t('level_page_rule_sec_10') }}
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import { useI18n } from "vue-i18n";
import ScrollView from "@/components/ScrollView.vue";
import pinia from "@/store";
import { User } from '@/store/user';
import { storeToRefs } from "pinia";
import { toFixedNumber } from "@/utils/publicMethods.ts";

const { t } = useI18n();
const store = User(pinia);
const { VIPinfo }: any = storeToRefs(store);
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
const vipLevelRewardConfig = ref(VIPinfo.value?.vip_level_reward_config || [...baseVipLevelRewardConfig]);

watch(
  () => VIPinfo.value,
  (n) => {
    if (n) {
      vipLevelRewardConfig.value = n.vip_level_reward_config;
    }
  }
);
</script>

<style lang='scss' scoped>
.main_content {
  height: calc(100vh - 110px);
}

.level_rules {
  color: #fff;
  font-size: 12px;
  padding: 0 10px;

  .level_tip {
    margin-bottom: 5px;
    color: #A2A5DE;
    font-weight: 900;

    &.level_tip_sec {
      margin-top: 10px;
    }
  }

  .level_list {
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
    background-color: #1f2032;

    .le_l_header {
      position: relative;
      height: 42px;
      background: url(/imgs/vip/headerBg.webp) center no-repeat;
      background-size: 100%;
      border-radius: 8px 8px 0 0;
      background-position-y: -4px;

      span {
        position: relative;
        height: 42px;
        line-height: 36px;
        flex: 1;
        text-align: center;

        &::after {
          content: '';
          position: absolute;
          width: 1px;
          height: 33px;
          right: 3px;
          background: url(/imgs/vip/headerBg_line.webp) center no-repeat;
          background-size: 100%;
        }

        &:last-child {
          &::after {
            background: none;
          }
        }
      }
    }

    &.level_list_sec {
      .le_l_header {
        span {
          width: 16.66%;
        }
      }
    }

    .le_l_content {
      width: 99.5%;
      margin: 0 auto;
      border-radius: 0 0 8px 8px;
      background-color: #2f1d7d;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);

      .le_l_l {
        width: 75%;

        &.le_l_l_sec {
          width: 100%;
        }

        span {
          flex: 1;
          text-align: center;
        }

        .le_l_l_tr {

          &:nth-child(2n+1) {
            background: #27155c;
            color: #8e82c2;
          }

          &:nth-child(2n) {
            background: #2f1d7d;
          }

          span {
            height: 24px;
            line-height: 24px;
            transform: scale(.9);
            border-right: 1px solid rgba(135, 161, 206, .2);

            &:last-child {
              border-right: 0;
            }
          }
        }

      }
    }

  }

  .level_tip_content {
    line-height: 24px;
  }

}
</style>
