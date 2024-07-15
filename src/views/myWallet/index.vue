<template>
  <div class="my_wallet">

    <div class="head">
      <nut-navbar class="navbar" z-index="5" :clickable="false">
        <template #content>
          <span>{{ t('route_page_wallet') }}</span>
        </template>
        <template #left>
          <iconpark-icon @click="router.go(-1)" class="close" icon-id="tongyicontyfanh" size="2.4rem"></iconpark-icon>
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

    <div class="body">
      <div class="amount">
        <div class="content">
          <div class="info_base">
            <iconpark-icon v-if="tranType == 'in'" name="wallrticonzr01" size="32"></iconpark-icon>
            <iconpark-icon v-else name="wallrticonzc01" size="32"></iconpark-icon>
            <div>
              <span>Amount to carry</span>
              <span v-if="eyeOpen">{{ gameMoney }}</span>
              <span v-else>*******</span>
            </div>
          </div>
          <div class="arrow">
            <div class="line"></div>
            <iconpark-icon v-if="tranType == 'in'" name="wallrticonzc03" size="54"></iconpark-icon>
            <iconpark-icon v-else name="wallrticonzr03" size="54"></iconpark-icon>
            <div class="line"></div>
          </div>
          <div class="info_base">
            <iconpark-icon v-if="tranType == 'out'" name="wallrticonzr02" size="32"></iconpark-icon>
            <iconpark-icon v-else name="wallrticonzc02" size="32"></iconpark-icon>
            <div>
              <span>Safe amount</span>
              <span v-if="eyeOpen">{{ bankMoney }}</span>
              <span v-else>*******</span>
            </div>
          </div>
        </div>
        <div class="hint">
          <iconpark-icon name="tongyiconhonsts02"></iconpark-icon>
          温馨提示：提款需先将金额转入保险柜
        </div>
      </div>

      <div class="tab">
        <div :class="{ tab_ac: tranType == 'in' }" @click="changeTranType('in')">
          <iconpark-icon name="wallrticontongy04" size="18"></iconpark-icon>
          转入
        </div>
        <div :class="{ tab_ac: tranType == 'out' }" @click="changeTranType('out')">
          <iconpark-icon name="wallrticontongy05" size="18"></iconpark-icon>
          转出
        </div>
      </div>

      <div class="calc">
        <!--金额输入-->
        <div class="ipt">
          <nut-input v-model="tranMoney" right-icon="123" placeholder="转化金额">
            <template #right>
              <img src="/imgs/wallet/chongz_icon_youjin02.svg" alt="" style="width: 24px;height: 24px;"
                @click="resetTranMoney">
            </template>
          </nut-input>
          <Btn height="33px" width="107px" fontSize="12px" @click="allTranferMon">全部</Btn>
        </div>
        <!--范围滑块-->
        <nut-range v-model="value" @change="formatTooltip" class="range" hidden-range hidden-tag
          :disabled="!canSlide"></nut-range>
        <!--金额按钮-->
        <div class="button_list">
          <nut-button v-for="(item, index) in chooseMoneyArr" :key="index"
            :class="tranMoney == item.value && 'btn_block'" @click="chooseFastMon(item.value)">
            {{ item.label }}
          </nut-button>
        </div>
      </div>

      <div class="confirm">
        <Btn height="43px" width="200px" fontSize="16px" @click="handleSubmit">
          <img src="/imgs/wallet/money-send.webp" alt="">确定
        </Btn>
      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useWalletInfo from "@/views/myWallet/useWalletInfo.ts";
import { useRouter } from "vue-router";
import Btn from "@/components/Btn.vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 范围滑块
const value = ref(0)
const router = useRouter()
const refresh = () => {
  refreshWallet()
}

const {
  changeEyeOpen,
  gameMoney,
  bankMoney,
  refreshWallet,
  refreshFlag,
  tranType,
  changeTranType,
  tranMoney,
  chooseMoneyArr,
  canSlide,
  formatTooltip,
  handleSubmit,
  chooseFastMon,
  eyeOpen,
  resetTranMoney,
  allTranferMon,
} = useWalletInfo()
</script>

