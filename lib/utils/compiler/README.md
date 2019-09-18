# compiler.js

```js
const webpack = require('webpack');
const fs = require('fs');
const chalk = require('chalk');
const Table = require('cli-table3');

function showEmojiConditionally() {
    return (process.stdout.isTTY && process.platform === 'darwin')
}

function generateOutput(outputOptions, stats, statsErrors) {
    const statsObj = stats.toJson(outputOptions);
    const { assets, entrypoints, time, builtAt, warnings, outputPath } = statsObj;

    const visibleEmojies = showEmojiConditionally() ? ['✅', '🌏', '⚒️ ', '⏱ ', '📂']: new Array(5).fill('');

    process.stdout.write('\n');
    process.stdout.write(`${visibleEmojies[0]} ${chalk.underline.bold('Compilation Results')}\n`);
    process.stdout.write('\n');
    process.stdout.write(`${visibleEmojies[1]} Version: ${webpack.version}\n`);
    process.stdout.write(`${visibleEmojies[2]} Built: ${new Date(builtAt).toString()}\n`);
    process.stdout.write(`${visibleEmojies[3]} Compile Time: ${time}ms\n`);
    process.stdout.write(`${visibleEmojies[4]} Output Directory: ${outputPath}\n`);
    process.stdout.write('\n');

    let entries = [];
    Object.keys(entrypoints).forEach(entry => {
        entries = entries.concat(entrypoints[entry].assets);
    });

    const table = new Table({
        head: ['Build Status', 'Bundle Name', 'Bundle Size'],
        colWidths: [15, 45, 15],
        style: { compact: true, 'padding-left': 1 },
    });

    let compilationTableEmpty = true;
    assets.forEach(asset => {
        if (entries.includes(asset.name)) {
            const kbSize = `${Math.round(asset.size / 1000)} kb`;
            const hasBeenCompiled = asset.emitted === true ? 'compiled' : 'failed';
            table.push([hasBeenCompiled, asset.name, kbSize]);
            compilationTableEmpty = false;
        }
    });

    if (!compilationTableEmpty) {
        process.stdout.write(table.toString());
    }

    warnings.forEach(warning => {
        process.cliLogger.warn(warning);
        process.stdout.write('\n');
    });

    if (statsErrors) {
        statsErrors.forEach(err => {
            if (err.loc) process.cliLogger.warn(err.loc);
            if (err.name) {
                process.cliLogger.error(err.name);
                process.stdout.write('\n');
            }
        });
    }
    return statsObj;
}
async function invokeCompilerInstance(compiler, lastHash, options, outputOptions) {
    return new Promise(async(resolve, reject) => {
        await compiler.run(async function(err, stats) {
            const content = await compilerCallback(compiler, err, stats, lastHash, options, outputOptions);
            resolve(content);
        });
    });
}

async function invokeWatchInstance(compiler, lastHash, options, outputOptions, watchOptions) {
    return compiler.watch(watchOptions, function(err, stats) {
        return compilerCallback(compiler, err, stats, lastHash, options, outputOptions);
    });
}
function compilerCallback(compiler, err, stats, lastHash, options, outputOptions) {
    let statsErrors = [];
    const stdout = options.silent
        ? {
              write: () => {},
		  } // eslint-disable-line
        : process.stdout;
    if (!outputOptions.watch || err) {
        // Do not keep cache anymore
        compiler.purgeInputFileSystem();
    }
    if (err) {
        lastHash = null;
        process.cliLogger.error(err.stack || err);
		process.exit(1); // eslint-disable-line
    }
    if (outputOptions.json) {
        stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + '\n');
    } else if (stats.hash !== lastHash) {
        lastHash = stats.hash;
        if (stats.compilation && stats.compilation.errors.length !== 0) {
            const errors = stats.compilation.errors;
            errors.forEach(statErr => {
                const errLoc = statErr.module ? statErr.module.resource : null;
                statsErrors.push({ name: statErr.message, loc: errLoc });
            });
        }

        return generateOutput(outputOptions, stats, statsErrors);
    }
    if (!outputOptions.watch && stats.hasErrors()) {
        process.exitCode = 2;
    }
}

module.exports = async function webpackInstance(opts, shouldUseMem) {
    // 获取配置项
    const { outputOptions, processingErrors, options } = opts;
    if (outputOptions.color) {
        require('supports-color').stdout;
        outputOptions.color = true;
    }

    // 有错误直接抛错
    if (processingErrors.length > 0) {
        throw new Error(processingErrors);
    }
    // compiler 是 webpack 实现的，而 webpack-cli 只是负责处理用户输入和生成配置项
    // webpack 只负责处理 options 
    const compiler = await webpack(options);
    let lastHash = null;

    // webpack 内置了进度条组件
    const ProgressPlugin = webpack.ProgressPlugin;
    const progressPluginExists = options.plugins ? options.plugins.find(p => p instanceof ProgressPlugin) : false;
    if (progressPluginExists) {
        options.plugins = options.plugins.filter(e => e !== progressPluginExists);
    }

    // 互动选项
    if (outputOptions.interactive) {
        const interactive = require('./interactive');
        return interactive(options, outputOptions, processingErrors, shouldUseMem);
    }

    compiler.hooks.beforeRun.tap('webpackProgress', compilation => {
        // 显示进度条
        if (outputOptions.progress) {
            let tmp_msg;
            const defaultProgressPluginHandler = (percent, msg, addInfo) => {
                percent = Math.floor(percent * 100);
                if (percent === 100) {
                    msg = 'Compilation completed';
                }

                if (msg && tmp_msg != msg) {
                    process.cliLogger.info(percent + '% ' + msg);
                }
                tmp_msg = msg;
            };
            if (!progressPluginExists) {
                new ProgressPlugin(defaultProgressPluginHandler).apply(compiler);
            } else {
                if (!progressPluginExists.handler) {
                    options.plugins = options.plugins.filter(e => e !== progressPluginExists);
                    Object.keys(progressPluginExists).map(opt => {
                        ProgressPlugin.defaultOptions[opt] = progressPluginExists[opt];
                    });
                    new ProgressPlugin(defaultProgressPluginHandler).apply(compiler);
                } else {
                    progressPluginExists.apply(compiler);
                }
            }
        }
    });

    // 一些信息输出日志
    if (outputOptions.infoVerbosity === 'verbose') {
        if (outputOptions.watch) {
            compiler.hooks.watchRun.tap('WebpackInfo', compilation => {
                const compilationName = compilation.name ? compilation.name : '';
                process.cliLogger.info('Compilation ' + compilationName + ' starting…');
            });
        } else {
            compiler.hooks.beforeRun.tap('WebpackInfo', compilation => {
                const compilationName = compilation.name ? compilation.name : '';
                process.cliLogger.info('Compilation ' + compilationName + ' starting…');
            });
        }
        compiler.hooks.done.tap('WebpackInfo', compilation => {
            const compilationName = compilation.name ? compilation.name : '';
            process.cliLogger.info('Compilation ' + compilationName + ' finished');
        });
    }
    if (outputOptions.watch) {
        const watchOptions = outputOptions.watchOptions || {};
        if (watchOptions.stdin) {
            process.stdin.on('end', function(_) {
				process.exit(); // eslint-disable-line
            });
            process.stdin.resume();
        }
        // 如果是 watch 的话，则进程不退出，持续进行编译
        await invokeWatchInstance(compiler, lastHash, options, outputOptions, watchOptions);
        if (outputOptions.infoVerbosity !== 'none') process.cliLogger.info('watching the files...');
    } else {
        // 打包，调用的还是熟悉的 compiler.run 方法
        // webpack-cli 在用户输入处理完后，完成了配置项的配置以后，将编译的工作交换给了 webpack
        return await invokeCompilerInstance(compiler, lastHash, options, outputOptions);
    }
};
```