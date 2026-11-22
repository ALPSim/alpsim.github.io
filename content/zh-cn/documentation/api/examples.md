
---
title: 测量示例
linkTitle: 示例
math: true
toc: true
weight: 4
---

本页列出每个 ALPS 应用程序所测量的物理量，并给出完整脚本，演示从运行模拟、加载数据、提取感兴趣的物理量到绘图的全过程。
本页所有脚本均已在 ALPS 3.0.0 上运行，图片即这些脚本的输出。

所有示例都遵循相同的四个步骤：

1. **运行**：用 [`pyalps.writeInputFiles`](../runapp) 写入参数，并用 [`pyalps.runApplication`](../runapp) 启动应用程序。
2. **加载**：用某个[加载函数](../loadat)读取结果。使用哪个函数取决于方法（见下表）。
3. **提取**：按名称选取观测量，必要时用 [`pyalps.collectXY`](../eval) 将其整理为曲线，或转换为 NumPy 数组。
4. **绘图**：使用 [`pyalps.plot.plot`](../eval) 或直接使用 matplotlib。

## 可用的测量量

观测量名称是精确的字符串：如果没有名为 `Sz Correlations` 的观测量，`pyalps.loadMeasurements(files, 'Sz Correlations')` 会不报错地返回空列表。
下面列出的是各应用程序实际写出的名称。

### 概览

