
---
title: DMFT-09 Néel Transition
math: true
toc: true
---

## 单格点 DMFT 中的 Néel 转变

在本例中，我们重现 [Georges 等人的 DMFT 综述文章](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)中的图 11。这一系列共六条曲线展示了体系——一个相互作用为 $U=3D/\sqrt{2}$、处于半满情形、格子为贝特格子的 Hubbard 模型——在降温过程中如何进入反铁磁相。

本教程综合了 [DMFT-02 Hybridization](../dmft02)、[DMFT-03 Interaction](../dmft03) 和 [DMFT-07 Hirsch-Fye](../dmft07)：用三种算法上相互独立的杂质求解器求解同一个物理点，并将结果直接绘制在同一张图上进行比较。

### 模型

与教程 02、03、07 一样，我们求解单带 Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

处于贝特格子上、半满（$\mu=0$）情形，取 $t=0.707106781186547=1/\sqrt{2}$（半带宽 $D=2t=\sqrt{2}$）、$U=3$，使得 $U=3D/\sqrt{2}$，与 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 一致。`ANTIFERROMAGNET=1` 允许 Néel 自洽，因此在一系列 $\beta$ 下冷却这一物理点，无论使用哪种杂质求解器，都会重现图 11 中金属到反铁磁绝缘体的交叉。

### 参数

每个求解器完整的注释参数文件都已在相应教程中给出；这里只在共同的 $\beta=12$ 处重新列出各求解器专属的设置：

