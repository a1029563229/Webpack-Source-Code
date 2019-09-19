# Webpack 源码阅读笔记（已完结）

## 概述
- 首先执行 webpack 命令，在 webpack4.0+ 中，webpack 命令会被派发 webpack-cli，由 webpack-cli 处理输入的参数；
- webpack-cli 处理输入的参数，调用了不同的分组和不同的分组构造函数对配置项进行初始化，完成初始配置，在此过程中还会对 webpack.config 文件进行检索，然后生成一份配置，这份配置被传回给 webpack 继续处理；
- webpack 拿到配置项后先进行格式校验，如果配置项的字段格式出现错误则直接抛错，通过校验后开始构建 compiler；
- compiler 负责编译工作，并且使用 Tapable 注册了一系列的钩子，这些钩子会在特定的生命周期被调用，钩子会将 compiler 暴露出来，并且执行 plugins 的 apply 方法（plugin 访问到 compiler 就是这个原因）；
- compiler 将钩子注册好以后，开始执行内部的 run 方法，run 内部调用 compile，compile 由 Compilation 实现，Compilation 内部就是完整的编译过程；
- Compilation 开始的时候和 webpack-cli 一样，也是先创建了对应了工厂构造函数，然后在工厂函数中调用了 loader，loader 处理以后的模块再由 acorn 生成 AST 语法树，遍历AST,遇到 require 等依赖时，创建依赖(Dependency)加入依赖数组。
- 调用 Compilation 的 seal 方法对 AST 进行编译，生成编译后的源码，合并，拆分，生成 hash，导出文件。
- 完成。

## 入口文件
+ [webpack](https://github.com/a1029563229/Webpack-Source-Code/tree/master/bin/webpack)
+ [webpack-cli](https://github.com/a1029563229/Webpack-Source-Code/tree/master/bin/cli)

## 主程序
+ [bootstrap](https://github.com/a1029563229/Webpack-Source-Code/tree/master/lib/bootstrap)
+ [webpack-cli](https://github.com/a1029563229/Webpack-Source-Code/tree/master/lib/webpack-cli)

## 新知识
+ [新知识点](https://github.com/a1029563229/Webpack-Source-Code/tree/master/new)
+ [库](https://github.com/a1029563229/Webpack-Source-Code/tree/master/new/lib)
+ [loader](https://github.com/a1029563229/Webpack-Source-Code/tree/master/new/loader)
+ [plugins](https://github.com/a1029563229/Webpack-Source-Code/tree/master/new/plugins)