| 方法（应用程序） | 热力学量 | 关联函数、结构因子、格林函数 | 加载函数 |
|---|---|---|---|
| 经典蒙特卡罗（`spinmc`） | 能量、磁化强度、磁化率；调用 `pyalps.evaluateSpinMC` 后还有比热和 Binder 累积量 | — | `loadMeasurements` |
| 量子蒙特卡罗，loop 算法（`loop`） | 能量、比热、（交错）磁化强度与磁化率、Binder 比、刚度 | 自旋关联、结构因子、格林函数（在 3.0.0 中失败，见[已知问题](#alps-300-中的已知问题)） | `loadMeasurements` |
| 量子蒙特卡罗，有向圈（`dirloop_sse`） | 能量、动能、（交错）磁化强度、磁化率、刚度；粒子模型还有密度 | 自旋或密度关联、结构因子、格林函数（有注意事项，见[已知问题](#alps-300-中的已知问题)） | `loadMeasurements` |
| 量子蒙特卡罗，worm 算法（`worm`） | 能量、密度、刚度、缠绕数、电荷序 | 密度关联、结构因子、格林函数 | `loadMeasurements` |
| 量子 Wang–Landau（`qwl`） | 能量、自由能、熵、比热、磁化率，均为 $T$ 的连续函数 | 均匀与交错结构因子 | `evaluateQWL` |
| 完全对角化（`fulldiag`） | 能量、自由能、熵、比热、磁化率、磁化强度随 $T$ 或 $h$ 的变化 | 每个本征态的自定义 `MEASURE_*` | `evaluateFulldiagVersusT`、`evaluateFulldiagVersusH`、`loadSpectra`、`loadEigenstateMeasurements` |
| 稀疏对角化（`sparsediag`） | 低能态的能量 | 每个本征态的自定义 `MEASURE_*` | `loadEigenstateMeasurements`、`loadSpectra` |
| DMRG（`dmrg`） | 基态与激发态能量、截断误差 | 每个本征态的自定义 `MEASURE_*` | `loadEigenstateMeasurements` |

在量子蒙特卡罗程序中，关联函数、结构因子和格林函数分别由 `MEASURE[Correlations]`、`MEASURE[Structure Factor]` 和 `MEASURE[Green Function]` 开启。

### 蒙特卡罗应用程序

标量观测量总会被测量。
矢量观测量（每个格点、距离或波矢对应一个值）只有在相应开关设为 `true` 时才会被测量。

| 应用程序 | 标量观测量 | 矢量观测量（开关） |
|---|---|---|
| `spinmc`（模型 `Ising`、`XY`、`Heisenberg`） | `Energy`、`Energy Density`、`Energy^2`、`\|Magnetization\|`、`Magnetization^2`、`Magnetization^4`、`\|Staggered Magnetization\|`、`Staggered Magnetization^2`、`Susceptibility`、`Magnetization along Field`、`Bond-type Energy`、`Cluster size`。调用 `pyalps.evaluateSpinMC` 后：`Specific Heat`、`Binder Cumulant`、`Binder Cumulant U2`、`Connected Susceptibility` | 无 |
| `loop` | `Energy`、`Energy Density`、`Specific Heat`、`Magnetization`、`\|Magnetization\|`、`Magnetization^2`、`Magnetization^4`（及 `... Density` 版本）、`Susceptibility`，以及对应的 `Staggered` 版本、`Binder Ratio of Magnetization`、`Binder Ratio of Staggered Magnetization`、`Stiffness`，以及 `Generalized ...` 版本 | `Spin Correlations`、`Staggered Spin Correlations`、`Generalized Spin Correlations`、`Generalized Staggered Spin Correlations`（`MEASURE[Correlations]`）；`Spin Structure Factor`（`MEASURE[Structure Factor]`）；`Green's Function`（`MEASURE[Green Function]`） |
| `dirloop_sse`，自旋模型 | `Energy`、`Energy Density`、`Kinetic Energy`、`Magnetization`、`\|Magnetization\|`、`Magnetization^2`、`Magnetization^4`（及 `... Density` 版本），以及对应的 `Staggered` 版本、`Susceptibility`、`Stiffness`、`n`、`n^2`、`n^3`（SSE 展开阶数） | `Spin Correlations`（`MEASURE[Correlations]`）；`Spin Structure Factor`（`MEASURE[Structure Factor]`）；`Green's Function`（`MEASURE[Green Function]`） |
| `dirloop_sse`，粒子模型 | `Energy`、`Kinetic Energy`、`Density`、`Density^2`、`Checkerboard Charge Order`（及 `^2`、`^4`）、`Stiffness`、`n`、`n^2`、`n^3` | `Density Correlations`（`MEASURE[Correlations]`）；`Density Structure Factor`（`MEASURE[Structure Factor]`）；`Green's Function`（`MEASURE[Green Function]`） |
| `worm`（玻色子模型） | `Energy`、`Energy Density`、`Density`、`Density^2`、`Stiffness`、`Winding number^2`、`Checkerboard Charge Order`（及 `^2`、`^4`） | `Density Correlations`（`MEASURE[Correlations]`）；`Density Structure Factor`（`MEASURE[Structure Factor]`）；`Green's Function`（`MEASURE[Green Function]`） |

矢量观测量的含义：

- `Spin Correlations`：$\langle S^z_0 S^z_{\mathbf{r}} \rangle$。x 值是相对格点 0 的位移 $\mathbf{r}$（以晶格常数为单位），例如 `[1 0]`。
- `Spin Structure Factor`：$S(\mathbf{q}) = \sum_{\mathbf{r}} e^{i\mathbf{q}\cdot\mathbf{r}} \langle S^z_0 S^z_{\mathbf{r}} \rangle$。x 值是晶格允许的波矢 $\mathbf{q}$，例如 `[3.14159 3.14159]`。
- `Green's Function`：等时非对角关联 $\langle S^+_0 S^-_{\mathbf{r}} \rangle$（玻色子为 $\langle b^\dagger_0 b_{\mathbf{r}} \rangle$），x 值是位移 $\mathbf{r}$。它是距离的函数，而不是虚时间的函数。
- `Density Correlations` 和 `Density Structure Factor`：粒子密度的相应量。

要查看一个蒙特卡罗结果文件中包含哪些观测量，可以打印观测量名称：

```Python
import pyalps
files = pyalps.getResultFiles(prefix='parm')
print(sorted(pyalps.loadObservableList(files)[0]))
```

### 评估工具：qwl 与 fulldiag

`qwl` 保存高温展开的系数，`fulldiag` 保存完整能谱。
它们的评估函数在温度网格（`T_MIN`、`T_MAX`、`DELTA_T`）上把这些数据转换为热力学量，并为每个物理量返回一个 DataSet：

| 函数 | 返回的物理量 |
|---|---|
| `pyalps.evaluateQWL` | `Energy Density`、`Free Energy Density`、`Entropy Density`、`Specific Heat per Site`、`Uniform Susceptibility per Site`、`Uniform Structure Factor per Site`、`Staggered Structure Factor per Site` |
| `pyalps.evaluateFulldiagVersusT` | `Energy Density`、`Free Energy Density`、`Entropy Density`、`Specific Heat per Site`、`Uniform Susceptibility per Site`、`Magnetization per Site` |
| `pyalps.evaluateFulldiagVersusH` | 在固定 `T` 下，上述物理量作为磁场的函数 |

`pyalps.loadSpectra` 返回 `fulldiag` 或 `sparsediag` 运行中每个对称性扇区的本征值。

### 自定义测量：sparsediag、fulldiag 与 dmrg

对角化与 DMRG 程序测量用户指定的算符，这些算符由模型的格点算符（自旋模型为 `Sz`、`Splus`、`Sminus`）以及 `exchange` 等键算符构成。
方括号中的观测量名称由用户自行选择：

| 参数 | 测量内容 | 示例 |
|---|---|---|
| `MEASURE_AVERAGE[name]=op` | $\langle \sum_i \mathrm{op}_i \rangle$ | `MEASURE_AVERAGE[Magnetization]=Sz` |
| `MEASURE_LOCAL[name]=op` | 每个格点 $i$ 上的 $\langle \mathrm{op}_i \rangle$ | `MEASURE_LOCAL[Local magnetization]=Sz` |
| `MEASURE_CORRELATIONS[name]=op` 或 `"op1:op2"` | 所有格点对的 $\langle \mathrm{op1}_i\, \mathrm{op2}_j \rangle$ | `MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"` |
| `MEASURE_STRUCTURE_FACTOR[name]=op` | `op` 关联函数的傅里叶变换 | `MEASURE_STRUCTURE_FACTOR[Structure Factor S]=Sz` |

结果用 `pyalps.loadEigenstateMeasurements` 加载，每个本征态返回一个值。
`Energy` 总会包含在内，`dmrg` 还会写出 `Truncation error`。
`dmrg` 不写出 `MEASURE_STRUCTURE_FACTOR` 的结果；请改为由关联函数计算结构因子。

## 示例 1：经典蒙特卡罗，观测量随温度的变化

本例对两种系统尺寸的二维 Ising 模型做温度扫描，并绘制 $\langle|M|\rangle$、Binder 累积量 $\langle M^4\rangle/\langle M^2\rangle^2$ 和比热。
`pyalps.collectXY` 把多次运行的标量观测量整理为每个系统尺寸一条曲线。

```Python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

# 1. 运行：二维 Ising 模型，两种系统尺寸，温度在 T_c = 2.269 附近
parms = []
for L in [8, 16]:
    for T in [2.0, 2.1, 2.2, 2.25, 2.3, 2.35, 2.4, 2.5, 2.6]:
        parms.append({
            'LATTICE'        : "square lattice",
            'MODEL'          : "Ising",
            'J'              : 1.,
            'L'              : L,
            'T'              : T,
            'THERMALIZATION' : 5000,
            'SWEEPS'         : 50000,
        })
input_file = pyalps.writeInputFiles('ising', parms)
pyalps.runApplication('spinmc', input_file, Tmin=5)

# spinmc_evaluate 会补充导出量（Binder 累积量、比热等）
files = pyalps.getResultFiles(prefix='ising')
pyalps.evaluateSpinMC(files)

# 2. 加载：先列出文件中的内容，再加载感兴趣的观测量
print(sorted(pyalps.loadObservableList(files)[0]))
data = pyalps.loadMeasurements(files, ['|Magnetization|', 'Binder Cumulant', 'Specific Heat'])

# 3. 提取：每个系统尺寸一条曲线，观测量作为 T 的函数
for obs in ['|Magnetization|', 'Binder Cumulant', 'Specific Heat']:
    curves = pyalps.collectXY(data, x='T', y=obs, foreach=['L'])
    for c in curves:
        c.props['label'] = 'L = %d' % c.props['L']
    # 4. 带误差棒绘图
    plt.figure()
    pyalps.plot.plot(curves)
    plt.xlabel('Temperature $T$')
    plt.ylabel(obs)
    plt.legend()
plt.show()
```

该脚本运行约半分钟。
两种尺寸的 Binder 累积量在 $T_c = 2.269$ 附近相交：

![](/figs/api_examples_ising.png)

## 示例 2：量子蒙特卡罗，关联函数与结构因子

矢量观测量加载后是一个 DataSet，其 `x` 存放晶格矢量，`y` 存放带误差棒的数值。
本例用 `dirloop_sse` 模拟 $8\times8$ 晶格上的 $S=1/2$ Heisenberg 反铁磁体，绘制关联函数随距离的变化，并展示结构因子在布里渊区中的分布。

```Python
import numpy as np
import pyalps
import matplotlib.pyplot as plt

# 1. 运行：8x8 正方晶格上的 S=1/2 Heisenberg 反铁磁体
L = 8
parms = [{
    'LATTICE'                   : "square lattice",
    'MODEL'                     : "spin",
    'local_S'                   : 0.5,
    'J'                         : 1,
    'L'                         : L,
    'T'                         : 0.3,
    'THERMALIZATION'            : 10000,
    'SWEEPS'                    : 100000,
    'MEASURE[Correlations]'     : True,
    'MEASURE[Structure Factor]' : True,
    'MEASURE[Green Function]'   : True,
}]
input_file = pyalps.writeInputFiles('heis', parms)
pyalps.runApplication('dirloop_sse', input_file, Tmin=5)
files = pyalps.getResultFiles(prefix='heis')

# 2. 加载：每个矢量观测量返回一个 DataSet；
#    x 的每个元素是一个晶格矢量，y 是带误差的数值
corr = pyalps.loadMeasurements(files, 'Spin Correlations')[0][0]
sq   = pyalps.loadMeasurements(files, 'Spin Structure Factor')[0][0]
gf   = pyalps.loadMeasurements(files, "Green's Function")[0][0]

# 3. 提取：x 是相对格点 0 的位移 (dx, dy)，以晶格常数为单位；
#    在周期边界条件下，距离取最近镜像
d = np.minimum(corr.x, L - corr.x)
r = np.hypot(d[:, 0], d[:, 1])
C     = np.array([y.mean for y in corr.y])
C_err = np.array([y.error for y in corr.y])
G     = np.array([y.mean for y in gf.y])
G_err = np.array([y.error for y in gf.y])

# 对结构因子而言，x 是波矢 (qx, qy)
S = np.array([y.mean for y in sq.y])
i = np.argmax(S)
print('S(q) is largest at q = %s: %s' % (sq.x[i], sq.y[i]))

# 4. 绘图。在二分晶格上关联函数的符号交替变化；
#    乘以 (-1)^(dx+dy) 后均为正。对于 h = 0 的各向同性
#    Heisenberg 模型，r > 0 时 |<S+_0 S-_r>| = 2 |<Sz_0 Sz_r>|
stagger = (-1) ** (corr.x[:, 0] + corr.x[:, 1])
plt.figure()
plt.errorbar(r, stagger * C, C_err, fmt='o', label=r'$(-1)^{d_x+d_y} \langle S^z_0 S^z_r \rangle$')
plt.errorbar(r, np.abs(G) / 2, G_err / 2, fmt='s', mfc='none', label="|Green's Function| / 2")
plt.yscale('log')
plt.xlabel('distance $r$')
plt.ylabel('correlation')
plt.legend()
plt.tight_layout()

plt.figure(figsize=(4.8, 4))
qx, qy = sq.x[:, 0], sq.x[:, 1]
plt.scatter(qx / np.pi, qy / np.pi, c=S, s=250, marker='s', cmap='viridis')
plt.colorbar(label=r'$S(\mathbf{q})$')
plt.xlabel(r'$q_x/\pi$')
plt.ylabel(r'$q_y/\pi$')
plt.gca().set_aspect('equal')
plt.tight_layout()
plt.show()
```

结构因子在 $\mathbf{q} = (\pi, \pi)$ 处最大，约为 3.7，这是反铁磁（Néel）关联的特征。
关联函数的符号随距离交替变化，并且如自旋旋转对称性所要求的那样，$|\langle S^+_0 S^-_r\rangle| = 2|\langle S^z_0 S^z_r\rangle|$：

![](/figs/api_examples_qmc.png)

对于 8 格点链上的同一模型，`Spin Correlations` 以及 `Green's Function` 的绝对值在误差范围内与精确对角化一致。
这里只比较绝对值，因为在 3.0.0 中反铁磁体上 `Green's Function` 的符号是错的（见[已知问题](#alps-300-中的已知问题)）。

## 示例 3：用 fulldiag 和 QWL 计算热力学量

`fulldiag` 和 `qwl` 一次运行就能给出完整的温度曲线。
本例用两种方法计算 10 格点 Heisenberg 链的比热和均匀磁化率。

```Python
import pyalps
import matplotlib.pyplot as plt

# 1. 运行：10 个格点的 S=1/2 Heisenberg 链，分别用完全对角化
#    和量子 Wang-Landau（QWL）各计算一次
model = {
    'LATTICE' : "chain lattice",
    'MODEL'   : "spin",
    'local_S' : 0.5,
    'J'       : 1,
    'L'       : 10,
}
ed_input = pyalps.writeInputFiles('chain_ed', [dict(model, CONSERVED_QUANTUMNUMBERS='Sz')])
pyalps.runApplication('fulldiag', ed_input)
# QWL：CUTOFF 限制展开阶数（此处对 T >= 0.05 足够）；
# 需要更多的 Wang-Landau 阶段才能使态密度收敛
qwl_input = pyalps.writeInputFiles('chain_qwl', [dict(model, CUTOFF=200,
                                                      NUMBER_OF_WANG_LANDAU_STEPS=24)])
pyalps.runApplication('qwl', qwl_input, Tmin=5)

# 2. 加载：两个评估工具都在温度网格上计算热力学量，
#    分别基于保存的能谱（fulldiag）或态密度（QWL），
#    每个物理量返回一个已是 T 的函数的 DataSet
ed  = pyalps.evaluateFulldiagVersusT(pyalps.getResultFiles(prefix='chain_ed'),
                                     DELTA_T=0.05, T_MIN=0.05, T_MAX=3.0)
qwl = pyalps.evaluateQWL(pyalps.getResultFiles(prefix='chain_qwl'),
                         DELTA_T=0.05, T_MIN=0.05, T_MAX=3.0)

# 3. 提取：按名称选取物理量
def select(data, name):
    return [s for s in pyalps.flatten(data) if s.props['observable'] == name]

# 4. 把两种方法的结果画在同一张图上
for name in ['Specific Heat per Site', 'Uniform Susceptibility per Site']:
    plt.figure()
    for data, label, style in [(ed, 'fulldiag', '-'), (qwl, 'QWL', 'o')]:
        for s in select(data, name):
            plt.plot(s.x, s.y, style, mfc='none', label=label)
    plt.xlabel('Temperature $T$')
    plt.ylabel(name)
    plt.legend()
plt.show()
```

QWL 运行约需三分钟。
两种方法的结果相差约 1% 以内：

![](/figs/api_examples_thermo.png)

这里 `NUMBER_OF_WANG_LANDAU_STEPS=24` 很重要。
在我们的测试中，如果只设置 `CUTOFF=500`，QWL 在 $T \approx 1$ 以上的能量偏差可达 40%。
在小体系上与 `fulldiag` 比较，是检查 QWL 设置的好方法。

## 示例 4：DMRG，关联函数与局域观测量

本例计算 32 格点开边界 Heisenberg 链在 $S^z_{\mathrm{total}} = 0$ 和 $1$ 扇区中的基态。
它由两个能量得到自旋能隙，从一个参考格点出发提取关联函数，并给出 $S^z_{\mathrm{total}} = 1$ 态中的磁化分布。

```Python
import numpy as np
import pyalps
import matplotlib.pyplot as plt

# 1. 运行：开边界的 S=1/2 Heisenberg 链，计算 Sz_total = 0 和
#    Sz_total = 1 两个扇区的基态。DMRG 和 ED 程序测量
#    MEASURE_* 参数中指定的任意算符
L = 32
parms = []
for sz in [0, 1]:
    parms.append({
        'LATTICE'                  : "open chain lattice",
        'MODEL'                    : "spin",
        'local_S'                  : 0.5,
        'J'                        : 1,
        'L'                        : L,
        'CONSERVED_QUANTUMNUMBERS' : 'N,Sz',
        'Sz_total'                 : sz,
        'SWEEPS'                   : 4,
        'MAXSTATES'                : 100,
        'NUMBER_EIGENVALUES'       : 1,
        'MEASURE_AVERAGE[Magnetization]'                      : 'Sz',
        'MEASURE_LOCAL[Local magnetization]'                  : 'Sz',
        'MEASURE_CORRELATIONS[Diagonal spin correlations]'    : 'Sz',
        'MEASURE_CORRELATIONS[Offdiagonal spin correlations]' : 'Splus:Sminus',
    })
input_file = pyalps.writeInputFiles('chain_dmrg', parms)
pyalps.runApplication('dmrg', input_file, writexml=True)

# 2. 加载：每个扇区一个 DataSet 列表；y[0] 对应基态
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='chain_dmrg'))
sector = {}
for task in data:
    sz = int(task[0].props['Sz_total'])
    sector[sz] = {s.props['observable']: s for s in task}
    print('Sz_total = %d: E = %.6f' % (sz, sector[sz]['Energy'].y[0]))
print('spin gap E(1) - E(0) = %.4f' % (sector[1]['Energy'].y[0] - sector[0]['Energy'].y[0]))

# 3. 提取：对关联函数而言，x 是格点对 (i, j)；
#    取以远离开边界的参考格点为起点的格点对
zz = sector[0]['Diagonal spin correlations']
pm = sector[0]['Offdiagonal spin correlations']
i0 = L // 4
def from_site(obs):
    pairs = np.array(obs.x)
    values = np.array(obs.y[0])
    keep = (pairs[:, 0] == i0) & (pairs[:, 1] > i0)
    return pairs[keep, 1] - i0, values[keep]
r, C_zz = from_site(zz)
r, C_pm = from_site(pm)

# 局域观测量：x 是格点编号
mloc = sector[1]['Local magnetization']

# 4. 绘图
plt.figure()
plt.loglog(r, np.abs(C_zz), 'o', label=r'$|\langle S^z_{i_0} S^z_{i_0+r} \rangle|$')
plt.loglog(r, np.abs(C_pm) / 2, 's', mfc='none', label=r'$|\langle S^+_{i_0} S^-_{i_0+r} \rangle| / 2$')
plt.xlabel('distance $r$')
plt.ylabel('correlation')
plt.legend()

plt.figure()
plt.plot(mloc.x, mloc.y[0], 'o-')
plt.xlabel('site $i$')
plt.ylabel(r'$\langle S^z_i \rangle$ ($S^z_{\mathrm{total}} = 1$)')
plt.show()
```

脚本输出 $L = 32$ 时的自旋能隙 $E(S^z{=}1) - E(S^z{=}0) = 0.118$。
两种关联函数如自旋旋转对称性所要求的那样一致，并按幂律衰减。
在 $S^z_{\mathrm{total}} = 1$ 态中，磁化强度交替变化，并在开边界附近最大：

![](/figs/api_examples_dmrg.png)

在 8 格点开链上，DMRG 的关联函数与 `sparsediag` 的结果完全相同。

## ALPS 3.0.0 中的已知问题

以下问题会影响本页的测量。每一项都给出了在修复发布之前的处理办法；修复进度见所链接的 issue，修复内容会列在发布说明中。

- `loop` 设置 `MEASURE[Green Function]=true` 时：运行结束时的评估失败，报错 `scalar - vector conflict in path: .../Green's Function/labels`，并且不写出结果文件。请改用 `dirloop_sse` 测量格林函数（[ALPS #420](https://github.com/ALPSim/ALPS/issues/420)）。
- `dirloop_sse` 的 `Green's Function` 在某些设置下是错误的（[ALPS #390](https://github.com/ALPSim/ALPS/issues/390)）。在反铁磁体上缺少符号 $(-1)^{r}$，因此请像示例 2 那样使用绝对值。设置 `SKIP` 时数值会大 `SKIP` 倍；`RESTRICT_MEASUREMENTS` 以及软核玻色子的 `NO_WORMWEIGHT=1` 也会给出错误的值。测量格林函数时请不要设置这些参数。
- `worm`：不指定观测量名称调用 `pyalps.loadMeasurements(files)` 会返回空列表，因为一个内部观测量（`Time interval`）无法读取。请传入所需的名称，例如 `pyalps.loadMeasurements(files, ['Density', 'Stiffness'])`（[ALPS #421](https://github.com/ALPSim/ALPS/issues/421)）。
- `fulldiag` 配合 `MEASURE_CORRELATIONS` 或 `MEASURE_STRUCTURE_FACTOR` 时：`fulldiag_evaluate`（由 `evaluateFulldiagVersusT` 调用）会崩溃。`MEASURE_AVERAGE` 和 `MEASURE_LOCAL` 可以正常使用。请把热力学量和关联函数分成两个任务运行（[ALPS #422](https://github.com/ALPSim/ALPS/issues/422)）。
- 在周期晶格和梯子晶格上，`dmrg` 的 `MEASURE_CORRELATIONS` 给出错误的值（[ALPS #390](https://github.com/ALPSim/ALPS/issues/390)）。在开链上（如示例 4），其结果与精确对角化一致。
- 评估函数（`evaluateSpinMC`、`evaluateQWL`、`evaluateFulldiagVersusT` 等）只有在同一 Python 会话中先调用过 `runApplication` 时才能找到所需的辅助程序。在单独的分析脚本中，请把 `pyalps` 包的 `bin` 目录加入 `PATH`。3.0.0 之后已由 [ALPS #158](https://github.com/ALPSim/ALPS/pull/158) 修复。
