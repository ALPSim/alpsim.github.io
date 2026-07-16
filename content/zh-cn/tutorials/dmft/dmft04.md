
---
title: DMFT-04 Mott
math: true
toc: true
---

## Mott Transition

Mott 转变是发生在许多材料中的金属-绝缘体转变（MIT），例如过渡金属化合物中，随压力或掺杂而发生。[Imada、Fujimori 与 Tokura 的综述文章，Rev. Mod. Phys. 70, 1039 (1998)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.70.1039) 对这一主题作了极好的介绍，并以 $V_2O_3$ 和有机化合物作为典型例子。

由于相关物理本质上是局域的（或与动量 k 无关的），MIT 可以很容易地用 DMFT 来研究：在半满情形下，MIT 可以用一个在 $\omega=0$ 处存在极点的自能来描述，该极点将非相互作用能带劈裂为上、下两个 Hubbard 带。在此背景下，抑制反铁磁长程序、在 DMFT 模拟中强制得到顺磁解，以此来模拟顺磁绝缘相，是很有启发意义的。为此，将格林函数的自旋向上和自旋向下分量对称化（参数 `SYMMETRIZATION = 1;`）。

### 模型

与教程 02、03 一样，DMFT 应用于贝特格子上的单带 Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

且处于半满（$\mu=0$）情形。这里在固定逆温度 $\beta t=20$ 下扫描相互作用 $U$，该温度已足够低，使得在抑制反铁磁序之后的顺磁解基本达到其零温极限的形式。关于物理背景请参见 [Imada, Fujimori, Tokura (1998)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.70.1039)；关于 DMFT 映射请参见 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)。

### 参数

| 参数 | 含义 | 所用取值 |
| :-------- | :------ | :------------ |
| `U` | 在位相互作用，跨转变点扫描 | $4, 5, 6, 8$ |
| `t` | 最近邻跃迁（贝特格子半带宽 $D=2t$，带宽 $W=4t$） | $1$ |
| `BETA` | 扫描 $U$ 时保持固定的逆温度 | $20$ |
| `MU` | 化学势 | $0$（半满） |
| `H`, `H_INIT` | 量子化轴方向的磁场／用于产生初始外斯场的种子场 | $0$ / $0$（不破坏对称性——见“方法选择”） |
| `FLAVORS` | 自旋味的数目 | $2$ |
| `ANTIFERROMAGNET` | 启用 Néel 自洽 | $0$（禁用——见“方法选择”） |
| `SYMMETRIZATION` | 强制顺磁解（对味 0 和 1 做对称化） | $1$ |
| `N`, `NMATSUBARA` | $G$ 与 $G_0$ 的虚时间／松原频率离散化数目 | $500$ |
| `OMEGA_LOOP` | 在松原频率下进行自洽计算 | $1$ |
| `MAX_IT`, `CONVERGED` | 自洽迭代的最大次数／收敛判据 | $20$、$0.001$ |
| `SOLVER` | 杂质求解器 | `"hybridization"`（CT-HYB） |
| `N_ORDER` | 杂化展开阶数直方图的大小 | $50$ |
| `N_MEAS` | 测量之间的蒙特卡罗更新次数 | $1000$ |
| `SC_WRITE_DELTA` | 为求解器写出杂化函数 | $1$ |
| `CHECKPOINT` | 检查点／重启文件的文件名前缀 | `solverdump_U_`+`U` |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | 蒙特卡罗扫描数上限（随 $U$ 缩放）／热化扫描数／每次迭代的实际时间上限（秒） | $1500\,U$、$500$、$600$ |

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

与前面的教程一样，`pyalps.runDMFT` 会针对每个生成的参数文件，在每次迭代中直接调用 `dmft` 应用程序：

```
/path-to-alps-installation/bin/dmft parm_u_4.0
/path-to-alps-installation/bin/dmft parm_u_5.0
/path-to-alps-installation/bin/dmft parm_u_6.0
/path-to-alps-installation/bin/dmft parm_u_8.0
```

### 参数文件

上述脚本生成的输入文件 `parm_u_4.0`，并附有注释：

