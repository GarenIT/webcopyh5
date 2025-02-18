import { EncodeUtils } from "./EncodeUtils";
import { MessageEvent2 } from "./MessageEvent2";
import { MessageMap } from "./MessageMap";
import { NetEnumDef } from "../netBase/NetEnumDef";
import { NetMsgType } from "../netBase/NetMsgType";
import { NetPacket } from "../netBase/NetPacket";
import { RingBuffer } from "./RingBuffer";
import { MessageMapRegister } from "../netBase/MessageMapRegister";

import { Local, needLoginApi } from "@/utils/storage";
import { showToast } from '@nutui/nutui'
import { i18n } from '@/languages/index';
import pinia from '@/store/index';
import { Page } from '@/store/page';
import { User } from '@/store/user';
import { storeToRefs } from 'pinia';

const { settings } = storeToRefs(Page(pinia));

MessageMapRegister.register();

export enum ConnectResult {
    Failed = 0,
    Success = 1
}

export class Net {
    public static instance = new Net();
    private connect_index = 0;
    private ringBuffer = new RingBuffer();

    private ws: any = null;
    private connectedSuccessCallBack: any = null;
    private connectFailedCallBack: any = null;
    private packageCount = 1;
    private checkSocketTimerID: any = null;
    private timeOut = 40;
    public needReconnect = false;
    private msgSendSpanTime: any = {};

    constructor() {

        MessageEvent2.addMsgEvent(NetPacket.notify_login_result().getMsgID(), this.retryConnectRecv.bind(this));
    }

    retryConnectRecv(data: { result: NetEnumDef.common_result; }) {

        // 重连失败，退出游戏
        if (data.result != NetEnumDef.common_result.common_success) {
            return;
        }
        // MessageEvent2.sendEvent(EVENT_TAG.reconnect_success);
    }

    connect(ipPort: string, successCallBack: any, failCallBack: any, trycount = 3) {
        console.log("connect ipPort: ", ipPort);
        // UIManager.showJiaZ("connect");
        this.initWebSocket(ipPort, successCallBack, () => {

            this.reConnect(successCallBack, failCallBack, trycount);
        });
    }

    reConnect(successCallBack?: Function, failCallBack?: Function, trycount = 3) {

        trycount--;
        this.connect_index++;
        if (trycount > 0) {
            var ipPort = settings.value.server_testUrls[this.connect_index % settings.value.server_testUrls.length];
            // 已经有登录信息，则进入断线重连流程，如果没有就保持socket链接
            if (Local.get('user') && Local.get('user').token) {
                if (this.isConnected()) {
                    this.connect(
                        ipPort,
                        () => {
                            needLoginApi()
                        },
                        failCallBack,
                        trycount
                    );
                } else {
                    this.closeSocket();
                }

            } else {
                this.connect(ipPort, successCallBack, failCallBack, trycount);
            }
        } else {
            if (failCallBack) {
                failCallBack();
            }
        }
    }
    // 初始化ws服务
    initWebSocket(ipPort: string | URL, successCallBack: Function | null, failCallBack: (() => void) | null) {
        try {

            if (this.isConnected()) {
                if (successCallBack) {
                    console.log("already isConnected");
                    successCallBack();
                    return;
                }
            } else {
                this.closeSocket();
            }

            this.ws = new WebSocket(ipPort, []);
            this.ws.onopen = this.onWsOpen.bind(this);
            this.ws.onclose = this.onWsClose.bind(this);
            this.ws.onmessage = this.onWsMessage.bind(this);
            this.ws.onerror = this.onWsError.bind(this);
            this.connectedSuccessCallBack = successCallBack;
            this.connectFailedCallBack = failCallBack;
        } catch (error) {
            console.log("connect e: ", error);
        }
    }
    // 已连接到ws服务
    isConnected() {
        return this.ws != null && this.ws.readyState == this.ws.OPEN;
    }
    // ws服务已关闭
    isClosed() {
        return this.ws != null && this.ws.readyState == this.ws.CLOSED;
    }

