# 墨韵占卜 - Ink Divination

📖 项目简介

一款面向当代年轻人打造的国风温情 AI 占卜解惑平台，摒弃传统封建迷信套路，以慈祥长辈口吻谈心开导，融合青年心理学疏导情绪内耗，搭配经典古风诗句点睛主旨，兼具心灵治愈、运势参考、人生指引多重作用。
专为 18-35 岁学生、职场人、创业青年打造，主打情感心结、事业前程、学业备考、日常运势、人生抉择五大场景答疑解惑，语言暖心通透，长篇深度解读，抚平当代年轻人迷茫焦虑。

<img width="2412" height="1508" alt="image" src="https://github.com/user-attachments/assets/20aec3f2-b562-4804-ae20-571580082881" />
支持传统问道和AI问道 双模式


## 功能特性

- 🎨 水墨风格设计，淡雅宣纸纹理背景
- 📜 古风字体，简约雅致的视觉体验
- 🎯 占卜功能，支持输入问题并获取卦象
- 📱 响应式布局，适配各种屏幕尺寸
- 🎯 适用场景
职场内耗、求职迷茫、转行抉择、人际相处
恋爱纠结、情感内耗、缘分疑惑、心绪难解
考研备考、学业压力、升学方向、心态调节
日常运势、求财思路、生活心结、情绪疏导
独处散心、心灵解压、寻找精神寄托
- ✨ 核心特色
长辈暖心人设
全程采用和蔼至亲长辈口吻交流，温和稳重接地气，告别生硬机械 AI 话术，沉浸式谈心开导。
心理学深度剖析
融合顶尖青年心理洞察逻辑，精准挖掘潜意识情绪、内耗根源、认知偏差，不止解卦更疗愈内心。
狂暴满量输出
适配 Kimi-v1-8K 大模型，拉满上下文算力，无精简无缩写，长篇完整详解，句句通透引人顿悟。
国风诗句点睛
开篇搭配贴合场景经典古诗承接主旨，氛围感拉满，文雅又不失通俗，氛围感十足。
六层完整解读架构
情绪洞察→运势解析→根源拆解→暖心安抚→落地建议→暖心寄语，逻辑层层递进。
轻量化极速部署
基于前端架构开发，Netlify 一键托管上线，访问流畅无卡顿，移动端 PC 端完美适配。
干净无广告
界面简约国风设计，无弹窗、无多余营销内容，专注静心解惑。





## 🛠 技术栈
前端框架：Vue3 + Vite+ Tailwind CSS 3

UI 风格：简约国风中式设计

AI 接口：Kimi-v1-8K

部署平台：Netlify 免费静态托管

数据存储：云端 / 自托管的后端数据库服务存储用户占卜记录 （Supabase）



## 快速开始
https://xiaozhi-augur-online.netlify.app/ 
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
感谢观看！有什么好的建议不


