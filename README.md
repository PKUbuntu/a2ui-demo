# A2UI Demo

A2UI Protocol 演示网站 - 展示 Agent to UI 协议的能力。

## 项目结构

```
a2ui-demo/
├── index.html          # 主页
├── canvas.html         # Canvas 展示页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── a2ui-renderer.js # A2UI 渲染器
│   └── canvas.js       # Canvas 页面控制器
├── examples/           # 示例页面（待扩展）
├── package.json
└── README.md
```

## 功能特性

### 主页
- A2UI 协议介绍
- 核心特性展示
- 协议流程说明
- 快速开始代码示例

### Canvas 展示页面
- 实时渲染 A2UI JSONL 消息
- 内置示例：
  - Hello World
  - 表单组件
  - 列表渲染
  - 卡片布局

## 本地运行

```bash
# 安装依赖（可选）
npm install

# 启动本地服务器
npm run serve

# 或使用任意静态服务器
npx serve .
```

## A2UI 协议

A2UI (Agent to UI) 是一种让 AI Agent 能够实时生成和更新用户界面的协议。

### 核心消息类型

| 消息 | 用途 |
|------|------|
| `surfaceUpdate` | 定义或更新 UI 组件 |
| `dataModelUpdate` | 填充或更新数据状态 |
| `beginRendering` | 通知客户端开始渲染 |

### 示例

```jsonl
{"surfaceUpdate": {"surfaceId": "main", "components": [
  {"id": "root", "component": {"Column": {"children": {"explicitList": ["title", "button"]}}}},
  {"id": "title", "component": {"Text": {"text": {"literalString": "Hello A2UI"}, "usageHint": "h1"}}},
  {"id": "button", "component": {"Button": {"child": "btn_text", "action": {"name": "click"}}}},
  {"id": "btn_text", "component": {"Text": {"text": {"literalString": "Click Me"}}}}
]}}
{"beginRendering": {"surfaceId": "main", "root": "root"}}
```

## 相关链接

- [A2UI GitHub](https://github.com/google/A2UI)
- [A2UI 规范文档](https://github.com/google/A2UI/blob/main/specification/0.8/README.md)

## License

MIT