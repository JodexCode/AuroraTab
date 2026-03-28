# 🚀 Aurora Tab v0.1.1

![Release Version](https://img.shields.io/badge/version-0.1.1-blue)

---

## 🐞 Bug 修复

- 修复 `useWebExtensionStorage.ts` 中序列化器缓存的类型定义问题，提升代码健壮性

---

## ⚡ 性能优化

### IndexedDB 写入优化

- **Options.vue**: 设置变更监听添加 **防抖处理（300ms）**，避免用户拖拽滑块等连续操作时频繁写入数据库，减少性能开销

### 数据库初始化优化

- **indexedDB.ts**: 引入 `ensureInit()` 统一初始化方法，消除各方法中重复的初始化检查逻辑，代码更简洁高效

### 序列化器缓存

- **useWebExtensionStorage.ts**: 添加序列化器缓存机制，避免每次调用时重复创建相同的序列化器实例

### 编译速度提升

- **tsconfig.json**: 开启 **增量编译**（`incremental: true`），后续编译速度显著提升

---

## 🔧 代码质量提升

- **manifest.ts**: 移除 `any` 类型硬转换，采用类型扩展（Type Extension）提升 TypeScript 类型安全
- 优化项目整体类型检查通过率

---

## 🔄 升级说明

> 如果您正在使用 v0.1.0 版本，建议升级以获得更好的性能和稳定性。

---

## 🙏 贡献者

- [@JodexCode](https://github.com/JodexCode) - 核心开发

---

## 📦 下载安装

### Chrome / Edge

- [下载 .crx 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.1.1/aurora-tab-0.1.1.crx)
- [下载 .zip 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.1.1/aurora-tab-0.1.1.zip)

### Firefox

- [下载 .xpi 文件](https://github.com/JodexCode/AuroraTab/releases/download/v0.1.1/aurora-tab-0.1.1.xpi)

---

历史版本记录请查看 [HISTORY.md](./HISTORY.md)
