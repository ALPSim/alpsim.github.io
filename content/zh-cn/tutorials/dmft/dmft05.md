
---
title: DMFT-05 OSMT
math: true
toc: true
---

## Orbitally Selective Mott Transition

多轨道模型中一个有趣的现象是轨道选择性 Mott 转变，最早由 [Anisimov 等人，Eur. Phys. J. B 25, 191 (2002)](https://doi.org/10.1140/epjb/e20020021) 研究。它的一个变体——*动量选择性* Mott 转变——最近在[团簇计算](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.045120)中作为赝能隙物理的一种团簇表示被讨论。

在轨道选择性 Mott 转变中，随着掺杂或相互作用的变化，参与的部分轨道会变为 Mott 绝缘态，而其余轨道仍保持金属态。

作为一个最简模型，我们考虑两条能带：一条宽带和一条窄带。除了轨道内库仑排斥 $U$ 之外，我们还考虑相互作用 $U'$ 和 $J$，满足 $U' = U-2J$。这里我们仅限于类 Ising 相互作用——这是一个对真实化合物往往有问题的简化。

### 模型

我们考虑一个两轨道（两带）Hubbard-Kanamori 模型，限制在其密度-密度（“Ising”）项：

$$
\hat{H} = -\sum_{m=0,1}t_m\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{im\sigma}\hat{c}_{jm\sigma} + \text{h.c.}\right) + U\sum_{i,m} \hat{n}_{im\uparrow}\hat{n}_{im\downarrow} + \sum_{i,\sigma,\sigma'}\left[U' - J\,\delta_{\sigma\sigma'}\right]\hat{n}_{i0\sigma}\hat{n}_{i1\sigma'} - \mu\sum_{i,m,\sigma}\hat{n}_{im\sigma},
$$

其中轨道指标 $m=0,1$，$t_m$ 为轨道内跃迁，$U$ 为轨道内（Hubbard）相互作用，$U'=U-2J$ 为轨道间相互作用，$J$ 为洪德耦合。舍弃完整 Kanamori 相互作用中的自旋翻转项和对跳跃项，只保留上面给出的密度-密度部分，就是前文提到的“类 Ising”简化。关于此类模型中轨道选择性 Mott 转变（OSMT）的最初讨论，参见 [Anisimov et al., Eur. Phys. J. B 25, 191 (2002)](https://doi.org/10.1140/epjb/e20020021)；关于本教程重现的参数，参见 [de' Medici, Georges, Biermann, Phys. Rev. B 72, 081103(R) (2005)](https://doi.org/10.1103/PhysRevB.72.081103)。

### 参数

| 参数 | 含义 | 所用取值 |
| :-------- | :------ | :------------ |
| `U` | 轨道内相互作用 | $1.8, 2.2, 2.8$ |
| `J` | 洪德耦合，对每个 $U$ 取为 $U/4$ | $0.45, 0.55, 0.7$ |
| (`U'`) | 轨道间相互作用，未显式设置——默认取 $U-2J=U/2$ | $0.9, 1.1, 1.4$ |
| `t0` | 轨道 0（窄带）的跃迁（半带宽 $D_0=2t_0$） | $0.5$ |
| `t1` | 轨道 1（宽带）的跃迁（半带宽 $D_1=2t_1$） | $1$ |
| `BETA` | 逆温度 | $30$ |
| `MU` | 化学势 | $0$（半满） |
| `H`, `H_INIT` | 量子化轴方向的磁场／初始外斯场的种子场 | $0$ / $0$ |
| `FLAVORS` | 味的数目：2 个轨道 $\times$ 2 个自旋 | $4$（味 0,1 = 窄带的 $\uparrow,\downarrow$；味 2,3 = 宽带的 $\uparrow,\downarrow$） |
| `SYMMETRIZATION` | 在每个轨道内强制自旋对称的解（味 0$\leftrightarrow$1、2$\leftrightarrow$3） | $1$ |
| `N`, `NMATSUBARA` | $G$ 与 $G_0$ 的虚时间／松原频率离散化数目 | $500$ |
| `MAX_IT`, `CONVERGED` | 自洽迭代的最大次数／收敛判据 | $15$、$0.001$ |
| `SOLVER` | 杂质求解器 | `"hybridization"`（CT-HYB，段表示） |
| `N_ORDER` | 杂化展开阶数直方图的大小 | $50$ |
| `N_MEAS` | 测量之间的蒙特卡罗更新次数 | $2000$ |
| `SC_WRITE_DELTA` | 为求解器写出杂化函数 | $1$ |
| `CHECKPOINT` | 检查点／重启文件的文件名前缀 | `dump` |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | 蒙特卡罗扫描数上限／热化扫描数／每次迭代的实际时间上限（秒） | $10000$、$500$、$600$ |

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

使用相同示例参数的论文可参见 [de' Medici, Georges, Biermann (2005)](https://doi.org/10.1103/PhysRevB.72.081103)。与前面的教程一样，`pyalps.runDMFT` 会针对每个生成的参数文件，在每次迭代中直接调用 `dmft` 应用程序：

```
/path-to-alps-installation/bin/dmft parm_u_1.8_j_0.45
/path-to-alps-installation/bin/dmft parm_u_2.2_j_0.55
/path-to-alps-installation/bin/dmft parm_u_2.8_j_0.7
```

### 参数文件

上述脚本生成的输入文件 `parm_u_1.8_j_0.45`，并附有注释：

```
CONVERGED = 0.001                 // convergence criterion for the self-consistency iteration
FLAVORS = 4                       // 2 orbitals x 2 spins: flavors 0,1 = narrow-band up/down; flavors 2,3 = wide-band up/down
H = 0                             // magnetic field along the quantization axis
H_INIT = 0.                       // no symmetry-breaking seed field for the initial Weiss field
MAX_IT = 15                       // maximum number of self-consistency iterations
MAX_TIME = 600                    // wall-clock time limit per iteration (seconds)
MU = 0                            // chemical potential; MU=0 is half filling
N = 500                           // discretization of the imaginary-time Green's function
NMATSUBARA = 500                  // cutoff for Matsubara frequencies
N_MEAS = 2000                     // number of updates between measurements
N_ORDER = 50                      // histogram size for the hybridization expansion order
SEED = 0                          // Monte Carlo random number seed
SOLVER = "hybridization"          // the CT-HYB solver (segment representation, requires density-density interactions)
SC_WRITE_DELTA = 1                // write out the hybridization function for the solver
SYMMETRIZATION = 1                // enforce spin-symmetric solutions within each orbital (flavors 0<->1 and 2<->3)
SWEEPS = 10000                    // total sweeps
BETA = 30                         // inverse temperature
THERMALIZATION = 500              // thermalization sweeps
U = 1.8                           // intra-orbital (Hubbard) interaction
J = 0.45                          // Hund's coupling
t0 = 0.5                          // hopping of the narrow band (half-bandwidth D0=2t0=1)
t1 = 1                            // hopping of the wide band (half-bandwidth D1=2t1=2)
CHECKPOINT = dump                 // filename prefix for checkpoint/restart files
```

注意 $U'$ 并未显式设置：如 [DMFT 参数参考](../../../documentation/methods/dmft) 中所述，未指定时它默认取 $U-2J$。

### 格子

这仍然是单点 DMFT，但现在有两个轨道：每个轨道各自在 $z\to\infty$ 极限下的贝特格子上跃迁（窄带跃迁为 $t_0$，宽带跃迁为 $t_1$，同样按 $t_m=t_m^*/\sqrt{z}$ 重新标度），两个轨道在跃迁上互不耦合——它们仅通过每个格点上的相互作用项 $U$、$U'$、$J$ 局域地相互耦合：

```
        o(1)      o(1)
         \        /
      t1  \      /  t1        orbital 1 (wide band), hopping t1
           \    /
            o--o--o
            |
            |  U, U', J   (on-site intra- and inter-orbital interactions)
            |
            o--o--o
           /    \
      t0  /      \  t0        orbital 0 (narrow band), hopping t0
         /        \
        o(0)      o(0)
```

关于在其他格子上进行自洽计算，请参见 [DMFT-08 格子](../dmft08)；关于基于显式有限格子的模拟，请参见 [ALPS 格子库](../../../documentation/intro/latticehowtos)。

### 方法选择

这里我们再次使用段表示下的杂化展开求解器 CT-HYB。段算法对局域迹做解析求值，而这只有在局域相互作用为密度-密度（类 Ising）形式时才可行——这正是上文“模型”一节中所采用的限制。这也是为什么要舍弃完整 Kanamori 相互作用中的自旋翻转项和对跳跃项：若保留这些项，则每次蒙特卡罗更新都需要对完整的（维数为 $2^{\text{FLAVORS}}=16$ 的）局域希尔伯特空间做一般矩阵（非段）形式的 CT-HYB 迹求值，计算代价会大幅增加。在四个味、$\beta=30$ 的设置下，段表示使得即便在两个轨道都接近 Mott 转变时，模拟依然可行。

### 输出数据与绘图

正如前一个教程 [DMFT-04 Mott](../dmft04) 中所讨论的，格林函数是否具有金属性，最好通过以对数坐标绘制数据来观察。味 0（与 1 对称化）对应窄带，味 2（与 3 对称化）对应宽带：

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

由于这是随机性的蒙特卡罗模拟，实际得到的数值取决于 `SEED`、`MAX_TIME` 和计算机速度，但定性上应能重现上述三种情形：在 $U=1.8$ 时，两个味在对数坐标下都缓慢衰减（两条能带均为金属态）；在 $U=2.2$ 时，窄带对应的味（0）比宽带对应的味（2）衰减快得多——这两个轨道之间的这种不对称性正是轨道选择性 Mott 转变本身；在 $U=2.8$ 时，两个味都快速衰减（两条能带均为绝缘态）。

### 检验收敛性

可以使用 [`tutorial5b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5b.py) 检验收敛性，它以对数坐标绘制味 0 和味 2 各自的所有迭代 $G_f^{it}(\tau)$：

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


## Please run the tutorial5a.py before this one

listobs = ['0', '2']   # we look at convergence of a single flavor (=0) 

## load all results
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_u_*.h5'), measurements=listobs, verbose=True)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['U', 'observable'])
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
    plt.title('DMFT-05: Orbitally Selective Mott Transition on the Bethe lattice: ' + r'$U = %.4s$' % common_props['U'])
    pyalps.plot.plot(sim)
    plt.legend()
    plt.yscale("log")

plt.show()
```

### 小结与展望

通过让两条带宽不同的贝特格子能带（$t_0=0.5$、$t_1=1$）仅通过局域密度-密度相互作用耦合，我们重现了轨道选择性 Mott 转变：在中间 $U$ 值处，尽管两个轨道共享相同的 $U$、$U'$、$J$，窄带却变为 Mott 绝缘态，而宽带仍保持金属态。

1. 固定 $U=2.2$（轨道选择点），在保持 $U'=U-2J$ 不变的情况下改变 $J$：洪德耦合需要多大，选择性相才会出现？
2. 改变带宽比 $t_1/t_0$：使两条能带更不对称（或更对称）会使轨道选择性区域在 $U$ 方向上变宽还是变窄？
3. “方法选择”一节解释了为何将相互作用限制在密度-密度部分。查阅资料了解，对于真实材料，被舍弃的自旋翻转项和对跳跃项所带来的修正预计有多大（参见 [Anisimov et al. (2002)](https://doi.org/10.1140/epjb/e20020021)）——在完整的 Kanamori 相互作用下，你预期选择性相还能存续吗？
4. [DMFT-06](../dmft06) 将教程 02–05 所用的方法应用于顺磁金属；比较一下那里的收敛行为与本教程所研究的多轨道情形有何不同。
