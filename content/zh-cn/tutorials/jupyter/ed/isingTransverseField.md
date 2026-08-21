---
title: 横场量子伊辛模型
description: "横场伊辛模型的 Jupyter md 文件"
toc: true
math: true
weight: 11
cascade:
    type: docs
---

### 引言

在本教程中，我们将研究临界自旋链，并建立它们与共形场论描述之间的联系。

我们所考虑的模型是临界伊辛链，其哈密顿量为

$$
H=J_{z} \sum_{\langle i,j \rangle} S^i_z S^j_z + \Gamma \sum_i S^i_x
$$

这里，第一个求和遍历所有最近邻格点对。$\Gamma$ 被称为横场；当 $\Gamma/J=\frac{1}{2}$ 时系统达到临界点。当 $\Gamma=0$ 时，对于 $J\gt 0$ 基态是反铁磁的，对于 $J \lt 0$ 基态是铁磁的。该系统是可以精确求解的（[P. Pfeuty, Annals of Physics 57, 79-90 (1970)](https://doi.org/10.1016/0003-4916(70)90270-8)）。

在上式中，$\Delta$ 指的是该场的标度维度。标度场以若干个组的形式出现：其中最低的一个被称为初级场，它伴随着无穷多个标度维度为 $\Delta + m$（$m \in \lbrace 1, 2, 3, ... \rbrace$）的后代场。

在伊辛模型的精确解中（[Pfeuty 的论文](https://doi.org/10.1016/0003-4916(70)90270-8)中的公式 (3.7)），长程关联函数被发现按如下方式衰减：
$$
\langle S^i_z S^{i+n}_z \rangle \sim n^{-2\times 1/8}
$$
$$
\langle S^i_y S^{i+n}_y \rangle \sim n^{-2\times(1+1/8)}
$$
$$
\langle S^i_x S^{i+n}_x \rangle \sim n^{-2\times 1}
$$
此外，我们预期恒等算符的标度维度为 0。

因此，我们预期在伊辛模型的共形场论中会出现标度维度 0、1/8、1、1+1/8。为了验证这一点，我们将根据 $E \rightarrow \frac{E-E_0}{(E_1-E_0)8}$ 对能谱中的所有能量进行重新标度。这将强制最低的两个态出现在我们预期的标度维度处；随后我们可以检验能谱的其余部分是否与此一致。

### 参数

| 参数 | 含义 | 值 |
|---|---|---|
| `LATTICE` | 用于该链的晶格 | `chain lattice` |
| `MODEL` | 哈密顿量族 | `spin` |
| `local_S` | 每个格点的自旋量子数 | `0.5` |
| `Jxy` | 面内（$S_xS_x+S_yS_y$）耦合，此处未使用 | `0` |
| `Jz` | 伊辛（$S_zS_z$）耦合 $J_z$ | `-1` |
| `Gamma` | 横场 $\Gamma$ | `0.5` |
| `NUMBER_EIGENVALUES` | 保留的低能本征态数目 | `5` |
| `L` | 链长 | `10, 12` |

当 `Jz=-1` 且 `Gamma=0.5` 时，$\Gamma/J=0.5$，这正是该模型的临界点。

### 晶格

`chain lattice` 是一个由 `L` 个格点组成的一维**周期性**环，伊辛耦合 $J_z$ 作用在键上，横场 $\Gamma$ 作用在每个格点上：

```
 Γ       Γ       Γ             Γ
 o--Jz---o--Jz---o--- ... ---o
 |                            |
 +------------ Jz ------------+
        （周期性环，L 个格点）
```

该环自身闭合：从最后一个格点连回第一个格点的键正是使晶格具有周期性的原因。在这里选择周期性边界条件有两个原因。周期性边界条件保持了平移对称性，因此每个本征态都携带一个明确定义的晶格动量——这正是下文中能谱所对应的 `TOTAL_MOMENTUM` 量子数。此外，周期性边界没有开放的末端，因此不存在会污染体相共形能谱的边缘态，并且共形场论标度维度的有限尺寸修正也比在开放链上衰减得更快。如果你想使用开放边界条件，ALPS 提供了 `open chain lattice`；关于内置晶格的完整列表，请参见 [ALPS 晶格库](../../../documentation/intro/latticehowtos)。

### 方法选择

自旋-1/2 链的完整希尔伯特空间维度为 $2^L$——对于 $L=10$ 为 $2^{10}=1024$，对于 $L=12$ 为 $2^{12}=4096$。由于我们只需要最低的几个本征态（而非完整能谱），`sparsediag` 所实现的迭代兰索斯算法是自然的选择：与完全对角化相比，它能以少得多的矩阵-向量乘法次数收敛到最低的本征值，而本例中的两个希尔伯特空间维度都远在其处理能力之内（每个系统尺寸的运行时间远小于一秒）。

### 模拟

我们首先导入一些模块：


```python
import pyalps
import pyalps.plot
import numpy as np
import matplotlib.pyplot as plt
import copy
import math
```

接下来，让我们为两个系统尺寸设置参数。请注意使用横场 $\Gamma$，而不是纵向场 $h$。


```python
# 不同晶格尺寸下的一些通用参数：
parms = []
for L in [10,12]:
    parms.append({
        'LATTICE'    : "chain lattice",
        'MODEL'      : "spin",
        'local_S'    : 0.5,
        'Jxy'        : 0,
        'Jz'         : -1,
        'Gamma'      : 0.5,
        'NUMBER_EIGENVALUES' : 5,
        'L'          : L
    })

```

如你所见，我们将模拟两个系统尺寸。现在让我们设置输入文件并运行模拟：


```python
prefix = 'ising'
input_file = pyalps.writeInputFiles(prefix,parms)
res = pyalps.runApplication('sparsediag', input_file)
# res = pyalps.runApplication('sparsediag', input_file, MPI=2, mpirun='mpirun')
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
```


为了进行共形场论标度维度的指认，我们需要计算每个 L 对应的基态和第一激发态。
上述加载操作的输出将是一个按 L 排序的分层列表，因此我们只需遍历它即可


```python
E0 = {}
E1 = {}
for Lsets in data:
    L = pyalps.flatten(Lsets)[0].props['L']
    # 把所有能量值汇总成一个大列表
    allE = []
    for q in pyalps.flatten(Lsets):
        allE += list(q.y)
    allE = np.sort(allE)
    E0[L] = allE[0]
    E1[L] = allE[1]
```

减去 E0，除以能隙，再乘以 1/8——我们知道这是伊辛共形场论中最小的非零标度维度


```python
for q in pyalps.flatten(data):
    L = q.props['L']
    q.y = (q.y-E0[L])/(E1[L]-E0[L]) * (1./8.)

spectrum = pyalps.collectXY(data, 'TOTAL_MOMENTUM', 'Energy', foreach=['L'])
```

绘制前几个已知的精确标度维度


```python
for SD in [0.125, 1, 1+0.125, 2]:
    d = pyalps.DataSet()
    d.x = np.array([0,4])
    d.y = SD+0*d.x
    # d.props['label'] = str(SD)
    spectrum += [d]

pyalps.plot.plot(spectrum)

plt.legend(prop={'size':8})
plt.xlabel("$k$")
plt.ylabel("$E_0$")

plt.xlim(-0.02, math.pi+0.02)

plt.show()

```

模拟结果如图所示：
![Energy scaling for quantum ising model.](/figs/ed/energyscaling.png)

### 结果

在临界点（$J_z=-1$，$\Gamma=0.5$）运行上述代码，得到原始的基态和第一激发态能量：

| $L$ | $E_0$ | $E_1$ | $E_1-E_0$ |
|---|---|---|---|
| 10 | -3.19623 | -3.15688 | 0.03935 |
| 12 | -3.83065 | -3.79788 | 0.03277 |

经过重新标度 $E \rightarrow (E-E_0)/[(E_1-E_0)\times 8]$ 后，这两个态按构造映射到标度维度 $0$ 和 $1/8$；图中展示了其余低能能谱是否落在预期值 $1$ 和 $1+1/8$ 附近。

### 总结与展望

有限尺寸临界伊辛链的重标度激发能谱重现了 $c=1/2$ 共形场论所预言的标度维度 $0,\ 1/8,\ 1,\ 1+1/8$，证实了该晶格模型低能扇区与场论识别的一致性。

1. 当 $L$ 增大到超过 12 时，与共形场论预言的符合程度会如何变化？
2. 当偏离临界点（$\Gamma/J \neq 0.5$）时，能谱会如何变化？
3. 你能否确定 $1+1/8$ 之上下一组后代场的标度维度？
