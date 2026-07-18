# 项目长期记忆：法考题库 aiktk

## 仓库与推送约定
- 仓库：`HY-12301/aiktk`，本地路径 `/Users/butterfly/Workbuddy/2026-07-05-20-03-18/deploy`。
- **推送方式**：该运行环境（沙箱）`~/.ssh` 无 SSH 私钥，SSH push 必报 `Permission denied (publickey)`。但 macOS 钥匙串已缓存 GitHub 令牌，可走 HTTPS 推送。
- `origin` remote URL 已改为 HTTPS：`https://github.com/HY-12301/aiktk.git`。此后直接 `git push origin main` 即可（走 osxkeychain 令牌，无需 SSH key）。
- 用户习惯：说「推」才上线；只推 `index.html`（题库 `all_questions.json.gz` 按用户要求保持远程旧版，不推）；`.workbuddy/memory` 笔记文件不属发布范围，不推。

## 网页关键逻辑（易错点）
- 多选题对错判定必须排序后比较：`normAns(ua)===normAns(q.correctAnswer)`（969行定义 `normAns`）。横幅(1458行)、智能组卷算分(2652行)、提交判定(1676行)三处已统一用此法。切勿改回裸比较 `a===q.correctAnswer`（顺序不同会误判）。
- topic 显示：用白名单归一 `topicName(q)`，全部指向干净章节名；远程旧题库 `q.topic` 带「科目.」前缀时自动剥离。
