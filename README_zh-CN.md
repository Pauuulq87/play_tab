<div align="center">

# Play Tab

<img src="https://api.iconify.design/mdi/tab.svg" width="64" height="64" alt="Tab Manager"/>

浏览器分页与书签管理插件。Raindrop.io 风格 UI，深色模式、拖拽功能、云端同步。

[English](./README.md) | [繁體中文](./README_zh-TW.md) | **简体中文**

</div>

---

## 功能特色

- **三栏式布局** — 左侧导航（集合）、中间网格（书签）、右侧面板（打开的分页）
- **卡片视图** — 丰富的书签卡片，含 Favicon、标题、描述
- **拖拽功能** — 从右侧面板拖拽分页存为书签
- **深色模式** — 现代深色 UI 设计
- **Chrome 扩展** — Manifest V3 规范

## 技术栈

- React 19 + TypeScript
- Vite + Tailwind CSS
- Chrome Extension API
- Supabase（可选云端同步）

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 加载扩展

1. 打开 `chrome://extensions/`
2. 启用「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `dist/` 文件夹

## 项目结构

```
play_tab/
├── src/
│   ├── components/    # React 组件
│   ├── pages/         # 页面组件
│   ├── services/      # 服务层
│   └── utils/         # 工具函数
├── docs/              # 文档
└── public/            # 静态资源
```

## 文档

- [QUICKSTART.md](./QUICKSTART.md) — 快速入门
- [docs/SETUP.md](./docs/SETUP.md) — 详细设置
- [CLAUDE.md](./CLAUDE.md) — 项目规范

## 开发状态

- [x] 前端架构初始化完成
- [x] 三栏式界面实现完成
- [x] 深色模式支持
- [x] Chrome Extension 基础配置
- [ ] Chrome Tabs API 集成
- [ ] 拖拽交互功能
- [ ] 数据持久化

---

## 许可证

MIT

## 致谢

Made with ❤️ by **Pauuulq87**
