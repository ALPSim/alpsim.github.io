
---
title: DMFT-06 Paramagnet
math: true
toc: true
---

## Paramagnetic metal and extrapolation errors

在本例中，我们使用顺磁自洽方式，模拟贝特格子上相互作用为 $U=3D/\sqrt{2}$、温度为 $\beta =32 \sqrt{2}/D$ 的 Hubbard 模型。我们将计算自能，并将其与 [Georges 等人的 DMFT 综述文章](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)中图 15 的结果进行比较，该图给出了同一体系的 Hirsch-Fye 与精确对角化结果。与 Hirsch-Fye 算法不同，CT-HYB 和 CT-INT 这两种连续时间量子蒙特卡罗算法不存在离散化误差，能够重现精确对角化的结果。

### 模型

与前面的教程一样，我们求解单带 Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

处于贝特格子上、半满（$\mu=0$）情形，取 $t=0.707106781186547=1/\sqrt{2}$（半带宽 $D=2t=\sqrt{2}$）、$U=3$，使得 $U=3D/\sqrt{2}$，与 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 一致。与教程 02、03 不同，这里在 $\beta=32$ 下强制采用*顺磁*自洽（`ANTIFERROMAGNET=0`、`SYMMETRIZATION=1`），这样得到的金属态自能就可以直接与该综述文章图 15 中同样针对顺磁相计算的 Hirsch-Fye 与精确对角化基准结果进行比较。

### 参数

两个求解器都在同一物理点上运行：

| 参数 | 含义 | 取值 |
| :-------- | :------ | :---- |
| `U` | 在位相互作用 | $3$ |
| `t` | 最近邻跃迁（半带宽 $D=2t=\sqrt{2}$） | $0.707106781186547 = 1/\sqrt{2}$ |
| `BETA` | 逆温度 | $32$ |
| `MU` | 化学势 | $0$（半满） |
| `H`, `H_INIT` | 量子化轴方向的磁场／初始外斯场的种子场 | $0$ / $0$ |
| `FLAVORS` | 自旋味的数目 | $2$ |
| `ANTIFERROMAGNET` | 启用 Néel 自洽 | $0$（禁用——强制顺磁解） |
| `SYMMETRIZATION` | 强制顺磁解 | $1$ |
| `OMEGA_LOOP` | 在松原频率下进行自洽计算 | $1$ |
| `SITES` | 杂质格点数 | $1$ |
| `MAX_IT`, `CONVERGED` | 自洽迭代的最大次数／收敛判据 | $12$、$0.0025$ |

两个求解器在离散化和求解器专属设置上有所不同：

| 参数 | 含义 | CT-HYB（`hyb`） | CT-INT（`int`） |
| :-------- | :------ | :-------------- | :-------------- |
| `SOLVER` | 杂质求解器 | `"hybridization"` | `"Interaction Expansion"` |
| `N`, `NMATSUBARA` | $G$、$G_0$ 的虚时间／松原频率离散化数目 | $1000$ | $500$ |
| `SWEEPS`, `THERMALIZATION` | 蒙特卡罗扫描数上限、热化扫描数 | $2500$、$500$ | $10^8$、$1000$ |
| `MAX_TIME` | 每次迭代的实际时间上限（秒） | $600$ | $120$ |
| `N_MEAS` | 测量之间的蒙特卡罗更新次数 | $10000$ | ─ |
| `N_ORDER` | 杂化展开阶数直方图的大小 | $50$ | ─ |
| `SC_WRITE_DELTA` | 为求解器写出杂化函数 | $1$ | ─ |
| `ALPHA` | CT-INT 辅助伊辛场的偏移量 | ─ | $-0.01$ |
| `HISTOGRAM_MEASUREMENT` | 记录 CT-INT 展开阶数的直方图 | ─ | $1$ |
| `MEASUREMENT_PERIOD`, `RECALC_PERIOD` | CT-INT 测量／重新计算的周期 | ─ | $10$、$3000$ |
| `NMATSUBARA_MEASUREMENTS`, `NSELF` | CT-INT 专属的松原／自能网格大小 | ─ | $18$、$5000$ |
| `CONVERGENCE_CHECK_PERIOD` | CT-INT 收敛检查的周期 | ─ | $500$ |
| `CHECKPOINT` | 检查点／重启文件的文件名前缀 | `dump_hyb` | `dump_int` |

