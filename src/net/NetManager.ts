import { Singleton } from '../utils/Singleton';
import { catchEvent, emitEvent } from '../utils/WindowEvent';
import { HttpMgr } from './HttpMgr';
import { INet, NetEvent, RequestData, ServerErrCommonHdr, ServerType } from './INet';
import { CbHandler, ReqCmd, SocketMgr } from './SocketMgr';

export class NetManager {
    private httpServer: INet;
    private socketServer: INet;

    constructor() {
        this.httpServer = HttpMgr.inst;
        this.socketServer = SocketMgr.inst;

        catchEvent(NetEvent.AUTH_ERROR, this.onAuthError.bind(this));
    }

    static get inst() {
        return Singleton.get(NetManager);
    }

    /** 初始化
     * @param serverType 请求协议类型 http或websocket
     * @param conf 协议的初始化配置
     * @param autoConnet 是否自动开启socket连接
     */
    init<T>(serverType: ServerType, conf: T, autoConnet?: boolean) {
        if (serverType === ServerType.HTTP) this.httpServer.setConfig(conf);
        else {
            this.socketServer.setConfig(conf);
            if (autoConnet) SocketMgr.inst.connect();
        }
    }

    /** 请求接口 */
    request<T, D>(api: string, data?: RequestData<T>, serverType = ServerType.HTTP): Promise<D> {
        if (serverType === ServerType.HTTP) return this.httpServer.request(api, data);
        return this.socketServer.request(api, data);
    }

    /// //////// ws 相关 ///////////////////////////////////////////////////

    /** 启动socket连接 */
    socketConnect(force?: boolean, url?: string) {
        SocketMgr.inst.connect(force, url);
    }

    socketRegisterCmd(cmd: ReqCmd<string> | ReqCmd<string>[], handler: CbHandler) {
        SocketMgr.inst.regCMDHandler(cmd, handler);
    }
    /// ///////////////////////////////////////////////

    /** 设置服务器错误码全局提示函数 */
    set onServerErrHandler(cb: ServerErrCommonHdr) {
        this.httpServer.onServerErr = cb;
        this.socketServer.onServerErr = cb;
    }

    /** 授权错误 */
    private onAuthError() {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            emitEvent('gotoLogin');
        }, 2000);
    }
}
