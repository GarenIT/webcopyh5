<!-- 注册 -->
<template>
    <Teleport to="body">
        <div class="register_dialog_popup">
            <nut-popup v-model:visible="show" :z-index="999">
                <div class="register_dialog_content">
                    <div class="reg_dia_title">
                        <span>{{ t('hall_signUp') }}</span>
                        <iconpark-icon class="close" icon-id="tongyiconguanb01" color="#fff" size="1rem" @click="close"></iconpark-icon>
                    </div>
                    <nut-form class="reg_dia_form" ref="formRef" :model-value="form" :rules="rules">
                        <div class="reg_dia_tabs">
                            <div class="reg_dia_tab" @click="changeTab('account')"
                                :class="{ 'reg_dia_tab_active': formType == 'account' }" v-shrink-on-click>{{ t('input_label_account') }}</div>
                            <div class="reg_dia_tab" @click="changeTab('email')"
                                :class="{ 'reg_dia_tab_active': formType == 'email' }" v-shrink-on-click>{{ t('input_label_email') }}</div>
                        </div>
                        <div class="subtitle" v-if="formType == 'account'">{{ t('input_label_account') }}</div>
                        <nut-form-item label="" prop="username" class="item" v-if="formType == 'account'">
                            <div class="ipt_box">
                                <!-- <div class="ipt_icon">
                                    <iconpark-icon ></iconpark-icon>
                                </div> -->
                                <nut-input clearable @blur="customBlurValidate(['username'])"
                                    @input="customBlurValidate(['username'])" v-model.trim="form.username" class="ipt"
                                    type="text" :placeholder="t('input_label_account')">
                                    <template #left>
                                        <iconpark-icon name="signicon01" color="#fff" size="1.5rem"></iconpark-icon>
                                    </template>
                                </nut-input>
                            </div>
                        </nut-form-item>
                        <div class="subtitle" v-if="formType == 'email'">{{ t('input_label_email') }}</div>
                        <nut-form-item label="" prop="username" class="item" v-if="formType == 'email'">
                            <div class="ipt_box">
                                <nut-input clearable @blur="customBlurValidate(['username'])"
                                    @input="customBlurValidate(['username'])" v-model.trim="form.username" class="ipt"
                                    type="text" :placeholder="t('input_label_email')">
                                    <template #left>
                                        <iconpark-icon name="signicon05" color="#fff" size="1.5rem"></iconpark-icon>
                                    </template>
                                </nut-input>
                            </div>
                        </nut-form-item>
                        <div class="subtitle">{{ t('input_label_password') }}</div>
                        <nut-form-item label="" prop="password" class="item">
                            <div class="ipt_box">
                                <nut-input clearable @blur="customBlurValidate(['password', 'confirm'])" v-model="form.password"
                                    class="ipt" :type="form.showPass == true ? 'text' : 'password'" :placeholder="t('input_label_password')">
                                    <template #left>
                                        <iconpark-icon name="signicon02" color="#fff" size="1.5rem"></iconpark-icon>
                                    </template>
                                    <template #right>
                                        <iconpark-icon @click="form.showPass = !form.showPass" v-if="!form.showPass" name="signicon06" color="#8e82c2" size="1rem"></iconpark-icon>
                                        <iconpark-icon @click="form.showPass = !form.showPass" v-if="form.showPass" name="signicon06" color="#8e82c2" size="1rem"></iconpark-icon>
                                    </template>
                                </nut-input>
                            </div>
                        </nut-form-item>
                        <div class="subtitle">{{ t('input_label_confirm_password') }}</div>
                        <nut-form-item label="" prop="confirm" class="item">
                            <div class="ipt_box">
                                <nut-input clearable @blur="customBlurValidate(['confirm'])" v-model="form.confirm" class="ipt"
                                    :type="form.showConfirm == true ? 'text' : 'password'" :placeholder="t('input_label_confirm_password')">
                                    <template #left>
                                        <iconpark-icon name="signicon02" color="#fff" size="1.5rem"></iconpark-icon>
                                    </template>
                                    <template  #right>
                                        <iconpark-icon @click="form.showConfirm = !form.showConfirm" v-if="!form.showConfirm" name="signicon06" color="#8e82c2" size="1rem"></iconpark-icon>
                                        <iconpark-icon @click="form.showConfirm = !form.showConfirm" v-if="form.showConfirm" name="signicon06" color="#8e82c2" size="1rem"></iconpark-icon>
                                    </template>
                                </nut-input>
                            </div>
                        </nut-form-item>
                        <div class="subtitle">{{ t('input_label_code') }}</div>
                        <nut-form-item label="" prop="captcha" class="item" v-if="formType == 'account'">
                            <div class="ipt_box">
                                <nut-input clearable @blur="customBlurValidate(['captcha'])" v-model.trim="form.captcha" class="ipt"
                                    type="text" :placeholder="t('input_label_code')">
                                    <template #left>
                                        <iconpark-icon name="signicon03" color="#fff" size="1.5rem"></iconpark-icon>
                                    </template>
                                </nut-input>
                            </div>
                            <div class="code_box" @click="refresh_captcha" style="background-color: #0F0529;">
                                <img v-shrink-on-click style="width:100%;height:100%;object-fit: contain;"
                                    v-if="captchaURL" :src="captchaURL" alt="captcha" />

                                <div
                                    style="font-size: 20px;display: flex;flex-direction: column;align-items: center;justify-content: center;">
                                    <iconpark-icon name="signicon08"></iconpark-icon>
                                </div>
                            </div>
                        </nut-form-item>
                        <nut-form-item label="" prop="captcha" class="item" v-if="formType == 'email'">
                            <div class="ipt_box">
                                <nut-input clearable @blur="customBlurValidate(['captcha'])" v-model.trim="form.captcha" class="ipt"
                                    type="text" :placeholder="t('input_label_code')">
                                    <template #left>
                                        <iconpark-icon name="signicon03" color="#fff" size="1.5rem"></iconpark-icon>
                                    </template>
                                </nut-input>
                            </div>
                            <div v-shrink-on-click class="code_box code_box_btn" @click="onEmailRequest">{{
                emailLoadingCount ?
                    emailLoadingCount : t('get_verification_code2') }}</div>
                        </nut-form-item>
                        <div class="subtitle">{{ t('input_invite_code') }}</div>
                        <nut-form-item label="" prop="agent_id" class="item">
                            <div class="ipt_box">
                                <nut-input clearable v-model.trim="form.agent_id" class="ipt" type="text" :placeholder="t('invite_code')">
                                    <template #left>
                                        <iconpark-icon name="signicon04" color="#fff" size="1.5rem"></iconpark-icon>
                                    </template>
                                </nut-input>
                            </div>
                        </nut-form-item>

                        <div class="btn" @click="onSubmit" v-shrink-on-click>{{ t('btn_label_submit') }}</div>
                    </nut-form>
                </div>
            </nut-popup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { IP } from "@/utils/publicMethods";
