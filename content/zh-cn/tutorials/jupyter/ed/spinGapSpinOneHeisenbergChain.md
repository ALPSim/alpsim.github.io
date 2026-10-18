---
title: 自旋-1 海森堡链的自旋能隙
description: "用于自旋能隙计算的 Jupyter md 文件"
toc: true
math: true
weight: 12
cascade:
    type: docs
---

在本教程中，我们将学习如何使用稀疏对角化程序（兰索斯算法）计算一维自旋-1 海森堡链在不同晶格尺寸（$L=4, 6, 8$ 和 10）下的能隙。所得到的有限晶格能隙随后被用于外推热力学极限（$L=\infty$）下的能隙。

自旋-1 海森堡链的哈密顿量为

$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j,
$$

其中 $J>0$ 对应最近邻自旋 $\mathbf{S}^i$ 和 $\mathbf{S}^j$ 之间的反铁磁相互作用，自旋-自旋相互作用由三个分量组成，即

$$
\mathbf{S}^i \cdot \mathbf{S}^j=S^i_xS^j_x+S^i_yS^j_y+S^i_zS^j_z.
$$

基态通常选取为 $S_z$ 算符的本征态。对于自旋-1 系统，每个晶格格点有三个基态，$|-1\rangle$、$|0\rangle$ 和 $|+1\rangle$。$S_x$ 和 $S_y$ 算符对这些基态的作用可以用升算符 $S^{\dagger}$ 和降算符 $S^{-}$ 表示：

$$
S_x=\frac{1}{2}(S^{\dagger}+S^{-}),
$$

$$
S_y=\frac{1}{2i}(S^{\dagger}-S^{-}),
$$

它们对基态的作用方式为：

$$
S^{\dagger}|s\rangle = \sqrt{S(S+1)-s(s+1)}|s+1\rangle,
$$

$$
S^{-}|s\rangle = \sqrt{S(S+1)-s(s-1)}|s-1\rangle,
$$

其中 $S=1$，$s=-1, 0, +1$。

利用上述每个晶格格点的基态，哈密顿量可以写成一个厄米矩阵。当总磁化强度固定时，矩阵的规模可以被缩减，即在模拟中设置 Sz_total = 0（单重态区块）或 Sz_total = 1（三重态区块）。

