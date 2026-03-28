# 🚀 Aurora Tab v0.2.1

![Release Version](https://img.shields.io/badge/version-0.2.1-blue)

---

## 🎨 界面优化

### 毛玻璃效果升级

- 面板背景升级为半透明毛玻璃效果，采用 `backdrop-filter: blur(30px) saturate(180%)`
- 搜索引擎下拉菜单和搜索建议列表同步应用统一视觉风格
- 优化面板过渡动画，时长统一为 250ms

### 工具提示组件

- 新增自定义 ToolButton 组件，替代原生 title 属性
- 悬停时显示美化的小提示框，带箭头指示

---

## 🐞 问题修复

- 修复 GitHub Actions CI 中 webextension-polyfill 类型未找到的问题
- 修复面板切换时的闪烁问题
- 优化搜索引擎选择持久化功能

---

## 🔧 代码优化

- 提取面板通用样式到 `src/styles/panel.css`
- 提取过渡动画到 `src/styles/panel-transition.css`
- 修复 ToolButton 组件事件透传问题
- 升级 GitHub Actions Node.js 版本至 24

---

## 🔄 升级说明

> 如果您正在使用 v0.2.0 版本，建议升级以获得更好的视觉体验。

---

## 🙏 贡献者

- [@JodexCode](https://github.com/JodexCode) - 核心开发

---

## 📦 下载安装

### Chrome / Edge

- [下载 .crx 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.2.1/aurora-tab-0.2.1.crx)
- [下载 .zip 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.2.1/aurora-tab-0.2.1.zip)

### Firefox

- [下载 .xpi 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.2.1/aurora-tab-0.2.1.xpi)

---

历史版本记录请查看 [HISTORY.md](./HISTORY.md)
