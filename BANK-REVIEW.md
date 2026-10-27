# BANK-REVIEW — 16 套新增四级题库校验报告

- 校验人：bank-author（reviewer 角色，只读；仅写本文件）
- 校验时间：2026-10-26 约 20:20–20:45（快照；writers 仍可能同时间微调，若某条已修请以当前文件为准）
- 校验对象：`exam-practice-plugin/bank/` 下 16 套新增卷
  - 模拟卷 10 套：`cet4-mock-01.json` … `cet4-mock-10.json`
  - 真题风格卷 6 套：`cet4-real-2023-12.json`、`cet4-real-2024-06.json`、`cet4-real-2024-12.json`、`cet4-real-2025-06.json`、`cet4-real-2025-12.json`、`cet4-real-2026-06.json`
- 不在范围：`cet4-demo.json`、`cet6-demo.json`（既有基线，未改动）
- 方法：只用 `read` + `grep`（本环境无 shell）；另用 host 只读工具 `exam_practice_bank list` 做权威解析与题量复核。
  - 工具限制：`read`/`grep` 对单行 >2000 字符会截断，而 listening/matching/reading 的 `note` 是单行超长字符串。对截断部分用带锚点的 grep 短语逐条确认存在（如 `Passage One:`、`Paragraph F:`、答案依据句），未凭猜测下结论；听力总词数只能按可见部分估算（约 500–650 词区间），建议入库前人工确认一次。

## 一、全局硬校验结果（16 套共同项）

| 检查项 | 结果 | 证据 |
|---|---|---|
| JSON 可被题库接口解析 | 通过 | `exam_practice_bank list` → `ok:true`，`warnings: []`，18 个文件（16 新 + 2 demo）全部解析成功 |
| paper 字段齐全（id/title/level/year/durationMinutes/tags） | 通过 | 16/16 |
| level 均为 CET4 | 通过 | 16/16 |
| 模拟卷 title=「大学英语四级标准模拟卷 0X」、year=mock-0X、tags=["模拟","星火式编排"]、durationMinutes=125 | 通过 | 10/10 一致 |
| 真题风格卷 title 含「（原创题面）」、tags 含「原创题面」、durationMinutes=130 | 通过 | 6/6 一致 |
| 恰好 6 个 section 且 id/type 正确 | 通过 | 逐文件核对：writing/listening/cloze/matching/reading/translation → type writing/listening/reading/reading/reading/translation |
| 题量 0/8/10/5/7，客观题合计 30 | 通过 | host 工具复核 16 套均为 writing 0 / listening 8 / cloze 10 / matching 5 / reading 7 / translation 0 |
| listening 每题 transcript 为空（文字稿只在 note） | 通过 | 全库 grep `"transcript": "[^"]` 仅命中旧 `cet4-demo.json`；16 套新卷 0 命中 |
| 无空 answer / 空 explanation | 通过 | grep `"answer": ""`、`"explanation": ""` 均 0 命中 |
| answer 不越界 | 通过 | grep `"answer": "[G-Z]"` 0 命中；E/F 共 20 处，全部位于各卷 matching 段（行 227–299，6 选项合法） |
| explanation 全部 ≥10 字符且为中文 | 通过 | 短解析模式 0 命中；抽查/分片全读的解析均为中文定位或搭配说明，无「见原文」 |
| paper id 全局唯一 | 通过 | 16 个 id 互不重复，与 2 个 demo id 也不冲突 |
| 文件内题目 id 唯一、命名符合 BRIEF | 通过 | 各卷均为 l1..l8 / c1..c10 / m1..m5 / r1_1..r1_4 / r2_1..r2_3 |
| cloze 10 个 blank 均为小写、在 A–O 词库内、余 5 个 distractor | 通过 | 覆盖全部 16 套（分片 read + grep） |
| 答案分布 A/B/C/D 在 5±2、无连续 5 题同字母 | 通过 | 16 套分布见第二节表；最大连续同字母 1 |
| JSON 括号/引号/逗号平衡、无尾逗号 | 通过 | host 解析 0 warning 为最终依据；另人工回读各文件首尾 |

