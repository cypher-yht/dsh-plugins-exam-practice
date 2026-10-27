# 四六级刷题（exam-practice）

在 DeepSeek Harness Web UI 的侧边栏新增一个「四六级刷题」主面板：把 CET-4/6 题库导进来，在线做题，交卷后自动判分并回顾错题。

> 标准 DSH bundle 插件，装完刷新页面即生效。Host 半提供只读题库接口与 `exam_practice_bank` 工具，Client 半提供侧边栏图标和整页刷题面板。

## 特性

- **侧边栏主面板**：注册 `sidebar.panellist` 图标（order 30）与 `main` 整页面板，页面 key 为 `exam-practice`。
- **题库实时读取**：Host 每次请求都重新扫描 `bank/*.json` 并合并，所以新导入的题库点一下「刷新」就能看到，不用重装插件。
- **双来源与降级**：面板优先读取 Host 接口 `GET /exam-practice/api/bank`；Host 不可用或解析失败时自动回落到 client 内置的示例题库，并在页面上提示来源（Host 题库 / 内置示例）。
- **分级筛选**：全部 / CET-4 / CET-6 三个标签，带数量；试卷按等级、再按年份倒序排列。
- **试卷卡片**：显示题量、部分数、时长、已答进度和上次成绩，按钮会在「开始 / 继续 / 看成绩」之间切换。
- **在线作答**：写作 / 听力 / 阅读 / 翻译四类 section 统一渲染；选择题点选，填空题文本输入；顶部显示计时与「已答 x/y」。
- **交卷自动判分**：`choice` 按选项字母比对，`blank` 支持 `a|b` 多个可接受答案；写作与翻译不计分，只展示参考范文/译文并提示「主观题不判分」。
- **结果页**：得分、正确率、用时、交卷时间；逐题对照（正确 / 错误 / 主观题）＋错题列表，每题带中文解析。
- **错题练习**：结果页可一键只重练这套题的错题，错题模式下同样会重新判分。
- **听力面板**：把 section 的 `note` / 题目 `transcript` 按 `Conversation One:`、`Passage One:` 等分段；section 带 `audio` 地址时渲染原生 `<audio>` 播放器；没有音频时用浏览器语音合成（Web Speech API）朗读文字稿，可选英文音色与语速，偏好存 `localStorage`；浏览器没有语音合成时自动展开文字稿，退化为「看文字稿做题」。
- **进度持久化**：`localStorage` key 为 `exam-practice.progress.v1`，按试卷保存 `answers`、`submitted`、`score`、`submittedAt`，刷新页面不丢进度。
- **双语界面**：中文完整，英文覆盖全部关键文案（跟随宿主语言）。
- **给 AI 的导入通道**：面板内置「导入题库」卡片，一键复制一段带 JSON 格式说明的提示词，粘到对话里让 AI 生成并写入题库；Host 同时注册 `exam_practice_bank` 工具（`list` / `import` / `remove`），AI 也能直接读写题库文件。

## 安装

```powershell
dsh plugin add github:cypher-yht/dsh-plugins-exam-practice
```

本地开发用软链：

```powershell
dsh plugin add link:D:\path\to\exam-practice-plugin
```

> 桌面客户端读 `desktop` profile，请让桌面端会话里的 `plugin_manager` 安装。

装完重启宿主，浏览器 `Ctrl+F5`。入口在侧边栏「四六级刷题」。

## 题库导入

三种方式都可以，导入后回面板点「刷新」：

1. **面板内提示词（推荐）**：打开「四六级刷题」→ 页面下方「导入题库」卡片 → 点「复制」拿到提示词 → 在对话里把题目贴在提示词后面，让 AI 按格式生成 JSON 并写入题库目录 → 回面板点「刷新」。
2. **`exam_practice_bank` 工具**：AI 直接调用 `exam_practice_bank`：
   - `{"action":"list"}` 列出已导入试卷；
   - `{"action":"import","fileName":"cet4-2024-12.json","papers":[...]}` 写入或覆盖一个题库文件（`fileName` 只允许字母、数字、点、横线、下划线；单文件上限 2 MB）；
   - `{"action":"remove","fileName":"cet4-2024-12.json"}` 删除一个题库文件。
3. **手动放文件**：把符合格式的 `.json` 放进插件目录的 `bank/` 下，刷新页面即可。

题库目录默认是 `<插件包目录>/bank`；Host 侧的 `bankDir` 可在插件 config 里改（`apply(ctx, { bankDir })`）。

## 题库文件格式

每个 `bank/*.json` 文件可以是 `{ "papers": [...] }`、一个裸的 `papers` 数组，或单个 paper 对象。Host 会合并所有文件里的 papers：

