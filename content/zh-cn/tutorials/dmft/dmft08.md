
---
title: DMFT-08 Lattices
math: true
toc: true
---

## Setting a particular lattice

之前所有的教程处理的都是具有半圆形态密度（DOS）的贝特格子，这使得自洽循环在解析上很简单（$\Omega$ 循环，不需要 k 空间积分）。但真实材料存在于正方格子、立方格子、六角格子或更复杂的格子之上，其态密度带有范霍夫奇点和硬带边，而不是光滑的半圆。这些特征会改变 Mott 转变发生的位置，或其转变的陡峭程度，因此了解如何针对贝特格子以外的格子运行单点 DMFT 是很有用的。本教程展示了具体做法；你可以直接复用前面教程中的脚本（例如 [DMFT-04 Mott](../dmft04) 中的 Mott 转变扫描），只需替换为下文引入的格子专属参数即可。

### 模型

格点哈密顿量仍然是单带 Hubbard 模型

$$
\hat{H} = -\sum_{\langle i,j\rangle,\sigma} t_{ij}\left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma},
$$

只是现在 $t_{ij}$ 取遍所选格子的各条键，而不是贝特格子 $z\to\infty$ 的树状结构。然而在单点 DMFT 中，格子从不直接进入杂质问题：自洽计算只需要局域的、对 k 积分后的非相互作用态密度 $\rho_0(\epsilon)=\sum_{\mathbf{k}}\delta(\epsilon-\epsilon_{\mathbf{k}})$（或者，如果 Hilbert 变换在 k 空间中实时进行，则等价地只需要色散关系 $\epsilon_{\mathbf{k}}$）。这正是经典平均场理论用单一有效（依赖于配位数的）场取代完整格子几何结构的 DMFT 类比。关于以 $\rho_0(\epsilon)$ 表示的自洽条件的一般推导，参见 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)。

### 参数

以下两种方法共有的参数（取自 `tutorial8a.py`／`tutorial8b.py` 中所用的值）：

| 参数 | 含义 | 所用取值 |
| :-------- | :------ | :------------ |
| `U` | 在位相互作用 | $3$ |
| `BETA` | 逆温度 | $6$ |
| `MU` | 化学势 | $0$（半满） |
| `H`, `H_INIT` | 量子化轴方向的磁场／初始外斯场的种子场 | $0$ / $0.05$ |
| `FLAVORS` | 自旋味的数目 | $2$ |
| `SITES` | 杂质格点数 | $1$ |
| `ANTIFERROMAGNET` | 启用 Néel 自洽 | $1$ |
| `SYMMETRIZATION` | 是否强制顺磁解 | $0$ |
| `N`, `NMATSUBARA` | $G$ 与 $G_0$ 的虚时间／松原频率离散化数目 | $500$ |
| `OMEGA_LOOP` | 在松原频率下进行自洽计算 | $1$ |
| `G0OMEGA_INPUT` | 设为空字符串，强制从非相互作用格林函数计算初始外斯场 | `""` |
| `MAX_IT`, `CONVERGED` | 自洽迭代的最大次数／收敛判据 | $10$、$0.005$ |
| `SOLVER` | 杂质求解器 | `"hybridization"`（CT-HYB） |
| `SC_WRITE_DELTA`, `N_MEAS`, `N_ORDER` | 写出杂化函数／测量之间的蒙特卡罗更新次数／展开阶数直方图的大小 | $1$、$5000$、$50$ |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | 蒙特卡罗扫描数上限／热化扫描数／每次迭代的实际时间上限（秒） | $10^4$、$500$、$60$ |

### 格子

有两种格子专属的机制可用；二者都会将对 k 积分后的态密度输入同一个自洽循环。

**DOSFILE**：只要提供该格子的态密度表，就可以使用*任意*格子。本教程内置了四种格子的预生成 DOS 表（直方图），跃迁均归一化为 $t=1$：

- **正方格子**（`DOS_Square_GRID4000`，配位数 $z=4$，二阶矩 `EPSSQ_i=4`）：
  ```
  o---o---o
  |   |   |
  o---o---o        o : lattice site, interaction U (on site)
  |   |   |        --- , | : bond, nearest-neighbor hopping t
  o---o---o
  ```
- **立方格子**（`DOS_Cubic_GRID360`，配位数 $z=6$，二阶矩 `EPSSQ_i=6`）：是上面正方格子向三维的推广，每个方向都额外增加了一条跃迁为 $t$、垂直于纸面的键。
- **六角（蜂窝）格子**（`DOS_Hexagonal_GRID4000`，配位数 $z=3$，二阶矩 `EPSSQ_i=3`）：
  ```
        o---o       o---o
       /     \     /     \
      o       o---o       o     o : lattice site, interaction U (on site)
       \     /     \     /      --- , / , \ : bond, nearest-neighbor hopping t
        o---o       o---o
  ```
