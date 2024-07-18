<template>
    <div class="home">
        <!-- 需要的图片在public/imgs/home 下
    轮播图和跑马灯数据在 page存储仓库中
    不可使用框架以外的插件。 -->
        <!-- 
    1.图片：余额背景图、两个图标没找到（刷新余额的icon在iconpark里也找不到合适的）
    2.翻译：grid、grid下拉 翻译
    3.小问题：nut-tabs设置全局样式问题（resetStyles）写死并加了important，做法不太对。 导致其他地方用该组件的时候样式修改冗余
    4.图片修改：游戏的背景图不应该带文字，因为要动态翻译
        图片修改：tabp1-6.webp图片画布大小应该和前面的保持一致
    -->
        <div class="top flex space_between a_i_center">
            <div class="logo"></div>
            <div class="right_box flex_center">
                <div v-if="!hasLogin" class="log_btn m_r_5 common_btn" @click="toLogin">{{ $t('home_page_login') }}
                </div>
                <div v-if="!hasLogin" class="sign_btn m_r_5 common_btn" @click="toReg">{{ $t('home_page_signUp') }}
                </div>
                <div v-if="hasLogin" class="balance m_r_10 flex_center">
                    <img class="balance_coin" src="/imgs/home/currency.webp">
                    <span class="p_5">{{ gameMoney }}</span>
                    <iconpark-icon name="wallrticontongy01" :class="refreshFlag && 'refresh'" size="24"
                        @click="refresh" />
                </div>
                <nut-popover custom-class="lang_setlector" v-model:visible="state.showPopover" bg-color="transparent"
                    duration="0.1" location="bottom-end" :show-arrow="false">
                    <template #reference>
                        <img class="lang m_t_2" :src="state.selectedLang.flag">
                    </template>
                    <template #content>
                        <div class="lang_dropdown p_5 bd_r_12">
                            <div v-for="(item, i) in state.langList" :key="item.id" @click="changeLang(item)">
                                <div class="lang_item flex_center p_5">
                                    <img class="flag" :src="item.flag">
                                    <div class="lang_type f_s_18 m_l_10">{{ item.type }}</div>
                                </div>
                                <div class="drop_item_line" v-if="i < state.langList.length - 1"></div>
                            </div>
                        </div>
                    </template>
                </nut-popover>
            </div>
        </div>
        <div class="section">
            <!-- 轮播 -->
            <div class="swiper_notice bd_r_12">
                <nut-swiper :auto-play="3000">
                    <nut-swiper-item v-for="(item, index) in bannerArr" :key="index" style="height: 141px">
                        <img :src="$t(item)" alt="" style="height: 100%; width: 100%" draggable="false" />
                    </nut-swiper-item>
                </nut-swiper>
                <div class="noticebox" v-if="showNoticebar && state.text">
                    <nut-noticebar @across-end="loopNotice()" class-name="noticebar" scrollable direction="across"
                        background="rgba(0, 0, 0, 0.2)" color="#fff" :speed="100" :stand-time="0">
                        <template #left-icon>
                            <iconpark-icon class="noticeicon" name="tongzhiiconlind" size="1rem"></iconpark-icon>
                        </template>
                        <template #default>
                            <div class="notice_text">{{ $t(state.text) }}</div>
                        </template>

                    </nut-noticebar>
                </div>
            </div>
            <!-- grid -->
            <div class="grid space_around m_t_4">
                <template v-for="(item, i) in state.gridList">
                    <nut-popover v-if="i == 0" custom-class="grid_setlector" v-model:visible="state.showPopover1"
                        bg-color="transparent" duration="0.1" location="bottom" :show-arrow="false" :offset="[56, -5]">
                        <template #reference>
                            <div class="home_grid column_center" @click="gridItemClick(item, i)">
                                <img class="home_grid_pic" :src="item.pic">
                                <div class="text">{{ $t(item.text) }}</div>
                            </div>
                        </template>
                        <template #content>
                            <div class="grid_dropdown bd_r_12">
                                <div v-for="(item, j) in state.gridList[i].selectList" :key="j" @click="">
                                    <div class="grid_item flex a_i_center p_5" @click="goToLink1(item, i)">
                                        <iconpark-icon size="2rem" :name="item.icon"></iconpark-icon>
                                        <div class="grid_type f_s_14 m_l_10">{{ $t(item.text) }}</div>
                                    </div>
                                    <div class="drop_item_line"></div>
                                </div>
                            </div>
                        </template>
                    </nut-popover>
                    <nut-popover v-else-if="i == 1" custom-class="grid_setlector" v-model:visible="state.showPopover2"
                        bg-color="transparent" duration="0.1" location="bottom" :show-arrow="false" :offset="[56, -5]">
                        <template #reference>
                            <div class="home_grid column_center" @click="gridItemClick(item, i)">
                                <img class="home_grid_pic" :src="item.pic">
                                <div class="text">{{ $t(item.text) }}</div>
                            </div>
                        </template>
                        <template #content>
                            <div class="grid_dropdown bd_r_12">
                                <div v-for="(item, j) in state.gridList[i].selectList" :key="j" @click="">
                                    <div class="grid_item flex a_i_center p_5" @click="goToLink2(item, i)">
                                        <iconpark-icon size="2rem" :name="item.icon"></iconpark-icon>
                                        <div class="grid_type f_s_14 m_l_10">{{ $t(item.text) }}</div>
                                    </div>
                                    <div class="drop_item_line"></div>
                                </div>
                            </div>
                        </template>
                    </nut-popover>
                    <div v-else class="home_grid column_center" @click="gridItemClick(item, i)">
                        <img class="home_grid_pic" :src="item.pic">
                        <div class="text">{{ $t(item.text) }}</div>
                    </div>
                </template>
            </div>
            <!-- 分享弹窗 -->
            <shareModal v-model:visible="visible"></shareModal>
            <!-- 游戏tabs -->
            <scroll-view class="game_tabs m_t_10">
                <nut-tabs v-model="state.tabsIndex" direction="vertical" style="height:700px">
                    <template #titles>
                        <div class="title_box">
                            <div v-for="(item, i) in state.gamesTypeList" :key="item.type" class="game_tabs_item m_b_10"
                                :class="state.tabsIndex == i ? 'active' : ''" @click="state.tabsIndex = i">
                                <div class="item_pic flex_bottom f_s_12" :class="{ active: state.tabsIndex == i }"
                                    :style="'background-image: url(/imgs/home/' + (state.tabsIndex == i ? item.text : (item.text + '-1')) + '.png)'">
                                </div>
                                <div class="custom-title p_3 flex_bottom" :class="{ active: state.tabsIndex == i }"> {{
                                    item.name }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <nut-tab-pane v-for="(item, i) in state.gamesTypeList" :key="item.type" :pane-key="i">
                        <div class="game_list flex_wrap space_between">
                            <div class="game_item p_5" v-for="(it, j) in item.gameList" :key="j" :class="item.type"
                                @click="toGameSublist(it)">
                                <div class="game_item_bg"
                                    :style="'background-image: url(/imgs/home/tabpp' + (i + 1) + '-' + (j + 1) + '.png)'">
                                    <div class="game_logo"
                                        :style="'background-image: url(/imgs/home/tabp' + (i + 1) + '-' + (j + 1) + '.webp)'">
                                        <!-- <div class="game_name">{{ $t(it.name) }}</div> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nut-tab-pane>
                </nut-tabs>
            </scroll-view>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, computed } from 'vue'
