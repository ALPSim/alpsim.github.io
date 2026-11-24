
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

为了与团簇更新作比较，第二个参数文件 `parm1b` 除更新方式外与 `parm1a` 完全相同：

```
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=10000
SWEEPS=50000
UPDATE="cluster"
MODEL="Ising"
{L=48;}
```

```
parameter2xml parm1b
spinmc --Tmin 10 --write-xml parm1b.in.xml
```

### 在 Python 中准备并运行模拟

完整脚本见 <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01b-equilibration-and-convergence/tutorial1a.py" data-filename="tutorial1a.py" target="_blank" rel="noopener">`tutorial1a.py`</a>。
它首先导入所需的模块并定义模拟参数：

```Python
import pyalps
import numpy as np
import matplotlib.pyplot as plt

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'THERMALIZATION'  : 10000,
    'SWEEPS'          : 50000,
    'UPDATE'          : "local",
    }]

parms_cluster = [dict(parms[0], UPDATE="cluster")]
```

`UPDATE` 用于选择局域单自旋更新（`"local"`）或团簇更新（`"cluster"`）。
对于像这里的伊辛模型这样无阻挫的模型，如果省略该参数，`spinmc` 会使用团簇更新，因此这里显式地设定它，并定义第二组除更新方式外完全相同的参数，用于团簇更新的模拟。
注意步数的含义：局域更新时一步是对所有格点的一次扫描，而团簇更新时 `SWEEPS` 计数的是单次 Wolff 团簇翻转（每次翻转测量一次）；`THERMALIZATION` 在局域更新时计数扫描次数，在团簇更新时按团簇大小之和除以格点数来计数。

把两组参数分别写入 XML 输入文件并运行 `spinmc`：

```Python
input_file = pyalps.writeInputFiles('parm1a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)

input_file = pyalps.writeInputFiles('parm1b', parms_cluster)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)
```

`Tmin` 是调度器两次检查模拟是否结束之间的最短时间（单位：秒）。
在 ALPS 3.0.0 中，模拟在下一次检查之前会继续测量，因此一次运行得到的测量次数可能多于 `SWEEPS`；ALPS master 分支则在恰好 `SWEEPS` 次测量后停止。
在我们用 ALPS 3.0.0 进行的运行中，局域更新得到约 $1.5 \times 10^5$ 次测量，团簇更新得到约 $2.5 \times 10^5$ 次测量，所以下图的时间轴超过了 50000 步。

### 检查时间序列

检验平衡化最直接的办法是画出某个可观测量的时间序列。
我们载入两次运行的磁化强度时间序列并作图。
每个点是一个分箱内连续测量值的 $|M|$ 平均值：

```Python
for prefix, update in [('parm1a', 'local'), ('parm1b', 'cluster')]:
    files = pyalps.getResultFiles(prefix=prefix)
    ts_M = np.array(pyalps.loadTimeSeries(files[0], '|Magnetization|'))
    M = pyalps.loadMeasurements(files, '|Magnetization|')[0][0].y[0].mean

    # ts_M 的每个元素是一个分箱内每格点 |M| 测量值的总和
    binsize = 2 ** int(round(np.log2(ts_M.mean() / M)))
    sweeps = (np.arange(len(ts_M)) + 0.5) * binsize

    plt.figure()
    plt.plot(sweeps, ts_M / binsize, 'o-')
    plt.axhline(M, ls='--', color='gray', label='mean')
    plt.ylim(0, 1)
    # spinmc 在局域更新时把一步计为对整个格子的一次扫描，
    # 而在团簇更新时把一步计为单次 Wolff 团簇翻转
    unit = 'sweeps' if update == 'local' else 'cluster updates'
    plt.xlabel('Monte Carlo ' + unit)
    plt.ylabel('|Magnetization| per site')
    plt.title('T = T_c, %s updates (each point: mean over %d %s)' % (update, binsize, unit))
    plt.legend()
plt.show()
```

{{< callout type="info" >}}
**时间序列的存储方式。** ALPS 并不在时间序列中保存每一次测量：它最多保留约 128 个分箱，分箱大小随运行的进行而加倍。
`loadTimeSeries` 返回的每个元素是一个分箱内所有测量值的*总和*，因此脚本将其除以分箱大小（2 的幂，这里由平均值求出）才能得到每格点的 $|M|$，并把每个点放在其分箱的中点。
{{< /callout >}}

检查所得的图：可观测量应当在经过初始的暂态之后稳定到一个大致不变的数值。
如果时间序列在模拟结束时仍在漂移，或者在最初的若干扫描中呈现出明显的趋势并一直延伸到测量阶段，那就说明热化期（`THERMALIZATION`）太短，必须加长。
对于上面的参数（`THERMALIZATION=10000`），两次运行都围绕一个稳定的均值涨落，没有可见的漂移，说明热化是充分的。
不过这两条时间序列看起来非常不同：

![](/figs/mcs01btimeseries_local.png)

使用局域更新时，即使在 2048 次扫描上取平均，$|M|$ 仍在约 0.3 到 0.7 之间大幅摆动。
这并不是没有达到平衡——序列没有漂移——而是*临界慢化*：在 $T_c$ 处，单自旋更新的自相关时间达到数百次扫描甚至更长（参见 [MC-01a](../mc01a)）。
因此相邻分箱之间强烈相关，整个运行中独立样本的数目相对较少。

![](/figs/mcs01btimeseries_cluster.png)

团簇更新一次翻转整个关联的团簇，几次团簇更新之内就能去关联，因此各分箱的平均值都接近均值 $\langle |M| \rangle \approx 0.62$。
单次测量本身仍有很大的涨落（每次测量的标准差约为 0.17，这是真实的临界涨落），但这些涨落在每个分箱内被平均掉了。
两次运行给出的均值在误差范围内一致——在我们的运行中，局域更新为 $0.611 \pm 0.010$，团簇更新为 $0.622 \pm 0.001$——但团簇更新的误差棒要小十倍以上。

### 自动检查：`pyalps.checkSteadyState`

与其用肉眼判断平衡化，不如使用 `pyalps.checkSteadyState` 检验时间序列中是否存在线性漂移。
它对时间序列做直线拟合，如果拟合斜率与零相容，即 $|\text{slope}| / \sigma_\text{slope} < z_0$，则通过检验，其中 $z_0$ 是所选 `confidenceInterval` 对应的双侧正态分位数。
它返回带有标记的数据，指明每个可观测量是否通过了检验。
`confidenceInterval` 的默认值是 68.27%，对应 $z_0 = 1$（一个标准差）。
提高这个值会扩大接受区域（90% 对应 $z_0 \approx 1.64$），因此数值越大，检验越*宽松*，而不是越严格。
在 pyalps 3.0.0 及更早的版本中，截断值使用的是互补的置信水平，$z_0 = \Phi^{-1}(1 - \texttt{confidenceInterval}/2)$（默认值下约为 0.41，90% 时约为 0.13），因此在这些版本中数值越大检验越严格：

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')

# 默认：68.27%，|slope| < 1.0 sigma 时通过
data = pyalps.checkSteadyState(data)

# 更宽松：90%，|slope| < 1.64 sigma 时通过
data = pyalps.checkSteadyState(data, confidenceInterval=0.9)
```

通过这项检验并不能证明已经达到平衡：它只能发现线性趋势，因此自相关以及马尔可夫链困在构型空间某一区域的情况需要另行检查，例如借助上面的时间序列图。

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
