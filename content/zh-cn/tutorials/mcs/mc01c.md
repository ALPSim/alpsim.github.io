---
title: MC-01c 稳态检验
math: true
toc: true
weight: 4
---

蒙特卡洛模拟产生一条构型的马尔可夫链，只有当这条链忘掉了初始状态之后，它的测量才是在对平衡分布取样。
[MC-01b](../mc01b) 介绍了如何为此检查一个可观测量的时间序列，并介绍了 `pyalps.checkSteadyState`，它用一个统计检验把这种检查自动化。
本教程详细考察这个检验：它计算什么，它的截断值 $z_0$ 如何由标准正态分布 $\Phi$ 得到，在一切正常时它有多大概率通过，以及它能和不能发现哪些非平衡情形。

我们把这个检验用于两个程序：用 `spinmc` 对二维伊辛模型做经典蒙特卡洛模拟，以及用有向圈随机级数展开程序 `dirloop_sse` 对自旋 1/2 海森堡反铁磁体做量子蒙特卡洛模拟。
两者的主要结论相同：这个检验能发现持续了模拟大部分时间的漂移，会漏掉开始时短暂的暂态，而且只要时间序列存在自关联，它的误报就比其置信水平所暗示的更频繁。

## 稳态检验

### 检验统计量

ALPS 把每个可观测量的时间序列保存为最多约 128 个由连续测量组成的分箱（见 [MC-01b](../mc01b) 中的“时间序列的存储方式”）。
`checkSteadyState` 取这 $N$ 个分箱值 $y_1, \dots, y_N$，用最小二乘法对点 $(t, y_t)$（$t = 1, \dots, N$）拟合一条直线 $y \approx \beta_0 + \beta_1 t$。
拟合得到的斜率为

$$\beta_1 = \frac{\sum_t (t - \bar t)(y_t - \bar y)}{\sum_t (t - \bar t)^2}, \qquad \sum_{t=1}^{N} (t - \bar t)^2 = \frac{N(N^2-1)}{12}.$$

如果序列没有漂移，并且它的 $N$ 个值彼此独立、标准差为 $\sigma_y$，那么斜率在零附近涨落，其标准误差为 $\sigma_y \big/ \sqrt{\sum_t (t - \bar t)^2}$。
检验用序列的样本标准差 $s$ 来估计 $\sigma_y$，因此斜率误差为

$$\sigma_{\beta_1} = s \sqrt{\frac{12}{N(N^2-1)}},$$

而检验统计量就是以其误差为单位的斜率，

$$z = \frac{|\beta_1|}{\sigma_{\beta_1}}.$$

在这些假设下，带符号的比值 $\beta_1 / \sigma_{\beta_1}$ 近似是一个标准正态变量 $Z$（均值 0，标准差 1）。
如果 $z < z_0$，检验就通过，其中截断值 $z_0$ 取决于你所选的置信水平。

有两个细节在后面很重要。
第一，$s$ 是序列本身的标准差，而不是相对于拟合直线的残差的标准差，因此强烈的漂移也会使 $s$ 增大，并把 $z$ 限制在约 $\sqrt{N}$ 以内。
第二，斜率误差假设各分箱彼此独立；[MC-01a](../mc01a) 表明相邻的测量并不独立，相邻的分箱也不独立，除非每个分箱都远长于自关联时间。

### 标准正态分布 $\Phi$

$\Phi$ 是标准正态分布的累积分布函数，即 $Z$ 不超过 $x$ 的概率：

$$\Phi(x) = P(Z \le x) = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^{x} e^{-u^2/2}\, du = \frac{1}{2}\left[1 + \operatorname{erf}\!\left(\frac{x}{\sqrt 2}\right)\right].$$

它从 0 增加到 1，$\Phi(0) = 1/2$，$\Phi(1) \approx 0.8413$，$\Phi(1.96) \approx 0.975$，并且具有对称性：$\Phi(-x) = 1 - \Phi(x)$。
它的反函数 $\Phi^{-1}$ 称为分位数函数，返回 $\Phi$ 达到给定概率 $p$ 时的 $x$。
在 SciPy 中，$\Phi$ 是 `scipy.stats.norm.cdf`，$\Phi^{-1}$ 是 `scipy.stats.norm.ppf`。

### 截断值 $z_0$

