---
title: 1次元量子系のスペクトル
description: "1次元スペクトル用のJupyter mdファイル"
toc: true
math: true
weight: 13
cascade:
    type: docs
---

このチュートリアルでは、様々な1次元格子上の量子ハイゼンベルグモデルのエネルギースペクトルを計算します。主な計算は `sparsediag` アプリケーションによって行われます。これは反復固有値解法であるランチョス法を実装しており、異なる運動量セクターにおけるエネルギーを求めます。得られたデータをプロットし、様々な1次元格子上での1次元量子ハイゼンベルグモデルのエネルギー-運動量スペクトルを示します。

### ハイゼンベルグ鎖

#### はじめに

スピン1/2ハイゼンベルグ鎖のハミルトニアンは、[W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601) によって最初に導入され、次式で与えられます。

$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j,
$$

ここで、$J>0$ は最近接スピン $\mathbf{S}^i$ と $\mathbf{S}^j$ の間の反強磁性相互作用に対応し、スピン間相互作用は次の3つの成分から構成されます。

$$
\mathbf{S}^i \cdot \mathbf{S}^j=S^i_xS^j_x+S^i_yS^j_y+S^i_zS^j_z.
$$

基底ベクトルとして通常選ばれるのは $S_z$ 演算子の固有状態です。スピン1/2系の場合、各格子サイトには $|-1/2\rangle$ と $|+1/2\rangle$ という2つの基底ベクトルがあります。これらの基底ベクトルに対する $S_x$ と $S_y$ 演算子の作用は、上昇演算子 $S^{\dagger}$ と下降演算子 $S^{-}$ を用いて次のように表すことができます。

$$
S_x=\frac{1}{2}(S^{\dagger}+S^{-}),
$$

$$
S_y=\frac{1}{2i}(S^{\dagger}-S^{-}),
$$

これらは基底ベクトルに対して次のように作用します。

$$
S^{\dagger}|s\rangle = \sqrt{S(S+1)-s(s+1)}|s+1\rangle,
$$

$$
S^{-}|s\rangle = \sqrt{S(S+1)-s(s-1)}|s-1\rangle,
$$

ここで、$S=1/2$、$s=-1/2, 1/2$ です。

各格子サイトについての上記の基底ベクトルを用いると、ハミルトニアンはエルミート行列として表すことができます。全磁化を固定する、すなわちシミュレーションにおいて Sz_total = 0（一重項セクター）または Sz_total = 1（三重項セクター）と設定することで、行列のサイズを縮小することができます。ハミルトニアン行列のサイズをさらに縮小し、エネルギースペクトルの運動量依存性を得るために、シミュレーションを異なる格子運動量セクター $P=0, 1, 2, \cdots$ にさらに制限することができます。 

**パラメータ：** `LATTICE="chain lattice"`、`MODEL="spin"`、`local_S=0.5`、`J=1`、`CONSERVED_QUANTUMNUMBERS="Sz"`、`Sz_total=0`、および `L=10,12,14,16`。

**格子：**
```
   J     J     J           J
o-----o-----o-----o-- ... --o     （周期鎖、L サイト、各ボンドの結合は J）
```

**手法の選択：** ヒルベルト空間の次元は $2^L$ であり、最大サイズでは $2^{16}=65536$ となります——これは十分小さく、`sparsediag` のランチョス法があらゆる $(S_z, P)$ セクターの完全な低エネルギースペクトルを数秒で求めることができます。

#### シミュレーション

ハイゼンベルグ鎖のエネルギースペクトルを得るために、以下の手順に従います。

まず、必要なモジュールをインポートします。

```python
import pyalps
import numpy as np
import matplotlib as plt
import pyalps.plot
```

4種類の異なる格子サイズ $L=10, 12, 14$、および $16$ に対して入力パラメータを準備します。

```python
parms=[]
for l in [10, 12, 14, 16]:
    parms.append(
      { 
        'LATTICE'                   : "chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : 0.5,
        'J'                         : 1,
        'L'                         : l,
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0
      }
    )
```