- **贝特格子**（`DOS_Bethe`，二阶矩 `EPSSQ_i=1`，内置用于测试）：与教程 02–07 中使用的格子相同，此处作为参考展示：
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

每个 DOS 表都是由一个小型直方图生成脚本——[`DOS_Square.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Square.py)（`GRID=4000`）、[`DOS_Cubic.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Cubic.py)（`GRID=360`）、[`DOS_Hexagonal.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Hexagonal.py)（`GRID=4000`）——通过在 `GRID`$\times$`GRID` 的 k 点网格上对紧束缚色散在整个布里渊区做积分而生成的。你也可以用同样的方法为任何其他格子生成 DOS 表，或者在构建自己的格子时，参考 [ALPS 格子库](../../../documentation/intro/latticehowtos) 了解格子几何结构和配位数。

**TWODBS**：对于正方格子和六角格子，ALPS 可以不依赖预先制表的 DOS 文件，而是在每一步自洽计算中，将 Hilbert 变换直接作为实时的 k 空间积分（在 $L\times L$ 的 k 点网格上离散化）来求值。

### 方法选择

`DOSFILE` 与 `TWODBS` 在通用性与便利性之间做了不同的取舍。`DOSFILE` 适用于*任意*格子，因为只需要对 $\rho_0(\epsilon)$ 做一次性的直方图统计（如上文 `DOS_Square.py` 那样的脚本生成一次即可）——但其精度受限于直方图的 `GRID` 分辨率和分箱数，并且一旦跃迁参数发生变化就必须重新生成。`TWODBS` 在 k 空间离散化 `L` 的范围内是精确的，也不需要单独的预处理步骤，但目前仅针对正方格子（最近邻跃迁 `t` 与次近邻跃迁 `tprime`）和六角格子（仅最近邻跃迁 `t`）实现——完整参数列表参见 [DMFT 参数参考](../../../documentation/methods/dmft)。无论哪种情况，能够到达杂质求解器的格子信息都只有 $\rho_0(\epsilon)$（通过 `DOSFILE`）或 $\epsilon_{\mathbf k}$（通过 `TWODBS`），以及它们的一阶、二阶矩 `EPS_i`、`EPSSQ_i`——这印证了上文“模型”一节中的论点：单点 DMFT 只能通过（积分后的）非相互作用色散关系“看到”格子。

### Option DOSFILE

对于一般的格子，你需要提供该格子的态密度。除此之外，还需要做一些其他修改才能运行模拟。下面是一个可用的 python 脚本 [`tutorial8a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8a.py)，用于设置输入文件、运行模拟并绘制结果：

