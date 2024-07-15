<template>
    <div>
        <PopForm ref="FormRef" @onClose="onClose" @nextChange="nextChange" @changeTab="changeTab"
            @submitData="changePassword">
        </PopForm>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue';
import { Net } from '@/net/Net';
import { NetPacket } from '@/netBase/NetPacket';
import { useI18n } from 'vue-i18n';
import { handleOpenLink } from '@/utils/publicMethods'
import pinia from '@/store/index';
import { storeToRefs } from 'pinia';
import { Page } from '@/store/page';
import { User } from '@/store/user';
import PopForm from "@/components/PopForm.vue";
import { verifyCaptcha, verifyEmail, verifyMobile, verifyPassword } from '@/utils/validateTools';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetMsgType } from '@/netBase/NetMsgType';
import { showNotify } from '@nutui/nutui';
import { Local } from '@/utils/storage';

const FormRef = ref()

const { t } = useI18n();
const page = Page(pinia);
const { settings } = storeToRefs(page);
const state: any = reactive({
    checkPhoneOremail: true,
    formData: {
        active: 1,
        step: 1,  //1表示点击下一步需要校验手机或者邮箱是否已经绑定，验证码是否正确；operate_type=2表示立即修改密码
        buttonText: t('home_page_next'),
        title: t('home_page_retrievePassword'),
        showLabel: false,
        forgetPassword:true,
        tabList: [
            { name: t('home_page_phoneRecovery'), value: 1 },
            { name: t('home_page_emailRetrieval'), value: 2 },
            { name: t('home_page_customerServiceRetrieval'), value: 3,isLink:true }
        ],
        formParams: {
            operate_type: 2, //1表示点击下一步需要校验手机或者邮箱是否已经绑定，验证码是否正确；operate_type=2表示立即修改密码
            modify_type: 1, //1表示常规修改密码，modify_type=2表示通过手机修改密码，modify_type=3表示通过邮箱修改密码
            phoneCode: "",
            emailCode: "",
            mobile: "",
            email: '',
            old_password: '',
            new_password: "",
            new_password_confirm: "",
            codeValue: '84',
        },
        rules: {
            mobile: [
                {
                    // required: !0,
                    // trigger: "change",
                    validator: (value: string) => {
                        console.log(value);
                        if (!value) {
                            return Promise.reject(t('home_page_enterPhoneNumber'))
                        } else
                            if (verifyMobile(state.formData.formParams.codeValue, value)) {
                                state.formData.list.phoneCode.disabled = false
                                return Promise.resolve()
                            } else {
                                state.formData.list.phoneCode.disabled = true
                                return Promise.reject(t('home_page_phoneNumberFormatIncorrect'))
                            }

                    },
                },
            ],
            verify_code: [
                {
                    // required: !0,
                    // trigger: "blur",
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
                    // required: !0,
                    // trigger: "change",
                    validator: (value: string) => {
                        if (!value) {
                            return Promise.reject(t('home_page_enterEmail'))
                        } else
                            if (verifyEmail(state.formData.formParams.email)) {
                                state.formData.list.emailCode.disabled = false
                                return Promise.resolve()
                            } else {
                                state.formData.list.emailCode.disabled = true
                                return Promise.reject(t('home_page_emailIncorrect'))
                            }
                    },

                },
            ],
            old_password: [
                {
                    // required: !0,
                    // trigger: "blur",
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
            new_password: [
                {
                    // required: !0,
                    // trigger: "blur",
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
            new_password_confirm: [
                {
                    // required: !0,
                    // trigger: "blur",
                    validator: (value: any) => {
                        if (!value) {
                            return Promise.reject(t('home_page_enterAgainNewPassword'))
                        } else
                            if (value != state.formData.formParams.new_password) {
                                return Promise.reject(t('home_page_passwordsInconsistent'))
                            } else {
                                return Promise.resolve()
                            }
                    },
                },
            ],
            emailCode: [
                {
                    // required: !0,
                    // trigger: "blur",
                    validator: (value: string) => {
                        if (!value) {
                            return Promise.reject(t('home_page_enterSmsCode'))
                        } else
                            if (verifyCaptcha(value)) {
                                return Promise.resolve()
                            } else {
                                return Promise.reject(t('home_page_smsCodeFormatIncorrect'))
                            }
                    },
                },
            ],
        },
        list: {
            mobile: {
                name: "mobile",
                type: "text",
                placeholder: t('home_page_enterPhoneNumber'),
                label: t('home_page_phone'),
                slot: !1,
                leftIcon: 'signicon10',
                changeRightIcon: !1,
                show: true,
                isMobile: true,

            },

            email: {
                name: "email",
                type: "text",
                placeholder: t('home_page_enterEmail'),
                label: t('home_page_email'),
                slot: !1,
                leftIcon: "signicon05",
                changeRightIcon: !1,
                show: false,
            },
            old_password: {
                name: "old_password",
                type: "password",
                placeholder: t('home_page_enterOldPassword'),
                label: t('home_page_oldPassword'),
                slot: !0,
                leftIcon: "signicon02",
                changeRightIcon: "wallrticontongy03",
                show: false,
            },
            new_password: {
                name: "new_password",
                type: "password",
                placeholder: t('home_page_enterNewPassword'),
                label: t('home_page_newPassword'),
                slot: !0,
                leftIcon: "signicon02",
                changeRightIcon: "wallrticontongy03",
                show: false,
            },
            new_password_confirm: {
                name: "new_password_confirm",
                type: "password",
                placeholder: t('home_page_enterAgainNewPassword'),
                label: t('home_page_newPassword'),
                slot: !0,
                leftIcon: "signicon02",
                changeRightIcon: "wallrticontongy03",
                show: false,
            },
            phoneCode: {
                name: "phoneCode",
                type: "code",
                placeholder: t('home_page_enterSmsCode'),
                label: t('home_page_smsCode'),
                slot: !0,
                leftIcon: "signicon03",
                changeRightIcon: !1,
                show: true,
                disabled: true,
                loading: false,
                timeText: t('home_page_send'),
                timer: null
            },
            emailCode: {
                name: "emailCode",
                type: "code",
                placeholder: t('home_page_enterVerificationCode'),
                label: t('home_page_verificationCode'),
                slot: !0,
                leftIcon: "signicon03",
                changeRightIcon: !1,
                show: false,
                disabled: true,
                loading: false,
                timeText: t('home_page_send'),
                timer: null
            },
        },
    },

})
const onClose = async () => {
    await User(pinia).setForget(false)
};

const changeTab = (tabVal: number) => {
    if (tabVal == 1) {
        state.formData.active = tabVal;

        state.formData.list.mobile.show = true
        state.formData.list.phoneCode.show = true
    }
    if (tabVal == 2) {
        state.formData.active = tabVal;

        state.formData.list.email.show = true
        state.formData.list.emailCode.show = true
    }
    if (tabVal == 3) {

        handleOpenLink(settings.value.serviceTelegram)
        return
    }
    state.step = 1;
};
const nextChange = (formData: any) => {
    changePassword(formData, 1)
}

const changePassword = (params: any, type: number) => {
   
    let req = NetPacket.req_reset_account_password();
    // 点击下一步验证手机或邮箱是否绑定
    if (type == 1) {
        req.operate_type = 1
        state.checkPhoneOremail = true
    } else {
        req.operate_type = 2
    }
    if (state.formData.active == 1) {
        req.username = params.codeValue + params.mobile
        req.captcha = params.phoneCode
        req.modify_type = 1
    }
    if (state.formData.active == 2) {
        req.username = params.email
        req.captcha = params.emailCode
        req.modify_type = 2
    }

    req.mobile_or_email = ''

    // req.username = req.mobile_or_email
    req.old_password = params.old_password
    req.new_password = params.new_password
    req.new_password_confirm = params.new_password_confirm

    Net.instance.sendRequest(req);
};
// 返回修改密码是否成功或验证手机或邮箱是否绑定
const handleChangePassword = async (res: any) => {
  if (state.checkPhoneOremail) {
    if (res.code == 1) {
      state.formData.buttonText = t('home_page_retrieveNow')
      state.formData.step = 2
      state.formData.list.new_password.show = true
      state.formData.list.new_password_confirm.show = true
      state.formData.list.phoneCode.show = false
      state.formData.list.emailCode.show = false
      state.checkPhoneOremail = false
    }
  } else {
    if (res.code == 1) {
    showNotify.success(t(res.message))
      Local.remove('user')
      await User(pinia).setHasLogin(false)
      setTimeout(() => {
        location.href = '/'
      }, 2000);


    }
  }
}

onMounted(async () => {

    FormRef.value.openDialog(state.formData, 3);
      // 监听验证码是否通过 或设置密码是否通过
  MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_reset_account_password,
    handleChangePassword
  );
})
</script>

<style lang='less' scoped></style>