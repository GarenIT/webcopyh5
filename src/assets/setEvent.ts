// import { Net } from "@/net/Net";
// import { NetPacket } from "@/netBase/NetPacket";



let lastTouchEnd = 0; //更新手指弹起的时间
document.documentElement.addEventListener("touchstart", function (event) {
  //多根手指同时按下屏幕，禁止默认行为
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, false);

document.documentElement.addEventListener(
  "touchend",
  function (event) {
    let now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      //当两次手指弹起的时间小于300毫秒，认为双击屏幕行为
      event.preventDefault();
    } else {
      // 否则重新手指弹起的时间
      lastTouchEnd = now;
    }
  },
  false
);
//阻止双指放大页面
document.documentElement.addEventListener("gesturestart", function (event) {
  event.preventDefault();
});
document.oncontextmenu = function (e) {
  e.preventDefault()
}
// window.addEventListener('offline',function(){
//   alert('Please check if your network connection is normal')
// },true)
// document.addEventListener("visibilitychange", function () {
//   if (document.visibilityState == "visible") {
//     let req = NetPacket.req_init_connect();
//     Net.instance.sendRequest(req);
//     console.log("进入前台");
//   }
//   if (document.visibilityState == "hidden") {

//     Net.instance.closeSocket()
//     console.log("切换到后台")
//   }
// })
