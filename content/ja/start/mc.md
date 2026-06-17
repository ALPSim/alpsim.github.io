---
linkTitle: 古典モンテカルロ法
title: 古典モンテカルロシミュレーション
description: "2Dイジングモデルの相転移"
weight: 2
math: true
---

2Dイジングモデルは統計力学において最も重要なモデルの一つです。正方格子上のスピンがアップまたはダウンのいずれかを向き、最近接スピン間に強磁性結合 $J > 0$ が働くモデルです（`spinmc` のデフォルトである古典符号規約では、$J > 0$ が平行スピンを優先します）。Onsager は1944年にこのモデルの厳密解を導き、$T_c = 2J / \ln(1 + \sqrt{2}) \approx 2.269\, J/k_B$ で相転移が起こることを示しました。$T_c$ 以下ではスピンが自発的に秩序化し、$T_c$ 以上では熱揺らぎがその秩序を壊します。

このチュートリアルでは ALPS を使ってこの相転移をシミュレートします。物理が十分に理解されており結果の検証が容易なため、入門例として最適です。

{{< callout type="info" >}}
このチュートリアルは pyalps がすでにインストールされていることを前提としています。まだセットアップしていない場合は、[入門ガイド](../)を参照してください。
{{< /callout >}}

## パッケージのインポート

`pyalps` はシミュレーションフレームワークと解析ツールを提供します。`matplotlib` と `pyalps.plot` は可視化に使用します。

```python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot
```

## パラメータの設定

$4\times 4$、$8\times 8$、$16\times 16$ の3種類のサイズの正方格子を幅広い温度範囲でシミュレートします。複数のシステムサイズで計算することで、熱力学的極限に近づくにつれて相転移がどのように鮮明になるかを観察できます。

各実行のパラメータは辞書のリストとして収集します：

```python
parms = []
for l in [4, 8, 16]:
    for t in [5.0, 4.5, 4.0, 3.5, 3.0, 2.9, 2.8, 2.7]:
        parms.append({
            'LATTICE'        : "square lattice",
            'T'              : t,
            'J'              : 1,
            'THERMALIZATION' : 1000,
            'SWEEPS'         : 400000,
            'UPDATE'         : "cluster",
            'MODEL'          : "Ising",
            'L'              : l,
        })
    for t in [2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.2]:
        parms.append({
            'LATTICE'        : "square lattice",
            'T'              : t,
            'J'              : 1,
            'THERMALIZATION' : 1000,
            'SWEEPS'         : 40000,
            'UPDATE'         : "cluster",
            'MODEL'          : "Ising",
            'L'              : l,
        })
```

主要なパラメータの説明：

- **`THERMALIZATION`**：測定開始前にシステムを平衡状態に近づけるために、各実行の最初に破棄するモンテカルロスイープ数です。
- **`SWEEPS`**：熱化後の測定スイープ数です。スイープ数が多いほど統計誤差が小さくなります。高温では多くのスイープ数（$400\,000$）を使い、臨界温度付近およびそれ以下では少なくします（$40\,000$）。
- **`UPDATE: "cluster"`**：単一スピン反転の Metropolis 法ではなく Wolff クラスターアルゴリズムを選択します。$T_c$ 付近では、スピン相関長が発散するため単一スピン反転更新で*臨界スローダウン*が生じ、シミュレーションが非常に非効率になります。クラスターアルゴリズムは相関したスピンドメイン全体を一度に反転させることでこの問題を回避します。
- **`L`**：格子の一辺のサイズです。`L = 8` の格子は $8 \times 8 = 64$ 個のスピンを持ちます。

温度グリッドは $T_c$ から遠い領域では粗く、相転移が起こる $1.2$–$2.7$ の範囲では細かく設定されています。

## シミュレーションの実行

`writeInputFiles` はパラメータリストを ALPS が要求する XML 入力形式に変換してディスクに書き込みます。`runApplication` はその後 `spinmc` 実行ファイルを起動します。`Tmin=5` 引数は各実行に少なくとも5秒の CPU 時間を使用するよう指定します。

```python
input_file = pyalps.writeInputFiles('parm7a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=5)
```

## 評価とプロット

`evaluateSpinMC` は生のシミュレーション出力を後処理して、磁化率や Binder キュムラントなどの派生量を計算します。`loadMeasurements` は結果を Python に読み込み、`collectXY` はシステムサイズごとに $|m|$ 対 $T$ の曲線として整理します。

```python
pyalps.evaluateSpinMC(pyalps.getResultFiles(prefix='parm7a'))

# 磁化を温度の関数として読み込む
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm7a'), ['|Magnetization|'])
magnetization_abs = pyalps.collectXY(data, x='T', y='|Magnetization|', foreach=['L'])

# プロット作成
plt.figure()
pyalps.plot.plot(magnetization_abs)
plt.xlabel('温度 $T$')
plt.ylabel('磁化 $|m|$')
plt.title('2Dイジングモデル')
plt.show()
```

磁化は低温での約 1 から $T_c \approx 2.269$ 以上での 0 へと低下します。小さいシステムでは有限サイズ効果により相転移が丸みを帯びて見えますが、$L$ が増大するにつれて相転移は鋭くなり、厳密な $T_c$ に近づきます：

![2Dイジングモデルの磁化と温度の関係](/figs/Ising_2D_m.png)


## チュートリアルビデオ

<br>

{{< youtube id="3_4WCeKDtKc" >}}
