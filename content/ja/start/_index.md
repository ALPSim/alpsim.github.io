---
title: はじめに
description: "ALPSの概要とインストール方法"
weight: 2
toc: true
cascade:
    type: docs
aliases:
  - /ja/documentation/start/intro/
  - /ja/documentation/start/obtain/
  - /ja/documentation/start/path/
---

ALPSは相関システムのシミュレーション向けソフトウェアパッケージです。古典モンテカルロ法、量子モンテカルロ法、密度行列繰り込み群法のシミュレーションプログラムを提供しています。

## ALPSの入手方法

`ALPS`を使用する最も簡単な方法は、プリビルド済みのPythonパッケージをインストールすることです：

```ShellSession
$ pip install pyalps
```

HPC環境でのビルドなど、より詳細なインストール方法については以下をご覧ください：

<div class="btn-grid">
{{< cta-button text="バイナリ" link="../install/binary" icon="download" >}}
{{< cta-button text="ソース" link="../install/source" icon="code" >}}
{{< cta-button text="Spack" link="../install/spack" icon="inventory_2" >}}
</div>

## クイックスタートチュートリアル

ALPSをインストールしたら、以下のクイックスタート例をお試しください：

- [古典モンテカルロ法](mc) — 2次元Isingモデルの相転移
- [量子モンテカルロ法](qmc) — ハイブリダイゼーション展開ソルバーによるKondoスクリーニング
- [密度行列繰り込み群法](dmrg) — Heisenberg鎖の基底状態エネルギー
- [厳密対角化法](ed) — スピン鎖の三重項ギャップ

{{< callout type="info" >}}
**ディスプレイのないマシン（SSH、HPC クラスタ）で実行する場合** 各例は `plt.show()` で終わり、ウィンドウを開こうとします。ディスプレイがないと matplotlib は `FigureCanvasAgg is non-interactive, and thus cannot be shown` と表示するだけで、図は現れません。`plt.show()` を `plt.savefig('figure.png')` に置き換えると、図をファイルに保存できます。
{{< /callout >}}