import { Net } from "@/net/Net";
import { NetPacket } from "@/netBase/NetPacket";
import { MessageEvent2 } from "@/net/MessageEvent2";
import { NetMsgType } from "@/netBase/NetMsgType";
import { getRandomSign, getDeviceId, aaa, bbb, device_model } from "@/net/Utils";
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { showNotify } from '@nutui/nutui'
import { Local, needLoginApi } from "@/utils/storage";
import pinia from '@/store/index';
import { User } from '@/store/user';
// import { Page } from '@/store/page';  Page(pinia).settings?.currencyList
import { storeToRefs } from 'pinia';
// import { NetEnumDef } from "@/netBase/NetEnumDef";
import { verifyCaptcha, verifyEmail, verifyPassword } from "@/utils/validateTools";
import '@nutui/nutui/dist/packages/notify/style/css';
import { useI18n } from "vue-i18n";

const { t } = useI18n();


const route = useRoute();


const captchaURL = ref(""); // 验证码URl
const handleCaptchaReceive = (captcha: any) => { // 接收验证码图片
    captchaURL.value = captcha.url;
};
const refresh_captcha = async () => { // 刷新验证码图片
    const req_register_captcha = NetPacket.req_register_captcha();
    const id = await getDeviceId()
    req_register_captcha.sign = getRandomSign(id);
    req_register_captcha.aaa = aaa;
    req_register_captcha.bbb = bbb;
    Net.instance.sendRequest(req_register_captcha);
};
const onEmailRequest = () => { // 发送邮箱验证码
    if (!verifyEmail(form.value.username)) return showNotify.warn(t('email_error'))
    if (emailLoadingCount.value) return
    const req_get_email = NetPacket.req_get_email_verification_code();
    req_get_email.operate_type = 1;
    req_get_email.email = form.value.username;
    Net.instance.sendRequest(req_get_email);
};

const req_register = NetPacket.req_register_account(); // 注册请求

