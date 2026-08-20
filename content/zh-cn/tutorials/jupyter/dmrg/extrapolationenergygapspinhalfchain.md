---
title: 自旋-1/2链能隙的外推
description: "关于自旋-1/2链DMRG能隙计算的Jupyter md文件"
toc: true
math: true
weight: 23
cascade:
    type: docs
---

在本教程中，我们将计算自旋-1/2链在多种晶格尺寸(32、64、96和128)下的能隙。我们将DMRG模拟中保留的态数固定为$D=100$，这样可以得到足够精确的结果。我们将绘制能隙随晶格尺寸变化的关系图，并将其外推到热力学极限。

该哈密顿量是反铁磁海森堡交换模型，最早由[W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601)提出:
$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j, \qquad J>0.
$$
对于自旋-1/2链，已知在热力学极限下能隙以$1/L$的形式趋于闭合，这正是下文所拟合的标度形式。

### 参数

| 参数 | 含义 | 取值 |
|---|---|---|
| `LATTICE` | 用于该链的晶格 | `open chain lattice` |
| `MODEL` | 哈密顿量所属的模型族 | `spin` |
| `CONSERVED_QUANTUMNUMBERS` | 基组中固定的量子数 | `Sz` |
| `Sz_total` | 总磁化强度所在的子空间 | `0` |
| `J` | 海森堡交换耦合 | `1` |
| `SWEEPS` | DMRG扫描次数 | `4` |
| `L` | 链长 | `32, 64, 96, 128` |
| `MAXSTATES` | 保留的DMRG基态数目 | `100` |
| `NUMBER_EIGENVALUES` | 保留的低能本征态数目 | `2` |

### 晶格

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （L = 32、64、96 或 128 个格点，开放边界条件）
```

与单一尺寸能隙教程中使用的`open chain lattice`相同，这里在四种长度下重复计算，以便将有限尺寸能隙外推到$L\to\infty$。其他内置晶格请参见[ALPS晶格库](../../../documentation/intro/latticehowtos)。

### 方法选择

在$L=128$时，未截断的希尔伯特空间为$2^{128}$，远超出精确对角化的能力范围；使用固定`MAXSTATES=100`的DMRG方法，可以使各个尺寸下的计算都保持可行，同时仍能足够精确地求解能隙，满足下文$1/L$外推的需要。四种尺寸的计算合在一起运行时间远小于一分钟。

我们首先导入所需的库。


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

我们为多次运行准备具有不同晶格尺寸的输入文件。


```python
parms= []
for lattice in [32, 64, 96, 128]:
    parms.append({
            'LATTICE'                   : "open chain lattice",
            'MODEL'                     : "spin",
            'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
            'Sz_total'                  : 0,
            'J'                         : 1,
            'SWEEPS'                    : 4,
            'L'                         : lattice,
            'MAXSTATES'                 : 100,
            'NUMBER_EIGENVALUES'        : 2
        })
```

注意，我们已经设置了DMRG模拟中保留的最大态数。最低的两个本征值将被保留下来，用于计算能隙。

接下来我们写出输入文件并运行模拟。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_gap_multiple',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

模拟完成后，我们加载所有晶格的全部测量结果，并按晶格尺寸对结果进行排序。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap_multiple'))

sorted_data = sorted(data, key=lambda x: x[0].props['L'])
```

我们为pyalps绘图函数创建一个数据集。每种晶格尺寸对应的能隙也被包含在该数据集中。


```python
gapplot = pyalps.DataSet()
gapplot.props['xlabel']='$1/L$'
gapplot.props['ylabel']='Gap $\Delta/J$'
gapplot.props['label']='D=100'
gapplot.props['line']='.'

x = []
y = []
for measure in sorted_data:
    for s in measure:
        if s.props['observable'] == 'Energy':
            L = s.props['L']
            iL = 1.0/L
            gap = abs(s.y[1] - s.y[0])
            s.props['gap'] = gap
            x.append(iL)
            y.append(gap)

gapplot.x = x
gapplot.y = y
```

我们绘制能隙随$1/L$变化的关系图，并用线性曲线对其进行拟合。拟合曲线也绘制在同一张图中。


```python
# 绘制能隙关于 1/L 的曲线：
plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.04)
plt.ylim(0,0.2)

# 用线性函数拟合曲线
pars = [fw.Parameter(0.1), fw.Parameter(0.2)]
f = lambda self, x, p: p[0]()+p[1]()*x
fw.fit(None, f, pars, np.array(gapplot.y), np.array(gapplot.x))

# 绘制拟合曲线
x = np.linspace(0.0, 0.035, 100)
plt.plot(x, f(None,x,pars))

print("Gap at thermodynamic limit: ", pars[0]())

plt.show()
```

最终的能隙图应如下所示:
![Energy Gap of a Spin-1/2 Chain](/figs/dmrg/extrapolationGapSHalf.png)

### 结果

运行上述代码可得到:

| $L$ | $1/L$ | Gap $\Delta/J$ |
|---|---|---|
| 32 | 0.03125 | 0.11774 |
| 64 | 0.01563 | 0.06176 |
| 96 | 0.01042 | 0.04205 |
| 128 | 0.00781 | 0.03194 |

在$1/L$下进行的线性拟合外推到$L\to\infty$时给出$\Delta/J\approx0.0040$——在拟合的有限尺寸系统误差范围内与零一致，这证实了自旋-1/2海森堡链是无能隙的。

### 总结与展望

通过DMRG计算得到的自旋-1/2海森堡链能隙随$1/L$近似线性缩小，并外推至基本为零，证实该链在热力学极限下是无能隙的——这与自旋-1链所具有的有限哈尔丹能隙形成了直接对比。

1. 在$1/L$下进行严格的线性拟合是否是此处的最佳选择，还是包含对数修正的形式(如场论对自旋-1/2链所预测的那样)能拟合得更好？
2. 如果加入更大的晶格尺寸，例如$L=160,192$，外推得到的能隙会如何变化？
3. 将这一外推结果与自旋-1的情形进行比较：为什么后者外推得到的是有限能隙而不是零？
