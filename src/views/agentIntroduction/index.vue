<template>
  <div class="agent_introduction">
    <div class="hint">{{ t("level_page_pRule") }}</div>
    <div class="table">
      <!--表头-->
      <div class="table-column">
        <div class="td" v-for="(item, i) in tableHeader" :key="i">
          <span>{{ item.title }}</span>
          <img src="/imgs/me/table_line.png" alt="">
        </div>
      </div>
      <!--数据-->
      <div class="tr" v-for="(_row, index) in tableData" :key="index">
        <div class="td" v-for="(_td_moneyitem, i) in tableHeader" :key="i">
           {{ _row[_td_moneyitem.key] }}
        </div>
      </div>
    </div>
    <div class="pic">
      <div class="title">
        <div class="left">
          {{t("proxy_page_agentCj")}}:
        </div>
        <div class="center">
          <img src="/imgs/me/boss.webp" alt="">
          <span>{{ t("identity_map_5") }}</span>
        </div>
      </div>
      <div class="detail">
        <p>{{t("proxy_page_team")}}: 300w*0.65% =19,500</p>
        <p>{{t("proxy_page_contributions")}}: 15,000</p>
        <p>{{ t("proxy_page_revenue") }} = {{t("proxy_page_team")}} + {{t("proxy_page_contributions")}} = 34,500</p>
      </div>
      <div class="structure_chart">
        <div class="arrow arrow_top">
          <img src="/imgs/me/arrow_top.webp" alt="">
        </div>
        <div class="arrow arrow_left">
          <img src="/imgs/me/arrow_bottom.webp" alt="">
        </div>
        <div class="arrow arrow_right">
          <img src="/imgs/me/arrow_bottom.webp" alt="">
        </div>
        <div class="content">
          <p>
            {{t("proxy_page_nextCs")}} 0.125%
          </p>
          <p>+</p>
          <p>
            {{t("proxy_page_nextZs")}}
          </p>
        </div>
      </div>
      <div class="user-list">
        <div class="user">
          <div class="user_name">
            <img src="/imgs/me/boss.webp" alt="">
            {{ t("proxy_page_partner") }} B1
          </div>
          <div class="turnover">
            <p>{{t("proxy_page_turnover")}}: </p>
            <p>1000000</p>
          </div>
        </div>
        <div class="user">
          <div class="user_name">
            <img src="/imgs/me/boss.webp" alt="">
            {{ t("proxy_page_partner") }} B1
          </div>
          <div class="turnover">
            <p>{{t("proxy_page_turnover")}}: </p>
            <p>1000000</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 表格
import { reactive } from "vue";
import { useI18n } from "vue-i18n";

interface TableHeaderItem {
  title: string;
  key: string;
}

interface TableRow {
  [key: string]: string;
}
const {t} = useI18n();
const tableHeader: TableHeaderItem[] = [
  { title: "代理层级", key: 'agentLevel' },
  { title: "团队有效流水抽成", key: 'flowExtraction' },
];

const tableData: TableRow[] = reactive([
  {
    agentLevel: t("identity_map_1"),
    flowExtraction: "22%",
  }, {
    agentLevel: t("identity_map_2"),
    flowExtraction: "22%",
  }, {
    agentLevel: t("identity_map_3"),
    flowExtraction: "22%",
  }, {
    agentLevel: t("identity_map_4"),
    flowExtraction: "22%",
  }, {
    agentLevel: t("identity_map_5"),
    flowExtraction: "22%",
  },
]);
</script>

<style scoped lang="scss">
.agent_introduction {
  padding: 0 10px;

  .hint {
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: #a2a5de;
  }

  .table {
    margin-top: 10px;
    border-radius: 8px;
    overflow: hidden;
    background: radial-gradient(87.04% 93.77% at 50% 13.97%, #4C36B3 0.17%, #3A2786 74.42%, #3C279A 100%);

    .table-column {
      display: flex;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
      background: radial-gradient(87.04% 93.77% at 50% 13.97%, #4C36B3 0.17%, #3A2786 74.42%, #3C279A 100%);

      div {
        height: 42px;
        //line-height: 42px;
        flex: 1;
        // flex:1;
        text-align: center;
        color: #ffffff;
        font-size: 10px;
        font-weight: 900;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

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

    .tr {
      display: flex;

      &:nth-child(even) {
        background-blend-mode: color-burn, overlay, normal;
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), radial-gradient(circle at 50% 50%, #7e7e7e, #151515 99%), linear-gradient(to bottom, var(--bg-decreased-1), var(--bg-decreased-1));
        background-color: #241353;
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

      & > .td:first-child {
        border-right: 1px solid rgba(135, 161, 206, 0.2);
      }

      & > .td:last-child {
        border-right: 1px solid transparent;
      }
    }

  }

  .pic {
    margin-top: 5px;
    margin-bottom: 5px;
    //padding: 0 20px;

    .title {
      display: flex;
      align-items: center;
      padding-left: 20px;

      .left {
        color: #a2a5de;
        font-size: 12px;
      }

      .center {
        flex: 1;
        width: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #c0c2db;
        font-weight: bold;

        & > * {
          transform: translateX(-35px);
        }

        img {
          width: 24px;
        }
      }
    }

    .detail {
      height: 122px;
      flex-grow: 0;
      margin: 5px 0 8px;
      padding: 11px 41px 11px 42px;
      border-radius: 8px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
      background-color: #353b5a;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      p {
        font-size: 12px;
        color: #ffffff;
      }
    }

    .structure_chart {
      width: 240px;
      height: 145px;
      margin: 15px auto;
      margin-bottom: 0px;
      border: 3px solid #1fe1f2;
      border-radius: 10px;
      border-bottom: none;
      position: relative;
      display: flex;
      justify-content: center;

      .arrow {
        width: 50px;
        height: 20px;
        position: absolute;
        background-color: #27214b;
        img{
          width: 20px;
        }
        //background-color: red;
      }

      .arrow_top {
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        img{
          transform: translateY(-2px);
        }
      }

      .arrow_left {
        left: 0;
        bottom: 0;
        transform: translateX(-50%);
        img{
          transform: translate(13.6px, -15px);
        }
      }

      .arrow_right {
        right: 0;
        bottom: 0;
        transform: translateX(50%);
        img{
          transform: translate(16.5px, -15px);
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        transform: translateY(-10px);
        width: 80%;
        height: 100%;
        color: #c0c2db;
        font-size: 10px;

        p {
          text-align: center;
          font-size: 12px;
        }
      }
    }

    .user-list {
      display: flex;
      gap: 40px;
      .user_name{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2px;
        color: #c0c2db;
        font-size: 14px;
        font-weight: 900;
      }
      .user {
        .turnover {
          width: 157px;
          height: 60px;
          flex-grow: 0;
          padding: 11px 15px 12px 7px;
          border-radius: 8px;
          box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.39), 0 2px 2px 0 rgba(0, 0, 0, 0.34), 0 5px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 3px 0 rgba(0, 0, 0, 0.06), 0 13px 3px 0 rgba(0, 0, 0, 0.01);
          background-color: #353b5a;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          p{
            color: #fff;
            font-size: 10px;
            text-wrap: nowrap;
          }
        }
      }
    }
  }

}
</style>