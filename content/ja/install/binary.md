---
title: バイナリからのMac/LinuxへのALPSインストール
description: "ALPSバイナリインストール"
weight: 1
toc: true
cascade:
    type: docs
---

プリビルド済みバイナリ[`pyALPS`](https://pypi.org/project/pyalps/)は、ほとんどのLinuxおよびMacOSマシンにインストールできます。`pyALPS`はpipパッケージマネージャを使用してインストールできます：

    pip install pyalps

PythonのバージョンがPython 3.10以上であることを確認してください。

`pip install` が `externally-managed-environment` で拒否される場合（最近の Debian/Ubuntu）は、仮想環境にインストールしてください：`python3 -m venv ~/alps-venv && source ~/alps-venv/bin/activate && pip install pyalps`。`venv` 自体がない場合は `python3-venv` をインストールするか、[`uv`](https://docs.astral.sh/uv/) を使ってください。

## インストール手順ビデオ

Windowsコンピュータでは、以下のいずれかの方法でインストール可能です：
1. Linuxサブシステムをインストール後、ALPSをインストール
2. 仮想ボックス環境にALPSをインストール

### Linux用Windowsサブシステム (WSL) のインストール
<br>

{{< youtube id="hEYWDLJmNpc" >}}

### WSLへのALPSインストール
<br>

{{< youtube id="FevhLNcQCHY" >}}

### Windows向け仮想ボックス環境へのALPSインストール
<br>

{{< youtube id="Te6IApFjHJs" >}}
