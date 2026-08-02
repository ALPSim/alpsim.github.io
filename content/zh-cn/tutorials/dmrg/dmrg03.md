
---
title: DMRG-03 Ground State Energies
math: true
toc: true
---

本教程将 [DMRG-01](../dmrg01) 中介绍的 `dmrg` 代码和控制参数应用于最简单的目标：基态能量。我们考虑 [DMRG-02](../dmrg02) 中引入的、长度为 $L$ 且具有开放边界条件的自旋-1/2 和自旋-1 反铁磁海森堡链：

$$
H = J\sum_{i=1}^{L-1} \left[\frac{1}{2} (S^+_i S^-_{i+1} + S^-_i S^+_{i+1}) + S^z_i S^z_{i+1}\right] .
$$

## 基态能量

在研究模型哈密顿量时，我们通常首先要问的是基态 $| \psi_0 \rangle$ 及其能量 $E_0$ 是什么。对于长度为 $L$ 的海森堡链及其他类似系统，我们可能更关心热力学极限下的每格点（或每键）能量。以下将分别讨论这两个问题。

### 固定长度的基态能量

考虑长度 $L=32,64,96,128$ 的链。对于自旋-1/2 和自旋-1，分别设置态数目 $D=50,100,150,200,300$ 的基态能量计算。对于每个长度，将截断误差和基态能量作为 $D$ 的函数制表。仔细调整扫描次数，以确保对于给定的长度和态数目，结果已经收敛。

1. 对于每个系统尺寸和自旋大小，通过绘制总能量与截断误差的关系图，尝试建立总能量精度与截断误差之间的联系。

2. 观察对于自旋-1/2 和自旋-1，随系统尺寸的增大，$D$ 方向的收敛性如何恶化，并比较两种情形下的收敛行为（除去一个与长度同量级的全局因子）。*提示：* 你应该看到，除去全局因子后，对于自旋-1 链，大系统尺寸的收敛性对长度的依赖较弱；但对于自旋-1/2 链，依赖则强得多。这是因为自旋-1 链的物理由关联长度量级的链段主导，而自旋-1/2 链由于临界性而没有有限的长度尺度。

3. 尝试将每个链长的基态能量外推至 $D\rightarrow\infty$ 极限。

#### 一维 S=1/2 海森堡链

##### 单次运行

第一个例子是为含 32 个格点、开放边界条件、保留 100 个态的自旋-1/2 海森堡链设置模拟。

###### 使用参数文件

参数文件 [`spin_one_half`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-01-dmrg/spin_one_half) 设置了最重要的参数：

```python
LATTICE="open chain lattice"
MODEL="spin" 
CONSERVED_QUANTUMNUMBERS="N,Sz" 
Sz_total=0
J=1
SWEEPS=4
NUMBER_EIGENVALUES=1
L=32 
{MAXSTATES=100}
```

使用如下命令序列，可以首先将输入参数转换为 XML 格式，然后运行 `dmrg` 应用程序：

```python
parameter2xml spin_one_half
dmrg --write-xml spin_one_half.in.xml
```

输出文件 `spin_one_half.task1.out.xml` 包含所有计算量，可以用标准浏览器查看。

DMRG 将执行四次扫描（四次从左到右的半扫描和四次从右到左的半扫描），以 MAXSTATES/(2\*SWEEPS) 为步长增长基组，直至达到我们声明的 MAXSTATES=100 值。这是一个方便的默认选项，但态数目可以自定义，如下面自旋 S=1 的例子所示。

###### 使用 Python

要在 Python 中设置和运行模拟，我们使用脚本 [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half.py)。该脚本的第一部分导入所需模块，将输入文件准备为 Python 字典列表，写入输入文件并运行应用程序：

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

在终端中键入以下命令运行：
```python 
python spin_one_half.py
```
现在我们拥有与命令行版本相同的输出文件。

接下来，加载 DMRG 代码测量的基态属性：

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))
```
并将其打印到终端：

```python
for s in data[0]:
    print(s.props['observable'], ':', s.y[0])
