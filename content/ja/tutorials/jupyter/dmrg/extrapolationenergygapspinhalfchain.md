---
title: スピン1/2鎖のエネルギーギャップの外挿
description: "スピン半整数鎖のDMRGエネルギーギャップに関するJupyter mdファイル"
toc: true
math: true
weight: 23
cascade:
    type: docs
---

このチュートリアルでは、32、64、96、128というさまざまな格子サイズを持つスピン1/2鎖のエネルギーギャップを計算します。DMRGシミュレーションで保持する状態数は$D=100$に固定し、これにより十分な精度の結果が得られます。エネルギーギャップを格子サイズに対してプロットし、熱力学極限へ外挿します。

このハミルトニアンは反強磁性ハイゼンベルク交換模型であり、[W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601)によって初めて導入されました:
$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j, \qquad J>0.
$$
スピン1/2鎖の場合、熱力学極限においてギャップは$1/L$の形で閉じることが知られており、これが以下でフィットするスケーリング形式です。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `LATTICE` | 鎖に用いる格子 | `open chain lattice` |
| `MODEL` | ハミルトニアンのモデル族 | `spin` |
| `CONSERVED_QUANTUMNUMBERS` | 基底で固定する量子数 | `Sz` |
| `Sz_total` | 全磁化のセクター | `0` |
| `J` | ハイゼンベルク交換結合 | `1` |
| `SWEEPS` | DMRGスイープの回数 | `4` |
| `L` | 鎖の長さ | `32, 64, 96, 128` |
| `MAXSTATES` | 保持するDMRG基底状態の数 | `100` |
| `NUMBER_EIGENVALUES` | 保持する低エネルギー固有状態の数 | `2` |

### 格子

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （L = 32、64、96 または 128 サイト、開放境界条件）
```

単一サイズのギャップに関するチュートリアルと同じ`open chain lattice`を用い、有限サイズのギャップを$L\to\infty$へ外挿できるように4つの長さで繰り返し計算します。その他の組み込み格子については[ALPS格子ライブラリ](../../../documentation/intro/latticehowtos)を参照してください。

### 手法の選択

$L=128$では、切り詰めていないヒルベルト空間は$2^{128}$となり、厳密対角化の範囲をはるかに超えます。`MAXSTATES=100`に固定したDMRGを用いることで、すべてのサイズにおいて計算を実行可能な規模に保ちながら、以下の$1/L$外挿に十分な精度でギャップを求めることができます。4つのサイズすべてを合わせても実行時間は1分未満です。

まず必要なライブラリをインポートします。


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

複数回の実行のために、さまざまな格子サイズの入力ファイルを準備します。


```python
parms= []
for lattice in [32, 64, 96, 128]:
    parms.append({
            'LATTICE'                   : "open chain lattice",
            'MODEL'                     : "spin",
            'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
            'Sz_total'                  : 0,
            'J'                         : 1,
            'SWEEPS'                    : 4,
            'L'                         : lattice,
            'MAXSTATES'                 : 100,
            'NUMBER_EIGENVALUES'        : 2
        })
```

DMRGシミュレーションで保持する状態の最大数を設定していることに注意してください。最も低い2つの固有値が保持され、エネルギーギャップの計算に使われます。

続いて入力ファイルを書き出し、シミュレーションを実行します。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_gap_multiple',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

シミュレーション後、すべての格子について全ての測定結果を読み込み、格子サイズに従って結果を並べ替えます。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap_multiple'))

sorted_data = sorted(data, key=lambda x: x[0].props['L'])
```

pyalpsのプロット関数用のデータセットを作成します。各格子サイズに対応するエネルギーギャップもこのデータセットに含めます。


```python
gapplot = pyalps.DataSet()
gapplot.props['xlabel']='$1/L$'
gapplot.props['ylabel']='Gap $\Delta/J$'
gapplot.props['label']='D=100'
gapplot.props['line']='.'

x = []
y = []
for measure in sorted_data:
    for s in measure:
        if s.props['observable'] == 'Energy':
            L = s.props['L']
            iL = 1.0/L
            gap = abs(s.y[1] - s.y[0])
            s.props['gap'] = gap
            x.append(iL)
            y.append(gap)

gapplot.x = x
gapplot.y = y
```

エネルギーギャップと1/Lの関係をプロットし、線形曲線でフィットします。フィットした曲線も同じ図にプロットします。


```python
# ギャップ対 1/L の曲線をプロットする：
plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.04)
plt.ylim(0,0.2)

# 線形関数で曲線をフィッティングする
pars = [fw.Parameter(0.1), fw.Parameter(0.2)]
f = lambda self, x, p: p[0]()+p[1]()*x
fw.fit(None, f, pars, np.array(gapplot.y), np.array(gapplot.x))

# フィッティング曲線をプロットする
x = np.linspace(0.0, 0.035, 100)
plt.plot(x, f(None,x,pars))

print("Gap at thermodynamic limit: ", pars[0]())

plt.show()
```

最終的なエネルギーギャップの図は次のようになるはずです:
![Energy Gap of a Spin-1/2 Chain](/figs/dmrg/extrapolationGapSHalf.png)

### 結果

上記のコードを実行すると、以下の結果が得られます:

| $L$ | $1/L$ | Gap $\Delta/J$ |
|---|---|---|
| 32 | 0.03125 | 0.11774 |
| 64 | 0.01563 | 0.06176 |
| 96 | 0.01042 | 0.04205 |
| 128 | 0.00781 | 0.03194 |

$1/L$に対する線形フィットは、$L\to\infty$で$\Delta/J\approx0.0040$に外挿されます——これはフィットの有限サイズ系統誤差の範囲内でゼロと一致しており、スピン1/2ハイゼンベルク鎖がギャップレスであることを裏付けています。

### まとめと今後の展望

DMRGで計算したスピン1/2ハイゼンベルク鎖のギャップは、$1/L$に対してほぼ線形に縮小し、実質的にゼロへ外挿されます。これは、この鎖が熱力学極限においてギャップレスであることを裏付けており、スピン1鎖で見られる有限のハルデインギャップとは対照的です。

1. ここでは$1/L$に対する厳密な線形フィットが最良の選択でしょうか、それともスピン1/2鎖に対して場の理論が予測するような対数補正を含む形の方がよくフィットするでしょうか？
2. $L=160,192$のようなより大きな格子サイズを含めると、外挿されるギャップはどのように変化するでしょうか？
3. この外挿結果をスピン1の場合と比較してください。なぜスピン1の場合はゼロではなく有限のギャップに外挿されるのでしょうか？