import { User } from '@/store/user';
import { Page } from '@/store/page';
import pinia from '@/store/index';
import { storeToRefs } from 'pinia';
import { i18n } from '@/languages';
import { Local } from '@/utils/storage';
import { useRouter } from 'vue-router'
import shareModal from '@/views/me/components/shareModal.vue'
import useWalletInfo from "@/views/myWallet/useWalletInfo.ts";
const { bannerArr, textAnnouncement, serviceUrlObj } = storeToRefs(Page(pinia));
import { handleOpenLink } from '@/utils/publicMethods'
const router = useRouter()
const store = User(pinia);
const {
    refreshWallet,
    gameMoney,
    refreshFlag,
} = useWalletInfo()


const refresh = () => {
    refreshWallet()
}

const { hasLogin }: any = storeToRefs(store);

const state: any = reactive({
    showPopover: false,
    showPopover1: false,
    showPopover2: false,
    selectedLang: {},
    langList: [
        {
            id: 1,
            flag: '/imgs/home/zh-CN.png',
            type: 'CN',
            value: 'zh-CN'
        },
        {
            id: 2,
            flag: '/imgs/home/vi-VN.png',
            type: 'VN',
            value: 'vi-VN'
        },
        {
            id: 3,
            flag: '/imgs/home/en-US.png',
            type: 'EN',
            value: 'en-US'
        },
    ],
    text: '',
    currentNo: 0,
    gridList: [
        {
            pic: '/imgs/home/grid1.webp',
            text: 'Community',
            selectList: [
                {
                    icon: 'iconcommunity01',
                    text: 'Facebook',
                    url: 'https://www.facebook.com/'
                },
                {
                    icon: 'iconcommunity01',
                    text: 'Facebook群组',
                    url: 'https://www.facebook.com/'
                },
                {
                    icon: 'iconcommunity02',
                    text: 'Telegram频道',
                    url: 'https://t.me/BY88CLUB88'
                },
                {
                    icon: 'iconcommunity03',
                    text: 'Youtobe频道',
                    url: 'https://www.facebook.com/'
                },
            ],
        },
        {
            pic: '/imgs/home/grid2.webp',
            text: 'home_page_onlineService',
            selectList: [
                {
                    icon: 'iconcommunity04',
                    text: 'messenger',
                    url: 'service_message_url'
                },
                {
                    icon: 'iconcommunity02',
                    text: 'telegram',
                    url: 'service_tg_url'
                },
            ],
        },
        {
            pic: '/imgs/home/grid3.webp',
            text: '邮箱信息',
        },
        {
            pic: '/imgs/home/grid4.webp',
            text: '应用程序',
        },
    ],
    gamesTypeList: [
        {
            pic: '/imgs/home/tab1-1.png',
            activePic: '/imgs/home/tab1.png',
            type: 'Hot',
            name: '热门',
            text: 'tab1',
            gameList: [
                {
                    id: '',
                    name: '4_32'
                },
                {
                    name: '_12'
                },
                {
                    name: '4_49'
                },

                {
                    name: '6_22041'
                },
                {
                    name: '_9'
                },
                {
                    name: '_17'
                },
            ]
        },
        {
            pic: '',
            type: 'Slot',
            name: '电子',
            text: 'tab2',
            gameList: [
                {
                    id: '',
                    name: 'PG'
                },
                {
                    name: 'JILI'
                },
                {
                    name: 'FC'
                },

                {
                    name: 'JDB'
                },
                {
                    name: 'TP'
                },
                {
                    name: 'PP'
                },

                {
                    name: 'CQ9'
                },
                {
                    name: 'MG'
                },
                {
                    name: 'BNG'
                },
                {
                    name: 'KA电子'
                },
                {
                    name: 'PT'
                },
                {
                    name: 'R88'
                },

            ]
        },
        {
            pic: '',
            type: 'Live',
            name: '视讯',
            text: 'tab3',
            gameList: [
                {
                    id: '',
                    name: '4_32'
                },
                {
                    name: '_12'
                },
                {
                    name: '4_49'
                },

                {
                    name: '6_22041'
                },
                {
                    name: '_9'
                },
                {
                    name: '_17'
                },
                {
                    name: '_17'
                },
                {
                    name: '_17'
                },
            ]
        },
        {
            pic: '',
            type: 'Fishing',
            name: '捕鱼',
            text: 'tab4',
            gameList: [
                {
                    id: '',
                    name: '4_32'
                },
                {
                    name: '_12'
                },
                {
                    name: '4_49'
                },

                {
                    name: '6_22041'
                },
                {
                    name: '_9'
                },
                {
                    name: '_17'
                },
                {
                    name: '_17'
                },
                {
                    name: '_17'
                },
            ]
        },
        {
            pic: '',
            type: 'Sport',
            name: '体育',
            text: 'tab5',
            gameList: [
                {
                    id: '',
                    name: '4_32'
                },
                {
                    name: '_12'
                },
                {
                    name: '4_49'
                },

                {
                    name: '6_22041'
                },
                {
                    name: '_9'
                },
            ]
        },
        {
            pic: '',
            type: 'Poker',
            name: '扑克',
            text: 'tab6',
            gameList: [
                {
                    bg: '',
                    name: ''
                },
                {
                    bg: '',
                    name: ''
                },
                {
                    bg: '',
                    name: ''
                },
                {
                    bg: '',
                    name: ''
                },
                {
                    bg: '',
                    name: ''
                },
                {
                    bg: '',
                    name: ''
                },
            ]
        },
        {
            pic: '',
            type: 'lottery',
            name: '彩票',
            text: 'tab7',
            gameList: [
                {
                    bg: '',
                    name: ''
                },
                {
                    bg: '',
                    name: ''
                },
                {
                    bg: '',
                    name: ''
                },
            ]
        },
    ],
    tabsIndex: 0
})
const showNoticebar = ref(true)
const visible = ref(false)


