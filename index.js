#! /usr/bin/env node

// 快速push 到git服务器脚本
const {execSync} = require('child_process');
const program = require('commander');
const types = [
    {name: 'feat', emoji: '✨', emojiCode: 'sparkles', description: '添加新功能'},
    {name: 'feature', emoji: '✨', emojiCode: 'sparkles', description: '添加新功能'},
    {name: 'fix', emoji: '🚑', emojiCode: 'ambulance', description: 'Bug修复'},
    {name: 'docs', emoji: '📝', emojiCode: 'pencil', description: '编写文档'},
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
    message = messages.join(' ');
}

// message 默认代码重构
let msg;
if (!message) message = 'refa';

const messages = message.split(' ');

// 只有一行 fix:Bug修复 fix：Bug修复 fixBug修复
if (messages.length === 1) {
    const m = messages[0];
    console.log(11, m);
    types.forEach(item => {
        const {name, emojiCode} = item;
        if (m.indexOf(`${name}:`) !== -1) return msg = `:${emojiCode}: ${m.replace(name + ':')}`;
        if (m.indexOf(`${name}：`) !== -1) return msg = `:${emojiCode}: ${m.replace(name + '：')}`;
        if (m.indexOf(`${name}`) !== -1) return msg = `:${emojiCode}: ${m.replace(name + '')}`;
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
msg = messages.join('\n');

execSync(`git add . && git commit -m '${msg}' && git push origin master `, {stdio: [0, 1, 2]});
