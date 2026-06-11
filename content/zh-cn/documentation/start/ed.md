---
title: 精确对角化
linkTitle: 精确对角化
description: "使用稀疏精确对角化方法计算 S=1 海森堡链的 Haldane 能隙。"
weight: 6
math: true
---

{{< callout type="info" >}}
本教程假设 pyalps 已完成安装。如果尚未安装，请参阅[入门指南](../)。
{{< /callout >}}

## 什么是精确对角化？

**精确对角化（ED）**是求解量子多体问题最直接的方法：在多体态的基矢下显式构建哈密顿矩阵，然后求其本征值和本征矢。结果在数值上是精确的——没有近似，没有符号问题，没有采样误差。代价在于计算量：对于 $L$ 格点、自旋量子数为 $S$ 的链，希尔伯特空间的维数为 $(2S+1)^L$，随系统尺寸指数增长。对于 $S=1$，这意味着 $L=16$ 时有 $3^{16} \approx 4300$ 万个状态，$L=20$ 时有 $3^{20} \approx 35$ 亿个——即便使用大型计算机也已处于可行性的边缘。

ALPS 通过 Lanczos 算法实现**稀疏对角化**：不对完整矩阵进行对角化，而是从反复的矩阵-向量乘积 $H|\psi\rangle$ 中构建一个小的 Krylov 子空间，并从中提取最低的几个本征值。这是可行的，因为海森堡哈密顿量极为稀疏——每个基态只与 $O(L)$ 个其他基态相连（每个键一个），所以每次矩阵-向量乘积的代价是 $O(L \cdot \mathrm{dim})$ 而非 $O(\mathrm{dim}^2)$。

ED 与 QMC 互补：它能给出零温下的精确基态和低能谱，对任何模型（无论是否存在符号问题）均适用，但受限于 Lanczos 可处理的系统尺寸（$S=1$ 时 $L \lesssim 20$）。

## 物理模型：S=1 海森堡链

本教程研究一维链上的反铁磁海森堡模型，

$$
H = J \sum_{i=1}^{L} \mathbf{S}_i \cdot \mathbf{S}_{i+1}, \quad J > 0,
$$

其中每个 $\mathbf{S}_i$ 是自旋-1 算符。该模型描述了具有反铁磁最近邻交换耦合的磁矩链。

### Haldane 猜想

1983 年，Duncan Haldane 提出了一个令人惊讶的预言：整数自旋反铁磁链（$S = 1, 2, \ldots$）的基态具有**能隙**——产生任何激发态都需要有限的能量代价 $\Delta$。相反，半整数自旋链（$S = 1/2, 3/2, \ldots$）是**无能隙**的，低能激发谱一直延伸到零能。

这一预言出人意料，因为经典直觉和简单平均场论文认为两种情况应表现相似。这种差异源于量子场论描述中的拓扑项——它在半整数自旋时存在，而整数自旋时则不存在。Haldane 猜想最初颇具争议，但此后通过高精度数值计算和实验（如 NENP 等镍化合物）得到了证实。

对于 $S = 1$ 链，能隙在热力学极限（$L \to \infty$）下收敛至

$$
\Delta \approx 0.411\,J.
$$

在长度为 $L$ 的有限链上，表观能隙更大，并指数收敛至热力学值：

$$
\Delta(L) \approx \Delta + A\, e^{-L/\xi},
$$

其中 $\xi \approx 6$ 是 Haldane 相的关联长度。由于 $\xi$ 并不小，即便是 $L = 16$ 的链也仍有显著的有限尺寸修正——这正是需要仔细外推的原因。

## 计算策略

我们将：
1. 对链长 $L \in \{4, 6, 8, 10, 12, 14, 16\}$ 运行 `sparsediag`；
2. 对每个 $L$，计算 $S_z = 0$ 扇区（单重态基态）和 $S_z = 1$ 扇区（最低三重态）的最低能量；
3. 构建能隙 $\Delta(L) = E_0(S_z=1,L) - E_0(S_z=0,L)$；
4. 拟合指数有限尺寸公式，提取 $\Delta$。

## 导入模块

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

## 量子数扇区

在查看代码之前，有必要理解为什么每个链长要运行两次对角化——一次用 `Sz_total=0`，一次用 `Sz_total=1`。

海森堡哈密顿量与总磁化强度 $S_z^{\text{total}} = \sum_i S_z^i$ 对易，即总 $S_z$ 守恒：$[H, S_z^{\text{total}}] = 0$。因此，完整希尔伯特空间可以分块对角化为以 $S_z^{\text{total}}$ 标记的独立扇区，每个扇区可以独立进行对角化。

这正是 ED 可行的关键。对于 $L = 16$，$S = 1$，完整希尔伯特空间维数约为 4300 万；$S_z = 0$ 扇区维数约为 1400 万——更小，而且 ALPS 还利用了平移对称性和宇称，将有效维数进一步缩小 $2L$ 倍。

**反铁磁体的单重态基态**位于 $S_z = 0$ 扇区。**最低三重态激发**——总自旋为 1 的第一个态——在 $S_z = 1$ 扇区中表现为基态。两者的能量差即为三重态能隙。

