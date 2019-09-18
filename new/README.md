# 新知识（个人）

```es6
// child_process.spawn() 方法异步地衍生子进程，且不阻塞 Node.js 事件循环
// child_process.spawn(command[, args][, options])
// command 要运行的命令 args 字符串参数的列表
// options.stdio 选项用于配置在父进程和子进程之间建立的管道。
// options.shell 如果为 true，则在 shell 中运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。 可以将不同的 shell 指定为字符串。 参阅 shell 的要求与 Windows 默认的 shell。 默认值: false（没有 shell）。
const executedCommand = cp.spawn(command, args, {
  stdio: "inherit",
  shell: true
});

// The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
// 使用了 entries 后，可以使用 for of 方法了
// for (const [key, value] of this.groupMap.entries()) {
Map.prototype.entries()

// 使用 webpackOptionsSchema 配合 ajv 校验配置项格式是否正确
const webpackOptionsValidationErrors = validateSchema(
  webpackOptionsSchema,
  options
);

// require.resolve 增强版，NodeEnvironmentPlugin 给 compiler 提供了更强大的解析路径能力
// alias 功能就是用这个工具实现的
new NodeEnvironmentPlugin({
  infrastructureLogging: options.infrastructureLogging
}).apply(compiler);

// webpack 核心使用 Tapable 来实现插件(plugins)的 binding 和 applying.

```