入力ファイルを書き込み、シミュレーションを実行します。

```python
input_file = pyalps.writeInputFiles('parm_chain',parms)
res = pyalps.runApplication('sparsediag',input_file)
```

全ての状態の全ての測定結果を読み込み、各シミュレーションについて全ての運動量にわたるスペクトルを収集します。

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm_chain'))

spectra = {}
for sim in data:
  l = int(sim[0].props['L'])
  all_energies = []
  spectrum = pyalps.DataSet()
  for sec in sim:
    all_energies += list(sec.y)
    spectrum.x = np.concatenate((spectrum.x,np.array([sec.props['TOTAL_MOMENTUM'] for i in range(len(sec.y))])))
    spectrum.y = np.concatenate((spectrum.y,sec.y))
  spectrum.y -= np.min(all_energies)
  spectrum.props['line'] = 'scatter'
  spectrum.props['label'] = 'L='+str(l)
  spectra[l] = spectrum
```

エネルギー対運動量のスペクトルをプロットします。

```python
plt.pyplot.figure()
pyalps.plot.plot(spectra.values())
plt.pyplot.legend()
plt.pyplot.title('Antiferromagnetic Heisenberg chain (S=1/2)')
plt.pyplot.ylabel('Energy')
plt.pyplot.xlabel('Momentum')
plt.pyplot.xlim(0,2*3.1416)
plt.pyplot.ylim(0,2)
plt.pyplot.show()

```

以下は1次元ハイゼンベルグ鎖のエネルギースペクトルです。
![Energy spectrum Heisenberg chain](/figs/ed/spectrumchain.png)

### 二本足ハイゼンベルグ梯子

#### はじめに

二本足スピン1/2ハイゼンベルグ鎖のハミルトニアンは次式で与えられます。

$$
H = J_0\sum_{\langle \alpha i,\alpha j \rangle} \mathbf{S}^{\alpha i} \cdot \mathbf{S}^{\alpha j} + J_1\sum_{\langle 1 i,2 i \rangle} \mathbf{S}^{1 i} \cdot \mathbf{S}^{2 i},
$$

ここで、$\alpha=1,2$ は2本の足（鎖）を表し、$i,j=1,2,\cdots,L$ は鎖内の格子サイトを示します。$J_0>0$ は同じ鎖内の最近接スピン $\mathbf{S}^{\alpha i}$ と $\mathbf{S}^{\alpha j}$ の間の鎖内反強磁性相互作用であり、$J_1>0$ は最初の足の $\mathbf{S}^{1 i}$ と2番目の足の $\mathbf{S}^{2 i}$（$i=1,2,\cdots,L$）の間の鎖間スピン結合です。 

**パラメータ：** `LATTICE="ladder"`、`MODEL="spin"`、`local_S=0.5`、`J0=1`、`J1=1`、`CONSERVED_QUANTUMNUMBERS="Sz"`、`Sz_total=0`、および `L=6,8,10`。

**格子：**
```
o--J0--o--J0--o    （第 1 レッグ）
|      |      |
J1     J1     J1
|      |      |
o--J0--o--J0--o    （第 2 レッグ、全 L ラング）
```

**手法の選択：** 梯子は $2L$ 個のサイトを持つため、ヒルベルト空間の次元は $2^{2L}$ となり、$L=10$ では $2^{20}\approx10^6$ になります——$S_z=0$ の制限を適用すれば、これは依然として `sparsediag` のランチョス法の求解可能な範囲内です。

#### シミュレーション

まず、必要なモジュールをインポートします。

```python
import pyalps
import numpy as np
import matplotlib as plt
import pyalps.plot
```

鎖内相互作用と鎖間相互作用 J0 および J1 の値、そして鎖長 L=6、8、10 を設定して、入力パラメータを準備します。

```python
parms=[]
for l in [6, 8, 10]:
    parms.append(
      { 
        'LATTICE'                   : "ladder", 
        'MODEL'                     : "spin",
        'local_S'                   : 0.5,
        'J0'                        : 1,
        'J1'                        : 1,
        'L'                         : l,
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0
      }
    )

