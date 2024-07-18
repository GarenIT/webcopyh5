<template>
    <!-- 查询按钮图片找一下 -->
    <div class="game_sublist">
        <div class="head">
            <nut-navbar class="navbar" z-index="5" :clickable="false">
                <template #content>
                    <!-- <span>{{ state.name }}</span> -->
                </template>
                <template #left>
                    <iconpark-icon @click="$router.go(-1)" class="close" icon-id="tongyicontyfanh"
                        size="2.4rem"></iconpark-icon>
                    <span class="m_l_10">{{ state.name }}</span>
                </template>
                <template #right>
                    <div class="right-handler"> 携带金额：{{ 100000 }} </div>
                </template>
            </nut-navbar>

        </div>
        <div class="section">
            <div class="type_list flex_start a_i_center">
                <div class="game_type flex_center m_r_10" v-for="(item, i) in state.gameList"
                    :class="{ active: state.tabsIndex == i }" @click="changeTabs(item, i)">{{ item.name }}</div>
            </div>
            <div class="game_search m_t_10 space_between ">
                <div class="search_box">
                    <nut-input v-model="params.search_name" :placeholder="$t('在这里搜索游戏名称...')" @change="handleChange()">
                        <template #left>
                            <iconpark-icon icon-id="majesticonssearch-line" size="1.2rem"
                                class="refresh"></iconpark-icon>
                        </template>
                    </nut-input>
                </div>
                <div class="search_btn common_btn" @click="search()">{{ $t('查询') }}
                </div>
            </div>
            <!-- 列表 -->
            <div class="game_list m_t_10">
                <!-- <nut-grid :border="false">
                    <nut-grid-item v-for="i in 4" :key="i">
                        <nut-avatar size="large">
                            <img
                                src="https://img12.360buyimg.com/imagetools/jfs/t1/143702/31/16654/116794/5fc6f541Edebf8a57/4138097748889987.png" />
                        </nut-avatar>
                    </nut-grid-item>
                </nut-grid> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();


const state: any = reactive({
    name: null,
    tabsIndex: 0,
    gameList: [
        {
            id: 1,
            name: '电子',
        },
        {
            id: 2,
            name: '棋牌',
        },
        {
            id: 3,
            name: '收藏',
        },

    ]
})
const params: any = reactive({ // 搜索参数
    search_name: "",
})
onMounted(async () => {
    state.name = route.query.name

});

const changeTabs = (item: any, i: any) => {
    state.tabsIndex = i
}

// 搜索
const search = () => {
    // 
}
const handleChange = () => {
    search()
}

</script>

<style lang="scss" scoped>
.section {
    padding: 0 10px 0;
    color: #8e82c2;

    .type_list {
        height: 48px;

        .game_type {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            box-shadow: inset 0 -0.9px 0 0 #4f38b7;
            background-image: radial-gradient(circle at 50% 13%, #4c36b3 0%, #3a2786 66%, #3c279a 88%);

            &.active {
                background-image: url("/imgs/home/tabActive.webp");
                background-size: 100% 100%;
                color: #fff;
                width: 46px;
                height: 46px;
            }


        }
    }

    .game_search {
        .search_box {
            height: 36px;
            width: 245px;
            background: #27155C;
            border-radius: 8px;
            display: flex;
            align-items: center;
            padding: 2px 5px;
            box-sizing: border-box;
            position: relative;
            box-shadow: 0px 4px 4px 0px #00000040 inset;

            &:deep(.nut-input) {
                height: 36px;
                border-bottom: unset;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: unset;

                .nut-input-value {
                    height: 36px;
                }

                .input-text {
                    height: 36px;
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

        .search_btn {
            width: 100px;
            height: 35px;
            font-size: 16px;
            font-weight: 500;
            color: #fff;
            background-image: url("/imgs/home/btn_bg.webp");
            background-size: 100% 100%;
        }
    }
}

:deep() {
    .nut-navbar {
        margin-top: 10px !important;

        .nut-navbar__left,
        .right-handler {
            color: #fff;
        }
    }
}
</style>