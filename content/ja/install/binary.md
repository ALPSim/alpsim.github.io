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

PythonのバージョンがPython 3.9以上であることを確認してください。

システム権限が不要な仮想環境へのインストールをお勧めします：

    python3 -m venv ~/alps-venv
    source ~/alps-venv/bin/activate
    pip install pyalps

最近の Debian/Ubuntu ではシステムの Python が `EXTERNALLY-MANAGED`（PEP 668）とされており、仮想環境の外での `pip install` は拒否されます。さらに `python3 -m venv` が `ensurepip is not available` で失敗する場合は、`python3-venv` パッケージをインストールする（`sudo` が必要）か、[`uv`](https://docs.astral.sh/uv/)（`uv venv ~/alps-venv` で作成し、上と同様に有効化してから `uv pip install pyalps`）や conda などユーザー権限で使えるツールで環境を作成してください。

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
