export enum ServerType {
    HTTP,
    SOCKET,
}

export enum MethodType {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete',
    PUT = 'put',
}

export enum HttpContentType {
    DEFAULT = 'application/json;charset=utf-8',
    FORM = 'application/x-www-form-urlencoded',
    FORM_DATA = 'multipart/form-data',
}

export interface RequestData<T = unknown> {
    // 请求携带的参数
    params?: T;
    // 请求类型，仅http请求时需要
    type?: MethodType | string;
    // 请求header content-type，仅http请求时需要
    headerContentType?: HttpContentType | string;
}

export interface ServerResponse<T = unknown> {
    /** 是否成功 */
    success: boolean;
    /** 返回code */
    code?: string | number;
    /** 返回msg */
    message?: string;
    /** socket用：协议名 */
    event?: string;
    /** 接口具体数据 */
    data?: T;
}

export type ServerErrCommonHdr = (code: string | number, msg: string) => void;

export enum NetEvent {
    /** 授权错误 */
    AUTH_ERROR = 'auth_error',
    /** 连接中 */
    NET_CONNECTING = 'net_connecting',
    /** 已连接 */
    NET_CONNECTED = 'net_connected',
    /** 连接关闭 */
    NET_BEEN_CLOSED = 'net_been_closed',
}

export interface INet {
    /** 配置项设置 */
    setConfig: <T>(conf: T) => void;
    /** 请求 */
    request: <T, D>(api: string, data?: RequestData<T>) => Promise<D>;
    /** 服务端错误码提示 */
    onServerErr: ServerErrCommonHdr;
}
