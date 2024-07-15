import { computed, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import pinia from "@/store";
import { User } from '@/store/user';
import { Wallet } from '@/store/wallet';

import { useI18n } from "vue-i18n";
import { showNotify } from "@nutui/nutui";
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetMsgType } from '@/netBase/NetMsgType';
import { NetPacket } from '@/netBase/NetPacket';
import { Net } from '@/net/Net';

const useWalletInfo = () => {

  const calibrationRef = ref() // 提款校验-
  const withdrawMoneyRef = ref() // 提款

  const { t } = useI18n();
  const wallet = Wallet(pinia);
  const UserStore = User(pinia);
  const { info: userInfo, roleInfo } = storeToRefs(UserStore);
  const loading = ref<boolean>(false);
  const updateAuto = ref<boolean>(false);
  const timerRe = ref();
  const refreshFlag = ref(false); //刷新标记
  const gameMoney = ref<number>(Number(roleInfo.value.money)); // 我的钱包余额
  const bankMoney = ref<number>(Number(roleInfo.value.bank_money)); // 保险柜余额
  const tranType = ref('out'); // 转账类型 out, in
  const tranMoney: any = ref<any>(); // 转账金额
  const eyeOpen = ref(false); // 余额是否可见

  const chooseMoneyArr = [
    { label: '100,000', value: 100000 },
    { label: '200,000', value: 200000 },
    { label: '500,000', value: 500000 },
    { label: '1,000,000', value: 1000000 },
    { label: '10,000,000', value: 10000000 },
  ];
  const slideStr = ref<any>('0%');
  const myBankList = ref(); // 已绑定的银行列表

  // 获取已绑定的银行账号
  const getMyBankList = () => {
    const req = NetPacket.req_bank_card_info_list();
    Net.instance.sendRequest(req);
  }


  const handleMyBankList = (res: any) => {
    console.log(userInfo.value, '--------', res)
    myBankList.value = res;
    console.log('=====', roleInfo.value)


    // 未绑定银行卡跳转到绑定银行卡
    if (!myBankList.value.bank_card_info_list || myBankList.value.bank_card_info_list.length == 0) {
      // router.push('/wallet/paymentManagement')
      calibrationRef.value.openModal();
      return
    }
    // 未绑定手机号码
    if (!userInfo.value.mobile) {
      // router.push('/wallet/securitySettings?openDialogType=bindPhone')
      calibrationRef.value.openModal();
      return
    }
    // 未绑定资金密码
    if (!roleInfo.value.withdraw_pwd) {
      // router.push('/wallet/securitySettings?openDialogType=bindPayPwd')
      calibrationRef.value.openModal();
      return
    }
    withdrawMoneyRef.value.openModal();
    // showWithdrawModal(true)

  }

  // 取款需要判断是否绑定银行卡，绑定手机号码，提现密码
  const goToWithdraw = () => {
    getMyBankList();
  }

  const handleSubmit = () => {
    if (!tranMoney.value) {
      return showNotify.danger(t('transfer_page_inputAmount'))
    }
    // 转入
    if (tranType.value === 'in') {
      if (tranMoney.value > gameMoney.value) {
        return showNotify.danger(t('transfer_page_notEnough'))
      }
    } else {
      if (tranMoney.value > bankMoney.value) {
        return showNotify.danger(t('transfer_page_notEnough'))
      }
    }

    loading.value = true;
    // 转入
    if (tranType.value === 'in') {
      GameToCenter();
    } else { // 转出
      centerToGame();
    }
  };
  // 中心钱包转账到游戏钱包
  const centerToGame = () => {
    const req = NetPacket.req_bank_take();
    req.money = tranMoney.value;
    Net.instance.sendRequest(req);
  }
  const handleCenterToGame = (res: any) => {
    setTimeout(() => {
      loading.value = false;
    }, 300)
    if (res.is_success === 1) {
      tranMoney.value = 0 // 清空金额
      showNotify.success(t('proxy_page_caoZuo'))
    } else {
      showNotify.danger(t('proxy_page_caoZuoFail'))
    }
  }
  // 游戏钱包转账到中心钱包
  const GameToCenter = () => {
    const req = NetPacket.req_bank_save();
    req.money = tranMoney.value;
    Net.instance.sendRequest(req);
  }
  const handleGameToCenter = (res: any) => {
    setTimeout(() => {
      loading.value = false;
    }, 300)
    if (res.is_success === 1) {
      tranMoney.value = 0 // 清空金额
      showNotify.success(t('proxy_page_caoZuo'))
    } else {
      showNotify.danger(t('proxy_page_caoZuoFail'))
    }
  }
  // 自动跟随 1打开，0关闭，默认打开
  const handleAutoTrans = (res: any) => {
    console.log('-----是否自动跟随', res)
    updateAuto.value = res.auto_trans === 1
    loading.value = false;
  };
  const showWithdrawModal = (v: boolean) => wallet.setShowWithdraw(v);

  const refreshWallet = () => {
    if (!refreshFlag.value) {
      clearTimeout(timerRe.value);
      refreshFlag.value = true;
      getNewMon();
      timerRe.value = setTimeout(() => {
        refreshFlag.value = false
      }, 1 * 1000)
    }
  }

  // 金额显示隐藏
  const changeEyeOpen = (value: boolean) => {
    eyeOpen.value = value;
  }

  const getNewMon = () => {
    const req = NetPacket.req_roleinfo_with_id();
    req.id = roleInfo.value.id;
    Net.instance.sendRequest(req);
  }

  const initReq = () => {
    const transReq = NetPacket.req_auto_trans();
    const roleInfoReq = NetPacket.req_roleinfo_with_id();
    Net.instance.sendRequest(transReq);
    Net.instance.sendRequest(roleInfoReq);
  };

  // 转账类型切换
  const changeTranType = (type: any) => {
    tranType.value = type;
  }
  // 选择全部金额
  const allTranferMon = () => {
    if (tranType.value === 'in') {
      tranMoney.value = gameMoney.value
    } else {
      tranMoney.value = bankMoney.value
    }
  }
  // 选择快捷金额
  const chooseFastMon = (e: any) => {
    tranMoney.value = e
  }
  // 金额拖动
  const formatTooltip = (value: any) => {
    if (tranType.value === 'in') {
      tranMoney.value = parseInt(String((gameMoney.value * value) / 100))
    } else {
      tranMoney.value = parseInt(String((bankMoney.value * value) / 100))
    }
    slideStr.value = `${value}%`
    return slideStr.value
  }
  // 是否可以进行拖动转账
  const canSlide = computed(() => {
    if (tranType.value === 'in') {
      return gameMoney.value > 0
    } else {
      return bankMoney.value > 0
    }
  })

  // 重置金额
  const resetTranMoney = () => {
    tranMoney.value = 0
  }

  onMounted(() => {
    // 打开充值页面
    // if (route.query.openDialogType === 'deposit') {
    //   wallet.setShowDeposit(true)
    // }
    MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_auto_trans, handleAutoTrans);
    MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bank_card_info_list, handleMyBankList);
    // MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bank_save_result, handleGetAllMoney);

    MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bank_take_result, handleCenterToGame);
    MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_bank_save_result, handleGameToCenter);

    setTimeout(() => initReq(), 500);
  });
  onUnmounted(() => {
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_auto_trans, null);
    // 取消监听
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_bank_card_info_list, null);

    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_bank_take_result, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_bank_save_result, null);
  });
  return {
    loading,
    gameMoney,
    bankMoney,
    eyeOpen,
    showWithdrawModal,
    userInfo,
    roleInfo,
    updateAuto,
    refreshWallet,
    refreshFlag,
    goToWithdraw,
    myBankList,
    tranType,
    changeTranType,
    tranMoney,
    chooseMoneyArr,
    allTranferMon,
    formatTooltip,
    handleSubmit,
    slideStr,
    chooseFastMon,
    calibrationRef,
    withdrawMoneyRef,
    changeEyeOpen,
    canSlide,
    resetTranMoney
  };
}

export default useWalletInfo;
