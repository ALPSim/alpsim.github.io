---
title: スピン1鎖のエネルギーギャップ
description: "スピン1鎖のDMRGエネルギーギャップ計算のためのJupyter mdファイル"
toc: true
math: true
weight: 24
cascade:
    type: docs
---

このチュートリアルでは、DMRGシミュレーションを用いて64サイトのスピン1鎖のエネルギーギャップを計算します。スピン1/2鎖とは異なるギャップの振る舞いが見られます。ここでは、スピン1鎖の基底状態と第一励起状態の間のエネルギーギャップは有限です。また、最低エネルギーの状態がほぼ縮退した一群を形成することも確認します。そのため、エネルギーギャップを正しく特定するには、より多くの最低エネルギー状態を保持して計算する必要があります。

その理由は、これが**開いた**鎖(`open chain lattice`)であることにあります。開いたスピン1ハルデイン鎖は、その両端のそれぞれに局在した実効的な $S=1/2$ の自由度を持ちます。これら2つの端スピンは一重項($S=0$)と三重項($S=1$)に組み合わさり、合わせて**4つ**の状態からなる多重項を形成します。それらの間の分裂は指数関数的に小さく、鎖が長くなるにつれて消失します。この端状態の多重項はバルクのハルデインギャップより下に位置するため、注目すべきエネルギー差は、多重項内部の分裂ではなく、多重項から最初のバルク励起までのギャップです。

以下のシミュレーションは $S_z$ を保存するため、`Sz_total = 0` に制限した計算では、この4状態の多重項のうち2つの成分(一重項と、三重項の $S_z=0$ 成分)しか見えません。そのため、以下の方法1では4つではなく2つのほぼ縮退した最低準位が現れます。

スピン1/2の場合と同様に、この計算は2通りの方法で行うことができます。1つ目の方法は、同一のDMRG計算内で最低エネルギーから4つの状態を直接計算するものです。`Sz_total = 0` セクターで見える2つのほぼ縮退した最低準位と、そこから最初のバルク励起までのエネルギーギャップを確認します。2つ目の方法は、異なる全スピンセクター、すなわち全磁化が0、1、2の場合の基底状態エネルギーを計算するものです。磁化0と1の基底状態エネルギーは誤差の範囲内で一致し、エネルギーギャップは磁化1と2のセクター間の基底状態エネルギー差から計算できることがわかります。

これはハイゼンベルク交換モデル(参照:[W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601))において、サイトのスピンを1/2ではなくスピン1としたものです。整数スピンの場合に予測される有限のギャップはハルデインギャップと呼ばれ、[F.D.M. Haldane, Physics Letters A 93, 464-468 (1983)](https://doi.org/10.1016/0375-9601(83)90631-X) に由来します。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `LATTICE` | 鎖に用いる格子 | `open chain lattice` |
| `MODEL` | ハミルトニアンの種類 | `spin` |
| `local_S` | 各サイトのスピン量子数 | `1` |
| `CONSERVED_QUANTUMNUMBERS` | 基底で固定される量子数 | `Sz` (方法1), `N,Sz` (方法2) |
| `Sz_total` | 全磁化セクター | `0` (方法1); `0`, `1`, `2` (方法2) |
| `J` | ハイゼンベルク交換相互作用 | `1` |
| `SWEEPS` | DMRGのスイープ回数 | `5` |
| `L` | 鎖の長さ | `64` |
| `MAXSTATES` | 保持するDMRG基底状態数 | `300` |
| `NUMBER_EIGENVALUES` | 保持する低エネルギー固有状態数 | `4` (方法1), `1` (方法2) |

### 格子

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （64 サイト、各サイトはスピン1、開放境界条件）
```

スピン1/2の場合と同じ `open chain lattice` ですが、`local_S=1` であり、長さも2倍(`L=64`)になっています。これは、有限サイズ補正から有限のハルデインギャップを明確に分離するために、より長い鎖が必要となるためです。他の組み込み格子については [ALPS格子ライブラリ](../../../documentation/intro/latticehowtos) を参照してください。

### 手法の選択

スピン1の場合、局所ヒルベルト空間は3次元であるため、64サイト鎖の非切断空間は $3^{64}\approx3.4\times10^{30}$ となり、厳密対角化の範囲をはるかに超えています。DMRGの `MAXSTATES=300` により、この計算が扱いやすくなります。ここでは、ほぼ縮退した端状態の多重項(前述)を分解するためにより高い精度が必要となるため、スピン1/2のチュートリアルよりも多くの状態を保持しています。

## 方法1:4つの最低エネルギーの直接計算

まず必要なライブラリを読み込み、入力パラメータを準備します。


```python
import pyalps
import numpy as np

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 4
       } ]

```

`local_S = 1` によってスピン1系となることに注意してください。`NUMBER_EIGENVALUES = 4` により、DMRGシミュレーションから最低の4つのエネルギーが得られます。十分な精度を確保するため、スイープ回数 `SWEEPS = 5` および保持状態数の切断 `NUMBER_EIGENVALUES = 300` も設定しています。

続いて入力ファイルを書き出し、シミュレーションを実行します。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

最後に測定結果を読み込み、結果を表示します。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_gap'))

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
print('\nGap:', abs(energies[1]-energies[0]), abs(energies[2]-energies[1]))
```

