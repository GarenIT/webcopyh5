<template>
  <!-- 代理合作 -->
  <div class="table-content">
    <div class="tab">
      <div :class="{ tab_ac: tab_id == 1 }" @click="tab_id = 1">{{ t("General Report") }}</div>
      <div :class="{ tab_ac: tab_id == 2 }" @click="tab_id = 2">{{ t("Direct Report") }}</div>
      <div :class="{ tab_ac: tab_id == 3 }" @click="tab_id = 3">{{ t("Team Report") }}</div>
    </div>
    <div class="form">
      <div class="form_one">
        <nut-menu class="form_date" :overlay="false">
          <template #icon>
            <iconpark-icon icon-id="dailiicon02" size="1.2rem" class="refresh"></iconpark-icon>
          </template>
          <nut-menu-item :title="dateText" ref="calendarItemRef">
            <nut-calendar-card v-model="date" type="range" @change="calendarChange"></nut-calendar-card>
          </nut-menu-item>
        </nut-menu>

        <Select v-model="dateRange" :options="dateRangeOptions"/>
      </div>

      <div class="form_two mt-5">
        <div class="form_date">
          <nut-input v-model="params.search_name" :placeholder="t('home_page_inputAccount')" @change="handleAccountChange">
            <template #left>
              <iconpark-icon icon-id="majesticonssearch-line" size="1.2rem" class="refresh"></iconpark-icon>
            </template>
          </nut-input>
        </div>
        <Select v-model="params.search_lev" :options="levels" @change="search"/>
      </div>

    </div>

    <div>
      <div class="level_info">
        <!--表头-->
        <div class="table_column">
          <div class="td" v-for="(item, i) in tableHeader" :key="i">
            <span>{{ item.title }}</span>
            <img src="/imgs/me/table_line.png" alt="">
          </div>
        </div>
        <!--数据-->
        <div class="tr" v-for="(row, index) in result.list" :key="index">
          <div class="td" :class="{ 'td_money': item.isMoney }" v-for="(item, i) in tableHeader" :key="i"
               @click="clickTd(row, item.key)" v-html="rowHandle(row, item.key)"></div>
        </div>
      </div>
    </div>
    <nut-empty v-if="!result.list.length" :description="t('nomore_data')"></nut-empty>
    <LevelManage v-model="visible" :currentUser="currentUser" :IdentityMap="IdentityMap"/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { MessageEvent2 } from "@/net/MessageEvent2.ts";
import { NetMsgType } from "@/netBase/NetMsgType.ts";
import { IdentityMap } from "@/enums/proxyEnum";
import Select from "./Select.vue"
import { NetPacket } from "@/netBase/NetPacket.ts";
import { Net } from "@/net/Net";
import { useI18n } from "vue-i18n";
import LevelManage from "./levelManage.vue";

onMounted(() => {
  search()
})

interface List {
  role_id: number
  level: number
  team_num: number
  personal_bet: number
  team_bet: number
  personal_return: number
  team_return: number
  username: string
}

const props = defineProps({
  proxyInfo: { // 当前代理详情
    type: Object,
    default: () => {
    }
  }
})
const {t} = useI18n();
const tab_id = ref(1)
const levelM = ref()
const tableHeader = computed(() => { // 表头
  return {
    1: [
      {title: "会员账号", key: 'username'},
      {title: "层级", key: 'level'},
      {title: "团队佣金", key: 'team_return', isNumber: true, isMoney: true},
      {title: "直属佣金", key: 'personal_return', isNumber: true, isMoney: true},
    ],
    2: [
      {title: "会员账号", key: 'username'},
      {title: "层级", key: 'level'},
      {title: "有效投注", key: 'personal_bet', isNumber: true, isMoney: true},
      {title: "直属佣金", key: 'personal_return', isNumber: true, isMoney: true},
    ],
    3: [
      {title: "会员账号", key: 'username'},
      {title: "层级", key: 'level'},
      {title: "团队投注", key: 'team_bet', isNumber: true, isMoney: true},
      {title: "团队佣金", key: 'team_return', isNumber: true, isMoney: true},
      {title: "人数", key: 'team_num', isNumber: true},
      {title: "操作", key: 'operate'},
    ],
  }[tab_id.value]
})
const result = reactive<{
  total_page: number
  list: List[]
}>({
  total_page: 0,
  list: []
})
const params: any = reactive({ // 搜索参数
  page: 1,
  search_name: "",
  search_lev: "0",
})
const levels = computed(() => {
  const arr = []
  Object.keys(IdentityMap).map((key: string) => {
    if ((props.proxyInfo.level || 0) > Number(key)) {
      arr.push({label: IdentityMap[key], value: key})
    }
  })
  arr.unshift({label: "全部", value: '0'})
  return arr
})
const visible = ref(false) // 弹窗是否显示
const currentUser = ref({}) //当前点击的用户