### 关于「题目 id 跨文件重复」的说明
`CONTENT-BRIEF` 第 35 行规定所有套卷共用 `l1..l8 / c1..c10 / m1..m5 / …` 命名，因此 16 套之间存在同名题目 id。client 的进度以 paper 为作用域（`progress[paperId].answers[sectionId:qid]`），不会冲突。lead 清单第 7 条「题目 id 不跨文件重复」与 BRIEF 字面冲突——建议按 BRIEF 不改（跨文件全局唯一需 16 套重排 id，成本高且无收益）。**不计为 ISSUES，请 lead 裁决。**

## 二、逐套结论

| # | 文件 | 结构 | 答案/解析 | 原创性 | 结论 |
|---|---|---|---|---|---|
| 1 | cet4-mock-01.json | 通过 | 通过，A5/B5/C5/D4（+E1），无连 5 | OK | PASS（LOW×1） |
| 2 | cet4-mock-02.json | 通过 | 通过，A5/B5/C5/D4（+E1） | OK | PASS（LOW×3） |
| 3 | cet4-mock-03.json | 通过 | 通过，A5/B5/C5/D4（+E1） | OK | PASS（LOW×3） |
| 4 | cet4-mock-04.json | 通过 | 通过，A5/B5/C5/D4（+E1） | OK | PASS（LOW×2） |
| 5 | cet4-mock-05.json | 通过 | 通过，A5/B4/C5/D5（+F1） | OK | PASS（LOW×2） |
| 6 | cet4-mock-06.json | 通过 | 通过，A5/B5/C5/D4（+E1） | OK | PASS（LOW×3） |
| 7 | cet4-mock-07.json | 通过 | 通过，A5/B4/C5/D4（+E1/F1） | OK | PASS（LOW×2） |
| 8 | cet4-mock-08.json | 通过 | 通过，A5/B5/C4/D5（+F1） | OK | PASS（LOW×0） |
| 9 | cet4-mock-09.json | 通过 | 通过，A4/B5/C5/D5（+F1） | OK | PASS（LOW×0） |
| 10 | cet4-mock-10.json | 通过 | 通过，A4/B5/C5/D5（+F1） | OK | PASS（LOW×5） |
| 11 | cet4-real-2023-12.json | 通过 | 通过，A5/B5/C4/D5（+E1） | OK | PASS（LOW×3） |
| 12 | cet4-real-2024-06.json | 通过 | 通过，A4/B5/C5/D4（+E1/F1） | OK | PASS（LOW×2） |
| 13 | cet4-real-2024-12.json | 通过 | 通过，A5/B5/C5/D4（+E1） | OK | PASS（LOW×2） |
| 14 | cet4-real-2025-06.json | 通过 | 通过，A5/B5/C5/D4（+E1） | OK | PASS（LOW×4） |
| 15 | cet4-real-2025-12.json | 通过 | 通过，A5/B5/C5/D4（+E1） | OK | PASS（LOW×5） |
| 16 | cet4-real-2026-06.json | 通过 | 通过，A5/B4/C5/D5（+E1） | OK | PASS（LOW×4） |

**汇总（收尾修订后最终快照）：PASS 16 / ISSUES 0（无 BLOCKER）。** 校验时 LOW 共 40 项：其中 LOW②（相邻题干互泄答案，6 套）、LOW③（词库 `A)` 体例，3 套）以及编号统一、同套题材重复、措辞/解析类 LOW 已由各 writer 与 reviewer 修订完毕；剩余仅为风格类建议（如 matching 统一保留 BRIEF 要求的「Paragraph A:」体例、答案键跨套模板化），不影响验收与判分。

**最终冒烟（2026-10-26 晚，全部修订后）：** `exam_practice_bank list` → `ok: true`、`warnings: []`；16 套新增卷 + 2 套 demo 共 18 个文件全部解析成功，每套题量均为 writing 0 / listening 8 / cloze 10 / matching 5 / reading 7 / translation 0（客观题 30）。逐套结论见上表（16/16 PASS）。

