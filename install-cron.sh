#!/bin/bash

# OpenClaw HN Daily - Cron Job Installation Script

echo "🦞 OpenClaw HN Daily - Cron Job Installer"
echo "========================================"
echo ""

# Create logs directory
mkdir -p logs

# Add cron job
echo "📅 Installing cron job..."
echo ""

# Get current crontab (if exists)
CURRENT_CRON=$(crontab -l 2>/dev/null || true)

# Check if cron job already exists
if echo "$CURRENT_CRON" | grep -q "openclaw-hn-blog/auto-update.sh"; then
    echo "✅ Cron job already installed"
else
    # Add new cron job
    (echo "$CURRENT_CRON"; echo "0 9 * * * /Users/jerry/clawd/openclaw-hn-blog/auto-update.sh >> /Users/jerry/clawd/openclaw-hn-blog/logs/auto-update.log 2>&1") | crontab -
    echo "✅ Cron job installed successfully"
fi

echo ""
echo "📋 Cron job details:"
echo "  - Schedule: Every day at 9:00 AM CST"
echo "  - Script: /Users/jerry/clawd/openclaw-hn-blog/auto-update.sh"
echo "  - Log: /Users/jerry/clawd/openclaw-hn-blog/logs/auto-update.log"
echo ""
echo "🔧 To view cron jobs: crontab -l"
echo "🗑️  To remove cron job: crontab -e (then delete the line)"
echo ""
