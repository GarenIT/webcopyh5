<template>
  <Modal v-model:visible="visible" title="层级管理">
    <div class="popup_body">
      <div class="account">
        <span>会员账号：</span>
        <span>{{ currentUser.username }}</span>
      </div>
      <div class="select">
        <span>代理层级</span>
        <Select v-model="level" :options="levels"/>
      </div>
      <div class="btn">
        <Btn width="200px" height="42px" fontSize="14px" @click="submitData">代理介绍</Btn>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Select from "@/views/agencyCooperation/components/Select.vue";
import Btn from "@/components/Btn.vue";
import Modal from "@/components/Modal.vue";
import { computed, ModelRef, onUnmounted, ref, watch } from "vue";
import { NetPacket } from "@/netBase/NetPacket.ts";
import { Net } from "@/net/Net";
import { MessageEvent2 } from "@/net/MessageEvent2.ts";
import { NetMsgType } from "@/netBase/NetMsgType.ts";

const props = defineProps(["currentUser", "IdentityMap"])
const visible: ModelRef<boolean | undefined> = defineModel()

const level = ref("")
const levelInfo: any = ref({}) // 会员层级数据
const levels: any = computed(() => {
  const arr: any = []
  Object.keys(props.IdentityMap).map((key: string) => {
    if ((levelInfo.value.level || 0) <= Number(key)) {
      arr.push({label: props.IdentityMap[key], value: key})
    }
  })
  return arr
})
watch(visible, () => {
  level.value = String(props.currentUser.level)
})

// 提交
const submitData = () => {
  const query = NetPacket.req_improve_agent_lev()
  query.role_id = levelInfo.value.role_id
  query.level = level.value
  Net.instance.sendRequest(query);
}

const resultHandle = (rs: any) => {
  if (rs && rs.result) {
    visible.value = false
  }
}

// 回执监听
MessageEvent2.addMsgEvent(
    NetMsgType.msgType.msg_notify_improve_agent_lev,
    resultHandle,
);
onUnmounted(() => {
  // 取消监听
  MessageEvent2.removeMsgEvent(NetMsgType.msgType.msg_notify_improve_agent_lev, null);

});
</script>

<style scoped lang="scss">
.popup_body {
  padding: 20px 40px 50px;

  .account, .select {
    margin-bottom: 5px;

    span {
      color: #fff;
      font-size: 12px;
    }

    > span:first-child {
      color: #c0c2db;
    }
  }

  :deep() {
    .form-select-wrap {
      margin: 5px 0 20px 0;
    }

    .form-select {
      margin: 0;
      height: 36px;
    }
  }

  .btn {
    text-align: center;
  }
}
</style>