// 日期范围下拉
const dateRange = ref("today") // 日期范围值
const dateRangeOptions = ref(
    [ // 日期范围下拉列表
      {label: "今天", value: "today"},
      {label: "近3天", value: 3},
      {label: "本周", value: "week"},
      {label: "本月", value: "month"},
      {label: "近7天", value: 7},
      {label: "近15天", value: 15},
      {label: "近30天", value: 30},
    ]
)
// 日期
const date = ref<[Date, Date]>()
// 展示日期
const dateText = computed(() => {
  if (date.value?.length === 2) {
    return date.value![0].toLocaleDateString() + "-" + date.value![1].toLocaleDateString()
  }
  return ""
})

const calendarItemRef = ref<{ toggle: () => void } | null>(null)
// 日历选择change回调
const calendarChange = (value: Date[]) => {
  if (value.length === 2) calendarItemRef.value?.toggle()
}
// 获取日期范围
watch(dateRange, val => {
  console.log(getDateRange(val), "getDateRange(val)")
  date.value = getDateRange(val)
}, {immediate: true})
// 日期变化时获取数据
watch(date, val => {
  if (val?.length === 2) {
    search();
  }
})

// 获取日期范围
function getDateRange(option: string | number): [Date, Date] {
  const today = new Date();
  let startDate, endDate;

  switch (option) {
    case 'today':
      startDate = new Date(today);
      endDate = new Date(today);
      break;
    case 'week':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay() + 1); // assuming the week starts on Monday
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    default:
      if (typeof option === 'number') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - option + 1);
        endDate = new Date(today);
      } else {
        throw new Error('Invalid value');
      }
  }

  return [startDate, endDate];
}

// 账号change事件
const handleAccountChange = () => {
  search()
}

// 搜索
const search = () => {
  params.page = 1
  queryData()
}

function extractDateTime(dateObj: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    day: dateObj.getDate(),
    hour: dateObj.getHours(),
    minute: dateObj.getMinutes(),
    second: dateObj.getSeconds()
  };
}


// 查询
const queryData = () => {
  result.total_page = 0
  result.list = []
  const query = NetPacket.req_daily_return_his()
  Object.assign(query.start_time, extractDateTime(date.value![0]))
  Object.assign(query.end_time, extractDateTime(date.value![1]))
  query.page = params.page
  query.search_name = params.search_name
  query.search_lev = params.search_lev
  Net.instance.sendRequest(query);
}

// 数据处理
const resultHandle = (rs: any) => {
  console.log("=>(agentTable.vue:92) rs", rs, "----------------------------------");
  result.total_page = rs.total || 0
  result.list = rs.records || []
}

// 处理行数据
const rowHandle = (row: any, key: string) => { // 格子数据处理
  let rs: any = ''
  let val = row[key]
  switch (key) {
    case "level":
      rs = IdentityMap[val] || '--'
      break
    case "team_num":
    case "team_bet":
    case "personal_bet":
    case "personal_return":
    case "team_return":
      rs = Number(val).toLocaleString()
      break
    case "operate":
      rs = `<span  class="td_btn" style="color: #80FF44;cursor: pointer;user-select: none;">123</span>`
      break
    default:
      rs = val
  }
  return rs
}

const clickTd = (row: any, key: string) => { // td点击事件
  if (key === "username") {
    currentUser.value = row
    visible.value = true
  }
  if (key === 'operate') {
    levelM.value.openModal(row)
  }
}

// 回执监听
MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_daily_return_his,
    resultHandle,
);
onUnmounted(() => {
  // 取消监听
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_daily_return_his, null);
});
</script>

<style lang="scss" scoped>
.tab {
  margin-top: 16px;
  background: url(/imgs/email/nav_bar.webp) no-repeat center;
  background-size: 100% 100%;
  height: 45px;
  display: flex;
  align-items: center;
  padding: 0 4px;

  div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #C0C2DB;
  }

  .tab_ac {
    background: url(/imgs/email/email_btn.webp) center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #ffffff;
    height: 34px;
    // margin-top: 5px;
  }
}

