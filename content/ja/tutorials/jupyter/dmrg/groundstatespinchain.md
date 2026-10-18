---
title: スピン鎖の基底状態エネルギー
description: "スピン鎖のDMRGエネルギーに関するJupyter mdファイル"
toc: true
math: true
weight: 21
cascade:
    type: docs
---

この例では、密度行列繰り込み群（DMRG）シミュレーションを用いて、開放端境界条件を持つ32サイトのスピン1/2ハイゼンベルグ鎖の基底状態エネルギーを調べます。基底状態エネルギーの収束の様子、およびイテレーション回数の関数としての切断誤差の減衰の様子を見ていきます。

ハミルトニアンは反強磁性ハイゼンベルグ交換模型であり、[W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601)によって初めて導入されました：
$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j, \qquad J>0.
$$
DMRG自体は[S.R. White, Physical Review Letters 69, 2863-2866 (1992)](https://doi.org/10.1103/PhysRevLett.69.2863)によって導入されました。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `LATTICE` | 鎖に用いる格子 | `open chain lattice` |
| `MODEL` | ハミルトニアンのファミリー | `spin` |
| `CONSERVED_QUANTUMNUMBERS` | 基底で固定される量子数 | `N,Sz` |
| `Sz_total` | 全磁化のセクター | `0` |
| `J` | ハイゼンベルグ交換相互作用 | `1` |
| `SWEEPS` | DMRGスイープの回数 | `4` |
| `NUMBER_EIGENVALUES` | 保持する低エネルギー固有状態の数 | `1` |
| `L` | 鎖の長さ | `32` |
| `MAXSTATES` | 保持するDMRG基底状態の数 | `100` |

### 格子

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （32 サイト、開放境界条件）
```

32サイトの`open chain lattice`——これは、新しいDMRGの設定がより複雑な計算に用いる前に正しく収束することを確認するための、標準的かつ最も単純なテストケースです。他の組み込み格子については[ALPS格子ライブラリ](../../../documentation/intro/latticehowtos)を参照してください。

### 手法の選択

ヒルベルト空間全体の次元は$2^{32}\approx4.3\times10^9$であり、厳密対角化の範囲をはるかに超えています。`MAXSTATES=100`を用いたDMRGは、変分的に数回のスイープで基底状態を求めることができ、さらに——厳密対角化とは異なり——以下で検討するスイープごとの収束履歴に直接アクセスできます。

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'L'                         : 32,
        'MAXSTATES'                 : 100
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

次に、DMRGコードによって測定された基底状態の物性値を読み込みます

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))
```

そしてそれらをターミナルに出力します。

```python
for s in data[0]:
    print(s.props['observable'], ' : ', s.y[0])
```

さらに、各イテレーションステップの詳細なデータを読み込むこともできます。

```python
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                          what=['Iteration Energy','Iteration Truncation Error'])
```

これにより、DMRGアルゴリズムが最終結果へとどのように収束していったかを見ることができます。

最後に、基底状態エネルギーと切断誤差のイテレーションに対する収束をプロットします。

```python
plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('Iteration history of ground state energy (S=1/2)')
plt.ylim(-15,0)
plt.ylabel('$E_0$')
plt.xlabel('iteration')

plt.figure()
pyalps.plot.plot(iter[0][1])
plt.title('Iteration history of truncation error (S=1/2)')
plt.yscale('log')
plt.ylabel('error')
plt.xlabel('iteration')

plt.show()
```

イテレーション回数の関数としての基底状態エネルギーの収束を以下の図に示します。
![Ground State Energy](/figs/dmrg/dmrg_energy.png)

イテレーション回数の増加に伴う切断誤差の減衰の様子も見ることができます。
![Truncation Error](/figs/dmrg/dmrg_truncation.png)

### 結果

上記のコードを実行すると、収束した基底状態エネルギーとして

$$E_0 = -13.997316$$

が得られ、最終的な切断誤差は$4.4\times10^{-14}$となります——これは無視できるほど小さく、この鎖長に対して`MAXSTATES=100`で十分であることを確認しています。

### まとめと展望

DMRGは、32サイトのスピン1/2ハイゼンベルグ鎖の基底状態エネルギーを、数回のスイープで$E_0=-13.9973$へと収束させ、その切断誤差は問題のエネルギースケールよりも何桁も小さくなります。

1. 小数点以下6桁目でエネルギーの変化が止まるまでに、実際には何回のスイープが必要でしょうか。
2. 収束した$E_0/L$は、熱力学極限での厳密値（1サイトあたり$-\ln2+1/4\approx-0.4431$）とどのように比較できるでしょうか。
3. `MAXSTATES`を20に減らすと、切断誤差はどうなるでしょうか。
