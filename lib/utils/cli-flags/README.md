# cli-flags.js

```es6
const HELP_GROUP = 'Help options:';
const CONFIG_GROUP = 'Config options:';
const BASIC_GROUP = 'Basic options:';
const OUTPUT_GROUP = 'Output options:';
const ADVANCED_GROUP = 'Advanced options:';
const DISPLAY_GROUP = 'Stats options:';

module.exports = {
    commands: [
        // 对一些核心命令进行了定义
        {
            name: 'create',
            alias: 'c',
            type: String,
            description: 'Initialize a new webpack configuration',
        },
        {
            name: 'migrate',
            alias: 'm',
            type: String,
            description: 'Migrate a configuration to a new version',
        },
        {
            name: 'loader',
            scope: 'external',
            alias: 'l',
            type: String,
            description: 'Scaffold a loader repository',
        },
        {
            name: 'plugin',
            alias: 'p',
            scope: 'external',
            type: String,
            description: 'Scaffold a plugin repository',
        },
        {
            name: 'info',
            scope: 'external',
            type: String,
            description: 'Outputs information about your system and dependencies',
        },
    ],
    core: [
        // 对一些核心参数进行了配置
        // 名称、类型、是否可重复、默认值、默认选项、所属分组、描述
        {
            name: 'entry',
            type: String,
            multiple: false,
            defaultValue: null,
            defaultOption: true,
            group: BASIC_GROUP,
            description: 'The entry point of your application',
        },
        {
            name: 'config',
            alias: 'c',
            type: String,
            defaultValue: null,
            group: CONFIG_GROUP,
            description: 'Provide path to a webpack configuration file',
        },
        {
            name: 'register',
            type: String,
            multiple: true,
            alias: 'r',
            group: CONFIG_GROUP,
            description: 'Preload one or more modules before loading the webpack configuration',
        },
        {
            name: 'merge',
            alias: 'm',
            type: String,
            group: CONFIG_GROUP,
            description: 'Merge a configuration file',
        },
        {
            name: 'progress',
            type: String,
            defaultValue: 'bar',
            group: BASIC_GROUP,
            description: 'Print compilation progress during build',
        },
        {
            name: 'color',
            type: Boolean,
            defaultValue: true,
            group: DISPLAY_GROUP,
            description: 'Enables/Disables colors on the console',
        },
        {
            name: 'help',
            type: Boolean,
            group: HELP_GROUP,
            description: 'Outputs list of supported flags',
        },
        {
            name: 'output',
            alias: 'o',
            group: OUTPUT_GROUP,
            type: String,
            description: 'Output location of the file generated by webpack',
        },
        {
            name: 'global',
            alias: 'g',
            type: String,
            multiple: true,
            group: ADVANCED_GROUP,
            description: 'Declares and exposes a global variable',
        },
        {
            name: 'target',
            alias: 't',
            defaultValue: 'web',
            type: String,
            group: ADVANCED_GROUP,
            description: 'Sets the build target',
        },
        {
            name: 'watch',
            type: Boolean,
            alias: 'w',
            group: BASIC_GROUP,
            description: 'Watch for files changes',
        },
        {
            name: 'hot',
            alias: 'h',
            type: Boolean,
            group: ADVANCED_GROUP,
            description: 'Enables Hot Module Replacement',
        },
        {
            name: 'debug',
            type: Boolean,
            group: ADVANCED_GROUP,
            description: 'Switch loaders to debug mode',
        },
        {
            name: 'sourcemap',
            type: String,
            alias: 's',
            defaultValue: 'eval',
            group: BASIC_GROUP,
            description: 'Determine source maps to use',
        },
        {
            name: 'prefetch',
            type: String,
            multiple: true,
            group: ADVANCED_GROUP,
            description: 'Prefetch this request',
        },
        {
            name: 'json',
            type: Boolean,
            alias: 'j',
            description: 'Prints result as JSON',
            group: DISPLAY_GROUP,
        },
        {
            name: 'dev',
            alias: 'd',
            type: Boolean,
            defaultValue: false,
            group: BASIC_GROUP,
            description: 'Run development build',
        },
        {
            name: 'prod',
            alias: 'p',
            type: Boolean,
            defaultValue: true,
            group: BASIC_GROUP,
            description: 'Run production build',
        },
        {
            name: 'version',
            type: Boolean,
            group: BASIC_GROUP,
            description: 'Get current version',
        },
        /* 		{
			name: "analyze",
			type: Boolean,
			group: BASIC_GROUP,
			description: "analyze build for performance improvements"
		}, */
        /* 		{
			name: "interactive",
			type: Boolean,
			alias: "i",
			description: "Use webpack interactively",
			group: BASIC_GROUP
		} */
    ],
};
```