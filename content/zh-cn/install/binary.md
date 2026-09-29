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

如果 `pip install` 因 `externally-managed-environment` 被拒绝（较新的 Debian/Ubuntu），请安装到虚拟环境中：`python3 -m venv ~/alps-venv && source ~/alps-venv/bin/activate && pip install pyalps`。如果连 `venv` 都没有，请安装 `python3-venv` 或使用 [`uv`](https://docs.astral.sh/uv/)。

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