```

此外，我们还可以加载每个迭代步骤的详细数据：

```python
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                          what=['Iteration Energy','Iteration Truncation Error'])
```

上述操作可以让我们观察 DMRG 算法收敛到最终结果的过程。

最后，我们绘制各量随迭代步数的收敛情况：
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

对于上述单次运行（L=32，MAXSTATES=100），基态能量在无限系统增长阶段预热，并在约 50 次迭代内收敛到稳定值——可与 [DMRG-02](../dmrg02) 中给出的精确热力学极限每格点能量进行比较——而截断误差则以锯齿形模式下降，在每次半扫描结束时触底接近机器精度（$\sim 10^{-16}$），并在下一次半扫描开始时再次上升：

![](/figs/dmrg/dmrg_energy_truncation.png)

##### 多次运行

###### 使用参数文件

现在我们说明如何在单个参数文件 [`spin_one_half_multiple`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half_multiple) 中设置多次运行。我们将使用教程中建议的例子，模拟长度 L=32 的链，改变 DMRG 态数目（为便于说明使用较少的态数目）：

```python
LATTICE="open chain lattice"
SWEEPS=4
CONSERVED_QUANTUMNUMBERS="N,Sz"
MODEL="spin", Sz_total=0
J=1
NUMBER_EIGENVALUES=1
L=32
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

与前一个例子的主要区别在于括号中编码的参数。与之前一样，我们运行：

```python
parameter2xml spin_one_half_multiple
dmrg --write-xml spin_one_half_multiple.in.xml
```

此时将得到三个输出文件 `spin_one_half_multiple.task#.out.xml`，包含各自的结果。

###### 使用 Python

脚本 [`spin_one_half_multiple.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half_multiple.py) 设置了三个具有不同 MAXSTATES 的 Python 参数字典：

```python
parms= []
for m in [20,40,60]:
    parms.append({ 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'L'                         : 32,
        'MAXSTATES'                 : m
       })

```

在以与单次运行相同的方式写入参数文件、运行 dmrg 应用程序并加载结果后，我们可以打印所有运行的测量结果：

```python
for run in data:
    for s in run:
        print(s.props['observable'], ':', s.y[0])
```

#### 一维 S=1 海森堡链

由于开放边界条件，S=1 海森堡链需要特殊处理。如 [DMRG-01](../dmrg01) 中所述，我们需要在链的两端各加入两个自旋 S=1/2 的格点。这需要为模拟定义一个新的格点文件。事实证明，没有简便的方法可以直接实现这一点，因此必须手动完成。为了简化过程，我们提供了一个简单的 Python 脚本 [`build_lattice.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/build_lattice.py) 来自动生成格点。唯一的输入是格点中的格点数。例如，键入：

```python
python build_lattice.py 6
```

将得到输出：

```python
<LATTICES>
<GRAPH name = "open chain lattice with special edges" dimension="1" vertices="6" edges="5">
<VERTEX id="1" type="0"><COORDINATE>0</COORDINATE></VERTEX>
<VERTEX id="2" type="1"><COORDINATE>2</COORDINATE></VERTEX>
<VERTEX id="3" type="1"><COORDINATE>3</COORDINATE></VERTEX>
<VERTEX id="4" type="1"><COORDINATE>4</COORDINATE></VERTEX>
<VERTEX id="5" type="1"><COORDINATE>5</COORDINATE></VERTEX>
<VERTEX id="6" type="0"><COORDINATE>6</COORDINATE></VERTEX>
<EDGE source="1" target="2" id="1" type="0" vector="1"/>
<EDGE source="2" target="3" id="2" type="0" vector="1"/>
<EDGE source="3" target="4" id="3" type="0" vector="1"/>
<EDGE source="4" target="5" id="4" type="0" vector="1"/>
<EDGE source="5" target="6" id="5" type="0" vector="1"/>
</GRAPH>
</LATTICES>
```

如我们所见，格点被定义为包含六个顶点的一维图，边连接最近邻。第一个和最后一个顶点为"0"型，其余为"1"型。我们将使用这一定义在该格点之上实现模型，格点文件应包含关于这些顶点上自由度的信息。

实现方式是通过指定参数：

```python
local_S0=0.5
local_S1=1
```

