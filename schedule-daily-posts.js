#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(__dirname, 'posts.json');
const DAILY_POSTS_FILE = path.join(__dirname, 'daily-posts.json');
const POSTS_PER_DAY = 5;

/**
 * Load all posts
 */
function loadPosts() {
    if (fs.existsSync(POSTS_FILE)) {
        const data = fs.readFileSync(POSTS_FILE, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

/**
 * Load daily publishing schedule
 */
function loadDailySchedule() {
    if (fs.existsSync(DAILY_POSTS_FILE)) {
        const data = fs.readFileSync(DAILY_POSTS_FILE, 'utf8');
        return JSON.parse(data);
    }
    return { scheduled: [], published: [] };
}

/**
 * Save daily publishing schedule
 */
function saveDailySchedule(schedule) {
    fs.writeFileSync(DAILY_POSTS_FILE, JSON.stringify(schedule, null, 2), 'utf8');
}

/**
 * Get today's date string
 */
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Schedule posts for today
 */
function scheduleTodayPosts() {
    const posts = loadPosts();
    const schedule = loadDailySchedule();
    const today = getTodayString();
    
    // Check if posts are already scheduled for today
    const todayScheduled = schedule.scheduled.filter(p => p.date === today);
    
    if (todayScheduled.length >= POSTS_PER_DAY) {
        console.log(`✅ Today's posts already scheduled (${todayScheduled.length} posts)`);
        return todayScheduled;
    }
    
    // Get unscheduled posts (not in scheduled or published arrays)
    const scheduledIds = new Set([
        ...schedule.scheduled.map(p => p.hn_id),
        ...schedule.published.map(p => p.hn_id)
    ]);
    
    const unscheduledPosts = posts.filter(p => !scheduledIds.has(p.hn_id));
    
    // Sort by points (highest first) and date (newest first)
    const topPosts = unscheduledPosts
        .sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            return new Date(b.date) - new Date(a.date);
        })
        .slice(0, POSTS_PER_DAY - todayScheduled.length);
    
    // Add to schedule
    const newScheduled = topPosts.map(post => ({
        ...post,
        scheduled_for: today,
        scheduled_at: new Date().toISOString()
    }));
    
    schedule.scheduled.push(...newScheduled);
    saveDailySchedule(schedule);
    
    console.log(`📅 Scheduled ${newScheduled.length} posts for today (${today})`);
    
    return [...todayScheduled, ...newScheduled];
}

/**
 * Get today's scheduled posts
 */
function getTodaysScheduledPosts() {
    const schedule = loadDailySchedule();
    const today = getTodayString();
    
    return schedule.scheduled.filter(p => p.scheduled_for === today);
}

/**
 * Format post for display
 */
function formatPostForDisplay(post, index) {
    return `
## ${index + 1}. ${post.title}

**Hacker热度：** ${post.points} upvotes, ${post.comments} comments
**发布时间：** ${new Date(post.date).toLocaleString('zh-CN')}
**HN链接：** ${post.hn_link}
**原文链接：** ${post.url}

---

`;
}

/**
 * Generate daily blog post
 */
function generateDailyPost() {
    const todayPosts = getTodaysScheduledPosts();
    
    if (todayPosts.length === 0) {
        console.log('⚠️ No posts scheduled for today');
        return;
    }
    
    const today = getTodayString();
    const markdown = `# OpenClaw HN Daily - ${today}

今日精选 ${todayPosts.length} 篇 Hacker News 上的 OpenClaw 热门话题：

${todayPosts.map((post, index) => formatPostForDisplay(post, index)).join('\n')}

---
*本博客由 OpenClaw 自动生成 | 数据来源: Hacker News*
`;
    
    // Save markdown file
    const markdownFile = path.join(__dirname, `_posts/${today}.md`);
    fs.mkdirSync(path.dirname(markdownFile), { recursive: true });
    fs.writeFileSync(markdownFile, markdown, 'utf8');
    
    console.log(`✅ Generated daily post: ${markdownFile}`);
    
    return markdown;
}

/**
 * Main function
 */
function main() {
    console.log('🦞 OpenClaw HN Daily - Scheduler\n');
    
    // Schedule posts for today
    const scheduledPosts = scheduleTodayPosts();
    
    // Generate daily post
    const dailyPost = generateDailyPost();
    
    if (dailyPost) {
        console.log('\n📰 Today\'s posts:');
        scheduledPosts.forEach((post, index) => {
            console.log(`  ${index + 1}. ${post.title} (${post.points} upvotes)`);
        });
        
        console.log(`\n✨ Total: ${scheduledPosts.length} posts scheduled for today`);
    }
}

// Run the script
main();