onMounted(async () => {
    initLangSelect()
    initNotice()
})
// 登录注册跳转
const toLogin = async () => {
    if (!hasLogin.value) {
        await store.setLogin(true)
    }
}
const toReg = async () => {
    await store.setReg(true)
}
// 语言选择器
const initLangSelect = () => {
    let lang = Local.get('lang') ? Local.get('lang') : navigator.language ? navigator.language : 'zh-CN'
    state.langList.map((item: any) => {
        if (item.value === lang) state.selectedLang = item
    })
}
const changeLang = async (v: any) => {
    if (v.value) {
        state.selectedLang = v
        state.show = false
        i18n.global.locale.value = v.value
        Local.set('lang', v.value);
        await Page(pinia).setLang(v.value)
        state.showPopover = false
    }

}
// 通知跑马灯
const initNotice = () => {
    state.currentNo = 0
    state.text = textAnnouncement.value[0]
}
const loopNotice = () => {
    showNoticebar.value = false
    if (state.currentNo < textAnnouncement.value.length - 1) {
        state.currentNo++
    } else {
        state.currentNo = 0
    }
    setTimeout(() => {
        showNoticebar.value = true
        state.text = textAnnouncement.value[state.currentNo]
    }, 1000)
}
// grid
const gridItemClick = (item: any, i: number) => {
    switch (i) {
        case 2:  // 邮箱
            router.push('/email')
            break;
        case 3:  // 应用程序
            visible.value = true
            break;
        default:
            break;
    }
}
const goToLink1 = (item: any, i: number) => {
    handleOpenLink(item.url)
}
const goToLink2 = (item: any, i: number) => {
    switch (item.text) {
        case 'messenger':  // 
            handleOpenLink(serviceUrlObj.value[item.url])
            break;
        case 'telegram':  //
            handleOpenLink(serviceUrlObj.value[item.url])
            break;
        default:
            break;
    }
}
// 游戏tabs
const toGameSublist = (item: any) => {
    router.push({
        path: 'gameSublist',
        query: {
            name: item.name
        }
    })
}

