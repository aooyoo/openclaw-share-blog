#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const HN_API_BASE = 'https://hn.algolia.com/api/v1/search';
const POSTS_FILE = path.join(__dirname, 'posts.json');
const MAX_POSTS = 100; // Keep last 100 posts

/**
 * Fetch OpenClaw stories from Hacker News
 */
async function fetchOpenClawStories() {
    return new Promise((resolve, reject) => {
        const url = `${HN_API_BASE}?query=OpenClaw&tags=story&restrictSearchableAttributes=title`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.hits || []);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

/**
 * Generate a summary for a post
 */
function generateSummary(post) {
    const title = post.title || '';
    const url = post.url || '';
    const points = post.points || 0;
    const comments = post.num_comments || 0;
    
    let summary = `<p><strong>Hacker News 热度：</strong> ${points} upvotes, ${comments} 条评论</p>`;
    
    if (url) {
        summary += `\n<p><strong>原文链接：</strong> <a href="${url}" target="_blank">${url}</a></p>`;
    }
    
    summary += `\n<p><em>发布时间：${new Date(post.created_at).toLocaleString('zh-CN')}</em></p>`;
    
    return summary;
}

/**
 * Load existing posts
 */
function loadExistingPosts() {
    if (fs.existsSync(POSTS_FILE)) {
        const data = fs.readFileSync(POSTS_FILE, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

/**
 * Save posts to JSON file
 */
function savePosts(posts) {
    // Sort by date (newest first) and keep only MAX_POSTS
    const sortedPosts = posts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, MAX_POSTS);
    
    fs.writeFileSync(POSTS_FILE, JSON.stringify(sortedPosts, null, 2), 'utf8');
}

/**
 * Check if a post already exists
 */
function postExists(existingPosts, hnId) {
    return existingPosts.some(post => post.hn_id === hnId);
}

/**
 * Main function
 */
async function main() {
    try {
        console.log('🦞 Fetching OpenClaw stories from Hacker News...');
        
        // Fetch stories from HN
        const stories = await fetchOpenClawStories();
        console.log(`✅ Found ${stories.length} stories`);
        
        // Load existing posts
        const existingPosts = loadExistingPosts();
        console.log(`📝 Loaded ${existingPosts.length} existing posts`);
        
        // Process new stories
        let newPostsCount = 0;
        const newPosts = [];
        
        for (const story of stories) {
            const hnId = story.objectID;
            
            // Skip if post already exists
            if (postExists(existingPosts, hnId)) {
                continue;
            }
            
            // Create new post
            const post = {
                hn_id: hnId,
                title: story.title,
                url: story.url || `https://news.ycombinator.com/item?id=${hnId}`,
                hn_link: `https://news.ycombinator.com/item?id=${hnId}`,
                points: story.points || 0,
                comments: story.num_comments || 0,
                author: story.author,
                date: new Date(story.created_at).toISOString(),
                summary: generateSummary(story),
                created_at: new Date().toISOString()
            };
            
            newPosts.push(post);
            newPostsCount++;
        }
        
        // Merge new posts with existing posts
        const allPosts = [...newPosts, ...existingPosts];
        
        // Save posts
        savePosts(allPosts);
        
        console.log(`\n✨ Added ${newPostsCount} new posts`);
        console.log(`📊 Total posts: ${allPosts.length}`);
        
        if (newPostsCount > 0) {
            console.log('\n📰 New posts:');
            newPosts.forEach(post => {
                console.log(`  - ${post.title} (${post.points} upvotes)`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the script
main();
