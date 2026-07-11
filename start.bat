@echo off
cd /d "%~dp0"
echo 启动爱题库本地服务...
start http://localhost:8765
python -m http.server 8765
