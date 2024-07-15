<template>
  <div class="app">
    <div class="head" v-if="state.hasHeader">
      <nut-navbar class="navbar" z-index="5" :clickable="false">
        <template #content>
          <span>{{ t(String(route.meta.title)) }}</span>
        </template>
        <template #left>
          <iconpark-icon @click="router.go(-1)" class="close" icon-id="tongyicontyfanh" size="2.4rem"></iconpark-icon>
        </template>
        <template #right>
          <!-- <van-icon v-if="rightIcon1" @click="onClickRight1" :badge="mailsCount == 0 ? null : mailsCount"
          :name="rightIcon1" /> -->
          <!-- <van-icon @click="onClickRight" :name="state.rightIcon" /> -->
        </template>
      </nut-navbar>
    </div>

    <router-view v-slot="{ Component, route }">
      <transition>
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>

    <nut-tabbar z-index="2" v-if="state.hasTabbar" route v-model="state.active" safe-area-inset-bottom bottom>
      <nut-tabbar-item class="item" :name="item.name" v-for="(item, i) in state.tablebarArr" :key="i"
        @click="tabSwitch(item)">{{
      t(item.text)
    }}
        <template #icon>
          <nut-popover v-model:visible="state.popoverShow" location="top" bg-color="transparent" :show-arrow="false"
            v-if="item.isWallet">
            <template #reference>
              <iconpark-icon class="tabbar_icon_1" icon-id="hoticonhbwvmut03" @click="walletClick"
                :class="state.active == item.name ? 'rotation' : ''" size="3rem"></iconpark-icon>
            </template>
            <template #content>
              <div class="popover_bg">

                <div v-for="(v, j) in state.walletList" :key="j" @click="onClickToPage(v.url)">
                  <img :src="v.img" :alt="v.text">
                  <span>{{ t(v.text) }}</span>
                </div>
              </div>

            </template>
          </nut-popover>

          <iconpark-icon v-else class="tabbar_icon" :class="state.active == item.name ? 'heart' : ''"
            :icon-id="state.active == item.name ? item.activeIcon : item.defaultIcon" size="2.3rem"></iconpark-icon>
        </template>
      </nut-tabbar-item>
    </nut-tabbar>

    <nut-overlay v-model:visible="isLogin" :close-on-click-overlay="false" :overlay-style="{
      backgroundColor: 'rgba(0, 0, 0, .5)'
    }">
      <div class="login_pop">
        <!-- <Suspense v-if="isLogin"> -->
        <Login v-if="isLogin"></Login>
        <!-- </Suspense> -->

      </div>

    </nut-overlay>
    <ForgotPassword v-if="isForget"></ForgotPassword>
    <!-- 注册弹窗 -->
    <Register v-if="isReg" />
    <!-- 公告弹窗 -->
    <Notice ref="noticeRef" />
  </div>
</template>
<script setup lang="ts">

