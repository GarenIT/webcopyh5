<template>
  <div class="game-details">
    <nut-navbar class="navbar" z-index="5" :clickable="false">
      <template #left>
        <iconpark-icon @click="router.go(-1)" class="close" icon-id="tongyicontyfanh" size="2.4rem"></iconpark-icon>
        <span>AG</span>
      </template>
      <template #right>
        携带金额 {{ gameMoney }}
      </template>
    </nut-navbar>
    <div class="content">
      <div class="tab">
        <div :class="{ tab_ac: tab_id == 1 }" @click="tab_id = 1">电子</div>
        <div :class="{ tab_ac: tab_id == 2 }" @click="tab_id = 2">棋牌</div>
        <div :class="{ tab_ac: tab_id == 3 }" @click="tab_id = 3">收藏</div>
      </div>

      <div class="query">
        <nut-input v-model="queryGame" placeholder="在这里输入游戏名称...">
          <template #left>
            <iconpark-icon icon-id="majesticonssearch-line" size="1.2rem" class="refresh"></iconpark-icon>
          </template>
        </nut-input>
        <Btn height="39px" width="109px" fontSize="16px">查询</Btn>
      </div>

      <scroll-view :pullup="pullup" :pulldown="pulldown" class="scroll-view">
        <div class="game-list">
          <div class="item" v-for="item in 9" :key="item">
            <div class="cover">
              <img src="./itemBg.png" alt="">
            </div>
            <div class="title">测试游戏名称{{ item }}</div>
          </div>
        </div>
      </scroll-view>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import useWalletInfo from "@/views/myWallet/useWalletInfo.ts";
import { reactive, ref } from "vue";
import Btn from "@/components/Btn.vue";
import ScrollView from "@/components/ScrollView.vue";

const router = useRouter()
const {
  gameMoney
} = useWalletInfo()

const tab_id = ref(1)
const queryGame = ref("")

// 加载更多
const loading = ref(false)
const params: any = reactive({ // 参数
  page: 1,
  status: 9,
  currency: 0,
  time: 1
})
const result: any = reactive({ // 结果
  total_page: 0,
  list: []
})
const pullup = () => {
  if (loading.value) return
  if (result.total_page <= result.list.length) return // 没有了
  params.page++
  queryData()
}
// 刷新数据
const pulldown = () => {

  if (loading.value) return
  result.total_page = 1
  result.list = []
  queryData()
}
const queryData = () => { // 查询

}

</script>

<style scoped lang="scss">
div.game-details {
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;

  .navbar {
    margin-top: 10px;

    :deep() {
      .nut-navbar__left {
        color: #fff;

        span {
          margin-left: 10px;
        }
      }

      .nut-navbar__right {
        color: #fff;
        font-weight: normal;
        font-size: 14px;
      }
    }
  }

  .content {
    padding: 0 10px;
  }

  .tab {
    //background: url(/imgs/email/nav_bar.webp) no-repeat center;
    background-size: 100% 100%;
    height: 45px;
    display: flex;
    gap: 9px;
    align-items: center;
    padding: 0 4px;
    width: fit-content;
    font-size: 12px;
    overflow: hidden;

    div {
      width: 44px;
      height: 44px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #C0C2DB;
      background-image: radial-gradient(circle at 50% 13%, #4430a1 0%, #3a2786 66%, #3c279a 89%);
      border-radius: 13.1px;
      box-shadow: 0 3.7px 3.7px 0 rgba(22, 17, 46, 0.3) !important;
    }

    .tab_ac {
      background-image: url(/imgs/home/tabActive.webp) !important;
      background-size: 100% 100%;
      color: #ffffff;
      // margin-top: 5px;
    }
  }

  .query {
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 13px;

    &:deep(.nut-input) {
      width: 245px;
      height: 36px;
      padding: 8px;
      border-radius: 8px;
      box-shadow: inset 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      border: solid 1px #322c59;
      background: radial-gradient(circle at 50% 11%, #361e79, #202137 97%) !important;

      input {
        &::placeholder {
          color: #8d84c5;
        }
      }
    }
  }

  .scroll-view{
    height: 74vh;
    overflow: auto;
  }

  .game-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;

    .cover {
      width: 110.9px;
      height: 110.9px;
      border-radius: 16.6px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .title {
      width: 85px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      margin-left: auto;
      margin-right: auto;
      margin-top: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>