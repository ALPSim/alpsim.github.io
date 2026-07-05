
---
title: DMFT-04 Mott
math: true
toc: true
---

## Mott Transition

Mott 转变是发生在许多材料中的金属-绝缘体转变（MIT），例如过渡金属化合物中，随压力或掺杂而发生。[Imada、Fujimori 与 Tokura 的综述文章，Rev. Mod. Phys. 70, 1039 (1998)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.70.1039) 对这一主题作了极好的介绍，并以 $V_2O_3$ 和有机化合物作为典型例子。

由于相关物理本质上是局域的（或与动量 k 无关的），MIT 可以很容易地用 DMFT 来研究：在半满情形下，MIT 可以用一个在 $\omega=0$ 处存在极点的自能来描述，该极点将非相互作用能带劈裂为上、下两个 Hubbard 带。在此背景下，抑制反铁磁长程序、在 DMFT 模拟中强制得到顺磁解，以此来模拟顺磁绝缘相，是很有启发意义的。为此，将格林函数的自旋向上和自旋向下分量对称化（参数 `SYMMETRIZATION = 1;`）。

### 运行模拟

要用 python 运行模拟，请使用 [`tutorial4a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4a.py)：

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

### 识别金属-绝缘体转变

我们研究单格点 DMFT 中的 Mott 转变：在固定温度 $\beta t=20$ 下作为相互作用强度的函数（参见例如[这篇论文](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)中的图 2）。从非相互作用解出发，我们在虚时间格林函数中看到，当 $U/t \leq 4.5$ 时解为金属态，而当 $U/t\geq 5$ 时解为绝缘态。若从绝缘（或原子极限）解出发，尝试在更小的 $U$ 下使其收敛，则可以找到共存区域。

虚时间格林函数不易直接解读，因此许多作者会采用[解析延拓方法（例如最大熵方法）](https://doi.org/10.1016/0370-1573%2895%2900074-7)。不过有两个明显的特征：在 $\tau=\beta$ 处的取值对应于 $-n$，即（每自旋的）密度的负值。第二个特征是，当温度降低（$\beta\rightarrow\infty$）时，$-\beta G(\beta/2) \rightarrow \pi A(0)$，其中 $A(0)$ 是费米能处的谱函数。因此，通过虚时间格林函数随温度的变化关系，我们可以立即判断体系是金属态还是绝缘态。为了更好地观察格林函数的行为，我们将以对数坐标绘制数据：

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

你应该会观察到，在固定的 $\beta$ 下，$U$ 较小时得到金属解，$U$ 较大时得到绝缘解。所取的最大 $U$ 值已深入绝缘相。

### 检验收敛性

可以使用 [`tutorial4b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4b.py) 来检验收敛性：

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