### 运行模拟

参数文件和 python 脚本位于 ALPS 安装目录下 `tutorials/dmft-06-paramagnet` 目录的子目录 `hyb` 和 `int` 中。你可以通过执行以下命令来运行模拟（杂化展开版本）：

```
python tutorial6a.py
```

以及（相互作用展开版本）：

```
python tutorial6b.py
```

[`tutorial6a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-06-paramagnet/hyb/tutorial6a.py)（CT-HYB）：

```
import pyalps

#prepare the input parameters
parms=[]
parms.append(
        {
          'ANTIFERROMAGNET'     : 0,
          'CHECKPOINT'          : 'dump_hyb',
          'CONVERGED'           : 0.0025,
          'FLAVORS'             : 2,
          'H'                   : 0,
          'H_INIT'              : 0.0,
          'MAX_IT'              : 12,
          'MAX_TIME'            : 600,
          'MU'                  : 0,
          'N'                   : 1000,
          'NMATSUBARA'          : 1000,
          'N_MEAS'              : 10000,
          'N_ORDER'             : 50,
          'OMEGA_LOOP'          : 1,
          'SEED'                : 0,
          'SITES'               : 1,
          'SOLVER'              : 'hybridization',
          'SC_WRITE_DELTA'      : 1,
          'SYMMETRIZATION'      : 1,
          'U'                   : 3,
          't'                   : 0.707106781186547,
          'SWEEPS'              : 2500,
          'THERMALIZATION'      : 500,
          'BETA'                : 32
        }
    )

# For more precise calculations we propose to you to:
#   enhance the MAX_TIME, MAX_IT and lower CONVERGED

#write the input file and run the simulation
input_file = pyalps.writeParameterFile('parm_hyb',parms[0])
res = pyalps.runDMFT(input_file)
```

[`tutorial6b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-06-paramagnet/int/tutorial6b.py)（CT-INT）：

```
import pyalps

#prepare the input parameters
parms=[]
parms.append(
        { 
          'ANTIFERROMAGNET'         : 0,
          'CHECKPOINT'              : 'dump_int',
          'CONVERGED'               : 0.0025,
          'CONVERGENCE_CHECK_PERIOD': 500,
          'FLAVORS'                 : 2,
          'H'                       : 0,
          'H_INIT'                  : 0.,
          'MAX_IT'                  : 12,
          'MAX_TIME'                : 120,
          'MU'                      : 0,
          'N'                       : 500,
          'NMATSUBARA'              : 500,
          'NMATSUBARA_MEASUREMENTS' : 18, 
          'NSELF'                   : 5000,
          'MEASUREMENT_PERIOD'      : 10,
          'OMEGA_LOOP'              : 1,
          'SEED'                    : 0, 
          'SITES'                   : 1,
          'SOLVER'                  : 'Interaction Expansion',
          'SYMMETRIZATION'          : 1,
          'U'                       : 3,
          't'                       : 0.707106781186547,
          'RECALC_PERIOD'           : 3000,
          'SWEEPS'                  : 100000000,
          'THERMALIZATION'          : 1000,
          'ALPHA'                   : -0.01,
          'HISTOGRAM_MEASUREMENT'   : 1,
          'BETA'                    : 32
        }
    )
    
# For more precise calculations we propose to you to:
#   enhance the MAX_TIME, MAX_IT and lower CONVERGED

#write the input file and run the simulation
input_file = pyalps.writeParameterFile('parm_int',parms[0])
res = pyalps.runDMFT(input_file)
```

在内部，`pyalps.runDMFT` 会针对每个生成的参数文件，在每次迭代中直接调用 `dmft` 应用程序：

```
/path-to-alps-installation/bin/dmft parm_hyb
/path-to-alps-installation/bin/dmft parm_int
```

警告：在单台工作站上运行这需要很长时间；如果不需要非常高的精度，可以（通过降低 `MAX_TIME` 和 `MAX_IT`，或提高 `CONVERGED`）将两次运行的总时间缩短到大约 $2\times 24$ 分钟。

### 参数文件