// 表单
const formType = ref('account') // account-账号 email-邮箱
const changeTab = (tab: any) => {
    if (formType.value == tab) return
    form.value.username = ''
    form.value.captcha = ''
    form.value.password = ''
    form.value.confirm = ''
    formType.value = tab
    formRef.value?.reset()
}
const form = ref({
    agent_id: '', // 邀请码
    username: '',
    password: '',
    showPass: false,
    confirm: '',
    showConfirm: false,
    captcha: ''
})
const rules = ref({
    username: [
        { required: true, message: t('player_info_tip_1') },
        {
            validator: (val: any) => {
                if (formType.value == 'email' && !verifyEmail(val)) {
                    return Promise.reject(t('account_error'))
                } else {
                    return Promise.resolve()
                }
            }
        },
    ],
    password: [
        { required: true, message: t('player_info_tip_1') },
        {
            validator: (val: any) => {
                if (!verifyPassword(val)) {
                    return Promise.reject(t('password_error'))
                } else {
                    return Promise.resolve()
                }
            }
        },
    ],
    confirm: [
        { required: true, message: t('player_info_tip_1') },
        {
            validator: (val: any) => {
                if (form.value.password != val) {
                    return Promise.reject(t('password_are_inconsistent'))
                } else {
                    return Promise.resolve()
                }
            }
        },
    ],
    captcha: [
        { required: true, message: t('empty_tips2') },
        {
            validator: (val: any) => {
                if (formType.value == 'account' && !verifyCaptcha(val)) {
                    return Promise.reject(t('code_error'))
                } else {
                    return Promise.resolve()
                }
            }
        },
    ],
})
const customBlurValidate = (arr: any) => {
    arr.forEach((key: any) => {
        formRef.value?.validate(key)
    })
}
// 提交前验证
const formRef = ref()
const onSubmit = () => {
    formRef.value?.validate().then((rs: any) => {
        if (rs.valid) {
            if (!form.value.username) return showNotify.warn(t('account_error'))
            if (formType.value == 'email' && !verifyEmail(form.value.username)) return showNotify.warn(t('account_error'))
            if (!form.value.password || !verifyPassword(form.value.password)) return showNotify.warn(t('password_error'))
            if (form.value.password != form.value.confirm) return showNotify.warn(t('password_are_inconsistent'))
            if (!form.value.captcha) return showNotify.warn(t('empty_tips2'))
            if (formType.value == 'account' && !verifyCaptcha(form.value.captcha)) return showNotify.warn(t('code_error'))
            handleSubmit()
        }
    })

};
const loading = ref(false)
const handleSubmit = async () => {
    if (loading.value) return // 防抖
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 1000)

    req_register.username = form.value.username
    req_register.password = form.value.password;
    req_register.register_type = Local.get('user')?.token !== '' ? 1 : 2
    const id = await getDeviceId()
    req_register.sign = getRandomSign(id);
    req_register.ip = await IP();
    req_register.ip_error = "0";
    req_register.device_model = device_model;
    req_register.channel_id = route.query.channel_id || 123;
    req_register.device_id = await getDeviceId();
    req_register.aaa = aaa;
    req_register.bbb = bbb;
    req_register.captcha = form.value.captcha;
    req_register.currency = 1;
    req_register.agent_id = Number(form.value.agent_id);
    req_register.from_url = ""
    Net.instance.sendRequest(req_register);
};


// 注册成功
const registerSuccess = async (message: any) => {

    if (message.code == 1) {

        showNotify.success('home_page_registerSuccess')

        const req_login = NetPacket.req_login();

        req_login.login_type = req_register.register_type;
        req_login.username = req_register.username;
        req_login.password = req_register.password;
        req_login.device_id = await getDeviceId();
        req_login.device_model = device_model;
        req_login.channel_id = route.query.channel_id || 123;
        req_login.aaa = aaa;
        req_login.bbb = bbb;
        req_login.ip = await IP();
        req_login.captcha = req_register.captcha;
        Net.instance.sendRequest(req_login);
    } else {
        refresh_captcha()
    }

}

// 登录成功
const loginSuccess = async (message: any) => {
    // 注册成功 关闭弹窗
    close()
    if (message.code == 4444) {
        return;
    }
    await User(pinia).getUserLoginInfo(message) // 设置登录数据
    needLoginApi()
}

// 邮箱验证码获取成功
const emailLoadingCount = ref(0)
let interval: any = null
const loadingEmail = () => {
    if (emailLoadingCount.value) return
    if (interval) clearInterval(interval)
    emailLoadingCount.value = 180
    interval = setInterval(() => {
        emailLoadingCount.value--
        if (emailLoadingCount.value <= 0) {
            clearInterval(interval)
        }
    }, 1000)
}
const emailVerificationSuccess = async (message: any) => {
    if (message.code == 1) {
        loadingEmail()
    } else {
        showNotify.danger(message.message)
    }
}
// 检测版本信息
// const onHander_check_version = async (message: any) => {
//     if (message.result != NetEnumDef.check_version_result.cvr_yes) {
//         return;
//     }

