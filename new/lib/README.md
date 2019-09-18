# 个人新知识（库）

```es6
// child_process 模块提供了衍生子进程的能力（以一种与 popen(3) 类似但不相同的方式）。 此功能主要由 child_process.spawn() 函数提供：
// 在子进程中可以执行 shell 命令，也可以生成新的 Node 进程并且调用指定模块（构建父子进程通信）
const cp = require("child_process");

// 工具类应用使用此包会加速构建速度。
require('v8-compile-cache');

// 查询更新
const updateNotifier = require('update-notifier');

// 版本管理工具
const semver = require('semver');

// 读取命令行的参数
const cmdArgs = require('command-line-args');

// JSON 格式校验器
const Ajv = require("ajv");

// require.resolve 增强版
const {
  NodeJsInputFileSystem,
  CachedInputFileSystem,
  ResolverFactory 
} = require('enhanced-resolve');

// 创建一些功能强大的钩子，类似于 发布/订阅模式
const {
	Tapable,
	SyncHook,
	SyncBailHook,
	AsyncParallelHook,
	AsyncSeriesHook
} = require("tapable");
```