<template>
  <div class="login">
    <p class="title_p">
      <span>{{ t('home_page_login') }}</span>
      <iconpark-icon class="close" icon-id="tongyiconguanb01" color="#fff" size="1rem" @click="onClose"></iconpark-icon>
    </p>
    <div class="content">
      <div class="tab">
        <span :class="state.active == i ? 'btn_inline' : ''" v-for="(tab, i) in tabList" :key="i"
          @click="changeTab(i)">{{
        t(tab.name) }}</span>
      </div>

      <div class="reg-box">

        <nut-form ref="formRef" label-position="top" :model-value="state.login" :rules="state.loginRules">
          <template v-for="(item, i) in  state.loginList ">
            <nut-form-item :label="t(item.label)" v-if="item.show" :rules="state.loginRules[item.name]"
              :prop="item.name" :key="i">
              <nut-input v-model="state.login[item.name]" :placeholder="t(item.placeholder)" :type="item.type"
                @blur="blurValidate(item.name)" clearable>
                <template #left v-if="item.leftIcon">
                  <iconpark-icon :icon-id="item.leftIcon" color="#fff" size="1.5rem"></iconpark-icon>
                  <span v-if="item.name == 'cellphone'" style="color:#fff;margin-left: 5px;">+{{ state.codeValue
                    }}</span>
                </template>
                <template v-if="item.slot" #right>


                  <iconpark-icon v-if="item.changeRightIcon" @click="iconClick(item)" :icon-id="item.changeRightIcon"
                    color="#8e82c2" size="1rem"></iconpark-icon>
                </template>

              </nut-input>
              <span @click="refresh_captcha" v-if="item.name == 'captcha'" class="btn">
                <img :src="state.captchaURL" v-if="state.captchaURL" alt="captchaURL">
                <iconpark-icon icon-id="signicon08" color="#fff" size="1.5rem"></iconpark-icon>
              </span>
            </nut-form-item>
          </template>

        </nut-form>
      </div>
      <p class="set_password">
        <!-- <span class="checkbox" @click="savePassword">
          <b :class="state.rememberPassword ? 'checkbox_click' : ''"></b>{{ t('home_page_rememberPassword') }}
        </span> -->
        <!-- <span class="forgot"> -->
        <i @click="openForget">{{ t('home_page_forgetPassword') }}</i>

        <i @click="openReg">{{ t('home_page_noAccount') }}</i>
        <!-- </span> -->
      </p>
      <div style="margin-top: 16px">
        <nut-button class="btn_block" round block @click="onLoginSubmit">
          {{ t("home_page_login") }}
        </nut-button>
      </div>

    </div>

  </div>
  <!-- </div> -->
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { Net } from "@/net/Net";
import { NetPacket } from "@/netBase/NetPacket";


import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { verifyCaptcha, verifyEmail, verifyMobile, verifyPassword, verifyWithdrawPwd } from "../utils/validateTools";
import { aaa, bbb, device_model, getDeviceId, getRandomSign } from "../net/Utils";
import { IP } from "../utils/publicMethods";
import { MessageEvent2 } from "../net/MessageEvent2";
import { NetMsgType } from "../netBase/NetMsgType";
import { showNotify } from '@nutui/nutui'
import { User } from "../store/user";
import pinia from '@/store/index';
import { needLoginApi } from "../utils/storage";

const { t } = useI18n();

