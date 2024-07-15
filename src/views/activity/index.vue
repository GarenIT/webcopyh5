<template>
    <div class="activity">
        <nut-tabs v-model="value" title-scroll title-gutter="10" v-if="activityTitleList">
            <nut-tab-pane :title="t(g)" :pane-key="i" v-for="(game, g, i) in activityTitleList" :key="g">
                <scroll-view class="main_content">

                    <img class="imgs" v-for="(v, i) in game" :key="i" :src="t(v.pic_link)" alt=""
                        @click="activityDetail(v)">

                </scroll-view>
            </nut-tab-pane>
        </nut-tabs>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import ScrollView from '@/components/ScrollView.vue'
import { useRouter } from 'vue-router';

import pinia from '@/store/index';
import { useI18n } from 'vue-i18n';

import { Page } from '@/store/page';
import { storeToRefs } from 'pinia';
import { NetPacket } from '@/netBase/NetPacket';
import { Net } from '@/net/Net';

import { MessageEvent2 } from '@/net/MessageEvent2';
import { NetMsgType } from '@/netBase/NetMsgType';

const { t } = useI18n();
const { activityTitleList } = storeToRefs(Page(pinia));
const router = useRouter();
const value = ref(0)
const handleActivetys = async (res: any) => {
    await Page(pinia).setActivityList(res.promo)
}
const activityDetail = (item: any) => {
    let str = item.content.split('_')
    if (str.length > 0) {
        str = str[0] + '_mobile_' + str[1] + '_' + str[2]
    }
    router.push({
        path: 'activityDetail',
        query: {
            detail: str
        }
    })
}
onMounted(async () => {
    //获取所有活动 
    const req = NetPacket.req_activites();
    req.show = 0
    Net.instance.sendRequest(req);
    MessageEvent2.addMsgEvent(
        NetMsgType.msgType.msg_notify_activites,
        handleActivetys
    );
});
</script>

<style lang='scss' scoped>
.activity {
    padding: 10px 10px 0px;
    overflow: hidden;

    // height: 100vh;
    .main_content {
        height: 90vh;
    }

    .imgs {
        width: 100%;
        margin-bottom: 3px;
    }

}
</style>