要运行含 32 个格点的格点，则键入：

```python
python build_lattice.py 32 > my_lattice.xml
```

##### 使用参数文件

让我们看看最终的参数文件 [`spin_one`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one) 应该是什么样的：

```python
LATTICE_LIBRARY="my_lattice.xml"
LATTICE="open chain lattice with special edges"
MODEL="spin"
local_S0=0.5
local_S1=1
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=0
J=1
SWEEPS=4
NUMBER_EIGENVALUES=1
{MAXSTATES=100}
```

显然，对每个系统尺寸重复该过程很繁琐。一种进一步简化的方法是在格点库中定义所有需要的格点。我们提供了一个 [`my_lattices.xml`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/my_lattices.xml) 文件，包含 $L=32,64,96,128,192$ 的格点。只需修改前面的参数文件，将格点定义替换为：

```python
LATTICE_LIBRARY="my_lattices.xml"
LATTICE="open chain lattice with special edges 32"
```
其中格点尺寸已包含在名称中。

##### 使用 Python

脚本 [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one.py) 在 Python 字典中定义参数：

```python
parms = [ { 
        'LATTICE_LIBRARY'           : 'my_lattice.xml',
        'LATTICE'                   : 'open chain lattice with special edges',
        'MODEL'                     : 'spin',
        'local_S0'                  : '0.5',
        'local_S1'                  : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'MAXSTATES'                 : 100
       } ]
```

除参数和文件名不同外，与上面解释的 `spin_one_half.py` 脚本相同。

##### 多次运行

###### 使用参数文件

与自旋 S=1/2 的情况相同，现在可以在名为 [`spin_one_multiple`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_multiple) 的单个参数文件中设置多次运行，如下所示：

```python
LATTICE_LIBRARY="my_lattices.xml"
LATTICE="open chain lattice with special edges 32"
MODEL="spin"
local_S0=0.5
local_S1=1
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=0
J=1 
NUMBER_EIGENVALUES=1 
SWEEPS=4
{ MAXSTATES=20 } 
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

###### 使用 Python

同样的运行可以通过脚本 [`spin_one_multiple.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_multiple.py) 设置，该脚本可通过替换对应自旋-1/2 脚本中的参数得到。

### 每格点（每键）基态能量

仔细观察哈密顿量，长度为 $L$ 的链的能量不在 $L$ 个格点上，而在 $L-1$ 条键上。因此，一个（朴素的）初步尝试是取上一次模拟的结果并计算：

$$
e_0/J = \frac{E_0(L)}{L-1}.
$$

正确的方法是通过考虑链中心处一条键的能量来消除开放边界条件的影响。有两种方法可以做到这一点。

1. 计算长度为 $L$ 和 $L+2$ 两条链的基态能量（同样使用上述长度），并计算 $e_0/J = (E_0(L+2) - E_0 (L))/2$ 作为每键能量。

2. 代价较低且更常用的方法是使用（如 [DMRG-06](../dmrg06) 中所讨论的）相邻格点的关联函数：
$$
e_0/J = \frac{1}{2} (\langle S^+_i S^-_{i+1}\rangle  + \langle S^-_i S^+_{i+1}\rangle ) + \langle S^z_i S^z_{i+1} \rangle 
$$

取链中心处的格点 $i$ 和 $i+1$。

## 小结

DMRG 在几十次迭代内就能将自旋-1/2 和自旋-1 开链的基态能量收敛到很高的精度，但朴素的每格点能量估计 $E_0(L)/(L-1)$ 并不能很好地代替热力学极限下的每键能量，因为它没有修正开放边界条件的影响；需要使用中心键估计。

## 思考题

- 除去链长设定的全局因子外，你是否看到自旋-1/2 链与自旋-1 链在随系统尺寸增大时 $D$ 方向收敛性恶化上的差异？
- 将 $e_0/J=E_0(L)/(L-1)$ 与 [DMRG-02](../dmrg02) 中给出的精确热力学极限每格点能量相比较，你得到了非常接近的值吗？底层假设有什么问题？
- 改用 $e_0/J=(E_0(L+2)-E_0(L))/2$，对同样的链长，结果现在是什么样的？
