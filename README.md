# webweb
项目启动-> 代码拉取下来之后，使用yarn来下载依赖，然后运行npm run  dev 即可

代码规范：
1.所有css命名使用下划线连接 比如 my_home
2.所以js变量名称使用小驼峰命名  比如 myHome
3.所有图片使用webp格式，统一放在public-imgs文件夹下，文件路径可放入对应页面名称的文件夹内。比如在home页面，有一个1.webp图片，
  那么home.vue中img标签引用的路径就是 /imgs/home/1.webp，如果为公共图片，放入public文件夹下即可。
4.ui框架选用的是nutui 地址为  https://nutui.jd.com/h5/vue/4x/#/zh-CN/component/toast
5.图标使用icon字体库中的图标，如果没有 告知UI进行添加。
6.代码编写时先看一下原型，比对一下ui和原型在功能上是否有差异，如果有差异及时提出。
yarn
7.不允许私自新增package.json中的插件，如果需要，请告知leader。
8.代码提交之前，1.不允许页面有爆红，2. 运行 npm run build  之后，终端不允许有爆红，3.先拉取main分支代码，合并之后在提交到自己的分支。
9.问leader要vscode编译器得配置文件。统一配置。
暂定先这些，后续可随时补充。

10.代码编辑器中增加 用户代码片段。格式为

{
	"Print to console": {
		"scope": "vue", //指定文件类型，只有.vue文件可以触发
		"prefix": "v3", //自定义触发指令，我这里设置输入v3按下回车即可快速生成模板
		"body": [ //定义模板内容
			"<template>",
			"    <div>",
			"",
			"    </div>",
			"</template>",
			"",
			"<script setup lang='ts'>",
			"import { onMounted, ref } from 'vue';",
			"import { Net } from '@/utils/net/Net';",
			"import { MessageEvent2 } from '@/utils/net/MessageEvent2';",
			"import { NetPacket } from '@/utils/netBase/NetPacket';",
			"import { NetMsgType } from '@/utils/netBase/NetMsgType';",
			"",
			"",
			"import pinia from '@/store/index';",
			"import { storeToRefs } from 'pinia';",
			"import { User } from '@/store/user';",
			"const userInfo = User(pinia);",
			"const { isLogin } = storeToRefs(userInfo);",
			"",
			"</script>",
			"",
			"<style lang='scss' scoped>",
			"",
			"</style>"
		],
		"description": "Log output to console"
	}
}