```
ANTIFERROMAGNET = 0                  // suppress Neel order to access the paramagnetic Mott solution
CHECKPOINT = solverdump_U_4.0        // filename prefix for checkpoint/restart files
CONVERGED = 0.001                    // convergence criterion for the self-consistency iteration
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
H = 0                                // magnetic field along the quantization axis
H_INIT = 0.                          // no symmetry-breaking seed field for the initial Weiss field
MAX_IT = 20                          // maximum number of self-consistency iterations
MAX_TIME = 600                       // wall-clock time limit per iteration (seconds)
MU = 0                               // chemical potential; MU=0 is half filling
N = 500                              // discretization of the imaginary-time Green's function
NMATSUBARA = 500                     // cutoff for Matsubara frequencies
N_MEAS = 1000                        // number of updates between measurements
N_ORDER = 50                         // histogram size for the hybridization expansion order
OMEGA_LOOP = 1                       // self-consistency runs in Matsubara frequencies
SEED = 0                             // Monte Carlo random number seed
SITES = 1                            // one impurity site, as in single-site DMFT
SOLVER = "hybridization"             // the CT-HYB solver
SC_WRITE_DELTA = 1                   // write out the hybridization function for the solver
SYMMETRIZATION = 1                   // enforce a paramagnetic solution (flavors 0 and 1 symmetrized)
t = 1                                // hopping; for the Bethe lattice considered here $W=2D=4t$
SWEEPS = 6000                        // total sweeps (1500*U at U=4)
BETA = 20.0                          // inverse temperature
THERMALIZATION = 500                 // thermalization sweeps
U = 4                                // interaction strength
```

### 格子

与教程 02、03 一样，这里的单点 DMFT 使用无穷配位数 $z\to\infty$ 极限下的贝特格子，跃迁按 $t=t^*/\sqrt{z}$ 重新标度，使得其半圆形态密度（半带宽 $D=2t$）可以在自洽循环中被解析求值（`OMEGA_LOOP=1`，不指定 `DOSFILE`）。每个格点具有相同的在位相互作用 $U$；每条键具有相同的跃迁 $t$：

```
        o       o
         \     /
      t   \   /   t
           \ /
        o---o---o          o : 格点位置，在位相互作用 U
           / \              --- : 键，跃迁振幅 t
          /   \
         /     \
        o       o
```

关于在其他格子上进行自洽计算，请参见 [DMFT-08 格子](../dmft08)；关于基于显式有限格子的模拟，请参见 [ALPS 格子库](../../../documentation/intro/latticehowtos)。

### 方法选择

这里我们使用杂化展开求解器 CT-HYB（与 [DMFT-02 Hybridization](../dmft02) 相同），而不是相互作用展开求解器 CT-INT（[DMFT-03 Interaction](../dmft03) 中所用）。CT-INT 的平均展开阶数大致随 $\beta U$ 线性增长；在 $\beta t=20$ 且 $U/t$ 最高达到 $8$ 的情况下，这会使 CT-INT 的计算代价变得很高。相比之下，CT-HYB 对与浴的杂化做展开：在绝缘相深处，有效的低能杂质-浴耦合被抑制（杂质趋近原子极限），因此即使 $U$ 增大，平均杂化阶数也能保持在可控范围内——这与 CT-INT 的标度行为正好相反。因此，从金属相追踪解一直到 Mott 绝缘体，CT-HYB 是自然的选择。

我们还刻意设置了 `ANTIFERROMAGNET = 0` 和 `SYMMETRIZATION = 1`。在（二分的）贝特格子上、半满情形下，对几乎任意 $U>0$，低温下反铁磁序都会占主导，从而掩盖本教程所研究的顺磁 Mott 转变。抑制 Néel 自洽并强制得到对称的（顺磁）解，可以把相互作用驱动的 MIT 单独分离出来，这模拟了真实 Mott 材料中几何阻挫抑制磁序的效果。

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

### 小结与展望

通过抑制反铁磁序并在固定 $\beta t=20$ 下扫描 $U$，我们确定了贝特格子上半满 Hubbard 模型的顺磁 Mott 转变位于 $U/t=4.5$ 到 $U/t=5$ 之间，这与 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 综述的 DMFT 相图一致。

1. 将 `ANTIFERROMAGNET` 设为 $1$（如 [DMFT-02 Hybridization](../dmft02) 中那样），在相同的 $U$ 值下重新运行：反铁磁不稳定性是否会掩盖本教程所研究的顺磁解？
2. Mott 转变在低温下是一级转变，因此金属解与绝缘解可以共存。从一个已收敛的绝缘解出发，将其 `G0omega_output` 复制为新的 `G0OMEGA_INPUT`，尝试从绝缘体一侧收敛到更小的 $U$：绝缘解能在低于 $U/t\approx4.5$ 的范围内存续到多远？
3. 在更高的温度（更小的 `BETA`）下重复该扫描：表观转变是否会变得更加平滑，从而与一条终止于有限温度临界点的一级转变线相符？
4. 将 $U=8$ 处的 CT-HYB 计算与同一点处的 CT-INT（教程 03 所用求解器）计算进行比较：根据上文“方法选择”一节中的标度论证，哪个求解器收敛得更快？

