# 🌌 Aurora Tab (极光标签页)

[![GitHub stars](https://img.shields.io/github/stars/JodexCode/AuroraTab?style=flat-square)](https://github.com/JodexCode/AuroraTab/stargazers)
[![GitHub license](https://img.shields.io/github/license/JodexCode/AuroraTab?style=flat-square)](https://github.com/JodexCode/AuroraTab/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/JodexCode/AuroraTab?style=flat-square)](https://github.com/JodexCode/AuroraTab/commits/main)

一个基于 Vue 3 + Vite 构建的高颜值、高性能浏览器新标签页扩展。提供极简的视觉体验与强大的壁纸管理功能。

## ✨ 特性

- 🌍 **多语言支持**：内置 i18n 系统，支持中文/英文，设备语言自动检测
- 🖼️ **全能壁纸系统**：内置 7 套高质感渐变预设，支持用户上传图片/视频壁纸
- 💾 **智能持久化**：采用 IndexedDB 二进制存储方案，确保壁纸 1:1 无损加载且不占用浏览器同步空间
- 🎨 **极致视觉适配**：
  - 针对浅色壁纸自动优化 UI 辨识度
  - 全局半透明毛玻璃（Backdrop Blur）特效
  - 支持自定义组件圆角与工具栏方向
- ⚡ **性能优先**：严格的内存管理机制（Blob URL 自动释放），即使是 4K 视频壁纸也能流畅运行
- 🔍 **多引擎搜索**：集成 Bing、百度、Google，支持关键词联想与快捷键操作，引擎选择自动记忆

## 📌 最新更新 (v0.2.1)

### 🎨 界面优化

- **毛玻璃效果升级**：面板、搜索下拉菜单、建议列表全面升级为半透明毛玻璃风格
- **自定义工具提示**：新增 ToolButton 组件，替代原生 title 属性

### 🐞 问题修复

- 修复 GitHub Actions CI 类型错误
- 修复面板切换闪烁问题

### 🔧 代码优化

- 提取面板通用样式到独立 CSS 文件
- 升级 GitHub Actions Node.js 版本至 24

> 💡 查看完整更新日志：[RELEASE_NOTES.md](./docs/RELEASE_NOTES.md)
>
> 📜 历史版本记录：[HISTORY.md](./docs/HISTORY.md)

## 🚀 开发与构建

项目基于 [vitesse-webext](https://github.com/antfu/vitesse-webext) 模版开发。

> 📖 详细开发文档：[DEVELOPMENT.md](./docs/DEVELOPMENT.md)

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

然后在浏览器中加载 extension/ 目录即可预览。

### 编译与打包

根据需求，你可以生成未经压缩的代码包或直接发布用的压缩包：

- **基础编译**：

```bash
pnpm run build
```

执行后会在 extension/dist 目录下生成可运行的解压扩展文件，适合在浏览器中"加载未打包的扩展程序"进行测试。

- **发布打包**：

```bash
pnpm run pack
```

该命令会进一步将编译产物压缩，在根目录下生成 extension.zip、extension.crx 或 extension.xpi（用于 Firefox），直接用于上传至扩展商店。

## 📥 下载与安装

你可以前往 [Releases 页面](https://github.com/JodexCode/AuroraTab/releases) 下载最新版本的打包文件：

| 文件格式 | 适用浏览器               | 安装说明                                                                                                                   |
| :------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **.zip** | **Chrome / Edge (推荐)** | 下载后解压。在浏览器地址栏输入 `chrome://extensions`，开启"开发者模式"，点击"加载解压的扩展程序"，选择解压后的文件夹即可。 |
| **.crx** | **Chrome / 开发者版**    | Chrome 的原生打包格式。由于谷歌安全限制，非商店来源的 .crx 可能需要拖入扩展页面安装，且部分版本可能限制运行。              |
| **.xpi** | **Firefox**              | Firefox 专属格式。需通过 Firefox 的附加组件管理器进行安装（注意：未签名版本仅限 Firefox Nightly 或 Unbranded 版本运行）。  |

> **提示**：对于大多数用户，下载 **.zip** 文件并使用"开发者模式"加载是最稳定、直接的安装方式。

> 📖 详细安装指南：[INSTALL.md](./docs/INSTALL.md)

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API) + TypeScript
- **构建**: Vite
- **存储**: IndexedDB (原生二进制存取)
- **样式**: CSS Variables + UnoCSS + Backdrop Filter
- **代码质量**: oxlint + TypeScript 严格类型检查
- **持续集成**: GitHub Actions (CI/CD)

## 📄 开源协议

本项目采用 **MIT License** 开源。

你可以自由地使用、复制、修改和分发本项目的副本，只需在副本中保留原始版权声明和许可声明即可。作者不对软件的质量或使用后果承担法律责任。
