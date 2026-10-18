
---
title: MC-01b 平衡化
math: true
toc: true
weight: 3
---

每一次蒙特卡洛模拟都从某个初始组态出发——通常是随机组态或完全有序的状态——而它远离平衡态。
在模拟的最初阶段，马尔可夫链会向平衡分布弛豫，在这段*热化*期间所做的测量会受到起始组态选择的影响而产生偏差。
在计算平均值之前必须把它们丢弃。
系统忘记其初始状态所需的扫描次数由自关联时间决定（参见 [MC-01a](../mc01a)）；在相变点附近，关联是长程的，热化可能需要成千上万次扫描。

本教程涉及两个相关的诊断量：

- **平衡化**：模拟是否已经离开初始状态并达到了平衡分布？
- **收敛性**：模拟是否运行得足够久，使得所测平均值的统计误差小到可以接受？

这两者都通过检查某个可观测量的时间序列来判断——在本例中是处于临界温度的二维伊辛模型的磁化强度。

## 平衡化

### 在命令行下准备并运行模拟

参数文件 <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01b-equilibration-and-convergence/parm1a" data-filename="parm1a" target="_blank" rel="noopener">`parm1a`</a> 设置了一次模拟：临界温度下 $48 \times 48$ 正方格子上的伊辛模型：

```
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=10000
SWEEPS=50000
UPDATE="local"
MODEL="Ising"
{L=48;}
```

把参数文件转换成 XML 并运行 `spinmc`：

```
parameter2xml parm1a
spinmc --Tmin 10 --write-xml parm1a.in.xml
```

### 在 Python 中准备并运行模拟

完整脚本见 <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01b-equilibration-and-convergence/tutorial1a.py" data-filename="tutorial1a.py" target="_blank" rel="noopener">`tutorial1a.py`</a>。
它首先导入所需的模块并定义模拟参数：

```Python
import pyalps
import matplotlib.pyplot as plt

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'THERMALIZATION'  : 10000,
    'SWEEPS'          : 50000,
    }]
```

把参数写入 XML 输入文件并运行 `spinmc`：

```Python
input_file = pyalps.writeInputFiles('parm1a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)
```

### 检查时间序列

检验平衡化最直接的办法是画出某个可观测量的时间序列。
我们从输出文件中载入磁化强度的时间序列并作图：

```Python
files = pyalps.getResultFiles(prefix='parm1a')
ts_M = pyalps.loadTimeSeries(files[0], '|Magnetization|')

plt.plot(ts_M)
plt.xlabel('Monte Carlo sweep')
plt.ylabel('|Magnetization|')
plt.title('Magnetization time series')
plt.show()
```

检查所得的图：可观测量应当在经过初始的暂态之后稳定到一个大致不变的数值。
如果时间序列在模拟结束时仍在漂移，或者在最初的若干扫描中呈现出明显的趋势并一直延伸到测量阶段，那就说明热化期（`THERMALIZATION`）太短，必须加长。
对于上面的参数（`THERMALIZATION=10000`），时间序列已经围绕一个稳定的均值涨落，没有可见的漂移，说明热化是充分的：

![](/figs/mcs01btimeseries.png)

### 自动检查：`pyalps.checkSteadyState`

与其用肉眼判断平衡化，不如使用 `pyalps.checkSteadyState`，它通过统计检验来判定时间序列是否已经达到稳定分布。
它返回带有标记的数据，指明每个可观测量是否通过了检验。
默认的置信水平是 68.27%（一个标准差）；这个值可以提高：

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')

# 默认：68.27% 置信区间
data = pyalps.checkSteadyState(data)

# 更严格：90% 置信区间
data = pyalps.checkSteadyState(data, confidenceInterval=0.9)
```

## 收敛性

收敛性与平衡化是两个不同的问题：即使系统已经完全平衡，所测平均值的统计误差也只随独立样本数 $N$ 按 $1/\sqrt{N}$ 减小。
收敛性检查用于确认模拟已经积累了足够多的测量，使得误差估计可靠而稳定。

`pyalps.checkConvergence` 检验所测平均值的误差是否已经稳定下来。
它的用法与 `checkSteadyState` 相同：

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')
data = pyalps.checkConvergence(data)
```

如果检查未通过，请增大 `SWEEPS` 并重新运行模拟。

## 思考题

- 把 `THERMALIZATION` 期大幅缩短（例如缩短到 100 次扫描）。你能在时间序列中看到初始的暂态吗？`checkSteadyState` 会把它标记出来吗？
- 当温度偏离临界温度时，所需的热化长度会如何变化？可以试试 $T=1.5$ 和 $T=3.5$。
- 把 `SWEEPS` 增大和减小十倍。磁化强度的误差棒如何变化？这与预期的 $1/\sqrt{N}$ 标度一致吗？
- 为什么同时检查平衡化和收敛性很重要？一次模拟有没有可能通过其中一项检查而未通过另一项？
