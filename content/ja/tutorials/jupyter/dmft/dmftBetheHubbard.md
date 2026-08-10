---
title: ベーテ格子上のハバードモデルのDMFT
description: "DMFTグリーン関数のためのJupyter mdファイル"
toc: true
math: true
weight: 31
cascade:
    type: docs
---

強相関電子系の動的平均場理論（DMFT）は、自己無撞着条件を課した量子不純物模型へ格子模型を写像することに基づいている[A. Georges, G. Kotliar, W. Krauth, and M.J. Rozenberg, Reviews of Modern Physics 68, 13-125 (1996)](https://doi.org/10.1103/RevModPhys.68.13)。この写像は、格子の配位数が大きい極限、あるいは空間次元が無限大の極限において、相関電子系の模型に対して厳密である。ベーテ格子は無限の空間次元を持つ格子の一例であり、ALPSのDMFTによってシミュレーションすることができる。

### ベーテ格子
下図にベーテ格子の例を示す。各格子点の配位数は3である。この格子の実効次元は無限大である。したがって、このような格子上でDMFTを実装する絶好の機会となり、DMFT法のベンチマークや探索を行うことができる。
![Bethe Lattice](/figs/dmft/betheLattice.png)

### ハバードモデル
ここでは、ベーテ格子上に定義されたハバードモデルをDMFTでシミュレーションする。ハバードモデルは以下のように定義される。
$$
H = -t \sum_{\langle i,j \rangle, \sigma} \left( c_{i,\sigma}^\dagger c_{j,\sigma} + \text{h.c.} \right) + U \sum_i n_{i,\uparrow} n_{i,\downarrow},
$$

ここで、

- $c_{i,\sigma}^\dagger$ と $c_{i,\sigma}$ は、格子点$i$におけるフレーバー$\sigma$（アップ$\uparrow$またはダウン$\downarrow$）を持つフェルミオンの生成・消滅演算子であり、$\text{h.c.}$はエルミート共役を表す。
- $t$ は隣接格子点$\langle i,j \rangle$間のホッピング振幅である。
- $U$ はオンサイト相互作用エネルギーであり、$U > 0$は斥力相互作用に対応する。
- $n_{i,\sigma} = c_{i,\sigma}^\dagger c_{i,\sigma}$ は格子点$i$におけるフレーバー$\sigma$のフェルミオンの数演算子である。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `SOLVER` | 不純物ソルバーのアルゴリズム | `Interaction Expansion` (CT-INT QMC) |
| `U` | オンサイトのハバード斥力 | `3` |
| `t` | ホッピング振幅（ベーテ格子用に再スケール） | `0.707106781...` ($=1/\sqrt{2}$) |
| `BETA` | 逆温度 $1/T$ | `6` (高温$T$), `12` (低温$T$) |
| `MU` | 化学ポテンシャル（半充填） | `0` |
| `FLAVORS` | フェルミオンのフレーバー数（スピンアップ/ダウン） | `2` |
| `SITES` | 不純物格子点数 | `1` |
| `ANTIFERROMAGNET` | 対称性の破れた反強磁性解を許可 | `1` |
| `H_INIT` | 反強磁性状態の種となる初期対称性破れ場 | `0.05` |
| `N`, `NMATSUBARA` | 虚時間・松原振動数点の数 | `500` |
| `SWEEPS`, `THERMALIZATION` | モンテカルロのスイープ数と熱化ステップ数 | `1e8`, `1000` |
| `MAX_IT`, `MAX_TIME` | DMFT自己無撞着反復回数、反復ごとの実時間上限（秒） | `10`, `10` |
| `CONVERGED` | 自己無撞着の収束閾値 | `0.005` |

### 格子

```
        o   o
         \ /
      o---o---o        各サイトは z=3 個の隣接サイトを持ち、
         / \            ループのない木構造で接続される
        o   o            → ベーテ格子、配位数 z=3
```

ベーテ格子（無限でループのない木構造）が用いられるのは、配位数が無限大の極限においてDMFTが数値的に*厳密*となる最も単純な格子だからである——局所グリーン関数に対する自己無撞着条件は、`pyalps.runDMFT`が内部で用いる単純な半円形状態密度の関係式に帰着し、ホッピング$t$は$1/\sqrt{z}$でリスケールされる（そのため無限$z$極限での実効配位数に対して`t=1/sqrt(2)`となる）ことでバンド幅が有限に保たれる。DMFTが近似となる有限次元格子については、[ALPS格子ライブラリ](../../../documentation/intro/latticehowtos)を参照のこと。

### 手法の選択

ED/DMRGのチュートリアルとは異なり、ここでの局所不純物問題は確率的に解かれる：`Interaction Expansion`連続時間量子モンテカルロ（CT-INT）ソルバーは、ハミルトニアンを対角化するのではなく、$U$のべき級数の図形をサンプリングする。これにより、（打ち切るべき有限次元のヒルベルト空間を持たない）真に無限配位数のベーテ格子に到達することが可能になる。`MAX_TIME=10`は、名目上の`SWEEPS=1e8`にかかわらず、各DMFT反復のQMCサンプリング時間を10秒に制限するため、両方の温度に対する`MAX_IT=10`回の自己無撞着ループ全体が数分で完了する。

### シミュレーション
まず、必要なモジュールをインポートする。


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
```

次に、入力ファイルをPython辞書のリストとして準備する。


```python
parms=[]
for b in [6., 12.]: 
    parms.append(
            {                         
              'ANTIFERROMAGNET'         : 1,
              'CONVERGED'               : 0.005,
              'FLAVORS'                 : 2,
              'H'                       : 0,
              'H_INIT'                  : 0.05,
              'MAX_IT'                  : 10,
              'MAX_TIME'                : 10,
              'MU'                      : 0,
              'N'                       : 500,
              'NMATSUBARA'              : 500, 
              'OMEGA_LOOP'              : 1,
              'SEED'                    : 0, 
              'SITES'                   : 1,
              'SOLVER'                  : 'Interaction Expansion',
              'SYMMETRIZATION'          : 0,
              'U'                       : 3,
              't'                       : 0.707106781186547,
              'SWEEPS'                  : 100000000,
              'THERMALIZATION'          : 1000,
              'ALPHA'                   : -0.01,
              'HISTOGRAM_MEASUREMENT'   : 1,
              'BETA'                    : b
            }
        )
```

パラメータ「BETA」は逆温度を表しており、ここでは2つの異なる温度、すなわち高温の「BETA = 6」と低温の「BETA = 12」でシステムをシミュレーションする。続いて入力ファイルを書き出し、シミュレーションを実行する。


```python
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

次に、シミュレーションの結果を読み込む。


```python
listobs=['0', '1']
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
```

最後に、単一粒子グリーン関数$G$の虚時間$\tau$依存性をプロットし、それを表示する。


```python
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title("Green's Function vs. the Imaginary Time")
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

シミュレーションで得られるグラフは以下のようになるはずである：
![green fucntion gtau](/figs/dmft/greenTau.png)

この結果は、ベーテ格子上のハバードモデルにおけるネール転移を示しており、システムは低温（「BETA = 12」）での反強磁性状態から高温（「BETA = 6」）での常磁性状態へと転移する。

### 結果

上記のコードを実行して得られた、虚時間区間の両端における単一粒子グリーン関数：

| $\beta$ | フレーバー | $G(\tau=0)$ | $G(\tau=\beta/2)$ |
|---|---|---|---|
| 6 | 0 (↑) | -0.4868 | -0.0759 |
| 6 | 1 (↓) | -0.5132 | -0.0776 |
| 12 | 0 (↑) | -0.8932 | -0.0039 |
| 12 | 1 (↓) | -0.1066 | -0.0037 |

$\beta=6$では、2つのスピンフレーバーはほぼ対称であり（$-0.487$対$-0.513$）——これは常磁性解である。$\beta=12$では、フレーバーが強く分裂しており（$-0.893$対$-0.107$）——反強磁性対称性破れ場`H_INIT`が頑健なスタッガード磁化へと成長したことを示しており、冷却に伴いシステムが反強磁性秩序相へと移行したことを意味する。

### まとめと展望

ベーテ格子上のDMFTは、半充填ハバードモデルが高温（$\beta=6$）での常磁性解から低温（$\beta=12$）での磁気秩序（ネール）解へと移行することを示しており、これは2つのスピンフレーバーのグリーン関数の分裂に直接現れている。

1. 6から12の間のどの$\beta$の値で、2つのフレーバー間の分裂が最初に顕著になるか——ネール転移温度の範囲を絞り込めるだろうか。
2. 相互作用$U$を3から6に増加させると、転移温度はどのように変化するか。
3. `maxent`を用いて局所状態密度をさらに計算した場合、常磁性相においてどのような結果が予想されるか。