`checkSteadyState` 的参数 `confidenceInterval`（记为 $c$）是没有漂移的序列通过检验的概率。
接受区域 $-z_0 < Z < z_0$ 是对称的，因此

$$P(|Z| < z_0) = \Phi(z_0) - \Phi(-z_0) = 2\Phi(z_0) - 1 = c \quad\Longrightarrow\quad z_0 = \Phi^{-1}\!\left(\frac{1+c}{2}\right).$$

区域之外的概率 $1 - c$ 平均分给两侧的尾部，每侧 $(1-c)/2$，这就是 $(1+c)/2$ 的来历。
默认值 $c = 0.6827$ 给出 $z_0 = 1$：如果斜率在零附近一个标准误差以内，检验就通过。
较大的 $c$ 会扩大接受区域，因此使检验*更宽松*，而不是更严格。

pyalps 3.0.0 及更早的版本把截断值算成 $\Phi^{-1}(1 - c/2)$，这在每侧尾部放了 $c/2$：它是互补水平 $1 - c$ 的截断值。
这使得默认的检验只让 32% 的无漂移序列通过，而且 $c$ 越大检验越严格。
ALPS 的 master 分支使用 $\Phi^{-1}((1+c)/2)$。

脚本 <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/tutorial1c_test.py" data-filename="tutorial1c_test.py" target="_blank" rel="noopener">`tutorial1c_test.py`</a> 不借助 ALPS，手工计算这个检验。
它的两个函数复现了 `checkSteadyState`：

```Python
import numpy as np
from scipy.stats import norm

def steady_state_z(ts):
    """返回拟合斜率、其标准误差以及 z = |slope| / error。"""
    ts = np.asarray(ts, dtype=float)
    N = len(ts)
    t = np.arange(1, N + 1)
    slope = np.polyfit(t, ts, 1)[0]
    error = np.std(ts, ddof=1) * np.sqrt(12. / (N * (N**2 - 1)))
    return slope, error, abs(slope) / error

def cutoff(c):
    """使标准正态变量 Z 满足 P(|Z| < z0) = c 的 z0。"""
    return norm.ppf((1. + c) / 2.)
```

脚本接着输出常用置信水平下的 $z_0$，以及无漂移序列通过检验的比例 $2\Phi(z_0) - 1$：

```
     c      z0   pass rate   z0 (3.0.0)   pass rate (3.0.0)
0.6827   1.000       0.683        0.409               0.317
0.9000   1.645       0.900        0.126               0.100
0.9500   1.960       0.950        0.063               0.050
0.9900   2.576       0.990        0.013               0.010
```

并在标准正态分布的密度上画出接受区域：

![](/figs/mc01c_acceptance.png)

### 存在自关联的序列

只有当 $N$ 个点彼此独立时，通过率才等于 $c$。
为了看清自关联的影响，`tutorial1c_test.py` 把检验用于 10000 条没有任何漂移、由 $x_i = a\, x_{i-1} + \text{noise}$ 生成的 $N = 128$ 点合成序列。
这样的序列以点为单位的积分自关联时间为 $\tau = (1+a)/(2(1-a))$，即 [MC-01a](../mc01a) 中定义的量：

```Python
rng = np.random.default_rng(2026)
N, samples = 128, 10000
z0 = cutoff(0.6827)
for a in [0., 0.5, 0.8, 0.95]:
    z = np.empty(samples)
    for k in range(samples):
        noise = rng.normal(size=N)
        series = np.empty(N)
        series[0] = noise[0] / np.sqrt(1 - a**2)
        for i in range(1, N):
            series[i] = a * series[i - 1] + noise[i]
        z[k] = steady_state_z(series)[2]
    tau = (1 + a) / (2 * (1 - a))
    print('%7.1f   %.3f' % (tau, np.mean(z < z0)))
```

```
    tau   fraction passing at c = 0.6827 (N = 128 points)
    0.5   0.685
    1.5   0.441
    4.5   0.250
   19.5   0.124
```

独立的点（$\tau = 1/2$）以名义通过率通过。
对于相关的点，斜率的涨落比 $\sigma_{\beta_1}$ 所假设的更大，$z$ 大约被放大 $\sqrt{2\tau}$ 倍，没有任何漂移的序列在大多数情况下也通不过。
对于 ALPS 的时间序列，这里的 $\tau$ 是以分箱为单位的自关联时间：当每个分箱远长于测量的自关联时间时它很小，否则它为 1 的量级或更大。

## 模型

