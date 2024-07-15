import { defineStore } from 'pinia';

import { Locale } from '@nutui/nutui';
import enUS from '@nutui/nutui/dist/packages/locale/lang/en-US';
import zhCh from '@nutui/nutui/dist/packages/locale/lang/zh-CN';
import viVN from '@/languages/lang/nutui/vi-VN';

/**
 * 页面信息
 * @methods setUserInfos 设置用户信息
 */
interface PageState {
    menuActive: number
    countryOptions: any
    bannerArr: any
    textAnnouncement: any
    serviceUrlObj: any
    settings: any,
    activityList: any,
    activityTitleList: any
    adminI18n: any
    lang: string
}
export const Page = defineStore('pages', {

    state: (): PageState => ({
        menuActive: -1,
        countryOptions: null,
        bannerArr: [],
        textAnnouncement: [],
        serviceUrlObj: {},
        settings: null,
        activityList: null,
        activityTitleList: null,
        adminI18n: null,
        lang: navigator.language || 'zh-CN',
    }),
    actions: {
        async setBannerArr(arr: Array<string>) {
            this.bannerArr = arr
        },
        async setSettings(value: any) {
            this.settings = value
        },
        async setAdminI18n(value: any) {
            this.adminI18n = value
        },
        async setLang(value: any) {
            this.serviceUrlObj = null
            this.bannerArr = null
            this.textAnnouncement = null
            let langObj: any = {
                'en-US': enUS,
                'zh-CN': zhCh,
                'vi-VN': viVN
            }
            if (value) {
                this.lang = value
            }
            Locale.use(this.lang, langObj[this.lang]);
            let strs = this.lang.split('-')
            let str = strs[0]
            if (strs[0] == 'vi') {
                str = 'vn'
            }
            let keys = Object.keys(this.adminI18n[str])
            let bannerArr: Array<string> = []
            let textAnnouncement: Array<string> = []
            let serviceUrlObj: any = {}
            keys.map((e: string) => {
                if (e.indexOf('pc_admin_banner_list') != -1) {
                    bannerArr.push(e)
                }
                if (e.indexOf('system_notice_title') != -1) {
                    textAnnouncement.push(e)
                }
                if (e.indexOf('service_') != -1) {
                    serviceUrlObj[e] = this.adminI18n[str][e]
                }
            })
            this.serviceUrlObj = serviceUrlObj
            this.bannerArr = bannerArr
            this.textAnnouncement = textAnnouncement
        },
        async setActivityList(value: any) {
            let list: Array<string> = []


            let obj: any = {
                home_page_all: value
            }

            value.map((e: any) => {
                list.push(e.tag)
            })
            let newList = Array.from(new Set(list))

            newList.map((e: any) => {
                obj[e] = []
                value.map((j: any) => {
                    if (j.tag == e) {

                        obj[e].push(j)
                    }
                })
            })
            this.activityList = value
            this.activityTitleList = obj
            console.log(obj);

        },
        async setTextAnnouncement(arr: Array<string>) {
            this.textAnnouncement = arr
        },
        async setTextAnnouncementMore(str: string) {
            this.textAnnouncement.push(str)
            this.textAnnouncement.splice(0, 0)
        },
    }
});