</script>

<style lang="scss" scoped>
.top {
    color: #fff;
    width: 375px;
    height: 50px;
    margin: 0 0 10px;
    padding: 0 13px 0 16px;
    background-image: url("/imgs/home/top.webp");
    background-size: cover;

    .logo {
        width: 113px;
        height: 32px;
        background-image: url("/imgs/home/logo.png");
        background-size: 100% 100%;
    }

    .right_box {
        .balance {
            height: 26px;
            border-radius: 90px;
            border: 0.5px solid #666;
            background-image: linear-gradient(to bottom, #2D1F54 0%, #3B2081 100%);
            border-image-slice: 1;
            background-origin: border-box;

            .balance_coin {
                width: 26px;
                height: 26px;
            }

            // 刷新按钮
            .refresh {
                animation: refresh 1s linear infinite;
            }

            @keyframes refresh {
                0% {
                    transform: rotate(0deg);
                }

                100% {
                    transform: rotate(360deg);
                }
            }
        }

        .log_btn,
        .sign_btn {
            width: 62px;
            height: 31px;
            line-height: 31px;
            background-image: url("/imgs/home/btn_bg.webp");
            background-size: 100% 100%;
        }

        .log_btn {
            background-image: url("/imgs/home/btn_bg1.webp");
        }

        .lang {
            width: 28px;
            height: 28px;
        }

    }
}

.lang_dropdown {
    color: #fff;
    background-color: rgba(46, 31, 96, 0.7);

    .lang_item {
        .flag {
            width: 28px;
            height: 28px;
        }
    }

    .drop_item_line {
        opacity: 0.5;
        border: none;
        width: 100%;
        height: 2px;
        background-image: linear-gradient(to right, rgba(172, 177, 186, 0) 0%, #c8ccd2 50%, rgba(144, 149, 156, 0) 100%);
    }
}

.section {
    padding: 0 10px 0;

    .swiper_notice {
        overflow: hidden;
        position: relative;
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);

        .noticebox {
            height: 24px;
            position: absolute;
            bottom: 0;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.5);

            .noticeicon {
                padding-left: 0;
            }

            .notice_text {
                padding-left: 90vw;
            }
        }
    }

    .grid {
        .home_grid {
            .home_grid_pic {
                width: 40px;
                height: 40px;
            }

            .text {
                color: #fff;
            }
        }
    }
}

