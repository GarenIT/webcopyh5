import { createApp } from 'vue'
import pinia from '@/store/index';
import { Page } from '@/store/page';
import App from './App.vue'
import router from './router';
import { i18n } from '@/languages';
import "@/assets/setEvent.ts"
import "@/assets/resetStyle.scss"
import '@/styles/index.scss'
import '@nutui/nutui/dist/packages/notify/style/css';
import '@nutui/nutui/dist/packages/toast/style/css';
import '@nutui/nutui/dist/packages/dialog/style/css';
import shrinkOnClick from '@/directives/shrinkOnClick';
import { Local } from './utils/storage';


const getSetting = async () => {
    const settingsRes = await fetch('/settings.json?' + new Date().getTime())
    const settings = await settingsRes.json()
    const adminI18nRes = await fetch(settings.admin_i18n_add_url)
    const adminI18n = await adminI18nRes.json()
    i18n.global.mergeLocaleMessage('zh-CN', adminI18n.zh)
    i18n.global.mergeLocaleMessage('vi-VN', adminI18n.vn)
    i18n.global.mergeLocaleMessage('en-US', adminI18n.en)
    await Page(pinia).setAdminI18n(adminI18n)
    await Page(pinia).setSettings(settings)
    if (Local.get('lang')) {
        i18n.global.locale.value = Local.get('lang')
        await Page(pinia).setLang(Local.get('lang'))
    } else {
        i18n.global.locale.value = navigator.language
        await Page(pinia).setLang(navigator.language)
    }
    return {
        settings,
    }
}
await getSetting()

const app = createApp(App);

app.directive('shrink-on-click', shrinkOnClick);
app.use(pinia).use(i18n).use(router).mount('#app');
