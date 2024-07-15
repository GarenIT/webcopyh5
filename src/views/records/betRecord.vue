<!-- 投注记录 -->
<template>
    <div class="page_record page_bet_record">

        <!-- 搜索 -->
        <div class="search_box">
            <div class="search_item search_item_mini">
                <SelectItem :key="1" @change="changePlatform" :active="params.platform_id" :options="optionsPlat" />
            </div>
            <div class="search_item search_item_mini">
                <SelectItem :key="2" @change="changeGametype" :active="params.game_type" :options="optionsGame" />
            </div>
            <div class="search_item search_item_mini">
                <SelectItem :key="3" @change="changeTime" :active="params.time" :options="timeOptoions" />
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
import { useI18n } from "vue-i18n";
import { Net } from "@/net/Net";
import { NetPacket } from "@/netBase/NetPacket";
import { MessageEvent2 } from "@/net/MessageEvent2";
import { NetMsgType } from "@/netBase/NetMsgType";
import { convertObjectToDateString } from "@/utils/publicMethods";
import SelectItem from "./common/SelectItem.vue"
import { timeOptoions, getTimeObj } from "./common/timeData.ts"
import { PlatformValueMap } from "@/enums/walletEnum"

const { t } = useI18n();
const tableHeader = computed(() => {
    return [ // 表头
        { title: t('betRecord_page_platform'), key: 'platform_id', size: 'm' },
        { title: t('betRecord_page_game'), key: 'game_type', size: 'm' },
        { title: t('betRecord_page_betAmount'), key: 'bet_total', size: 'm' },
        { title: t('betRecord_page_winLose'), key: 'net_value', size: 'm' },
        { title: t('betRecord_page_settlement'), key: 'balance_time', size: 'm' },
    ]
})

type OptionListType = { value: number, label: string }[];
const platformList = ref<OptionListType>([]);
const optionsPlat = computed(() => { // 平台
    const options = platformList.value
    options.unshift({ value: 0, label: t('promo_page_all') })
    return options
})
const platformHandle = (rs: any) => { // 平台数据处理
    platformList.value = rs.plat_rec_list.map((item: any) => {
        return { value: Number(item), label: PlatformValueMap[item] }
    })
    gameList.value = rs.gtype_rec_list.map((item: string) => {
        let key = item
        try {
            key = PlatformValueMap[item.split('_')[0]] + '_' + item.split('_')[1]
        } catch {

        }
        return { value: item, label: t(key) }
    })
}

const gameList = ref<OptionListType>([]);
const optionsGame = computed(() => { // 游戏
    const options = gameList.value
    options.unshift({ value: 0, label: t('promo_page_all') })
    return options
})

const params: any = reactive({ // 参数
    page: 1,
    platform_id: 0,
    game_type: 0,
    play_type: 0,
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
    result.total_page = rs.total_pages || 0
    result.list = result.list.concat(rs.bet_record_list || [])
}
// const wayMap: any = ref({})
const rowHandle = (row: any, key: string) => { // 格子数据处理
    let rs = ''
    let str = row.game_type.split('_')
    let val = row[key]

    switch (key) {
        case "platform_id":
            rs = str[0]
            break
        case "bet_total":
            rs = Math.abs(val).toLocaleString()
            break
        case "net_value":
            rs = `<span style="color:${Number(val) > 0 ? '#80FF44' : '#FF2424'}">${Number(val).toLocaleString()}</span>`
            break
        case "balance_time":
            rs = convertObjectToDateString(val)
            break
        default:
            rs = t(row.platform_id + '_' + str[1])
    }
    return rs
}

const changeTime = (date: any) => { // 切换时间
    params.time = date
    Object.assign(params, getTimeObj(date))
    resetData()
}

const changePlatform = (value: any) => { // 切换状态
    params.platform_id = value
    resetData()
}
const changeGametype = (value: any) => { // 切换状态
    params.game_type = value
    resetData()
}

const resetData = () => {
    result.total_page = 0
    result.list = []
    params.page = 1
    setTimeout(() => {
        queryData()
    }, 0)
}
const queryData = () => { // 查询
    const query = NetPacket.req_get_bet_record_list()
    Object.assign(query.start_time, params.start_time)
    Object.assign(query.end_time, params.end_time)
    query.page_num = params.page
    query.platform_id = params.platform_id
    query.game_type = params.game_type.toString()
    query.play_type = params.play_type
    loading.value = true
    Net.instance.sendRequest(query);
}

const getPlatformData = () => { // 获取平台数据
    const query = NetPacket.req_platform_gametype_list()
    Net.instance.sendRequest(query);
}
setTimeout(() => {
    getPlatformData()
}, 1200)

// 回执监听
MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_get_bet_record_list,
    resultHandle,
);
MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_platform_gametype_list,
    platformHandle,
);
onUnmounted(() => {
    // 取消监听
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_get_bet_record_list, null);
    MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_platform_gametype_list, null);
});
changeTime(1)

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