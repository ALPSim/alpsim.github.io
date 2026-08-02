
---
title: DMRG-04 Gaps
math: true
toc: true
---

## 计算能隙

如 [DMRG-02](../dmrg02) 中已提到的，量子系统的能隙是热力学极限下第一激发态与基态之间的能量差：

$$
\Delta = E_1 - E_0
$$

这意味着我们必须解决两个问题：（i）计算有限系统尺寸下的：

$$
\Delta(L) = E_1 (L) - E_0 (L)
$$

以及（ii）将 $\Delta (L)$ 外推至热力学极限 $L= \infty$。后者并非 DMRG 所特有的问题，但由于 DMRG 偏好开放边界条件，它比通常更常见的周期性边界条件情形要略为复杂。

### 获取有限系统的能隙

显然，我们必须能够获取第一激发态及其能量。DMRG 基本上有两种方法：一种是万能但不够优雅的方法，另一种是更巧妙但并非在所有情况下都适用的方法。

1. 朴素的方法是设置一个同时计算两个态的 DMRG 计算。然而，对于给定的态数目，精度会有所下降，因为两个不同的量子态都需要被精确描述。

2. 更巧妙的方法是将能隙计算化为两个基态的计算。在许多量子系统中，基态和第一激发态具有不同的好量子数，因此分别是各自量子数扇区中的基态。例如，对于自旋-1/2 链，基态是总自旋为 0 的单重态，即磁化量子数 0 扇区的基态。第一激发态是总自旋为 1 的三重态，即由磁化量子数 0 的一个激发态以及磁化量子数 +1 和 -1 扇区的基态组成。因此，它可以被计算为磁化量子数 +1 扇区中的基态。

让我们从自旋-1/2 链的计算开始。

#### 示例：不使用量子数

##### 使用参数文件

在下面的例子中，我们在自旋 S=1/2 链的参数文件 [`spin_one_half_gap`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_gap) 中添加一行，告知代码我们还要计算第一激发态的能量。算法将构建一个同时针对两个态的密度矩阵：基态和第一激发态，两者均在 Sz=0 子空间中。由于第一激发态是三重态，这将给出单重态-三重态能隙：

```python
LATTICE="open chain lattice"
MODEL="spin"
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=0
J=1
SWEEPS=4
{L=32, MAXSTATES=100
NUMBER_EIGENVALUES=2}
```
    
注意，我们只添加了最后一行，指定了要计算的本征态数目。通过同时针对两个态，算法确保两者都被精确表示。然而，若只保留 100 个态，这并不完全成立。请将本参数文件得到的基态能量与仅针对基态的上一次模拟进行比较。

重要的是要注意，本例中的纠缠熵完全没有意义，因为算法正在计算一个混合了两个态的密度矩阵。简单来说，算法同时针对 $S_z=0$ 扇区的基态和第一激发态，导致的是经典混合不确定性而非纯量子纠缠。要正确计算纠缠熵，需要对单重态扇区和三重态扇区分别独立对角化，以避免这种混合。

##### 使用 Python

