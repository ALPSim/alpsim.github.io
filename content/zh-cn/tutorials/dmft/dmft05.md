
---
title: DMFT-05 OSMT
math: true
toc: true
---

## Orbitally Selective Mott Transition

多轨道模型中一个有趣的现象是轨道选择性 Mott 转变，最早由 [Anisimov 等人，Eur. Phys. J. B 25, 191 (2002)](https://doi.org/10.1140/epjb/e20020021) 研究。它的一个变体——*动量选择性* Mott 转变——最近在[团簇计算](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.045120)中作为赝能隙物理的一种团簇表示被讨论。

在轨道选择性 Mott 转变中，随着掺杂或相互作用的变化，参与的部分轨道会变为 Mott 绝缘态，而其余轨道仍保持金属态。

作为一个最简模型，我们考虑两条能带：一条宽带和一条窄带。除了轨道内库仑排斥 $U$ 之外，我们还考虑相互作用 $U'$ 和 $J$，满足 $U' = U-2J$。这里我们仅限于类 Ising 相互作用——这是一个对真实化合物往往有问题的简化。

### 运行模拟

这里我们选取的算例中，两条能带的带宽为 $t_0=0.5$ 和 $t_1=1$，密度-密度型相互作用为 $U'=U/2$、$J=U/4$，$U$ 取值在 $1.8$ 到 $2.8$ 之间：$U=1.8$ 时两条轨道均表现出费米液体行为，$U=2.2$ 时体系为轨道选择性的，而 $U=2.8$ 时两条轨道均为绝缘态。

运行模拟的 python 命令可以在 [`tutorial5a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5a.py) 中找到：

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

使用相同示例参数的一篇论文可以在[这里](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.72.081103)找到。

### 解读结果

正如前一个教程 [DMFT-04 Mott](../dmft04) 中所讨论的，格林函数是否具有金属性，最好通过以对数坐标绘制数据来观察。

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

### 检验收敛性

可以使用 [`tutorial5b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5b.py) 检验收敛性，它以对数坐标展示 $G_f^{it}(\tau)$ 的所有迭代结果。
