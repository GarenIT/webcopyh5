<template>
  <!-- 代理合作 -->
  <div class="content">
    <div class="top_title">
      <div>
        <span>{{t("identity")}}</span>
        <span>{{ IdentityMap[proxyInfo.level] || '--' }}</span>
      </div>
      <div>
        <span>{{t("Casino draws")}}</span>
        <span>{{ proxyInfo.ratio ? `${proxyInfo.ratio / 100}%（${t("proxy_page_value")}）` : '--' }}</span>
      </div>
    </div>
    <div class="main_top">
      <div class="commission">
        <span>{{t("total_commission")}}:</span>
        <span>{{ (proxyInfo.personal_money + proxyInfo.team_money) || '0' }}</span>
      </div>
      <div class="commission">
        <span>{{t("Team_commission")}}:</span>
        <span>{{ proxyInfo.team_money || '0' }}</span>
      </div>
      <div class="commission">
        <span>{{ t("Direct player commission") }}:</span>
        <span>{{ proxyInfo.personal_money || '0' }}</span>
      </div>
      <div class="top_btns">
        <Btn height="39px" width="109px" fontSize="12px" @click="router.push('/account_record')">{{ t("mine_myaudit") }}</Btn>
        <Btn height="39px" width="109px" fontSize="12px">{{t("WithDraw_Commission")}}</Btn>
      </div>
      <iconpark-icon icon-id="signicon08" size="1.8rem" class="refresh" :class="isRefreshing && 'refreshing'"
                     @click="refresh"></iconpark-icon>
    </div>
    <div class="link">
      <div class="text">
        {{ proxyInfo.s_link }}
      </div>
      <div class="link-right">
        <Btn height="30px" width="60px" fontSize="12px" @click="click_copy">{{ t("Copy") }}</Btn>
        <Btn height="30px" width="101px" fontSize="12px" @click="router.push('/agentIntroduction')">{{ t("Agent introduction") }}</Btn>
      </div>
    </div>
    <!-- 报表 -->
    <agentTable :proxyInfo="proxyInfo"></agentTable>

  </div>
</template>

<script setup lang="ts">
import Btn from '../../components/Btn.vue'
import agentTable from './components/agentTable.vue'
import { useRouter } from "vue-router";
import { MessageEvent2 } from "@/net/MessageEvent2.ts";
import { NetMsgType } from "@/netBase/NetMsgType.ts";
import { ref } from "vue";
import { IdentityMap } from "../../enums/proxyEnum.ts";
import { copyFn } from "@/utils/publicMethods.ts";
import { showToast } from "@nutui/nutui";
import { NetPacket } from "@/netBase/NetPacket.ts";
import { Net } from "@/net/Net.ts";
import { useI18n } from "vue-i18n";
// import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

const proxyInfo: any = ref({})
const resultHandle = (rs: any) => {
  proxyInfo.value = rs || {}
}

// 回执监听
MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_daily_return_info,
    resultHandle,
);

// 点击复制
const click_copy = () => {
  copyFn('测试文本')
  showToast.text("复制成功")
}

// 刷新代理链接
const isRefreshing = ref(false)
const refresh = () => {
  isRefreshing.value = true
  queryData()
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

const queryData = () => { // 查询
  const query = NetPacket.req_daily_return_info()
  Net.instance.sendRequest(query);
}
queryData()
</script>

<style lang="scss" scoped>
.content {
  padding: 0 10px 10px;
}

.main_top {
  position: relative;
  border-radius: 0px 0px 8px 8px;
  height: 142px;
  padding-top: 15px;
  background: linear-gradient(180deg, #110D24 -79.5%, #2C205C 59.76%, #261771 107.74%);
  box-shadow: 1px 5px 3px 1px #00000033;

  .commission {
    margin-left: 15px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;

    span {
      &:nth-child(1) {
        color: #ffffff
      }

      &:nth-child(2) {
        color: #8D84C5;
        margin-left: 5px;
        margin-top: 2px;
      }
    }
  }

  .top_btns {
    display: flex;
    gap: 6px;
    margin-top: 6px;
  }

  .refresh {
    position: absolute;
    right: 10px;
    top: 10px
  }
}

.top_title {
  color: #FFFFFF;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0px 0px;
  margin-top: 10px;
  height: 36px;
  width: 100%;
  padding: 0 10px;
  background: radial-gradient(87.04% 93.77% at 50% 13.97%, #4C36B3 0.17%, #3A2786 74.42%, #3C279A 100%);

}

.link {
  width: 100%;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  //flex-wrap: wrap;

  .text {
    width: 177px;
    flex: 1;
    font-size: 11px;
    color: #A2A5DE;
    word-wrap: break-word;
  }

  .link-right {
    width: 160px;
    flex-shrink: 0;
    display: flex;
    gap: 10px;
  }

}

.refreshing {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
