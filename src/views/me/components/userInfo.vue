<template>
  <div class="me_head">
    <div class="head_top">
      <div class="left_info">
        <img :src="`/imgs/head_icons/${hasLogin ? roleInfo.head_photo : 'default'}.webp`" alt="" class="mr-10">
        <div class="user_info" @click="toLogin">
          <span>{{ hasLogin ? userNameHiding(info.full_name) : '登录后游戏' }}</span>
          <span>{{ hasLogin ? userMoney : 0 }}</span>
        </div>
      </div>
      <div class="left_right">
        <img :src="`/imgs/level/newicon/level_${hasLogin ? VIPinfo.current_vip_level : 1}.webp`" alt="">
      </div>
    </div>
    <div class="head_down">
      <div class="vip_progress">
        <div class="vip_now">
          <span>VIP{{ hasLogin ? VIPinfo.current_vip_level : 1 }}</span>
          <iconpark-icon class="close " icon-id="mineiconhuangg" size="1rem"></iconpark-icon>
        </div>
        <div class="vip_now">
          <span>VIP{{ hasLogin ? VIPinfo.current_vip_level + 1 : 2 }}</span>
          <iconpark-icon class="close " icon-id="mineiconhuangg" size="1rem"></iconpark-icon>
        </div>
      </div>
      <div class="mt-5">
        <nut-progress :percentage="(VIPinfo.total_bet_money / target_bet_money) * 100" stroke-width="10"
          :show-text="false" />
        <!-- <van-progress :percentage="50" stroke-width="10"  track-color="#000000" :show-pivot="false" /> -->
      </div>
      <div class="role mt-4">
        <span class="level_role" v-shrink-on-click @click="router.push('/vip/rule')">{{ t('vip_level_rule') }}</span>
        <div class="need_add ">
          <span>{{ t('mine_remainBet') }}:</span>
          <nut-price :price="hasLogin ? target_bet_money : 0" size="small" style="color:#fff;" :decimal-digits="0"
            thousands :need-symbol="false" />

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n";
const router = useRouter()
import { User } from '@/store/user';
import { storeToRefs } from 'pinia';
import pinia from '@/store/index';
import { verifyNumberComma } from '@/utils/publicMethods'
const { t } = useI18n();
const store = User(pinia);
const { VIPinfo, info, roleInfo, hasLogin }: any = storeToRefs(store);

const target_bet_money: any = computed(() => {
  if (VIPinfo.value && VIPinfo.value?.vip_level_reward_config?.length > 0) {
    return VIPinfo.value?.vip_level_reward_config[VIPinfo.value?.current_vip_level || 0]?.target_bet_money
  } else {
    return 0
  }
})

const userMoney = computed(() => {
  return verifyNumberComma(String(roleInfo.value.bank_money + roleInfo.value.money))
})

/**
 * @description 转换用户名
 */
function userNameHiding(number: string) {
  if (number) {
    const hiddenChars1 = '**';
    let visibleChars;
    visibleChars = number.slice(0, 2) + hiddenChars1 + number.slice(4);
    return visibleChars;
  }
}

const toLogin = async () => {
  if (!hasLogin.value) {
    await store.setLogin(true)
  }

}

</script>

<style lang='scss' scoped>
.me_head {
  background-image: url(/imgs/me/info_bg.webp);
  background-size: 100% 100%;
  height: 175px;
  margin: 0 5px;


  .head_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 30px;
    width: 100%;

    .left_info {
      flex: 1;
      display: flex;
      align-items: center;


      img {
        height: 50px
      }

      .user_info {
        width: 100%;
        display: flex;
        flex-direction: column;

        span {
          &:nth-child(1) {
            width: 160px;
            display: inline-block;
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          &:nth-child(2) {
            color: #F1C232;
            font-size: 14px;
            font-weight: 400;
          }
        }

      }
    }

    .left_right {
      width: 94px;

      img {
        height: 24px
      }
    }
  }

  .head_down {
    padding: 0px 30px;

    .vip_progress {
      display: flex;
      justify-content: space-between;
    }

    .role {
      display: flex;
      justify-content: space-between;

      .level_role {
        color: #FFFFFF;
        font-size: 12px;
        border-bottom: 1px solid #ffffff;
      }

      .need_add {
        span {
          &:nth-child(1) {
            color: #F1C232;
            font-size: 12px;
          }

          &:nth-child(2) {
            color: #Ffffff;
            font-size: 12px;
          }
        }
      }
    }

    .vip_now {
      display: flex;
      align-items: center;
      color: #FFFFFF;
      font-size: 12px;

      img {
        height: 13px;
        margin-left: 3px;
      }
    }
  }

}

:deep(.nut-progress .nut-progress-outer) {

  background: #000;
}

:deep(.nut-progress .nut-progress-outer .nut-progress-inner) {
  height: 6px;
  margin-top: 2px;
  margin-left: 2px;
  background: linear-gradient(90deg, #FA7800 0%, #FBCA37 100%);

}
</style>