```
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u in [3.]: 
  for b in [6.]:
    parms.append(
            { 
                'BETA' : b,          # inverse temperature
                'MU' : 0.0,          # chemical potential corresponding to half-filling
                'U' : u,             # Hubbard interaction
                'FLAVORS' : 2,       # corresponds to spin up/down
                'SITES' : 1,         # number of sites in the impurity
                'H' : 0.0,           # there is no magnetic field
                'H_INIT' : 0.05,     #  we set initial field to split spin up/down in order to trigger AF phase
                'OMEGA_LOOP' : 1,        # the selfconsistency runs in Matsubara frequencies
                'ANTIFERROMAGNET' : 1,   # allow Neel order
                'SYMMETRIZATION' : 0,    # do not enforce paramagnetic solution
                'NMATSUBARA' : 500,      # number of Matsubara frequencies
                'N' : 500,               # bins in imaginary time
                'CONVERGED' : 0.005,     # criterion for convergency
                'MAX_TIME' : 60,         # max. time spent in solver in a single iteration in seconds
                'G0OMEGA_INPUT' : "",    # forces to start from the local non-interacting Green's function
                'MAX_IT' : 10,           # max. number of self-consistency iterations
                'SWEEPS' : 10000,    # max. number of sweeps in a single iteration
                'THERMALIZATION' : 500, # number of thermalization sweeps
                'SEED' : 0,              # random seed
                'SOLVER' : "hybridization",   # we take the hybridization impurity solver
                'SC_WRITE_DELTA' : 1,         # input for the hybridization impurity solver is the hybridization function Delta, which has to be written by the selfconsistency
                'N_MEAS' : 5000,              # number of Monte Carlo steps between measurements
                'N_ORDER' : 50,               # histogram size
                'DOSFILE' : "DOS/DOS_Square_GRID4000", # specification of the file with density of states
                'GENERAL_FOURIER_TRANSFORMER' : 1,  # Fourier transformer for a general bandstructure
                'EPS_0' : 0,                        # potential shift for the flavor 0
                'EPS_1' : 0,                        # potential shift for the flavor 1
                'EPSSQ_0' : 4,                      # the second moment of the bandstructure for the flavor 0
                'EPSSQ_1' : 4,                      # the second moment of the bandstructure for the flavor 1
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('hybrid_DOS_beta_'+str(p['BETA'])+'_U_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)

listobs=['0']  # we look only at flavor=0
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='hybrid_DOS*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()

plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-08, DOS-based approach: Hubbard model on the square lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

在内部，`pyalps.runDMFT` 会针对生成的参数文件直接调用 `dmft` 应用程序：

```
/path-to-alps-installation/bin/dmft hybrid_DOS_beta_6.0_U_3.0
```

上述脚本生成的输入文件 `hybrid_DOS_beta_6.0_U_3.0` 中，格子专属的参数为

```
DOSFILE = DOS/DOS_Square_GRID4000; // specification of the file with density of states
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                      // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                      // the second moment of the bandstructure for the flavor 1
```

再加上上面参数表中列出的物理／求解器参数。注意这里最近邻跃迁并不是一个显式参数——它已经被固化在 DOS 表本身之中，而 `DOS_Square.py` 在构造该表时将其固定为 $t=1$。

注 1：如果在输入文件中不提供能带结构参数（EPS_i、EPSSQ_i），那么它们将根据给定的 DOS 计算得到（自 revision 6146 起），公式为 $EPS_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon$，$EPSSQ_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon^2$。

注 2：反铁磁自洽循环假定为 Néel 序，因此仅适用于二分格子（bipartite lattices）。

注 3：态密度必须由用户自行提供。本教程提供了上文“格子”一节中列出的正方格子、立方格子、六角格子与贝特格子的态密度。

注 4：对于已知 DOS 的多带模拟 [$n_{\text{bands}}=FLAVORS/2$]，DOS 文件必须包含 $2n_{\text{bands}}$ 列。所有能带的分箱数（即输入文件的行数）必须相同。第 $i$ 行的结构如下所示

$$
e_{1,i}\ \ \ DOS_{band1}(e_{1,i})\ \ \ e_{2,i}\ \ \ DOS_{band2}(e_{2,i})\ \ \ \ldots
$$

### Option TWODBS

对于二维格子的情形，程序中实现了通过对 k 空间积分的 Hilbert 变换 [参数 L 设定了倒空间每个维度上的离散化程度]。目前已实现以下几种色散关系：

- 正方格子 [设置 TWODBS=square]，具有最近邻 [对应参数：t] 和次近邻跳跃 [对应参数：tprime]；二阶矩 EPSSQ_i 为 $4(t^2 + tprime^2)$；
- 六角格子 [设置 TWODBS=hexagonal]，仅具有最近邻跳跃 [对应参数：t]；二阶矩 EPSSQ_i 为 $3t^2$。

下面是一个用于生成输入文件、运行模拟并绘制结果的可用 python 脚本 [`tutorial8b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8b.py)：

