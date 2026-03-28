# 📜 版本历史

本文档记录 Aurora Tab 的所有历史版本。关于最新版本信息，请查看 [RELEASE_NOTES.md](./RELEASE_NOTES.md)。

---

## v0.2.0

![Release Version](https://img.shields.io/badge/version-0.2.0-blue)

### 🌟 新增功能

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

### 🔄 重构优化

#### 面板系统重构

- 将工具栏从单一的设置按钮**重构为四个独立入口**：
  - **外观 (Appearance)**：工具栏位置、搜索栏宽度/圆角、面板圆角等样式设置
  - **语言 (Language)**：语言切换面板
  - **设置 (Settings)**：预留功能入口
  - **壁纸 (Wallpaper)**：壁纸设置面板
- 新增 `AppearancePanel.vue` 组件，专门处理外观相关设置
- 新增 `LanguagePanel.vue` 组件，处理语言切换逻辑
- 简化 `SettingsPanel.vue`，移除外观相关设置

#### 目录结构优化

- 将组件从 `src/options/components/` 迁移到 `src/components/panels/`
- 创建 `src/newtab/` 作为新标签页主目录
- 工具函数移至 `src/utils/`
- 壁纸预设独立为 `src/utils/presets.ts`

#### 组件优化

- 新增 `NumberInput` 组件，替换原生数字输入框，提供更好的自定义样式
- 优化工具栏面板位置，避免遮挡工具栏
- 面板打开逻辑使用对象映射管理，更加灵活可扩展

### 🐞 问题修复

- 修复 NumberInput 输入 NaN 问题
- 修复首次加载无壁纸显示问题
- 修复预设壁纸动态切换问题

### 📦 下载安装

#### Chrome / Edge

- [下载 .crx 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.2.0/aurora-tab-0.2.0.crx)
- [下载 .zip 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.2.0/aurora-tab-0.2.0.zip)

#### Firefox

- [下载 .xpi 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.2.0/aurora-tab-0.2.0.xpi)

### 🙏 贡献者

- [@JodexCode](https://github.com/JodexCode) - 核心开发

---

## v0.1.1

![Release Version](https://img.shields.io/badge/version-0.1.1-blue)

### 🐞 问题修复

- 修复 `useWebExtensionStorage.ts` 中序列化器缓存的类型定义问题，提升代码健壮性

### ⚡ 性能优化

#### IndexedDB 写入优化

- **Options.vue**: 设置变更监听添加 **防抖处理（300ms）**，避免用户拖拽滑块等连续操作时频繁写入数据库，减少性能开销

#### 数据库初始化优化

- **indexedDB.ts**: 引入 `ensureInit()` 统一初始化方法，消除各方法中重复的初始化检查逻辑，代码更简洁高效

#### 序列化器缓存

- **useWebExtensionStorage.ts**: 添加序列化器缓存机制，避免每次调用时重复创建相同的序列化器实例

#### 编译速度提升

- **tsconfig.json**: 开启 **增量编译**（`incremental: true`），后续编译速度显著提升

### 🔧 代码质量提升

- **manifest.ts**: 移除 `any` 类型硬转换，采用类型扩展（Type Extension）提升 TypeScript 类型安全
- 优化项目整体类型检查通过率

### 📦 下载安装

#### Chrome / Edge

- [下载 .crx 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.1.1/aurora-tab-0.1.1.crx)
- [下载 .zip 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.1.1/aurora-tab-0.1.1.zip)

#### Firefox

- [下载 .xpi 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.1.1/aurora-tab-0.1.1.xpi)

### 🙏 贡献者

- [@JodexCode](https://github.com/JodexCode) - 核心开发

---

## v0.1.0

![Release Version](https://img.shields.io/badge/version-0.1.0-blue)

### 🌟 核心亮点

本版本作为 Aurora Tab 的基石版本，确立了 **"极简且美观"** 的设计哲学。我们实现了多引擎搜索、深度自定义壁纸系统以及灵活的 UI 配置功能，所有数据均持久化存储于本地。

---

### 🔍 搜索功能

#### ✨ 多引擎切换

内置 **Bing、Baidu 和 Google** 三大主流搜索引擎，支持一键无缝切换。

#### 💡 智能搜索建议

- 对接各引擎官方 API，实时获取关键词联想
- 支持键盘上下键选择建议项及回车搜索，提升操作效率

#### 🎨 交互优化

- 输入框支持**防抖处理（200ms）**，减少无效请求
- 搜索栏采用**磨砂玻璃质感**设计，视觉更加通透

---

### 🖼️ 壁纸系统

#### 🎯 多样化预设

内置 **7 套精心调配**的 CSS 高质量渐变色（如"深海流光"、"森林呼吸"等），极致护眼且轻量

#### 📤 自定义上传

支持用户**自行上传图片或视频**作为背景，满足个性化需求

#### 💾 本地存储优化

采用 **IndexedDB 二进制存储**技术，直接保存 File/Blob 对象，有效避免高清大图导致的页面卡顿

---

### ⚙️ 深度自定义设置

#### 📐 布局调整

- 支持**工具栏方向切换**（左侧或上方展示）

#### 🎨 视觉参数微调

| 设置项       | 自定义范围            |
| ------------ | --------------------- |
| 搜索栏宽度   | 支持 `px` 或 `%` 单位 |
| 搜索栏圆角   | 支持 `px` 或 `%` 单位 |
| 全局面板圆角 | 实时调整              |

#### ⚡ 实时预览

- **所有设置项修改后立即生效**，无需刷新页面

---

### 🛠️ 技术底层

#### 📦 技术栈

- 基于 **Vue 3 (Composition API) + TypeScript + Vite** 构建

#### 🔐 数据持久化

- 使用 **IndexedDB (`AuroraTabDB`)** 存储用户配置与资源
- 数据库版本升级至 **v2** 以支持壁纸库
- 实现配置对象的**深度监听与自动保存机制**

#### ⚡ 性能优化

- 引入 **`URL.revokeObjectURL`** 机制，在切换壁纸时及时释放内存，防止泄漏
- 主界面支持**毛玻璃（Blur）特效联动**，当弹出设置面板时自动虚化背景

---

### 📝 开发者备注

> 部分非关键功能的实现效果暂未达到预期（如脚本中的搁置备注），将在后续版本中持续迭代优化。
> 项目处于起步阶段，接下来的版本可能会有较大改动。

---

### 📦 下载安装

#### Chrome / Edge

- [下载 .crx 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.1.0/aurora-tab-0.1.0.crx)
- [下载 .zip 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.1.0/aurora-tab-0.1.0.zip)

#### Firefox

- [下载 .xpi 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.1.0/aurora-tab-0.1.0.xpi)

---

### 🙏 贡献者

- [@JodexCode](https://github.com/JodexCode) - 核心开发

---

### 🔜 新功能预告

- [ ] 暗色模式增强
- [ ] 更多搜索引擎支持
- [ ] 壁纸自动轮播
- [ ] 性能进一步优化

可以在issue中提出建议或报告问题。