`parm_hyb` 文件，附有注释：

```
ANTIFERROMAGNET = 0        // paramagnetic self-consistency (no Neel order)
CHECKPOINT = dump_hyb      // filename prefix for checkpoint/restart files
CONVERGED = 0.0025         // convergence criterion for the self-consistency iteration
FLAVORS = 2                // flavors 0 and 1 correspond to spin up and down
H = 0                      // magnetic field along the quantization axis
H_INIT = 0.0               // no symmetry-breaking seed field
MAX_IT = 12                // maximum number of self-consistency iterations
MAX_TIME = 600             // wall-clock time limit per iteration (seconds)
MU = 0                     // chemical potential; MU=0 is half filling
N = 1000                   // discretization of the imaginary-time Green's function
NMATSUBARA = 1000          // cutoff for Matsubara frequencies
N_MEAS = 10000             // number of updates between measurements
N_ORDER = 50               // histogram size for the hybridization expansion order
OMEGA_LOOP = 1             // self-consistency runs in Matsubara frequencies
SEED = 0                   // Monte Carlo random number seed
SITES = 1                  // one impurity site, as in single-site DMFT
SOLVER = "hybridization"   // the CT-HYB solver
SC_WRITE_DELTA = 1         // write out the hybridization function for the solver
SYMMETRIZATION = 1         // enforce a paramagnetic solution (flavors 0 and 1 symmetrized)
U = 3                      // interaction strength
t = 0.707106781186547      // hopping; for the Bethe lattice considered here $W=2D=4t$
SWEEPS = 2500               // total sweeps
THERMALIZATION = 500       // thermalization sweeps
BETA = 32                  // inverse temperature
```

`parm_int` 文件，附有注释：

```
ANTIFERROMAGNET = 0                  // paramagnetic self-consistency (no Neel order)
CHECKPOINT = dump_int                // filename prefix for checkpoint/restart files
CONVERGED = 0.0025                   // convergence criterion for the self-consistency iteration
CONVERGENCE_CHECK_PERIOD = 500       // how often (in sweeps) convergence is checked
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
H = 0                                // magnetic field along the quantization axis
H_INIT = 0.                          // no symmetry-breaking seed field
MAX_IT = 12                          // maximum number of self-consistency iterations
MAX_TIME = 120                       // wall-clock time limit per iteration (seconds)
MU = 0                               // chemical potential; MU=0 is half filling
N = 500                              // discretization of the imaginary-time Green's function
NMATSUBARA = 500                     // cutoff for Matsubara frequencies
NMATSUBARA_MEASUREMENTS = 18         // number of Matsubara points measured directly
NSELF = 5000                         // number of self-energy points
MEASUREMENT_PERIOD = 10              // sweeps between measurements
OMEGA_LOOP = 1                       // self-consistency runs in Matsubara frequencies
SEED = 0                             // Monte Carlo random number seed
SITES = 1                            // one impurity site, as in single-site DMFT
SOLVER = "Interaction Expansion"     // the CT-INT solver
SYMMETRIZATION = 1                   // enforce a paramagnetic solution (flavors 0 and 1 symmetrized)
U = 3                                // interaction strength
t = 0.707106781186547                // hopping; for the Bethe lattice considered here $W=2D=4t$
RECALC_PERIOD = 3000                 // sweeps between recomputation of the weight from scratch
SWEEPS = 100000000                   // upper bound on sweeps; in practice MAX_TIME stops the run first
THERMALIZATION = 1000                // thermalization sweeps
ALPHA = -0.01                        // shift of the auxiliary Ising field (CT-INT sign-problem control)
HISTOGRAM_MEASUREMENT = 1            // record a histogram of the CT-INT perturbation order
BETA = 32                            // inverse temperature
```

### 格子

与前面的教程一样，这是无穷配位数 $z\to\infty$ 极限下贝特格子上的单点 DMFT。跃迁按 $t=t^*/\sqrt{z}$ 重新标度，使得半圆形态密度（半带宽 $D=2t$）可以在自洽循环中被解析求值（`OMEGA_LOOP=1`，不指定 `DOSFILE`）。每个格点具有相同的在位相互作用 $U$；每条键具有相同的跃迁 $t$：

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