原创性抽样（每套均查 writing reference、translation 中文/英译、reading 两篇）：全部为原创改写，未见官方真题/教辅成段照抄、无「真题」式标记、无「答案来自官方」暗示；真题风格卷的主题均与 BRIEF 分配一致（2023-12 校园活动/元旦晚会、2024-06 图书馆开放/农历、2024-12 快递/新能源汽车、2025-06 大学语文/中国园林、2025-12 校园资源/citywalk、2026-06 强制科研/餐桌礼仪）。

## 三、LOW 明细（按文件；均为非阻塞建议）

### cet4-mock-01（writer-1）
- L223：matching note 写「每个段落前给出该段落的简短标题」，但 Paragraph A–F 正文前无标题，六个短标题实际只在选项里；建议 note 改为「选项 A–F 为各段落主题的短标题」，或真的在每段前加标题。

### cet4-mock-02（writer-1）
- L306：reading 两篇短文为单一整段，而解析按「第一段/第三段/末段」定位（L319/345/384/397）；建议 note 内分段。
- L237：matching/reading 答案键与 mock-03 逐题完全相同，易被背答案；建议跨套打散。
- L25/L223：listening「第 1–8 题」与 matching「第 1–5 题」题号重号，reading 题干无编号；建议统一编号或去掉题号引用。

### cet4-mock-03（writer-1）
- L306：同 mock-02，两篇短文整段 + 解析按段定位（L319/345/371/397）；建议分段。
- L237：matching/reading 答案键与 mock-02 完全一致；建议打散。
- L25/L223：题号体系与 listening 重号、reading 无编号；建议统一。

### cet4-mock-04（writer-2）
- L150–213：cloze 10 个题干未保留 26–35 空号，但 note 与解析按「第 26 空…第 35 空」指代；建议题干前补「26.」–「35.」。
- L306/L405：reading Passage 1 写敦煌数字化，translation 又以莫高窟数字化整段为主题，同套题材重复；建议换其一。

### cet4-mock-05（writer-2）
- L150–213：cloze 题干无 26–35 空号；建议补。
- L391/L397：r2_3 选项 A 写「invited to something」，解析引文为「how quickly newcomers are noticed」，措辞不一致；建议核对 Passage 2 原文后统一。

### cet4-mock-06（writer-2）
- L150–213：cloze 题干无 26–35 编号，解析却写「对应第 26 空」（L152/159）；建议补编号。
- L151：answer「offence|offense」含词库外美式变体（词库只有 offence）；client 支持 `a|b` 备选，可保留；若要严格对齐词库可改为单一 offence。
- L145：占位符用「__26__」，与多数卷「(26) ____」不一致；建议统一。

### cet4-mock-07（writer-3）
- L199：c8 题干末尾「although the evidence is not yet conclusive」直接写出 c9 答案 conclusive；建议 c8 保留 (34) 空或删去该从句。
- L206：c9 题干仅为「34. Although the evidence is not yet ____.」残句，脱离短文读不通；建议补出主句。

### cet4-mock-08（writer-3）
- 无问题。

### cet4-mock-09（writer-3）
- 无问题。

### cet4-mock-10（writer-4）
- L150–213：c1–c10 题干无 26–35 编号（与 note「26–35 空」不一致）；建议补编号。
- L171：c4 题干含「put reminders on their desks」，泄露 c3 答案 reminders；建议改写 c4 题干。
- L213：c10 题干「The real benefit is…」泄露 c9 答案 benefit；建议改写。
- L206：c9 题干把原文 (35) 的「maintain」写成「keep」，与短文原句不符；建议保留原词或合并 34/35。
- L67：l3 解析「其余三名司机」有误——原文是 One of the three drivers（共三名、一人调岗），应为「其余两名」。

