#! /usr/bin/env node

// 快速push 到git服务器脚本
const {execSync} = require('child_process');
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');

module.exports = async function(pull) {
    const types = [
        {name: 'init', emoji: '🎉', emojiCode: 'tada', description: 'Initial commit'},
        {name: 'first', emoji: '🎉', emojiCode: 'tada', description: 'Initial commit'},
        {name: 'feat', emoji: '✨', emojiCode: 'sparkles', description: ' 添加新功能'},
        {name: 'feature', emoji: '✨', emojiCode: 'sparkles', description: ' 添加新功能'},
        {name: 'fix', emoji: '🚑', emojiCode: 'ambulance', description: 'Bug修复'},
        {name: 'docs', emoji: '📝', emojiCode: 'pencil', description: '整理文档'},
        {name: 'style', emoji: '🎨', emojiCode: 'art', description: '整理代码'},
        {name: 'refa', emoji: '🔨', emojiCode: 'hammer', description: '代码重构'},
        {name: 'refactor', emoji: '🔨', emojiCode: 'hammer', description: '代码重构'},
        {name: 'test', emoji: '✅', emojiCode: 'white_check_mark', description: ' 增加测试'},
        {name: 'chore', emoji: '🐳', emojiCode: 'whale', description: '修改构建过程或辅助工具'},
        {name: 'deploy', emoji: '🔖', emojiCode: 'bookmark', description: '部署'},
        {name: 'build', emoji: '🚀', emojiCode: 'rocket', description: '构建'},
    ];

    const maxNameLength = Math.max(...types.map(item => item.name.length));

    program
        .version(require('./package').version)
        .usage(`[提交信息]
        
  ${chalk.green(`说明：
    提交信息中的「空格」转为「\\n」`)}
    
  ${chalk.green(`提交类型：
    ${types.map(item => `${item.name.padEnd(maxNameLength)}: ${item.emoji} ${item.description}`).join('\n    ')}`)}`)
        .option('-m, --message <message>  ', 'Commit Message')
        .parse(process.argv);

    // 提交注释 -m
    let message = program.message;

    // 如果 -m 参数不存在，将命令行中所有的内容，作为message
    if (!message) {
        const [, , ...messages] = process.argv;
        message = messages.filter(item => item !== '-p' && item !== '--p').join(' ');
    }

    // message 不允许为空，提示用户输入
    if (!message) {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                message: '请输入注释:',
                name: 'message',
            },
        ]);

        message = 'feat ' + answers.message;
    }

    let commitMessage = message;

    // 转换emoji表情
    types.forEach(item => {
        const {name, emojiCode, description} = item;
        for (const em of [
            `${name}:`,
            `${name}：`,
            `${name} `,
            `${name}`,
        ]) {
            if (message.indexOf(em) !== -1) {
                commitMessage = `:${emojiCode}: ${message.replace(em, '') || description}`;
                return;
            }
        }
    });

    // 空格转换为换行 好像获取不到双空格
    const [m1, m2, ...others] = commitMessage.split(' ');
    commitMessage = `${m1} ${m2}\n${others.join('\n')}`;

    try {
        const branch = execSync('git branch');
        const branches = branch.toString().split('\n');
        const currentBranch = branches.find(item => item.startsWith('*')).replace('*', '').trim();

        console.log('🌴 current branch:', currentBranch);
        console.log();

        if (pull) {
            console.log('🚚 git pull');
            execSync(`git pull`, {stdio: [0, 1, 2]});
            console.log(); // 换行
        }

        // 添加所有
        console.log('✨  git add .');
        execSync(`git add .`, {stdio: [0, 1, 2]});
        console.log(); // 换行

        console.log('🔥 git commit');
        execSync(`git commit -m '${commitMessage}'`, {stdio: [0, 1, 2]});
        console.log();

        console.log(`🚀 git push origin ${currentBranch} `);
        execSync(`git push origin ${currentBranch} `, {stdio: [0, 1, 2]});
        console.log();

        console.log('🎉 Successfully!');
    } catch (e) {
        // console.error(e);
        console.log();
        console.log('🚨 Something Wrong!');
    }

};
