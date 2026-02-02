<div align="center">
  <h1><img src="https://api.iconify.design/lucide/layout-grid.svg?color=%2300c9ff" width="28" height="28" /> Play Tab</h1>
  <p><strong>浏览器标签与书签管理器</strong></p>
  <p>仿 Raindrop.io 的 Chrome 扩展。拖拽标签即可保存、用集合整理、卡片式深色模式 UI。</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/Chrome-Extension-blue.svg" alt="Chrome Extension" />
  <img src="https://img.shields.io/badge/React-18-blue.svg" alt="React" />
</p>

<p align="center">
  <a href="README.md">English</a> • <a href="README_zh-TW.md">繁體中文</a> • <strong>简体中文</strong>
</p>

---

### <img src="https://api.iconify.design/lucide/triangle-alert.svg?color=%23ff6b6b" width="18" height="18" /> 痛点

浏览器标签越开越多。书签埋在嵌套文件夹里找不到。在标签和收藏间切换很笨拙。

### <img src="https://api.iconify.design/lucide/sparkles.svg?color=%2300c9ff" width="18" height="18" /> 解决方案

Chrome 侧边面板的可视化书签 + 标签管理器：

- **拖放功能** — 拖拽打开的标签到收藏集合
- **卡片式 UI** — 视觉预览含 favicon 和 OG 图片
- **多层级整理** — 空间 > 集合 > 标签
- **深色模式** — Tailwind CSS 现代化 UI
- **实时标签列表** — 右侧栏显示所有打开标签

### <img src="https://api.iconify.design/lucide/download.svg?color=%2300c9ff" width="18" height="18" /> 安装

**前置需求**
- Node.js >= 18.0.0
- npm >= 9.0.0

**配置**
```bash
git clone https://github.com/Pauuulq87/play_tab.git
cd play_tab

# 安装依赖
npm install

# 正式版构建
npm run build

# 加载到 Chrome
# 1. 打开 chrome://extensions/
# 2. 启用开发者模式
# 3. 点击「加载已解压的扩展程序」
# 4. 选择 dist/ 文件夹
```

### <img src="https://api.iconify.design/lucide/rocket.svg?color=%2300c9ff" width="18" height="18" /> 使用方式

**保存标签**
1. 打开侧边面板
2. 从右侧栏拖拽标签到集合
3. 自动保存 favicon + 标题

**整理收藏**
- 创建空间（顶层分类）
- 在空间内新增集合
- 用标签标记书签，跨集合搜索

**快速操作**
- 点击书签卡片 → 打开标签
- 右键 → 编辑/删除/移动
- 搜索栏 → 过滤所有书签

### <img src="https://api.iconify.design/lucide/wrench.svg?color=%2300c9ff" width="18" height="18" /> 开发

```bash
# 开发模式（热重载）
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check
```

**技术栈**
- React 18 + TypeScript
- Vite + CRXJS
- Tailwind CSS
- dnd-kit（拖放功能）
- Chrome Extension Manifest V3

---

<div align="center">
  <p><strong>MIT License</strong> - 专为标签囤积者和整理控打造。</p>
  <p><em>谢谢 GitHub 开发者把智慧与经验分享出来，才有今天的我。</em></p>
</div>
