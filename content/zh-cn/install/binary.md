---
title: 在 Mac/Linux 上通过二进制安装 ALPS
description: "ALPS 二进制安装指南"
weight: 1
toc: true
cascade:
    type: docs
---

预编译的二进制文件 [`pyALPS`](https://pypi.org/project/pyalps/) 支持装有 Python 3.10 或更高版本的大多数 Linux 和 macOS 系统。我们建议安装在虚拟环境中；在某些系统上（例如较新的 Ubuntu），不允许用 `pip install` 安装到系统 Python 中：

    python3 -m venv alps-env
    . alps-env/bin/activate
    python -m pip install pyalps

每次打开新的终端后，请先激活该环境（`. alps-env/bin/activate`）再使用 ALPS。

请注意，二进制版本的 ALPS 不支持并行运行。如需并行版本，请使用[源码](../source)或 [spack](../spack) 安装。

### 命令行程序

除 Python 包之外，`pip install pyalps` 还会为 ALPS 应用程序（`spinmc`、`loop`、`worm`、`dirloop_sse`、`qwl`、`sparsediag`、`fulldiag`、`dmrg`、`dmft` 等）、`spinmc_evaluate`、`worm_evaluate`、`fulldiag_evaluate`、`qwl_evaluate` 以及工具 `parameter2xml` 和 `printgraph` 安装命令行命令。因此，在激活的环境中可以直接运行命令行教程，例如：

    parameter2xml parm1a
    spinmc --Tmin 10 --write-xml parm1a.in.xml

这些命令由 3.0.0 之后的 pyalps 版本安装。使用 pyalps 3.0.0 时，请使用教程的 Python 版本，或通过 `python -m pip install --upgrade pyalps` 升级。

二进制包**不包含**：

- 转换和绘图工具 `convert2text`、`convert2xml`、`plot2text`、`plot2xmgr`、`plot2gp`，以及 `dirloop_sse_evaluate`。请改用教程的 Python 版本，或使用[源码](../source)或 [spack](../spack) 安装；
- 教程目录。请从各教程页面下载参数文件，或从 ALPS 仓库的 [`tutorials`](https://github.com/ALPSim/ALPS/tree/master/tutorials) 文件夹获取。

## 安装视频指南

Windows 用户可选择以下任一方式：
1. 先安装 Linux 子系统再安装 ALPS
2. 在虚拟箱环境中安装 ALPS

### 安装 Windows Linux 子系统 (WSL)
<br>

{{< youtube id="hEYWDLJmNpc" >}}

### 在 WSL 中安装 ALPS
<br>

{{< youtube id="FevhLNcQCHY" >}}

### 在 Windows 虚拟箱环境中安装 ALPS
<br>

{{< youtube id="Te6IApFjHJs" >}}
