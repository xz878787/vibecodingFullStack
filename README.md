# 墨韵占卜 - Ink Divination

一个水墨风格的古风占卜网站前端页面。

## 功能特性

- 🎨 水墨风格设计，淡雅宣纸纹理背景
- 📜 古风字体，简约雅致的视觉体验
- 🎯 占卜功能，支持输入问题并获取卦象
- 📱 响应式布局，适配各种屏幕尺寸

## 技术栈

- React 18
- Vite
- Tailwind CSS 3

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

1. 将项目推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 `gh-pages` 分支作为源
4. 每次推送到 `main` 分支时，Actions 会自动构建并部署

### 方法二：手动部署

```bash
npm install gh-pages --save-dev
npm run deploy
```

## 项目结构

```
src/
├── components/       # 组件目录
│   ├── Navbar.jsx       # 导航栏组件
│   ├── DivinationForm.jsx    # 占卜表单组件
│   └── DivinationResult.jsx  # 结果展示组件
├── icons/           # 图标组件
│   ├── HomeIcon.jsx
│   ├── UserIcon.jsx
│   └── SettingsIcon.jsx
├── App.jsx          # 主应用组件
├── main.jsx         # 入口文件
└── index.css        # 全局样式
```

## 自定义配置

### 修改 GitHub Pages 路径

如果你的仓库名为 `your-repo-name`，请更新 `vite.config.js`：

```js
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

## 许可证

MIT
