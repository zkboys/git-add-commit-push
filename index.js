#! /usr/bin/env node

// 快速push 到git服务器脚本
const {execSync} = require('child_process');
const program = require('commander');
program
    .version(require('./package').version)
    .usage(`
        [message]
        
        说明：
        空格 转为换行
        
        提交类型：
        feat：新功能（feature）
        fix：修补bug
        docs：文档（documentation）
        style： 格式（不影响代码运行的变动）
        refactor：重构（即不是新增功能，也不是修改bug的代码变动）
        test：增加测试
        chore：构建过程或辅助工具的变动
    `)
    .option('-m, --message <注释>  ', '提交注释')
    .parse(process.argv);

let message = program.message;

if (!message) {
    const [, , ...messages] = process.argv;
    message = messages.join('\n') || ':bug:整理代码';
}

execSync(`git add . && git commit -m '${message}' && git push origin master `, {stdio: [0, 1, 2]});
