# dsh-token-usage — DSH Token 用量统计插件

[![npm version](https://img.shields.io/npm/v/@zerro223/dsh-token-usage.svg)](https://www.npmjs.com/package/@zerro223/dsh-token-usage)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-zerro--223%2Fdsh--token--usage-181717?logo=github)](https://github.com/zerro-223/dsh-token-usage)

在 DeepSeek Harness Web UI 的侧边栏底部（设置按钮旁）增加「Token 用量」入口，
打开一个统计面板，按 **API（provider）**、**模型** 和 **日期** 分类展示模型调用的
Token 消耗，并配有流畅的入场/更新动画（数字滚动、柱状图生长、环形图描边、
逐项 stagger），自动适配深色/浅色主题（复用 DSH 的 `--dsw-*` 设计令牌）。

## 界面预览

![曲线图](https://raw.githubusercontent.com/zerro-223/dsh-token-usage/main/%E6%9B%B2%E7%BA%BF%E5%9B%BE.png)

*趋势图：输入 / 输出 / 缓存命中 / 成本曲线*

![热力图](https://raw.githubusercontent.com/zerro-223/dsh-token-usage/main/%E7%83%AD%E5%8A%9B%E5%9B%BE.png)

*每日用量热力图：近一年按天展示 Token 用量*

![模型汇总与最近请求](https://raw.githubusercontent.com/zerro-223/dsh-token-usage/main/%E6%A8%A1%E5%9E%8B%E6%B1%87%E6%80%BB%E4%B8%8E%E6%9C%80%E8%BF%91%E8%AF%B7%E6%B1%82.png)

*模型汇总与最近请求：按模型统计，支持导出*

![模型价格配置](https://raw.githubusercontent.com/zerro-223/dsh-token-usage/main/%E6%A8%A1%E5%9E%8B%E4%BB%B7%E6%A0%BC%E9%85%8D%E7%BD%AE.png)

*模型价格配置：自动同步价格，支持手动覆盖*

## 工作原理

- **Node 端**（`lib/index.js`）：监听 `llm/stream` waterfall 事件，捕获每次
  模型调用的 `usage` chunk（输入 / 输出 / 缓存读 / 缓存写 / 推理 tokens），
  逐条追加持久化到 `~/.dsh/storages/token-stats/usage.jsonl`，并通过
  `/token-stats/api/overview?days=5h|hour|7|month|30|90|year|custom&start=...&end=...&provider=xxx&model=xxx`
  提供聚合结果（时间序列 `series`、统计 `totals`、缓存命中率
  `cacheHitRate`、筛选下拉选项 `filterOptions`）；另提供轻量
  `/token-stats/api/heatmap?days=364` 接口供热力图使用，以及
  `/token-stats/api/export`（流式 NDJSON 导出全部历史记录）和
  `/token-stats/api/clear`（清空历史）。聚合为单趟扫描（50 万条记录每次请求
  约 75–130ms，原实现约 300ms，且不再为每个模型累积临时记录数组），
  价格为按模型缓存查找。
- **浏览器端**（`lib/client.js`）：注册 `sidebar.footer.action` 槽位
  （id `token-usage`），点击后打开统计面板：
  - 6 张统计卡：总 Tokens、请求数、输入、输出（含推理提示）、总命中率、估算成本（USD）
    （DeepSeek 等多数 provider 不报告 cache 读写明细，故不单列缓存卡片）
  - 成本估算：按模型单价（$ / 100万 tokens，输入 / 输出 / 缓存读 / 缓存写）× 实际用量计算；
    价格自动同步自 [modelradar.cn](https://modelradar.cn)（启动时拉取 + 每日刷新，
    缓存于 `prices-auto.json`）。注意单位：modelradar 数据集按模型原生币种计价
    （294 个模型里 183 个为 CNY），插件统一取数据集的 `*PriceUsdPer1M` 换算字段
    存成 USD，CNY 来源的模型在面板中标注「自动·源CNY」；「$」按钮可查看自动匹配结果、
    按名称搜索模型、手动覆盖或强制刷新；手动价格优先于自动价格，未定价模型会在成本卡上提示
  - 大趋势图：按「输入(深蓝) / 输出(琥珀) / 缓存命中(绿) / 成本(红)」四条纯线条平滑曲线（单调插值，
    无过冲越界，背景色光环描边保证交叉处清晰），不加面积填充；
    token 曲线共用左侧 y 轴，成本曲线使用右侧 `$` y 轴；
    点击图例可隐藏/显示任意曲线（y 轴自动重定标，便于对比任意两条）；
    支持区间切换（5小时 / 当日 / 近7天 / 当月 / 近30天 / 近90天 / 今年 / 自定义（最长30天）），
    x 轴按整段横轴均分，悬停显示十字线与明细；切换 API / 模型 / 日期范围时会平滑过渡曲线；
    单数据点（如当日 0 点档）时绘制圆点而非隐形的零长度曲线
  - 每日用量热力图（GitHub Contribution 风格）：近一年（52 周）按天展示 Token 用量，
    左侧带周几标识，蓝色越深表示当天用量越高，悬停可查看具体日期与用量；
    跟随当前 API / 模型筛选
  - 模型汇总表：按模型展示请求数、输入、输出、缓存命中、缓存写、估算成本；点击行可筛选图表
  - 数据导出：最近请求卡片右上角的导出菜单支持 JSONL（全部历史记录，流式下载）、
    JSON（当前视图）、CSV（最近请求）、CSV（模型汇总），
    以及两步确认的「清空全部历史」操作（清除内存窗口并截断 storage 文件）
  - 模型 / API 筛选：只查看指定模型或提供方的数据（统计卡与图表同步过滤）
  - 最近请求：最新 30 条调用记录（时间 / API / 模型 / tokens，悬停可查看用途与会话 ID），
    列表限高滚动
  - 每 15 秒自动刷新，也可手动刷新；标签页隐藏时暂停后台轮询，手动刷新不受影响

## 安装

### 方式一：npm 安装（推荐）

```sh
dsh plugin --profile web add @zerro223/dsh-token-usage
```

包声明了 `dsh.bundle.patch`，`dsh plugin` 会在 pnpm 安装后自动把它加入
profile 的 layer 栈（无需手动改 `cordis.patch.yml`）。重启 DSH Web 生效。
其他 profile（tui / headless）把 `web` 换成对应名字即可，数据共享同一份存储。

### 方式二：本地源码安装

1. 将 `@zerro223/dsh-token-usage` 目录复制到 profile 的 `node_modules`：
   ```
   C:\Users\<you>\.dsh\profiles\web\node_modules\@zerro223/dsh-token-usage\
   ```
2. 在 `C:\Users\<you>\.dsh\profiles\web\cordis.patch.yml` 中追加：
   ```yaml
   - insert:
       - id: token-usage
         name: '@zerro223/dsh-token-usage'
   ```
3. 重启 DSH Web（`dsh web`），打开 `http://127.0.0.1:3080`。

### 方式三：本地目录 / Git 仓库安装

```sh
# 本地目录（file: 协议，绝对路径或相对路径均可）
dsh plugin --profile web add file:D:/path/to/dsh-token-usage

# GitHub 仓库（需要 allowBuilds 时按 pnpm 提示配置）
dsh plugin --profile web add github:zerro-223/dsh-token-usage
```

## 数据

- 存储位置：`~/.dsh/storages/token-stats/usage.jsonl`（每请求一行 JSON）。
- 内存上限：最近 50 万条记录（超出时丢弃最旧）。
- 文件超过 128MB 会自动压缩为最近 50 万条，避免磁盘无限增长；压缩前会先合并
  磁盘上当前存在的最新记录（按行键去重），因此多个 profile 共享同一存储时
  不会互相覆盖丢数据。
- profile 说明：插件依赖 `webServer` 服务（当前 cordis 版本不支持可选注入），
  因此记录与统计仅在有 web 服务的 profile（如 `web`）中激活；不同 profile 间
  的存储文件仍在磁盘层面共享（压缩时合并、不丢数据）。
- 重试 / 重复请求：每次真实到达 provider 的调用都会记录（`llm/stream`
  瀑布每次调用触发一次；llm-retry 的重试经由 agent loop 的
  `agent/request-error` 重新发起请求，因此每次尝试都会计入）。
- 卸载插件不会删除历史数据；重新启用即恢复统计（「清空全部历史」除外）。

## 开发

- `lib/index.js`：node half（无第三方运行时依赖，仅 `@deepseek-ai/dsh-home-paths`）。
- `lib/client.js`：browser half（`__ModuleLoader__.load` 格式，依赖
  react / `@deepseek-ai/dsh-client-ui-primitives`，无第三方图表库，
  图表全部为手写 SVG / CSS 动画）。
