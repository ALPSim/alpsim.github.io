
---
title: DMFT-03 Interaction
math: true
toc: true
---

## 相互作用展开 CT-INT

我们用另一种连续时间量子蒙特卡罗杂质求解器——相互作用展开算法 CT-INT——重复 [DMFT-02 Hybridization](../dmft02) 中的计算。与 CT-HYB 对杂质-浴杂化做展开不同，CT-INT 对相互作用 $U$ 做幂级数展开，并按照 [Rubtsov, Savkin, Lichtenstein, Phys. Rev. B 72, 035122 (2005)](https://doi.org/10.1103/PhysRevB.72.035122) 的方法，利用辅助伊辛场对由此产生的图形做随机采样。由于是围绕非相互作用极限展开，CT-INT 通常在弱到中等耦合下效率最高，与教程 02 中用于强耦合的 CT-HYB 求解器形成互补。

与教程 02 一样，我们重现 [Georges, Kotliar, Krauth 与 Rozenberg 的 DMFT 综述文章，Rev. Mod. Phys. 68, 13 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 中的图 11：一系列曲线展示了贝特格子上半满、单带 Hubbard 模型在降温过程中如何进入反铁磁相。

### 模型

DMFT 自洽求解的格点模型是单带 Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

其中 $t$ 为最近邻跃迁，$U$ 为在位相互作用，$\mu$ 为化学势（在半满且具有粒子-空穴对称性时 $\mu=0$）。关于该格点模型如何被映射为自洽的量子杂质问题，请参见 [Georges 等人的综述文章 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)；关于本教程所用的 CT-INT 算法，请参见 [Rubtsov, Savkin, Lichtenstein (2005)](https://doi.org/10.1103/PhysRevB.72.035122)。

### 参数

| 参数 | 含义 | 所用取值 |
| :-------- | :------ | :------------ |
| `U` | 在位相互作用 | $3$ |
| `t` | 最近邻跃迁（贝特格子半带宽 $D=2t$） | $0.707106781186547 = 1/\sqrt{2}$，使得 $U=3D/\sqrt{2}$，与 Georges 等人图 11 中一致 |
| `BETA` | 逆温度 | $6, 8, 10, 12, 14, 16$（简短版脚本仅取 $6, 12$） |
| `MU` | 化学势 | $0$（半满） |
| `H`, `H_INIT` | 量子化轴方向的磁场／用于产生初始外斯场对称性破缺的种子场 | $0$ / $0.05$ |
| `FLAVORS` | 自旋味的数目 | $2$ |
| `ANTIFERROMAGNET` | 启用 Néel（双子格）自洽 | $1$ |
| `SYMMETRIZATION` | 是否强制顺磁解 | $0$（我们希望允许反铁磁序） |
| `N`, `NMATSUBARA` | $G$ 与 $G_0$ 的虚时间／松原频率离散化数目 | $500$ |
| `OMEGA_LOOP` | 在松原频率下进行自洽计算 | $1$ |
| `MAX_IT`, `CONVERGED` | 自洽迭代的最大次数／收敛判据 | $10$、$0.005$（简短版）；$18$、$0.003$（完整版） |
| `SOLVER` | 杂质求解器 | `"Interaction Expansion"` |
| `ALPHA` | CT-INT 中用于控制符号问题的辅助伊辛场偏移量，参见 [Rubtsov et al. (2005)](https://doi.org/10.1103/PhysRevB.72.035122) | $-0.01$ |
| `HISTOGRAM_MEASUREMENT` | 记录展开阶数的直方图 | $1$ |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | 蒙特卡罗扫描数上限／热化扫描数／每次迭代的实际时间上限（秒） | $10^8$、$1000$、$10$ |

### 运行模拟

本教程所需的文件可以在目录 `tutorials/dmft-03-interaction` 中找到。与教程 02 一样，你可以运行简短版脚本 [`tutorial3.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3.py)，它只重现 6 条曲线中的 2 条（运行时间：约 10 分钟）；也可以运行完整版脚本 [`tutorial3_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3_long.py)，它会重现全部 6 条曲线（运行时间：约 30 分钟）。在这一弱耦合区域中，CT-INT 达到同等统计精度所需时间比 CT-HYB 更短，因此这里的 `MAX_TIME` 被设置为每次迭代 10 秒，远低于教程 02 中的 300 秒。

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
              'ANTIFERROMAGNET'         : 1,
              'CONVERGED'               : 0.005,
              'FLAVORS'                 : 2,
              'H'                       : 0,
              'H_INIT'                  : 0.05,
              'MAX_IT'                  : 10,
              'MAX_TIME'                : 10,
              'MU'                      : 0,
              'N'                       : 500,
              'NMATSUBARA'              : 500,
              'OMEGA_LOOP'              : 1,
              'SEED'                    : 0,
              'SITES'                   : 1,
              'SOLVER'                  : 'Interaction Expansion',
              'SYMMETRIZATION'          : 0,
              'U'                       : 3,
              't'                       : 0.707106781186547,
              'SWEEPS'                  : 100000000,
              'THERMALIZATION'          : 1000,
              'ALPHA'                   : -0.01,
              'HISTOGRAM_MEASUREMENT'   : 1,
              'BETA'                    : b
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

在内部，`pyalps.runDMFT` 会针对生成的参数文件，在每次迭代中直接调用 `dmft` 应用程序：

```
/path-to-alps-installation/bin/dmft parm_beta_6.0
/path-to-alps-installation/bin/dmft parm_beta_12.0
```

与处理有限格点的其他 ALPS 应用不同，`dmft` 代码直接读取纯文本参数文件（不需要 `parameter2xml` 预处理步骤）。

### 参数文件

上述脚本生成的输入文件 `parm_beta_6.0`，并附有注释：

```
H_INIT = 0.05                        // seed field for the initial Weiss field, breaks the up/down symmetry
ANTIFERROMAGNET = 1                  // allow Neel order; meaningful for bipartite lattices in single-site DMFT
SEED = 0                             // Monte Carlo random number seed
CONVERGED = 0.005                    // convergence criterion for the self-consistency iteration
MAX_IT = 10                          // maximum number of self-consistency iterations
SWEEPS = 100000000                   // upper bound on sweeps; in practice MAX_TIME stops the run first
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
SYMMETRIZATION = 0                   // paramagnetic self-consistency is NOT enforced (we want AFM order)
NMATSUBARA = 500                     // cutoff for Matsubara frequencies
H = 0                                // magnetic field along the quantization axis
OMEGA_LOOP = 1                       // self-consistency runs in Matsubara frequencies
SITES = 1                            // one impurity site, as in single-site DMFT
N = 500                              // discretization of the imaginary-time Green's function
BETA = 6.0                           // inverse temperature
U = 3                                // interaction strength
MAX_TIME = 10                        // wall-clock time limit per iteration (seconds)
ALPHA = -0.01                        // shift of the auxiliary Ising field (CT-INT sign-problem control)
HISTOGRAM_MEASUREMENT = 1            // record a histogram of the CT-INT perturbation order
SOLVER = "Interaction Expansion"     // the CT-INT solver
THERMALIZATION = 1000                // thermalization sweeps
MU = 0                               // chemical potential; MU=0 is half filling for particle-hole symmetric models
t = 0.707106781187                   // hopping; for the Bethe lattice considered here $W=2D=4t$
```

与教程 02 一样，这里没有指定格子或能带结构的参数：默认情况下假定为贝特格子（其他选择参见 [DMFT-08 格子](../dmft08)）。同样也未给出 `G0OMEGA_INPUT`/`G0TAU_INPUT`，因此初始外斯场由 `H_INIT` 从非相互作用格林函数计算得到。

### 格子

在单点 DMFT 中，格点问题被映射为一个与自洽确定的外斯场耦合的量子杂质问题，并不直接对角化任何有限的团簇。这里进入自洽计算的格子是无穷配位数 $z\to\infty$ 极限下的贝特格子，其跃迁按 $t=t^*/\sqrt{z}$ 重新标度，以保证态密度保持有限；这一极限给出半带宽为 $D=2t^*$ 的半圆形态密度，DMFT 自洽计算对其进行解析求值（`OMEGA_LOOP=1` 且不指定 `DOSFILE`）。每个格点具有相同的在位相互作用 $U$；每条键具有相同的（重新标度后的）跃迁 $t$：

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

贝特格子之所以是入门级单点 DMFT 的标准选择，是因为其半圆形态密度给出了封闭形式的自洽关系式，从而避免了其他格子所需的 k 空间积分（关于其他格子以及基于显式有限格子的模拟，参见 [DMFT-08 格子](../dmft08) 和 [ALPS 格子库](../../../documentation/intro/latticehowtos)）。

### 方法选择

CT-INT 与 CT-HYB 用不同的图形展开求解同一个杂质问题，比较两者是检验 DMFT 物理结果是否与求解器无关的有效手段。CT-HYB（教程 02）对杂化做展开，在强耦合下表现最好：即使 $U$ 较大，平均展开阶数也能保持适中。CT-INT 则对 $U$ 做展开，其平均展开阶数大致随 $\beta U$ 线性增长，因此在本教程所研究的弱到中等耦合区域（$U=3D/\sqrt{2}$）效率最高。杂质本身很容易精确对角化——`FLAVORS=2` 的单个格点只有 $2^2=4$ 个局域态（空、自旋向上单占据、自旋向下单占据、双占据）；计算代价完全在于对微扰级数的随机采样，而非精确对角化步骤。这也是为什么 `MAX_TIME` 可以设置得比 CT-HYB 低得多（每次迭代 10 秒 对比 300 秒），同时仍能分辨出转变。

### 输出数据与绘图

结果的分析方式与 [DMFT-02 Hybridization](../dmft02) 完全相同，使用 [`tutorial3eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3eval.py)（结构与 `tutorial2eval.py` 相同）。首先是紧接在 `tutorial3.py` 之后、绘制两个味的虚时间格林函数的代码：

```
listobs=['0', '1']   # we will plot both flavors 0 and 1

data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-03: Neel transition for the Hubbard model on the Bethe lattice\n(using the Interaction expansion impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

绘制味 0 的占据数 $n_0=-G_0(\tau=\beta^-)$ 随 $\beta$ 变化关系的代码（`tutorial3eval.py` 的一部分）：

```
listobs=['0']
res_files = pyalps.getResultFiles(pattern='parm_*.h5')

data_G_tau = pyalps.loadMeasurements(res_files, respath='/simulation/results/G_tau', what=listobs, verbose=False)

print("Occupation in the last iteration at flavor=0")
for d in pyalps.flatten(data_G_tau):
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
```

同一脚本还能重现在 [DMFT-02 Hybridization](../dmft02#检验收敛性) 中详细介绍过的、按迭代分辨的收敛图，以及松原频率下格林函数与自能的图；除了生成底层 `.h5` 文件所用的求解器不同外，代码本身没有变化，因为两种求解器都将结果写入相同的 ALPS 输出格式。

由于这是一个随机性的蒙特卡罗模拟，你实际得到的数值取决于 `SEED`、`MAX_TIME` 以及计算机速度。运行简短版脚本应能重现图 11 的定性特征：在 $\beta=6$ 时两个味的 $G(\tau)$ 几乎重合（顺磁、金属态），而在 $\beta=12$ 时两者明显分离（反铁磁序已经出现），这与教程 02 中 CT-HYB 已经观察到的趋势一致。

### 小结与展望

用一种独立的杂质求解器——本教程中的 CT-INT——重现了与教程 02 中 CT-HYB 相同的 Néel 转变，这说明该转变是 DMFT 自洽条件与格点模型本身的性质，而不是某一特定蒙特卡罗算法所产生的假象。

1. 在固定 `MAX_TIME` 的情况下，$\beta=12$ 时 CT-INT 与 CT-HYB 哪一个给出的 $G(\tau)$ 误差棒更小？如果把 $U$ 增大到接近 [DMFT-04 Mott](../dmft04) 中研究的 Mott 转变附近，答案会如何变化？
2. 画出由 `HISTOGRAM_MEASUREMENT=1` 输出的展开阶数直方图，并检查其平均值随 $\beta$ 和 $U$ 如何变化。
3. 尝试改变 `ALPHA`：把它从 $-0.01$ 移向 $0$，低温下的符号问题严重程度会发生怎样的变化？
4. [DMFT-09 Néel Transition](../dmft09) 将本教程的 CT-INT 结果与 CT-HYB（教程 02）和 Hirsch-Fye（教程 07）的结果整合在一起做了比较——试着自己重现这一比较。
