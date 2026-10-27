# 考试练习插件 (Exam Practice) — 实现契约

目的：在 DeepSeek Harness Web UI 里增加一个「四六级刷题」主面板插件，支持
1) AI 帮忙导入题型/题库（AI 把 JSON 写进题库目录，插件在线读取）；
2) 在线上做题（选择题自动判分、主观题看参考范文/译文、错题回顾）。

## 产物位置

插件包目录（bundle 源码，install_bundle 直接安装这个目录）：

```
D:\大肥鱼的家\exam-practice-plugin\
  package.json          # bundle manifest + dsh.bundle.patch + dsh.client
  cordis.patch.yml      # 插入 host 行
  index.js              # Host 半边：注册 HTTP 只读接口 + 读题库目录
  client.js             # Client 半边：sidebar 图标 + main 面板（React，纯 JS，无构建）
  locale/en.json
  locale/zh.json
  icon.svg
  bank/*.json           # 题库（AI 可直接写入；Host 每次请求实时读取）
  CONTRACT.md           # 本文件
```

- 包名 / 客户端 id / 面板 key：`@local/exam-practice`、`exam-practice`
- Host 行 id：`exam-practice`
- Host HTTP 路由前缀：`/exam-practice/`，只读接口：
  - `GET /exam-practice/api/bank` → `{ ok: true, papers: Paper[], updatedAt: string, bankDir: string, warnings: string[] }`
  - `GET /exam-practice/api/health` → `{ ok: true }`
  返回 JSON，`Content-Type: application/json; charset=utf-8`，必须带 `Cache-Control: no-store`。
- 失败时返回 `{ ok: false, error: string }` 且 HTTP 500，客户端必须能降级（内置 DEMO 题库 + 提示「未连接 Host 题库」）。

## 题库数据模型

`bank/*.json` 每个文件一个对象 `{ "papers": [Paper, ...] }`（也可以直接是 `Paper`）。Host 合并所有文件的 papers，按 `level` 再按 `year` 倒序。

```jsonc
{
  "papers": [
    {
      "id": "cet4-2024-12",              // 全局唯一，kebab-case
      "title": "2024年12月大学英语四级（节选）",
      "level": "CET4",                    // "CET4" | "CET6"
      "year": "2024-12",
      "durationMinutes": 130,
      "tags": ["真题改编", "阅读"],
      "sections": [
        {
          "id": "writing",
          "title": "Writing 写作",
          "type": "writing",              // writing | listening | reading | translation
          "prompt": "Directions: ... (英文题干)",
          "promptZh": "中文提示（可选）",
          "reference": "参考范文（可选，主观题用）",
          "wordLimit": 120,
          "questions": []
        },
        {
          "id": "listening",
          "title": "Listening 听力",
          "type": "listening",
          "note": "音频以文字稿形式提供",
          "questions": [
            {
              "id": "l1",                 // section 内唯一
              "kind": "choice",           // "choice" | "blank"
              "stem": "What does the man suggest the woman do?",
              "transcript": "Man: ...\nWoman: ...",   // 听力文字稿（可选）
              "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
              "answer": "B",              // choice: "A"|"B"|"C"|"D"；blank: 标准答案文本
              "explanation": "中文解析"
            }
          ]
        }
      ]
    }
  ]
}
```

规则
- `kind: "choice"` 必须有 4 个 options（数组，带 `A.` 前缀），`answer` 是单个大写字母。
- `kind: "blank"` 没有 options，`answer` 可为多个可接受答案之一，用 `|` 分隔，例如 `"were|was"`。
- 主观题（writing / translation）没有题目，只有 prompt + reference，客户端不算分、只展示参考答案。
- 所有文本用 UTF-8，中文解析用中文。题干/选项保持英文原样。
- **JSON 必须严格合法**（不能有注释、尾逗号）；`id` 必须唯一。

## Client 技术要求

- 单文件 `client.js`，格式固定：

```js
window.__ModuleLoader__.load({
  id: '@local/exam-practice',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    // ... 组件
    return { inject: ['slots', 'locale'], apply(ctx) { /* ctx.slots.inject(...) */ } }
  },
})
```

- 不允许引入任何 Harness Client 包（`@deepseek-ai/dsh-client-ui-primitives` 等），不允许 JSX（无构建）。
- 注册两个位置：
  - `ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: 'exam-practice', order: 30 }, Icon))`，`Icon` 收到 `{ size, active }`，画一个 SVG 图标（考试/试卷/对勾），用 `currentColor`。
  - `ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'exam-practice' }, Page))`，`Page` 是整页。
  - 面板切换：`ctx.layout.selectPanel('exam-practice')`（sidebar 图标由宿主渲染并负责切换，Icon 只需展示）。
- 样式：只用主题 token（`var(--dsw-alias-*)`），在组件内渲染 `<style>` 元素（卸载即移除）。不要用字面颜色（图标 artwork 除外）。
- 文案中英双语：中文为主，通过 `ctx.locale.bind('exam-practice')` 或内置字典 + `locale.getLocale()` 选语言；最少做到中文完整、英文关键文案。
- 进度：`localStorage` key `exam-practice.progress.v1`，结构 `{ [paperId]: { answers: {[qid]: string}, submitted: boolean, score?: {correct,total,percent}, updatedAt } }`。
- 数据加载：`fetch('/exam-practice/api/bank', { cache: 'no-store' })`；失败时用内置 `DEMO_BANK`；显示「题库来源：Host / 内置示例」及刷新按钮。
- 不要写 `document.body`、不要 iframe、不要复制其他插件 DOM。

## 分工与写入范围（避免冲突）

| 谁 | 文件 |
|---|---|
| Lead | `package.json`、`cordis.patch.yml`、`index.js`、`locale/*`、`icon.svg`、安装与验收 |
| ui-author | 只写 `client.js` |
| bank-author | 只写 `bank/*.json` |
| api-scout | 只写 `FINDINGS.md`（不改代码） |