```
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u in [3.]: 
  for b in [6.]:
    parms.append(
            { 
                'BETA' : b,          # inverse temperature
                'MU' : 0.0,          # chemical potential corresponding to half-filling
                'U' : u,             # Hubbard interaction
                'FLAVORS' : 2,       # corresponds to spin up/down
                'SITES' : 1,         # number of sites in the impurity
                'H' : 0.0,           # there is no magnetic field
                'H_INIT' : 0.05,     #  we set initial field to split spin up/down in order to trigger AF phase
                'OMEGA_LOOP' : 1,        # the selfconsistency runs in Matsubara frequencies
                'ANTIFERROMAGNET' : 1,   # allow Neel order
                'SYMMETRIZATION' : 0,    # do not enforce paramagnetic solution
                'NMATSUBARA' : 500,      # number of Matsubara frequencies
                'N' : 500,               # bins in imaginary time
                'CONVERGED' : 0.005,     # criterion for convergency
                'MAX_TIME' : 60,         # max. time spent in solver in a single iteration in seconds
                'G0OMEGA_INPUT' : "",    # forces to start from the local non-interacting Green's function
                'MAX_IT' : 10,           # max. number of self-consistency iterations
                'SWEEPS' : 10000,    # max. number of sweeps in a single iteration
                'THERMALIZATION' : 500, # number of thermalization sweeps
                'SEED' : 0,              # random seed
                'SOLVER' : "hybridization",   # we take the hybridization impurity solver
                'SC_WRITE_DELTA' : 1,         # input for the hybridization impurity solver is the hybridization function Delta, which has to be written by the selfconsistency
                'N_MEAS' : 5000,              # number of Monte Carlo steps between measurements
                'N_ORDER' : 50,               # histogram size
                'TWODBS' : 1,     # the Hilbert transformation integral runs in k-space, sets square lattice
                't' : 1,          # the nearest-neighbor hopping
                'tprime' : 0,     # the second nearest-neighbor hopping
                'L' : 64,         # discretization in k-space in the Hilbert transformation
                'GENERAL_FOURIER_TRANSFORMER' : 1,  # Fourier transformer for a general bandstructure
                'EPS_0' : 0,                        # potential shift for the flavor 0
                'EPS_1' : 0,                        # potential shift for the flavor 1
                'EPSSQ_0' : 4,                      # the second moment of the bandstructure for the flavor 0
                'EPSSQ_1' : 4,                      # the second moment of the bandstructure for the flavor 1
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('hybrid_TWODBS_beta_'+str(p['BETA'])+'_U_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)

listobs=['0']  # we look only at flavor=0
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='hybrid_TWODBS*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()

plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-08, TWODBS option: Hubbard model on the square lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

```
/path-to-alps-installation/bin/dmft hybrid_TWODBS_beta_6.0_U_3.0
```

生成的输入文件 `hybrid_TWODBS_beta_6.0_U_3.0` 中，格子专属的参数如下：

```
TWODBS = 1;     // the Hilbert transformation integral runs in k-space; sets square lattice
t = 1;          // the nearest-neighbor hopping
tprime = 0;     // the second nearest-neighbor hopping
L = 64;         // discretization in k-space in the Hilbert transformation
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                   // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                   // the second moment of the bandstructure for the flavor 1
```

这里 `t=1`、`tprime=0` 是显式给出的参数（不同于 DOSFILE 方式中跃迁被固定在预先制表的文件里），因此 `EPSSQ_i=4(t^2+tprime^2)=4` 可以直接由上面的公式得出。

### 输出数据与绘图

`tutorial8a.py`（DOSFILE）与 `tutorial8b.py`（TWODBS）都以前面教程中同样的绘图方式结尾：自洽循环结束时的虚时间格林函数 $G_{\text{flavor}=0}(\tau)$，这里是 $U=3$、$\beta=6$ 时正方格子的结果。由于两个脚本针对的是同一个格子（正方格子，$t=1$）和同一个物理点，它们收敛后的 $G(\tau)$ 应在统计误差范围内彼此一致——这是检验 DOSFILE 直方图与 TWODBS 实时 k 空间积分是否描述同一物理的一个有用交叉验证。

将此结果与相同 $U$、$\beta$ 下 [DMFT-02 Hybridization](../dmft02) 和 [DMFT-04 Mott](../dmft04) 中贝特格子的结果相比较，预计会看到明显的差异：正方格子的态密度在带中心处有对数型范霍夫奇点，并在 $\epsilon=\pm4t$ 处有硬带边，这与贝特格子光滑的半圆形态密度不同，因此金属-绝缘体交叉发生在不同的临界 $U$ 处，即使在金属相中，格林函数的短时行为也会有所不同。

### 小结与展望

单点 DMFT 要闭合自洽循环，只需要格子的局域态密度（或色散关系），而不需要其完整的实空间几何结构——无论这个态密度来自预先制表的直方图（`DOSFILE`）还是实时的 k 空间 Hilbert 变换（`TWODBS`）。

1. 究竟哪些格子信息会进入 DMFT 计算？将你的答案与经典（Weiss）平均场处理 Ising 模型时所用到的信息做比较——在什么意义上，单点 DMFT 本身也是一种平均场理论？
2. 针对正方格子（`DOSFILE=DOS/DOS_Square_GRID4000` 或 `TWODBS=1`）而非贝特格子，重做 [DMFT-04 Mott](../dmft04) 中的 Mott 转变扫描。临界 $U$ 或转变的形状是否出现了明显变化？
3. 回顾 Ising 模型在不同空间维度下的平均场预言（例如平均场临界温度随配位数 $z$ 标度）。这里比较的几种格子的配位数（六角、正方、立方格子分别为 $z=3,4,6$）是否在 DMFT 结果中留下了类似的痕迹？
4. 分别用相同的 $U$、$\beta$ 运行 `tutorial8a.py`（DOSFILE）和 `tutorial8b.py`（TWODBS），直接比较收敛后的 $G(\tau)$ 曲线。二者的一致程度分别如何依赖于 DOS 直方图的 `GRID` 分辨率和 k 空间离散化 `L`？
