---
title: スピン-1/2鎖のエネルギーギャップ
description: "DMRGによるスピン-1/2鎖のエネルギーギャップ計算のためのJupyter mdファイル"
toc: true
math: true
weight: 22
cascade:
    type: docs
---

このチュートリアルでは、DMRGシミュレーションを用いて32サイトのスピン-1/2鎖のエネルギーギャップを計算します。よく知られているように、スピン-1/2鎖のこのギャップは熱力学極限でゼロに近づきます。

ハミルトニアンは反強磁性ハイゼンベルク交換モデルであり、最初に[W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601)によって導入されました：
$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j, \qquad J>0.
$$

この計算は2つの方法で行うことができます。1つ目の方法は、同一のDMRGシミュレーション内で基底状態と第一励起状態のエネルギーを直接計算するものです。この2つのエネルギーの差がエネルギーギャップとなります。2つ目の方法は、全スピン磁化を0または1に固定することで、一重項と三重項の2つのスピンセクターにおける基底状態エネルギーをそれぞれ計算するものです。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `LATTICE` | 鎖に使用する格子 | `open chain lattice` |
| `MODEL` | ハミルトニアンの種類 | `spin` |
| `CONSERVED_QUANTUMNUMBERS` | 基底で固定される量子数 | `Sz`（方法1）、`N,Sz`（方法2） |
| `Sz_total` | 全磁化のセクター | `0`（方法1）；`0`と`1`（方法2） |
| `J` | ハイゼンベルク交換相互作用 | `1` |
| `SWEEPS` | DMRGスイープ回数 | `4` |
| `L` | 鎖の長さ | `32` |
| `MAXSTATES` | 保持するDMRG基底状態数 | `100`（方法1）、`40`（方法2） |
| `NUMBER_EIGENVALUES` | 保持する低エネルギー固有状態数 | `2`（方法1）、`1`（方法2） |

### 格子

`open chain lattice`は、すべてのボンドにハイゼンベルク交換$J$を持つ、`L=32`サイトの1次元開放鎖です：

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （32 サイト、開放境界条件）
```

周期境界ではなく開放鎖を用いるのは、保持する状態数`MAXSTATES`を固定した場合、DMRGの精度は開放境界において最も高くなるためであり、これは1次元DMRG計算における標準的な手法です。その他の組み込み格子については、[ALPS格子ライブラリ](../../../documentation/intro/latticehowtos)を参照してください。

### 手法の選択

32サイトのスピン-1/2鎖の完全なヒルベルト空間は$2^{32}\approx4.3\times10^9$個の状態からなり、厳密対角化を行うにはあまりにも大きすぎます。DMRGはこれを各ブロックあたり`MAXSTATES=100`個の変分的に最適な基底状態へと切断することで、計算を扱いやすいものにします（ここでは1回の実行が数秒程度で済みます）。この鎖長では切断誤差は無視できるほど小さく保たれます。

### 方法1：基底状態と励起状態のエネルギーの直接計算

まず必要なライブラリを読み込み、入力パラメータを準備します。


```python
import pyalps
import numpy as np

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'L'                         : 32,
        'MAXSTATES'                 : 100,
        'NUMBER_EIGENVALUES'        : 2
       } ]

```

`NUMBER_EIGENVALUES = 2`であることに注意してください。これは、シミュレーションにおいて基底状態と第一励起状態のエネルギーが保持されることを意味します。

次に入力ファイルを作成し、シミュレーションを実行します。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

最後に測定結果を読み込み、結果を出力します。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap'))

energies = np.empty(0)
for s in data[0]:
    if s.props['observable'] == 'Energy':
        energies = s.y
    else:
        print(s.props['observable'], ':', s.y[0])
energies.sort()
print('Energies:', end=' ')
for e in energies:
    print(e, end=' ')
print('\nGap:', abs(energies[1]-energies[0]))
```

### 方法2：量子数を用いる方法

よく知られているように、スピン-1/2鎖の基底状態はスピン一重項セクターに存在します。したがって、シミュレーションを磁化`Sz_total = 0`のセクターに制限すると、DMRGシミュレーションで得られる最低エネルギーはスピン-1/2鎖のスピン一重項基底状態エネルギーとなります。これは前述のシミュレーションで行ったことです。シミュレーションを磁化`Sz_total = 1`のセクターに制限すると、DMRGシミュレーションで得られる最低エネルギーはスピン三重項状態からしか得られません。もちろん、`Sz_total = 1`セクターの最低エネルギーは`Sz_total = 0`セクターの第一励起状態エネルギーと同じになります。これは、外部磁場が存在しない場合、三重項セクターの3つの部分セクター（`Sz_total = -1`、`Sz_total = 0`、`Sz_total = 1`）が縮退しているためです。

まずライブラリを読み込み、入力パラメータを準備します。


```python
import pyalps
import numpy as np

parms = []
for sz in [0,1]:
    parms.append( { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'L'                         : 32,
        'MAXSTATES'                 : 40,
        'NUMBER_EIGENVALUES'        : 1
       } )
```

ここでは`Sz_total = 0`と`Sz_total = 1`についてループを行っており、これにより以下で実行される2つのDMRGシミュレーション用の2つの入力パラメータファイルが生成されることに注意してください。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

次に測定結果を読み込み、結果を出力します。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[1]-energies[0])
```

両方の方法で得られたエネルギーとギャップを比較してみましょう。両者は一致するでしょうか。

### 結果

上記のコードを実行すると、以下のようになります：

| 方法 | エネルギー | ギャップ |
|---|---|---|
| 1（直接法） | $E_0=-13.99732$, $E_1=-13.87958$ | 0.11774 |
| 2（量子数を用いる方法） | $E(S_z=0)=-13.99732$, $E(S_z=1)=-13.87958$ | 0.11774 |

2つの方法は有効数字5桁まで一致しており、これは両者が同じ物理的ギャップを異なる方法で計算していることから予想される結果です。

### まとめと展望

32サイトの開放スピン-1/2鎖に対して、DMRGは励起ギャップとして$\Delta/J\approx0.1177$を与えます——これは有限サイズの値であり、まだ（消失する）熱力学極限のギャップではありません。$L\to\infty$に伴ってこのギャップがどのように閉じていくかについては、関連チュートリアル「エネルギーギャップの外挿」を参照してください。

1. 上記の2つの方法は異なる固有値問題を解いているにもかかわらず、なぜ全く同じギャップが得られるのでしょうか。
2. 鎖の長さを$L=64$に倍増させた場合、このギャップはどうなると予想されますか。
3. 保持する状態数`MAXSTATES`を20に減らすと、ギャップはどのように変化するでしょうか——100個の状態はすでに収束しているでしょうか。
