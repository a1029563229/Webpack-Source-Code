# cli.js

```es6
#!/usr/bin/env node

'use strict';

// 工具类应用使用此包会加速构建速度。
require('v8-compile-cache');

const importLocal = require('import-local');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = 'webpack';
process.cliLogger = require('webpack-log')({
    name: 'webpack',
});

// 查询更新
const updateNotifier = require('update-notifier');
const packageJson = require('./package.json');

const notifier = updateNotifier({
    pkg: packageJson,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 30, // 1 month
});

if (notifier.update) {
    process.cliLogger.info(`Update available: ${notifier.update.latest}`);
}

// 版本管理工具
const semver = require('semver');

const version = packageJson.engines.node;

// 检测 Node 版本是否满足要求
if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, '');
    process.cliLogger.error('webpack CLI requires at least Node v' + rawVersion + '. ' + 'You have ' + process.version + '.\n' + 'See https://webpack.js.org/ ' + 'for migration help and similar.');
    process.exit(1);
}

// 进入下一步
require('./lib/bootstrap');
```