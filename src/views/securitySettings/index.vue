<template>
    <div class="security_settings">

        <div class="items" v-for="(items, i) in  state.list " :key="i">
            <span>{{ t(items.text) }}</span>
            <div v-if="items.btns">

                <span>{{ info[items.value] }}</span>
                <div v-if="items.btns.length > 0">
                    <span class="bind_btn btn_block" v-for="(item, j) in  items.btns " :id="items.text" :key="j"
                        @click="itemClick(items)">
                        {{ t(item.text) }}</span>
                </div>
            </div>
            <!-- <div v-else style="padding: 0;">
                <n-select v-model:value="items.value" :options="state.currencyList" />
            </div> -->
        </div>
        <PopForm ref="FormRef" @nextChange="nextChange" @changeTab="changePasswordChangeTab" @submitData="submitData">
        </PopForm>
    </div>
</template>

<script setup lang='ts'>
// 国际化使用 homepage
import { onMounted, onUnmounted, reactive, defineAsyncComponent, ref } from 'vue';

import pinia from '@/store/index';
import { storeToRefs } from 'pinia';
import { User } from '@/store/user';


import { showNotify } from '@nutui/nutui'
import { useI18n } from 'vue-i18n';

import { Local, needLoginApi } from '@/utils/storage';

import { verifyCaptcha, verifyEmail, verifyMobile, verifyPassword, verifyPhoneCaptcha, verifyWithdrawPwd } from '@/utils/validateTools';
import { NetPacket } from '@/netBase/NetPacket';
import { Net } from '@/net/Net';
import { aaa, bbb, getDeviceId, getRandomSign } from '@/net/Utils';
import { IP } from '@/utils/publicMethods';
import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetMsgType } from '@/netBase/NetMsgType';

const { t } = useI18n();

