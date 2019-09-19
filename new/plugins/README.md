# plugins 合集

## AggressiveSplittingPlugin
AggressiveSplittingPlugin 可以将 bundle 拆分成更小的 chunk，直到各个 chunk 的大小达到 option 设置的 maxSize。它通过目录结构将模块组织在一起。

## BannerPlugin
为每个 chunk 文件头部添加 banner，可用于全局初始化设定。
```js
{
  banner: string, // 其值为字符串，将作为注释存在
  raw: boolean, // 如果值为 true，将直出，不会被作为注释
  entryOnly: boolean, // 如果值为 true，将只在入口 chunks 文件中添加
  test: string | RegExp | Array,
  include: string | RegExp | Array,
  exclude: string | RegExp | Array,
}
```
## CommonsChunkPlugin
CommonsChunkPlugin 插件，是一个可选的用于建立一个独立文件(又称作 chunk)的功能，这个文件包括多个入口 chunk 的公共模块。

通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。

## CopyWebpackPlugin
CopyWebpackPlugin 将单个文件或整个目录复制到构建目录。

## DefinePlugin
DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 DefinePlugin 的用处，设置它，就可以忘记开发和发布构建的规则。

## ExtractTextWebpackPlugin
更少 style 标签、CSS SourceMap、CSS 请求并行、CSS 单独缓存、更快的浏览器运行时(runtime) (更少代码和 DOM 操作)

## HashedModuleIdsPlugin
该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。

## HtmlWebpackPlugin
HtmlWebpackPlugin简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 你可以让插件为你生成一个HTML文件，使用lodash模板提供你自己的模板，或使用你自己的loader。

## NormalModuleReplacementPlugin
在构建开发环境时替换特定的模块。

## NpmInstallWebpackPlugin
通过使用Webpack自动安装和保存依赖项来加速开发。

## ProvidePlugin
自动加载模块，而不必到处 import 或 require 。

## UglifyjsWebpackPlugin
js 压缩工具。

## WatchIgnorePlugin
无视指定的文件。换句话说，当处于监视模式(watch mode)下，符合给定地址的文件或者满足给定正则表达式的文件的改动不会触发重编译。

## I18nWebpackPlugin
国际化组件