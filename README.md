# BallCat

## 前言

`BallCat` 组织旨在为项目快速开发提供一系列的基础能力，方便使用者根据项目需求快速进行功能拓展。

在以前使用其他后台管理脚手架进行开发时，经常会遇到因为项目业务原因需要进行二开的问题，在长期的开发后，一旦源项目进行迭代升级，很难进行同步更新。

所以 BallCat 推荐开发项目时，以依赖的方式引入 BallCat 中提供的所有功能，包括用户及权限管理相关，这样后续跟随 BallCat 版本升级时只需要修改对应的依赖版本号即可完成同步，BallCat 也会为每个版本升级提供 SQL 改动文件。

BallCat 中的所有 JAR 包都已推送至中央仓库，尝鲜使用快照版本也可以通过配置 sonatype 的快照仓库获取。

如果在使用中遇到了必须通过二开修改源码才能解决的问题或功能时，欢迎提 issuse，如果功能具有通用性，我们会为 BallCat 添加此能力，也欢迎直接 PR 你的改动。

## 相关仓库

| 项目 | 简介 | github 地址 |
| --- | --- | --- |
| ballcat | 核心项目组件 | https://github.com/ballcat-projects/ballcat |
| ballcat-ui-vue | 管理后台前端-Vue | https://github.com/ballcat-projects/ballcat-ui-vue |
| ballcat-ui-react | 管理后台前端-React | https://github.com/ballcat-projects/ballcat-ui-react |
| ballcat-codegen | 代码生成器 | https://github.com/ballcat-projects/ballcat-codegen |
| ballcat-samples | 一些使用示例，例如权限管理模块的引入 | https://github.com/ballcat-projects/ballcat-samples |

## 地址链接

**管理后台预览-Vue**：http://preview.ballcat.cn

**管理后台预览-React**：http://react.ballcat.cn/

> admin / a123456

**代码生成器预览**：http://codegen.ballcat.cn/

**文档地址**：http://www.ballcat.cn/ （目前文档只有少量内容，会陆续填坑）

# ballcat-ui-react

此仓库是 BallCat 项目中的后台管理的前端实现，基于 React + Ant-Design-Pro 实现。

项目对于基础表格页面和表单页面的增删改查等操作抽取了 Page 混入，简化 CRUD 开发难度。

另外还提供了一些基本的业务组件，如字典选择，字典标签 和 弹窗选择器等常用功能组件。

## 项目结构

```s
`-- config      -- 配置
    |-- lov     -- lov本地配置
    |-- proxy   -- 开发环境代理
    |-- setting -- 项目基础配置, logo, icon, 缓存 等
|-- public      -- 依赖的静态资源存放
`-- src
    `-- components  -- 通用组件
        |-- Auth    -- 权限控制按钮
        |-- Page    -- 高度封装的页面, 简化CRUD, 具体参考Pages下原有页面实现
        |-- Dict    -- 数据字典
        |-- Form    -- 部分组件的Form包装.
    |-- layouts     -- 布局
    |-- locales     -- 国际化
    |-- pages       -- 页面
    `-- services    -- 请求接口配置
        |-- ant-design-pro  -- 登录,退出等
        |-- ballcat         -- ballcat后台接口
        |-- captcha         -- 验证码接口
    |-- utils       -- 工具类
    |-- app.tsx     -- Vue 模板入口
    |-- global.less -- 全局样式
```

## 核心依赖

| 依赖     | 版本     | 官网                          |
| -------- | -------- | ----------------------------- |
| React    | ^17.0.0  | https://zh-hans.reactjs.org/  |
| Antd     | ^4.16.13 | https://ant.design/           |
| Antd Pro | v5       | https://pro.ant.design/zh-CN/ |
| Umi      | ^v3.4.0  | https://umijs.org/zh-CN       |
