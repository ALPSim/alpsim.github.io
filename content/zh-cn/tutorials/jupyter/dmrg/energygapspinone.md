---
title: 自旋-1链的能隙
description: "用于自旋一链DMRG能隙计算的Jupyter md文件"
toc: true
math: true
weight: 24
cascade:
    type: docs
---

在本教程中,我们将使用DMRG模拟计算64格点自旋-1链的能隙。我们将看到与自旋-1/2链不同的能隙行为。在这里,自旋-1链基态与第一激发态之间的能隙是有限的。我们还将看到最低的几个态形成一个近简并的态群,因此计算需要保留更多的最低能量态才能正确识别出能隙。

其原因在于这是一条**开放**链(`open chain lattice`)。开放的自旋-1 霍尔丹链在其两个端点上各带有一个局域化的有效 $S=1/2$ 自由度。这两个边缘自旋组合成一个单态($S=0$)和一个三重态($S=1$)——共计**四**个态,它们彼此之间的劈裂只有指数小的量级,并随着链长增大而趋于零。这个边缘态多重态位于体霍尔丹能隙之下,因此需要关注的能量差是从该多重态到第一个体激发的能隙,而不是多重态内部的劈裂。

由于下面的模拟守恒 $S_z$,限制在 `Sz_total = 0` 的运行只能看到这个四态多重态中的两个成员(单态,以及三重态的 $S_z=0$ 分量)。这就是为什么下面的方法1显示的是两个近简并的最低能级,而不是四个。

与自旋-1/2的情况类似,该计算可以通过两种方式进行。第一种方法是在同一次DMRG运行中直接计算4个最低能量态。我们将看到在 `Sz_total = 0` 扇区中可见的两个近简并的最低能级,以及从它们到第一个体激发之间的能隙。第二种方法是通过计算不同总自旋扇区(即总磁化强度为0、1和2)中的基态能量。我们会发现磁化强度为0和1时的基态能量在误差范围内是相同的,并且能隙可以通过磁化强度为1和2扇区之间的基态能量差来计算。

