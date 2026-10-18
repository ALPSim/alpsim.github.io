---
title: 自旋-1/2链的能隙
description: "用于DMRG自旋-1/2链能隙计算的Jupyter md文件"
toc: true
math: true
weight: 22
cascade:
    type: docs
---

在本教程中，我们将使用DMRG模拟计算一个32格点自旋-1/2链的能隙。众所周知，对于自旋-1/2链，该能隙在热力学极限下趋近于0。

哈密顿量为反铁磁海森堡交换模型，最早由[W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601)提出：
$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j, \qquad J>0.
$$

该计算可以通过两种方法完成。第一种方法是在同一次DMRG模拟中直接计算基态和第一激发态的能量，两者之差即为能隙。第二种方法是通过将总自旋磁化强度固定为0或1，分别计算单重态和三重态两个自旋扇区中的基态能量。

### 参数

| 参数 | 含义 | 取值 |
|---|---|---|
| `LATTICE` | 链所使用的晶格 | `open chain lattice` |
| `MODEL` | 哈密顿量族 | `spin` |
| `CONSERVED_QUANTUMNUMBERS` | 基组中固定的量子数 | `Sz`（方法1），`N,Sz`（方法2） |
| `Sz_total` | 总磁化强度扇区 | `0`（方法1）；`0`和`1`（方法2） |
| `J` | 海森堡交换耦合 | `1` |
| `SWEEPS` | DMRG扫描次数 | `4` |
| `L` | 链长 | `32` |
| `MAXSTATES` | 保留的DMRG基矢数目 | `100`（方法1），`40`（方法2） |
| `NUMBER_EIGENVALUES` | 保留的低能本征态数 | `2`（方法1），`1`（方法2） |

### 晶格

`open chain lattice`是一个由`L=32`个格点组成的一维开链，每条键上都具有海森堡交换$J$：

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （32 个格点，开放边界条件）
```

之所以使用开链而不是周期链，是因为在保留态数`MAXSTATES`固定的情况下，DMRG在开边界条件下的精度最高，这也是一维DMRG计算的标准做法。有关其他内置晶格，请参见[ALPS晶格库](../../../documentation/intro/latticehowtos)。

### 方法选择

一个32格点自旋-1/2链的完整希尔伯特空间共有$2^{32}\approx4.3\times10^9$个态——对于精确对角化而言过于庞大。DMRG将其截断为每个块`MAXSTATES=100`个变分最优基态，从而使计算变得可行（此处每次运行仅需几秒钟），同时对于这一链长而言，截断误差可忽略不计。

### 方法1：直接计算基态和激发态能量

我们首先加载所需的库并准备输入参数。


```python
import pyalps
import numpy as np

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'L'                         : 32,
        'MAXSTATES'                 : 100,
        'NUMBER_EIGENVALUES'        : 2
       } ]

```

注意`NUMBER_EIGENVALUES = 2`，这意味着模拟中将保留基态和第一激发态的能量。

接下来我们编写输入文件并运行模拟。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

最后我们加载测量结果并将其打印出来。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap'))

energies = np.empty(0)
for s in data[0]:
    if s.props['observable'] == 'Energy':
        energies = s.y
    else:
        print(s.props['observable'], ':', s.y[0])
energies.sort()
print('Energies:', end=' ')
for e in energies:
    print(e, end=' ')
print('\nGap:', abs(energies[1]-energies[0]))
```

### 方法2：利用量子数

我们知道，自旋-1/2链的基态处于自旋单重态扇区。因此，如果我们将模拟限制在磁化强度`Sz_total = 0`的扇区内，DMRG模拟得到的最低能量就是自旋-1/2链的自旋单重态基态能量——这正是我们在前一个模拟中所做的。如果我们将模拟限制在磁化强度`Sz_total = 1`的扇区内，DMRG模拟得到的最低能量只能来自自旋三重态。当然，`Sz_total = 1`扇区的最低能量与`Sz_total = 0`扇区的第一激发态能量是相同的，因为在没有外磁场的情况下，三重态的3个子扇区（`Sz_total = -1`、`Sz_total = 0`和`Sz_total = 1`）是简并的。

我们首先加载库并准备输入参数。


```python
import pyalps
import numpy as np

parms = []
for sz in [0,1]:
    parms.append( { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'L'                         : 32,
        'MAXSTATES'                 : 40,
        'NUMBER_EIGENVALUES'        : 1
       } )
```

请注意，我们现在对`Sz_total = 0`和`Sz_total = 1`进行循环，这将生成两个输入参数文件，用于以下两次DMRG模拟。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

接下来我们加载测量结果并将其打印出来。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[1]-energies[0])
```

让我们比较两种方法得到的能量和能隙，它们彼此一致吗？

### 结果

运行上述代码可得：

| 方法 | 能量 | 能隙 |
|---|---|---|
| 1（直接法） | $E_0=-13.99732$, $E_1=-13.87958$ | 0.11774 |
| 2（量子数法） | $E(S_z=0)=-13.99732$, $E(S_z=1)=-13.87958$ | 0.11774 |

两种方法在5位有效数字内一致，这符合预期，因为它们以两种不同的方式计算了同一个物理能隙。

### 总结与展望

对于32格点的开放自旋-1/2链，DMRG给出的激发能隙为$\Delta/J\approx0.1177$——这是一个有限尺寸值，尚未达到（趋于消失的）热力学极限能隙；关于该能隙如何随$L\to\infty$而闭合，请参见配套教程《能隙的外推》。

1. 为什么上述两种方法尽管求解的是不同的本征值问题，却能得到完全相同的能隙？
2. 如果将链长加倍至$L=64$，你预计这个能隙会发生什么变化？
3. 如果将保留态数`MAXSTATES`减少到20，能隙会如何变化——100个态是否已经收敛？
