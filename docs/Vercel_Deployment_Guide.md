# Vercel 部署指南

## 1. 推送项目到 GitHub

如果当前目录还没有远程仓库：

```bash
git init
git add .
git commit -m "finalize TuanZai AI demo and submission docs"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

如果已经有 remote：

```bash
git status
git add .
git commit -m "finalize TuanZai AI demo and submission docs"
git push
```

注意：`.gitignore` 已排除 `node_modules/`、`dist/`、`.env*`、日志文件、Office 临时文件和文档渲染中间产物。

## 2. 在 Vercel 新建项目

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard)。
2. 点击 **Add New... → Project**。
3. 选择 **Import Git Repository**。
4. 授权并导入当前 GitHub 仓库。

## 3. Vercel 构建配置

| 配置项 | 应填写内容 |
|---|---|
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Root Directory | 默认仓库根目录 |
| Environment Variables | 当前 Demo 不需要环境变量 |

## 4. 部署并获取链接

1. 点击 **Deploy**。
2. 等待构建完成。
3. Vercel 会生成一个在线访问链接，例如：`https://your-project.vercel.app`。
4. 比赛提交中的“作品链接”填写该 Vercel 在线 Demo 链接。

## 5. 补充提交链接建议

- 作品链接：Vercel 在线 Demo
- 补充链接：GitHub 仓库
- 文档材料：`docs/TuanZai_AI_Design_Document.docx`
- 如有演示视频，可作为补充链接一起提交。
