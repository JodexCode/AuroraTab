# 开发指南

> 最后修改时间：2026年3月28日

本文档提供 Aurora Tab 项目的完整开发指南。

## 项目结构

```
aurora-tab/
├── src/
│   ├── assets/           # 静态资源（图标等）
│   ├── background/       # 背景脚本
│   ├── components/       # 共享组件
│   │   ├── panels/      # 设置面板组件
│   │   │   ├── AppearancePanel.vue
│   │   │   ├── LanguagePanel.vue
│   │   │   ├── SettingsPanel.vue
│   │   │   └── WallpaperPanel.vue
│   │   ├── NumberInput.vue
│   │   └── ToolButton.vue
│   ├── composables/     # Vue 组合式函数
│   ├── contentScripts/   # 内容脚本
│   ├── i18n/           # 国际化
│   │   └── locales/
│   │       ├── en.ts
│   │       └── zh.ts
│   ├── logic/           # 业务逻辑
│   ├── newtab/          # 新标签页
│   │   ├── components/
│   │   │   ├── SearchBar.vue
│   │   │   └── Toolbar.vue
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── Newtab.vue
│   ├── options/         # 选项页面（占位）
│   ├── popup/           # 弹出页面
│   ├── sidepanel/      # 侧边栏
│   ├── styles/         # 全局样式
│   │   ├── panel.css        # 面板通用样式
│   │   ├── panel-transition.css  # 面板过渡动画
│   │   └── main.css
│   ├── utils/          # 工具函数
│   │   ├── indexedDB.ts  # IndexedDB 操作
│   │   ├── presets.ts    # 预设壁纸
│   │   └── searchEngines.ts  # 搜索引擎配置
│   ├── manifest.ts      # 扩展清单
│   └── env.ts          # 环境变量
├── scripts/            # 构建脚本
├── extension/         # 编译输出
└── docs/              # 项目文档
```

## 开发环境

### 环境要求

- Node.js 20+
- pnpm 9+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

这将启动开发服务器并在浏览器中加载 `extension/` 目录即可预览。

### 热重载

项目支持以下热重载：

- **Vite HMR**: 前端页面修改自动刷新
- **Background HMR**: 背景脚本修改自动重载

### 构建

```bash
# 开发构建
pnpm run build

# 发布打包
pnpm run pack
```

构建产物输出到 `extension/` 目录，打包产物输出到根目录。

## 代码规范

### Lint 检查

```bash
pnpm run lint
```

使用 oxlint 进行代码检查。

### 类型检查

```bash
pnpm run typecheck
```

使用 TypeScript 严格模式进行类型检查。

### 测试

```bash
# 单元测试
pnpm run test

# E2E 测试
pnpm run test:e2e
```

## 面板系统

### 添加新面板

1. 在 `src/components/panels/` 创建 Vue 组件
2. 导入共享样式：
   ```ts
   import '~/styles/panel-transition.css'
   import '~/styles/panel.css'
   ```
3. 使用 `.panel-container` 类名
4. 在 `Newtab.vue` 中注册并使用

### 面板Props

所有面板组件接受以下 props：

| Prop | 类型 | 说明 |
|------|------|------|
| direction | `'left' \| 'up'` | 工具栏方向 |

### 面板事件

| 事件 | 说明 |
|------|------|
| close | 关闭面板 |

## 搜索引擎

### 添加新搜索引擎

在 `src/utils/searchEngines.ts` 的 `engines` 数组中添加：

```ts
{
  name: 'EngineName' as const,
  url: 'https://search.example.com/search?q=',
  icon: '<svg>...</svg>'
}
```

`EngineName` 类型会自动推断。

## 国际化

### 添加新语言

1. 在 `src/i18n/locales/` 创建语言文件（如 `ja.ts`）
2. 在 `src/i18n/index.ts` 的 `locales` 数组中添加条目
3. 在 `messages` 对象中添加对应翻译

### 翻译格式

```ts
export default {
  // 面板标题
  panelName: {
    title: '标题',
    description: '描述'
  },
  // 工具栏
  toolbar: {
    button: '按钮文字'
  }
}
```

使用 `t('key.subkey')` 调用。

## 样式指南

### 毛玻璃效果

使用共享的毛玻璃样式：

```css
background-color: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(30px) saturate(120%);
-webkit-backdrop-filter: blur(30px) saturate(120%);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### 过渡动画

使用共享的过渡效果：

```vue
<transition name="panel">
  <div v-if="isOpen" class="panel-container">
    <!-- 内容 -->
  </div>
</transition>
```

## 数据存储

### IndexedDB

项目使用 IndexedDB 存储：

- **用户设置**: `settings` store
- **自定义壁纸**: `wallpapers` store

### 存储版本

当前版本为 3，升级时在 `indexedDB.ts` 的 `onupgradeneeded` 事件中处理迁移。

## Git 工作流

### 提交规范

项目使用常规提交格式：

```
feat: 新功能
fix: 修复
style: 样式
refactor: 重构
build: 构建
ci: CI/CD
chrome：维护性变更
```

### 发布流程

1. 更新版本号 `package.json`
2. 更新 `docs/RELEASE_NOTES.md`
3. 在 `docs/HISTORY.md` 中添加版本记录
4. 创建 Git 标签
5. 推送标签触发 Release 工作流
