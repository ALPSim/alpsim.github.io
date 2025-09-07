---
title: 路径设置
description: "如何使用 ALPS"
weight: 3
---

## 为二进制安装的可执行文件设置路径

通过二进制安装成功安装 `pyalps` 后，我们可通过将其导入 `python` 来使用。但系统可能无法识别 `python` 命令的路径。以下是在 Mac 系统的 `.bash_profile` 文件中设置正确路径的示例，Linux 系统则需配置对应的 `.bashrc` 文件。

### 在终端使用 `ls` 命令检查您的 `python` 安装目录

通常安装在以下目录中：

```
ls /Library/Frameworks/Python.framework/Versions/3.12
```


在 `bin` 目录中，您会找到 `python3`、`pip3` 及其他可执行文件。若要在终端中使用常规的 `python` 或 `pip` 命令运行这些二进制文件，需告知系统其路径并为命令设置别名。

### 查找或创建 `.bash_profile` 文件

- 在您的主目录执行 `ls -a`，或从任意目录执行 `ls -a ~`
- 使用 `vim` 编辑器编辑或创建文件：`vi ~/.bash_profile`
- 按 `i` 键进入编辑模式
- 添加二进制路径至文件：
```
export PATH="$PATH:/Library/Frameworks/Python.framework/Versions/3.12/bin"
```
- 添加命令别名：
```
alias python="python3"
alias pip="pip3"
```
- 保存更改：
按 `esc` 键后输入 `:x`，这将保存文件并退出 `vim`

### 应用二进制路径与别名设置
在终端输入：`source ~/.bash_profile`

现在您可运行任意 `Python` 文件。您的 `pyalps` 库通常安装在以下目录：

`/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/site-packages`

使用 `ls` 命令检查该目录（或类似路径）以确认包是否正确安装。

## 为源码安装的可执行文件设置路径
若您已完成 ALPS 源码安装，程序可执行文件位于安装目录的 /bin 文件夹中。需在 Mac 的 .bash_profile 或 Linux 的 .bashrc 文件中设置以下路径：

`export PATH="$PATH:<your installed ALPS directory>/bin"`

