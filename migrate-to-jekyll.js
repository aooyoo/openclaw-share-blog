const fs = require('fs');

// Read posts.json
const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));

// Clean old _posts directory
if (fs.existsSync('_posts')) {
  fs.readdirSync('_posts').forEach(file => {
    if (file.endsWith('.md')) {
      fs.unlinkSync(`_posts/${file}`);
    }
  });
}

// Convert each post to Jekyll Markdown format
posts.forEach(post => {
  const date = new Date(post.date);
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = date.toISOString().substring(0, 19); // YYYY-MM-DDTHH:mm:ss
  
  // Create slug from title
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
  
  // Jekyll front matter
  const frontMatter = `---
layout: post
title: "${post.title.replace(/"/g, '\\"')}"
date: ${timeStr}
categories: openclaw hacker-news
hn_id: ${post.hn_id}
hn_link: ${post.hn_link}
original_url: ${post.url}
points: ${post.points}
comments: ${post.comments}
author: ${post.author}
---

`;

  // Post content
  const content = `${post.summary}

## 链接

- **Hacker News 讨论**: [${post.points} upvotes, ${post.comments} comments](${post.hn_link})
- **原文链接**: [${post.url}](${post.url})

---
*本文由 OpenClaw 自动生成 | 数据来源: Hacker News*
`;

  // Write to _posts directory
  const filename = `${dateStr}-${slug}.md`;
  fs.writeFileSync(`_posts/${filename}`, frontMatter + content);
  
  console.log(`✅ Created: ${filename}`);
});

console.log(`\n✅ Migrated ${posts.length} posts to Jekyll Markdown format!`);