这是海森堡交换模型(参见 [W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601)),但格点上的自旋为1而非1/2。整数自旋情况下预测的有限能隙即为霍尔丹能隙,来自 [F.D.M. Haldane, Physics Letters A 93, 464-468 (1983)](https://doi.org/10.1016/0375-9601(83)90631-X)。

### 参数

| 参数 | 含义 | 值 |
|---|---|---|
| `LATTICE` | 链所使用的晶格 | `open chain lattice` |
| `MODEL` | 哈密顿量类型 | `spin` |
| `local_S` | 每个格点的自旋量子数 | `1` |
| `CONSERVED_QUANTUMNUMBERS` | 基组中固定的量子数 | `Sz` (方法1), `N,Sz` (方法2) |
| `Sz_total` | 总磁化强度扇区 | `0` (方法1); `0`, `1`, `2` (方法2) |
| `J` | 海森堡交换耦合 | `1` |
| `SWEEPS` | DMRG扫描次数 | `5` |
| `L` | 链长 | `64` |
| `MAXSTATES` | 保留的DMRG基组态数目 | `300` |
| `NUMBER_EIGENVALUES` | 保留的低能本征态数目 | `4` (方法1), `1` (方法2) |

### 晶格

```
   J     J     J             J
o-----o-----o-----o-- ... --o     （64 个格点，每个格点自旋为 1，开放边界条件）
```

与自旋-1/2情形相同的 `open chain lattice`,但 `local_S=1` 且长度加倍(`L=64`),因为需要更长的链才能从有限尺寸修正中清晰地分辨出有限的霍尔丹能隙。其他内置晶格请参见 [ALPS晶格库](../../../documentation/intro/latticehowtos)。

### 方法选择

对于自旋-1,局域希尔伯特空间是3维的,因此64格点链未截断的空间为 $3^{64}\approx3.4\times10^{30}$ —— 远超出精确对角化的能力范围。DMRG的 `MAXSTATES=300` 使这一计算变得可行;这里保留的态数比自旋-1/2教程中更多,因为分辨近简并的边缘态多重态(见上文)需要更高的精度。

## 方法1:直接计算4个最低能量

我们首先加载必要的库并准备输入参数。


```python
import pyalps
import numpy as np

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 4
       } ]

```

注意 `local_S = 1` 给出了自旋-1系统。`NUMBER_EIGENVALUES = 4` 将从DMRG模拟中给出最低的4个能量。为了确保足够的精度,我们还设置了扫描次数 `SWEEPS = 5` 以及保留态数目的截断 `NUMBER_EIGENVALUES = 300`。

我们接下来写入输入文件并运行模拟。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

最后我们加载测量结果并打印结果。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_gap'))

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
print('\nGap:', abs(energies[1]-energies[0]), abs(energies[2]-energies[1]))
```

从模拟结果中,你是否看到了基态简并以及与第一激发态之间的有限能隙?

运行上面的代码得到四个最低能量 $E_0,E_1,E_2,E_3 = -88.48667, -88.48666, -88.05889, -88.05629$:最低的两个态在 $3\times10^{-7}$ 以内简并——它们是在这个 $S_z=0$ 扇区中可见的边缘态多重态的两个成员——而到第一个体激发的能隙为 $E_2-E_1\approx0.4278$。

## 方法2:使用量子数

我们首先将模拟限制在磁化强度 `Sz_total = 0` 和 `Sz_total = 1` 的扇区中。然后提取两个扇区之间的基态能量差,以此表明它们是简并的。接着我们用 `Sz_total = 1` 和 `Sz_total = 2` 重复计算。所得结果用于提取能隙。

我们首先加载库并准备输入参数。


```python
import pyalps
import numpy as np

#准备输入参数
parms = []
sz_tot = [0,1]
for sz in sz_tot:
    parms.append( {
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 1
       } )
```

磁化强度取自列表 `sz_tot = [0,1]` 中的值,然后被赋给输入参数列表中的磁化强度 `Sz_total`。注意这里只计算1个最低能量态,即 `NUMBER_EIGENVALUES = 1`。

输入文件通过以下API写入,计算也由其完成。


```python
input_file = pyalps.writeInputFiles('parm_spin_one_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

我们接下来加载测量结果并打印结果。


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[sz_tot[1]]-energies[sz_tot[0]])
```

你是否看到了来自两个磁化强度扇区的简并基态?

运行上面的代码,对 `sz_tot=[0,1]` 得到 $E(S_z=0)=-88.48667$ 和 $E(S_z=1)=-88.48666$ —— 能隙仅为 $9\times10^{-6}$,证实了这两个扇区在DMRG精度范围内是简并的。

接下来,我们将磁化强度列表改为 `sz_tot = [1,2]` 并重复模拟。为方便起见,我们在下面复制了上面的代码,唯一的改变是磁化强度列表。


```python
import pyalps
import numpy as np

parms = []
sz_tot = [1,2]
for sz in sz_tot:
    parms.append( {
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 1
       } )


input_file = pyalps.writeInputFiles('parm_spin_one_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)

data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[sz_tot[1]]-energies[sz_tot[0]])
```

你现在能否正确提取出64格点自旋-1链的能隙?是否与方法1的结果一致?

对 `sz_tot=[1,2]` 运行上面的代码得到能隙为 $0.42755$,与方法1得到的 $0.4278$ 非常接近(细微差异来自两种方法使用了各自独立的DMRG运行,截断略有不同)。

### 结果

64格点自旋-1链两种方法的结果汇总:

| 方法 | 物理量 | 值 |
|---|---|---|
| 1 | $E_0-E_1$ (基态简并劈裂) | $3\times10^{-7}$ |
| 1 | $E_2-E_1$ (激发能隙) | 0.4278 |
| 2 | $E(S_z{=}1)-E(S_z{=}0)$ (简并性检验) | $9\times10^{-6}$ |
| 2 | $E(S_z{=}2)-E(S_z{=}1)$ (激发能隙) | 0.4276 |

两种方法都得出在 $L=64$ 时的有限尺寸能隙为 $\Delta/J\approx0.4276$–$0.4278$,这与“自旋-1海森堡链的自旋能隙”精确对角化教程中得到的热力学极限霍尔丹能隙 $\Delta/J\approx0.4105$ 相符。

### 总结与展望

与无能隙的自旋-1/2链不同,开放的自旋-1海森堡链具有一个近简并的四态边缘态多重态,并且即使在 $L=64$ 时也存在有限的体激发能隙——这是DMRG对霍尔丹关于整数自旋链预测的直接验证。

1. 边缘态多重态包含四个态,但 `Sz_total = 0` 的运行只显示其中两个。是哪两个?另外两个又在哪里?
2. 这里 $L=64$ 时得到的能隙与真正的热力学极限霍尔丹能隙有多接近?这说明了在此长度下有限尺寸修正的情况如何?
3. 尝试 `local_S=3/2`:基态是有能隙的还是无能隙的?这如何取决于自旋是整数还是半整数?