```

入力ファイルを書き込み、シミュレーションを実行します

```python
input_file = pyalps.writeInputFiles('parm_ladder',parms)
res = pyalps.runApplication('sparsediag',input_file)
```

全ての状態の全ての測定結果を読み込み、各シミュレーションについて全ての運動量にわたるスペクトルを収集します。

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm_ladder'))

spectra = {}
for sim in data:
  l = int(sim[0].props['L'])
  all_energies = []
  spectrum = pyalps.DataSet()
  for sec in sim:
    all_energies += list(sec.y)
    spectrum.x = np.concatenate((spectrum.x,np.array([sec.props['TOTAL_MOMENTUM'] for i in range(len(sec.y))])))
    spectrum.y = np.concatenate((spectrum.y,sec.y))
  spectrum.y -= np.min(all_energies)
  spectrum.props['line'] = 'scatter'
  spectrum.props['label'] = 'L='+str(l)
  spectra[l] = spectrum
```

エネルギースペクトルをプロットします。

```python
plt.pyplot.figure()
pyalps.plot.plot(spectra.values())
plt.pyplot.legend()
plt.pyplot.title('Antiferromagnetic Heisenberg ladder (S=1/2)')
plt.pyplot.ylabel('Energy')
plt.pyplot.xlabel('Momentum')
plt.pyplot.xlim(0,2*3.1416)
plt.pyplot.ylim(0,2.5)
plt.pyplot.show()
```

以下はハイゼンベルグ梯子のエネルギースペクトルを示しています。
![Energy spectrum Heisenberg ladder](/figs/ed/spectrumladder.png)

### 孤立二量体

#### はじめに

3番目のシミュレーションでは、前の場合と同じハミルトニアンから出発します。

$$
H = J_0\sum_{\langle \alpha i,\alpha j \rangle} \mathbf{S}^{\alpha i} \cdot \mathbf{S}^{\alpha j} + J_1\sum_{\langle 1 i,2 i \rangle} \mathbf{S}^{1 i} \cdot \mathbf{S}^{2 i},
$$

ここで、$\alpha=1,2$ は2本の足（鎖）を表し、$i,j=1,2,\cdots,L$ は鎖内の格子サイトを示します。ここで $J_0=0$ とし、すなわち最近接スピン間の鎖内相互作用をなくし、$J_1=1$ は $\mathbf{S}^{1 i}$ と $\mathbf{S}^{2 i}$（$i=1,2,\cdots,L$）の間の鎖間スピン結合とします。この結果、系は $L$ 個の孤立二量体となります。 

**パラメータ：** 上記と同じ `ladder` 格子と `spin` モデルですが、`J0=0`（両足が非結合）および `J1=1` とし、`L=6,8,10` です。

**格子：**
```
o      o      o
|      |      |
J1     J1     J1     （J0 = 0：レッグ間ボンドなし → L 個の独立した二量体）
|      |      |
o      o      o
```

**手法の選択：** $J_0=0$ とすることで、梯子は $L$ 個の独立した2サイト二量体に分離されるため、厳密なスペクトルは解析的に知られています（各二量体は $E=-3J_1/4$ の一重項と $E=J_1/4$ の三重項を与えます）。この場合は、上記の結合梯子に対する `sparsediag` の結果を検証するための健全性チェックとして含まれています。

#### シミュレーション

まず、必要なモジュールをインポートします。

```python
import pyalps
import numpy as np
import matplotlib as plt
import pyalps.plot
```

入力パラメータを準備します。

```python
parms=[]
for l in [6, 8, 10]:
    parms.append(
      { 
        'LATTICE'                   : "ladder", 
        'MODEL'                     : "spin",
        'local_S'                   : 0.5,
        'J0'                        : 0,
        'J1'                        : 1,
        'L'                         : l,
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0
      }
    )
```

