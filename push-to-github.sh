#!/bin/bash

# GitHub 推送腳本
echo "🚀 開始推送日本旅遊手札到 GitHub..."

# 1. 進入目錄
cd /Users/liutsungying/Downloads/exported-assets/japan-autumn-guide

# 2. 初始化 git（如果還沒有）
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git 初始化完成"
fi

# 3. 設定遠端倉庫
git remote remove origin 2>/dev/null
git remote add origin https://github.com/thankcoom/japan-travel-guide.git
echo "✅ 設定遠端倉庫完成"

# 4. 添加所有檔案
git add .
echo "✅ 檔案已添加"

# 5. 提交變更
git commit -m "完整版日本旅遊手札 - 修復所有導航問題"
echo "✅ 提交完成"

# 6. 推送到 main 分支
git branch -M main
git push -u origin main --force
echo "✅ 推送完成！"

echo "
🎉 成功推送到 GitHub！

📱 請在幾分鐘後訪問：
https://thankcoom.github.io/japan-travel-guide/

如果網站還沒更新，請：
1. 前往 https://github.com/thankcoom/japan-travel-guide/settings/pages
2. 確認 Source 選擇 'Deploy from a branch'
3. Branch 選擇 'main'
4. 點擊 Save
"