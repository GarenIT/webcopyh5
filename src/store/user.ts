import { defineStore } from 'pinia';
import { Local } from '@/utils/storage';


/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
interface UserState {
  isLogin: boolean;
  isReg: boolean;
  isForget: boolean;
  isNotice: boolean;
  noticeList: any;
  // isSilder: boolean,
  hasLogin: boolean;
  info: TUserInfo; // 用户详情
  loginInfo: any; // 登录详情
  roleInfo: TRoleInfo; // 角色详情
  VIPinfo: TVIPInfo; // vip详情
  myEmail: any; // 邮箱列表
  wsOpen: boolean
  loadingEnd: boolean;
}

export const User = defineStore('user', {

  state: (): UserState => ({
    wsOpen: false,
    isLogin: false,
    isReg: false,
    isForget: false,
    isNotice: false, // 公告开关
    noticeList: [], // 公告列表
    loadingEnd: false,
    hasLogin: false,
    info: {},
    loginInfo: null,
    VIPinfo: {},

    roleInfo: {
      nickname: '',
      money: 0,
      bank_money: 0,
      head_photo: '',
      vip_lv: 0,
      id: ''
    },
    myEmail: {
      email_id_list: [],
      hasNoRead: false, // 是否有未读消息
      list: [], //消息中心数据
      rewardList: [], //奖励邮箱数据
      email_readed: [], // 是否已读数据
    },
  }),
  actions: {
    async setWsOpen(value: boolean) {
      this.wsOpen = value
    },
    // 获取标签下拉选择框数据
    async setLogin(value: boolean) {
      this.isLogin = value
    },
    async setLoadingEnd(value: boolean) {
      this.loadingEnd = value
    },
    async setReg(value: boolean) {
      this.isReg = value
    },
    async setForget(value: boolean) {
      this.isForget = value
    },
    async setNotice(value: boolean) {
      this.isNotice = value
    },
    async setNoticeList(value: boolean) {
      this.noticeList = value
    },
    async setHasLogin(value: boolean) {
      this.hasLogin = value
    },

    async setEmailList(info: any) {
      console.log(333333333, info)
      this.myEmail = info;
      // this.emailList = info
    },
    async getUserLoginInfo(info: any) {
      if (info) {
        Local.set('user', info)
        this.loginInfo = info
      } else {
        this.loginInfo = Local.get('user')
      }
    },

    async getInfo(userInfo: any) {
      this.info = userInfo
      this.info.hideString = '******'
    },
    async getVIPInfo(userInfo: TVIPInfo) {
      this.VIPinfo = userInfo
    },
    async getRoleInfo(roleInfo: TRoleInfo) {
      this.roleInfo = roleInfo
    },

  }
});
