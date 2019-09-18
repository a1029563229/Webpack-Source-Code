# bootstrap.js

```es6
const webpackCli = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
// 读取命令行的参数
const cmdArgs = require('command-line-args');

require('./utils/process-log');

const isFlagPresent = (args, flag) => args.find(arg => [flag, `--${flag}`].includes(arg));
const normalizeFlags = (args, cmd) => args.slice(2).filter(arg => arg.indexOf('--') < 0 && arg !== cmd.name && arg !== cmd.alias);

const isCommandUsed = commands =>
    commands.find(cmd => {
        return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias);
    });

async function runCLI(cli, commandIsUsed) {
    let args;
    const helpFlagExists = isFlagPresent(process.argv, 'help');
    const versionFlagExists = isFlagPresent(process.argv, 'version');

    // 展示帮助或版本信息
    if (helpFlagExists) {
        cli.runHelp();
        return;
    } else if (versionFlagExists) {
      cli.runVersion();
      return;
    }

    // 普通编译的话 commandIsUsed 一般为 false
    if (commandIsUsed) {
        commandIsUsed.defaultOption = true;
        args = normalizeFlags(process.argv, commandIsUsed);
        return await cli.runCommand(commandIsUsed, ...args);
    } else {
        args = cmdArgs(core, { stopAtFirstUnknown: false });
        try {
            // cli 的 run 是主程序，开跑
            const result = await cli.run(args, core);
            if (!result) {
                return;
            }
        } catch (err) {
            process.cliLogger.error(err);
            process.exit(1);
        }
    }
}

// eslint-disable-next-line space-before-function-paren
(async () => {
    const commandIsUsed = isCommandUsed(commands);
    // 构建了一个 webpackCli 然后开跑
    const cli = new webpackCli();
    runCLI(cli, commandIsUsed);
})();

```