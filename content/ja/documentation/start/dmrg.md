---
title: 密度行列繰り込み群法
linkTitle: 密度行列繰り込み群法
description: "ALPSの使用方法"
weight: 7
math: true
---

この例では、密度行列繰り込み群法（DMRG）シミュレーションを使用して、開境界条件を持つ32サイトのスピン1/2ハイゼンベルグチェーンの基底状態エネルギーを研究します。反復回数の関数として、基底状態エネルギーの収束と切り捨て誤差の減衰を観察します。

まず必要なライブラリをインポートし、シミュレーションパラメータを設定します。

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

parms = [ { 
        'LATTICE'                   : "open chain lattice",  # 開境界チェーン格子
        'MODEL'                     : "spin",                # スピンモデル
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',                # 保存量
        'Sz_total'                  : 0,                     # 全スピンz成分
        'J'                         : 1,                     # 交換相互作用
        'SWEEPS'                    : 4,                     # スイープ数
        'NUMBER_EIGENVALUES'        : 1,                     # 固有値数
        'L'                         : 32,                    # サイト数
        'MAXSTATES'                 : 100                    # 最大状態数
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

実行するには、ターミナルで以下を入力します：

```
python spin_one_half.py
```

次に、DMRGコードで測定された基底状態の特性を読み込みます：

```
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))
```

結果をターミナルに出力します：

```
for s in data[0]:
    print(s.props['observable'], ' : ', s.y[0])
```

さらに、各反復ステップの詳細データを読み込めます：

```
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                          what=['Iteration Energy','Iteration Truncation Error'])
```

これにより、DMRGアルゴリズムが最終結果にどのように収束したかを確認できます。
最後に、反復回数の関数として各種量の収束をプロットします：

```
plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('基底状態エネルギーの反復履歴 (S=1/2)')
plt.ylim(-15,0)
plt.ylabel('$E_0$')
plt.xlabel('反復回数')

plt.figure()
pyalps.plot.plot(iter[0][1])
plt.title('切り捨て誤差の反復履歴 (S=1/2)')
plt.yscale('log')
plt.ylabel('誤差')
plt.xlabel('反復回数')

plt.show()
```

反復回数に対する基底状態エネルギーの収束は以下の図のようになります：

![Ground State Energy](/figs/dmrg_energy.png)

反復回数の増加に伴う切り捨て誤差の減衰も確認できます：

![Truncation Error](/figs/dmrg_truncation.png)