const PopForm = defineAsyncComponent(() => import('@/components/PopForm.vue'));
const userInfo = User(pinia);
const FormRef = ref()
const { info, roleInfo } = storeToRefs(userInfo);
const state: any = reactive({
    first: 1,
    checkPhoneOremail: false,
    params: null,
    type: 0,
    formData: null,
    list: [
        {
            text: 'home_page_name',
            value: 'real_name',
            btns: [
                // { text: '', icon: '', value: 1 }
            ],
        },
        {
            text: 'home_page_account',
            value: 'full_name',
            btns: [],
            formData: {
                title: 'home_page_modifyAccount',
                buttonText: 'home_page_modifyNow',
                showLabel: true,
                formParams: {
                    account: '',
                    operate_type: 2,
                },

                list: {
                    account: {
                        name: "account",
                        type: "text",
                        placeholder: 'home_page_enterAccount1',
                        label: 'home_page_account',
                        slot: !1,
                        leftIcon: "",
                        changeRightIcon: !1,
                        show: true,
                    },
                },
            },
            type: 1
        },
        {
            text: 'home_page_password',
            value: 'hideString',

            btns: [
                { text: 'home_page_modify', icon: 'Group39376', value: 1 }
            ],
            formData: {
                active: 0,
                step: '',  //1表示点击下一步需要校验手机或者邮箱是否已经绑定，验证码是否正确；operate_type=2表示立即修改密码
                buttonText: 'home_page_modifyNow',
                title: 'home_page_modifyPassword',
                showLabel: true,
                tabList: [
                    { name: 'home_page_generalModifications', value: 0 },
                    { name: 'home_page_modifyPhone', value: 1 },
                    { name: 'home_page_modifyEmail', value: 2 },
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

                list: {
                    mobile: {
                        name: "mobile",
                        type: "text",
                        placeholder: 'home_page_enterPhoneNumber',
                        label: 'home_page_phone',
                        slot: !1,
                        leftIcon: false,
                        changeRightIcon: !1,
                        show: false,
                        isMobile: true,

                    },

                    email: {
                        name: "email",
                        type: "text",
                        placeholder: 'home_page_enterEmail',
                        label: 'home_page_email',
                        slot: !1,
                        // leftIcon: "Group39361-d3pmjajn",
                        changeRightIcon: !1,
                        show: false,
                    },
                    old_password: {
                        name: "old_password",
                        type: "password",
                        placeholder: 'home_page_enterOldPassword',
                        label: 'home_page_oldPassword',
                        slot: !0,
                        // leftIcon: "Group39362-d3pmjajk",
                        changeRightIcon: "wallrticontongy03",
                        show: true,
                    },
                    new_password: {
                        name: "new_password",
                        type: "password",
                        placeholder: 'home_page_enterNewPassword',
                        label: 'home_page_newPassword',
                        slot: !0,
                        // leftIcon: "Group39362-d3pmjajk",
                        changeRightIcon: "wallrticontongy03",
                        show: true,
                    },
                    new_password_confirm: {
                        name: "new_password_confirm",
                        type: "password",
                        placeholder: 'home_page_enterAgainNewPassword',
                        label: 'home_page_newPassword',
                        slot: !0,
                        // leftIcon: "Group39362-d3pmjajk",
                        changeRightIcon: "wallrticontongy03",
                        show: true,
                    },
                    phoneCode: {
                        name: "phoneCode",
                        type: "code",
                        placeholder: 'home_page_enterSmsCode',
                        label: 'home_page_smsCode',
                        slot: !0,
                        // leftIcon: "Group39363-d3pmjao6",
                        changeRightIcon: !1,
                        show: false,
                        disabled: true,
                        loading: false,
                        timeText: 'home_page_send',
                        timer: null
                    },
                    emailCode: {
                        name: "emailCode",
                        type: "code",
                        placeholder: 'home_page_enterVerificationCode',
                        label: 'home_page_verificationCode',
                        slot: !0,
                        // leftIcon: "Group39363-d3pmjao6",
                        changeRightIcon: !1,
                        show: false,
                        disabled: true,
                        loading: false,
                        timeText: 'home_page_send',
                        timer: null
                    },
                },
            },
            type: 3
        },
        {
            text: 'home_page_email',
            value: 'email',
            btns: [
                { text: 'home_page_bind', icon: 'Group39377', value: 0 },
                // { text: '修改', icon: 'Group39376', value: 1 }
            ],
            formData: {
                buttonText: 'home_page_bindNow',
                title: 'home_page_bindEmail',
                active: 2,
                showLabel: true,
                formParams: {
                    operate_type: 1, //1表示点击下一步需要校验手机或者邮箱是否已经绑定，验证码是否正确；operate_type=2表示立即修改密码
                    modify_type: 1, //1表示常规修改密码，modify_type=2表示通过手机修改密码，modify_type=3表示通过邮箱修改密码
                    verify_code: "",
                    emailCode: '',
                    email: '',
                },

                list: {
                    email: {
                        name: "email",
                        type: "text",
                        placeholder: 'home_page_enterEmail',
                        label: 'home_page_email',
                        slot: !1,
                        leftIcon: "Group39361-d3pmjajn",
                        changeRightIcon: !1,
                        show: true,
                    },

                    emailCode: {
                        name: "emailCode",
                        type: "code",
                        placeholder: 'home_page_enterVerificationCode',
                        label: 'home_page_verificationCode',
                        slot: !0,
                        leftIcon: "Group39363-d3pmjao6",
                        changeRightIcon: !1,
                        show: true,
                        disabled: true,
                        loading: false,
                        timeText: 'home_page_send',
                        timer: null
                    },
                },
            },
            type: 4,

        },
        {
            text: 'home_page_phone',
            value: 'mobile',
            btns: [
                { text: 'home_page_bind', icon: 'Group39377', value: 0 },
                // { text: '修改', icon: 'Group39376', value: 1 }
            ],
            formData: {
                buttonText: 'home_page_bindNow',
                title: 'home_page_bindPhone',
                active: 1,
                showLabel: true,
                formParams: {
                    operate_type: 3, //1表示点击下一步需要校验手机或者邮箱是否已经绑定，验证码是否正确；operate_type=2表示立即修改密码
                    modify_type: 1, //1表示常规修改密码，modify_type=2表示通过手机修改密码，modify_type=3表示通过邮箱修改密码
                    verify_code: "",
                    mobile: "",
                    codeValue: '84',
                },

                list: {
                    mobile: {
                        name: "mobile",
                        type: "text",
                        placeholder: 'home_page_enterPhoneNumber',
                        label: 'home_page_phone',
                        slot: !1,
                        leftIcon: false,
                        changeRightIcon: !1,
                        show: true,
                        isMobile: true
                    },
                    phoneCode: {
                        name: "phoneCode",
                        type: "code",
                        placeholder: 'home_page_enterSmsCode',
                        label: 'home_page_smsCode',
                        slot: !0,
                        leftIcon: "Group39363-d3pmjao6",
                        changeRightIcon: !1,
                        show: true,
                        disabled: true,
                        loading: false,
                        timeText: 'home_page_send',
                        timer: null
                    },
                },
            },
            type: 5,

        },
        // {
        //     text: 'home_page_currency',
        //     value: 'VND',
        //     type: 9
        // },
        {
            text: 'home_page_fundPassword',
            value: 'hideString',

            btns: [
                { text: 'home_page_modify', icon: 'Group39376', value: 1 }
            ],
            formData: {
                buttonText: 'home_page_bindNow',
                title: 'home_page_bindFundPassword',
                showLabel: true,
                formParams: {
                    operate_type: 1, // 1表示绑定资金密码；operate_type=2表示修改资金密码
                    old_withdrawPwd: '',
                    new_withdrawPwd: "",
                    new_withdrawPwd_confirm: '',
                },

                list: {
                    old_withdrawPwd: {
                        name: "old_withdrawPwd",
                        type: "password",
                        placeholder: 'home_page_enterOldPassword',
                        label: 'home_page_oldPassword',
                        slot: !0,
                        // leftIcon: "Group39362-d3pmjajk",
                        changeRightIcon: "wallrticontongy03",
                        show: false,
                    },
                    new_withdrawPwd: {
                        name: "new_withdrawPwd",
                        type: "password",
                        placeholder: 'home_page_enterNewPassword',
                        label: 'home_page_newPassword',
                        slot: !0,
                        // leftIcon: "Group39362-d3pmjajk",
                        changeRightIcon: "wallrticontongy03",
                        show: true,
                    },
                    new_withdrawPwd_confirm: {
                        name: "new_withdrawPwd_confirm",
                        type: "password",
                        placeholder: 'home_page_enterAgainNewPassword',
                        label: 'home_page_newPassword',
                        slot: !0,
                        // leftIcon: "Group39362-d3pmjajk",
                        changeRightIcon: "wallrticontongy03",
                        show: true,
                    },

                },
            },
            type: 10,
        },
    ],
    currencyList: [
        { label: 'VND', value: 1 },
        // { label: 'USDT', value: 2 }
    ],

})
// 点击修改某一项
const itemClick = (item: any) => {
    let rules = {
        mobile: [
            {

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
        old_withdrawPwd: [
            {

                validator: (value: string) => {
                    if (!value) {
                        return Promise.reject(t('home_page_enterOldPassword'))
                    } else
                        if (verifyWithdrawPwd(value)) {
                            return Promise.resolve()
                        } else {
                            return Promise.reject(t('home_page_passwordFormatIncorrect'))
                        }
                },


            },
        ],
        new_withdrawPwd: [
            {

                validator: (value: string) => {
                    if (!value) {
                        return Promise.reject(t('home_page_enterAgainNewPassword'))
                    } else
                        if (verifyWithdrawPwd(value)) {
                            return Promise.resolve()
                        } else {
                            return Promise.reject(t('home_page_passwordFormatIncorrect'))
                        }
                },

            },
        ],
        new_withdrawPwd_confirm: [
            {

                validator: (value: any) => {
                    if (!value) {
                        return Promise.reject(t('home_page_enterAgainNewPassword'))
                    }
                    if (value != state.formData.formParams.new_withdrawPwd) {
                        return Promise.reject(t('home_page_passwordsInconsistent'))
                    } else {
                        return Promise.resolve()
                    }
                },

            },
        ],
        phoneCode: [
            {

                validator: (value: string) => {

                    if (!value) {
                        return Promise.reject(t('home_page_enterSmsCode'))
                    } else
                        if (verifyPhoneCaptcha(value)) {
                            return Promise.resolve()
                        } else {
                            return Promise.reject(t('home_page_smsCodeFormatIncorrect'))
                        }
                },



            },
        ],
        emailCode: [
            {

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
        account: [
            {

                validator: (value: string) => {
                    if (!value) {
                        return Promise.reject(t('home_page_enterAccount1'))
                    } else
                        if (verifyPassword(value)) {
                            return Promise.resolve()
                        } else {
                            return Promise.reject(t('home_page_accountFormatIncorrect'))
                        }
                },
            },
        ],

    }
    item.formData.rules = rules
    state.formData = item.formData
    FormRef.value.openDialog(item.formData, item.type)
}

// 更改密码或验证验证码
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
        req.mobile_or_email = params.mobile
        req.captcha = params.phoneCode
    }
    if (state.formData.active == 2) {
        req.mobile_or_email = params.email
        req.captcha = params.emailCode
    }

    req.modify_type = params.modify_type

    req.username = info.value?.full_name
    req.old_password = params.old_password
    req.new_password = params.new_password
    req.new_password_confirm = params.new_password_confirm

    Net.instance.sendRequest(req);
};
const checkAccount = (params: any, _type: number) => {
    let req = NetPacket.req_can_modify_account();
    req.newusername = params.account;
    req.operate_type = 2;
    Net.instance.sendRequest(req);
}
// 修改会员账号和绑定邮箱和绑定手机号
const changeEmailAndPhoneAndAccount = async (params: any, type: number) => {

    let req = NetPacket.req_bind_modify_email();
    // 1为修改会员账号 4 为绑定邮箱 5为绑定手机号
    if (type == 1) {
        req.username = params.account;
    }
    if (type == 4) {
        req.email = params.email;
        req.username = info.value?.full_name;
        req.captcha = params.emailCode;
    }
    if (type == 5) {
        req.email = params.codeValue + params.mobile;
        req.username = info.value?.full_name;
        req.captcha = params.phoneCode;
    }


    req.operate_type = params.operate_type;
    req.agent_id = roleInfo.value.id; //Local.get('agentid')
    req.aaa = aaa;
    req.bbb = bbb;
    req.ip = await IP();
    let id = await getDeviceId()
    req.sign = getRandomSign(id);

    Net.instance.sendRequest(req);
}
// 修改资金密码
const changeMoneyPassword = (params: any) => {
    let req = NetPacket.req_bind_or_modify_withdraw_password();
    req.operate_type = params.operate_type
    req.old_password = params.old_withdrawPwd
    req.new_password = params.new_withdrawPwd
    req.role_id = roleInfo.value?.id
    req.new_password_confirm = params.new_withdrawPwd_confirm
    Net.instance.sendRequest(req);
}
// 某一个表格返回的数据 进行请求操作。
const submitData = (params: any, type: number) => {
    state.params = params
    state.type = type
    let obj: any = {
        1: checkAccount,
        2: changeEmailAndPhoneAndAccount,
        3: changePassword,
        4: changeEmailAndPhoneAndAccount,
        5: changeEmailAndPhoneAndAccount,
        10: changeMoneyPassword,
    }
    obj[type](params, type)
    // console.log(params, type);

}
// 更改tab时
const changePasswordChangeTab = (tabId: number, formData: any) => {
    state.formData = formData
    state.formData.active = tabId;
    if (state.formData.active == 0) {
        state.formData.list.old_password.show = true
        state.formData.list.new_password.show = true
        state.formData.list.new_password_confirm.show = true
        state.formData.formParams.modify_type = 2
        state.formData.buttonText = t('home_page_modifyNow')
        state.formData.step = 0
    }
    if (state.formData.active == 1) {
        state.formData.list.mobile.show = true
        state.formData.list.phoneCode.show = true
        state.formData.buttonText = t('home_page_next')
        state.formData.step = 1
    }
    if (state.formData.active == 2) {
        state.formData.list.email.show = true
        state.formData.list.emailCode.show = true
        state.formData.formParams.modify_type = 3
        state.formData.buttonText = t('home_page_next')
        state.formData.step = 1
    }

}
// 下一步
const nextChange = (formData: any) => {
    changePassword(formData, 1)
}
// 请求是否可以更改此账号
const getModifyAccount = () => {
    const req = NetPacket.req_can_modify_account();
    req.newusername = info.value?.real_name || ''
    req.operate_type = 1
    Net.instance.sendRequest(req);
};
const resetInputHide = () => {
    for (const key in state.formData.list) {
        state.formData.list[key].show = false
    }
}
// 请求是否可以修改或绑定资金密码
const getModifyWithdrawPassword = () => {
    const req = NetPacket.req_open_or_close_withdraw_password();
    req.operate_type = 4
    req.role_id = roleInfo.value?.id;
    Net.instance.sendRequest(req);
};
// 返回修改密码是否成功或验证手机或邮箱是否绑定
const handleChangePassword = async (res: any) => {
    if (state.checkPhoneOremail) {
        if (res.code == 1) {
            resetInputHide()
            state.formData.buttonText = 'home_page_modifyNow'
            state.formData.step = 2
            state.formData.list.new_password.show = true
            state.formData.list.new_password_confirm.show = true
            state.checkPhoneOremail = false
        }
    } else {
        if (res.code == 1) {
            showNotify.success(t(res.message))
            FormRef.value.closeDialog()
            await User(pinia).setHasLogin(false)
            Local.remove('user')
            location.href = '/'

        }
    }
}
// 返回是否更改邮箱成功
const handleChangeEmail = (res: any) => {
    if (res.code == 1) {
        showNotify.success(t(res.message))
        needLoginApi()
        setTimeout(() => {
            FormRef.value.closeDialog()
        }, 2000);
    }
}
// 返回是否可以进行修改或绑定资金密码
const handleModifyWithdrawPassword = (res: any) => {
    let findWithdrawPassword = state.list.find((e: any) => e.type == 10)
    // { text: '修改', icon: 'Group39376', value: 1 }
    if (res.code == 1) {

        findWithdrawPassword.formData.formParams.operate_type = 2
        findWithdrawPassword.btns = [{ text: 'home_page_modify', icon: 'Group39376', value: 1 }]
        findWithdrawPassword.formData.list.old_withdrawPwd.show = true
        findWithdrawPassword.formData.title = 'home_page_changeFundPassword'
        findWithdrawPassword.formData.buttonText = 'home_page_modifyNow'
    }
    if (res.code == 2) {

        findWithdrawPassword.formData.formParams.operate_type = 1
        findWithdrawPassword.btns = [{ text: 'home_page_bind', icon: 'Group39377', value: 2 }]
        findWithdrawPassword.formData.list.old_withdrawPwd.show = false
        findWithdrawPassword.formData.title = 'home_page_bindFundPassword'
        findWithdrawPassword.formData.buttonText = 'home_page_bindNow'
    }
}
// 获取后台通知是否可以更改此账号 并监听是否更改成功
const handleModifyAccount = (res: any) => {
    if (state.first == 1) {
        let find = state.list.find((e: any) => e.type == 1)
        if (res.code == 1) {
            find.btns = [{ text: 'home_page_modify', icon: 'Group39376', value: 1 }]
            // find.value = info.value?.full_name
            state.first = 2
        } else {
            find.btns = []
        }
    } else {
        if (res.code == 1) {

            changeEmailAndPhoneAndAccount(state.params, 1)
        }
    }
}
const handleBindOrModifyWithdrawPassword = (res: any) => {
    if (res.code == 1) {
        showNotify.success(t(res.message))
        needLoginApi()
        setTimeout(() => {
            FormRef.value.closeDialog()
        }, 2000);
    }
}
onMounted(async () => {

    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_open_or_close_withdraw_password,
        handleModifyWithdrawPassword
    );
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_can_modify_account,
        handleModifyAccount
    );
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_bind_or_modify_withdraw_password,
        handleBindOrModifyWithdrawPassword
    );
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_bind_modify_email,
        handleChangeEmail
    );
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_reset_account_password,
        handleChangePassword
    );
    let findEmail = state.list.find((e: any) => e.type == 4)
    let findPhone = state.list.find((e: any) => e.type == 5)


    if (info.value?.mobile) {
        findPhone.btns = []
    }
    if (info.value?.email) {
        findEmail.btns = []
    }

    getModifyAccount()
    getModifyWithdrawPassword()
})
onUnmounted(() => {
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_can_modify_account, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_bind_modify_email, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_open_or_close_withdraw_password, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_reset_account_password, null);

});
</script>

<style lang='scss' scoped>
.security_settings {

    padding: 0 25px;

    .items {
        margin-bottom: 20px;

        >span {
            display: inline-block;
            margin-bottom: 9px;
            color: #fff;
        }

        >div {
            padding: 0 5px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;

            >span {

                height: 45px;
                flex: 2;

                padding: 12px 32px 12px 13px;
                border-radius: 8px;
                box-shadow: inset 0 4px 4px 0 rgba(0, 0, 0, 0.25);
                background-blend-mode: color-burn, overlay, normal;
                background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5)), radial-gradient(circle at 50% 50%, #7e7e7e, #151515 98%), linear-gradient(to bottom, #27155c, #27155c);

            }

            >div {
                display: flex;
                flex: 1;
                align-items: center;

                .bind_btn {
                    flex: 1;
                    height: 44px;
                    display: flex;
                    margin-left: 10px;
                    justify-content: center;
                    align-items: center;
                    color: #fff;

                }
            }


        }
    }

}
</style>
