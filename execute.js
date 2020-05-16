#! /usr/bin/env node

// 快速push 到git服务器脚本
const childProcess = require('child_process');
const program = require('commander');
const ora = require('ora');
const {promisify} = require('util');
const {execSync} = childProcess;
// const exec = promisify(childProcess.exec);
const exec = async function (...args){
    return new Promise((resolve, reject) => {
        childProcess.exec(...args, (err, stdout, stderr) => {
            if(err) return reject(err);
            resolve(stdout);
            console.log(stdout);
            console.log(stderr);
        });
    })
};

module.exports = async function (pull) {
    const types = [
        {name: 'first', emoji: '🎉', emojiCode: 'tada', description: 'Initial commit'},
        {name: 'feat', emoji: '✨', emojiCode: 'sparkles', description: '添加新功能'},
        {name: 'feature', emoji: '✨', emojiCode: 'sparkles', description: '添加新功能'},
        {name: 'fix', emoji: '🚑', emojiCode: 'ambulance', description: 'Bug修复'},
        {name: 'docs', emoji: '📝', emojiCode: 'pencil', description: '整理文档'},
        {name: 'style', emoji: '🎨', emojiCode: 'art', description: '代码格式化'},
        {name: 'refa', emoji: '🔨', emojiCode: 'hammer', description: '代码重构'},
        {name: 'refactor', emoji: '🔨', emojiCode: 'hammer', description: '代码重构'},
        {name: 'test', emoji: '✅', emojiCode: 'white_check_mark', description: '增加测试'},
        {name: 'chore', emoji: '🐳', emojiCode: 'whale', description: '修改构建过程或辅助工具'},
        {name: 'deploy', emoji: '🔖', emojiCode: 'bookmark', description: '部署'},
        {name: 'build', emoji: '🚀', emojiCode: 'rocket', description: '构建'},
    ];

    const maxNameLength = Math.max(...types.map(item => item.name.length));

    program
        .version(require('./package').version)
        .usage(`
    [message]
    
    说明：
      空格 转为换行
    
    提交类型：
      ${types.map(item => `${item.name.padEnd(maxNameLength)}: ${item.emoji} ${item.description}`).join('\n      ')}
    `)
        .option('-m, --message <注释>  ', '提交注释')
        .parse(process.argv);

    let message = program.message;

    if (!message) {
        const [, , ...messages] = process.argv;
        message = messages.filter(item => item !== '-p' && item !== '--p').join(' ');
    }

    // message 默认代码重构
    let msg;
    if (!message) message = 'refa';

    const messages = message.split(' ');

    // 只有一行 fix:Bug修复 fix：Bug修复 fixBug修复
    if (messages.length === 1) {
        const m = messages[0];
        types.forEach(item => {
            const {name, emojiCode, description} = item;
            if (m.indexOf(`${name}:`) !== -1) return msg = `:${emojiCode}: ${m.replace(name + ':', '') || description}`;
            if (m.indexOf(`${name}：`) !== -1) return msg = `:${emojiCode}: ${m.replace(name + '：', '') || description}`;
            if (m.indexOf(`${name}`) !== -1) return msg = `:${emojiCode}: ${m.replace(name + '', '') || description}`;
        });
    }
    // type之后有空格 fix Bug修复
    if (messages.length > 1) {
        const [m, m2, ...others] = messages;

        types.forEach(item => {
            const {name, emojiCode} = item;
            if (m.indexOf(`${name}:`) !== -1) return msg = `:${emojiCode}: ${m2}\n${others.join('\n')}`;
            if (m.indexOf(`${name}：`) !== -1) return msg = `:${emojiCode}: ${m2}\n${others.join('\n')}`;
            if (m.indexOf(`${name}`) !== -1) return msg = `:${emojiCode}: ${m2}\n${others.join('\n')}`;
        });
    }

    // 没有type
    if (!msg) msg = messages.join('\n');

    const spinner = ora('Loading...');
    spinner.color = 'yellow';

    try {
        const branch = execSync('git branch');
        const currentBranch = branch.toString().replace('*', '').trim();

        if (pull) {
            spinner.text = '🚚 git pull';
            spinner.start();
            await exec(`git pull`, {stdio: [0, 1, 2]});
            console.log(); // 换行
            spinner.stop();
        }

        spinner.text = '✨  git add .';
        spinner.start();
        await exec(`git add .`, {stdio: [0, 1, 2]});
        console.log(); // 换行
        spinner.stop();

        spinner.text = '🔥 git commit';
        spinner.start();
        await exec(`git commit -m '${msg}'`, {stdio: [0, 1, 2]});
        console.log();
        spinner.stop();

        spinner.text = `🚀 git push origin ${currentBranch} `;
        spinner.start();
        await exec(`git push origin ${currentBranch} `, {stdio: [0, 1, 2]});
        console.log();
        spinner.stop();

        console.log('🎉 Successfully!');
    } catch (e) {
        // console.error(e);
        spinner.stop();
        console.log();
        console.log('🚨 Something Wrong!');
    }

};