海森堡交换哈密顿量最早由 [W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601) 提出。对于整数自旋链（如本例中的 $S=1$），[F.D.M. Haldane, Physics Letters A 93, 464-468 (1983)](https://doi.org/10.1016/0375-9601(83)90631-X) 预言——与无能隙的自旋-1/2 情形相反——在热力学极限下存在有限的激发能隙，现在称为霍尔丹能隙。

### 参数

| 参数 | 含义 | 值 |
|---|---|---|
| `LATTICE` | 链所使用的晶格 | `chain lattice` |
| `MODEL` | 哈密顿量所属的模型族 | `spin` |
| `local_S` | 每个格点的自旋量子数 | `1` |
| `J` | 海森堡交换耦合 $J$ | `1` |
| `L` | 链长 | `4, 6, 8, 10, 12, 14` |
| `CONSERVED_QUANTUMNUMBERS` | 基态中固定的量子数 | `Sz` |
| `Sz_total` | 总磁化强度区块 | `0`（单重态），`1`（三重态） |

### 晶格

`chain lattice` 是由 `L` 个自旋-1 格点通过最近邻交换 $J$ 耦合而成的一维**周期性**环：

```
 S=1     S=1     S=1           S=1
  o---J---o---J---o--- ... ---o
  |                           |
  +----------- J -------------+
        （周期性环，L 个格点）
```

从最后一个格点连回第一个格点的键将环闭合。周期性边界条件对本计算尤为重要：*开放的*自旋-1 链在其两端带有有效的 $S=1/2$ 自旋，由它们产生的近简并边缘态位于体能隙之内，因此在开放链上测得的单重态/三重态劈裂是一种边缘激发，而不是霍尔丹能隙。把链闭合成环则完全去除了端点，因此下面提取出的能隙正是外推所要求的体能隙。关于其他内置晶格（包括 `open chain lattice`），请参见 [ALPS 晶格库](../../../documentation/intro/latticehowtos)。

### 方法选择

对于自旋-1，局域希尔伯特空间的维数为 3，因此一个 $L$ 格点链的完整希尔伯特空间维数为 $3^L$——例如 $3^{14}\approx 4.8\times10^6$，在经过 `Sz_total` 限制之后会大幅减小。由于每个 `Sz_total` 区块中只需要最低能量，因此基于兰索斯算法的 `sparsediag` 仍然是合适的方法，而不需要完全对角化：本教程中使用的全部六种晶格尺寸（$L=4$ 到 $14$）总共在一分钟以内即可完成。

我们首先导入所需的模块。

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

然后我们将输入文件准备为一系列 Python 字典。

```python
parms = []
for l in [4, 6, 8, 10, 12, 14]:
  for sz in [0, 1]:
      parms.append(
        { 
          'LATTICE'                   : "chain lattice", 
          'MODEL'                     : "spin",
          'local_S'                   : 1,
          'J'                         : 1,
          'L'                         : l,
          'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
          'Sz_total'                  : sz
        }
      )

```

我们写入输入文件并运行模拟。

```python
input_file = pyalps.writeInputFiles('parm2a',parms)
res = pyalps.runApplication('sparsediag',input_file) #, MPI=4)
```

接下来我们加载每个系统尺寸和自旋区块的能谱：

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm2a'))
```

为了提取能隙，我们需要写几行 Python 代码，建立一个长度列表以及一个记录每个 (L,Sz) 区块最低能量的 Python 字典：

```python
lengths = []
min_energies = {}

for sim in data:
  l = int(sim[0].props['L'])
  if l not in lengths: lengths.append(l)
  sz = int(sim[0].props['Sz_total'])
  all_energies = []
  for sec in sim:
    all_energies += list(sec.y)
  min_energies[(l,sz)]= np.min(all_energies)
```

最后，我们绘制能隙关于 1/L 的函数图像并显示该图。

```python
gapplot = pyalps.DataSet()
gapplot.x = 1./np.sort(lengths)
gapplot.y = [min_energies[(l,1)] -min_energies[(l,0)] for l in np.sort(lengths)]  
gapplot.props['xlabel']='$1/L$'
gapplot.props['ylabel']='Triplet gap (J)'
gapplot.props['label']='S=1'
gapplot.props['line']='.'

plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.25)
plt.ylim(0,1.0)
```

然后我们对 L=8 到 L=14 范围内的数据进行拟合，以得到热力学极限（$L\rightarrow \infty$，即 $1/L\rightarrow 0$）下的能隙。

```python
pars = [fw.Parameter(0.411), fw.Parameter(1000), fw.Parameter(1)]
f = lambda self, x, p: p[0]()+p[1]()*np.exp(-x/p[2]())
fw.fit(None, f, pars, np.array(gapplot.y)[2:], np.sort(lengths)[2:])

x = np.linspace(0.0001, 1./min(lengths), 100)
plt.plot(x, f(None, 1/x, pars))

plt.show()
```

模拟结果如图所示：
![Fitted spin gap from simulations.](/figs/ed/spingap.png)

### 结果

运行上述代码得到以下有限尺寸三重态能隙以及外推值：

| $L$ | 能隙 $\Delta(L)/J$ |
|---|---|
| 4 | 1.00000 |
| 6 | 0.72063 |
| 8 | 0.59356 |
| 10 | 0.52481 |
| 12 | 0.48420 |
| 14 | 0.45897 |

将 $L=8$ 到 $14$ 的数据拟合到 $\Delta(L) = \Delta_\infty + A e^{-L/\xi}$，外推得到 $\Delta_\infty/J \approx 0.4218$，与数值上已知的霍尔丹能隙值 $\Delta/J \approx 0.4105$ 接近（约 3% 的偏差来自有限尺寸拟合误差，因为这里仅使用了 $L\le14$ 的数据）。

### 总结与展望

对有限自旋-1 海森堡链进行精确对角化，并外推至 $L\rightarrow\infty$，证实了整数自旋反铁磁链中预言的有限霍尔丹能隙——这与无能隙的自旋-1/2 链形成鲜明对比。

1. 如果在拟合中包含更大的 $L$，或只使用最大的三个尺寸，外推得到的能隙会如何变化？
2. 对于没有能隙的自旋-1/2 链，你预期能隙会呈现怎样的函数形式？
3. 外推得到的 $\Delta_\infty$ 对拟合范围的选择有多敏感？
