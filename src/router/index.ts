import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { storeToRefs } from 'pinia';
import pinia from '@/store/index';
import { Local } from '@/utils/storage';
import { User } from '@/store/user';
// import { MessageEvent2 } from '@/net/MessageEvent2';
// import { NetMsgType } from '@/netBase/NetMsgType';
const userinfo = User(pinia);
const { loadingEnd, wsOpen } = storeToRefs(userinfo);
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    meta: { title: 'route_page_home' },
    component: () => import('@/views/home/index.vue'),

  },
  {
    path: '/activity',
    name: 'activity',
    meta: { title: 'route_page_activity' },
    component: () => import('@/views/activity/index.vue'),

  },
  {
    path: '/activityDetail',
    name: 'activityDetail',
    meta: { title: 'route_page_activityDetail' },
    component: () => import('@/views/activityDetail/index.vue'),

  },
  {
    path: '/me',
    name: 'me',
    meta: { title: 'route_page_me' },
    component: () => import('@/views/me/index.vue'),

  },
  { // 充值记录
    path: '/recharge_record',
    name: 'recharge_record',
    meta: { title: 'route_page_rechargeRecord' },
    component: () => import('@/views/records/rechargeRecord.vue'),
  },
  { // 取款记录
    path: '/withdraw_record',
    name: 'withdraw_record',
    meta: { title: 'route_page_withdrawRecord' },
    component: () => import('@/views/records/withdrawRecord.vue'),
  },
  { // 投注记录
    path: '/bet_record',
    name: 'bet_record',
    meta: { title: 'route_page_betRecord' },
    component: () => import('@/views/records/betRecord.vue'),
  },
  { // 账变记录
    path: '/account_record',
    name: 'account_record',
    meta: { title: 'route_page_accountRecord' },
    component: () => import('@/views/records/accountRecord.vue'),
  },
  { // 流水记录
    path: '/audit_record',
    name: 'audit_record',
    meta: { title: 'route_page_auditRecord' },
    component: () => import('@/views/records/auditRecord.vue'),
  },
  { // 洗码记录
    path: '/wash_record',
    name: 'wash_record',
    meta: { title: 'route_page_washRecord' },
    component: () => import('@/views/records/washRecord.vue'),
  },
  {
    path: '/trans',
    name: 'trans',
    meta: { title: 'trans' },
    component: () => import('@/views/trans/index.vue'),

  },
  {
    path: '/vip',
    name: 'vip',
    meta: { title: 'route_page_vip' },
    component: () => import('@/views/vip/index.vue'),
  },
  {
    path: '/vip/rule',
    name: 'vipRule',
    meta: { title: 'route_page_vipLevel' },
    component: () => import('@/views/vip/rules.vue'),
  },
  {
    path: '/deposit',
    name: 'deposit',
    meta: { title: 'route_page_deposit' },
    component: () => import('@/views/deposit/index.vue'),
  },
  {
    path: '/withdrawals',
    meta: { title: 'route_page_withdrawals' },
    component: () => import('@/views/withdrawals/index.vue'),
  },
  {
    path: '/myWallet',
    name: 'myWallet',
    meta: { title: 'route_page_wallet' },
    component: () => import('@/views/myWallet/index.vue'),
  },
  {
    path: '/depositNext',
    name: 'depositNext',
    meta: { title: 'route_page_deposit' },
    component: () => import('@/views/deposit/depositNext.vue'),
  },
  {
    path: '/securitySettings',
    name: 'securitySettings',
    meta: { title: 'route_page_securitySettings' },
    component: () => import('@/views/securitySettings/index.vue'),
  },
  {
    path: '/email', // 我的邮箱
    name: 'email',
    meta: { title: 'route_page_email' },
    component: () => import('@/views/email/index.vue'),
  },
  //会员等级规则
  // {
  //   path: '/me/vip-level',
  //   name: 'vipLevel',
  //   meta: { title: 'route_page_vipLevel' },
  //   component: () => import('@/views/vipLevel/index.vue'),
  // },
  //我的优惠
  {
    path: '/myDiscounts',
    name: 'myDiscounts',
    meta: { title: 'route_page_discounts' },
    component: () => import('@/views/myDiscounts/index.vue'),
  },
  //代理合作
  {
    path: '/agencyCooperation',
    name: 'agencyCooperation',
    meta: { title: 'route_page_agencyCooperation' },
    component: () => import('@/views/agencyCooperation/index.vue'),
  },

  //代理介绍
  {
    path: '/agentIntroduction',
    name: 'agentIntroduction',
    meta: { title: 'route_page_agentIntroduction' },
    component: () => import('@/views/agentIntroduction/index.vue'),
  },
  // 支付管理
  {
    path: '/paymentManagement',
    name: 'paymentManagement',
    meta: { title: 'home_page_paymentManagement' },
    component: () => import('@/views/paymentManagement/index.vue'),
  },
  // 游戏详情
  {
    path: '/gameDetail',
    component: () => import('@/views/gameDetail/index.vue'),
  },

]
const router = createRouter({
  history: createWebHistory(),
  routes
});
// const getLoadingEnd = () => {
//   return new Promise((resolve) => {
//     MessageEvent2.addMsgEvent(
//       NetMsgType.msgType.msg_notify_loading_end,
//       async () => {
//         await User(pinia).setLoadingEnd(true)
//         resolve(true)
//       }
//     );
//   })
// }
const waitForCondition = (condition: Function, next: any, isNext: boolean) => {
  return new Promise(async () => {
    let timer
    if (condition()) {
      clearTimeout(timer)
      timer = null
      if (isNext) {
        next(isNext)
      } else {
        await User(pinia).setLogin(true)
        next(isNext)
      }

    } else {
      timer = setTimeout(() => {
        console.log(55555);

        waitForCondition(condition, next, isNext);
      }, 200);
    }
  })
}

router.beforeEach(async (to: any, _from: any, next: any) => {

  if (Local.get('user')) {
    if (!['deposit', 'depositNext'].includes(to.name)) {
      Local.remove('curDiscountData');
    }
    await waitForCondition(
      () => (wsOpen.value && loadingEnd.value), next, true
    )
  } else {
    if (['home', 'activity', 'me', 'vip', 'activityDetail'].includes(to.name)) {
      await waitForCondition(
        () => wsOpen.value, next, true
      )
    } else {

      await waitForCondition(
        () => wsOpen.value, next, false
      )
    }
  }


})
router.afterEach(() => {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    console.error('滚动到顶部失败')
  }
})
export default router;
