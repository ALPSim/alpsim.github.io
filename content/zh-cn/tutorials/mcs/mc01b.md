
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

{{< callout type="warning" >}}
**pyalps 3.0.0 与 SciPy。** pyalps 3.0.0 中的 `checkSteadyState` 会调用 `scipy.linspace`，而较新的 SciPy 版本已经不再提供这个函数，因此会报错 `AttributeError: Module 'scipy' has no attribute 'linspace'`。
这个问题已在 ALPS 的 master 分支中修复。在修复发布之前，请在导入 pyalps 之前运行以下代码：

```Python
# 仅适用于 pyalps 3.0.0：恢复较新 SciPy 版本中已移除的 NumPy 别名
import scipy
import numpy as np

for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))
```
{{< /callout >}}

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

点击问题即可显示答案，再次点击则隐藏。

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">1. 把 <code>THERMALIZATION</code> 期大幅缩短（例如缩短到 100 次扫描）。你能在时间序列中看到初始的暂态吗？<code>checkSteadyState</code> 会把它标记出来吗？</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

请像 `parm1a` 那样使用局域更新：团簇更新只需几次更新就能完成热化，对它们来说 100 步的热化已经绰绰有余。

```Python
# 仅适用于 pyalps 3.0.0：参见 checkSteadyState 一节中关于 SciPy 的说明
import scipy
import numpy as np
for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))

import matplotlib.pyplot as plt
import pyalps

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'THERMALIZATION'  : 100,
    'SWEEPS'          : 50000,
    'UPDATE'          : "local",
    }]

input_file = pyalps.writeInputFiles('mc01b_q1', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

files = pyalps.getResultFiles(prefix='mc01b_q1')
data = pyalps.loadMeasurements(files, '|Magnetization|')
for dataset in pyalps.checkSteadyState(data):
    print('Steady state check:', dataset.props['checkSteadyState']['value'])

# 时间序列的每一项是一个分箱内每格点 |M| 的总和
ts_M = np.array(pyalps.loadTimeSeries(files[0], '|Magnetization|'))
M = data[0][0].y[0].mean
binsize = 2 ** int(round(np.log2(ts_M.mean() / M)))
sweeps = (np.arange(len(ts_M)) + 0.5) * binsize

plt.figure()
plt.plot(sweeps, ts_M / binsize, 'o-')
plt.axhline(M, ls='--', color='gray', label='mean')
plt.ylim(0, 1)
plt.xlabel('Monte Carlo sweeps after thermalization')
plt.ylabel('|Magnetization| per site')
plt.title('T = T_c, THERMALIZATION = 100 (each point: mean over %d sweeps)' % binsize)
plt.legend()
plt.show()
```

![](/figs/mc01b_q1_answergraph.png)

看不到初始暂态，原因有三：

- 测量在热化阶段结束之后才开始，因此前 100 次扫描根本不会出现在时间序列中。
- 每个点是一个包含 1024 次扫描的分箱的平均值（见上文的“时间序列的存储方式”），因此前一千次扫描内发生的任何变化都被平均进了第一个点。
- `spinmc` 从所有自旋朝上的状态出发。在 $T_c$ 处，磁化强度大约在前一千次扫描内从这个状态弛豫下来（见问题 2 中的图），这同样落在第一个点之内。

图中较深的下凹也不是暂态，而是局域更新在 $T_c$ 处缓慢的临界涨落（临界慢化，参见 [MC-01a](../mc01a)）。
要看到暂态本身，请把 `THERMALIZATION` 设为 0 并减少 `SWEEPS`，使分箱变短，就像问题 2 那样。

在我们的运行中，`checkSteadyState` 输出了 `False`，但这并不能说明 100 次扫描太少。
在 pyalps 3.0.0 中，默认的判据是 $|\text{slope}| / \sigma_\text{slope} < 0.41$（见上文 `checkSteadyState` 一节），因此即使是充分平衡的模拟，大多数时候也通不过，问题 4 展示了这一点。
反过来，通过检查也不能证明已经平衡，因为它只能检测线性漂移。
请务必同时查看时间序列。
</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">2. 当温度偏离临界温度时，所需的热化长度会如何变化？可以试试 T = 1.5 和 T = 3.5。</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

在 $T = 1.5$、$T_c$ 和 $T = 3.5$ 下不做任何热化直接运行，观察磁化强度需要多久才能稳定下来。
较短的模拟使分箱保持较短，弛豫的开始阶段因此清晰可见：