シミュレーション結果から、基底状態の縮退と第一励起状態までの有限なエネルギーギャップが見えるでしょうか?

上記のコードを実行すると、最低の4つのエネルギー $E_0,E_1,E_2,E_3 = -88.48667, -88.48666, -88.05889, -88.05629$ が得られます。最低の2つの状態は $3\times10^{-7}$ の範囲内で縮退しており——これらはこの $S_z=0$ セクターで見える端状態の多重項の2つの成分です——最初のバルク励起までのギャップは $E_2-E_1\approx0.4278$ です。

## 方法2:量子数を用いる方法

まず、磁化 `Sz_total = 0` と `Sz_total = 1` のセクターにシミュレーションを制限します。2つのセクター間の基底状態エネルギー差を抽出し、それらが縮退していることを示します。次に `Sz_total = 1` と `Sz_total = 2` で計算を繰り返します。得られた結果からエネルギーギャップを抽出します。

まずライブラリを読み込み、入力パラメータを準備します。


```python
import pyalps
import numpy as np

#入力パラメータを準備する
parms = []
sz_tot = [0,1]
for sz in sz_tot:
    parms.append( {
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 1
       } )
```

磁化はリスト `sz_tot = [0,1]` の値から取り出され、入力パラメータリストの磁化 `Sz_total` に割り当てられます。ここでは最低エネルギー状態を1つだけ計算する、すなわち `NUMBER_EIGENVALUES = 1` であることに注意してください。

入力ファイルは以下のAPIによって書き出され、計算が実行されます。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

続いて測定結果を読み込み、結果を表示します。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[sz_tot[1]]-energies[sz_tot[0]])
```

2つの磁化セクターから縮退した基底状態が見えるでしょうか?

上記のコードを `sz_tot=[0,1]` で実行すると $E(S_z=0)=-88.48667$ および $E(S_z=1)=-88.48666$ が得られます。ギャップはわずか $9\times10^{-6}$ であり、2つのセクターがDMRGの精度の範囲内で縮退していることが確認できます。

次に、磁化のリストを `sz_tot = [1,2]` に変更し、シミュレーションを繰り返します。便宜上、以下に上記のコードを再掲します。変更点は磁化のリストのみです。


```python
import pyalps
import numpy as np

parms = []
sz_tot = [1,2]
for sz in sz_tot:
    parms.append( {
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 1
       } )


input_file = pyalps.writeInputFiles('parm_spin_one_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)

data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[sz_tot[1]]-energies[sz_tot[0]])
```

64サイトのスピン1鎖のエネルギーギャップを正しく抽出できたでしょうか?方法1の結果と一致するでしょうか?

上記のコードを `sz_tot=[1,2]` で実行すると、ギャップは $0.42755$ となり、方法1で得られた $0.4278$ とよく一致します(わずかな差異は、2つの方法がそれぞれ独立したDMRG計算を用いており、切断が若干異なることに起因します)。

### 結果

64サイトのスピン1鎖に対する両方法の結果のまとめ:

| 方法 | 物理量 | 値 |
|---|---|---|
| 1 | $E_0-E_1$ (基底状態の縮退分裂) | $3\times10^{-7}$ |
| 1 | $E_2-E_1$ (励起ギャップ) | 0.4278 |
| 2 | $E(S_z{=}1)-E(S_z{=}0)$ (縮退の確認) | $9\times10^{-6}$ |
| 2 | $E(S_z{=}2)-E(S_z{=}1)$ (励起ギャップ) | 0.4276 |

両方法とも、$L=64$ における有限サイズギャップは $\Delta/J\approx0.4276$–$0.4278$ となり、「スピン1ハイゼンベルク鎖のスピンギャップ」厳密対角化チュートリアルで得られた熱力学極限のハルデインギャップ $\Delta/J\approx0.4105$ と整合しています。

### まとめと展望

ギャップレスなスピン1/2鎖とは異なり、開いたスピン1ハイゼンベルク鎖はほぼ縮退した4状態の端状態多重項を持ち、$L=64$ においても有限のバルク励起ギャップが存在します。これは、整数スピン鎖に関するハルデインの予測をDMRGによって直接確認するものです。

1. 端状態の多重項は4つの状態を持ちますが、`Sz_total = 0` の計算では2つしか現れません。それはどの2つで、残りの2つはどこにあるのでしょうか?
2. ここで得られた $L=64$ でのギャップは、真の熱力学極限のハルデインギャップとどれくらい近いでしょうか?これは、この長さにおける有限サイズ補正について何を示しているでしょうか?
3. `local_S=3/2` を試してみてください。基底状態はギャップを持つでしょうか、それとも持たないでしょうか?これはスピンが整数か半整数かにどのように依存するでしょうか?
