<!-- 取款记录 -->
<template>
    <div class="page_record page_withdraw_record">

        <!-- 搜索 -->
        <div class="search_box">
            <div class="search_item">
                <SelectItem :key="1" @change="changeStatus" :active="params.status" :options="optionsStatus" />
            </div>
            <div class="search_item">

                <SelectItem :key="2" @change="changeTime" :active="params.time" :options="timeOptoions" />
            </div>
        </div>

        <!-- 表格 -->
        <div class="table">
            <div class="th">
                <template v-for="(item, i) in tableHeader" :key="i">
                    <div class="line" v-if="i != 0"></div>
                    <div class="td" :class="'td-' + item.size">{{ item.title }}</div>
                </template>
            </div>
            <scroll-view :pullup="pullup" :pulldown="pulldown" class="main_content">
                <div class="tr" v-for="(row, index) in result.list" :key="index">
                    <template v-for="item in tableHeader" :key="item.key">
                        <div class="line"></div>
                        <div class="td" :class="'td-' + item.size" v-html="rowHandle(row, item.key)"></div>
                    </template>
                </div>
                <nut-empty v-if="!loading && !result.list.length" :description="t('nomore_data')"></nut-empty>
            </scroll-view>
        </div>
    </div>
</template>

<script setup lang='ts'>
import ScrollView from '@/components/ScrollView.vue'
import { ref, computed, reactive, onUnmounted } from "vue"
import { WithdrawStatusMap, WithdrawStatusColorMap } from "@/enums/walletEnum"
import { useI18n } from "vue-i18n";
import { Net } from "@/net/Net";
import { NetPacket } from "@/netBase/NetPacket";
import { MessageEvent2 } from "@/net/MessageEvent2";
import { NetMsgType } from "@/netBase/NetMsgType";
import { convertObjectToDateString } from "@/utils/publicMethods";
import SelectItem from "./common/SelectItem.vue"
import { timeOptoions, getTimeObj } from "./common/timeData.ts"

const { t } = useI18n();
const tableHeader = computed(() => {
    return [ // 表头
        { title: t('rechargeRecord_page_method'), key: 'way_id', size: 'm' },
        { title: t('accountsRecord_page_hb'), key: 'currency', size: 'm' },
        { title: t('withdrawRecord_page_wAmount'), key: 'pay_money', size: 's' },
        { title: t('auditRecord_page_state'), key: 'order_status', size: 's' },
        { title: t('auditRecord_page_startTime'), key: 'pay_time', size: 'm' },
    ]
})


const optionsStatus = computed(() => { // 状态
    const options = Object.keys(WithdrawStatusMap).map((key: string) => {
        return {
            label: WithdrawStatusMap[key],
            value: Number(key)
        }
    })
    options.unshift({ value: 9, label: t('rechargeRecord_page_allState') })
    return options
})

const params: any = reactive({ // 参数
    page: 1,
    status: 9,
    currency: 0,
    time: 1
})
const result: any = reactive({ // 结果
    total_page: 0,
    list: []
})



const loading = ref(false)
const resultHandle = (rs: any) => { // 数据处理
    setTimeout(() => {
        loading.value = false
    }, 300)
    result.total_page = rs.total_page || 0
    result.list = result.list.concat(rs.withdraw_record_list)
}
// const wayMap: any = ref({})
const rowHandle = (row: any, key: string) => { // 格子数据处理
    let rs = ''
    let val = row[key]
    switch (key) {
        // way_id是2，那就是usdt, 其他都是银行卡
        case "way_id":
            rs = val == 2 ? 'USDT' : t('api_bankcard_0')
            break
        // way_id来判断，2就是usdt,其他暂时是越南盾
        case "currency":
            rs = row['way_id'] == 2 ? 'USDT' : t('accountsRecord_page_dong')
            break
        case "pay_money":
            rs = Number(val).toLocaleString()
            break
        case "order_status":
            rs = `<span style="color:${WithdrawStatusColorMap[val]}">${WithdrawStatusMap[val]}</span>`
            break
        case "pay_time":
            rs = convertObjectToDateString(val)
            break
        default:
            rs = val
    }
    return rs
}

const changeTime = (date: any) => { // 切换时间
    params.time = date
    Object.assign(params, getTimeObj(date))
    resetData()
}
// const pageChange = (page: number) => { // 切换页码
//     params.page = page
//     queryData()
// }
const changeStatus = (value: any) => { // 切换状态
    params.status = value
    resetData()
}
// const currencyChange = (value: string) => { // 切换货币
//     params.currency = value
//     queryData()
// }
const resetData = () => {
    result.total_page = 0
    result.list = []
    params.page = 1
    setTimeout(() => {
        queryData()
    }, 0)
}
const queryData = () => { // 查询
    const query = NetPacket.req_get_recharge_record_list()
    Object.assign(query.start_time, params.start_time)
    Object.assign(query.end_time, params.end_time)
    query.page = params.page
    query.status = params.status
    query.currency = params.currency
    loading.value = true
    Net.instance.sendRequest(query);
}

// 回执监听
MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_get_withdraw_record_list,
    resultHandle,
);

changeTime(1)
onUnmounted(() => {
    // 取消监听
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_get_withdraw_record_list, null);
});

// 加载更多
const pullup = () => {
    if (loading.value) return
    if (result.total_page <= result.list.length) return // 没有了
    params.page++
    queryData()
}
// 刷新数据
const pulldown = () => {
    if (loading.value) return
    resetData()
}
</script>

<style lang="scss" scopd>
@import "./common/records.scss";
</style>