```Python
import numpy as np
import matplotlib.pyplot as plt
import pyalps

temperatures = [1.5, 2.269186, 3.5]
parms = []
for t in temperatures:
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : t,
        'THERMALIZATION'  : 0,
        'SWEEPS'          : 1000,
        'UPDATE'          : "local",
        })

input_file = pyalps.writeInputFiles('mc01b_q2', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

plt.figure()
for f in pyalps.getResultFiles(prefix='mc01b_q2'):
    data = pyalps.loadMeasurements([f], '|Magnetization|')[0][0]
    ts_M = np.array(pyalps.loadTimeSeries(f, '|Magnetization|'))
    # 时间序列的每一项是一个分箱内每格点 |M| 的总和
    binsize = 2 ** int(round(np.log2(ts_M.mean() / data.y[0].mean)))
    sweeps = (np.arange(len(ts_M)) + 0.5) * binsize
    # 用每次运行自身的参数标注曲线：结果文件的顺序与 parms 不一定相同
    plt.plot(sweeps, ts_M / binsize, 'o-', markersize=3, label='T = %g' % data.props['T'])
plt.ylim(0, 1.05)
plt.xlabel('Monte Carlo sweeps (no thermalization)')
plt.ylabel('|Magnetization| per site')
plt.title('Relaxation from the initial state, local updates')
plt.legend(loc='center right')
plt.show()
```

在生成这些图的 ALPS 3.0.0 中，由于 `Tmin` 的缘故（见上文关于 `Tmin` 的说明），模拟会远远超过 1000 次扫描。

![](/figs/mc01b_q2_relaxation.png)

每次运行都从 `spinmc` 的初始状态出发，即所有自旋朝上（$|M| = 1$）：

- 在 $T = 1.5$ 时，平衡磁化强度约为 0.99，与初始状态很接近，因此从第一个点起模拟就处于平衡。
- 在 $T = 3.5$ 时，只有第一个点（前 128 次扫描）高于约 0.04 的平衡值，因此系统在远少于 128 次扫描内就忘掉了初始状态。
- 在 $T_c$ 处，磁化强度在约 0.4 到 0.8 之间缓慢摆动，每次偏离持续数百到数千次扫描。系统需要相当的时间才能忘掉初始状态。

因此，所需的热化在 $T_c$ 处最长，在两侧则短得多，因为局域更新的自关联时间在临界点处达到峰值（临界慢化）。
对于 $T = 1.5$ 和 $T = 3.5$，`THERMALIZATION = 10000` 已经足够充裕。

这一结论取决于初始状态和更新方式。
如果从随机初始状态出发，局域更新在 $T = 1.5$ 时需要的时间会长得多，因为有序畴必须长大到整个晶格的尺寸。
团簇更新在这三个温度下都只需几次更新就能完成热化。

`checkSteadyState` 无法回答这个问题：它只检验整个序列是否存在线性漂移，因此无法判断暂态持续了多久，而且在 pyalps 3.0.0 中它的结果每次运行都会变化（见问题 1）。
</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">3. 把 <code>SWEEPS</code> 增大和减小十倍。磁化强度的误差棒如何变化？这与预期的 1/&radic;<i>N</i> 标度一致吗？</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

请使用 $T = 3.5$ 而不是 $T_c$：在 $T_c$ 处，局域更新的关联非常强，连误差棒本身都很难估计。
同时请使用局域更新。
在默认的团簇更新下，`SWEEPS` 计数的是单次 Wolff 团簇翻转，而在 $T = 3.5$ 时团簇很小，因此相邻的测量之间关联很强。

如果误差随测量次数 $N$ 按 $1/\sqrt{N}$ 标度，那么测量次数增加十倍，误差就缩小为 $1/\sqrt{10} \approx 0.32$ 倍，而乘积 $\text{error} \cdot \sqrt{N}$ 保持不变。
下面的脚本在每个误差棒旁边输出实际进行的测量次数：

```Python
import numpy as np
import pyalps

parms = []
for sweeps in [5000, 50000, 500000]:
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : 3.5,
        'THERMALIZATION'  : 10000,
        'SWEEPS'          : sweeps,
        'UPDATE'          : "local",
        })

input_file = pyalps.writeInputFiles('mc01b_q3', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

files = pyalps.getResultFiles(prefix='mc01b_q3')
data = pyalps.loadMeasurements(files, '|Magnetization|')
for run in sorted(pyalps.flatten(data), key=lambda run: run.props['SWEEPS']):
    # 实际进行的测量次数，可能超过 SWEEPS
    archive = pyalps.hdf5.archive(run.props['filename'])
    n = archive['/simulation/results/|Magnetization|/count']
    m = run.y[0]
    print('SWEEPS = %6d   measurements = %6d   |M| = %.5f +/- %.5f   error * sqrt(n) = %.3f'
          % (run.props['SWEEPS'], n, m.mean, m.error, m.error * np.sqrt(n)))
```

在我们的运行中，输出如下（你得到的数值会有所不同）：

```
SWEEPS =   5000   measurements =  25915   |M| = 0.04246 +/- 0.00049   error * sqrt(n) = 0.079
SWEEPS =  50000   measurements =  50189   |M| = 0.04091 +/- 0.00030   error * sqrt(n) = 0.068
SWEEPS = 500000   measurements = 509100   |M| = 0.04106 +/- 0.00010   error * sqrt(n) = 0.073
```

