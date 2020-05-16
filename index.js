#! /usr/bin/env node

// 快速push 到git服务器脚本
const {execSync} = require('child_process');
const program = require('commander');
program
    .version(require('./package').version)
    .usage(`
        [message]
        空格 转换为换换
    `)
    .option('-m, --message <注释>  ', '提交注释')
    .parse(process.argv);

let message = program.message;

if (!message) {
    const [, , ...messages] = process.argv;
    message = messages.join(' ') || '整理代码';
}

execSync(`git add . && git commit -m '${message}' && git push origin master `, {stdio: [0, 1, 2]});