| 参数 | 含义 | CT-HYB（[DMFT-02](../dmft02)） | CT-INT（[DMFT-03](../dmft03)） | Hirsch-Fye（[DMFT-07](../dmft07)） |
| :-------- | :------ | :----------------------------- | :----------------------------- | :---------------------------------- |
| `SOLVER` | 杂质求解器 | `"hybridization"` | `"Interaction Expansion"` | `"hirschfye"` |
| `N` | 虚时间离散化数 | $250$ | $500$ | $16$（刻意取小值，见 [DMFT-07](../dmft07#方法选择)） |
| 求解器专属 | 附加参数 | `N_MEAS`、`N_ORDER`、`SC_WRITE_DELTA` | `ALPHA`、`HISTOGRAM_MEASUREMENT` | `TOLERANCE` |
| 共有 | `U`、`t`、`BETA`、`MU`、`H`、`FLAVORS`、`ANTIFERROMAGNET`、`SYMMETRIZATION`、`NMATSUBARA`、`OMEGA_LOOP`、`SITES`、`SEED` | 三个求解器完全相同（见上文“模型”） | | |

### 运行模拟

每个求解器的简短版脚本都会在其各自的教程目录中写出 `parm_beta_6.0` 和 `parm_beta_12.0`，并运行它们：

```
cd tutorials/dmft-02-hybridization && python tutorial2.py    # CT-HYB
cd tutorials/dmft-03-interaction   && python tutorial3.py    # CT-INT
cd tutorials/dmft-07-hirschfye     && python tutorial7.py    # Hirsch-Fye
```

或者，在参数文件生成之后，也可以直接在命令行中运行：

```
/path-to-alps-installation/bin/dmft tutorials/dmft-02-hybridization/parm_beta_12.0
/path-to-alps-installation/bin/dmft tutorials/dmft-03-interaction/parm_beta_12.0
/path-to-alps-installation/bin/dmft tutorials/dmft-07-hirschfye/parm_beta_12.0
```

完整的脚本和带注释的参数文件请参见 [DMFT-02](../dmft02#运行模拟)、[DMFT-03](../dmft03#运行模拟) 和 [DMFT-07](../dmft07#运行模拟)。

### 格子

三个求解器都运行在本系列教程中一直使用的、无穷配位数 $z\to\infty$ 极限下的贝特格子上，跃迁按 $t=t^*/\sqrt{z}$ 重新标度，使得半圆形态密度（半带宽 $D=2t$）可以在自洽循环中被解析求值：

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

关于在不同格子上进行同样的比较，请参见 [DMFT-08 格子](../dmft08)。

### 方法选择

CT-HYB、CT-INT 与 Hirsch-Fye 建立在互不相关的近似之上：CT-HYB 对杂化做展开，在强耦合下效率最高；CT-INT 对相互作用做展开，在弱到中等耦合下效率最高；Hirsch-Fye 将虚时间离散为 $N$ 个时间片，带有必须通过外推消除的系统性 $(\Delta\tau)^2$ 偏差（关于各自的细节，请参见 [DMFT-02](../dmft02)，以及 [DMFT-03](../dmft03#方法选择) 和 [DMFT-07](../dmft07#方法选择) 中的“方法选择”一节）。在 $U=3D/\sqrt{2}$ 处，这三种算法都没有明显处于对自己特别有利或不利的区域，这使得该点非常适合用来相互交叉验证：由于三个求解器不共享任何系统性偏差，凡是在三者收敛结果中都出现的特征——特别是随冷却出现的 $G(\tau)$ 反铁磁分裂——必定是物理模型与 DMFT 自洽性本身的性质，而不是某一特定蒙特卡罗算法的产物。

### 输出数据与绘图

与教程 02、03、07 中分别绘图不同，本教程的核心在于把三者叠加在同一张图上：

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

listobs = ['0']  # flavor 0

files = {
    'CT-HYB'     : 'tutorials/dmft-02-hybridization/parm_beta_12.0.h5',
    'CT-INT'     : 'tutorials/dmft-03-interaction/parm_beta_12.0.h5',
    'Hirsch-Fye' : 'tutorials/dmft-07-hirschfye/parm_beta_12.0.h5',
}

alldata = []
for solver, fname in files.items():
    data = pyalps.loadMeasurements([fname], respath='/simulation/results/G_tau', what=listobs, verbose=False)
    for d in pyalps.flatten(data):
        d.x = d.x*d.props["BETA"]/float(d.props["N"])
        d.props['label'] = solver
        alldata.append(d)

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-09: Neel transition at BETA=12, solver comparison')
pyalps.plot.plot(alldata)
plt.legend()
plt.show()
```

由于这是对三个独立随机模拟的比较，实际得到的数值取决于各自运行的 `SEED`、`MAX_TIME` 和计算机速度，但三条曲线应在各自的误差范围内一致——不过除非像 [DMFT-07](../dmft07#小结与展望) 中建议的那样做外推，否则 Hirsch-Fye 的 `N=16` 离散化偏差相对于 CT-HYB 和 CT-INT 会是可见的。你也可以从部分收敛的解而不是从头重新运行某个求解器：将所需的 `G0omega_output` 复制为新文件名，并在重新运行之前，在参数文件（或对应的 python 字典）中通过 `G0OMEGA_INPUT` 指定它。

### 小结与展望

用 CT-HYB、CT-INT 和 Hirsch-Fye 求解同一个 Néel 转变，并发现三者一致，这直接验证了 DMFT-02、DMFT-03 和 DMFT-07 收敛到的是同一物理，而不是各自求解器特有的伪影。

1. 将上面的合并图扩展到全部六个 $\beta$ 值（使用 `tutorial2_long.py`、`tutorial3_long.py` 和 `tutorial7_long.py`），重现完整的图 11 比较，在每个温度下都叠加三个求解器的结果。
2. 在固定运行时间的情况下，$\beta=12$ 时三个求解器中哪一个给出的误差棒最小？在更靠近顺磁一侧的 $\beta=6$ 处，这一排序是否会改变？
3. 在把 Hirsch-Fye 的结果纳入合并图之前，先将其外推到 $\Delta\tau\to0$（见 [DMFT-07](../dmft07#小结与展望)）。外推后的曲线是否明显更接近 CT-HYB 和 CT-INT？
4. [DMFT-06](../dmft06) 做了类似的跨求解器比较，但是在顺磁金属相中，并与 [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 图 15 中数值精确的精确对角化／Hirsch-Fye 基准做比较。比较这两种情形：求解器之间的一致性，在教程 06 的顺磁金属中更容易达到，还是在本教程所研究的反铁磁相中更容易达到？
