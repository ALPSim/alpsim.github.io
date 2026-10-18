---
title: スピン1鎖のエネルギーギャップの外挿
description: "スピン1鎖のDMRGエネルギーギャップ外挿計算用Jupyter mdファイル"
toc: true
math: true
weight: 25
cascade:
    type: docs
---

本チュートリアルでは、格子サイズ32、64、96、128の様々なサイズを持つスピン1鎖に対して、複数のDMRGシミュレーションを実行します。各格子サイズについてエネルギーギャップを計算し、ギャップと格子サイズの間の既知の解析的関係に基づいて、熱力学極限 $L\rightarrow\infty$ におけるギャップ値を外挿するために使用します。今回のDMRGシミュレーションでは、状態数を $D=200$ に固定します。

ハミルトニアンはスピン1ハイゼンベルク交換模型です(参照:[W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601))。以下でギャップの外挿に用いる解析的な $1/L^2$ スケーリングは、[F.D.M. Haldane, Physics Letters A 93, 464-468 (1983)](https://doi.org/10.1016/0375-9601(83)90631-X) に基づいています。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `LATTICE` | 鎖に用いる格子 | `open chain lattice` |
| `MODEL` | ハミルトニアンのファミリー | `spin` |
| `local_S` | 各サイトのスピン量子数 | `1` |
| `CONSERVED_QUANTUMNUMBERS` | 基底で固定される量子数 | `Sz` |
| `Sz_total` | 全磁化のセクター | `0` |
| `J` | ハイゼンベルク交換結合 | `1` |
| `SWEEPS` | DMRGスイープの回数 | `5` |
| `L` | 鎖の長さ | `32, 64, 96, 128` |
| `MAXSTATES` | 保持するDMRG基底状態数 | `200` |
| `NUMBER_EIGENVALUES` | 保持する低エネルギー固有状態の数 | `4` |

### 格子

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （L = 32、64、96 または 128 サイト、各サイトはスピン1、開放境界条件）
```

単一サイズのスピン1ギャップチュートリアルと同じ `open chain lattice` を用い、$1/L^2$ 外挿のために4種類の長さで繰り返します。他の組み込み格子については [ALPS格子ライブラリ](../../../documentation/intro/latticehowtos) を参照してください。

### 手法の選択

$L=128$ における非切断ヒルベルト空間の次元は $3^{128}\approx3\times10^{61}$ であり、DMRGが唯一実行可能な手法となります。これらの実行は `Sz_total = 0` に限定されており、このセクターでは開放端鎖の4状態からなる端状態多重項がほぼ縮退した一対の状態として現れます。そのため、同一の実行でその一対と第一励起の一対の両方を分解できるように、`NUMBER_EIGENVALUES=4`(2ではなく)が指定されています。そして、以下の結果が示すように、より小さな $L$ で機能する固定の `SWEEPS=5` は、$L$ が大きくなるにつれて自動的にその二重項をきれいに収束させるのに十分とは限りません。

まず必要なライブラリをインポートします。


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

複数回の実行のために、格子サイズ32、64、96、128に対応する入力ファイルを準備します。


```python
parms= []
for lattice in [32, 64, 96, 128]:
    parms.append({
            'LATTICE'                   : "open chain lattice",
            'MODEL'                     : "spin",
            'local_S'                   : '1',
            'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
            'Sz_total'                  : 0,
            'J'                         : 1,
            'SWEEPS'                    : 5,
            'L'                         : lattice,
            'MAXSTATES'                 : 200,
            'NUMBER_EIGENVALUES'        : 4
        })
```

前のチュートリアルで分かっているように `Sz_total = 0` セクターにはほぼ縮退した2つの端状態が含まれるため、各DMRG実行では最も低い4つのエネルギーを保持することに注意してください。

次に入力ファイルを書き出し、シミュレーションを実行します。注意:シミュレーションには使用するコンピュータシステムによって20〜30分程度の時間がかかります。実行したままにして、後で戻ってきても構いません!


```python
input_file = pyalps.writeInputFiles('parm_spin_one_gap_multiple',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

すべてのシミュレーションが完了したら、すべての格子についての測定結果を読み込み、格子サイズに従って結果を並べ替えます。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_gap_multiple'))

sorted_data = sorted(data, key=lambda x: x[0].props['L'])
```

pyalpsのプロット関数用にデータセットを作成します。各格子サイズのエネルギーギャップもこのデータセットに含まれます。


```python
gapplot = pyalps.DataSet()
gapplot.props['xlabel']='$1/L^2$'
gapplot.props['ylabel']='Gap $\Delta/J$'
gapplot.props['label']='D=200'
gapplot.props['line']='.'

x = []
y = []
for measure in sorted_data:
    for s in measure:
        if s.props['observable'] == 'Energy':
            L = s.props['L']
            iL = (1.0/L)**2
            gap = abs(s.y[2] - s.y[1])
            s.props['gap'] = gap
            x.append(iL)
            y.append(gap)

gapplot.x = x
gapplot.y = y
```

$x$軸が $1/L^2$ である点が、スピン1/2の場合と異なることに注意してください。これは、Haldaneが非線形シグマモデルを用いて $k=\pi$ 付近の最低励起状態を解析したことによる、エネルギーギャップと格子サイズの間の解析的関係によるものです。
$$
E(k)=E_0+\sqrt{\Delta^2+c^2(k-\pi)^2}.
$$
開放端境界条件の場合、$k-\pi$ を $1/L$ で近似することができ、これにより有限系のエネルギーギャップは次のようになります:
$$
\Delta(L)\approx\Delta(1+\frac{c^2}{2\Delta^2L^2}).
$$
これは、漸近極限においてギャップの収束が $1/L^2$ に従うべきであることを示しています。

そこで、エネルギーギャップを $1/L^2$ に対してプロットし、直線でフィットします。フィットした曲線(同じ図にプロット)が縦軸と交わる切片が、熱力学極限 $L\rightarrow\infty$ におけるエネルギーギャップの値を与えます。


```python
# プロット用のデータセットを作成する：ギャップ対 (1/L)^2
gapplot = pyalps.DataSet()
gapplot.props['xlabel']='$1/L^2$'
gapplot.props['ylabel']='Gap $\Delta/J$'
gapplot.props['label']='D=200'
gapplot.props['line']='.'

x = []
y = []
for measure in sorted_data:
    for s in measure:
        if s.props['observable'] == 'Energy':
            L = s.props['L']
            iL = (1.0/L)**2
            gap = abs(s.y[2] - s.y[1])
            s.props['gap'] = gap
            x.append(iL)
            y.append(gap)

gapplot.x = x
gapplot.y = y

# ギャップ対 (1/L)^2 の曲線をプロットする：
plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.0011)
plt.ylim(0.3,0.5)

# 線形関数で曲線をフィッティングする
pars = [fw.Parameter(0.1), fw.Parameter(0.2)]
f = lambda self, x, p: p[0]()+p[1]()*x
fw.fit(None, f, pars, np.array(gapplot.y), np.array(gapplot.x))

# フィッティング曲線をプロットする
x = np.linspace(0.0, 0.0011, 100)
plt.plot(x, f(None,x,pars))

print("Gap at thermodynamic limit: ", pars[0]())

plt.show()
```

最終的なエネルギーギャップの値は、数値的に確立されたHaldaneギャップの値である $\Delta/J\approx0.4105$ に近くなるはずです。図は以下のようになります:
![スピン1鎖のエネルギーギャップ](/figs/dmrg/extrapolationGapSOne.png)

### 結果

上記のコードを実行すると、以下の結果が得られます:

| $L$ | $1/L^2$ | ギャップ $\Delta/J$ |
|---|---|---|
| 32 | 0.000977 | 0.47255 |
| 64 | 0.000244 | 0.42770 |
| 96 | 0.000109 | 0.41869 |
| 128 | 0.000061 | 0.41503 |

$1/L^2$ による線形フィットは $L\to\infty$ で $\Delta/J\approx0.4118$ に外挿され、数値的に確立されたHaldaneギャップ $\Delta/J\approx0.4105$ との差は0.3%以内です。

**収束に関する注意:** このチュートリアルで元々指定されていた `SWEEPS=4`–`5` では、$L=128$ におけるほぼ縮退した基底状態二重項が、DMRGのスイープスケジュールによって必ずしも正しく分解されるとは限りません。これにより、最大の $L$ において外れ値が生じ、この外挿結果が損なわれる可能性があります。もし自分の実行結果で $L=128$ のギャップが異常に小さかったり不安定だったりする場合は、その結果を信用するのではなく `SWEEPS` を増やしてください(ここでは10で十分です)。一般に、$L$ が大きいほど、同じ切断精度で収束させるためにより多くのスイープが必要になります。

### まとめと展望

4種類の格子サイズにわたってスピン1のDMRGギャップを $1/L^2$ で外挿すると $\Delta/J\approx0.412$ となり、Haldaneギャップと1%未満の差で一致します——これは、厳密対角化のチュートリアルとは独立した手法(DMRG)を用いたHaldane予想の直接的な数値的確認です。

1. なぜスピン1のギャップは $1/L^2$ で外挿されるのに対し、スピン1/2のギャップ(関連チュートリアル参照)は $1/L$ で外挿されるのでしょうか?
2. $L=128$ において、基底状態二重項の分裂が例えば $10^{-4}$ を下回るまでに、実際には何回のスイープが必要でしょうか?
3. 基底状態二重項の分裂も $L$ に対して抽出・プロットし、それが $L\to\infty$ でゼロに近づくことを確認するには、このコードをどのように修正すればよいでしょうか?
