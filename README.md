# ts-utils

### ts 工具库

封装了一部分常用的工具。

#### 安装

`$ npm install @6653302wy/ts-utils`

#### 库结构

.
├── dom/
│ ├── Browser.ts
│ └── Url.ts
├── net/
│ ├── HttpMgr.ts
│ ├── NetManager.ts
│ └── SocketMgr.ts
├── react-hooks/
│ ├── useEventListener.tsx
│ ├── useIsMounted.tsx
│ ├── useLockBodyScroll.tsx
│ ├── useLongPress.tsx
│ ├── usePortal.tsx
│ ├── useSocket.tsx
│ ├── useTimer.tsx
│ └── useToggle.tsx
└── utils/
│ ├── ArrayUtils.ts
│ ├── Convert.ts
│ ├── DateUtils.ts
│ ├── Device.ts
│ ├── DownloadFile.ts
│ ├── FileParser.ts
│ ├── GetUUID.ts
│ ├── LocalCache.ts
│ ├── LocalStorage.ts
│ ├── MathUtils.ts
│ ├── ObjectUtils.ts
│ ├── Queue.ts
│ ├── ResourceExists.ts
│ ├── Singleton.ts
│ ├── StringUtils.ts
│ ├── Verify.ts
│ └── WindowEvent.ts

<!-- #### API 详解

**Browser**

**judgeBigScreen ()=> boolean**
判断是否刘海屏
**rem2px (n: number, base = 750)=> number**
rem 转换成 px
**getScrollTop ()=> number**
获取滚动条位置
**setScrollTop (top: number, smooth = false)=> void**
滚动到指定位置
**getHeightByRate (width: number, type = SizeRatioType.HORIZONTAL)=> number**
根据 16:9 比例换算高度 默认 16:9
**getWidthByRate (width: number, type = SizeRatioType.HORIZONTAL)=> number**
根据 16:9 比例换算宽度 默认 16:9 -->