// const router = useRouter();
const formRef = ref()
const route = useRoute();
const state: any = reactive({
  captchaURL: '',
  loading: false,
  active: 0,
  formInitValue: null,
  rememberPassword: true,
  loginList: {
    phone: {
      name: "phone",
      label: 'home_page_phone',
      type: "text",
      placeholder: 'home_page_enterPhoneNumber',
      slot: !1,
      leftIcon: false,
      changeRightIcon: !1 as any,
      show: !1,
      isPhone: true
    },
    account: {
      name: "account",
      label: 'home_page_account',
      type: "text",
      placeholder: 'home_page_enterAccount',
      slot: !1,
      leftIcon: "signicon01",
      changeRightIcon: !1 as any,
      show: true,
      // filterable: true,
      // options: [
      //   {
      //     label: 'Drive My Car',
      //     value: 'song1'
      //   },
      //   {
      //     label: 'Norwegian Wood',
      //     value: 'song2'
      //   },
      //   {
      //     label: "You Won't See",
      //     value: 'song3',

      //   },
      // ]
    },
    email: {
      name: "email",
      label: 'home_page_email',
      type: "text",
      placeholder: 'home_page_enterEmail',
      slot: !1,
      leftIcon: "signicon05",
      changeRightIcon: !1 as any,
      show: false,
    },
    password: {
      name: "password",
      label: 'home_page_password',
      type: "password",
      placeholder: 'home_page_enterPassword',
      slot: !0,
      leftIcon: "signicon02",
      changeRightIcon: "signicon06" as any,
      show: !0,
    },
    captcha: {
      name: "captcha",
      label: 'home_page_verificationCode',
      type: "text",
      placeholder: 'home_page_enterVerificationCode',
      slot: !0,
      leftIcon: "signicon03",
      changeRightIcon: !1 as any,
      show: !0,
    },
  },

  login: {
    captcha: "",
    userName: '',
    phone: '',
    account: '',
    email: '',
    password: '',
  },
  loginRules: {
    phone: [
      {

        trigger: "blur",
        validator: (value: string) => {
          if (!value) {
            return Promise.reject(t('home_page_enterPhoneNumber'))
          } else
            if (verifyMobile(state.codeValue, value)) {
              return Promise.resolve()
            } else {
              return Promise.reject(t('home_page_phoneNumberFormatIncorrect'))
            }

        },
      }
    ],
    captcha: [
      {

        trigger: "blur",
        validator: (value: string) => {
          if (!value) {
            return Promise.reject(t('home_page_enterVerificationCode'))
          } else
            if (verifyCaptcha(value)) {
              return Promise.resolve()
            } else {
              return Promise.reject(t('home_page_verificationCodeFormatIncorrect'))
            }
        },

      },
    ],
    email: [
      {

        trigger: "blur",
        validator: (value: string) => {
          if (!value) {
            return Promise.reject(t('home_page_enterEmail'))
          } else if (verifyEmail(value)) {
            return Promise.resolve()
          } else {
            return Promise.reject(t('home_page_emailIncorrect'))
          }
        },
      }
    ],
    password: [
      {

        trigger: "blur",
        validator: (value: string) => {
          if (!value) {
            return Promise.reject(t('home_page_enterPassword'))
          } else
            if (verifyPassword(value)) {
              return Promise.resolve()
            } else {
              return Promise.reject(t('home_page_passwordFormatIncorrect'))
            }
        },

      },
    ],
    account: [
      {
        trigger: "blur",
        validator: (value: string) => {
          if (!value) {
            return Promise.reject(t('home_page_enterAccount'))
          } else
            if (verifyWithdrawPwd(value)) {
              return true
            } else {
              return Promise.reject(t('home_page_accountFormatIncorrect'))
            }
        },

      },
    ],
  },

  codeValue: '84',
  codeOptions: [
    // {
    //   label: '+63',
    //   value: '+63',
    // },
    {
      label: '84',
      value: '84',
    },
    // {
    //   label: '+86',
    //   value: '+86',
    // },
  ]
});
const tabList = [
  { name: 'home_page_accountLogin', value: 1 },
  { name: 'home_page_emailLogin', value: 2 }
]
const handleCaptchaReceive = (captcha: any) => {
  state.captchaURL = captcha.url;
}
const blurValidate = (prop: string) => {
  formRef.value?.validate(prop).then()
}
const refresh_captcha = async () => {
  const req_register_captcha = NetPacket.req_register_captcha();
  let id = await getDeviceId()
  req_register_captcha.sign = getRandomSign(id);;
  req_register_captcha.aaa = aaa;
  req_register_captcha.bbb = bbb;
  Net.instance.sendRequest(req_register_captcha);
};
const iconClick = (a: any) => {
  if (a.changeRightIcon == "signicon06") {

    a.type = "text"
    a.changeRightIcon = "signicon07"
    // state.rememberPassword = false
  } else {
    a.type = "password"
    a.changeRightIcon = "signicon06"
    // state.rememberPassword = true
  }
};


