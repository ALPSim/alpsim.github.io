---
title: 贝特晶格上哈伯德模型的DMFT
description: "用于DMFT格林函数的Jupyter md文件"
toc: true
math: true
weight: 31
cascade:
    type: docs
---

强关联电子系统的动力学平均场理论(DMFT)基于将晶格模型映射到满足自洽条件的量子杂质模型[A. Georges, G. Kotliar, W. Krauth, and M.J. Rozenberg, Reviews of Modern Physics 68, 13-125 (1996)](https://doi.org/10.1103/RevModPhys.68.13)。在晶格配位数很大或空间维度趋于无穷的极限下，这一映射对于关联电子模型是精确的。贝特晶格是一个具有无穷空间维度的典型晶格实例，可以用ALPS中的DMFT进行模拟。

### 贝特晶格
下图展示了一个贝特晶格的示例，其中每个晶格格点的配位数为3。该晶格的有效维度为无穷大。因此，它为在此类晶格上实现DMFT提供了很好的机会，可以对DMFT方法进行基准测试和探索。
![Bethe Lattice](/figs/dmft/betheLattice.png)

### 哈伯德模型
我们将用DMFT模拟定义在贝特晶格上的哈伯德模型。该哈伯德模型的定义如下。
$$
H = -t \sum_{\langle i,j \rangle, \sigma} \left( c_{i,\sigma}^\dagger c_{j,\sigma} + \text{h.c.} \right) + U \sum_i n_{i,\uparrow} n_{i,\downarrow},
$$

其中

- $c_{i,\sigma}^\dagger$ 和 $c_{i,\sigma}$ 分别是格点$i$处自旋味$\sigma$（向上$\uparrow$或向下$\downarrow$）费米子的产生和湮灭算符，$\text{h.c.}$表示厄米共轭。
- $t$ 是相邻格点$\langle i,j \rangle$之间的跃迁振幅。
- $U$ 是在位相互作用能，$U > 0$对应于排斥相互作用。
- $n_{i,\sigma} = c_{i,\sigma}^\dagger c_{i,\sigma}$ 是格点$i$处自旋味$\sigma$费米子的数目算符。

### 参数

| 参数 | 含义 | 值 |
|---|---|---|
| `SOLVER` | 杂质求解器算法 | `Interaction Expansion` (CT-INT QMC) |
| `U` | 在位哈伯德排斥相互作用 | `3` |
| `t` | 跃迁振幅，针对贝特晶格重新标度 | `0.707106781...` ($=1/\sqrt{2}$) |
| `BETA` | 逆温度 $1/T$ | `6` (高$T$), `12` (低$T$) |
| `MU` | 化学势（半填充） | `0` |
| `FLAVORS` | 费米子味的数目（自旋向上/向下） | `2` |
| `SITES` | 杂质格点数 | `1` |
| `ANTIFERROMAGNET` | 允许对称性破缺的反铁磁解 | `1` |
| `H_INIT` | 初始对称性破缺场，用于引发反铁磁态 | `0.05` |
| `N`, `NMATSUBARA` | 虚时间/松原频率点的数目 | `500` |
| `SWEEPS`, `THERMALIZATION` | 蒙特卡洛扫描次数与热化步数 | `1e8`, `1000` |
| `MAX_IT`, `MAX_TIME` | DMFT自洽迭代次数，每次迭代的墙钟时间上限（秒） | `10`, `10` |
| `CONVERGED` | 自洽收敛阈值 | `0.005` |

### 晶格

```
        o   o
         \ /
      o---o---o        每个格点有 z=3 个近邻，
         / \            以无回路的树状结构连接
        o   o            → 贝特晶格，配位数 z=3
```

之所以选用贝特晶格（一种无限的、无回路的树状结构），是因为它是在配位数趋于无穷的极限下使DMFT在数值上*精确*的最简单晶格——局域格林函数的自洽条件简化为`pyalps.runDMFT`内部所使用的简单半圆形态密度关系，其中跃迁$t$按$1/\sqrt{z}$重新标度（因此在无穷$z$极限下有效配位对应`t=1/sqrt(2)`），从而使能带宽度保持有限。关于DMFT只是近似方法的有限维晶格，请参见[ALPS晶格库](../../../documentation/intro/latticehowtos)。

### 方法选择

与ED/DMRG教程不同，这里的局域杂质问题是通过随机方法求解的：`Interaction Expansion`连续时间量子蒙特卡洛（CT-INT）求解器对$U$的幂级数展开图进行采样，而不是对哈密顿量进行对角化，这正是能够实现真正无穷配位数贝特晶格（没有需要截断的有限维希尔伯特空间）的关键所在。`MAX_TIME=10`将每次DMFT迭代的QMC采样时间限制为10秒，而不论名义上的`SWEEPS=1e8`设置为多少，因此两个温度下完整的`MAX_IT=10`次自洽迭代循环都能在几分钟内完成。

### 模拟
我们首先导入所需的模块。


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
```

接下来，我们将输入文件准备为一个由Python字典组成的列表。


```python
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
```

参数"BETA"表示逆温度，我们将在两个不同的温度下对系统进行模拟："BETA = 6"对应高温，"BETA = 12"对应低温。接下来我们写入输入文件并运行模拟。


```python
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

接下来我们加载模拟的结果。


```python
listobs=['0', '1']
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
```

最后，我们绘制单粒子格林函数$G$随虚时间$\tau$变化的图像并显示该图。


```python
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title("Green's Function vs. the Imaginary Time")
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

模拟得到的图像应如下所示：
![green fucntion gtau](/figs/dmft/greenTau.png)

该结果显示了贝特晶格上哈伯德模型的奈尔转变，系统在低温（"BETA = 12"）下的反铁磁态与高温（"BETA = 6"）下的顺磁态之间发生转变。

### 结果

运行上述代码后得到的虚时间区间两端的单粒子格林函数：

| $\beta$ | 味 | $G(\tau=0)$ | $G(\tau=\beta/2)$ |
|---|---|---|---|
| 6 | 0 (↑) | -0.4868 | -0.0759 |
| 6 | 1 (↓) | -0.5132 | -0.0776 |
| 12 | 0 (↑) | -0.8932 | -0.0039 |
| 12 | 1 (↓) | -0.1066 | -0.0037 |

在$\beta=6$时，两个自旋味几乎对称（$-0.487$对比$-0.513$）——这是顺磁解。在$\beta=12$时，两个自旋味出现强烈分裂（$-0.893$对比$-0.107$）——反铁磁对称性破缺场`H_INIT`已发展为稳健的交错磁化，表明系统在冷却过程中已经进入反铁磁有序相。

### 总结与展望

贝特晶格上的DMFT显示，半填充哈伯德模型在高温（$\beta=6$）下的顺磁解与低温（$\beta=12$）下的磁有序（奈尔）解之间发生转变，这可以直接从两个自旋味格林函数的分裂中看出。

1. 在6到12之间的哪个$\beta$值处，两个自旋味之间的分裂首次变得显著——你能否界定奈尔转变温度的范围？
2. 如果相互作用$U$从3增大到6，转变温度会如何变化？
3. 如果你另外通过`maxent`计算局域态密度，在顺磁相中你预期会看到什么？