import { onMounted } from "vue";
import { watch, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Login from "@/components/Login.vue"
import Register from "@/components/Register.vue"
import ForgotPassword from "@/components/ForgotPassword.vue"
import pinia from '@/store/index';
import { storeToRefs } from 'pinia';
import { User } from '@/store/user';
import { Page } from '@/store/page';
import { MessageEvent2 } from "./net/MessageEvent2";
import { NetMsgType } from "./netBase/NetMsgType";
import { NetEnumDef } from "./netBase/NetEnumDef";
import { Local, needLoginApi } from "@/utils/storage";
import { NetPacket } from "./netBase/NetPacket";
import { Net } from "@/net/Net";
import { onBeforeMount } from "vue";
import Notice from "@/components/Notice.vue"
import { convertObjectToDateString } from "./utils/publicMethods";
import { useI18n } from 'vue-i18n';
import { i18n } from '@/languages';
// import { getSetting } from "./main"
const { t } = useI18n();
// const Login = defineAsyncComponent(() => import("@/components/Login.vue"))
const userInfo = User(pinia);
const page = Page(pinia);
const { lang } = storeToRefs(page)
const { isLogin, isReg, isForget, roleInfo, myEmail } = storeToRefs(userInfo);
const route = useRoute();
const router = useRouter();
const state: any = reactive({
  popoverShow: false,
  active: 'home',
  active1: '',
  activeItem: null,
  hasHeader: false,
  hasTabbar: false,
  leftIcon: '',
  rightIcon: '',
  routeName: 'home',
  tablebarArr: [
    { text: 'route_page_home', name: 'home', url: "/", defaultIcon: "hoticonhbwvmun01", activeIcon: 'hoticonhbwvmut01', show: false },
    { text: 'route_page_activity', name: 'activity', url: "/activity", defaultIcon: "hoticonhbwvmun02", activeIcon: 'hoticonhbwvmut02', show: false },
    { text: 'route_page_transaction', name: '', url: "", isWallet: true, defaultIcon: "hoticonhbwvmun02", activeIcon: 'hoticonhbwvmut02', show: false },
    { text: 'route_page_vip', name: 'vip', url: "/vip", defaultIcon: "hoticonhbwvmun04", activeIcon: 'hoticonhbwvmut04', show: false },
    { text: 'route_page_me', name: 'me', url: "/me", defaultIcon: "hoticonhbwvmun05", activeIcon: 'hoticonhbwvmut05', show: false },
  ],
  walletList: [
    {
      text: 'route_page_wallet',
      img: '/imgs/tabbar/qb.webp',
      url: '/myWallet',
    },
    {
      text: 'route_page_deposit',
      img: '/imgs/tabbar/cz.webp',
      url: '/deposit',
    },
    {
      text: 'route_page_withdrawals',
      img: '/imgs/tabbar/tx.webp',
      url: '/withdrawals',
    }
  ]
})
// const onClickLeft = (name: string) => {

//   router.go(-1);
// };
// const onClickRight = () => {
//   switch (route.name) {
//     default: ;
//       break;
//   }
// };
// const onClickRight1 = () => {
//   router.push('/')
// }
const onClickToPage = (url: any) => {

  state.popoverShow = false
  router.push(`${url}`)
}


const leftIcon = (name: string) => {
  switch (name) {
    case 'home':
      return "bars";

    default: return "tongyicontyfanh";

  }
}
const rightIcon = (name: string) => {
  switch (name) {
    case 'name':
      return "";
    default: return "service";

  }
};
const walletClick = () => {

  if (!state.popoverShow) {
    state.active1 = state.active
  } else {
    setTimeout(() => {
      state.active = state.active1
      router.push(state.activeItem?.url)
    }, 10);

  }


}
const tabSwitch = (item: any) => {
  state.active = item.name
  item.show = true
  state.activeItem = item
  router.push(item.url)
}
const init = (name: string) => {
  state.hasHeader = !['home', 'activity', 'me', 'vip', 'trans', 'myWallet', 'undefined'].includes(String(name))

  state.hasTabbar = ['home', 'activity', 'me', 'vip', 'trans'].includes(String(name))
  state.leftIcon = leftIcon(name)
  state.rightIcon = rightIcon(name)
  state.active = name
}

// 公告消息
const noticeRef = ref()
const onHander_system_notice = async (message: any) => {
  if (message.notice_list?.length) {
    const dialogList: any = message.notice_list.filter((item: any) => item.position == 1)
    const paomaList: any = message.notice_list.filter((item: any) => item.position == 0)

    // 弹窗公告
    let localIds = [] // 本地记录的不再显示
    try {
      localIds = JSON.parse(localStorage.getItem('readed_notice_ids') || '[]')
    } catch {
      localIds = []
    }
    const list: any = dialogList.filter((item: any) => !localIds.includes(item.title)).sort((a: any, b: any) => {
      return b.priority - a.priority
    })
    if (list.length) {
      await User(pinia).setNoticeList(list)
      User(pinia).setNotice(true)
      noticeRef.value.open()
    }

    // 轮播公告
    paomaList.forEach((item: any) => {
      page.setTextAnnouncementMore(t(item.content))
    })
  }
}

// setTimeout(() => {
//   onHandler_system_msg({
//     Params: ['noticelist:999'],
//     priority: 99,
//     type: 1
//   })
// }, 5000)

// 消息通知
const onHandler_system_msg = async (m: any) => {
  console.error('----系统消息', m)
  if (m.Params && m.Params.length == 6) { // 跑马灯
    // ***[0]*** 在 [3] 获得 [4] 金币奖励！
    const str = t('home_notice_mixtext', {
      user: `${m.Params[0]?.substr(0, 4)}***`,
      game: m.Params[3] ? t(m.Params[3]) : '',
      money: m.Params[4] ? Number(m.Params[4]).toLocaleString() : 0
    })
    page.setTextAnnouncementMore(str)
  }
  else if (m.Params.length == 1 && m.Params[0].includes('noticelist:')) { // 弹窗公告
    try {
      const msgId = m.Params[0].split(':')[1]
      if (msgId) {
        const list: any = [{
          content: `system_notice_content_${msgId}`,
          title: `system_notice_title_${msgId}`,
          position: 1,
          priority: m.priority,
          type: m.type,
        }]
        // await getSetting()
        await User(pinia).setNoticeList(list)
        User(pinia).setNotice(true)
        noticeRef.value.open()
      }
    } catch {
      console.error('error msg', m)
    }
  }
}

const onHander_check_version = async (message: any) => {
  if (message.result != NetEnumDef.check_version_result.cvr_yes) {
    console.log("check version failed");
    return;
  }
  needLoginApi()
}
// 我的邮箱
const emailList: any = []
let email_id_list: any = []
const handleEmailInfo = async (rs: any) => {
  if (rs.emails.length > 0) {
    if (!email_id_list.includes(rs.emails[0].email_id)) {
      emailList.push(rs.emails[0])
    }
    if (emailList.length > 0) {
      email_id_list = emailList.map((item: any) => item.email_id)
    }
    const sb = new Set(rs.email_readed);
    emailList.forEach((item: any) => {
      const timer = convertObjectToDateString(item.recv_time)
      item.time = new Date(timer).getTime()
    });


    emailList.sort((a: any, b: any) => b.time - a.time); // 排序
    const list = emailList.filter(
      (item: any) => item.attachments[0].award_value == 0,
    );
    const rewardList = emailList.filter(
      (item: any) => item.attachments[0].award_value > 0,
    );
    const params = {
      email_readed: rs.email_readed,
      list,
      rewardList,
      email_id_list,
      hasNoRead: email_id_list.some((x: any) => !sb.has(x))
    };
    await User(pinia).setEmailList(params);
  }
};

// 监听新收到邮箱
const handleNewEmail = (rs: any) => {
  //奖励邮箱
  if (rs.new_email.attachments[0].award_value > 0) {
    myEmail.value.rewardList.unshift(rs.new_email)
  } else {
    myEmail.value.list.unshift(rs.new_email)
  }
  myEmail.value.hasNoRead = true
}



// 角色详情
const handleRoleInfo = async (data: any) => {
  await User(pinia).getRoleInfo(data)

}
// 角色VIP详情
const handleVipInfo = async (data: any) => {
  await User(pinia).getVIPInfo(data)
}
// 用户详情
const handleUserInfo = async (data: any) => {
  await User(pinia).getInfo(data)
  await User(pinia).setHasLogin(true)
}



// 监听金额变化
const handleUpdateMoney = async (data: any) => {
  if (data) {
    const newData = { ...roleInfo.value }
    newData.money = data.cur_money
    await User(pinia).getRoleInfo(newData)
  }
}
onBeforeMount(() => {
  let req_check_version_req = NetPacket.req_check_version();
  req_check_version_req.version = 1;
  Net.instance.sendRequest(req_check_version_req);
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_check_version,
    onHander_check_version
  );
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_loading_end,
    async () => {
      await User(pinia).setLoadingEnd(true)
    }
  );


  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_send_system_notice,
    onHander_system_notice
  );
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_sys_msg,
    onHandler_system_msg
  );
  // 用户信息
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_roleinfo_msg,
    handleRoleInfo
  )
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_user_info,
    handleUserInfo
  );

  // 回执监听
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_email_list,
    handleEmailInfo,
  );
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_vip_info,
    handleVipInfo
  );
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_money_update2,
    handleUpdateMoney
  );
  // 监听新邮件
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_new_email,
    handleNewEmail
  );

})
onMounted(async () => {
  init(String(route.name))

  i18n.global.locale.value = lang.value
  Local.set('agentid', route.query.uid || '0')

})
watch(
  () => route.name,
  (n: any) => {
    init(String(n))
  }
)
</script>
<style lang='scss' scoped>
.app {
  min-height: 100vh;

  background-image: radial-gradient(circle at 50% 11%, #361e79, #202137 97%);
  display: flex;
  flex-direction: column;

  .head {
    position: relative;
    padding-top: 10px;
  }

  :deep(.nut-tabbar) {
    border: none;
    background: url(/imgs/tabbar/tabbarBg.webp) no-repeat;
    background-size: 100% 100%;
    align-items: end;
  }
}

.login_pop {
  display: flex;
  width: 355px;
  height: 100%;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
}



.nut-tabbar-item__icon--unactive {
  color: #8e82c2 !important;
}

.nut-tabbar-item {
  color: #fff;
  margin-bottom: 7px;
  align-items: end;
  /* background-color: #301a73; */
}

.item {
  height: 5vh;
}

:deep(.nut-popover .nut-popover-content) {
  opacity: none;
}

.popover_bg {
  width: 365px;
  height: 95.4px;
  background: url(/imgs/tabbar/tabPopBg.webp) no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-around;

  >div {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
    color: #8e82c2;
    align-items: center;

    >img {
      width: 38px;
      height: 38px;
    }
  }
}
</style>
