# 🚀 Aurora Tab v0.2.0

![Release Version](https://img.shields.io/badge/version-0.2.0-blue)

---

## 🌟 新增功能

### 🌐 多语言系统 (i18n)

- 新增 **i18n 多语言系统**，支持英文和中文两种语言
- 语言文件位于 `src/i18n/locales/` 目录，支持动态切换
- **默认语言自动检测**：通过 `navigator.language` 自动识别设备语言
- 语言设置保存到 IndexedDB，切换后立即生效
- 国际化支持覆盖工具栏、搜索框、各类面板等所有 UI 文本

### 🔍 可配置搜索引擎

- 新增**搜索引擎选择记忆功能**，用户选择的搜索引擎（Bing/Baidu/Google）会在关闭标签页后自动保存
- 创建统一的搜索引擎配置文件 `searchEngines.ts`，便于扩展新引擎
- 类型自动从引擎配置推断，添加新引擎时无需手动更新类型

### ⚙️ GitHub Actions CI 工作流

- 新增 CI 工作流，每次 push 和 PR 自动运行 `pnpm lint` 和 `pnpm typecheck`
- 将项目 lint 工具从 eslint 迁移到 oxlint

---

## 🔄 重构优化

### 面板系统重构

- 将工具栏从单一的设置按钮**重构为四个独立入口**：
  - **外观 (Appearance)**：工具栏位置、搜索栏宽度/圆角、面板圆角等样式设置
  - **语言 (Language)**：语言切换面板
  - **设置 (Settings)**：预留功能入口
  - **壁纸 (Wallpaper)**：壁纸设置面板
- 新增 `AppearancePanel.vue` 组件，专门处理外观相关设置
- 新增 `LanguagePanel.vue` 组件，处理语言切换逻辑
- 简化 `SettingsPanel.vue`，移除外观相关设置

### 目录结构优化

- 将组件从 `src/options/components/` 迁移到 `src/components/panels/`
- 创建 `src/newtab/` 作为新标签页主目录
- 工具函数移至 `src/utils/`
- 壁纸预设独立为 `src/utils/presets.ts`

### 组件优化

- 新增 `NumberInput` 组件，替换原生数字输入框，提供更好的自定义样式
- 优化工具栏面板位置，避免遮挡工具栏
- 面板打开逻辑使用对象映射管理，更加灵活可扩展

---

## 🐞 问题修复

### NumberInput 组件

- 修复输入非数字字符时 NaN 导致的问题，现在会正确回退到最小值

### 壁纸系统

- 修复首次加载页面无壁纸显示的问题
- 修复预设壁纸动态切换不生效的问题
- 完善壁纸配置检查逻辑

### 面板交互

- 修复 `openPanel` 函数的类型安全问题
- 优化工具面板打开逻辑

### 开发环境

- 修复开发模式下 Content Security Policy 问题

---

## 🔄 升级说明

> 如果您正在使用 v0.1.1 版本，建议升级以获得更好的性能和稳定性。新增的多语言支持和搜索引擎记忆功能将显著提升使用体验。

---

## 🙏 贡献者

- [@JodexCode](https://github.com/JodexCode) - 核心开发

---

## 📦 下载安装

### Chrome / Edge

- [下载 .crx 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.2.0/aurora-tab-0.2.0.crx)
- [下载 .zip 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.2.0/aurora-tab-0.2.0.zip)

### Firefox

- [下载 .xpi 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.2.0/aurora-tab-0.2.0.xpi)

---

历史版本记录请查看 [HISTORY.md](./HISTORY.md)
