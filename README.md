# dsh-token-usage — DSH Token 用量统计插件

在 DeepSeek Harness Web UI 的侧边栏底部（设置按钮旁）增加「Token 用量」入口，
打开一个统计面板，按 **API（provider）**、**模型** 和 **日期** 分类展示模型调用的
Token 消耗，并配有流畅的入场/更新动画（数字滚动、柱状图生长、环形图描边、
逐项 stagger），自动适配深色/浅色主题（复用 DSH 的 `--dsw-*` 设计令牌）。

> npm 上的 `dsh-token-stats` 名称已被其他作者占用，本包名为 `dsh-token-usage`。

## 工作原理

- **Node 端**（`lib/index.js`）：监听 `llm/stream` waterfall 事件，捕获每次
  模型调用的 `usage` chunk（输入 / 输出 / 缓存读 / 缓存写 / 推理 tokens），
  逐条追加持久化到 `~/.dsh/storages/token-stats/usage.jsonl`，并通过
  `/token-stats/api/overview?days=hour|7|month|30&provider=xxx&model=xxx`
  提供聚合结果（时间序列 `series`、统计 `totals`、缓存命中率
  `cacheHitRate`、筛选下拉选项 `filterOptions`）。
- **浏览器端**（`lib/client.js`）：注册 `sidebar.footer.action` 槽位
  （id `token-usage`），点击后打开统计面板：
  - 7 张统计卡：总 Tokens、请求数、输入、输出（含推理提示）、缓存读、缓存写、总命中率
  - 大趋势图：按「未命中输入(深蓝) / 缓存命中(绿) / 输出(琥珀)」三色平滑曲线（单调插值，
    无过冲越界）+ 渐变面积，y 轴带刻度与单位（M/K token）；支持区间切换
    （当日近5小时按小时粒度、近7天、当月、近30天按天粒度），x 轴按整段
    横轴均分，悬停显示十字线与明细
  - 模型 / API 筛选：只查看指定模型或提供方的数据（统计卡与图表同步过滤）
  - 最近请求：最新 30 条调用记录（时间 / API / 模型 / tokens）
  - 每 15 秒自动刷新，也可手动刷新

## 安装

### 方式一：已发布到 npm 后（推荐）

```sh
dsh plugin --profile web add dsh-token-usage
```

包声明了 `dsh.bundle.patch`，`dsh plugin` 会在 pnpm 安装后自动把它加入
profile 的 layer 栈（无需手动改 `cordis.patch.yml`）。重启 DSH Web 生效。
其他 profile（tui / headless）把 `web` 换成对应名字即可，数据共享同一份存储。

### 方式二：本地源码安装

1. 将 `dsh-token-usage` 目录复制到 profile 的 `node_modules`：
   ```
   C:\Users\<you>\.dsh\profiles\web\node_modules\dsh-token-usage\
   ```
2. 在 `C:\Users\<you>\.dsh\profiles\web\cordis.patch.yml` 中追加：
   ```yaml
   - insert:
       - id: token-usage
         name: 'dsh-token-usage'
   ```
3. 重启 DSH Web（`dsh web`），打开 `http://127.0.0.1:3080`。

### 方式三：本地目录 / git 直接安装（无需发布）

```sh
# 本地目录（file: 协议，绝对路径或相对路径均可）
dsh plugin --profile web add file:D:/path/to/dsh-token-usage

# GitHub 仓库（需要 allowBuilds 时按 pnpm 提示配置）
dsh plugin --profile web add github:your-name/dsh-token-usage
```

## 开源与发布（npm + GitHub）

### 1. 推到 GitHub

```sh
git init
git add .
git commit -m "feat: token usage statistics plugin"
git remote add origin https://github.com/<you>/dsh-token-usage.git
git push -u origin main
```

发布前记得：
- 在 `package.json` 补上 `repository` 字段指向你的仓库；
- 可选：GitHub Releases + 自动发布（见下文 CI）。

### 2. 发布到 npm

```sh
npm login                     # 首次需要，npm 账号
npm version patch             # 打版本号（1.0.0 -> 1.0.1）
npm publish                   # 发布
```

发布前用 `npm pack --dry-run` 检查包里包含哪些文件（`files` 白名单：
`lib`、`cordis.patch.yml`、`README.md`、`LICENSE`）。

### 3. 可选：GitHub Actions 自动发布

`.github/workflows/publish.yml`：

```yaml
name: Publish to npm
on:
  push:
    tags: ['v*']
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: https://registry.npmjs.org
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

打 tag 即发布：`git tag v1.0.0 && git push --tags`。

### 版本兼容性提示

- 依赖 `@deepseek-ai/dsh-home-paths`（node half 使用）与 `@deepseek-ai/cordis`
  已在 `peerDependencies` 声明，DSH 自带这些包，使用者无需额外安装。
- 浏览器端 require 的 `react` / `@deepseek-ai/dsh-client-ui-primitives` 等由
  DSH Web 的平台模块表提供，无需 npm 安装。

## 数据

- 存储位置：`~/.dsh/storages/token-stats/usage.jsonl`（每请求一行 JSON）。
- 内存上限：最近 50 万条记录（超出时丢弃最旧）。
- 重试 / 重复请求：每次真实到达 provider 的调用都会记录（`llm/stream`
  位于 llm-retry 内部，重试的每次尝试都计入）。
- 卸载插件不会删除历史数据；重新启用即恢复统计。

## 开发

- `lib/index.js`：node half（无第三方运行时依赖，仅 `@deepseek-ai/dsh-home-paths`）。
- `lib/client.js`：browser half（`__ModuleLoader__.load` 格式，依赖
  react / `@deepseek-ai/dsh-client-ui-primitives`，无第三方图表库，
  图表全部为手写 SVG / CSS 动画）。