## 参数与输入文件

```python
parms = []
for l in [4, 6, 8, 10, 12, 14, 16]:
    for sz in [0, 1]:
        parms.append(
          {
            'LATTICE'                  : "chain lattice",
            'MODEL'                    : "spin",
            'local_S'                  : 1,               # S=1 自旋链
            'J'                        : 1,               # 反铁磁交换（设定能量尺度）
            'L'                        : l,               # 链长
            'CONSERVED_QUANTUMNUMBERS' : 'Sz',            # 告诉 ALPS 在 Sz 扇区中分块对角化
            'Sz_total'                 : sz               # 目标扇区（0=单重态，1=三重态）
          }
        )

input_file = pyalps.writeInputFiles('parm2a', parms)
```

`writeInputFiles` 以 ALPS 格式创建 XML 输入文件供 `sparsediag` 读取。前缀 `'parm2a'` 用于命名输出文件。

## 运行求解器

```python
res = pyalps.runApplication('sparsediag', input_file)
```

`sparsediag` 对每组参数运行 Lanczos 算法。对于每个 $(L, S_z)$ 组合，它进一步利用平移对称性在 $S_z$ 扇区内进行分块——实际上是对每个格点动量 $k = 0, \frac{2\pi}{L}, \ldots, \frac{2\pi(L-1)}{L}$ 分别求解一个更小的矩阵。结果存储在以前缀命名的 HDF5 文件中。

## 加载结果与数据结构

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm2a'))
```

`data` 是一个按参数集排列的模拟列表。其中每个元素 `sim` 本身是 `DataSet` 对象的列表——在选定的 $S_z$ 扇区内每个格点动量子扇区对应一个。每个 `DataSet` 包含：
- `sec.props`：本次运行的参数（包括 `'L'`、`'Sz_total'`、`'TOTAL_MOMENTUM'` 等）；
- `sec.y`：该动量子扇区中求得的本征值数组。

## 提取能隙

由于每个 $S_z$ 扇区中基态可以具有任意格点动量，我们收集所有 $k$ 子扇区的本征值并取全局最小值：

```python
lengths      = []
min_energies = {}
for sim in data:
    l  = int(sim[0].props['L'])
    if l not in lengths: lengths.append(l)
    sz = int(sim[0].props['Sz_total'])
    all_energies = []
    for sec in sim:          # 遍历该 (L, Sz) 运行中的各 k 子扇区
        all_energies += list(sec.y)
    min_energies[(l, sz)] = np.min(all_energies)
```

循环结束后，`min_energies[(l, 0)]` 是单重态扇区的基态能量，`min_energies[(l, 1)]` 是三重态扇区的基态能量。

## 有限尺寸外推

每个有限尺寸的能隙为：

$$
\Delta(L) = E_0(S_z=1,\, L) - E_0(S_z=0,\, L).
$$

我们对 $1/L$ 作图，并拟合指数有限尺寸修正：

$$
\Delta(L) = \Delta + A\, e^{-L/\xi}.
$$

注意横轴为 $1/L$（热力学极限对应 $x = 0$），但拟合函数 `f` 以 $L$ 为参数并通过 `1/x` 调用。`fw.Parameter` 对象存储拟合参数；`fw.fit` 运行后，`p[0]()` 给出 $\Delta$ 的拟合值，`p[1]()` 给出 $A$，`p[2]()` 给出 $\xi$。

我们只拟合 $L \geq 8$（索引 `[2:]` 跳过 $L = 4$ 和 $L = 6$），以避免最小链长上出现的最大标度修正：

```python
gapplot = pyalps.DataSet()
gapplot.x = 1./np.sort(lengths)
gapplot.y = [min_energies[(l,1)] - min_energies[(l,0)] for l in np.sort(lengths)]
gapplot.props['xlabel'] = '$1/L$'
gapplot.props['ylabel'] = '三重态能隙 $\Delta/J$'
gapplot.props['label']  = 'S=1'
gapplot.props['line']   = '.'

plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0, 0.25)
plt.ylim(0, 1.0)

# 初始猜测：Delta~0.411（已知 Haldane 能隙），A~1000，xi~6
pars = [fw.Parameter(0.411), fw.Parameter(1000), fw.Parameter(6)]
f = lambda self, x, p: p[0]() + p[1]()*np.exp(-x/p[2]())
fw.fit(None, f, pars, np.array(gapplot.y)[2:], np.sort(lengths)[2:])  # 拟合 L >= 8

x = np.linspace(0.0001, 1./min(lengths), 100)
plt.plot(x, f(None, 1/x, pars))

plt.show()
```

## 结果

拟合曲线在 $1/L = 0$ 处的纵轴截距给出 $\Delta \approx 0.411\,J$——与已知的最优数值结果吻合（White & Huse, 1993：$\Delta = 0.41048\,J$）。这证实了 Haldane 相的存在，并验证了 ALPS `sparsediag` 求解器的正确性。

图中显示三重态能隙随 $L$ 增大而减小，拟合曲线捕捉到了指数收敛行为：

![S=1 海森堡链三重态能隙随 1/L 的变化，外推至 Haldane 能隙](/figs/ED_spin.png)
