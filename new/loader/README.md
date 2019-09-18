# Loader 合集

## yaml-frontmatter-loader

读取 md 文件为 Javascript 对象的 Loader
```js
var json = require("json-loader!yaml-frontmatter-loader!./file.md");
```

## css-loader
css-loader 解释(interpret) @import 和 url() ，会 import/require() 后再解析(resolve)它们。

css-loader 自身就支持 alias 属性
```js
{
  test: /\.scss$/,
  use: [
    {
      loader: "style-loader"
    },
    {
      loader: "css-loader",
      options: {
        alias: {
          "../fonts/bootstrap": "bootstrap-sass/assets/fonts/bootstrap"
        }
      }
    },
    {
      loader: "sass-loader",
      options: {
        includePaths: [
          path.resolve("./node_modules/bootstrap-sass/assets/stylesheets")
        ]
      }
    }
  ]
}
```

### Scope
默认情况下，CSS 将所有的类名暴露到全局的选择器作用域中。样式可以在局部作用域中，避免全局作用域的样式。

语法 :local(.className) 可以被用来在局部作用域中声明 className。局部的作用域标识符会以模块形式暴露出去。

## expose-loader
将一个模块暴露为全局模块，挂载在 window 对象上。
```js
module: {
  rules: [{
    test: require.resolve('jquery'),
    use: [{
      loader: 'expose-loader',
      options: '$'
    }]
  }]
}
```

## file-loader
file-loader 根据引用的路径生成一个文件，并返回一个链接。
```js
import img from './file.png'
```

## less-loader
将 css-loader、style-loader 和 less-loader 链式调用，可以把所有样式立即应用于 DOM。
```js
// webpack.config.js
module.exports = {
    ...
    module: {
        rules: [{
            test: /\.less$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "less-loader" // compiles Less to CSS
            }]
        }]
    }
};
```

webpack 提供了一种解析文件的高级机制。less-loader 应用一个 Less 插件，并且将所有查询参数传递给 webpack resolver。所以，你可以从 node_modules 导入你的 less 模块。只要加一个 ~ 前缀，告诉 webpack 去查询模块。
```less
@import "~bootstrap/less/bootstrap";
```