<style lang="scss" scoped>
.my_wallet {
  .right-handler {
    display: flex;
    gap: 15px;
  }

  .refresh {
    animation: refresh 1s infinite;
  }

  @keyframes refresh {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .body {
    padding: 0 15px;
  }

  .amount {
    width: 100%;
    height: 264px;
    margin: 0 0 15px;
    padding: 15px 10px 16px;
    border-radius: 8px;
    background: url(/imgs/wallet/wallet_bg1.webp) no-repeat;
    background-size: 100% 100%;
    display: grid;
    grid-template-rows: 201px auto;
  }

  .content {
    height: 201px;
    margin: 0 0 15px;
    padding: 0 2px 16px;
    border-radius: 8px;
    background: url(/imgs/wallet/wallet_bg2.webp) no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .info_base {
      display: flex;
      align-items: center;
      gap: 7px;
      width: 55%;

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;

        &>span:first-child {
          font-size: 12px;
          color: #9a95c9;
        }

        &>span:last-child {
          font-size: 16px;
          color: #fff;
        }
      }
    }

    .arrow {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .line {
        width: 320px;
        height: 1px;
        opacity: 0.2;
        background-image: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #fff 41%, rgba(255, 255, 255, 0) 100%);
      }

      img {
        width: 54px;
        height: 54px;
      }
    }
  }

  .hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transform: translateY(-8px);

    text-align: center;
    color: #fff;
    font-size: 11px;
  }

  .tab {
    margin-bottom: 30px;
    background: url(/imgs/email/nav_bar.webp) no-repeat center;
    background-size: 100% 100%;
    height: 45px;
    display: flex;
    align-items: center;
    padding: 0 4px;

    div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #C0C2DB;
      gap: 4px;
    }

    .tab_ac {
      background: url(/imgs/email/email_btn.webp) center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
      height: 34px;
      // margin-top: 5px;
    }
  }

  .calc {
    width: 100%;
    height: 150px;
    background: url(/imgs/wallet/wallet_bg3.webp) no-repeat center;
    background-size: 100% 100%;
    padding: 15px;

    .ipt {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .nut-input {
        width: 197px;
        border: 1px solid #322c59;
        border-radius: 10px;
        padding: 10px;
        box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
        background-blend-mode: overlay;
        background: linear-gradient(to bottom, rgba(126, 126, 126, 0.1), rgba(21, 21, 21, 0.1)), #1d0e4a;
        //background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(to bottom, rgba(126, 126, 126, 0.1), rgba(21, 21, 21, 0.1)), #1d0e4a;
        //background-blend-mode: color-burn, overlay;
      }

      //.nut-button {
      //  width: 107px;
      //}
    }
  }

  .range {
    //height: 18px;
    margin: 15px 0 25px 0;

    :deep() {
      .nut-range {
        &::before {
          height: 8px;
          border-radius: 7px;
          box-shadow: inset 0 0 4px 0 #000;
          background-blend-mode: color-burn, overlay, normal;
          background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), radial-gradient(circle at 50% 50%, #7e7e7e, #151515 100%), linear-gradient(to bottom, var(--bg-decreased-1), var(--bg-decreased-1));
          background-color: transparent;
          transform: translateY(5px);
        }
      }

      .nut-range-bar {
        height: 6px;
        margin: 6px 20.1px 6px 0;
        border-radius: 13px;
        background-image: linear-gradient(to right, #fa7800, #fbcb38 100%);
      }

      .nut-range-button {
        width: 32px;
        height: 18px;
        border-radius: 7.2px;
        box-shadow: 0 1.4px 1.4px 0 rgba(29, 14, 74, 0.3);
        border-style: solid;
        border-width: 0.7px;
        border-image-source: linear-gradient(to top, #fff, #fff);
        border-image-slice: 1;
        background-image: radial-gradient(circle at 50% 0%, #d7e2ff, #a8bfff 57%, #d7e2ff 75%), linear-gradient(to top, #fff, #fff);
        background-origin: border-box;
        background-clip: content-box, border-box;
      }
    }
  }

  .button_list {
    display: flex;
    gap: 5px;
    overflow: auto;

    .nut-button {
      height: 24px;
      gap: 5.6px;
      color: #fff;
      padding: 0 4px;
      border-radius: 8.4px !important;
      border: none;
      background-image: radial-gradient(circle at 50% 14%, #4c36b3 0%, #3a2786 46%, #3c279a 62%), linear-gradient(to bottom, #fff 0%, #af9eff 102%);
      //background-origin: border-box;
      //background-clip: content-box, border-box;
    }
  }

  .confirm {
    display: flex;
    justify-content: center;

    :deep() {
      .submit {
        display: flex;
        align-items: center;
        gap: 3px;
      }
    }
  }
}

:deep() {
  .nut-navbar {
    margin-top: 10px !important;
  }
}
</style>