- 按 `level`（CET4 在前、CET6 在后）再按 `year` 倒序排序；
- `paper.id` 重复的会被跳过并产生一条 warning；
- 缺少 `id` / `title` 的 paper 跳过；JSON 解析失败的文件跳过并在接口 `warnings` 里给出原因。

```jsonc
{
  "papers": [
    {
      "id": "cet4-2024-12",              // 全局唯一，kebab-case
      "title": "2024年12月大学英语四级（节选）",
      "level": "CET4",                    // "CET4" | "CET6"，其他值按 CET4 处理
      "year": "2024-12",
      "durationMinutes": 130,             // 缺省 130
      "tags": ["真题改编", "阅读"],
      "sections": [
        {
          "id": "writing",
          "title": "Writing 写作",
          "type": "writing",              // writing | listening | reading | translation
          "prompt": "Directions: ...",    // 英文题干
          "promptZh": "中文提示（可选）",
          "reference": "参考范文（可选，主观题用）",
          "wordLimit": 120,               // 可选
          "note": "长文本说明（可选，听力和阅读常把材料放这里）",
          "passage": "短文（可选）",
          "audio": "音频地址（可选；给了就渲染原生 <audio> 播放器）",
          "questions": []
        },
        {
          "id": "listening",
          "title": "Listening 听力",
          "type": "listening",
          "note": "Conversation One: ...\nPassage One: ...",
          "questions": [
            {
              "id": "l1",
              "kind": "choice",           // "choice" | "blank"
              "stem": "What does the man suggest?",
              "transcript": "可选，听力文字稿",
              "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
              "answer": "B",              // choice: 选项字母；blank: 标准答案文本
              "explanation": "中文解析"
            }
          ]
        }
      ]
    }
  ]
}
```

规则：

- `kind: "choice"` 的 options 实际支持 2–6 个（长篇阅读匹配题常见 A–F 六个选项），`answer` 是选项字母；`kind: "blank"` 没有 options，`answer` 可用 `|` 分隔多个可接受答案，例如 `"were|was"`。
- 主观题（writing / translation）`questions: []`，只放 `prompt` / `promptZh` / `reference`，面板不计分。
- JSON 必须严格合法（不能有注释、尾逗号），文件用 UTF-8；题干/选项保持英文原样，解析用中文。
- 题目 `id` 在 section 内唯一即可（跨试卷重名不影响进度，进度以 paper 为作用域）。

## Host 接口

只读、`Cache-Control: no-store`，只接受 loopback 或同源（Origin 与 Host 一致）的请求，其余返回 403：

| 方法 | 路径 | 返回 |
|---|---|---|
| `GET` / `HEAD` | `/exam-practice/api/bank` | `{ ok, papers, warnings, bankDir, files, updatedAt }` |
| `GET` / `HEAD` | `/exam-practice/api/health` | `{ ok, plugin }` |

## 目录结构

```
exam-practice-plugin/
  package.json          # bundle manifest：dsh.bundle.patch + dsh.client
  cordis.patch.yml      # 插入 host 行 exam-practice
  index.js              # Host 半：题库扫描 / HTTP 只读接口 / exam_practice_bank 工具
  client.js             # Client 半：侧边栏图标 + 刷题面板（React，纯 JS，无构建）
  locale/en.json        # 插件在插件管理页显示的标题与描述（英文）
  locale/zh.json        # 同上（中文）
  icon.svg              # 侧边栏图标
  bank/                 # 题库，18 个 JSON 文件（见下）
  CONTRACT.md           # 实现契约
  CONTENT-BRIEF.md      # 题库写作任务书
  BANK-REVIEW.md        # 题库校验报告
  FINDINGS.md           # Client → Host 数据通道调查
```

## 内置题库

| 文件 | 内容 |
|---|---|
| `bank/cet4-demo.json`、`bank/cet6-demo.json` | 随插件附带的示例卷，装好就有题可做 |
| `bank/cet4-mock-01.json` … `cet4-mock-10.json` | 10 套四级标准模拟卷（原创题面） |
| `bank/cet4-real-2023-12.json` 等 6 个文件 | 2023-12 ~ 2026-06 的「真题风格卷」：只对齐真实考试的主题与题型，题面与解析全部原创 |

每套模拟卷/真题风格卷的结构：写作 0 题 + 听力 8 题 + 选词填空 10 题 + 长篇匹配 5 题 + 仔细阅读 7 题 + 翻译 0 题，客观题共 30 题。题库**不复制**官方真题或教辅原文，版权与写作要求见 [CONTENT-BRIEF.md](CONTENT-BRIEF.md)，校验结论见 [BANK-REVIEW.md](BANK-REVIEW.md)。

## 许可证

MIT，见 [LICENSE](LICENSE)。
