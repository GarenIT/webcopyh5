<template>
  <nut-overlay v-model:visible="isShow" :close-on-click-overlay="false" :overlay-style="{
    backgroundColor: 'rgba(0, 0, 0, .5)'
  }">
    <div class="login_pop" v-if="isShow">
      <div class="login">
        <p class="title_p">
          <span>{{ t(state.formData?.title) }}</span>
          <iconpark-icon class="close" icon-id="tongyiconguanb01" color="#fff" size="1rem"
            @click="closeDialog"></iconpark-icon>
        </p>
        <div class="content">
          <div class="tab" v-if="state.formData?.tabList">
            <span :class="state.formData.active == tab.value ? 'btn_inline' : ''"
              v-for="(tab, i) in state.formData.tabList" :key="i" @click="changeTab(tab.value, tab)">{{
    t(tab.name) }}</span>
          </div>

          <nut-form ref="formRef" label-position="top" :model-value="state.formData?.formParams"
            :show-label="state.formData?.showLabel">
            <template v-for="(item, i)  in  state.formData?.list ">

              <nut-form-item :label="t(item.label)" v-if="item.show" :prop="item.name"
                :rules="state.formData?.rules[item.name]" :key="i">

                <nut-input clearable :type="item.type" v-model="state.formData.formParams[item.name]"
                  @blur="blurValidate(item.name)" @update:model-value="changeValidate(item.name)"
                  :placeholder="t(item.placeholder)">
                  <template #left v-if="item.leftIcon">
                    <span v-if="item.leftIcon == 'mobile'" style="color:#fff;margin-right: 10px;">+{{
    state.formData.formParams.codeValue }}</span>
                    <iconpark-icon v-else :icon-id="item.leftIcon" color="#8e82c2" size="1.5rem"></iconpark-icon>

                  </template>
                  <template #right v-if="item.slot">
                    <iconpark-icon v-if="item.changeRightIcon" @click="iconClick(item)" :icon-id="item.changeRightIcon"
                      color="#8e82c2" size="1rem"></iconpark-icon>
                  </template>
                </nut-input>
                <span @click="submitSend(item)" v-if="item.name == 'captcha'" class="btn">
                  <img :src="state.captchaURL" v-if="state.captchaURL" alt="">
                  <iconpark-icon icon-id="signicon08" color="#fff" size="1.5rem"></iconpark-icon>
                </span>
                <nut-button type="primary" :bordered="false" :loading="item.loading" @click="submitSend(item)"
                  v-if="item.slot && item.type == 'code'" class="btn btn_inline" :disabled="item.disabled">{{
    isNaN(item.timeText) ? t(item.timeText) : item.timeText
  }}</nut-button>
              </nut-form-item>
            </template>
          </nut-form>

          <div style="margin-top: 16px">
            <nut-button class="btn_block" round block @click="submitNext">
              {{ t(state.formData?.buttonText) }}
            </nut-button>
          </div>

        </div>
      </div>
    </div>

  </nut-overlay>

</template>

<script setup lang="ts">
import { MessageEvent2 } from "@/net/MessageEvent2";
import { Net } from "@/net/Net";
import { NetMsgType } from "@/netBase/NetMsgType";
import { NetPacket } from "@/netBase/NetPacket";
import { ref, reactive } from "vue";
import { showNotify } from '@nutui/nutui'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const emit = defineEmits(['changeTab', 'submitData', 'nextChange', 'onClose']);
const formRef = ref();
const isShow = ref(false)
const state: any = reactive({
  formData: null,
  type: 0,
  codeOptions: [
    // {
    //   label: '+63',
    //   value: '+63'
    // },
    {
      label: '84',
      value: '84'
    },
    // {
    //   label: '+86',
    //   value: '+86',
    // },
  ],

})

const iconClick = (a: any) => {
  if (a.changeRightIcon == "wallrticontongy03") {
    a.type = "text"
    a.changeRightIcon = "wallrticontongy02"

  } else {
    a.type = "password"
    a.changeRightIcon = "wallrticontongy03"

  }
};
const blurValidate = (name: string) => {
  formRef.value?.validate(name).then()
}
const changeValidate = (name: string) => {
  if (['mobile', 'email', 'new_password_confirm'].includes(name)) {
    formRef.value?.validate(name).then()
  }
}
const changeTab = (tabId: number, item: any) => {
  if (!item.isLink) {
    resetInputHide()
  }
  state.formData.formParams = state.formInitValue
  emit('changeTab', tabId, state.formData);

};
const resetInputHide = () => {
  for (const key in state.formData.list) {
    state.formData.list[key].show = false
  }
}


