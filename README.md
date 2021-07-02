# ballcat-ui-react

## 前言

`BallCat` 组织旨在为项目快速开发提供一系列的基础能力，方便使用者根据项目需求快速进行功能拓展。

在以前使用其他后台管理脚手架进行开发时，经常会遇到因为项目业务原因需要进行二开的问题，在长期的开发后，一旦源项目进行迭代升级，很难进行同步更新。

所以 BallCat 推荐开发项目时，以依赖的方式引入 BallCat 中提供的所有功能，包括用户及权限管理相关，这样后续跟随 BallCat 版本升级时只需要修改对应的依赖版本号即可完成同步，BallCat 也会为每个版本升级提供 SQL 改动文件。

BallCat 中的所有 JAR 包都已推送至中央仓库，尝鲜使用快照版本也可以通过配置 sonatype 的快照仓库获取。

如果在使用中遇到了必须通过二开修改源码才能解决的问题或功能时，欢迎提 issuse，如果功能具有通用性，我们会为 BallCat 添加此能力，也欢迎直接 PR 你的改动。



## 相关仓库

| 项目            | 简介                                 | github 地址                                         |
| --------------- | ------------------------------------ | --------------------------------------------------- |
| ballcat         | 核心项目组件                         | https://github.com/ballcat-projects/ballcat         |
| ballcat-ui-vue  | 管理后台前端                         | https://github.com/ballcat-projects/ballcat-ui-vue  |
| ballcat-codegen | 代码生成器                           | https://github.com/ballcat-projects/ballcat-codegen |
| ballcat-samples | 一些使用示例，例如权限管理模块的引入 | https://github.com/ballcat-projects/ballcat-samples |



## 地址链接

**管理后台预览**：http://preview.ballcat.cn
> admin / a123456

**代码生成器预览**：http://codegen.ballcat.cn/

**文档地址**：http://www.ballcat.cn/ （目前文档只有少量内容，会陆续填坑）



# ballcat-ui-vue

此仓库是 BallCat 项目中的后台管理的前端实现，基于 Vue + Ant-Design-Vue 实现。

项目对于基础表格页面和表单页面的增删改查等操作抽取了 mixin 混入，简化 CRUD 开发难度。

另外还提供了一些基本的业务组件，如字典选择，字典标签 和 弹窗选择器等常用功能组件。



## 项目结构

```s
|-- config   -- 切换主题色使用的插件
|-- public   -- 依赖的静态资源存放
`-- src           
    |-- api      -- 和服务端交互的请求方法
    |-- assets   --  本地静态资源
    |-- components  -- 通用组件
    |-- config     -- 框架配置
    |-- core       -- 项目引导, 全局配置初始化，依赖包引入等
    |-- layouts    -- 布局
    |-- locales    -- 国际化
    |-- mixins     -- 增删改查页面的抽取模板
    |-- router     -- 路由相关
    |-- store      -- 数据存储相关
    |-- styles     -- 项目中的一些全局样式
    |-- utils      -- 工具类
    |-- views      -- 页面
    |-- App.Vue    -- Vue 模板入口
    |-- main.js    -- Vue 入口js
    `-- permission.js   -- 路由守卫 权限控制
```



## 核心依赖

| 依赖           | 版本   | 官网                              |
| -------------- | ------ | --------------------------------- |
| Vue            | 2.6.12 | https://cn.vuejs.org/             |
| Vue Router     | 3.5.1  | https://router.vuejs.org/zh/      |
| Vuex           | 3.6.2  | https://vuex.vuejs.org/zh/guide/  |
| Axios          | 0.21.1 | https://axios-http.com/docs/intro |
| Ant Design Vue | 1.7.4  | https://www.antdv.com             |
