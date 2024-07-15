const phoneCodeMap: any = {
    "+63": { name: "philippines", code: "+63", regExp: /^(\+63|0)?(9\d{2}|[2-8]\d{2})\d{7}$/ }, // 菲律宾
    "84": { name: "vietnam", code: "+84", regExp: /^((^(\+84|84|0|0084)?)(3|5|7|8|9))+([0-9]{8})$/ }, // 越南
    "+81": { name: "japan", code: "+81", regExp: /^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/ }, // 日本
    "+82": { name: "south_korea", code: "+82", regExp: /^(00){0,1}(82){1}0{0,1}[7,1](?:\d{8}|\d{9})$/ }, // 韩国
    "+55": { name: "brazil", code: "+55", regExp: /^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/ }, // 巴西
    "+86": { name: "china", code: "+86", regExp: /^(\+?0?86\-?)?1[3-9]\d{9}$/ }, // 中国大陆
    "+886": { name: "taiwan", code: "+886", regExp: /^(\+?886\-?|0)?9\d{8}$/ } // 中国台湾
};
//验证手机号
export function verifyMobile(code: any, val: string) {
    let regExp = phoneCodeMap[code].regExp
    if (
        !regExp.test(
            val
        )
    )
        return false;
    else return true;
}
// 外链 验证
export function isHttpUrl(path: string): boolean {
    const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
    return reg.test(path);
}

// 英文字符 验证
export function isPascalCase(str: string): boolean {
    const regex = /^[A-Z][A-Za-z]*$/;
    return regex.test(str);
}
// 密码验证
export function verifyPassword(val: string): boolean {
    if (
        !/^[a-zA-Z0-9,./!@#$%^&*()_+=\-;':"[\]{}\\|]{6,16}$/.test(
            val
        )
    )
        return false;
    else return true;
}
// 邮箱验证
export function verifyEmail(val: string) {
    if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            val
        )
    )
        return false;
    else return true;
}
// 图片验证码验证
export function verifyCaptcha(val: string) {
    if (!/^[0-9a-zA-Z]{4}$/.test(val))
        return false;
    else return true;
}
// 提款密码验证
export function verifyWithdrawPwd(val: string) {
    if (!/^[0-9a-zA-Z]{6,16}$/.test(val))
        return false;
    else return true;
}
// 手机验证码验证
export function verifyPhoneCaptcha(val: string) {
    if (!/^[0-9]{5}$/.test(val))
        return false;
    else return true;
}