const submitNext = () => {
  // 效验
  if (state.type == 3) {
    formRef.value?.validate().then(({ valid, errors }: any) => {
      if (valid) {
        if (state.formData.step == 1) {
          emit('nextChange', state.formData.formParams);
        } else {
          emit('submitData', state.formData.formParams, state.type);
        }
      } else {
        console.log(errors);

      }
    });

  } else {
    //常规修改密码
    formRef.value?.validate().then(({ valid, errors }: any) => {

      if (valid) {
        emit('submitData', state.formData.formParams, state.type);
      } else {
        console.log(errors);

      }
    });
  }
};
// 发送验证码
const submitSend = (item: any) => {
  item.loading = true
  // 1 为手机  2 为邮箱 
  if (state.formData.active == 1) {
    if (state.formData.forgetPassword) {
      const req = NetPacket.req_get_mobile_sms_login_code()
      req.mobile = state.formData.formParams.codeValue + state.formData.formParams.mobile
      Net.instance.sendRequest(req)
    } else {
      const req = NetPacket.req_get_mobile_sms_code()
      req.mobile = state.formData.formParams.codeValue + state.formData.formParams.mobile
      req.operate_type = 1
      Net.instance.sendRequest(req)
    }

  }
  if (state.formData.active == 2) {
    const req = NetPacket.req_get_email_verification_code()
    req.email = state.formData.formParams.email
    Net.instance.sendRequest(req)
  }
};

// 返回邮箱验证码是否发送
const handleGetEmailVerificationCode = (res: any) => {
  state.formData.list.emailCode.loading = false
  if (res.code == 1) {
    if (res.message) {
      showNotify.success(t(res.message))
    }
    state.formData.list.emailCode.disabled = true
    state.formData.list.emailCode.timeText = 160
    state.formData.list.emailCode.timer = setInterval(() => {
      state.formData.list.emailCode.timeText--
      if (state.formData.list.emailCode.timeText <= 0) {
        state.formData.list.emailCode.disabled = false
        clearInterval(state.formData.list.emailCode.timer)
        state.formData.list.emailCode.timer = null
        state.formData.list.emailCode.timeText = 'home_page_send'
      }
    }, 1000);
  }
};
// 返回修改密码手机验证码是否发送
const handleSMSback = (res: any) => {
  state.formData.list.phoneCode.loading = false
  if (res.code == 1) {
    if (res.message) {
      showNotify.success(t(res.message))
    }
    state.formData.list.phoneCode.disabled = true
    state.formData.list.phoneCode.timeText = 60
    state.formData.list.phoneCode.timer = setInterval(() => {
      state.formData.list.phoneCode.timeText--
      if (state.formData.list.phoneCode.timeText <= 0) {
        clearInterval(state.formData.list.phoneCode.timer)
        state.formData.list.phoneCode.disabled = false
        state.formData.list.phoneCode.timer = null
        state.formData.list.phoneCode.timeText = 'home_page_send'
      }
    }, 1000);
  }


}

// 关闭弹窗
const closeDialog = () => {

  isShow.value = false
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_get_email_verification_code, null);
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_get_mobile_sms_code, null);
  if (state.formData.list?.emailCode) {

    clearInterval(state.formData.list?.emailCode?.timer)
    state.formData.list.emailCode.disabled = true
    state.formData.list.emailCode.timer = null
    state.formData.list.emailCode.timeText = 'home_page_send'
  }
  if (state.formData.list?.phoneCode?.timer) {
    clearInterval(state.formData.list.phoneCode.timer)
    state.formData.list.phoneCode.disabled = true
    state.formData.list.phoneCode.timer = null
    state.formData.list.phoneCode.timeText = 'home_page_send'
  }
  console.log(state.formData?.formParams);
  emit('onClose')
  state.formData.formParams = state.formInitValue

};
// 打开弹窗
const openDialog = async (formData: any, type: number) => {
  state.formData = formData//JSON.parse(JSON.stringify(formData)) //
  state.formInitValue = JSON.parse(JSON.stringify(formData.formParams))
  state.type = type
  // 监听手机号验证码返回
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_get_mobile_sms_code,
    handleSMSback
  );
  // 监听忘记密码手机号验证码返回
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_nodify_get_mobile_sms_login_code,
    handleSMSback
  );
  // 监听邮箱验证码返回
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_get_email_verification_code,
    handleGetEmailVerificationCode
  );
  isShow.value = true
}

defineExpose({
  openDialog,
  closeDialog,
});

</script>
<style lang="scss" scoped>
.login_pop {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login {
  width: 326px;
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
    padding: 0 20px;

    .tab {
      height: 45px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #c0c2db;
      font-size: 12px;
      border-radius: 14px;
      box-shadow: inset 0 -6px 6px 0 #5e42dd, 0 4px 4px 0 rgba(22, 17, 46, 0.3), inset 0 6px 6px 0 #1f1548;
      margin: 22px auto 17px;
      border-style: solid;
      border-width: 2px;
      border-image-source: linear-gradient(to bottom, #4017a8 100%, #8256f2 0%);
      border-image-slice: 1;
      background-image: linear-gradient(to bottom, #2f1b80 98%, #4c36b3 0%), linear-gradient(to bottom, #4017a8 100%, #8256f2 0%);

      >span {
        width: 90px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 0 1px;
      }
    }
  }

  .btn {
    width: 80px;
    height: 34px;
    font-size: 10px;
    // display: flex;
    // flex-direction: row;
    // justify-content: flex-start;
    // align-items: center;
    margin-left: 10px;
    // padding: 4px 8px;
    // border-radius: 8px;
    // box-shadow: inset 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    // border: solid 1px #251e4e;
    // background-color: #0e0529;

    >img {
      width: 64px;
      height: 26px;
    }
  }

  .btn_block {
    color: #fff;
  }

}
</style>
