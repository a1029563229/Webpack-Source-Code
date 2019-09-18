# config.js

```js
const { existsSync } = require('fs');
const { resolve, extname } = require('path');

const GroupHelper = require('../utils/group-helper');

class ConfigGroup extends GroupHelper {
    // options 为配置
    constructor(options) {
        super(options);
        this.extensions = ['.mjs', '.js', '.json', '.babel.js', '.ts'];
        // 读取默认配置文件
        this.defaultConfigFiles = this.getDefaultConfigFiles();
        this.configFiles = null;
        this.configOptions = [];
    }
    getDefaultConfigFiles() {
        const { mode } = this.args;
        // 默认配置文件为这几个
        let DEFAULT_FILES = ['.webpack/webpack.config', '.webpack/webpack.config.dev', '.webpack/webpack.config.prod', '.webpack/webpackfile', 'webpack.config'];

        return DEFAULT_FILES.map(filename =>
            this.extensions.map(ext => ({
                path: resolve(filename + ext),
                ext: ext,
            })),
        ).reduce((a, i) => a.concat(i), []);
    }

    getConfigExtension(configPath) {
        for (let i = this.extensions.length - 1; i >= 0; i--) {
            const tmpExt = this.extensions[i];
            if (configPath.includes(tmpExt, configPath.length - tmpExt.length)) {
                return tmpExt;
            }
        }
        return extname(configPath);
    }
    mapConfigArg(config) {
        const { path } = config;
        const ext = this.getConfigExtension(path);
        return {
            path,
            ext,
        };
    }

    require(path) {
        const result = require(path);
        if (result && result.__esModule && result.default) {
            return result.default;
        }
        return result;
    }

    requireConfig(configPath) {
        const { register } = this.args;

        this.configOptions = (() => {
            if (register && register.length) {
                module.paths.unshift(resolve(process.cwd(), 'node_modules'));
                register.forEach(dep => {
                    const isRelative = ['./', '../', '.\\', '..\\'].some(start => dep.startsWith(start));
                    if (isRelative) {
                        require(resolve(process.cwd(), dep));
                    } else {
                        require(dep);
                    }
                });
            }
            return this.require(configPath);
        })();
    }

    resolveConfigFiles(envMode) {
        const { config, mode } = this.args;
        const path = require('path');

        // 读取配置文件
        if (config) {
            //TODO: check for existence, give user feedback otherwise
            const configPath = path.resolve(process.cwd(), config);
            // 获取配置文件的后缀名
            const ext = this.getConfigExtension(configPath);
            this.configFiles = {
                path: configPath,
                ext,
            };
        }
        if (!this.configFiles) {
            const tmpConfigFiles = this.defaultConfigFiles
                .filter(defaultFile => {
                    return existsSync(defaultFile.path);
                })
                .map(this.mapConfigArg.bind(this));
            if (tmpConfigFiles.length) {
                if (!config) {
                    // 读取所配置环境的配置文件，如果没有的话则读取默认配置
                    const defaultConfig = tmpConfigFiles.find(p => p.path.includes(mode));
                    this.configFiles = defaultConfig || tmpConfigFiles[0];
                }
            }
        }
        if (this.configFiles) {
            // TODO: support mjs etc..
            this.configOptions.push(this.requireConfig(this.configFiles.path));
        } else {
            // TODO: Array config or no config
        }

        if (this.configOptions.length >= 1) {
            // merge configs together
        } else if (this.configOptions.length == 0) {
            // NO found
        } else {
            // set defaults based on nothing
            this.opts['options'] = this.configOptions;
            //return processConfiguredOptions(this.configOptions);
        }

        // TODO: fill in defaults here
    }

    resolveConfigMerging() {
        const { merge } = this.args;
        if (merge) {
            const newConfigPath = this.resolveFilePath(merge, 'webpack.base');
            const newConfig = newConfigPath ? this.require(newConfigPath) : null;
            this.opts['options'] = require('webpack-merge')(this.opts['options'], newConfig);
        }
    }

    run(envMode) {
        // 给 this.configOptions 注入配置信息（比如 webpack.config.js 中的内容）
        this.resolveConfigFiles(envMode);
        // 检测 merge 属性，如果有的话，则 merge `webpack.base.js` 文件同步到 options
        this.resolveConfigMerging();
        // 返回配置信息
        return this.opts;
    }
}

module.exports = ConfigGroup;
```