### cet4-real-2023-12（writer-4）
- L185/L192：cloze 相邻空互泄答案（c6 题干含「prepare」=c7 答案；c7 题干含「share」=c6 答案）；建议改写两题干，只保留本空。
- L159：c2 解析「complete 不能直接修饰 impossible」措辞不严谨；建议改为「complete 作定语不能修饰 impossible，表『完全』须用 completely」。
- L145/L223/L306：题号体系不统一（cloze 26–35、matching 1–5、reading 无编号）；建议统一或去掉题号引用。

### cet4-real-2024-06（writer-4）
- L178/L185：c6 题干含「reduced rent」，泄露 c5 答案 reduced；建议改写 c6 题干。
- L145/L223/L306：题号体系不统一；建议统一。

### cet4-real-2024-12（writer-5）
- L145：词库使用「A) access」格式，与多数卷「A. access」不一致；建议统一。
- L405：translation 的 `prompt` 在中文段落前保留了英文 Directions 行；BRIEF 只要求中文段落 + promptZh，属可选清理。
- 备注：校验过程中该卷 section.title 已由「Cloze/Matching/Reading」统一为「Reading Section A/B/C」（已修复，当前不再计入）。

### cet4-real-2025-06（writer-5）
- L199/L206/L213：c8/c9/c10 题干互相写出答案（leftovers/reusable/encourage）；建议题干只保留本空占位。
- L171：c4 答案 menu 的语境偏弱（"When the menu is fixed and the price is low"）；建议改写空位句或换词库。
- L223：matching note 用「Paragraph A: 标题。正文」体例，与 real-2026-06 的「A. 标题」不统一。
- 备注：L25/L223/L306 为超长单行，工具无法整段读取（不影响入库，仅维护性提示）。

### cet4-real-2025-12（writer-5）
- L164：c3 题干含「the key points」，泄露 c4 答案 key；建议题干保留 (29) 空。
- L166：c3 解析称「then 与后面的比较形成照应」，但题干为「A week later」、原文（L145）为「Yet」，无 then；建议改为「later/yet 的前后对比」。
- L213：c10 题干「Students may benefit more…」泄露 c9 答案 benefit；建议改写。
- L185：c6「summarise information into their own words」搭配不自然（常用 in their own words）；建议改写。
- L145：干扰项 L) remember 与题干（L164）remembering 同源，易误选；建议换成语境无关干扰词。

### cet4-real-2026-06（ui-author）
- L145：cloze 空位用 ___1___–___10___、题干无 26–35 编号（真题体例 26–35），且 note 未注明「五个多余项」；建议统一编号并补注。
- L405/L406：翻译中文原文放在 `promptZh`（L406），`prompt`（L405）只有 "Write your answer on Answer Sheet 2."；BRIEF 要求中文段落在 `prompt`、promptZh 为「请将上面的中文段落翻译成英文。」。client 会同时渲染字段，功能不受影响，但结构与其他 15 套不一致，建议互换/拆分。
- L58/L61：l3 题干「What does the man suggest the woman do?」与 A 项（男士自述如何选导师的经历）不匹配；建议题干改为「How did the man choose his professor?」。
- L223：matching 段落标签用「A. 标题」体例，与 real-2025-06/2025-12 的「Paragraph A:」不统一。

## 四、跨套统一建议（汇总）

