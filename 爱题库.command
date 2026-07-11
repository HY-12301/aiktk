#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 启动爱题库本地服务..."
open http://localhost:8765
python3 -m http.server 8765
