import pinia from "@/store";
import { storeToRefs } from "pinia";
import { Page } from "@/store/page";

// 只有这些充值方式
export const bankPayMethods = [1, 2, 3, 4, 5, 6];
// 充值方式对应的名称
export const bankPayType = [
    { paymenttype: 1, payname: 'bankcard' },
    { paymenttype: 2, payname: 'momo' },
    { paymenttype: 3, payname: 'zalo' },
    { paymenttype: 4, payname: 'viettel' },
    { paymenttype: 5, payname: 'scratchcard' },
    { paymenttype: 6, payname: 'usdt' },
];

const { settings } = storeToRefs(Page(pinia));
// 玩家IP
export const IP = (): Promise<string> => {
    return new Promise(async (resolve) => {
        let fastCost = 99999;
        let fastIndex = 0;
        let _ip = "";
        let promises: Promise<{ cost: number; index: number; str: string }>[] = settings.value.GET_IP_LIST.map((url: any, index: any) => {
            return new Promise((resolve) => {
                let startTime = new Date().getTime();

                let xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.timeout = 5000;
                xhr.responseType = "text";

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            let endTime = new Date().getTime();
                            let cost = endTime - startTime;
                            let str: any = xhr.responseText;
                            // cc.log(请求:${url} 耗时:${cost}, index:${index}, str);
                            resolve({ cost, index, str });
                        } else {
                            // console.error("Error: xhr.status", xhr.status);
                            resolve({ cost: 9999999, index, str: '' }); // 如果出错，将 cost 设置为 Infinity
                        }
                    }
                };

                xhr.send();
            });
        });

        Promise.all(promises).then((results) => {
            results.forEach(({ cost, index, str }) => {
                if (cost < fastCost) {
                    fastCost = cost;
                    fastIndex = index;
                    _ip = str;
                }
            });
            let fastestUrl = settings.value.GET_IP_LIST[fastIndex];
            console.log(`最快IP: ${fastestUrl} 耗时: ${fastCost} IP: ${_ip}`);
            resolve(_ip);
        });
    });
}
export const sleep = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 打开外部链接
 * @param val 当前点击项菜单
 */
export const handleOpenLink = (url: string) => {
    let dom = document.createElement('a')
    dom.setAttribute('href', `${url}`)
    dom.setAttribute('target', '_blank')
    document.body.appendChild(dom)
    dom.click()
    document.body.removeChild(dom)
};

/**
 * 小数或整数(不可以负数)
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberIntegerAndFloat(val: string) {
    // 匹配空格
    let v = val.replace(/(^\s*)|(\s*$)/g, '');
    // 只能是数字和小数点，不能是其他输入
    v = v.replace(/[^\d.]/g, '');
    // 以0开始只能输入一个
    v = v.replace(/^0{2}$/g, '0');
    // 保证第一位只能是数字，不能是点
    v = v.replace(/^\./g, '');
    // 小数只能出现1位
    v = v.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // 小数点后面保留2位
    v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    // 返回结果
    return v;
}

/**
 * 金额用 `,` 区分开
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberComma(val: string) {
    // 调用小数或整数(不可以负数)方法
    let v: any = verifyNumberIntegerAndFloat(val);

    // 字符串转成数组
    v = v.toString().split('.');
    // \B 匹配非单词边界，两边都是单词字符或者两边都是非单词字符
    v[0] = v[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // 数组转字符串
    v = v.join('.');
    // 返回结果
    return v;
}
// 对象转时间显示 yyyy-MM-dd HH:mm:ss
export function convertObjectToDateString(obj: any): string {
    return `${obj.year}-${padZero(obj.month)}-${padZero(obj.day)} ${padZero(obj.hour)}:${padZero(obj.minute)}:${padZero(obj.second)}`
}
function padZero(n: number): string {
    if (n > 9) return n.toString()
    return '0' + n
}

/**
 * @description 复制
 * @param text
 * @returns
 */
export function copyFn(text: string) {
    var textarea: any = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
/**
 *  精确小数点，截取位数，不四舍五入
 *  l 小数点位数
 *  精度丢失问题
 * */
export const toFixedNumber = (value: any, l = 2) => {
    if (!value) {
        return `0.${''.padEnd(l, '0')}`;
    }
    const str = value.toString().split('.');
    const str1 = str[1] ? str[1].substr(0, l).padEnd(l, '0') : ''.padEnd(l, '0');
    return str[0] + '.' + str1;
}

/**
 * 将数字或字符串转换为以 "k" 为单位的格式
 * @param {number | string} input - 需要转换的数字或字符串
 * @returns {string} - 转换后的字符串，带有 "k" 单位
 */
export function formatNumber(input: number | string): string {
  // 将输入转换为浮点数
  let number = parseFloat(input.toString());

  // 如果输入不是有效数字，返回原输入
  if (isNaN(number)) {
    return input.toString();
  }

  // 如果数字小于 1000，直接返回该数字
  if (number < 1000) {
    return number.toString();
  }

  // 将数字转换为以 "k" 为单位的格式，并保留两位小数
  let formattedNumber = (number / 1000).toFixed(2) + 'k';
  return formattedNumber;
}
