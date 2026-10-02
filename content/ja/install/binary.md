---
title: バイナリからのMac/LinuxへのALPSインストール
description: "ALPSバイナリインストール"
weight: 1
toc: true
cascade:
    type: docs
---

プリビルド済みバイナリ[`pyALPS`](https://pypi.org/project/pyalps/)は、Python 3.10 以上がある、ほとんどのLinuxおよびmacOSマシンにインストールできます。仮想環境へのインストールをお勧めします。最近の Ubuntu など一部のシステムでは、システムの Python への `pip install` が許可されていません：

    python3 -m venv alps-env
    . alps-env/bin/activate
    python -m pip install pyalps

新しいターミナルを開くたびに、ALPS を使う前に環境を有効化してください（`. alps-env/bin/activate`）。

バイナリ版の ALPS はコードの並列実行に対応していません。並列版の ALPS が必要な場合は、[ソース](../source)または [spack](../spack) からインストールしてください。

### コマンドラインプログラム

`pip install pyalps` は Python パッケージに加えて、ALPS アプリケーション（`spinmc`、`loop`、`worm`、`dirloop_sse`、`qwl`、`sparsediag`、`fulldiag`、`dmrg`、`dmft` など）、`spinmc_evaluate`、`worm_evaluate`、`fulldiag_evaluate`、`qwl_evaluate`、およびツール `parameter2xml` と `printgraph` のシェルコマンドもインストールします。そのため、有効化した環境ではコマンドラインのチュートリアルをそのまま実行できます。例えば：

    parameter2xml parm1a
    spinmc --Tmin 10 --write-xml parm1a.in.xml

これらのコマンドは pyalps 3.0.0 より新しいリリースでインストールされます。pyalps 3.0.0 では、チュートリアルの Python 版を使うか、`python -m pip install --upgrade pyalps` でアップグレードしてください。

バイナリパッケージには次のものは**含まれていません**：

- 変換・プロット用ツール `convert2text`、`convert2xml`、`plot2text`、`plot2xmgr`、`plot2gp`、および `dirloop_sse_evaluate`。代わりにチュートリアルの Python 版を使うか、[ソース](../source)または [spack](../spack) からインストールしてください。
- チュートリアルのディレクトリ。パラメータファイルは各チュートリアルのページからダウンロードするか、ALPS リポジトリの [`tutorials`](https://github.com/ALPSim/ALPS/tree/master/tutorials) フォルダから入手してください。

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
