---
title: 自旋链的基态能量
description: "用于自旋链DMRG能量计算的Jupyter md文件"
toc: true
math: true
weight: 21
cascade:
    type: docs
---

在这个示例中，我们将使用密度矩阵重整化群（DMRG）模拟来研究一条具有开放边界条件的32格点自旋二分之一海森堡链的基态能量。我们将考察基态能量的收敛情况，以及截断误差随迭代次数的衰减情况。

哈密顿量是反铁磁海森堡交换模型，最早由[W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601)提出：
$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j, \qquad J>0.
$$
DMRG方法本身由[S.R. White, Physical Review Letters 69, 2863-2866 (1992)](https://doi.org/10.1103/PhysRevLett.69.2863)提出。

### 参数

| 参数 | 含义 | 取值 |
|---|---|---|
| `LATTICE` | 用于该链的晶格 | `open chain lattice` |
| `MODEL` | 哈密顿量所属的模型族 | `spin` |
| `CONSERVED_QUANTUMNUMBERS` | 基组中固定的量子数 | `N,Sz` |
| `Sz_total` | 总磁化强度分区 | `0` |
| `J` | 海森堡交换耦合 | `1` |
| `SWEEPS` | DMRG扫描次数 | `4` |
| `NUMBER_EIGENVALUES` | 保留的低能本征态数目 | `1` |
| `L` | 链长 | `32` |
| `MAXSTATES` | 保留的DMRG基组态数目 | `100` |

### 晶格

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （32 个格点，开放边界条件）
```

一条由32个格点组成的`open chain lattice`——这是验证新DMRG设置是否正确收敛的标准、最简单的测试用例，之后才会用于更复杂的计算。其他内置晶格请参见[ALPS晶格库](../../../documentation/intro/latticehowtos)。

### 方法选择

完整的希尔伯特空间维度为$2^{32}\approx4.3\times10^9$，远超精确对角化的能力范围。采用`MAXSTATES=100`的DMRG方法能够以变分方式在少数几次扫描内找到基态，并且——与精确对角化不同——还能直接给出下文将要考察的逐次扫描收敛历史。

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'L'                         : 32,
        'MAXSTATES'                 : 100
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

接下来，我们加载由DMRG代码测得的基态属性

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))
```

并将其打印到终端。

```python
for s in data[0]:
    print(s.props['observable'], ' : ', s.y[0])
```

此外，我们还可以加载每个迭代步骤的详细数据。

```python
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                          what=['Iteration Energy','Iteration Truncation Error'])
```

以上数据使我们能够观察DMRG算法是如何收敛到最终结果的。

最后，我们绘制基态能量和截断误差随迭代次数变化的收敛曲线。

```python
plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('Iteration history of ground state energy (S=1/2)')
plt.ylim(-15,0)
plt.ylabel('$E_0$')
plt.xlabel('iteration')

plt.figure()
pyalps.plot.plot(iter[0][1])
plt.title('Iteration history of truncation error (S=1/2)')
plt.yscale('log')
plt.ylabel('error')
plt.xlabel('iteration')

plt.show()
```

基态能量随迭代次数变化的收敛情况如下图所示。
![Ground State Energy](/figs/dmrg/dmrg_energy.png)

我们还可以观察截断误差随迭代次数增加而衰减的情况。
![Truncation Error](/figs/dmrg/dmrg_truncation.png)

### 结果

运行上述代码可得到收敛后的基态能量为

$$E_0 = -13.997316$$

最终截断误差为$4.4\times10^{-14}$——可以忽略不计，这表明对于该链长而言，`MAXSTATES=100`已经绰绰有余。

### 总结与展望

DMRG在少数几次扫描内就使32格点自旋1/2海森堡链的基态能量收敛到$E_0=-13.9973$，其截断误差比问题的能量尺度低出许多数量级。

1. 要使能量在小数点后第6位不再变化，实际需要多少次扫描？
2. 收敛后的$E_0/L$与热力学极限下的精确值（每格点$-\ln2+1/4\approx-0.4431$）相比如何？
3. 如果将`MAXSTATES`降低到20，截断误差会发生什么变化？