脚本 [`spin_one_half_gap.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_gap.py) 运行与 [DMRG-03](../dmrg03) 教程中自旋-1/2 脚本相同的模拟，只是将请求的 NUMBER_EIGENVALUES 改为 2，并加载所有这些本征态的数据：

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
        'L'                         : 32,
        'MAXSTATES'                 : 100,
        'NUMBER_EIGENVALUES'        : 2
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)

data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap'))
```

在遍历所有测量时，我们提取能量：

```python
energies = np.empty(0)
for s in data[0]:
    if s.props['observable'] == 'Energy':
        energies = s.y
    else:
        print(s.props['observable'], ':', s.y[0])
```

并计算能隙：

```python
energies.sort()
print('Energies:', end=' ')
for e in energies:
    print(e, end=' ')
print('\nGap:', abs(energies[1]-energies[0]))
```

#### 示例：使用量子数

要利用量子数守恒来计算单重态-三重态能隙，我们需要进行两次独立模拟，一次 Sz=0，另一次 Sz=1。两个能量之差即为能隙。

##### 使用参数文件

这意味着我们只需更改 spin_one_half 参数文件中 Sz_total 的值：

```python
LATTICE="open chain lattice"
MODEL="spin"
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=1
SWEEPS=4
J=1
{L=32, MAXSTATES=40}
```

可从此处下载该文件：[`spin_one_half_triplet`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_triplet)。

##### 使用 Python

脚本 [`spin_one_half_triplet.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_triplet.py) 通过两个 Python 参数字典对两个 Sz 扇区各运行一次模拟：

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

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
       
input_file = pyalps.writeInputFiles('parm_spin_one_half_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

以通常方式加载结果后，打印两个扇区的测量结果，并将每个 Sz 值的基态能量保存到字典中：

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_triplet'))

# print results:
energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]
```

然后，我们可以将能隙计算为 Sz=1 和 Sz=0 扇区之间的能量差：

```python
print('Gap:', energies[1]-energies[0])
```

### 将能隙外推至热力学极限

第一次尝试：固定 $D=50,100,150$，计算长度 $L=32,64,96,128$ 的能隙。对于固定 $D$，绘制能隙与 $1/L$ 的关系图。你应该看到，对于较小的 $D$，结果不会落在过零点的直线上，而是从直线向上弯曲。这种行为随着 $D$ 增大而改善（见下方思考题）。

第二次更有意义的尝试：固定链长 $L=32,64,96,128$，改变 $D=50,100,150,200$，以便对每个固定链长在 $D$（或如上所述的截断误差）方向外推能隙，然后使用这些外推值绘制能隙与 $1/L$ 的关系图。

下图显示了固定 $D=100$ 时自旋-1/2 单重态-三重态能隙与 $1/L$ 的关系：四个点接近一条通过较小但明显非零截距的直线，恰好说明了下面描述的困境——仅凭这四个链长，很难区分真正消失的能隙和极小的有限能隙。

![](/figs/dmrg/extrapolationGapSHalf.png)

修改文件 [`spin_one_half_multiple`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-01-dmrg/spin_one_half_multiple)，为不同系统尺寸和不同态数目的 Sz=0 和 Sz=1 设置所有运行。使用五次扫描，按照教程中概述的步骤外推能隙值。

自旋-1/2 链的情形有些令人沮丧，因为即使将计算机推到极限，你所能得出的结论也不过是：在你的能力范围内，能隙似乎极小，因此很可能消失。但谁能告诉你这不是能隙为 $e^{-50}$ 这样的情形呢？这当然是对即便高度精确的数值方法也存在局限性的清醒认识。

因此，让我们转向一个更有成效的问题：自旋-1 反铁磁海森堡链的能隙是多少？

这里有一个奇特之处，我们目前只是说明并执行，但稍后会解释：计算能隙不是在磁化量子数 0 和 1 扇区的基态之间，而是在扇区 1 和 2 之间。如果你愿意，也可以对 0 和 1 进行计算，以供后续参考，但以下内容是针对 1 和 2 的情形。

假设你已经以机器精度确定了 $\Delta (L)$，无论是通过上述适当的外推还是通过非常高精度的计算。如果不想进行前者，可以对系统尺寸 $L=8,16,32,48,64,96,128,192,256$ 使用 $D=300$ 个态和 5 次扫描来计算能隙。

开放端的影响将以 $1/L$ 的方式减小，因此首先绘制能隙 $\Delta (L)$ 与 $1/L$ 的关系图是合理的。自旋-1/2 情形已经这样做过。你所看到的是一条对小 $L$ 相当直，然后开始向上弯曲的曲线。理想情况下应了解渐近行为（长链的弯曲部分）是什么（解析上或近似地），以便进行外推。通常绘制能隙 $\Delta (L)$ 与 $1/L^2$ 的关系图来做到这一点。

下图显示了固定 $D=200$ 时自旋-1 能隙与 $1/L^2$ 的关系：点现在落在一条很好的直线上，外推到的截距接近公认的 Haldane 能隙 $\Delta/J=0.41052$（见 [DMRG-02](../dmrg02)）——这比上面自旋-1/2 情形的外推行为好得多，与下面推导的 $1/L^2$ 收敛性一致。

![](/figs/dmrg/extrapolationGapSOne.png)

该过程实际上是由以下论证所启发的：从 Haldane 用非线性 sigma 模型对自旋-1 链的分析中，可以预期最低激发（对于周期性边界条件可以用动量 $k$ 标记）在 $k=\pi$ 附近，能量为：

$$
E(k) = E_0 + \sqrt{\Delta^2 + c^2 (k-\pi)^2}.
$$

对于开放边界条件，我们可以近似 $k-\pi \approx 1/L$（类比箱中粒子），这给出有限尺寸的能隙为：

$$
\Delta(L) \approx \Delta \left( 1 + \frac{c^2}{2\Delta^2 L^2} \right) 
$$

这表明在渐近极限下，收敛行为本质上是 $1/L^2$。

对于那些也计算了磁化量子数 0 和 1 扇区基态之间能隙的人，请说明那里得到的能隙本质上为零。其余人可以将这一结果视为已知。事实上，为什么自旋-1 链在开放边界条件下表现出这种奇特行为，有一个很好的解析原因，即使我们不幸地不知道这一原因，我们也可以立即发现问题！这可以通过观察局域可观测量来做到。

## 小结

DMRG 能够分辨临界自旋-1/2 链（可能消失的）能隙和自旋-1 链有限的 Haldane 能隙，但这两种情形需要不同的外推策略——对近无能隙情形用 $1/L$，对有能隙情形用 $1/L^2$——反映了它们不同的长程物理；[DMRG-05](../dmrg05) 解释了为何自旋-1 能隙必须专门取磁化量子数扇区 1 和 2 之间的值。

## 思考题

- 在固定链长时增大 $D$，能隙与 $1/L$ 关系图的曲率为何会变直？
- 在固定各链长后先在 $D$（或截断误差）方向外推能隙，再绘制与 $1/L$ 的关系图：与第一次固定 $D$ 的尝试相比，结果现在是什么样的？
- 若只是朴素地外推自旋-1 链 $\Delta(L)$ 与 $1/L$ 曲线的线性（小 $L$）部分，你会得到什么能隙？是高估还是低估？（这在链的关联长度很长，以至于在可达链长上很难看到渐近行为时尤为重要。）
- 如果用你拥有的最长链来读取能隙，结果是高估还是低估？
- 改用 $\Delta(L)$ 与 $1/L^2$ 作图：对大链长，曲线现在是什么样的？你外推得到什么能隙？
- 你外推得到的能隙与 [DMRG-02](../dmrg02) 中的公认值 $\Delta/J=0.41052$ 相差多少？
- 磁化量子数扇区 0 和 1 之间的能隙本质上为零，而扇区 1 和 2 之间的能隙是有限的。为什么有限能隙是物理上正确的，而消失的能隙是错误的——这是物理上的彩票吗？
