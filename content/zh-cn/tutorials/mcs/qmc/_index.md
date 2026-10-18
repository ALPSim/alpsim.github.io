
---
title: MC-09 量子蒙特卡洛
math: true
toc: true
weight: 11
---

```
import numpy as np
matplotlib inline
import matplotlib as mpl
mpl.rc("savefig", dpi=120)
import matplotlib.pyplot as plt

import pyalps
from pyalps.plot import plot
```

## 海森堡链

在第一部分中，我们计算 $S=1/2$ 海森堡链的磁化曲线：
$$
H=\sum_{i}^{L}\vec{S}_i\cdot\vec{S}_{i+1}+h\sum_{i=1}^LS_i^z
$$
其中我们采用周期性边界条件，即令 $\vec{S}_{L+1}=\vec{S}_1$。
我们希望计算基态下的磁化曲线。然而，这里选用的方法是在有限温度下工作的路径积分量子蒙特卡洛方法。因此我们模拟的是一个热系综，并选取一个相对于问题中其他能量尺度而言足够低的温度。

每格点磁化强度的热期望值定义为：
$$
m=\frac{1}{L}\sum_i\langle S_i^z\rangle
$$
其中：
$$
\langle S_i^z\rangle = \frac{1}{Z}\text{Tr}(e^{-H/T}S_i^z).
$$
这是 ALPS 中有向圈随机级数展开（Directed Loop SSE）实现所计算的标准可观测量之一。

### 参数设置

我们需要传递给有向圈随机级数展开程序的参数可分为四类：

- 格子参数：我们选取名为 "chain lattice" 的格子。它对应于一条具有周期性边界条件的简单一维链。对于这一特定格子，我们还需要通过参数 "L" 指定链的长度。

- 模型参数：我们选取 "spin" 模型并设定 $S=1/2$，这通过把 "local_S" 设为 1/2 来实现。耦合为 "J"，而 "h" 是沿 $z$ 方向的磁场。

- 系综参数：这里我们选取温度 $T=0.08$，它足够低，可以呈现我们所关注的物理效应。

- QMC 参数：对于这个简单的设置，我们只传入模拟中热化阶段的扫描次数（"THERMALIZATION"），以及测量目标可观测量所用的扫描次数（"SWEEPS"）。

**建议：** 

- 尝试改变温度以及热化和测量扫描次数，观察它们如何影响下面绘出的结果。

- 你能否给出一条准则，用于选取足够低的温度以获得基态物理？

```
chain_parms = []
for h in [0., 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.5]:
    chain_parms.append({
        # 格子参数
        'LATTICE'        : "chain lattice", 
        'L'              : 20,

        # 模型参数
        'MODEL'          : "spin",
        'local_S'        : 0.5,
        'J'              : 1,
        'h'              : h,

        # 系综参数
        'T'              : 0.08,

        # QMC 参数
        'THERMALIZATION' : 1000,
        'SWEEPS'         : 5000,
    })
chain_prefix = 'qmc_chain'
```

### 运行模拟

模拟使用有向圈随机级数展开程序完成，它最适合模拟处于外磁场中的自旋模型（每个格点的状态数较少）。

```
# 为 ALPS 程序写出输入文件。
# 所有文件名都将以前缀 chain_prefix='qmc_chain' 开头。
input_file = pyalps.writeInputFiles(chain_prefix, chain_parms)

# 下面的命令运行相应的应用程序。
res = pyalps.runApplication('dirloop_sse',input_file,Tmin=5)
```

以上代码可以保存为脚本，并在终端中用 python 命令运行。或者，也可以在终端中用下面的命令运行该输入文件：

```
dirloop_sse qmc_chain.in.xml --Tmin 5
```

### 分析结果

在数据分析中，我们依赖 `pyalps` 包中提供的方法以及 `matplotlib` 库。

