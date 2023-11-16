/* eslint-disable no-console */
import axios, {
    AxiosInstance,
    AxiosRequestHeaders,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { LocalCache } from '../utils/LocalCache';
import { Singleton } from '../utils/Singleton';
import { emitEvent } from '../utils/WindowEvent';
import { HttpContentType, INet, MethodType, NetEvent, RequestData } from './INet';

export interface HttpConf {
    baseURL: string;
    /** 超时， 默认2000ms */
    timeout?: number;
    /** 跨域携带cookie 默认携带 */
    withCredentials?: boolean;
    /** 设置到header里的授权key 默认 token */
    authKey?: string;
    /** 接口回复的code */
    responseCode?: {
        /** 成功 默认 1 */
        success: string | number;
        /** 错误 默认 0 */
        error: string | number;
        /** token错误 默认 401 */
        authError: string | number;
    };
    /** 不需要走授权key的接口列表 */
    requestWithoutAuth?: string[];
    /** 不做返回拦截处理的接口列表, 返回完整response */
    responseWithoutInterceptors?: string[];
    /** 是否轮询获取最新token */
    pollingToken?: {
        enable: boolean;
        api: string;
        /** 轮询间隔， 默认5分钟 */
        pollingTime?: number;
    };
}

const formDataTypes = [HttpContentType.FORM, HttpContentType.FORM_DATA];

export class HttpMgr implements INet {
    private reqInst: AxiosInstance | undefined;
    private config: HttpConf = {} as HttpConf;
    private successCode: string | number = 0;
    private errCode: string | number = 0;
    private authErrCode: string | number = 0;
    private authKey = '';
    private inAuthErr = false;

    static get inst() {
        return Singleton.get(HttpMgr);
    }

    /** axios 请求初始化配置 */
    setConfig<T>(conf: T) {
        // console.log('http setConfig: ', conf);

        this.config = conf as HttpConf;
        this.successCode = this.config?.responseCode?.success ?? 1;
        this.errCode = this.config?.responseCode?.error ?? 0;
        this.authErrCode = this.config?.responseCode?.authError || 401;
        this.authKey = this.config?.authKey ?? 'token';

        if (this.reqInst) return;

        this.reqInst = axios.create({
            baseURL: this.config.baseURL ?? '',
            timeout: this.config?.timeout ?? 2000,
            headers: { 'Content-Type': HttpContentType.DEFAULT },
            withCredentials: this.config?.withCredentials ?? true,
        });

        this.reqInst.interceptors.request.use(this.onRequestInterceptor.bind(this));
        this.reqInst.interceptors.response.use(this.onReponseInterceptor.bind(this));
    }

    /** 请求 */
    request<T, D = any>(api: string, data?: RequestData<T>): Promise<D> {
        if (!this.reqInst || !this.reqInst?.options) {
            return new Promise<any>((_, reject) => {
                const hint = '项目里未设置http config';
                console.warn(hint);
                reject(hint);
            });
        }

        const { type, headerContentType, params } = data as RequestData;

        if (
            type === MethodType.GET &&
            formDataTypes.includes(headerContentType as HttpContentType)
        ) {
            console.warn(
                `接口${api}请求类型为 ${type}， content-type为 ${headerContentType}， 请确认~`,
            );
        }

        const method = type ?? MethodType.GET;
        const reqdata = method === MethodType.GET ? 'params' : 'data';

        return new Promise<any>((resolve) => {
            if (
                type === MethodType.POST &&
                formDataTypes.includes(headerContentType as HttpContentType)
            ) {
                this?.reqInst
                    ?.postForm?.(api, params, {
                        headers: { 'Content-Type': headerContentType },
                    })
                    .then((res) => resolve(res ?? ''))
                    .catch((err) => {
                        console.warn('http post err: ', err);
                        // reject(err);
                    });
            } else {
                this?.reqInst?.({
                    url: api,
                    method,
                    [reqdata]: params ?? '',
                })
                    .then((res) => resolve(res ?? ''))
                    .catch((err) => {
                        console.warn('http request err: ', err);
                        // reject(err);
                    });
            }
        });
    }

    onServerErr(code: string | number, msg: string) {
        console.log('netbase onServerErr: ', code, msg);
    }

    // 请求拦截
    private onRequestInterceptor(cf: InternalAxiosRequestConfig<unknown>) {
        // console.log('处理请求拦截===', cf);
        this.setAuthInHeaders(cf.headers, this.apiNeedAuth(cf?.url || '') ?? true, this.authKey);
        return cf;
    }

    // 响应拦截
    private onReponseInterceptor(res: AxiosResponse) {
        // console.log('处理响应拦截===', res);
        if (!res?.config) return res;

        // blob文件类型直接返回
        if (res.config.responseType === 'blob') return res;

        const { code, data, message } = res.data;
        const api = res.config?.url || '';

        // 自动保存授权信息
        if (data?.token && this.apiNeedAuth(api)) {
            LocalCache.setItem(this.authKey, data.token);
            // 更新token的接口里，有更新到token, 抛出事件
            // if (api === this.config?.pollingToken?.api && this.config?.pollingToken?.enable) {
            //     emitEvent('update_token');
            // }
        }

        // 不做拦截处理的接口, 返回完整response
        if (this.config?.responseWithoutInterceptors?.some((url) => api.includes(url))) {
            return res.data;
        }

        switch (code) {
            case this.successCode:
                return data;
            case this.authErrCode: // 授权出错, 跳转login页
                // 重复出现授权错误，reject消息，授权出错后续逻辑不做重复执行
                if (this.inAuthErr) return Promise.reject(data);

                LocalCache.delItem(this.authKey);
                emitEvent(NetEvent.AUTH_ERROR);
                this.onServerErr?.(code, '登录状态过期，请重新登陆');
                // this.onRelogin();
                break;
            case this.errCode: // 错误code
                this.onServerErr?.(code, message);
                // console.log(`http server reponse errCode==== code:${code}, msg: ${message}`);
                return Promise.reject(message);
            default:
                return Promise.reject(data);
        }

        // 是否授权错误
        this.inAuthErr = code === this.authErrCode;

        return res;
    }

    private setAuthInHeaders(headers: AxiosRequestHeaders, needAuth: boolean, authKey: string) {
        headers.Authorization = needAuth ? LocalCache.getItem(authKey) ?? '' : '';
        return headers;
    }

    private apiNeedAuth(api: string) {
        return !this.config?.requestWithoutAuth?.some((url) => api.includes(url));
    }
}