.form {
  margin-top: 8px;

  .form_one,
  .form_two {
    display: flex;
    width: 100%;

    .form_date {
      height: 24px;
      width: 210px;
      background: #27155C;
      border-radius: 5px;
      display: flex;
      align-items: center;
      padding: 2px 5px;
      box-sizing: border-box;
      position: relative;
      box-shadow: 0px 4px 4px 0px #00000040 inset;

      .date_box {
        position: absolute;
        right: -105px;
        left: 5px;
        top: 30px;
        height: 100px;
        z-index: 100;
        border-radius: 12px;
        background: rgba(51, 29, 143, 0.9)
      }

      &:deep(.nut-input) {
        height: 24px;
        border-bottom: unset;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: unset;

        .nut-input-value {
          height: 24px;
        }

        .input-text {
          height: 24px;
        }
      }

      :deep() {
        input {
          &::placeholder {
            color: #8e82c2;
          }
        }
      }
    }
  }

  .form_one {
    :deep() {
      .nut-menu__bar {
        height: 24px;
        width: 210px;
        background: #27155C !important;
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 2px 13px;
        box-sizing: border-box;
        position: relative;
        box-shadow: 0px 4px 4px 0px #00000040 inset !important;

        .nut-menu__title-icon {
          position: absolute;
          left: 0;
          transform: rotate(0deg) !important;
        }
      }

      .nut-menu-item__content {
        max-height: 500px !important;
      }

    }
  }
}

.level_info {
  margin-top: 10px;
  border-radius: 8px;
  background: radial-gradient(87.04% 93.77% at 50% 13.97%, #4C36B3 0.17%, #3A2786 74.42%, #3C279A 100%);

  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);

  // background-color: #1f2032;
  .table_column {
    display: flex;

    div {
      height: 42px;
      line-height: 42px;
      flex: 1;
      // flex:1;
      text-align: center;
      color: #ffffff;
      font-size: 10px;
      font-weight: 900;
      position: relative;

      img {
        height: 42px;
        position: absolute;
        right: -1px;
        top: 0;
      }

      &:last-child {
        flex: 1;
        border-right: unset;

        img {
          display: none;
        }
      }
    }
  }
}

.tr {
  display: flex;

  &:nth-child(even) {
    background-image: radial-gradient(circle at 50% 11%, #361e79, #202137 97%);
    color: #87a1ce;
  }

  &:nth-child(odd) {
    background-color: #2f1d7d;
    color: #fff;
  }

  .td {
    flex: 1;
    padding: 4px 14px 4px 9px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
  }
}


.date_picker {
  width: 210px;
  background: #27155C;
  box-shadow: 0px 4px 4px 0px #00000040 inset;
  border-radius: 5px;
  padding-left: 5px;

  .refresh {
    transform: translateY(2px);
  }

  .dp__input_icon {
    left: 6px;
    display: flex;
    align-items: center;
    background: #27155C;
    box-shadow: 0px 4px 4px 0px #00000040 inset;
  }

  :deep() {
    input {
      width: 150px;
      height: 24px;
      border-radius: 5px;
      background: #27155C;
      box-shadow: 0px 4px 4px 0px #00000040 inset;
      border: none;
      color: #fff;
      margin-left: 25px;
      font-size: 12px;
      padding: 0 !important;
    }
  }
}

.nut-menu {
  width: 140px;
}

:deep() {
  .nut-popup {
    background: transparent;
  }

  .nut-calendarcard {
    background: radial-gradient(circle, rgba(59, 39, 153, .9), rgba(67, 47, 157, 1));
    color: #8e82c2;
    width: 220px;
  }

  svg {
    fill: #8e82c2;
  }

  .nut-calendarcard-day.active, .nut-calendarcard-day.start, .nut-calendarcard-day.end {
    background-color: #578ef5;
  }

  .nut-calendarcard-day.weekend {
    color: #578ef5;
  }

  .nut-calendarcard-day.mid {
    background-color: rgba(87, 142, 245, 0.2);
    color: #578ef5;
  }

  .date_range {
    .nut-popup {
      background: radial-gradient(circle, rgba(59, 39, 153, .6), rgba(67, 47, 157, .8));
    }

    .nut-menu-item__option {
      color: #8e82c2;
    }

    .active {
      color: #578ef5 !important;
    }
  }

  .nut-calendarcard-day.weekend {
    color: #fff !important;
  }

  .nut-calendarcard-day {
    width: 30px;
    height: 30px;
  }

  .nut-calendarcard-header-left, .nut-calendarcard-header-right {
    margin: 10px;
  }
}

:deep() {
  .dp__menu {
    border: none;
  }

  .dp__arrow_top {
    background-color: #422789;
    z-index: -1;
    border: none;
  }

  .dp__theme_light {
    --dp-background-color: radial-gradient(circle, rgba(86, 33, 126, 1) 0%, rgba(60, 41, 140, .9) 100%);
    --dp-text-color: #fefeff;
  }
}

</style>