经典蒙特卡洛模拟针对正方晶格上的铁磁伊辛模型，

$$H = -J \sum_{\langle i,j \rangle} \sigma_i \sigma_j, \qquad \sigma_i = \pm 1,$$

它由 [E. Ising, Z. Phys. 31, 253 (1925)](https://doi.org/10.1007/BF02980577) 提出。
它的临界温度 $T_c = 2J / \ln(1+\sqrt{2}) \approx 2.269186\, J$ 由 [L. Onsager, Phys. Rev. 65, 117 (1944)](https://doi.org/10.1103/PhysRev.65.117) 精确求得。
在 $T_c$ 处局域更新的自关联时间很长，这对任何平衡化检验都是一个严苛的情形。

量子蒙特卡洛模拟针对正方晶格上的自旋 1/2 海森堡反铁磁体，

$$H = J \sum_{\langle i,j \rangle} \mathbf{S}_i \cdot \mathbf{S}_j, \qquad J > 0,$$

（[W. Heisenberg, Z. Phys. 49, 619 (1928)](https://doi.org/10.1007/BF01328601)），使用 [O. F. Syljuåsen and A. W. Sandvik, Phys. Rev. E 66, 046701 (2002)](https://doi.org/10.1103/PhysRevE.66.046701) 中随机级数展开的有向圈算法进行模拟。
所考察的可观测量是能量。

## 参数

| 参数 | 含义 | `spinmc` 漂移模拟 | `spinmc` 已平衡的模拟 | `dirloop_sse` 无热化的模拟 | `dirloop_sse` 已平衡的模拟 |
|---|---|---|---|---|---|
| `LATTICE` | 晶格 | `square lattice` | `square lattice` | `square lattice` | `square lattice` |
| `MODEL` | 哈密顿量 | `Ising` | `Ising` | `spin` | `spin` |
| `local_S` | 每个格点的自旋 | – | – | `1/2` | `1/2` |
| `L` | 晶格线度（$L \times L$ 个格点，周期边界） | `128` | `48` | `32` | `32` |
| `J` | 耦合 | `1`（铁磁） | `1` | `1`（反铁磁） | `1` |
| `T` | 温度 | `2.269186`（$T_c$） | `2.269186` | `0.25` | `0.25` |
| `UPDATE` | 局域更新或团簇更新 | `local` | `local` 和 `cluster` | – | – |
| `THERMALIZATION` | 测量前舍弃的步数 | `0` | `10000` | `0` | `1000` |
| `INITIAL_CUTOFF` | 算符序列的初始长度（SSE） | – | – | `40000` | – |
| `SWEEPS` | 测量步数 | `2000` | `20000` | `2000` | `4000` |
| 模拟次数 | 使用这些参数的独立模拟次数 | 1 | 每种更新 100 次 | 10 | 100 |

对于局域更新，一步是对所有格点的一次扫描；对于团簇更新，`SWEEPS` 计数的是单次 Wolff 团簇翻转（见 [MC-01b](../mc01b)）。

## 参数文件

命令行模拟使用两个参数文件。
<a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/parm1c_drift" data-filename="parm1c_drift" target="_blank" rel="noopener">`parm1c_drift`</a> 在 $T_c$ 下不经热化地启动一个大的伊辛晶格：

```
LATTICE="square lattice"
MODEL="Ising"
T=2.269186
J=1
UPDATE="local"
THERMALIZATION=0
SWEEPS=2000
{L=128;}
```

<a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/parm1c_sse" data-filename="parm1c_sse" target="_blank" rel="noopener">`parm1c_sse`</a> 不经热化地启动海森堡反铁磁体：

```
LATTICE="square lattice"
MODEL="spin"
local_S=1/2
T=0.25
J=1
THERMALIZATION=0
INITIAL_CUTOFF=40000
SWEEPS=2000
{L=32;}
```

重复的模拟在下面的 Python 脚本中设置，它们在循环中构造同样的参数。

## 晶格

两个模型都定义在周期性的正方晶格上，每条最近邻键上的耦合为 $J$：

```
  :       :       :       :
--o---J---o---J---o---J---o---J--
  |       |       |       |
  J       J       J       J
  |       |       |       |
--o---J---o---J---o---J---o---J--      L x L sites, periodic in both directions
  |       |       |       |
  J       J       J       J
  |       |       |       |
--o---J---o---J---o---J---o---J--
  :       :       :       :
```

正方晶格使伊辛模型在一个精确已知的 $T_c$ 处发生有限温度相变；它又是二分晶格，因此海森堡反铁磁体在量子蒙特卡洛中没有符号问题。
它就是 [ALPS 晶格库](../../../documentation/intro/latticehowtos) 中内置的 `square lattice`。

## 方法选择

`spinmc` 提供局域 Metropolis 更新和 Wolff 团簇更新。
在 $T_c$ 处，局域更新的自关联时间随系统尺寸大约按 $L^{2.17}$ 增长（临界慢化），而团簇更新在几次团簇翻转之内就失去关联（见 [MC-01a](../mc01a)）。
比较两者可以看出时间序列的自关联如何影响检验。
一次 $48 \times 48$、30000 步的模拟需要一两秒。

对于量子模型，$32 \times 32$ 个自旋的希尔伯特空间有 $2^{1024}$ 个态，远远超出精确对角化的能力，而 `dirloop_sse` 在 $T = 0.25$ 下每次模拟只需几秒钟就能对它取样。
有向圈程序没有可供比较的局域和团簇两种版本，但它的能量很快失去关联，而且它的算符序列从空开始，必须增长到平衡长度。
在热化期间，程序还会调整算符序列的截断长度；如果不做热化，除非把 `INITIAL_CUTOFF` 设得足够大，否则它会以 "nnonzero reached the maximum value" 停止。

## 运行模拟

在命令行中，把参数文件转换为 XML，并运行这两个程序：

```
parameter2xml parm1c_drift
spinmc --Tmin 1 --write-xml parm1c_drift.in.xml

parameter2xml parm1c_sse
dirloop_sse --Tmin 1 parm1c_sse.in.xml
```

然后在 Python 中对结果做检验（使用 pyalps 3.0.0 时，请先阅读末尾的说明）：

```Python
import pyalps

for prefix, observable in [('parm1c_drift', '|Magnetization|'), ('parm1c_sse', 'Energy')]:
    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix=prefix), observable)
    for d in pyalps.checkSteadyState(data):
        print(prefix, d.props['checkSteadyState'])
```

三个脚本运行全部内容，包括重复的模拟，并输出下文所示的数值和图：

```
python tutorial1c_test.py
python tutorial1c_spinmc.py
python tutorial1c_sse.py
```

请把 <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/tutorial1c_spinmc.py" data-filename="tutorial1c_spinmc.py" target="_blank" rel="noopener">`tutorial1c_spinmc.py`</a> 和 <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/tutorial1c_sse.py" data-filename="tutorial1c_sse.py" target="_blank" rel="noopener">`tutorial1c_sse.py`</a> 下载到 `tutorial1c_test.py` 所在的目录。
每个脚本都像上面那样定义了 `steady_state_z` 和 `cutoff`，因此数值不依赖于 pyalps 的版本（见末尾的说明）。
每个脚本中重复的模拟需要几分钟。

## 结果：经典蒙特卡洛

### 仍在漂移的模拟

`tutorial1c_spinmc.py` 首先运行 `parm1c_drift`，并分别手工和用 `pyalps.checkSteadyState` 计算检验：

```Python
files = pyalps.getResultFiles(prefix='parm1c_drift')
ts = np.array(pyalps.loadTimeSeries(files[0], '|Magnetization|'))
slope, error, z = steady_state_z(ts)
print('drift run: %d bins, z = %.2f, cutoff z0 = %.2f, passes: %s'
      % (len(ts), z, cutoff(0.6827), z < cutoff(0.6827)))

data = pyalps.loadMeasurements(files, '|Magnetization|')
for d in pyalps.checkSteadyState(data):
    s = d.props['checkSteadyState']
    print('pyalps.checkSteadyState: z = %.2f, z0 = %.2f, passes: %s'
          % (s['statistics']['z'], s['statistics']['z0'], s['value']))
```

在我们的运行中，输出如下：

```
drift run: 124 bins, z = 8.45, cutoff z0 = 1.00, passes: False
pyalps.checkSteadyState: z = 8.45, z0 = 1.00, passes: False
```

手工计算的 $z$ 和 $z_0$ 与库函数的结果一致。
使用 pyalps 3.0.0 时，库函数会输出 $z_0 = 0.41$（见末尾的说明），这次模拟同样通不过。

![](/figs/mc01c_spinmc_drift.png)

`spinmc` 从所有自旋朝上的状态出发，磁化强度先在几百次扫描内从 1 弛豫到约 0.6。
此后它一直在约 0.35 到 0.75 之间缓慢游荡：在 $T_c$ 处，$128 \times 128$ 晶格上局域更新的自关联时间远长于这次模拟。
检验不通过是正确的：在这次模拟的时间尺度上，磁化强度并不处于稳态，无论把这种缓慢游荡称为初始弛豫的尾声还是临界慢化。

### 多次已平衡的模拟

接下来，脚本把一次经过 10000 步热化的已平衡模拟，用局域更新和团簇更新各重复 100 次，并记录检验通过的频率：

```Python
NRUNS = 100
c = 0.6827
for update in ['local', 'cluster']:
    parms = [{
        'LATTICE'        : "square lattice",
        'MODEL'          : "Ising",
        'L'              : 48,
        'J'              : 1.,
        'T'              : 2.269186,
        'UPDATE'         : update,
        'THERMALIZATION' : 10000,
        'SWEEPS'         : 20000,
    } for run in range(NRUNS)]
    prefix = 'parm1c_' + update
    input_file = pyalps.writeInputFiles(prefix, parms)
    pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

    z = np.array([steady_state_z(pyalps.loadTimeSeries(f, '|Magnetization|'))[2]
                  for f in pyalps.getResultFiles(prefix=prefix)])
    print('%-7s updates: %d runs, fraction passing at c = %g: %.2f (expected %.2f)'
          % (update, len(z), c, np.mean(z < cutoff(c)), c))
```

```
local   updates: 100 runs, fraction passing at c = 0.6827: 0.41 (expected 0.68)
cluster updates: 100 runs, fraction passing at c = 0.6827: 0.72 (expected 0.68)
```

| 更新方式 | 模拟次数 | $c = 0.6827$ 时的通过比例 | 分箱独立时的预期值 |
|---|---|---|---|
| 局域 | 100 | 0.41 | 0.68 |
| 团簇 | 100 | 0.72 | 0.68 |

模拟 100 次时，这些比例的统计不确定度约为 $\pm 0.05$。
团簇更新的模拟以名义通过率通过，它们的 $z$ 值服从标准正态变量 $Z$ 的 $|Z|$ 的分布。
局域更新的模拟虽然每一次都已平衡，却有一半以上通不过：它们的 $z$ 分布在 2 以外有一条长尾。

![](/figs/mc01c_spinmc_z.png)

原因在于分箱之间的自关联。
局域更新模拟的每个分箱平均了 256 次扫描，在 $T_c$ 处这并不比自关联时间长多少，因此相邻的分箱相互关联，检验把缓慢的涨落当成了漂移。
团簇更新在每个分箱之内就失去关联，各分箱表现得像独立样本。

## 结果：量子蒙特卡洛

### 开始时短暂的暂态

`tutorial1c_sse.py` 首先把 `parm1c_sse` 重复十次，并分别对包含和不包含第一个分箱的时间序列计算检验：

```Python
NSTART = 10
parms = [{
    'LATTICE'        : "square lattice",
    'MODEL'          : "spin",
    'local_S'        : 0.5,
    'L'              : 32,
    'J'              : 1.,
    'T'              : 0.25,
    'THERMALIZATION' : 0,
    'INITIAL_CUTOFF' : 40000,
    'SWEEPS'         : 2000,
} for run in range(NSTART)]
input_file = pyalps.writeInputFiles('parm1c_sse', parms)
pyalps.runApplication('dirloop_sse', input_file, Tmin=1)

files = pyalps.getResultFiles(prefix='parm1c_sse')
series = [np.array(pyalps.loadTimeSeries(f, 'Energy')) for f in files]
z = np.array([steady_state_z(ts)[2] for ts in series])
z_rest = np.array([steady_state_z(ts[1:])[2] for ts in series])
```

在我们的运行中，输出如下：

```
runs without thermalization: z = 1.6 2.1 1.8 2.5 1.2 2.1 1.8 1.8 2.1 1.4
the same runs without the first bin: z = 0.3 1.4 0.3 3.1 1.6 1.8 0.4 0.4 1.5 0.6
fraction passing at c = 0.6827 (z0 = 1.00): 0.0 with the first bin, 0.5 without
fraction passing at c = 0.95 (z0 = 1.96): 0.6 with the first bin, 0.9 without
```

![](/figs/mc01c_sse_transient.png)

能量在包含 16 次扫描的第一个分箱内就弛豫下来，这期间算符序列从空的初始状态增长起来。
第一个分箱比平衡能量高出约 300，约为后面各分箱涨落的四十倍，然而图中这次模拟的 $z$ 只有 1.6：它以很小的差距没有通过默认的检验，而在 $c = 0.95$ 时通过。
开头单独一个偏离的点只会产生显著性不高的斜率，而且它还会增大斜率所除的标准差 $s$。
在 $c = 0.6827$ 时，十次模拟全都通不过，其中大多数只差一点；在 $c = 0.95$ 时，十次中有六次通过。
这个检验是为发现整个序列上的线性趋势而设计的；局限在前几个分箱中的暂态，最好通过查看时间序列来发现，或者干脆热化几百次扫描来避免。

### 多次已平衡的模拟

经过 1000 次扫描的热化，重复 100 次模拟得到：

```
100 equilibrated runs, fraction passing at c = 0.6827: 0.70 (expected 0.68)
```

![](/figs/mc01c_sse_z.png)

这里每个分箱平均了 32 次扫描，已经长于 SSE 能量的自关联时间，因此各分箱几乎独立，检验以名义通过率通过，与团簇更新的伊辛模拟相同。

## pyalps 3.0.0

{{< callout type="warning" >}}
**pyalps 3.0.0 及更早的版本。** `checkSteadyState` 使用截断值 $\Phi^{-1}(1 - c/2)$，默认值下约为 0.41，因此约有三分之二的无漂移序列通不过，而且 `confidenceInterval` 越大检验越严格。
它还会调用 `scipy.linspace`，而较新的 SciPy 版本已经不再提供这个函数，因此会以 `AttributeError: Module 'scipy' has no attribute 'linspace'` 停止。
这两个问题都已在 ALPS 的 master 分支中修复。
本教程的脚本自己计算 $z$ 和 $z_0$，不受这两个问题的影响；如果要在 pyalps 3.0.0 中调用 `checkSteadyState`，请在导入 pyalps 之前运行以下代码：

```Python
# 仅适用于 pyalps 3.0.0：恢复较新 SciPy 版本中已移除的 NumPy 别名
import scipy
import numpy as np

for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))
```

本页的结果是用 ALPS 的 master 分支得到的，在这个分支中，一次模拟恰好进行 `SWEEPS` 次测量。使用 pyalps 3.0.0 时，一次模拟会一直测量到调度器的下一次检查（见 [MC-01b](../mc01b) 中的 `Tmin`），因而测量次数可能更多。
这改变的是分箱的数目，而不是检验的行为。
{{< /callout >}}

## 总结与展望

`checkSteadyState` 把分箱后时间序列的拟合斜率除以假设分箱独立时的标准误差，如果比值小于 $z_0 = \Phi^{-1}((1+c)/2)$ 就通过。
它能发现持续了模拟大部分时间的漂移，几乎察觉不到局限在前几个分箱中的暂态，而当相邻分箱相互关联时（例如 $T_c$ 处的局域更新），它让已平衡模拟不通过的频率远高于 $1 - c$。
请把它当作一种警告，与时间序列本身以及 [MC-01a](../mc01a) 中的分箱分析一起使用，而不是当作已经平衡的证明。

1. 用 $c = 0.95$ 重新运行 `tutorial1c_spinmc.py` 的第二部分。局域更新和团簇更新的通过比例与 0.95 有多接近？
2. 给漂移模拟加上 50000 次扫描的热化。现在它能通过吗？答案如何依赖于 $L$？
3. 对局域更新的模拟，先把相邻的两个分箱相加（如果分箱数为奇数，就舍去最后一个），再计算 $z$。通过比例如何变化？为什么？
4. 在 $T_c$ 下对 $L = 16$、32 和 48 进行局域更新的实验。误报率如何依赖于 $L$？这与 MC-01a 中的自关联时间有什么关系？
5. 在 `tutorial1c_test.py` 中，给一条无漂移合成序列的第一个点加上一个离群值。以噪声为单位，它要多大才能使检验在 $c = 0.95$ 时不通过？
6. 设计一个更好的检验来发现模拟开始时的暂态，例如比较时间序列前四分之一和后四分之一的平均值。它能发现 SSE 模拟中的暂态吗？
