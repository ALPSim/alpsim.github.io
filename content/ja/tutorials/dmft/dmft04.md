
---
title: DMFT-04 Mott
math: true
toc: true
---

## Mott Transition

モット転移は、多くの物質（例えば遷移金属化合物）において、圧力やドーピングの関数として生じる金属-絶縁体転移（MIT）です。[Imada, Fujimori, Tokura によるレビュー論文、Rev. Mod. Phys. 70, 1039 (1998)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.70.1039) はこのテーマへの優れた入門であり、代表例として $V_2O_3$ や有機物を挙げています。

関連する物理が本質的に局所的（あるいは波数 k に依存しない）であるため、MIT は DMFT によって容易に調べることができます。半充填の場合、MIT は $\omega=0$ に極を持つ自己エネルギーによってモデル化することができ、この極が非相互作用バンドを上部・下部の Hubbard バンドに分裂させます。この文脈では、反強磁性の長距離秩序を抑制し、DMFT シミュレーションにおいて常磁性解を強制することで、常磁性絶縁相を模擬するのが有益です。そのために、グリーン関数のスピンアップ成分とスピンダウン成分を対称化します（パラメータ `SYMMETRIZATION = 1;`）。

### シミュレーションの実行

python でシミュレーションを実行するには、[`tutorial4a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4a.py) を使用します。

```    
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

#prepare the input parameters
parms=[]
for u in [4.,5.,6.,8.]: 
    parms.append(
            { 
              'ANTIFERROMAGNET'         : 0,
              'CHECKPOINT'              : 'solverdump_U_'+str(u),
              'CONVERGED'               : 0.001,
              'FLAVORS'                 : 2,
              'H'                       : 0,
              'H_INIT'                  : 0.,
              'MAX_IT'                  : 20,
              'MAX_TIME'                : 600,
              'MU'                      : 0,
              'N'                       : 500,
              'NMATSUBARA'              : 500, 
              'N_MEAS'                  : 1000,
              'N_ORDER'                 : 50,
              'OMEGA_LOOP'              : 1,
              'SEED'                    : 0, 
              'SITES'                   : 1,              
              'SOLVER'                  : 'hybridization',
              'SC_WRITE_DELTA'          : 1,
              'SYMMETRIZATION'          : 1,
              't'                       : 1,
              'SWEEPS'                  : 1500*u,
              'BETA'                    : 20.0,
              'THERMALIZATION'          : 500,
              'U'                       : u
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_u_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)
```

### 金属-絶縁体転移の特定

固定温度 $\beta t=20$ のもとで、相互作用の関数として単一格子 DMFT におけるモット転移を調べます（例えば[この論文](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)の図2を参照してください）。非相互作用解から出発すると、虚時間グリーン関数において、$U/t \leq 4.5$ では金属的な解となり、$U/t\geq 5$ では絶縁的な解となることがわかります。絶縁的な（あるいは原子極限の）解から出発し、より小さな $U$ で収束させようとすることで、共存領域を見つけることができます。

虚時間グリーン関数は解釈が容易ではないため、多くの研究者は[解析接続法（例えば最大エントロピー法）](https://doi.org/10.1016/0370-1573%2895%2900074-7)を用います。しかし、はっきりとした特徴が2つあります。まず、$\tau=\beta$ における値は $-n$、すなわち（スピンあたりの）密度の負の値に対応します。もう一つの特徴は、温度を下げていくと（$\beta\rightarrow\infty$）、$-\beta G(\beta/2) \rightarrow \pi A(0)$ となることです。ここで $A(0)$ はフェルミエネルギーにおけるスペクトル関数です。したがって、虚時間グリーン関数の温度依存性から、系が金属的か絶縁的かをただちに見て取ることができます。グリーン関数の振る舞いをより詳しく見るために、対数スケールでデータをプロットします。

```
listobs=['0']   # we look at only one flavor, as they are SYMMETRIZED
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_u_*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)

for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.y = -d.y
    d.props['label'] = r'$U=$'+str(d.props['U'])
plt.figure()
plt.yscale('log')
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-04: Mott-insulator transition for the Hubbard model on the Bethe lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

固定した $\beta$ のもとで、$U$ が小さいときには金属的な解が、$U$ が大きいときには絶縁的な解が得られることが確認できるはずです。最大の $U$ の値は、絶縁相の深いところにあります。

### 収束の確認

収束は [`tutorial4b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4b.py) で確認できます。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


## Please run the tutorial4a.py before this one

listobs = ['0']   # we look at convergence of a single flavor (=0) 

## load all results
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_u_*.h5'), measurements=listobs, verbose=True)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['U','observable'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.y *= -1.
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$-G_{flavor=%8s}(\tau)$' % common_props['observable'])
    plt.title('DMFT-04: ' + r'$U = %.4s$' % common_props['U'])
    pyalps.plot.plot(sim)
    plt.legend()
    plt.yscale("log")

plt.show()
```

