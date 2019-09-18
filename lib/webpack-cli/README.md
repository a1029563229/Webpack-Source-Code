# webpack-cli.md

```js
const { join } = require('path');
const GroupHelper = require('./utils/group-helper');
const Compiler = require('./utils/compiler');

const webpackMerge = require('webpack-merge');

class webpackCLI extends GroupHelper {
    constructor() {
        super();
        // 创建个 Map 承接分组
        this.groupMap = new Map();
        this.groups = [];
        this.processingErrors = [];
        this.shouldUseMem = false;
    }
    setMappedGroups(args, yargsOptions) {
        const { _all } = args;
        Object.keys(_all).forEach(key => {
            this.setGroupMap(key, _all[key], yargsOptions);
        });
    }
    setGroupMap(key, val, yargsOptions) {
        const opt = yargsOptions.find(opt => opt.name === key);
        const groupName = opt.group;
        // groupName.slice(0, groupName.length - 9) 是为了去除后缀
        const namePrefix = groupName.slice(0, groupName.length - 9).toLowerCase();
        // 用 groupMap 收集分组内的值
        if (this.groupMap.has(namePrefix)) {
            const pushToMap = this.groupMap.get(namePrefix);
            pushToMap.push({ [opt.name]: val });
        } else {
            this.groupMap.set(namePrefix, [{ [opt.name]: val }]);
        }
    }

    checkDefaults(groupResult) {
        const { options } = groupResult;
        if (!options.entry) {
            this.shouldUseMem = true;
        }
    }

    resolveGroups() {
        let mode;
        // The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
        for (const [key, value] of this.groupMap.entries()) {
            const fileName = join(__dirname, 'groups', key);
            // 拉取每一项分组的构造函数
            const GroupClass = require(fileName);
            if (key === 'config') {
                // 这里的 mode 多半是有值的
                value.push({ mode: mode });
            }
            // 创建实例，创建对应的 GroupInstance，并存入 groups 数组中
            // 这段函数比较关键，相当于在这里给所有配置参数添加了处理方法
            // 通过默认分组及不同的分组构造函数进行管理配置参数
            const GroupInstance = new GroupClass(value);
            if (key === 'basic') {
                if (GroupInstance.opts.outputOptions.dev) {
                    mode = 'dev';
                } else {
                    mode = 'prod';
                }
                this.groups.push(GroupInstance);
            } else {
                this.groups.push(GroupInstance);
            }
        }
    }

    runOptionGroups() {
        let groupResult = {
            options: {},
            outputOptions: {},
            processingErrors: [],
        };

        // 调用各自实例的 run 函数，并收集返回值
        // 例如 configGroup 的 run 函数返回的就是配置信息
        const tmpGroupResult = this.groups.map(Group => Group.run()).filter(e => e);
        tmpGroupResult.forEach((e, idx) => {
            let groupObject = tmpGroupResult[idx + 1];
            if (e.processingErrors) {
                // 收集执行时错误
                groupResult.processingErrors = groupResult.processingErrors.concat(...e.processingErrors);
            }
            if (!groupObject) {
                groupObject = {
                    outputOptions: {},
                    options: {}
                }
            }
            if (!groupObject.outputOptions) {
                groupObject.outputOptions = {};
            }

            groupResult.outputOptions = Object.assign(groupObject.outputOptions, e.outputOptions);

            groupResult.options = webpackMerge(groupResult.options, e.options);
        });
        const isDevMode = groupResult.outputOptions['dev'];
        return require('./utils/zero-config')(groupResult, isDevMode);
    }

    // args 是用户输入的参数
    // yargsOptions 是 webpack 预制的参数，比如 --config
    async run(args, yargsOptions) {
        // 收集参数并分组存放在 groupMap
        await this.setMappedGroups(args, yargsOptions);
        // 将分组好的参数，创建对应的分组实例，并存放在 groups 数组中
        await this.resolveGroups();
        // 主程序，几个分组实例调用 run，并收集运行所返回的参数和字段
        // 这一步应该是将用户配置参数序列化，转化为内部编译程序可识别的配置选项
        const groupResult = await this.runOptionGroups();
        // 找出 entry 属性，修改某个属性值
        this.checkDefaults(groupResult);
        // 调用 Compiler 函数，进行编译
        const webpack = await Compiler(groupResult, this.shouldUseMem);
        return webpack;
    }

    async runCommand(command, ...args) {
        // TODO: rename and depreciate init
        if (command.name === 'create') {
            command.name = 'init';
        } else if (command.name === 'loader') {
            command.name = 'generate-loader';
        } else if (command.name === 'plugin') {
            command.name = 'generate-plugin';
        }
        return require('./commands/external').run(command.name, ...args);
    }

    runHelp() {
        const HelpGroup = require('./groups/help');
        return new HelpGroup().outputHelp();
    }

    runVersion() {
        const HelpGroup = require('./groups/help');
        return new HelpGroup().outputVersion();
    }

}

module.exports = webpackCLI;
```