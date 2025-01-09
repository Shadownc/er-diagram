# ER 图生成器

一个基于 SQL 语句自动生成 ER 图的 Web 应用。

## 功能特点

- 📝 支持 SQL 语句直接输入
- 📁 支持 SQL 文件上传
- 🔄 自动解析 SQL 并生成 ER 图
- 💾 支持导出 ER 图为 PNG 格式
- 🎨 美观的可视化界面

## 技术栈

- [Nuxt 3](https://nuxt.com/) - Vue.js 框架
- [Nuxt UI](https://ui.nuxt.com/) - UI 组件库
- [GoJS](https://gojs.net/) - 图表可视化库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

## 开始使用

### 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn 或 pnpm

### 安装

``` bash
克隆项目
git clone 
安装依赖
npm install
或
yarn install
或
pnpm install
```

### 开发

``` bash
启动开发服务器
npm run dev
或
yarn dev
或
pnpm dev
```

访问 `http://localhost:3000`

### 构建

``` bash
npm run build
或
yarn build
或
pnpm build
```

## 使用说明

1. 在文本框中输入 SQL 语句，或者点击"上传 SQL 文件"按钮上传 SQL 文件
2. 点击"生成 ER 图"按钮
3. 等待图表生成
4. 可以通过点击下载按钮将图表保存为 PNG 格式

## 许可证

[MIT License](LICENSE)