//     let req_role_login_with_ip = NetPacket.req_role_login_with_ip();
//     req_role_login_with_ip.uid = Local.get('user').user_id;
//     req_role_login_with_ip.server_id = 2;
//     req_role_login_with_ip.token = Local.get('user').token;
//     req_role_login_with_ip.type = NetEnumDef.connect_type.common_connect;
//     req_role_login_with_ip.version = 1;
//     req_role_login_with_ip.device_id = await getDeviceId();
//     req_role_login_with_ip.ip = "";

//     Net.instance.sendRequest(req_role_login_with_ip);
// }


// 弹窗状态
const userInfo = User(pinia);
const show = ref(storeToRefs(userInfo).isReg) // isReg
onMounted(() => {
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_register_captcha,
        handleCaptchaReceive
    );
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_register_account,
        registerSuccess
    );
    MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_nodify_login, loginSuccess);
    MessageEvent2.addMsgEvent(NetMsgType.msgType.msg_notify_get_email_verification_code, emailVerificationSuccess);
    // MessageEvent2.addMsgEvent(
    //     NetMsgType.msgType.msg_notify_check_version,
    //     onHander_check_version
    // );
    refresh_captcha();
})
onUnmounted(() => {
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_register_captcha, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_register_account, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_nodify_login, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_get_email_verification_code, null);
    // MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_check_version, null);
})
const close = () => {
    User(pinia).setReg(false)
}

</script>

<style lang="scss">
.register_dialog_popup {
    .nut-popup {
        background-color: rgba(0, 0, 0, 0);
    }
}


.register_dialog_content {
    div {
        box-sizing: border-box;
    }

    user-select: none;
    width: 355px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #26155C;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39),
    0 2px 2px 0 rgba(0, 0, 0, 0.34),
    0 5px 3px 0 rgba(0, 0, 0, 0.2),
    0 8px 3px 0 rgba(0, 0, 0, 0.06),
    0 13px 3px 0 rgba(0, 0, 0, 0.01);

    .reg_dia_title {
        height: 46px;
        line-height: 46px;
        font-size: 14px;
        text-align: center;
        position: relative;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
        background-image: radial-gradient(#4c36b3 0%, #3a2786 100%, #3c279a 25%);
        height: 46.2px;
        font-size: 14px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .close {
            position: absolute;
            right: 10px;
        }
    }

    .reg_dia_form {
        padding: 12px 47.5px 24px 47.5px;
        width: 100%;
        box-sizing: border-box;

        .nut-cell-group__wrap {
            box-shadow: none;
        }

        .reg_dia_tabs {
            width: 100%;
            height: 45px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            padding: 4px;
            background-image: url("/imgs/btn/tabBtn.webp");
            background-size: 103% 120%;
            background-position: center 10%;
            margin-bottom: 12px;

            .reg_dia_tab {
                flex: 1;
                width: 123px;
                height: 36px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: #c0c2db;
            }

            .reg_dia_tab_active {
                background-image: url("/imgs/btn/inlineBtn.webp");
                background-size: 100% 100%;
                color: #fff;
            }
        }

        .subtitle {
            font-size: 12px;
            line-height: 18px;
            color: #c0c2db;
            margin-bottom: 2px;
        }

        .btn {
            margin-top: 30px;
            height: 40px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            background-image: url("/imgs/btn/blockBtn.webp");
            background-size: 100% 100%;
            font-size: 14px;
        }

        .nut-cell {
            line-height: 34px;
            padding: 0;

            &::after {
                display: none;
            }
        }

        .item {
            margin-bottom: 8px;
            width: 100%;

            &::before {
                display: none !important;
            }

            .nut-form-item__body__slots {
                display: flex;
                align-items: center;
                justify-content: space-between;
                overflow: hidden;
            }

            .nut-form-item__body__tips {
                line-height: 18px;
            }

            .ipt_box {
                flex: 1;
                display: flex;
                align-items: center;
                height: 34px;
                line-height: 34px;
                border-radius: 8px;
                background-color: #0F0529;
                padding: 0 9px;
                // border: 1px solid #322c59;

                .ipt_icon {
                    width: 24px;
                    height: 24px;
                    margin-right: 4px;
                    line-height: 24px;
                    font-size: 24px;
                }

                .eye_icon {
                    width: 16px;
                    height: 16px;
                    margin-left: 4px;
                    font-size: 16px;
                }

                .ipt {
                    flex: 1;
                    // color: #fff;
                    font-size: 14px;
                    font-weight: 500;
                    // background-color: rgba(0, 0, 0, 0);
                    border: none;
                    outline: none;
                    width: 50px;
                }
            }

            .code_box {
                width: 100px;
                height: 34px;
                border-radius: 8px;
                background-color: #1d0e4a;
                margin-left: 5px;
                border: 1px solid #322c59;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
            }

            .code_box_btn {
                background-image: url("/imgs/btn/blockBtn.webp");
                background-size: 100% 100%;
            }
        }
    }
}
</style>