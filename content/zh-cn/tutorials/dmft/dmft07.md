
---
title: DMFT-07 Hirsch-Fye
math: true
toc: true
---

## Hirsch Fye Code

我们首先运行一个离散时间蒙特卡罗代码：[Hirsch-Fye 代码](https://doi.org/10.1103/PhysRevLett.56.2521)。与教程 02、03 一样，我们重现 [Georges 等人的 DMFT 综述文章](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)中的图 11。这一系列共六条曲线展示了体系——一个相互作用为 $U=3D/\sqrt{2}$、处于半满情形、格子为贝特格子的 Hubbard 模型——在降温过程中如何进入反铁磁相。

Hirsch-Fye 算法及其开源实现见于 [Georges 等人的 DMFT 综述文章 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)。此后虽然出现了许多改进（例如可参见 Alvarez (2008) 或 [Nukala et al. (2009)](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111)），但该算法在很多场合已被能够消除下文所述系统性离散化误差的[连续时间算法](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)（CT-HYB、CT-INT，教程 02、03）所取代。

### 模型

与教程 02、03、06 一样，我们求解单带 Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

处于贝特格子上、半满（$\mu=0$）情形，取 $t=0.707106781186547=1/\sqrt{2}$（半带宽 $D=2t=\sqrt{2}$）、$U=3$，使得 $U=3D/\sqrt{2}$，与 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 一致。与教程 02 一样，`ANTIFERROMAGNET=1` 允许 Néel 自洽，因此在一系列 $\beta$ 下冷却同一物理点，会重现相同的金属到反铁磁绝缘体的转变——只不过这次使用的是 [Hirsch and Fye (1986)](https://doi.org/10.1103/PhysRevLett.56.2521) 提出的离散时间 Hirsch-Fye 求解器，而非连续时间求解器。

### 参数

| 参数 | 含义 | 所用取值 |
| :-------- | :------ | :------------ |
| `U` | 在位相互作用 | $3$ |
| `t` | 最近邻跃迁（贝特格子半带宽 $D=2t$） | $0.707106781186547 = 1/\sqrt{2}$，使得 $U=3D/\sqrt{2}$ |
| `BETA` | 逆温度 | $6, 8, 10, 12, 14, 16$（简短版脚本仅取 $6, 12$） |
| `MU` | 化学势 | $0$（半满） |
| `H`, `H_INIT` | 量子化轴方向的磁场／用于产生初始外斯场的种子场 | $0$ / $0.05$ |
| `FLAVORS` | 自旋味的数目 | $2$ |
| `ANTIFERROMAGNET` | 启用 Néel 自洽 | $1$ |
| `SYMMETRIZATION` | 是否强制顺磁解 | $0$（我们希望允许反铁磁序） |
| `N` | 虚时间片数，$\Delta\tau=\beta/N$ | $16$——刻意取小值，见“方法选择” |
| `NMATSUBARA` | 自洽计算中使用的松原频率截断 | $500$ |
| `OMEGA_LOOP` | 在松原频率下进行自洽计算 | $1$ |
| `MAX_IT`, `CONVERGED` | 自洽迭代的最大次数／收敛判据 | $10$、$0.005$（简短版）；$18$、$0.003$（完整版） |
| `SOLVER` | 杂质求解器 | `"hirschfye"` |
| `TOLERANCE` | Hirsch-Fye 求解器内部使用的收敛容差 | $0.001$ |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | 蒙特卡罗扫描数上限／热化扫描数／每次迭代的实际时间上限（秒） | $10^6$、$10^4$、$20$ |

### 运行模拟

Hirsch-Fye 模拟每次迭代大约需要 20 秒。本教程所需的文件可以在目录 `tutorials/dmft-07-hirschfye` 中找到。与教程 02、03 一样，你可以运行简短版脚本 [`tutorial7.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7.py)，它只重现 6 条曲线中的 2 条（运行时间：约 5 分钟）；也可以运行完整版脚本 [`tutorial7_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7_long.py)，它会重现全部 6 条曲线。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for b in [6., 12.]:
    parms.append(
            { 
              'ANTIFERROMAGNET'     : 1,
              'CONVERGED'           : 0.005,
              'FLAVORS'             : 2,
              'H'                   : 0,
              'H_INIT'              : 0.05,
              'MAX_IT'              : 10,
              'MAX_TIME'            : 20,
              'MU'                  : 0,
              'N'                   : 16,
              'NMATSUBARA'          : 500, 
              'OMEGA_LOOP'          : 1,
              'SEED'                : 0, 
              'SITES'               : 1,
              'SOLVER'              : 'hirschfye',
              'SYMMETRIZATION'      : 0,
              'TOLERANCE'           : 0.001,
              'U'                   : 3,
              't'                   : 0.707106781186547,
              'SWEEPS'              : 1000000,
              'THERMALIZATION'      : 10000,
              'BETA'                : b
            }
        )

# For more precise simulation we propose to you to:
#   lower CONVERGED (to 0.0003) and TOLERANCE (to 0.0001) and increase MAX_TIME

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)

listobs=['0', '1']
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-07: Neel transition for the Hubbard model on the Bethe lattice\n(using the Hirsch-Fye impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

在内部，`pyalps.runDMFT` 会针对生成的参数文件，在每次迭代中直接调用 `dmft` 应用程序：

```
/path-to-alps-installation/bin/dmft parm_beta_6.0
/path-to-alps-installation/bin/dmft parm_beta_12.0
```

### 参数文件

上述脚本生成的输入文件 `parm_beta_6.0`，并附有注释：

```
ANTIFERROMAGNET = 1                  // allow Neel order; meaningful for bipartite lattices in single-site DMFT
CONVERGED = 0.005                    // convergence criterion for the self-consistency iteration
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
H = 0                                // magnetic field along the quantization axis
H_INIT = 0.05                        // seed field for the initial Weiss field, breaks the up/down symmetry
MAX_IT = 10                          // maximum number of self-consistency iterations
MAX_TIME = 20                        // wall-clock time limit per iteration (seconds)
MU = 0                                // chemical potential; MU=0 is half filling for particle-hole symmetric models
N = 16                                // number of imaginary-time slices (Delta_tau = BETA/N); deliberately small, see Method choice
NMATSUBARA = 500                      // Matsubara cutoff used for the self-consistency
OMEGA_LOOP = 1                        // self-consistency runs in Matsubara frequencies
SEED = 0                              // Monte Carlo random number seed
SITES = 1                             // one impurity site, as in single-site DMFT
SOLVER = "hirschfye"                  // the discrete-time Hirsch-Fye solver
SYMMETRIZATION = 0                    // paramagnetic self-consistency is NOT enforced (we want AFM order)
TOLERANCE = 0.001                     // internal convergence tolerance of the Hirsch-Fye solver
U = 3                                 // interaction strength
t = 0.707106781186547                 // hopping; for the Bethe lattice considered here $W=2D=4t$
SWEEPS = 1000000                      // total sweeps
THERMALIZATION = 10000                // thermalization sweeps
BETA = 6.0                            // inverse temperature
```

与前面的教程一样，这里没有指定格子或能带结构的参数，因此默认情况下假定为贝特格子（其他选择参见 [DMFT-08 格子](../dmft08)）。初始外斯场由 `H_INIT` 从非相互作用格林函数计算得到。

### 格子

与教程 02、03、06 一样，这是无穷配位数 $z\to\infty$ 极限下贝特格子上的单点 DMFT。跃迁按 $t=t^*/\sqrt{z}$ 重新标度，使得半圆形态密度（半带宽 $D=2t$）可以在自洽循环中被解析求值（`OMEGA_LOOP=1`，不指定 `DOSFILE`）。每个格点具有相同的在位相互作用 $U$；每条键具有相同的跃迁 $t$：

```
        o       o
         \     /
      t   \   /   t
           \ /
        o---o---o          o : lattice site, interaction U (on site)
           / \              --- : bond, hopping amplitude t
          /   \
         /     \
        o       o
```

关于在其他格子上进行自洽计算，请参见 [DMFT-08 格子](../dmft08)；关于基于显式有限格子的模拟，请参见 [ALPS 格子库](../../../documentation/intro/latticehowtos)。

### 方法选择

Hirsch-Fye 的工作方式与 CT-HYB、CT-INT 截然不同：它将 $e^{-\beta \hat H}$ 特罗特分解为 $N$ 个宽度为 $\Delta\tau=\beta/N$ 的虚时间片，通过 Hubbard-Stratonovich 变换在每个时间片上引入一个辅助伊辛场，并用 Sherman-Morrison 型快速更新来更新一个 $N\times N$ 的格林函数矩阵。由于每次蒙特卡罗更新的代价为 $O(N^2)$，一次完整扫描的代价为 $O(N^3)$，因此 $N$ 必须保持较小——这里取 $N=16$。这与教程 02、03 中的连续时间求解器形成对比：那里的 `N` 只是一个存储／插值用的分箱数（通常为 $500$–$1000$），与计算代价无关。$N$ 较小的代价是可观测量中出现阶为 $(\Delta\tau)^2$ 的系统性偏差：这正是 [DMFT-06](../dmft06) 中与无偏差的连续时间求解器相对比的离散化误差，也是为什么在将 Hirsch-Fye 的结果与 CT-HYB、CT-INT 或精确对角化做定量比较之前，必须将其外推到 $\Delta\tau\to0$（$N\to\infty$）的原因。

### 输出数据与绘图

用于结果分析，你可以借助 [DMFT-02 Hybridization](../dmft02) 中说明的 `tutorial2eval.py`，也可以使用与之结构相同的 [`tutorial7eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7eval.py)：它会绘制按迭代分辨的 $G(\tau)$、占据数 $n_0=-G_0(\tau=\beta^-)$ 随 $\beta$ 的变化，以及（通过 Dyson 方程得到的）松原频率下的格林函数与自能，针对两个味都会绘制。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
from math import pi


listobs=['0']   # we look at a single flavor (=0) 
res_files = pyalps.getResultFiles(pattern='parm_*.h5')  # we look for result files

## load all iterations of G_{flavor=0}(tau)
data = pyalps.loadDMFTIterations(res_files, observable="G_tau", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G_{flavor=0}(\tau)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta= common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()

## load the final iteration of G_{flavor=0}(tau)
data_G_tau = pyalps.loadMeasurements(res_files, respath='/simulation/results/G_tau', what=listobs, verbose=False)  

print("Occupation in the last iteration at flavor=0")
for d in pyalps.flatten(data_G_tau):
    # obtain occupation using relation: <n_{flavor=0}> = -<G_{flavor=0}(tau=beta)>
    d.y = np.array([-d.y[-1]])
    print("n_0(beta =",d.props['BETA'],") =",d.y[0])
    d.x = np.array([0])
    d.props['observable'] = 'occupation'

occupation = pyalps.collectXY(data_G_tau, 'BETA', 'occupation')
for d in occupation:
    d.props['line']="scatter"

plt.figure()
pyalps.plot.plot(occupation)
plt.xlabel(r'$\beta$')
plt.ylabel(r'$n_{flavor=0}$')
plt.title('Occupation versus BETA')

plt.show()

## load all iterations of G_{flavor=0}(i omega_n)
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d.x])
        d.y = np.array(d.y.imag)
        d.props['label'] = "it"+d.props['iteration']
        d.props['line']="scatter"
        d.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ G_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()

## load all iterations of G_{flavor=0}(i omega_n) and G0_{flavor=0}(i omega_n)
data_G = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)
data_G0 = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G0_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped_G = pyalps.groupSets(pyalps.flatten(data_G), ['BETA','observable'])
for sim in grouped_G:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## compute selfenergy using the Dyson equation, rescale x-axis and set label
    for d_G in sim:
        # find corresponding dataset from data_G0
        d_G0 = [s for s in pyalps.flatten(data_G0) if s.props['iteration']==d_G.props['iteration'] and s.props['BETA']==common_props['BETA']][0]
        d_G.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d_G.x])
        # Dyson equation
        Sigma = np.array([1./d_G0.y[w] - 1./d_G.y[w] for w in range(len(d_G.y))])
        d_G.y = np.array(Sigma.imag)
        d_G.props['label'] = "it"+d_G.props['iteration']
        d_G.props['line']="scatter"
        d_G.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ \Sigma_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```

由于这是随机性的蒙特卡罗模拟，实际得到的数值取决于 `SEED`、`MAX_TIME` 和计算机速度，但与教程 02、03 一样，运行简短版脚本应能重现图 11 的定性特征：在 $\beta=6$ 时两个味的 $G(\tau)$ 几乎重合（顺磁、金属态），而在 $\beta=12$ 时两者出现分裂（反铁磁序）。由于 $N=16$ 较小，与教程 02、03 中相同 $\beta$ 下的连续时间结果相比，预计会出现可观察到的偏差——这一偏差正是上文所述的 $\Delta\tau$ 离散化误差。

### 小结与展望

作为一种离散时间方法，Hirsch-Fye 会受到 CT-HYB 与 CT-INT 所没有的 $\Delta\tau$ 离散化误差的影响。这里重现了同样的 Néel 转变，并且相对于教程 02、03 出现了可观察到的偏差，这具体说明了为什么连续时间算法在许多场合已经取代了 Hirsch-Fye。

1. 选取一个 $(U,\beta)$ 组合，对逐渐增大的 $N$（例如 $8, 16, 32, 64$）重复运行：随着 $N$ 增大，收敛的 $G(\tau)$ 是否逐渐逼近 CT-HYB／CT-INT 的结果？尝试将数据对 $(\Delta\tau)^2=(\beta/N)^2$ 外推到 $N\to\infty$。
2. [DMFT-06](../dmft06) 将 CT-HYB 和 CT-INT 直接与 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 图 15 中的精确对角化／Hirsch-Fye 基准做了比较。用你在问题 1 中得到的外推 Hirsch-Fye 结果代替文献曲线，自己重现这一比较。
3. 在固定运行时间的情况下，Hirsch-Fye 的 $G(\tau)$ 的统计噪声与相同 $\beta$ 下 CT-HYB（教程 02）的相比如何？为减小离散化误差而增大 $N$，是否也会增加噪声、运行时间，或两者皆有？
4. [DMFT-09 Néel Transition](../dmft09) 将本教程的 Hirsch-Fye 计算与 CT-HYB（教程 02）和 CT-INT（教程 03）的结果整合在一起做了比较——试着自己重现这一比较。
