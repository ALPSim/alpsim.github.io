---
title: スピン1ハイゼンベルク鎖のスピンギャップ
description: "スピンギャップ計算のための Jupyter md ファイル"
toc: true
math: true
weight: 12
cascade:
    type: docs
---

このチュートリアルでは、疎行列対角化プログラム（ランチョス法）を用いて、さまざまな格子サイズ（$L=4, 6, 8$、および10）における1次元スピン1ハイゼンベルク鎖のエネルギーギャップを計算する方法を学びます。得られた有限格子のギャップは、熱力学極限（$L=\infty$）におけるエネルギーギャップを外挿するために用いられます。

スピン1ハイゼンベルク鎖のハミルトニアンは次のように与えられます。

$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j,
$$

ここで、最近接スピン $\mathbf{S}^i$ と $\mathbf{S}^j$ の間の反強磁性的相互作用に対して $J>0$ であり、スピン間相互作用は次のように3つの成分から構成されます。

$$
\mathbf{S}^i \cdot \mathbf{S}^j=S^i_xS^j_x+S^i_yS^j_y+S^i_zS^j_z.
$$

基底状態は通常、$S_z$ 演算子の固有状態として選ばれます。スピン1系の場合、各格子サイトに対して3つの基底状態、$|-1\rangle$、$|0\rangle$、$|+1\rangle$ が存在します。これらの基底状態への $S_x$ および $S_y$ 演算子の作用は、昇降演算子 $S^{\dagger}$ と $S^{-}$ を用いて次のように表せます。

$$
S_x=\frac{1}{2}(S^{\dagger}+S^{-}),
$$

$$
S_y=\frac{1}{2i}(S^{\dagger}-S^{-}),
$$

これらは基底状態に対して次のように作用します。

$$
S^{\dagger}|s\rangle = \sqrt{S(S+1)-s(s+1)}|s+1\rangle,
$$

$$
S^{-}|s\rangle = \sqrt{S(S+1)-s(s-1)}|s-1\rangle,
$$

ここで $S=1$、$s=-1, 0, +1$ です。

各格子サイトについて上記の基底状態を用いると、ハミルトニアンはエルミート行列として書くことができます。全磁化を固定する、すなわちシミュレーションにおいて Sz_total = 0（一重項セクター）または Sz_total = 1（三重項セクター）に設定することで、行列のサイズを縮小できます。

