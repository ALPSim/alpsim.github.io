---
title: 横磁場量子イジングモデル
description: "横磁場イジングのJupyter mdファイル"
toc: true
math: true
weight: 11
cascade:
    type: docs
---

### はじめに

本チュートリアルでは、臨界スピン鎖を取り上げ、それらの共形場理論による記述との関連を見ていきます。

ここで扱うモデルは臨界イジング鎖であり、そのハミルトニアンは次のように与えられます

$$
H=J_{z} \sum_{\langle i,j \rangle} S^i_z S^j_z + \Gamma \sum_i S^i_x
$$

ここで、最初の和は最近接格子点対について取られます。$\Gamma$ は横磁場と呼ばれ、系は $\Gamma/J=\frac{1}{2}$ で臨界的になります。$\Gamma=0$ の場合、基底状態は $J\gt 0$ では反強磁性、$J \lt 0$ では強磁性になります。この系は厳密に解くことができます（[P. Pfeuty, Annals of Physics 57, 79-90 (1970)](https://doi.org/10.1016/0003-4916(70)90270-8)）。

上式において、$\Delta$ はその場のスケーリング次元を表します。スケーリング場はいくつかの組として現れます。最も低いものは一次場（primary field）と呼ばれ、それに付随してスケーリング次元 $\Delta + m$（$m \in \lbrace 1, 2, 3, ... \rbrace$）を持つ無限個の子孫場（descendants）が存在します。

イジングモデルの厳密解において（[Pfeuty の論文](https://doi.org/10.1016/0003-4916(70)90270-8)の式 (3.7)）、長距離相関は次のように減衰することが分かります：
$$
\langle S^i_z S^{i+n}_z \rangle \sim n^{-2\times 1/8}
$$
$$
\langle S^i_y S^{i+n}_y \rangle \sim n^{-2\times(1+1/8)}
$$
$$
\langle S^i_x S^{i+n}_x \rangle \sim n^{-2\times 1}
$$
さらに、恒等演算子のスケーリング次元は 0 になると予想されます。

したがって、イジングモデルの共形場理論には 0、1/8、1、1+1/8 のスケーリング次元が現れると予想されます。これを確認するために、スペクトルのすべてのエネルギーを $E \rightarrow \frac{E-E_0}{(E_1-E_0)8}$ に従って再スケーリングします。これにより、最も低い2つの状態が予想されるスケーリング次元の位置に強制的に一致させられます。その上で、残りのスペクトルがこれと矛盾しないかどうかを確認できます。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `LATTICE` | 鎖に用いる格子 | `chain lattice` |
| `MODEL` | ハミルトニアンファミリー | `spin` |
| `local_S` | 各格子点のスピン量子数 | `0.5` |
| `Jxy` | 面内（$S_xS_x+S_yS_y$）結合、ここでは未使用 | `0` |
| `Jz` | イジング（$S_zS_z$）結合 $J_z$ | `-1` |
| `Gamma` | 横磁場 $\Gamma$ | `0.5` |
| `NUMBER_EIGENVALUES` | 保持する低エネルギー固有状態の数 | `5` |
| `L` | 鎖の長さ | `10, 12` |

`Jz=-1`、`Gamma=0.5` のとき、$\Gamma/J=0.5$ となり、これはまさにこのモデルの臨界点です。

### 格子

`chain lattice` は `L` 個のサイトからなる1次元の**周期的**な環であり、イジング結合 $J_z$ はボンド上に、横磁場 $\Gamma$ は各サイトに作用します：

```
 Γ       Γ       Γ             Γ
 o--Jz---o--Jz---o--- ... ---o
 |                            |
 +------------ Jz ------------+
        （周期的な環、L サイト）
```

この環はそれ自身で閉じています。最後のサイトから最初のサイトへ戻るボンドこそが、この格子を周期的にしているものです。ここで周期境界条件を選ぶ理由は2つあります。周期境界条件は並進対称性を保つため、各固有状態は明確に定義された格子運動量を持ちます。これはまさに、以下でスペクトルをプロットする際の横軸となる `TOTAL_MOMENTUM` 量子数です。また、周期境界条件には開いた端が存在しないため、バルクの共形スペクトルを汚染する端状態がなく、共形場理論のスケーリング次元に対する有限サイズ補正も開放鎖の場合より速く減衰します。代わりに開放境界条件を使いたい場合、ALPS には `open chain lattice` が用意されています。組み込み格子の完全な一覧については、[ALPS 格子ライブラリ](../../../documentation/intro/latticehowtos)を参照してください。

### 手法の選択

スピン1/2鎖の完全なヒルベルト空間の次元は $2^L$ であり、$L=10$ では $2^{10}=1024$、$L=12$ では $2^{12}=4096$ です。必要なのは（全スペクトルではなく）最も低い数個の固有状態のみであるため、`sparsediag` が実装する反復的なランチョス法が自然な選択となります。これは、完全対角化に比べてはるかに少ない行列-ベクトル積の回数で最低固有値を収束させることができ、ここで扱う2つのヒルベルト空間サイズはどちらもその処理能力に対して十分小さいものです（各システムサイズあたりの実行時間は1秒未満です）。

### シミュレーション

まず、いくつかのモジュールをインポートします：


```python
import pyalps
import pyalps.plot
import numpy as np
import matplotlib.pyplot as plt
import copy
import math
```

次に、2つのシステムサイズについてパラメータを設定しましょう。縦磁場 $h$ ではなく、横磁場 $\Gamma$ を使うように注意してください。


```python
# 異なる格子サイズにおける一般的なパラメータ：
parms = []
for L in [10,12]:
    parms.append({
        'LATTICE'    : "chain lattice",
        'MODEL'      : "spin",
        'local_S'    : 0.5,
        'Jxy'        : 0,
        'Jz'         : -1,
        'Gamma'      : 0.5,
        'NUMBER_EIGENVALUES' : 5,
        'L'          : L
    })

```

ご覧のとおり、2つのシステムサイズをシミュレートします。それでは入力ファイルを設定し、シミュレーションを実行しましょう：


```python
prefix = 'ising'
input_file = pyalps.writeInputFiles(prefix,parms)
res = pyalps.runApplication('sparsediag', input_file)
# res = pyalps.runApplication('sparsediag', input_file, MPI=2, mpirun='mpirun')
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
```


共形場理論への対応付けを行うためには、各 L について基底状態と第一励起状態を計算する必要があります。
上記の読み込み操作の出力は L でソートされた階層的なリストになるため、単純にそれを反復処理すればよいです


```python
E0 = {}
E1 = {}
for Lsets in data:
    L = pyalps.flatten(Lsets)[0].props['L']
    # すべてのエネルギー値を1つの大きなリストにまとめる
    allE = []
    for q in pyalps.flatten(Lsets):
        allE += list(q.y)
    allE = np.sort(allE)
    E0[L] = allE[0]
    E1[L] = allE[1]
```

E0 を引き、ギャップで割り、1/8 を掛けます。これはイジング共形場理論において最小の非自明なスケーリング次元であることが分かっています


```python
for q in pyalps.flatten(data):
    L = q.props['L']
    q.y = (q.y-E0[L])/(E1[L]-E0[L]) * (1./8.)

spectrum = pyalps.collectXY(data, 'TOTAL_MOMENTUM', 'Energy', foreach=['L'])
```

最初のいくつかの厳密に既知のスケーリング次元をプロットします


```python
for SD in [0.125, 1, 1+0.125, 2]:
    d = pyalps.DataSet()
    d.x = np.array([0,4])
    d.y = SD+0*d.x
    # d.props['label'] = str(SD)
    spectrum += [d]

pyalps.plot.plot(spectrum)

plt.legend(prop={'size':8})
plt.xlabel("$k$")
plt.ylabel("$E_0$")

plt.xlim(-0.02, math.pi+0.02)

plt.show()

```

シミュレーションの結果を図に示します：
![Energy scaling for quantum ising model.](/figs/ed/energyscaling.png)

### 結果

臨界点（$J_z=-1$、$\Gamma=0.5$）で上記のコードを実行すると、基底状態と第一励起状態の生のエネルギーが得られます：

| $L$ | $E_0$ | $E_1$ | $E_1-E_0$ |
|---|---|---|---|
| 10 | -3.19623 | -3.15688 | 0.03935 |
| 12 | -3.83065 | -3.79788 | 0.03277 |

再スケーリング $E \rightarrow (E-E_0)/[(E_1-E_0)\times 8]$ の後、この構成によりこれら2つの状態はスケーリング次元 $0$ と $1/8$ に対応します。プロットは、残りの低エネルギースペクトルが予想値 $1$ および $1+1/8$ の近傍に収まっているかどうかを示しています。

### まとめと展望

有限サイズの臨界イジング鎖の再スケーリングされた励起スペクトルは、$c=1/2$ の共形場理論が予言するスケーリング次元 $0,\ 1/8,\ 1,\ 1+1/8$ を再現しており、この格子モデルの低エネルギーセクターに対する場の理論的な同定を裏付けています。

1. $L$ を12より大きくしていくと、共形場理論の予言との一致はどのように変化するでしょうか？
2. 臨界点から離れる（$\Gamma/J \neq 0.5$）と、スペクトルはどのように変化するでしょうか？
3. $1+1/8$ より上の次の子孫場の組のスケーリング次元を特定できますか？
