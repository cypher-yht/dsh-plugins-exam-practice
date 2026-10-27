# Client → Host 数据通道调查（api-scout）

> 调查对象：DSH 0.2.1-rc.3（`app.asar\dsh\`）+ 本机 profile `C:\Users\Administrator\.dsh\profiles\desktop\`。
> 结论依据是源码 + 本机两个「已安装、与我们要做的事完全同类」的第三方插件；本环境 shell 不可用，未能做 live HTTP 探测（见文末「方法与限制」）。

---

## 结论

**在页面里直接 `fetch('/exam-practice/api/bank', { cache: 'no-store' })` 完全可行：`ctx.webServer.register` 注册的 exact/prefix 路由是「裸 HTTP 路由」，不经过 Connection 的连接鉴权/准入层；不需要 token、不需要特殊 header，同源相对路径即可。** 唯一硬性要求是路径形态正确：**注册 prefix 时必须用 `/exam-practice`（不带尾斜杠）**，或用两个 `exact` 路由；写成 `/exam-practice/` 会导致子路径全部 404。另外它是未鉴权路由，建议照本机范本补一个 loopback/origin 防护。

---

## 1. 四个问题的直接回答

### Q1：页面里普通同源 `fetch('/exam-practice/api/bank')` 会被连接鉴权/准入层拦吗？

**不会。** 不需要 token、cookie、特殊 header、特殊前缀。

- `webServer` 的 HTTP 分发只做三件事：查 exact 路由 → 查最长 prefix 路由 → 交给 fallback；**没有任何 harness 鉴权中间件**。官方文档注释原文：*"It knows no harness concepts and serves no files"*（`dsh-host-webserver\lib\index.js:104`），分发代码见 `:377-393`（`route.handler(req,res)` 直接调用，唯一的外层是 gzip，`:395-409`）。
- 全局唯一的准入层是 **`/api` 这条 prefix 路由自己的 handler 内部**（`ctx.connection.admit()`），不是中间件，只作用于 `/api/*`（`dsh-client-connection\lib\index.js:1044-1058`）。
- 浏览器鉴权 cookie 只在**服务 index.html** 时校验：`frontend-static` 的 fallback 对 `index` 调 `ctx.connection.authorizeIndex(...)`（`dsh-host-frontend-static\lib\index.js:87-96`，尤其 `:95`），注释明确 *"Non-index assets stay public"*（`:9-14`）。
- 本机已安装并启用的插件 `@local/dsh-price-badge` 与 `dsh-dafeiyu` 正是这个模式（见 §4）：它们的界面功能依赖同源裸 `fetch` 自己注册的路由，说明该模式在本机 profile 中被实际采用。

注意：**不能**把接口挂到 `/api/...` 路径上再指望绕过准入——`/api` 由 Connection 独占；反过来，若挂到 `/api` 下则会命中准入（要浏览器 cookie）。我们的 `/exam-practice/...` 与它平级，互不影响。

### Q2：`ctx.webServer.register` 的 prefix/exact 路由与内置 `/api` 通道的调度关系？

同一台 `webServer` 上的**平行路由**，调度顺序在 `WebServer.match()` 里写死：

```
exact 表命中 → 否则 prefixes 表「最长前缀」命中 → 否则 fallback
```
证据：`dsh-host-webserver\lib\index.js:377-393`（handler 主流程）与 `:494-504`（`match()`）：
```js
const exact = this.exact.get(pathname);
if (exact !== void 0) return exact;
let best;
for (const [prefix, route] of this.prefixes) {
  if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) continue;  // ← 尾斜杠陷阱
  if (best === void 0 || prefix.length > best.path.length) best = route;
}
```

- `/api` 只是 Connection 注册的一条 **prefix 路由**：`path: API_PATH`（`'/api'`），并在自己的 handler 里先 `connection.admit(req)` 再 `bridge(...)`，见 `dsh-client-connection\lib\index.js:14`、`:1044-1058`。`/connect` 是另一条 exact 路由（`:1059-1065`）。
- **`createSharedFetchHandler('/api')` 只能服务 `/api/*`**：`assertFetchRoute()` 强制 path 必须落在 `/api` 下（`dsh-client-connection\lib\index.js:973-977`），interceptor 的 channel 也只允许 `'/api'`（`:873-886`）。它由 `/api` 路由内部消费（`:1044`），**不能**拿来挂到 `/exam-practice`。
- 结论：`/exam-practice/*` 永远走我们自己的 handler；既不会被 `/api` 的 admission 拦，也不会抢 `/api`。

### Q3：万一 fetch 不可行的备选通道（结论：本题用不上，列出供存档）

| 通道 | 是否可用 | 原因 / 证据 |
|---|---|---|
| `ctx.connection.fetch.register({ path:'/api/...' })`（exact fetch route，**仍走 fetch，但复用 `/api` 通道的鉴权**） | 可用，是唯一不破坏契约的备选 | `connection.fetch` 服务 `:731-735`、注册 `:840-854`；随 `/api` handler 派发 `:820-839`；path 必须是 `/api/<seg>`（`:973-977`）。需要浏览器已被 index 授权（页面里本来就有 cookie）。 |
| 自定义 RPC channel `ctx.connection.rpc.handle('/xxx', handler)` | 宿主侧可注册，但**浏览器侧要引入 shipped client 包** | 宿主注册 `:855-872`；浏览器侧调用是 `connection.rpc.call('/api', ...)`（`dsh-api-gateway\lib\client.browser.js:1826`），`connection` 的浏览器半边属于 `@deepseek-ai/dsh-client-connection/client` —— CONTRACT 禁止引入 Harness Client 包，故不用。 |
| Typert Remote（`ctx.remote.*`，如 commands 的 remote client） | **无构建插件不可用** | 浏览器侧 Remote 由编译器生成的 spec + zod 挂载：`createTypertRemoteInfo(spec, zod)`（`dsh-api-remotes\lib\client.js:8-20`），按 namespace 生成 Cordis 服务 `remote.<namespace>`（`dsh-api-gateway\lib\client.browser.js:2074-2076`、`:1953-1964`）；`commands` 的浏览器侧是单独生成的 `./remote` → `lib/typert.remote-client.*`（`dsh-commands\package.json:29-36`）。纯手写 JS 无法新建 Remote，只能 require 已生成的 shipped 包；而且命令是「人机命令注册表」（`dsh-commands` 描述），不是读数据的通道。 |
| fallback / SPA 注入 | 不存在该能力 | fallback 座位唯一（`webServer.registerFallback`，`dsh-host-webserver\lib\index.js:355-361`），已被 `frontend-static` 占用（`dsh-host-frontend-static\lib\index.js:87-96`）。 |

**推荐仍然是 Q1 的裸 prefix 路由**：零依赖、同源、GET 即可、不涉及任何鉴权握手。

### Q4：本机其它 installed 插件里的同类范本（可直接照抄）

1. **`@local/dsh-price-badge`（最接近的范本，本 profile 已安装并 link 到工作区）**
   - Host：`D:\大肥鱼的家\dsh-price-badge\index.js:12`（`BALANCE_PATH = '/plugins/price-badge/balance'`）、`:92-97`（`ctx.inject(['webServer'], httpCtx => httpCtx.effect(() => httpCtx.webServer.register({ kind:'exact', path, handler })))`）。
   - Client：`D:\大肥鱼的家\dsh-price-badge\client.js:10`、`:147-165`（`fetch(BALANCE_ENDPOINT, { cache:'no-store' })`，**无 token/header**）。
   - 已列在 profile bundles：`C:\Users\Administrator\.dsh\profiles\desktop\package.json:5,28`。
2. **`dsh-dafeiyu`（第三方 tgz 安装，exact + prefix + 资产路由都覆盖）**
   - 安装副本：`C:\Users\Administrator\.dsh\profiles\desktop\node_modules\dsh-dafeiyu\`（来源 `package.json:7` 的 `file:D:/大肥鱼的家/dsh-dafeiyu-0.1.0-alpha.7.tgz`）。
   - Host：`src\index.js:21-23`（3 个 endpoint 常量）、`:117-125`（jsonResponse）、`:127-129`（isLoopback）、`:146-176`（handler：loopback + Origin 校验 + 405）、`:430-445`（`exact` `/plugins/dsh-dafeiyu/config`、`exact` `/plugins/dsh-dafeiyu/open-folder`、`prefix` `/plugins/dsh-dafeiyu/assets`）。
   - Client：`lib\client.js:6-8`、`:94-115`（同源 `fetch` 读 config 与 assets）。
3. `@local/dsh-session-view`（`D:\大肥鱼的家\dsh-session-view\`）是纯 Client 插件（`index.js` 的 `apply()` 为空），说明本 profile 同时存在纯前端插件，不构成本题通道。

---

## 2. 推荐实现（可直接抄）

### 2.1 Host 侧（`index.js`）——与现有实现核对

现有 `index.js:23,34-38` 已经是正确形态（`ROUTE_PREFIX = '/exam-practice'` 无尾斜杠 + `kind:'prefix'`），**不需要改**。要点如下（若要重写，按此模板）：

```js
// index.js（Host 半边，节选）
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROUTE_PREFIX = '/exam-practice'        // ⚠️ 不要写 '/exam-practice/'（见 §3.1）

export const inject = ['webServer']          // 等 webServer 就绪后再 apply

export function apply(ctx) {
  const bankDir = path.join(HERE, 'bank')
  ctx.effect(
    () => ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE_PREFIX,
      handler: (req, res) => handle(req, res, bankDir),
    }),
    'exam-practice: read-only bank routes',
  )
}

async function handle(req, res, bankDir) {
  // 这些路由没有内置准入层，可选做本机/同源防护（见 §3.4）
  const method = String(req.method || 'GET').toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') {
    req.resume()
    return sendJson(res, 405, { ok: false, error: 'method not allowed' })
  }
  const pathname = new URL(String(req.url || '/'), 'http://localhost').pathname.replace(/\/+$/, '') || '/'
  if (pathname === `${ROUTE_PREFIX}/api/health`) return sendJson(res, 200, { ok: true })
  if (pathname === `${ROUTE_PREFIX}/api/bank`) {
    try {
      const bank = await loadBank(bankDir)   // 每次请求实时读 bank/*.json
      return sendJson(res, 200, { ok: true, ...bank, updatedAt: new Date().toISOString() })
    } catch (error) {
      return sendJson(res, 500, { ok: false, error: String(error?.message ?? error) })
    }
  }
  return sendJson(res, 404, { ok: false, error: 'not found' })
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Length', Buffer.byteLength(body))
  res.end(body)                                // HEAD 时 node 会丢弃 body
}
```

> 等价写法：两个 `exact` 路由（`/exam-practice/api/bank`、`/exam-practice/api/health`）也完全可行，且更精确；用 `prefix` 还能顺手支持 `/exam-practice/api/bank/` 之类的尾斜杠变体。

### 2.2 Client 侧（`client.js`）

```js
const BANK_ENDPOINT = '/exam-practice/api/bank'   // 必须带前导 '/'（页面有 <base href="./">，见 §3.3）

async function fetchBank() {
  const response = await fetch(BANK_ENDPOINT, {
    cache: 'no-store',
    headers: { accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`bank request failed: HTTP ${response.status}`)
  const data = await response.json()              // 失败路径、404、500 都会抛错 → 走 DEMO 降级
  if (!data || data.ok !== true || !Array.isArray(data.papers)) {
    throw new Error(data?.error || 'invalid bank payload')
  }
  return data
}

// 用法：在 Page 组件里
// const [source, setSource] = React.useState('loading')  // 'host' | 'demo'
// React.useEffect(() => { fetchBank().then(d => { setBank(d.papers); setSource('host') })
//   .catch(() => { setBank(DEMO_BANK); setSource('demo') }) }, [])
// 刷新按钮 = 再调一次 fetchBank()
```

`fetch` 就够，不需要 `credentials: 'include'`（同源默认带 cookie，但我们的路由根本不看 cookie）、不需要 token、不需要 `X-*` header。

---

## 3. handler 注意事项（fetch 可行时最容易踩的坑）

1. **❌ prefix 尾斜杠陷阱（最高优先级）**
   `match()` 的判据是 `pathname === prefix || pathname.startsWith(prefix + '/')`（`dsh-host-webserver\lib\index.js:500`）。若注册 `path: '/exam-practice/'`，那么 `/exam-practice/api/bank` 既不等于它、也不以 `'/exam-practice//'` 开头 → **不匹配**，落 fallback → 404（不是 JSON）。必须注册 `/exam-practice`（无尾斜杠）。
2. **不会被 SPA fallback 抢走，但 fallback 也不兜底成 index.html**
   fallback 只在所有命名路由都没命中时才运行；且 `frontend-static` 的 fallback 只对 `distRoot` 或 `index.html` 渲染 index（`dsh-host-frontend-static\lib\index.js:59-62`），未知路径读不到文件直接 **404**（`:67-72`）。所以路径写错时客户端拿到的是 `404` 文本，客户端要把非 2xx 当失败降级（DEMO 题库 + 提示），不要直接 `response.json()`。
3. **路径必须以 `/` 开头（页面注入了 `<base href="./">`）**
   `renderIndex` 后会把 `<head>` 换成 `<head><base href="./">`（`dsh-host-frontend-static\lib\index.js:85`），相对路径的解析基准变成当前 URL 目录。始终使用 `/exam-practice/api/bank` 这种绝对路径。
4. **这几个路由没有鉴权，按需自防**
   本 profile 的 webserver 绑定 `127.0.0.1`（GUI URL 就是 `http://127.0.0.1:60011`），且 webserver 拒绝 wildcard 绑定（`dsh-host-webserver\lib\index.js:255` 的 Config 校验）。若只服务本机，可加与本机范本一致的防护：
   - loopback 校验：`req.socket.remoteAddress ∈ {127.0.0.1, ::1, ::ffff:127.0.0.1}`（`dsh-dafeiyu\src\index.js:127-129,148-151`；`dsh-price-badge\index.js:25-27,60-63`）；
   - 或 Origin 校验：有 `origin` header 时要求其 host === `req.headers.host`（`dsh-dafeiyu\src\index.js:152-160`）。
   注意：若将来用 `--public-url` / 非 loopback 绑定给局域网/代理用，硬编码 loopback 校验会把正常客户端也拒掉，届时只保留 Origin 校验。
5. **响应头必须显式给**
   路由 handler 拥有完整响应生命周期（`dsh-host-webserver\lib/index.js:100-107`），不会替我们设置任何 header：必须 `Content-Type: application/json; charset=utf-8` + `Cache-Control: no-store`（CONTRACT 要求，范本 `dsh-price-badge\index.js:15-23` 同款）。
6. **HEAD / 405**
   node 不会替我们处理 HEAD。当前 `sendJson` 对 HEAD 会照常 `end(body)`，node 会丢弃 HEAD 的响应体，一般无碍；若想严格，可在 HEAD 分支只 `writeHead(200, {content-type...}); res.end()`。非 GET/HEAD 建议 `req.resume()` 排空请求体后返回 405 JSON（现有 `index.js:47-51` 已这样做）。
7. **gzip 是自动的**
   此 profile 的 webserver 配了 `compression: gzip, compressionThresholdBytes: 1024`（`dsh-web-app\cordis.patch.yml:186-188`），大于 1KB 的 JSON 会被 gzip；不要自己设置 `Content-Encoding`。手动设置的 `Content-Length` 会被 compression 中间件在压缩时移除/改写，属正常。
8. **异常兜底**
   handler 抛错会被 webserver 捕获并返回 400（`dsh-host-webserver\lib/index.js:395-409`），所以读取/序列化失败要在 handler 内部 `try/catch` 转成 CONTRACT 要求的 `500 { ok:false, error }`（现有实现已如此，`:75-77`）。
9. **注册去重**
   `register()` 对同一 `(kind,path)` 重复注册会 **throw**（`dsh-host-webserver\lib/index.js:326-333`），所以务必用 `ctx.effect(() => ctx.webServer.register(...))` 包住，卸载时自动释放（现有实现正确，`:34-38`）。
10. **不要把数据通道挂到 `/api`**
    `/api` 由 Connection 独占（`dsh-client-connection\lib\index.js:1044-1058`）；在 `/exam-practice` 下我们与它完全解耦。只有当你想复用浏览器鉴权时才用 §Q3 的 `connection.fetch.register('/api/...')`。

---

## 4. 证据（绝对路径 + 行号）

**官方实现（app.asar 内，只能 read）**

| 事实 | 路径 | 位置 |
|---|---|---|
| webServer「不含 harness 概念」、handler 拥有响应 | `C:\Users\Administrator\AppData\Local\Programs\DeepSeek Harness\resources\app.asar\dsh\node_modules\@deepseek-ai\dsh-host-webserver\lib\index.js` | `:100-107` |
| 路由注册（重复抛错、返回 disposer） | 同上 | `:326-333` |
| fallback 注册（唯一座位） | 同上 | `:355-361` |
| 请求分发：exact → prefix → fallback，无鉴权 | 同上 | `:377-394` |
| `match()` 最长前缀 + 尾斜杠规则 | 同上 | `:494-504` |
| `/api` 前缀常量 | `...\@deepseek-ai\dsh-client-connection\lib\index.js` | `:13-14` |
| `admit()` = Host/Origin fence + 浏览器凭据 | 同上 | `:736-750` |
| `createSharedFetchHandler` 只服务 `/api` 路径 | 同上 | `:820-839` |
| RPC channel 注册（prefix + admit） | 同上 | `:855-872` |
| `assertFetchRoute` 强制 path 在 `/api` 下 | 同上 | `:973-977` |
| `/api` 与 `/connect` 路由的挂载 | 同上 | `:1027-1065` |
| fallback 只在 index 时做 authorizeIndex | `...\@deepseek-ai\dsh-host-frontend-static\lib\index.js` | `:5-16`, `:59-62`, `:85`, `:87-96` |
| web 组合：webserver / web-runtime / connection 行 | `...\@deepseek-ai\dsh-web-app\cordis.patch.yml` | `:179-188`, `:197-204`, `:230-241` |
| web-app 挂载 frontend-static | `...\@deepseek-ai\dsh-web-app\lib\index.js` | `:148` |
| Typert Remote 需生成的 spec | `...\@deepseek-ai\dsh-api-remotes\lib\client.js` | `:8-20`, `:43-76` |
| 浏览器 Remote 服务键 `remote.<namespace>` / 走 `connection.rpc.call('/api',...)` | `...\@deepseek-ai\dsh-api-gateway\lib\client.browser.js` | `:2074-2076`, `:1953-1964`, `:1826` |
| commands 的浏览器侧是生成产物 `typert.remote-client` | `...\@deepseek-ai\dsh-commands\package.json` | `:29-36` |

**本机范本（真实文件，可 grep/read）**

| 事实 | 路径 | 位置 |
|---|---|---|
| price-badge host：exact 路由 + jsonResponse + loopback | `D:\大肥鱼的家\dsh-price-badge\index.js` | `:12`, `:15-23`, `:25-27`, `:59-67`, `:92-97` |
| price-badge client：裸 `fetch(endpoint, {cache:'no-store'})` | `D:\大肥鱼的家\dsh-price-badge\client.js` | `:10`, `:147-165`, `:352-363` |
| dafeiyu host：exact+prefix 三路由、loopback/origin/405 | `C:\Users\Administrator\.dsh\profiles\desktop\node_modules\dsh-dafeiyu\src\index.js` | `:21-23`, `:117-125`, `:127-129`, `:146-176`, `:430-445` |
| dafeiyu client：同源 fetch config/assets | `C:\Users\Administrator\.dsh\profiles\desktop\node_modules\dsh-dafeiyu\lib\client.js` | `:6-8`, `:94-115` |
| 两者都已安装进本 profile | `C:\Users\Administrator\.dsh\profiles\desktop\package.json` | `:4-8`（deps）、`:11-29`（bundles） |
| profile 自身 patch（未覆盖上面两行插件） | `C:\Users\Administrator\.dsh\profiles\desktop\cordis.patch.yml` | 全文 |

---

## 5. 方法与限制（诚实说明）

- `app.asar` 内的文件用 `read` 工具读取（原生 ripgrep / glob 进不去 asar，`grep` 返回 `os error 3`；已验证）。
- 本环境的 `pwsh` 无法启动（`[exit code: 3221225794]` = `STATUS_DLL_INIT_FAILED`），`web_fetch` 走的是 DeepSeek 远端 fetch API（无法访问 `127.0.0.1:60011`），client 侧 `cordis_inspect_query`（platform: client）两次超时（当时没有已连接的页面）——**因此没有做 live HTTP 探测**。
- 上述结论来自 ① 官方源码的调度/路由/鉴权实现；② 同一 profile 内两个已安装并启用的第三方插件使用完全相同模式。风险点已用「⚠️」标出；安装后可用浏览器控制台 5 秒自测：
  ```js
  fetch('/exam-practice/api/bank', { cache: 'no-store' }).then(r => r.json()).then(console.log)
  // 期望 200 + { ok:true, papers:[...] }；若 404，先检查 prefix 是否写成了 '/exam-practice/'
  ```
