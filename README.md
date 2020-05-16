# zk-acp
封装git提交当前分支命令，根据Commit Message 规范，添加emoji表情。 

## 安装

```bash
$ npm install zk-acp -g
```
将会安装两个命令： `acp` 和 `pacp` 

## 用法
`acp` 和 `pacp` 用法相同，`pacp`会执行`git pull`

```bash
# git add && git commit -m 'fix: some bug' && git push origin master
$ acp fix: some bug

# git pull &&  git add && git commit -m 'fix: some bug' && git push origin master
$ pacp fix: some bug
```

显示帮助
```bash
$ acp -h
```
