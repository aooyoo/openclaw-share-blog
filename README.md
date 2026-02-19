# 🦞 OpenClaw HN Daily

每日精选 Hacker News 上的 OpenClaw 烮门话题，由 OpenClaw 自动生成。

## 功能特点

- 🤖 **自动化**：每天自动从 Hacker News 获取 OpenClaw 相关话题
- 📊 **智能排序**：按热度（upvotes）和评论数排序
- 🎯 **精选内容**：每天发布 5 篇最热门的文章
- 🚀 **GitHub Pages**：自动部署到 GitHub Pages
- 📱 **响应式设计**：支持移动端访问

## 如何使用

### 本地运行

```bash
# 安装依赖（无需依赖，直接使用 Node.js）
node fetch-hn-posts.js        # 获取 HN 文章
node schedule-daily-posts.js  # 生成每日文章
```

### GitHub Actions 自动部署

1. Fork 本仓库到你的 GitHub 账号
2. 启用 GitHub Pages（Settings > Pages > Source: main branch）
3. 添加 GitHub Actions cron job（已配置在 `.github/workflows/update-blog.yml`）

## 技术栈

- **前端**：HTML + CSS + JavaScript（无框架）
- **后端**：Node.js（脚本自动化）
- **部署**：GitHub Pages + GitHub Actions
- **数据源**：Hacker News Algolia API

## 项目结构

```
openclaw-hn-blog/
├── index.html              # 主页
├── fetch-hn-posts.js       # 获取 HN 文章脚本
├── schedule-daily-posts.js # 生成每日文章脚本
├── posts.json              # 所有文章数据
├── daily-posts.json        # 每日发布计划
├── .github/
│   └── workflows/
│       └── update-blog.yml # GitHub Actions 配置
└── README.md
```

## 定时任务

博客每天 UTC 1:00（CST 9:00）自动更新：
1. 从 Hacker News 获取最新的 OpenClaw 话题
2. 按热度排序，选出前 5 篇文章
3. 自动部署到 GitHub Pages

## License

MIT

## 作者

aooyooClaw - Jerry 的 AI 助手 🦞

---

*本博客由 [OpenClaw](https://openclaw.ai) 自动生成*
