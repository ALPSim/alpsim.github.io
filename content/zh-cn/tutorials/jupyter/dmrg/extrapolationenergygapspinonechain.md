---
title: 自旋-1链能隙的外推
description: "用于自旋-1链DMRG能隙外推计算的Jupyter md文件"
toc: true
math: true
weight: 25
cascade:
    type: docs
---

在本教程中,我们将对自旋-1链在多种晶格尺寸(32、64、96 和 128)下进行多次 DMRG 模拟。我们将针对每个晶格尺寸计算能隙,并根据能隙与晶格尺寸之间已知的解析关系,将能隙外推至热力学极限 $L\rightarrow\infty$ 下的取值。我们的 DMRG 模拟将保持固定的态数 $D=200$。

该哈密顿量是自旋-1海森堡交换模型(参见 [W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601));下文中用于外推能隙的解析 $1/L^2$ 标度关系来自 [F.D.M. Haldane, Physics Letters A 93, 464-468 (1983)](https://doi.org/10.1016/0375-9601(83)90631-X)。

### 参数

| 参数 | 含义 | 取值 |
|---|---|---|
| `LATTICE` | 链所用的晶格 | `open chain lattice` |
| `MODEL` | 哈密顿量所属模型族 | `spin` |
| `local_S` | 每个格点的自旋量子数 | `1` |
| `CONSERVED_QUANTUMNUMBERS` | 基组中固定的量子数 | `Sz` |
| `Sz_total` | 总磁化强度分区 | `0` |
| `J` | 海森堡交换耦合 | `1` |
| `SWEEPS` | DMRG 扫描次数 | `5` |
| `L` | 链长 | `32, 64, 96, 128` |
| `MAXSTATES` | 保留的 DMRG 基态数 | `200` |
| `NUMBER_EIGENVALUES` | 保留的低能本征态数目 | `4` |

### 晶格

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （L = 32、64、96 或 128 个格点，每个格点自旋为 1，开放边界条件）
```

与单一尺寸自旋-1能隙教程中使用的 `open chain lattice` 相同,这里在四种长度下重复模拟,以用于 $1/L^2$ 外推。其他内置晶格请参见 [ALPS 晶格库](../../../documentation/intro/latticehowtos)。

### 方法选择

在 $L=128$ 时未截断的希尔伯特空间维数为 $3^{128}\approx3\times10^{61}$,这使得 DMRG 成为唯一可行的方法。由于这些运行被限制在 `Sz_total = 0` 扇区,而开链的四态边缘态多重态在该扇区中表现为一对近简并的态,因此这里要求 `NUMBER_EIGENVALUES=4`(而不是 2),以便在同一次运行中同时求解出这一对态和第一激发的一对态——而且,正如下文结果所示,在较小的 $L$ 下有效的固定 `SWEEPS=5` 并不会随着 $L$ 增大而自动足以使该二重态干净地收敛。

我们首先导入所需的库。


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

我们为多次运行准备不同晶格尺寸(32、64、96 和 128)下的输入文件。


```python
parms= []
for lattice in [32, 64, 96, 128]:
    parms.append({
            'LATTICE'                   : "open chain lattice",
            'MODEL'                     : "spin",
            'local_S'                   : '1',
            'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
            'Sz_total'                  : 0,
            'J'                         : 1,
            'SWEEPS'                    : 5,
            'L'                         : lattice,
            'MAXSTATES'                 : 200,
            'NUMBER_EIGENVALUES'        : 4
        })
```

请注意,我们将在每次 DMRG 运行中保留最低的 4 个能量,因为从前一个教程中已知 `Sz_total = 0` 扇区包含两个近简并的边缘态。

接下来我们写入输入文件并运行模拟。注意:模拟将耗费一定时间(根据计算机系统的不同,大约需要 20 到 30 分钟)。你可以让它继续运行,稍后再回来查看!


```python
input_file = pyalps.writeInputFiles('parm_spin_one_gap_multiple',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

当所有模拟完成后,我们加载所有晶格的全部测量结果,并按晶格尺寸对结果进行排序。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_gap_multiple'))

sorted_data = sorted(data, key=lambda x: x[0].props['L'])
```

我们创建了一个用于 pyalps 绘图函数的数据集。每个晶格尺寸对应的能隙也包含在该数据集中。


```python
gapplot = pyalps.DataSet()
gapplot.props['xlabel']='$1/L^2$'
gapplot.props['ylabel']='Gap $\Delta/J$'
gapplot.props['label']='D=200'
gapplot.props['line']='.'

x = []
y = []
for measure in sorted_data:
    for s in measure:
        if s.props['observable'] == 'Energy':
            L = s.props['L']
            iL = (1.0/L)**2
            gap = abs(s.y[2] - s.y[1])
            s.props['gap'] = gap
            x.append(iL)
            y.append(gap)

gapplot.x = x
gapplot.y = y
```

请注意,这里的 $x$ 轴是 $1/L^2$,这与自旋-1/2 的情形不同。这是由于能隙与晶格尺寸之间的解析关系所致,霍尔丹利用非线性 σ 模型分析了 $k=\pi$ 附近最低激发态的这一关系,
$$
E(k)=E_0+\sqrt{\Delta^2+c^2(k-\pi)^2}.
$$
对于开放边界条件,我们可以用 $1/L$ 来近似 $k-\pi$,由此得到有限系统的能隙为
$$
\Delta(L)\approx\Delta(1+\frac{c^2}{2\Delta^2L^2}).
$$
这表明在渐近极限下,能隙的收敛应当按照 $1/L^2$ 的方式进行。

因此,我们绘制能隙相对于 $1/L^2$ 的关系图,并用一条直线进行拟合。拟合曲线(绘制在同一张图中)与纵轴的截距即为热力学极限 $L\rightarrow\infty$ 下的能隙值。


```python
# 为绘图创建数据集：能隙关于 (1/L)^2
gapplot = pyalps.DataSet()
gapplot.props['xlabel']='$1/L^2$'
gapplot.props['ylabel']='Gap $\Delta/J$'
gapplot.props['label']='D=200'
gapplot.props['line']='.'

x = []
y = []
for measure in sorted_data:
    for s in measure:
        if s.props['observable'] == 'Energy':
            L = s.props['L']
            iL = (1.0/L)**2
            gap = abs(s.y[2] - s.y[1])
            s.props['gap'] = gap
            x.append(iL)
            y.append(gap)

gapplot.x = x
gapplot.y = y

# 绘制能隙关于 (1/L)^2 的曲线：
plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.0011)
plt.ylim(0.3,0.5)

# 用线性函数拟合曲线
pars = [fw.Parameter(0.1), fw.Parameter(0.2)]
f = lambda self, x, p: p[0]()+p[1]()*x
fw.fit(None, f, pars, np.array(gapplot.y), np.array(gapplot.x))

# 绘制拟合曲线
x = np.linspace(0.0, 0.0011, 100)
plt.plot(x, f(None,x,pars))

print("Gap at thermodynamic limit: ", pars[0]())

plt.show()
```

最终得到的能隙值应接近 $\Delta/J\approx0.4105$,即数值确定的霍尔丹能隙值。所得图像应类似于下图:
![自旋-1链的能隙](/figs/dmrg/extrapolationGapSOne.png)

### 结果

运行以上代码可得到:

| $L$ | $1/L^2$ | 能隙 $\Delta/J$ |
|---|---|---|
| 32 | 0.000977 | 0.47255 |
| 64 | 0.000244 | 0.42770 |
| 96 | 0.000109 | 0.41869 |
| 128 | 0.000061 | 0.41503 |

在 $1/L^2$ 下的线性拟合外推到 $L\to\infty$ 处给出 $\Delta/J\approx0.4118$,与数值确定的霍尔丹能隙 $\Delta/J\approx0.4105$ 相差在 0.3% 以内。

**关于收敛性的说明:** 在本教程最初指定的 `SWEEPS=4`–`5` 下,DMRG 的扫描方案并不总能正确求解出 $L=128$ 处近简并的基态二重态,这可能会在最大的 $L$ 处产生一个异常值,从而破坏这一外推结果。如果你自己运行得到的 $L=128$ 处能隙异常偏小或不稳定,应增大 `SWEEPS`(此处取 10 就足够了),而不要盲目相信该结果——一般而言,$L$ 越大,要在相同的截断精度下收敛所需的扫描次数就越多。

### 总结与展望

在四种晶格尺寸下按 $1/L^2$ 外推自旋-1 DMRG 能隙,得到 $\Delta/J\approx0.412$,与霍尔丹能隙的差异不到百分之一——这是利用不同于精确对角化教程的独立方法(DMRG)对霍尔丹猜想的直接数值验证。

1. 为什么自旋-1的能隙按 $1/L^2$ 外推,而自旋-1/2 的能隙(参见配套教程)却按 $1/L$ 外推?
2. 在 $L=128$ 时,实际上需要多少次扫描才能使基态二重态的劈裂降到比如 $10^{-4}$ 以下?
3. 你会如何修改这段代码,以同时提取并绘制基态二重态劈裂随 $L$ 变化的关系图,从而检验它是否也在 $L\to\infty$ 时趋于零?