const changeTab = (tabId: number) => {
  state.active = tabId;
  formRef.value?.reset()
  if (state.active == 1) {

    state.loginList.account.show = false
    state.loginList.email.show = true
  } else {
    state.loginList.account.show = true
    state.loginList.email.show = false

  }

};
const onLoginSubmit = async () => {

  formRef.value?.validate().then(async ({ valid, errors }: any) => {
    if (valid) {
      state.loading = true
      const req_login = NetPacket.req_login();
      switch (state.active) {
        case 0:
          req_login.username = state.login.account;
          req_login.login_type = 4;
          break;
        case 1:
          req_login.username = state.login.email;
          req_login.login_type = 5;
          // req_login.username = state.codeValue + state.login.phone;
          break;
      }

      req_login.password = state.login.password;
      req_login.device_id = await getDeviceId();
      req_login.device_model = device_model;
      req_login.channel_id = route.query.channel_id || 123;
      req_login.aaa = aaa;
      req_login.bbb = bbb;
      req_login.ip = await IP();
      req_login.captcha = state.login.captcha;
      Net.instance.sendRequest(req_login);
    } else {
      console.warn('error:', errors)
    }
  })

};
const loginSuccess = async (message: any) => {
  state.loading = false
  if (message.code == 4444) {
    return;
  }
  if (message.code == 1) {
    if (message.message) {
      showNotify.success(t(message.message))
    }
    // if (state.rememberPassword && state.active == 0) {
    //   Local.set('userName', state.login.email)
    //   Local.set('password', state.login.password)
    // }
    // if (!state.rememberPassword) {
    //   Local.remove('userName')
    //   Local.remove('password')
    // }
    await User(pinia).getUserLoginInfo(message)
    onClose()
    needLoginApi()
  } else {
    refresh_captcha()
  }
}
const openForget = async () => {
  await User(pinia).setForget(true)
  onClose()
}
const openReg = async () => {
  await User(pinia).setLogin(false)
  setTimeout(() => {
    User(pinia).setReg(true)
  }, 0)
}
const onClose = async () => {
  await User(pinia).setLogin(false)
}
onMounted(async () => {
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_register_captcha,
    handleCaptchaReceive
  );
  MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_nodify_login, loginSuccess);

  refresh_captcha();

  // formRef.value?.reset()


});
onUnmounted(() => {
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_register_captcha, null);
})
</script>

<style lang="scss" scoped>
.login {
  background-color: #27155c;
  border-radius: 8px;
  padding-bottom: 30px;

  :deep(.nut-input-value) {
    height: 34px;
    line-height: 34px;
    padding: 0px 8px;
    border-radius: 8px;
    box-shadow: inset 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    border: solid 1px #251e4e;
    background-color: #0e0529;
  }

  :deep(.nut-cell-group__wrap) {
    box-shadow: none;
    margin: 0;
  }

  :deep(.nut-form-item__body__slots) {
    display: flex;
  }

  :deep(.nut-cell-group .nut-cell::after) {
    border: none;
  }

  :deep(.nut-form-item.error.line::before) {
    border: none;
  }

  .title_p {
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    text-align: center;
    position: relative;
    color: #fff;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
    background-image: radial-gradient(#4c36b3 0%, #3a2786 100%, #3c279a 25%);

    .close {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;
      color: #fff;

    }
  }

  .content {
    padding: 0 44px;

    .tab {
      height: 45px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #c0c2db;
      margin: 22px auto 17px;
      font-size: 12px;
      border-radius: 14px;
      box-shadow: inset 0 -6px 6px 0 #5e42dd, 0 4px 4px 0 rgba(22, 17, 46, 0.3), inset 0 6px 6px 0 #1f1548;
      border-style: solid;
      border-width: 2px;
      border-image-source: linear-gradient(to bottom, #4017a8 100%, #8256f2 0%);
      border-image-slice: 1;
      background-image: linear-gradient(to bottom, #2f1b80 98%, #4c36b3 0%), linear-gradient(to bottom, #4017a8 100%, #8256f2 0%);
      background-origin: border-box;
      background-clip: content-box, border-box;

      >span {
        width: 120px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;

      }
    }
  }

  .btn {
    width: 110px;
    height: 34px;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: 5px;
    padding: 4px 8px;
    border-radius: 8px;
    box-shadow: inset 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    border: solid 1px #251e4e;
    background-color: #0e0529;

    >img {
      width: 64px;
      height: 26px;
    }
  }

  .set_password {
    font-size: 14px;
    margin: 0 0 28px;
    display: flex;
    justify-content: space-between;
    color: #fff;

    // .checkbox {
    //   vertical-align: middle;
    //   display: flex;
    //   align-items: center;
    //   cursor: pointer;

    //   >b {
    //     display: inline-block;
    //     vertical-align: middle;
    //     width: 13px;
    //     height: 13px;
    //     background-color: #fff;
    //     border: 1px solid #3d3d3d;
    //     margin-right: 2px
    //   }

    //   .checkbox_click {
    //     background: url(/imgs/login/checkbox.webp) no-repeat;
    //     background-size: cover;
    //   }
    // }


    .forgot {

      display: flex;
      justify-content: space-between;
    }

    i {
      color: #c0c2db;
      font-style: normal;
      cursor: pointer;
    }
  }

  .btn_block {
    color: #fff;
  }
}
</style>