    async closeSocket() {
        if (this.ws != null) {
            this.ws.close();

            this.packageCount = 1;
        }
        await User(pinia).setLoadingEnd(false)
        await User(pinia).setWsOpen(false)
        console.log("close socket");


        this.ringBuffer.Clear();
        if (this.checkSocketTimerID) {
            clearInterval(this.checkSocketTimerID);
            this.checkSocketTimerID = null;
        }
    }

    async onWsOpen(e: { target: WebSocket; }) {
        console.log("onWsOpen e: ", this.ws, " e.target: ", e.target);
        await User(pinia).setWsOpen(true)
        if (e && e.target && this.ws != e.target) {
            //忽略无效的连接
            return;
        }
        if (this.connectedSuccessCallBack != null) {
            this.connectedSuccessCallBack();
            this.connectedSuccessCallBack = null;
        }
        this.connectFailedCallBack = null;
        this.setTimer();
    }

    onWsClose(e: { target: WebSocket; }) {
        console.log("onWsClose e: ", this.ws, " e.target: ", e.target);
        if (e && e.target && this.ws == e.target) {
            //关闭当前连接
            this.closeSocket();
        }
        // UIManager.closeJiaZ("connect");
        if (this.connectFailedCallBack != null) {
            this.connectFailedCallBack();
        } else {
            this.reConnect();
        }
    }

    onWsError(e: { target: WebSocket; }) {
        console.log("onWsError e: ", this.ws, " e.target: ", e.target);
        if (e && e.target && this.ws == e.target) {
            this.closeSocket();
        }
    }