本教程的目的并非在两个求解器之间做出取舍，而是在同一个物理点上*同时*运行 CT-HYB 和 CT-INT，检验二者是否相互一致，并且与 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 图 15 中数值精确的基准结果一致。该图最初是用精确对角化（精确，但浴格点数受限）和离散时间 Hirsch-Fye 算法（见 [DMFT-07 Hirsch-Fye](../dmft07)）得到的。Hirsch-Fye 存在一个由时间片宽度 $\Delta\tau=\beta/N$ 控制的系统误差，因此要获得可信的定量结果，需要外推到 $\Delta\tau\to0$（即 $N\to\infty$）——这正是本教程标题中“外推误差”的含义。CT-HYB 与 CT-INT 展开的是不同的量（分别是杂化和相互作用），但两者都直接在连续虚时间下建立，因此都不存在需要外推消除的 $\Delta\tau$ 偏差；二者收敛结果之间的任何差异纯粹是统计性的。

### 输出数据与绘图

在每次 DMFT 迭代 $i$ 中，自能都会被写入文件 `selfenergy_i`。绘制收敛后的自能，并将结果与 [Georges 等人](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)图 15 的结果进行比较。你也可以借助 [DMFT-02 Hybridization](../dmft02#松原频率格林函数与自能) 中松原频率自能的代码，用 python 脚本完成这项工作：

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
from math import pi

listobs=['0']   # SYMMETRIZATION=1, so flavor 0 already represents both spins

## load the converged (final) G and G0 in Matsubara representation for both solvers
data_G = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_*.h5'), respath='/simulation/results/G_omega', what=listobs, verbose=False)
data_G0 = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_*.h5'), respath='/simulation/results/G0_omega', what=listobs, verbose=False)

for d_G, d_G0 in zip(pyalps.flatten(data_G), pyalps.flatten(data_G0)):
    d_G.x = np.array([(2.*n+1)*pi/d_G.props['BETA'] for n in d_G.x])
    Sigma = 1./d_G0.y - 1./d_G.y   # Dyson equation
    d_G.y = np.array(Sigma.imag)
    d_G.props['label'] = d_G.props['SOLVER']

plt.figure()
plt.xlabel(r'$i\omega_n$')
plt.ylabel(r'$Im\ \Sigma(i\omega_n)$')
plt.title('DMFT-06: paramagnetic self-energy, CT-HYB vs. CT-INT')
pyalps.plot.plot(list(pyalps.flatten(data_G)))
plt.legend()
plt.show()
```

由于这是随机性的蒙特卡罗模拟，实际得到的数值取决于 `SEED`、`MAX_TIME` 和计算机速度，但 `parm_hyb` 与 `parm_int` 得到的收敛自能应在误差范围内彼此一致，并且都应能重现 [Georges 等人](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)图 15 中 ED/Hirsch-Fye 曲线在低频区域的行为——且无需任何 $\Delta\tau$ 外推。

### 小结与展望

在同一个顺磁金属点上运行 CT-HYB 与 CT-INT，并将两者都与 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 的图 15 进行比较，证实了连续时间求解器无需离散时间方法所需的 $\Delta\tau\to0$ 外推，就能重现数值精确的基准结果。

1. [DMFT-07 Hirsch-Fye](../dmft07) 用离散时间求解器运行了相同的物理点。在几个不同的 `N`（时间片数）取值下重复该计算，并外推 $\Delta\tau=\beta/N\to0$：外推结果与这里得到的 CT-HYB／CT-INT 曲线相比如何？
2. 在固定总运行时间的情况下，比较两个收敛自能的误差棒：在这一特定的 $U$ 和 $\beta$ 下，哪个求解器更快达到给定的统计精度？
3. $\mathrm{Im}\,\Sigma(i\omega_n)$ 在低频处的斜率与准粒子权重 $Z$ 相关。从你收敛得到的自能中提取 $Z$，并与 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 中给出的此 $U/D$ 对应的数值进行比较。
4. [DMFT-09 Néel Transition](../dmft09) 在相同的格子和求解器上重新考察这一问题，但设置 `ANTIFERROMAGNET=1`；比较一下允许磁性序出现后，自洽与收敛行为有何不同。
