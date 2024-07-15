<!-- 下拉框 -->
<template>
    <div class="select_item" @click="switchKey">
        <span>{{ name || t('select_please') }}</span>
        <iconpark-icon name="mineiconfangx01"></iconpark-icon>

        <!-- 选项 -->
        <div class="select_item_dialog" v-show="open">
            <div @click.stop="clickItem(item)" class="select_item_option" :class="{'avtive_option': getActive(item)}" v-for="(item, i) in props.options" :key="i">{{ getLabel(item) }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeMount, ref } from "vue"
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const open = ref(false)
const emits = defineEmits(['change'])

const props = defineProps({
    active: { // 当前激活项
        type: [Number, String],
        default: ""
    },
    options: { // label: xxx, value: xxx
        type: Array,
        default: () => []
    }
})
const name = computed(() => {
    const target:any = props.options.find((item:any) => item.value == props.active)
    if (target) return target.label
    return ''
})

const getLabel = (item:any) => item.label || '--'
const getActive = (item:any) => item.value == props.active
const clickItem = (item:any) => {
    open.value = false
    emits('change', item.value)
}

const switchKey = () => {
    const v = !open.value
    setTimeout(() => {
        open.value = v
    })
}

const outClickHandle = () => {
    open.value = false
}
onMounted(() => {
    document.body.addEventListener('click', outClickHandle)
})
onBeforeMount(() => {
    document.body.removeEventListener('click', outClickHandle)
})
</script>

<style lang="scss" scoped>
.select_item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    color: #fff;
    font-size: 12px;
    position: relative;
    .select_item_dialog {
        width: 100%;
        position: absolute;
       background-color: rgba(34,18,75,0.96);
        padding: 12px 18px;
        border-radius: 12px;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9;
        .select_item_option {
            height: 40px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #c0c2db;
            font-size: 12px;
        }
        .avtive_option {
            font-weight: bold;
            color: #fff;
        }
    }
}
</style>