<template>
    <div class="activity" v-if="state.detail">

        <scroll-view style="height: 90vh;" class="main-content" :click="true">

            <img class="imgs" v-if="state.detail" :src="t(state.detail)" alt="">

        </scroll-view>

    </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive } from 'vue';
import ScrollView from '@/components/ScrollView.vue'
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const route = useRoute();

const state: any = reactive({
    detail: null
})
onMounted(async () => {
    state.detail = route.query.detail

});
</script>

<style lang='scss' scoped>
.activity {
    padding: 10px 10px 0px;
    overflow: hidden;

    .main-content {
        // height: calc(100vh);
        height: 100vh;

    }

    .imgs {
        width: 100%;
    }
}
</style>