`SWEEPS` 并不是测量次数。
正如上文关于 `Tmin` 的说明，在 ALPS 3.0.0 中模拟会一直测量到调度器的下一次检查为止（这里每秒检查一次），因此 5000 次扫描的运行实际进行了约 26000 次测量。在 ALPS master 分支中则恰好进行 5000 次。
如果按 `SWEEPS` 比较，误差棒看不出明显的规律。
如果按实际测量次数比较，三次运行的 $\text{error} \cdot \sqrt{N}$ 都约为 0.07，正如 $1/\sqrt{N}$ 标度所预言的那样。

只有当分箱分析收敛时，误差棒才有意义。
分箱分析用越来越大的测量分箱来估计误差，这一估计会不断上升，直到分箱长度超过自关联时间后才趋于平稳：

```Python
binning = pyalps.loadBinningAnalysis(files, '|Magnetization|')
for run in sorted(pyalps.flatten(binning), key=lambda run: run.props['SWEEPS']):
    print('%6d' % run.props['SWEEPS'], ' '.join('%.1e' % e for e in run.y))
```

```
  5000 2.0e-04 2.6e-04 3.2e-04 3.8e-04 4.3e-04 4.6e-04 4.9e-04 4.9e-04
 50000 1.4e-04 1.8e-04 2.2e-04 2.6e-04 2.9e-04 3.0e-04 3.0e-04 3.0e-04 3.0e-04
500000 4.3e-05 5.6e-05 7.0e-05 8.3e-05 9.1e-05 9.6e-05 9.8e-05 9.8e-05 9.8e-05 9.9e-05 1.0e-04 1.0e-04
```

三次运行都趋于平稳，因此这些误差棒是可信的。
相邻测量之间的关联会使每个误差棒比独立样本时更大，但不会改变 $1/\sqrt{N}$ 标度。
</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">4. 为什么同时检查平衡化和收敛性很重要？一次模拟有没有可能通过其中一项检查而未通过另一项？</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

平衡化保证平均值不受初始状态的偏差影响。
收敛性保证这些平均值的误差棒是可靠的。
一次模拟可能单独未通过其中任何一项：热化不足的模拟可能在有偏的平均值周围给出既小又稳定的误差棒，而充分热化但相对于其自关联时间过短的模拟，误差棒则不可靠。

这两项检查检验的内容也不同。
`checkSteadyState` 寻找时间序列中的线性漂移，而 `checkConvergence` 检查误差的分箱分析是否已经趋于平稳（见问题 3）。
在我们的运行中，无论是否先做热化，局域更新在 $T_c$ 处用最多 50000 次扫描都从未通过 `checkConvergence`，因为那里的自关联时间对于这种长度的模拟来说太长了。

两项检查都是统计检验，因此即使是完全相同、充分热化的模拟，结果也不总是一致。
下面的脚本把同一个已平衡的团簇更新模拟重复五次：

```Python
# 仅适用于 pyalps 3.0.0：参见 checkSteadyState 一节中关于 SciPy 的说明
import scipy
import numpy as np
for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))

import pyalps

parms = []
for run in range(5):
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : 2.269186,
        'THERMALIZATION'  : 10000,
        'SWEEPS'          : 50000,
        'UPDATE'          : "cluster",
        })

input_file = pyalps.writeInputFiles('mc01b_q4', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='mc01b_q4'), '|Magnetization|')
steady = pyalps.checkSteadyState(data)
converged = pyalps.checkConvergence(data)

for run, (s, c) in enumerate(zip(steady, converged)):
    print('run %d   |M| = %.4f +/- %.4f   steady state: %s   converged: %s'
          % (run + 1, s.y[0].mean, s.y[0].error, s.props['checkSteadyState']['value'], c.props['checkConvergence']))
```

在我们的运行中，输出如下（你得到的标记会有所不同）：

```
run 1   |M| = 0.6205 +/- 0.0016   steady state: False   converged: True
run 2   |M| = 0.6237 +/- 0.0019   steady state: True   converged: True
run 3   |M| = 0.6226 +/- 0.0018   steady state: False   converged: True
run 4   |M| = 0.6239 +/- 0.0014   steady state: False   converged: True
run 5   |M| = 0.6216 +/- 0.0021   steady state: False   converged: False
```

五个平均值在误差范围内彼此一致，但标记却各不相同：一次运行两项都通过，三次运行只有稳态检查未通过，一次运行两项都未通过。
这里的稳态检查失败是误报，源于问题 1 中所述的 pyalps 3.0.0 的严格判据。
所以，一次模拟确实可能通过其中一项检查而未通过另一项。
请把这两项检查当作提示你该往哪里看的警告，并用时间序列和分箱分析加以确认。
</div>
</details>