ハイゼンベルク交換ハミルトニアンは [W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601) によって導入されました。整数スピン鎖（ここでの $S=1$ のような場合）については、[F.D.M. Haldane, Physics Letters A 93, 464-468 (1983)](https://doi.org/10.1016/0375-9601(83)90631-X) が、ギャップレスなスピン1/2の場合とは対照的に、熱力学極限において有限の励起ギャップが存在することを予言しました。これは現在ハルデインギャップとして知られています。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `LATTICE` | 鎖に用いる格子 | `chain lattice` |
| `MODEL` | ハミルトニアンのモデル族 | `spin` |
| `local_S` | 各サイトのスピン量子数 | `1` |
| `J` | ハイゼンベルク交換結合 $J$ | `1` |
| `L` | 鎖の長さ | `4, 6, 8, 10, 12, 14` |
| `CONSERVED_QUANTUMNUMBERS` | 基底で固定される量子数 | `Sz` |
| `Sz_total` | 全磁化セクター | `0`（一重項）、`1`（三重項） |

### 格子

`chain lattice` は、最近接交換 $J$ で結合された `L` 個のスピン1サイトからなる1次元の**周期的**なリングです。

```
 S=1     S=1     S=1           S=1
  o---J---o---J---o--- ... ---o
  |                           |
  +----------- J -------------+
        （周期的なリング、L サイト）
```

最後のサイトから最初のサイトへ戻る結合がリングを閉じます。この計算において周期的境界条件は重要です。*開放的な*スピン1鎖はその両端に有効的な $S=1/2$ スピンを持ち、それらが生み出すほぼ縮退した端状態がバルクギャップの内側に位置するため、開放鎖で測定される一重項/三重項の分裂はハルデインギャップではなく端励起になってしまいます。鎖を閉じてリングにすると端が完全になくなるため、以下で抽出されるギャップは外挿が求めているバルクギャップとなります。`open chain lattice` を含むその他の組み込み格子については、[ALPS格子ライブラリ](../../../documentation/intro/latticehowtos)を参照してください。

### 手法の選択

スピン1の場合、局所ヒルベルト空間の次元は3であるため、$L$ サイト鎖の完全なヒルベルト空間は $3^L$ となります。例えば $3^{14}\approx 4.8\times10^6$ であり、`Sz_total` による制限後にはこれが大幅に減少します。各 `Sz_total` セクターにおいて最低エネルギーのみが必要であるため、完全対角化ではなく、ここでもランチョス法に基づく `sparsediag` が適切な手法となります。ここで用いた6つの格子サイズすべて（$L=4$ から $14$ まで）は、合計で1分未満で完了します。

まず、必要なモジュールをインポートします。

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

次に、入力ファイルをPython辞書のリストとして準備します。

```python
parms = []
for l in [4, 6, 8, 10, 12, 14]:
  for sz in [0, 1]:
      parms.append(
        { 
          'LATTICE'                   : "chain lattice", 
          'MODEL'                     : "spin",
          'local_S'                   : 1,
          'J'                         : 1,
          'L'                         : l,
          'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
          'Sz_total'                  : sz
        }
      )

```

入力ファイルを書き出し、シミュレーションを実行します。

```python
input_file = pyalps.writeInputFiles('parm2a',parms)
res = pyalps.runApplication('sparsediag',input_file) #, MPI=4)
```

次に、各システムサイズおよびスピンセクターのスペクトルを読み込みます。

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm2a'))
```

ギャップを抽出するために、いくつかの長さのリストと、各 (L,Sz) セクターにおける最小エネルギーを格納するPython辞書を作成する必要があります。

```python
lengths = []
min_energies = {}

for sim in data:
  l = int(sim[0].props['L'])
  if l not in lengths: lengths.append(l)
  sz = int(sim[0].props['Sz_total'])
  all_energies = []
  for sec in sim:
    all_energies += list(sec.y)
  min_energies[(l,sz)]= np.min(all_energies)
```

最後に、ギャップを 1/L の関数としてプロットし、その図を表示します。

```python
gapplot = pyalps.DataSet()
gapplot.x = 1./np.sort(lengths)
gapplot.y = [min_energies[(l,1)] -min_energies[(l,0)] for l in np.sort(lengths)]  
gapplot.props['xlabel']='$1/L$'
gapplot.props['ylabel']='Triplet gap (J)'
gapplot.props['label']='S=1'
gapplot.props['line']='.'

plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.25)
plt.ylim(0,1.0)
```

次に、L=8 から L=14 の範囲のデータをフィッティングし、熱力学極限（$L\rightarrow \infty$、すなわち $1/L\rightarrow 0$）におけるギャップを求めます。

```python
pars = [fw.Parameter(0.411), fw.Parameter(1000), fw.Parameter(1)]
f = lambda self, x, p: p[0]()+p[1]()*np.exp(-x/p[2]())
fw.fit(None, f, pars, np.array(gapplot.y)[2:], np.sort(lengths)[2:])

x = np.linspace(0.0001, 1./min(lengths), 100)
plt.plot(x, f(None, 1/x, pars))

plt.show()
```

シミュレーションの結果を次の図に示します。
![Fitted spin gap from simulations.](/figs/ed/spingap.png)

### 結果

上記のコードを実行すると、以下の有限サイズ三重項ギャップと外挿値が得られます。

| $L$ | ギャップ $\Delta(L)/J$ |
|---|---|
| 4 | 1.00000 |
| 6 | 0.72063 |
| 8 | 0.59356 |
| 10 | 0.52481 |
| 12 | 0.48420 |
| 14 | 0.45897 |

$L=8$ から $14$ までを $\Delta(L) = \Delta_\infty + A e^{-L/\xi}$ にフィッティングすると、$\Delta_\infty/J \approx 0.4218$ に外挿され、数値的に知られているハルデインギャップの値 $\Delta/J \approx 0.4105$ に近い結果となります（約3%の偏差は、ここでは $L\le14$ のみを用いていることによる有限サイズフィッティング誤差です）。

### まとめと展望

有限サイズのスピン1ハイゼンベルク鎖を厳密対角化し、$L\rightarrow\infty$ に外挿することで、整数スピン反強磁性鎖について予言された有限のハルデインギャップが確認されました。これは、ギャップレスなスピン1/2鎖とは著しい対照をなしています。

1. フィッティングにより大きな $L$ を含めた場合、または最大の3つのサイズのみを用いた場合、外挿されるギャップはどのように変化するでしょうか。
2. ギャップが存在しないスピン1/2鎖では、ギャップに対してどのような関数形が期待されるでしょうか。
3. 外挿された $\Delta_\infty$ は、フィッティング範囲の選択にどの程度敏感でしょうか。
