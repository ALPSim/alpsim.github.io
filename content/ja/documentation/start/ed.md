---
title: 厳密対角化法
linkTitle: 厳密対角化法
description: "疎行列厳密対角化を用いた S=1 ハイゼンベルク鎖のハルデンギャップ計算。"
weight: 6
math: true
---

{{< callout type="info" >}}
このチュートリアルは pyalps がすでにインストールされていることを前提としています。まだセットアップしていない場合は、[入門ガイド](../)を参照してください。
{{< /callout >}}

## 厳密対角化とは？

**厳密対角化（ED）**は量子多体問題を解く最も直接的なアプローチです。多体状態の基底でハミルトニアン行列を明示的に構築し、固有値と固有ベクトルを求めます。結果は数値的に厳密であり、近似なし、符号問題なし、サンプリング誤差なしで得られます。ただし計算コストが問題となります。スピン $S$ の $L$ サイト鎖では、ヒルベルト空間の次元は $(2S+1)^L$ と指数的に増大します。$S=1$ の場合、$L=16$ で $3^{16} \approx 4300$ 万状態、$L=20$ では $3^{20} \approx 35$ 億状態となり、大型計算機でも実現可能性の限界に達します。

ALPS sparsediag コードは Lanczos アルゴリズムによる**疎行列対角化**でこの問題に対処します。完全な行列を対角化する代わりに、行列-ベクトル積 $H|\psi\rangle$ の繰り返しから小さな Krylov 部分空間を構築し、そこから最低の数個の固有値を抽出します。ハイゼンベルクハミルトニアンは極めて疎であるため（各基底状態は $O(L)$ 個の状態としか結合しない）、各行列-ベクトル積のコストは $O(\mathrm{dim}^2)$ ではなく $O(L \cdot \mathrm{dim})$ です。

ED は QMC を補完します。零温度での厳密な基底状態および低エネルギースペクトルが得られ、符号問題に関係なくどのモデルにも適用できますが、Lanczos がアクセス可能なシステムサイズ（$S=1$ で $L \lesssim 20$）に限定されます。

## 物理モデル：S=1 ハイゼンベルク鎖

このチュートリアルでは、1次元鎖上の反強磁性ハイゼンベルクモデルを研究します。

$$
H = J \sum_{i=1}^{L} \mathbf{S}_i \cdot \mathbf{S}_{i+1}, \quad J > 0,
$$

各 $\mathbf{S}_i$ はスピン-1 演算子です。このモデルは、反強磁性の最近接交換結合を持つ磁気モーメントの鎖を記述します。

### ハルデンの予想

1983年、Duncan Haldane は驚くべき予言をしました。整数スピンの反強磁性鎖（$S = 1, 2, \ldots$）の基底状態は**ギャップあり**である、すなわち基底状態より上のあらゆる励起状態には有限のエネルギーコスト $\Delta$ が必要である、というものです。一方、半整数スピン鎖（$S = 1/2, 3/2, \ldots$）は**ギャップなし**で、低エネルギー励起のスペクトルは零エネルギーまで連続しています。

これは古典的直感や単純な平均場論の予測から外れる予言でした。この違いは、量子場論的記述における位相的項（トポロジカル項）に由来し、半整数スピンでは存在し、整数スピンでは存在しません。ハルデンの予想は当初論争を呼びましたが、その後の高精度数値計算と実験（NENP などのニッケル化合物）によって確認されました。

$S = 1$ 鎖では、最低三重項励起へのギャップは熱力学的極限（$L \to \infty$）で

$$
\Delta \approx 0.411\,J
$$

に収束します。長さ $L$ の有限鎖では、見かけのギャップはより大きく、指数的に熱力学的値へ収束します。

$$
\Delta(L) \approx \Delta + A\, e^{-L/\xi},
$$

ここで $\xi \approx 6$ はハルデン相の相関長です。$\xi$ は小さくないため、$L = 16$ の鎖でも有意な有限サイズ補正が残ります。これが慎重な外挿が必要な理由です。

## 計算の戦略

1. 鎖長 $L \in \{4, 6, 8, 10, 12, 14, 16\}$ で `sparsediag` を実行する。
2. 各 $L$ について、$S_z = 0$ セクター（一重項基底状態）と $S_z = 1$ セクター（最低三重項状態）の最低エネルギーを計算する。
3. ギャップ $\Delta(L) = E_0(S_z=1,L) - E_0(S_z=0,L)$ を構成する。
4. 指数的有限サイズ公式をフィットして $\Delta$ を抽出する。

## インポート

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

## 量子数セクター

コードを見る前に、なぜ各鎖長で2回の対角化（`Sz_total=0` と `Sz_total=1`）を行うのかを理解しておく価値があります。

ハイゼンベルクハミルトニアンは全磁化 $S_z^{\text{total}} = \sum_i S_z^i$ と交換します。すなわち全 $S_z$ は保存されます：$[H, S_z^{\text{total}}] = 0$。したがって完全なヒルベルト空間は $S_z^{\text{total}}$ で標識された独立なセクターにブロック対角化され、各セクターを独立に対角化できます。

これが ED を実用的にする鍵です。$L = 16$、$S = 1$ では完全ヒルベルト空間の次元は約 4300 万ですが、$S_z = 0$ セクターは約 1400 万と小さく、ALPS はさらに平移対称性とパリティも利用して有効次元を $2L$ 倍ほど削減します。