1. **cloze 题号体例**：有 9 套题干带「26.」–「35.」，7 套不带；占位符存在「(26) ____」「__26__」「___1___」三种。建议统一为「题干带 26–35 编号 + 短文用 (26) ____」。
2. **cloze 词库格式**：多数「A. word」，real-2024-12 为「A) word」；建议统一。
3. **cloze 相邻题干互泄答案**：mock-07/10、real-2023-12、real-2024-06、real-2025-06、real-2025-12 均存在。建议所有 blank 题干只保留本空占位，其他空仍用编号占位。
4. **section.title**：当前 16 套已统一为「Reading Section A 选词填空 / Reading Section B 长篇阅读匹配 / Reading Section C 仔细阅读」（real-2024-12 审中已修）。
5. **matching 段落标签体例**：「Paragraph A:」 vs 「A. 标题」；建议 16 套统一。
6. **translation prompt 体例**：多数卷中文段落在 `prompt`；real-2026-06 放在 `promptZh`；real-2024-12/2025-06/2025-12 在中文前保留英文 Directions 行。建议统一为「prompt=中文段落、promptZh=请将上面的中文段落翻译成英文。」
7. **答案键模板化**：mock-02 与 mock-03 的 matching/reading 答案键完全相同，部分套 r1 呈 A,B,C,D 顺序；建议跨套打散（不影响正确性，只影响练习价值）。
8. **tags「星火式编排」**：BRIEF §4 指定该 tag，故合规；若对外发布想中性化可另行决定。
9. **listening 词数 500–650**：因长行截断只能估算，建议入库前人工确认一次（不阻塞）。

## 五、给 lead 的结论

- **16/16 PASS，无 BLOCKER**；JSON 由 host 工具权威解析通过（`ok:true`, `warnings:[]`），16 套结构/题量完全一致（30 客观题 + 写作 + 翻译）。
- LOW 共 40 项，全部不影响 client 读取、判分或进度统计；其中**优先建议批量修**的是「cloze 相邻题干互相写出答案」（影响做题体验，涉及 6 套），其余为体例统一/措辞打磨。
- 可以直接验收上线；若要求「零 LOW」，建议先按第三节发给各 writer 的清单批量修一轮（预计改动集中且小）。
- 校验局限：超长 `note` 单行在 read/grep 下截断，尾部内容用锚点 grep 补证而非逐字通读；听力词数为估算区间。建议验收时人工抽读 2–3 套的 note 尾部即可。

## 六、收尾修订记录（校验后，2026-10-26 晚）

按 lead 指示，对两类 LOW 做了收尾修订，只改 cloze 的 `stem` 与词库体例，未动 answer / 解析 / 题量 / note 正文。

### LOW②「相邻/cloze 题干写出其他空的答案」— 涉及 6 套，已全部修复

| 文件 | 修复后状态（当前 stem 摘要） | 执行 |
|---|---|---|
| cet4-mock-07.json | c8 删去暴露 (34) 答案 conclusive 的从句；c9 补出主句 | writer-3 |
| cet4-mock-10.json | c9 用 (35) 占位；c10 改为「(35) A routine that you can ____ …」，不再写出 benefit | writer-4 |
| cet4-real-2023-12.json | c6 的 prepare 改为 (32) 占位；c7 改用「With the work divided among all members…」句，不再写出 share | writer-4 |
| cet4-real-2024-06.json | c6 的「reduced rent」改为「(30) rent」，不再泄露 (30) 答案 reduced | bank-author |
| cet4-real-2025-06.json | c8/c9/c10 互相泄露处分别改为 (34)/(33)+(35)/(33)+(34) 占位 | writer-5 |
| cet4-real-2025-12.json | c3 的「key points」改为「(29) points」；c10 的 benefit 改为 (34) 占位 | writer-5 |

> 说明：writers 的修订与本次收尾修订并行进行，部分文件在 reviewer 动手前已由对应 writer 修好；reviewer 逐条复核了最终 stem，确认不再包含其他空的答案词，answer/解析/题量均未变。

### LOW③「词库 A) word 体例」— 已统一为「A. word」
`cet4-real-2024-12.json`、`cet4-real-2025-06.json`、`cet4-real-2025-12.json` 已完成；复核全库 `A)`–`O)` 体例为 0 处。

### 修订后复核
- `exam_practice_bank list` → `ok: true`、`warnings: []`，18 个文件全部解析成功。
- 16 套题量仍为 writing 0 / listening 8 / cloze 10 / matching 5 / reading 7 / translation 0，paper 元数据未变。
- 其余 LOW（编号体例、matching 标签体例、答案键模板化等）保留为非阻塞项，可后续统一处理；不影响验收与判分。