    onWsMessage(event: { target: WebSocket; data: string | Blob; }) {
        try {
            if (event && event.target && event.target != this.ws) {
                //忽略无效连接的数据
                return;
            }

            if (typeof event.data == "string") {
                let array = [];
                for (let i = 0; i < event.data.length; i++) {
                    array.push(event.data.charCodeAt(i));
                }
                // console.log("array:",array);
                let buf = new Uint8Array(array);
                this.ReceiveMessage(buf);
                return;
            }

            let reader = new FileReader();
            reader.readAsArrayBuffer(event.data);
            let self = this;
            reader.onload = function () {
                let buf = new Uint8Array(reader.result as any);
                //先存入队列中
                self.ReceiveMessage(buf);
            };
        } catch (e) {
            console.log("Net.onWsMessage exception: ", e);
            this.closeSocket();
        }
    }
    // 发送请求
    sendRequest(data: { uid?: string; server_id?: number; token?: string; type?: number; version?: number; device_id?: string; ip?: string; flag_id?: number; flag_type?: number; getMsgID: any; encode?: ((buf: any) => void) | ((buf: any) => void) | ((buf: any) => void) | ((buf: any) => void) | ((buf: any) => void) | ((buf: any) => void) | ((buf: any) => void); decode?: ((buf: any, index: any) => number) | ((buf: any, index: any) => number) | ((buf: any, index: any) => number) | ((buf: any, index: any) => number) | ((buf: any, index: any) => number) | ((buf: any, index: any) => number) | ((buf: any, index: any) => number); build: any; sign?: string; aaa?: string; bbb?: string; login_type?: number; username?: string; password?: string; debug?: string; device_model?: string; app_version?: string; channel_id?: number; captcha?: string; register_type?: number; ip_error?: string; agent_id?: number; currency?: number; operate_type?: number; email?: string; mobile?: string; new_password?: string; verify_code?: number; }, needFilterSendRate = false, timeOutCallBack = null, filterCallBack: any = null) {
        let msg = JSON.parse(JSON.stringify(data))
        delete msg.build
        delete msg.decode
        delete msg.encode
        delete msg.getMsgID
        console.log(`发送的协议为: ==> ${this.getMsgType(data.getMsgID())}
发送的数据为：==>`, msg);

        if (!this.isConnected()) {
            this.connect(
                settings.value.server_testUrls,
                () => {
                    this.sendRequest(data, needFilterSendRate, timeOutCallBack, filterCallBack);
                },
                null
            );
            return;
        }
        if (needFilterSendRate) {
            //启用消息频率发送限制时，1秒钟内能发一条相同的消息
            let now_time = new Date().getTime();
            let sendTime = this.msgSendSpanTime[data.getMsgID()];
            if (sendTime && now_time - sendTime < 1000) {
                if (filterCallBack) {
                    filterCallBack();
                }
                return;
            }
            this.msgSendSpanTime[data.getMsgID()] = now_time;
        }

        //消息包编号，服务器需要用到
        let buf: any = [];
        let count = this.calcPacketCount();
        EncodeUtils.uInt8ToByte(count, buf);

        //编码消息体
        data.build(buf);

        //编码整个包头，不包括自身的4个字节
        let bodylen = EncodeUtils.swab32_msg_total_length(buf.length);
        let bodyLenBuf: any[] = [];
        EncodeUtils.encode_msg_total_length(bodylen, bodyLenBuf);

        //把bodylen放到buf最前面
        for (let i = 3; i >= 0; --i) {
            buf.unshift(bodyLenBuf[i]);
        }

        let sendbuffer = new Uint8Array(buf).buffer;

        this.ws.send(sendbuffer);
    }
    // 接收到的二进制消息
    ReceiveMessage(buf: any) {
        var len = buf.byteLength;
        if (buf == undefined || buf == null || len == 0) {
            return;
        }
        for (var i = 0; i < len; ++i) {
            this.ringBuffer.Push(buf[i]);
        }
        while (true) {
            var receivedlength = this.ringBuffer.DataLength();
            if (receivedlength < 4) {
                return;
            }

            let bodyLen = this.ringBuffer.decode_msg_total_length();

            if (bodyLen < 1) {
                return;
            }

            if (receivedlength < bodyLen) {
                return;
            }
            this.DecodeMessage(bodyLen);
        }
    }
    // 解码消息体
    DecodeMessage(bodyLen: number) {
        this.ringBuffer.addHead(4); //先去掉4个字节的包长度，再开始解析msg_id
        let msgID = this.ringBuffer.decode_msg_id();

        let messageStruct = MessageMap.getMessage(msgID);
        if (messageStruct == null) {
            //找不到对应的解码结构体时，循环消息ringbuffer的标识也要往后移，跳过这条消息的数据
            this.ringBuffer.addHead(bodyLen - 2);
            console.log("msgID not register", msgID);
            return;
        }
        this.timeOut = 40;
        let message = this.ringBuffer.decode_msg_body(messageStruct, bodyLen - 2);
        if (message.code != 1) {
            if (message.message) {
                showToast.fail(i18n.global.t(message.message))
            }
        }
        if (![18, 10].includes(msgID)) {
            console.log(
                `返回协议的id为 ==> ${msgID}
协议字段为 ==> ${this.getMsgType(msgID)}
返回的数据为 ==>`, JSON.parse(JSON.stringify(message))
            );
        }
        MessageEvent2.sendEvent(msgID, message);
    }

    getMsgType(msgID: number) {
        let msgType: any = NetMsgType.msgType
        for (const key in msgType) {
            if (msgType[key] == msgID) {
                return key;
            }
        }
    }

    calcPacketCount() {
        let count = this.packageCount++;
        if (this.packageCount > 255) {
            this.packageCount = 1;
        }

        return count;
    }

    setTimer() {
        this.timeOut = 40;
        if (this.checkSocketTimerID) {
            return;
        }
        this.checkSocketTimerID = setInterval(() => {
            this.timeOut--;
            if (this.timeOut <= 0 && this.isConnected()) {
                Net.instance.closeSocket();
            }
        }, 1000);
    }
}
