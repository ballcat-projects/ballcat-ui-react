import { useState, useEffect } from 'react';
import { Token } from '@/utils/Ballcat';
import { settings } from '@/utils/ConfigUtils';
import { useModel } from 'umi';

// 心跳配置
type Heartbeat = {
  // 心跳间隔时间
  interval: number;
  // 响应超时时间
  timeout: number;
  // 延时发送心跳的定时器
  pingTimeoutObj: NodeJS.Timeout | null;
  // 接收心跳响应的定时器
  pongTimeoutObj: NodeJS.Timeout | null;
  // 心跳请求信息
  pingMessage: string;
};

class CustomerWebsocket {
  // webSocket实例
  instance: WebSocket | null;
  // 重连锁，避免多次重连
  lockReconnect: boolean = false;
  // 最大重连次数， -1 标识无限重连
  maxReconnect: number = 6;
  // 重连尝试次数
  reconnectCount: number = 0;
  // 心跳配置
  heartbeat: Heartbeat = {
    interval: 30 * 1000,
    timeout: 10 * 1000,
    pingTimeoutObj: null,
    pongTimeoutObj: null,
    pingMessage: JSON.stringify({ type: 'ping' }),
  };
  eventMap: Record<string, ((data: any) => void)[]>;

  constructor() {
    this.instance = null;
    this.eventMap = {};
  }

  start = (forcibly = false) => {
    let { instance } = this;
    if (forcibly && instance !== null) {
      this.clearTimeoutObj();
      instance.close();
      instance = null;
    }

    const token = Token.get();
    if (instance === null && token) {
      const { host, protocol: httpProtocol } = window.location;
      const protocol = httpProtocol.indexOf('s') === -1 ? 'ws' : 'wss';
      const url = `${protocol}://${host}/api/ws?access_token=${token}`;

      const newInstance = new WebSocket(url);
      // 连接成功
      newInstance.onopen = this.onOpne;
      // 连接错误
      newInstance.onerror = this.onError;
      // 连接关闭
      newInstance.onclose = this.onClose;
      // 接收信息
      newInstance.onmessage = this.onMessage;
      this.instance = newInstance;
    }
  };

  onOpne = () => {
    // eslint-disable-next-line no-console
    console.log('WebSocket connection success');
    // 开启心跳
    this.startHeartbeat();
    this.reconnectCount = 0;
  };

  onError = (e: any) => {
    // 错误
    // eslint-disable-next-line no-console
    console.log(`WebSocket connection error：${e.code} ${e.reason} ${e.wasClean}`);
    // 重连
    this.reconnect();
  };

  onClose = (e: any) => {
    // 关闭
    // eslint-disable-next-line no-console
    console.log(`WebSocket connection closed：${e.code} ${e.reason} ${e.wasClean}`);
    // 重连
    this.reconnect();
  };

  onMessage = (msgEvent: MessageEvent) => {
    // 收到服务器信息，心跳重置并发送
    this.startHeartbeat();
    let event;
    let data;
    const text = msgEvent.data;
    try {
      data = JSON.parse(text);
      event = data.type;
      // 心跳响应跳过发布
      if (event === 'pong') {
        return;
      }
    } catch (e) {
      // 纯文本消息
      event = 'plaintext';
      data = text;
    }
    // 发布消息事件
    this.emitEventListen(event, data);
  };

  send = (msg: string) => {
    // 数据发送
    this.instance?.send(msg);
  };

  startHeartbeat = () => {
    const { heartbeat, instance } = this;
    // 清空定时器
    this.clearTimeoutObj();
    // 延时发送下一次心跳
    heartbeat.pingTimeoutObj = setTimeout(() => {
      // 如果连接正常
      if (instance?.readyState === 1) {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        instance.send(heartbeat.pingMessage);
        // 心跳发送后，如果服务器超时未响应则断开，如果响应了会被重置心跳定时器
        heartbeat.pongTimeoutObj = setTimeout(() => {
          instance?.close();
        }, heartbeat.timeout);
      } else {
        // 否则重连
        this.reconnect();
      }
    }, heartbeat.interval);
  };

  clearTimeoutObj = () => {
    const { heartbeat } = this;
    if (heartbeat.pingTimeoutObj) {
      clearTimeout(heartbeat.pingTimeoutObj);
    }
    if (heartbeat.pongTimeoutObj) {
      clearTimeout(heartbeat.pongTimeoutObj);
    }
  };

  reconnect = () => {
    const { lockReconnect, maxReconnect, reconnectCount } = this;
    const token = Token.get();
    if (!token) {
      return;
    }

    if (lockReconnect || (maxReconnect !== -1 && reconnectCount > maxReconnect)) {
      return;
    }
    this.lockReconnect = true;
    setTimeout(() => {
      this.reconnectCount += 1;
      // 建立新连接
      this.start(true);
      this.lockReconnect = false;
    }, 5000);
  };

  /**
   * 添加监听事件
   * @param type 事件类型
   * @param callback 事件回调
   */
  addEventListen = (type: string, callback: (data: any) => void) => {
    const { eventMap } = this;
    if (eventMap[type]) {
      eventMap[type].push(callback);
    } else {
      eventMap[type] = [callback];
    }
  };

  /**
   * 移除监听事件
   * @param type 事件类型
   * @param callback 事件回调, 请保证与添加监听事件传入的为同一回调, 而不是一个新函数
   */
  removeEventListen = (type: string, callback: (data: any) => void) => {
    const funs = this.eventMap[type];
    for (let index = 0; index < funs.length; index += 1) {
      if (callback === funs[index]) {
        this.eventMap[type].splice(index, 1);
      }
    }
  };
  /**
   * 提交事件
   * @param type 时间类型
   * @param data 数据
   */
  emitEventListen = (type: string, data: any) => {
    this.eventMap[type]?.forEach((fun) => {
      try {
        fun(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`事件处理异常!`, e);
      }
    });
  };
}

const func = <T extends (...args: any[]) => void>(callback?: T) => {
  return callback || (() => {});
};

export default () => {
  const [cw, setCw] = useState<CustomerWebsocket>();
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    if (settings.websocket) {
      const newCw = new CustomerWebsocket();
      newCw.start();
      setCw(newCw);
      return () => {
        newCw.instance?.close();
        newCw.clearTimeoutObj();
      };
    }
    return () => {};
    // 保证重新登录后.刷新连接
  }, [initialState]);

  return {
    start: func(cw?.start),
    send: func(cw?.send),
    addEventListen: func(cw?.addEventListen),
    removeEventListen: func(cw?.removeEventListen),
    emitEventListen: func(cw?.emitEventListen),
  };
};
