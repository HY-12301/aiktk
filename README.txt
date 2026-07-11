爱题库 - 法考客观题刷题系统
============================

文件说明：
  index.html             - 主程序（全部功能）
  all_questions.json.gz  - 题库（17374 题）
  爱题库.command         - macOS 启动脚本
  start.bat             - Windows 启动脚本

使用方法：
  [macOS]
  1. 把所有文件放在同一个文件夹里
  2. 双击 爱题库.command
  3. 浏览器自动打开 http://localhost:8765

  [Windows]
  1. 把所有文件放在同一个文件夹里
  2. 双击 start.bat
  3. 浏览器打开 http://localhost:8765

  [如果没有Python]
  可以用 Node.js：npm install -g http-server && http-server -p 8765
  或者 VS Code：安装 Live Server 插件，右键 index.html 用 Live Server 打开

首次使用：
  1. 打开页面后点击"开始刷题"加载题库
  2. （可选）点右上角 ☁️ 配置 DeepSeek API Key 启用AI分析
  3. 选择科目和来源，开始刷题
  4. 学习数据自动保存在浏览器本地

注意：
  - 所有数据存在本机浏览器，换设备数据不互通
  - 如果需要跨设备同步，可在 ☁️ 设置中配置 GitHub Gist Token
  - 文件夹内的 ai_tutor.json 缺失不影响使用（AI预设分析不可用）

版本：v5（2026-07）
