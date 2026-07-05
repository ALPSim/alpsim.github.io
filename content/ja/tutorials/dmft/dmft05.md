
---
title: DMFT-05 OSMT
math: true
toc: true
---

## Orbitally Selective Mott Transition

多軌道模型における興味深い現象の一つが、軌道選択的モット転移です。これは [Anisimov らによって、Eur. Phys. J. B 25, 191 (2002)](https://doi.org/10.1140/epjb/e20020021) で最初に調べられました。この変種である*運動量選択的*モット転移は、擬ギャップ物理のクラスター表示として、最近の[クラスター計算](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.045120)で議論されています。

軌道選択的モット転移では、ドーピングや相互作用の関数として、関与する軌道の一部がモット絶縁体になる一方で、残りは金属的なままです。

最小模型として、幅の広いバンドと幅の狭いバンドという2つのバンドを考えます。軌道内クーロン反発 $U$ に加えて、$U' = U-2J$ を満たす相互作用 $U'$ と $J$ を考えます。ここではイジング的な相互作用に限定します。これは実際の化合物にとってはしばしば問題となる単純化です。

### シミュレーションの実行

ここでは、2つのバンド幅を $t_0=0.5$、$t_1=1$ とし、密度-密度型の相互作用を $U'=U/2$、$J=U/4$ とした場合を、$U$ を $1.8$ から $2.8$ の間で変化させて考えます。$U=1.8$ では両方の軌道でフェルミ液体的な振る舞いが見られ、$U=2.2$ では軌道選択的になり、$U=2.8$ では両方の軌道が絶縁的になります。

シミュレーションを実行するための python コマンドは [`tutorial5a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5a.py) にあります。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u,j in [[1.8,0.45],[2.2,0.55],[2.8,0.7]]:
    parms.append(
            { 
              'CONVERGED'           : 0.001,
              'FLAVORS'             : 4,
              'H'                   : 0,
              'H_INIT'              : 0.,
              'MAX_IT'              : 15,
              'MAX_TIME'            : 600,
              'MU'                  : 0,
              'N'                   : 500,
              'NMATSUBARA'          : 500,
              'N_MEAS'              : 2000,
              'N_ORDER'             : 50,
              'SEED'                : 0,
              'SOLVER'              : 'hybridization',
              'SC_WRITE_DELTA'      : 1,
              'SYMMETRIZATION'      : 1,
              'SWEEPS'              : 10000,
              'BETA'                : 30,
              'THERMALIZATION'      : 500,
              'U'                   : u,
              'J'                   : j,
              't0'                  : 0.5,
              't1'                  : 1,
              'CHECKPOINT'          : 'dump'
        }
        )

# For more precise calculations we propose to enhance the SWEEPS

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_u_'+str(p['U'])+'_j_'+str(p['J']),p)
    res = pyalps.runDMFT(input_file)
```

同じサンプルパラメータを用いた論文は[こちら](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.72.081103)にあります。

### 結果の解釈

前のチュートリアル [DMFT-04 Mott](../dmft04) で述べたように、グリーン関数の金属性（あるいは非金属性）は対数スケールでデータをプロットすることで最もよく観察できます。

```
listobs = ['0', '2']   # flavor 0 is SYMMETRIZED with 1, flavor 2 is SYMMETRIZED with 3
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_u_*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.y = -d.y
    d.props['label'] = r'$U=$'+str(d.props['U'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
plt.figure()
plt.yscale('log')
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-05: Orbitally Selective Mott Transition on the Bethe lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

### 収束の確認

収束は [`tutorial5b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5b.py) で確認でき、$G_f^{it}(\tau)$ のすべての反復を対数スケールで表示します。