.grid_dropdown {
    width: 222PX;
    color: #fff;
    padding: 20px 20px 33px;
    background: transparent;
    background-image: url("/imgs/home/dropdown_bg.webp");
    background-size: 100% 100%;

    .grid_item {
        padding: 10px;
        color: #93b4ff;

        .pic {
            width: 28px;
            height: 28px;
        }
    }

    .drop_item_line {
        opacity: 0.5;
        border: none;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(to right, rgba(172, 177, 186, 0) 0%, #c8ccd2 50%, rgba(144, 149, 156, 0) 100%);
    }
}

.game_tabs {
    height: 66vh;

    :deep(.nut-tabs) {
        .nut-tabs__titles {
            background-image: none !important;
            background: none !important;
            box-shadow: unset !important;
            border: none !important;
            padding: unset !important;
            width: 62px;
        }
    }

    .game_tabs_item {
        position: relative;
        width: 52px;
        height: 50px;
        border-radius: 10px;
        box-shadow: inset 0 -0.9px 0 0 #4f38b7;
        background-image: radial-gradient(circle at 50% 13%, #4c36b3 0%, #3a2786 66%, #3c279a 88%);

        .item_pic {
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            position: absolute;

            &.active {
                animation: float-animation 1s infinite;
            }
        }

        .custom-title {
            height: 100%;
            color: #fff;
        }
    }

    .game_tabs_item.active {
        background-image: url("/imgs/home/tabActive.webp");
        background-size: 100% 100%;
    }

    @keyframes float-animation {

        0%,
        100% {
            transform: translateY(0);
        }

        50% {
            transform: translateY(-6px);
        }
    }

    .game_list {
        .game_item {
            background-image: url("/imgs/home/list-item-bg.webp");
            background-size: 100% 100%;
            width: 142px;
            height: 91px;

            .game_logo {
                width: 142px;
            }

            &:nth-child(n+3) {
                margin-top: 9px;
            }

            &.Sport,
            &.lottery {
                &:nth-child(2) {
                    margin-top: 9px;
                }
            }

            &.Sport {
                &:nth-child(1) {
                    width: 100%;
                    border-radius: 10px;
                    background-position: 50% 50%;
                    background-size: cover;
                }
            }

            &.lottery {
                width: 100%;
                border-radius: 10px;
                background-position: 50% 50%;
                background-size: cover;
            }

            .game_item_bg,
            .game_logo {
                width: 100%;
                height: 100%;
                background-size: cover;
            }

            .game_name {
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                width: 68px;
                text-align: center;
            }
        }
    }
}
</style>