入力ファイルを書き込み、シミュレーションを実行します。

```python
input_file = pyalps.writeInputFiles('parm_dimers',parms)
res = pyalps.runApplication('sparsediag',input_file)
```

全ての状態の全ての測定結果を読み込みます。

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm_dimers'))
```

各シミュレーションについて、全ての運動量にわたるスペクトルを収集します。

```python
spectra = {}
for sim in data:
  l = int(sim[0].props['L'])
  all_energies = []
  spectrum = pyalps.DataSet()
  for sec in sim:
    all_energies += list(sec.y)
    spectrum.x = np.concatenate((spectrum.x,np.array([sec.props['TOTAL_MOMENTUM'] for i in range(len(sec.y))])))
    spectrum.y = np.concatenate((spectrum.y,sec.y))
  spectrum.y -= np.min(all_energies)
  spectrum.props['line'] = 'scatter'
  spectrum.props['label'] = 'L='+str(l)
  spectra[l] = spectrum

```

次に、エネルギースペクトルをプロットします。

```python
plt.pyplot.figure()
pyalps.plot.plot(spectra.values())
plt.pyplot.legend()
plt.pyplot.title('Isolated antiferromagnetic S=1/2 dimers')
plt.pyplot.ylabel('Energy')
plt.pyplot.xlabel('Momentum')
plt.pyplot.xlim(0,2*3.1416)
plt.pyplot.ylim(0,2.5)
plt.pyplot.show()
```

以下にハイゼンベルグ二量体のエネルギースペクトルを示します。
![Energy spectrum of isolated Heisenberg dimers](/figs/ed/spectrumisolateddimers.png)

### 結果

上記のコードを実行して得られた基底状態のエネルギーと第一励起状態へのエネルギーギャップ：

| 系 | $L$ | $E_0$ | $E_0/L$ | $E_1$ へのギャップ |
|---|---|---|---|---|
| 鎖 | 10 | -4.51545 | -0.45154 | 0.42324 |
| 鎖 | 12 | -5.38739 | -0.44895 | 0.35585 |
| 鎖 | 14 | -6.26355 | -0.44740 | 0.30711 |
| 鎖 | 16 | -7.14230 | -0.44639 | 0.27019 |
| 梯子 | 6 | -7.01325 | -0.58444 | 0.62657 |
| 梯子 | 8 | -9.28325 | -0.58020 | 0.55740 |
| 梯子 | 10 | -11.57719 | -0.57772 | 0.52811 |
| 二量体 | 6 | -4.50000 | -0.75000 | 1.00000 |
| 二量体 | 8 | -6.00000 | -0.75000 | 1.00000 |
| 二量体 | 10 | -7.50000 | -0.75000 | 1.00000 |

鎖の $E_0/L$ は $L$ が大きくなるにつれて、厳密な熱力学極限値 $-\ln2+1/4\approx-0.4431$ に近づいていきます。また、孤立二量体の場合は、機械精度で厳密な解析結果 $E_0/L=-3J_1/4=-0.75$ とギャップ $=J_1=1$ を再現しており、これはその中間にある梯子の結果（$J_0=J_1=1$）が信頼できることを確認する有用な検証となっています。

### まとめと展望

有限1次元格子における厳密対角化は、ハイゼンベルグ鎖に期待されるギャップレススペクトル、二本足梯子におけるより大きなスピンギャップ（これは追加の鎖間結合の結果です）、そして本稿でベンチマークとして用いた厳密に解ける孤立二量体極限を再現します。

1. 孤立鎖極限から $J_1/J_0$ を増加させていくと、梯子のギャップはどの時点で孤立二量体の値 $J_1$ に近づきますか？
2. 3本足梯子の場合、運動量分解されたスペクトルはどのように変化すると予想されますか？
3. 2サイトハイゼンベルグハミルトニアンから孤立二量体の結果を解析的に検証できますか？
