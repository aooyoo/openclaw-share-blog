#!/bin/bash

# OpenClaw HN Daily - Auto Update Script
# This script fetches HN posts and schedules daily publications

cd /Users/jerry/clawd/openclaw-hn-blog

echo "🦞 OpenClaw HN Daily - Auto Update"
echo "=================================="

# Fetch new posts
echo ""
echo "📡 Fetching HN posts..."
node fetch-hn-posts.js

# Schedule daily posts
echo ""
echo "📅 Scheduling daily posts..."
node schedule-daily-posts.js

# Commit and push changes
echo ""
echo "🚀 Committing and pushing changes..."
git add -A

if git diff --staged --quiet; then
    echo "No changes to commit"
else
    git config user.name "aooyooClaw"
    git config user.email "aooyoo@users.noreply.github.com"
    git commit -m "🤖 Auto-update: $(date +'%Y-%m-%d %H:%M:%S')"
    git push
fi

echo ""
echo "✅ Update complete!"