```
# 载入原始测量数据。我们只载入 "Magnetization Density"，而不载入 QMC 程序
# 测量的所有其他物理量。
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix=chain_prefix),'Magnetization Density')

# pyalps.collectXY 函数接受一组数据点，并提取出
# 形如 "Y vs X" 的图。
magnetization = pyalps.collectXY(data, x='h', y='Magnetization Density')

plot(magnetization)
plt.xlabel('Field $h$')
plt.ylabel('Magnetization $m$')
plt.title('Quantum Heisenberg chain')
plt.show()
```

得到的图应当类似于下图：    
![](qmcmagchain.png)

## 海森堡梯子

现在我们以基本相同的方式求解双腿海森堡梯子。梯子的哈密顿量可以看作把两条链耦合在一起。把其中一条链上的自旋记为 $\vec{S}$，另一条链上的记为 $\vec{T}$，哈密顿量为：

$$
H=\sum[J_0(\vec{S}_i\cdot\vec{S}_{i+1}+\vec{T}_i\cdot\vec{T}_{i+1})+J_1\vec{S}_i\cdot\vec{T}_i+h(S_i^z+T_i^z)],
$$

其中我们同样采用周期性边界条件，令 $\vec{S}_{L+1}=\vec{S}_1$ 与 $\vec{T}_{L+1}=\vec{T}_1$。

注意格子参数和模型参数上的差别：

- 除了系统的长度之外，我们现在还需要给出宽度。
- 模型现在有两个参数 $J_0$ 和 $J_1$，其中 $J_0$ 是沿链方向的耦合，$J_1$ 是横档上的耦合。必须同时指定这两个参数，否则它们会默认为 0。

其余参数我们保持不变。

```
ladder_parms = []
for h in [0., 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.5]:
    ladder_parms.append(
        { 
            # 格子参数
            'LATTICE'        : "ladder", 
            'L'              : 20,
            'W'              : 2,
         
            # 模型参数
            'MODEL'          : "spin",
            'local_S'        : 0.5,
            'J0'             : 1,
            'J1'             : 1,
            'h'              : h,
         
            # 系综参数
            'T'              : 0.08,
    
            # QMC 参数
            'THERMALIZATION' : 1000, # 1000
            'SWEEPS'         : 5000, # 20000
        }
    )
ladder_prefix = 'qmc_ladder'
    
input_file = pyalps.writeInputFiles(ladder_prefix, ladder_parms)
res = pyalps.runApplication('dirloop_sse',input_file,Tmin=5)

data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix=ladder_prefix),'Magnetization Density')

magnetization = pyalps.collectXY(data,x='h',y='Magnetization Density')

plot(magnetization)
plt.xlabel('Field $h$')
plt.ylabel('Magnetization $m$')
plt.title('Quantum Heisenberg ladder')
```

![](qmcmagladder.png)

## 对比

现在我们比较链与梯子的结果。为此，我们不需要运行任何新的模拟，只需同时载入两组数据，并让 pyalps.collectXY 针对 LATTICE 参数的每个取值分别生成一张图。

- 两张图之间有哪些显著差别，特别是在磁场强度 h 较小的区域？
- 这些差别的物理解释是什么？各个系统的激发谱如何解释这一点？

我们将在密度矩阵重整化群（DMRG）系列教程中重新讨论这些问题。

```
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix=ladder_prefix),'Magnetization Density')
data += pyalps.loadMeasurements(pyalps.getResultFiles(prefix=chain_prefix),'Magnetization Density')

# 这里我们使用 collectXY 函数的第四个可选参数，它允许
# 我们传入一个参数列表，使 collectXY 针对这些参数的
# 每个取值分别生成一张图。
magnetization = pyalps.collectXY(data, 'h', 'Magnetization Density', ['LATTICE'])

plot(magnetization)
plt.xlabel('Field $h$')
plt.ylabel('Magnetization $m$')
plt.title('Quantum Heisenberg chain and ladder')
plt.legend(loc=0, frameon=False)
```

![](qmcmagchainandladder.png)
