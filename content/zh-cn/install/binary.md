---
title: 在 Mac/Linux 上通过二进制安装 ALPS
description: "ALPS 二进制安装指南"
weight: 1
toc: true
cascade:
    type: docs
---

预编译的二进制文件 [`pyALPS`](https://pypi.org/project/pyalps/) 支持大多数 Linux 和 macOS 系统。可通过 pip 包管理器安装：

    pip install pyalps

请确保您的 Python 版本 ≥ 3.9。

建议安装到虚拟环境中，这不需要系统权限：

    python3 -m venv ~/alps-venv
    source ~/alps-venv/bin/activate
    pip install pyalps

在较新的 Debian/Ubuntu 系统上，系统 Python 被标记为 `EXTERNALLY-MANAGED`（PEP 668），因此在虚拟环境之外直接 `pip install` 会被拒绝。如果 `python3 -m venv` 又报错 `ensurepip is not available`，可以安装 `python3-venv` 软件包（需要 `sudo`），或者使用用户级工具创建环境，例如 [`uv`](https://docs.astral.sh/uv/)（先 `uv venv ~/alps-venv`，按上面的方式激活后再 `uv pip install pyalps`）或 conda。

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