**反強磁性体の一重項基底状態**は $S_z = 0$ セクターに存在します。**最低三重項励起状態**（全スピン 1 の最初の状態）は $S_z = 1$ セクターの基底状態として現れます。両者のエネルギー差が三重項ギャップです。

## パラメータと入力ファイル

```python
parms = []
for l in [4, 6, 8, 10, 12, 14, 16]:
    for sz in [0, 1]:
        parms.append(
          {
            'LATTICE'                  : "chain lattice",
            'MODEL'                    : "spin",
            'local_S'                  : 1,               # S=1 スピン鎖
            'J'                        : 1,               # 反強磁性交換（エネルギースケールを設定）
            'L'                        : l,               # 鎖長
            'CONSERVED_QUANTUMNUMBERS' : 'Sz',            # Sz セクターでブロック対角化するよう ALPS に指示
            'Sz_total'                 : sz               # 対象セクター（0=一重項、1=三重項）
          }
        )

input_file = pyalps.writeInputFiles('parm2a', parms)
```

`writeInputFiles` は `sparsediag` が読み込む ALPS 形式の XML 入力ファイルを作成します。プレフィックス `'parm2a'` は出力ファイルの命名に使われます。

## ソルバーの実行

```python
res = pyalps.runApplication('sparsediag', input_file)
```

`sparsediag` は各パラメータセットに対して Lanczos アルゴリズムを実行します。各 $(L, S_z)$ の組み合わせについて、平移対称性を利用して $S_z$ セクター内でさらにブロック分割し、各格子運動量 $k = 0, \frac{2\pi}{L}, \ldots, \frac{2\pi(L-1)}{L}$ ごとに小さな行列を解きます。結果はプレフィックスで命名された HDF5 ファイルに保存されます。

## 結果の読み込みとデータ構造の理解

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm2a'))
```

`data` はパラメータセットごとのシミュレーションのリストです。各要素 `sim` は `DataSet` オブジェクトのリストであり、選択した $S_z$ セクター内の各格子運動量サブセクターに対応します。各 `DataSet` は以下を持ちます：
- `sec.props`：このランのパラメータ（`'L'`、`'Sz_total'`、`'TOTAL_MOMENTUM'` など）
- `sec.y`：このサブセクターで得られた固有値の NumPy 配列

## ギャップの抽出

各 $S_z$ セクターの基底状態は任意の格子運動量を持ち得るため、すべての $k$ サブセクターの固有値を収集してグローバルな最小値を取ります：

```python
lengths      = []
min_energies = {}
for sim in data:
    l  = int(sim[0].props['L'])
    if l not in lengths: lengths.append(l)
    sz = int(sim[0].props['Sz_total'])
    all_energies = []
    for sec in sim:          # この (L, Sz) ランの k サブセクターをループ
        all_energies += list(sec.y)
    min_energies[(l, sz)] = np.min(all_energies)
```

このループの後、`min_energies[(l, 0)]` は一重項セクターの基底状態エネルギー、`min_energies[(l, 1)]` は三重項セクターの基底状態エネルギーです。

## 有限サイズ外挿

各有限サイズにおけるギャップは：

$$
\Delta(L) = E_0(S_z=1,\, L) - E_0(S_z=0,\, L).
$$

これを $1/L$ に対してプロットし、指数的有限サイズ補正をフィットします：

$$
\Delta(L) = \Delta + A\, e^{-L/\xi}.
$$

横軸は $1/L$（熱力学的極限は $x = 0$）ですが、フィット関数 `f` は $L$ の関数として書かれ `1/x` を渡して呼び出します。`fw.Parameter` オブジェクトにフィットパラメータが格納され、`fw.fit` 実行後に `p[0]()` が $\Delta$ の値を、`p[1]()` が $A$ を、`p[2]()` が $\xi$ を返します。

$L = 4$ と $L = 6$ での最大のスケーリング補正を避けるため、$L \geq 8$ のみフィットします（インデックス `[2:]`）：

```python
gapplot = pyalps.DataSet()
gapplot.x = 1./np.sort(lengths)
gapplot.y = [min_energies[(l,1)] - min_energies[(l,0)] for l in np.sort(lengths)]
gapplot.props['xlabel'] = '$1/L$'
gapplot.props['ylabel'] = '三重項ギャップ $\Delta/J$'
gapplot.props['label']  = 'S=1'
gapplot.props['line']   = '.'

plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0, 0.25)
plt.ylim(0, 1.0)

# 初期推定値：Delta~0.411（既知のハルデンギャップ）、A~1000、xi~6
pars = [fw.Parameter(0.411), fw.Parameter(1000), fw.Parameter(6)]
f = lambda self, x, p: p[0]() + p[1]()*np.exp(-x/p[2]())
fw.fit(None, f, pars, np.array(gapplot.y)[2:], np.sort(lengths)[2:])  # L >= 8 でフィット

x = np.linspace(0.0001, 1./min(lengths), 100)
plt.plot(x, f(None, 1/x, pars))

plt.show()
```

## 結果

フィット曲線は $1/L = 0$ で $\Delta \approx 0.411\,J$ に外挿されます。これは最良の数値計算結果（White & Huse, 1993：$\Delta = 0.41048\,J$）とよく一致しており、ハルデン相の存在を確認し、ALPS `sparsediag` ソルバーの正確さを検証しています。

図には三重項ギャップが $L$ の増加とともに減少する様子と、指数的収束を捉えたフィット曲線が示されています：

![S=1 ハイゼンベルク鎖における三重項ギャップの 1/L 依存性とハルデンギャップへの外挿](/figs/ED_spin.png)
