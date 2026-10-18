---
title: DMRG-07 模拟
weight: 2
math: true
toc: true
---

在本教程中，我们将 [DMRG-07 简介](../dmrg07) 中建立的理论工具付诸实践，使用 ALPS `dmrg` 应用程序计算一维无自旋费米子链的基态能量，工作流程与自旋链的 [DMRG-03](../../dmrg03) 相同。

## 感兴趣的物理现象

具有最近邻排斥作用的无自旋费米子链——即 *$t$–$V$ 模型*——是最简单的相互作用费米子模型。尽管如此，它包含了一维金属的基本物理：弱耦合时它是 Luttinger 液体，一种没有准粒子的临界金属态；而在强排斥下（半满填充时 $V > 2t$）它会发生相变，进入有能隙的电荷有序绝缘体。通过[简介](../dmrg07)中推导的 Jordan–Wigner 变换，它恰好是 XXZ 自旋链的另一副面孔，因此这里得到的每一个结果都可以与自旋链教程相互印证。与 [DMRG-03](../../dmrg03) 一样，我们从最基本的可观测量——基态能量 $E_0$——入手，在相图上两个存在精确参考值的点上进行计算：自由费米子点 $V=0$，以及映射到 [DMRG-03](../../dmrg03) 各向同性海森堡链的相互作用强度 $V=2t$。

## 模型

我们研究含 $L$ 个格点的开链上的 $t$–$V$ 哈密顿量，

$$
\hat H \;=\; -t\sum_{j=1}^{L-1}\Big(\hat c^{\dagger}_j \hat c_{j+1} + \hat c^{\dagger}_{j+1}\hat c_j\Big)
\;+\; V \sum_{j=1}^{L-1} \hat n_j\, \hat n_{j+1}
\;-\; \sum_{j=1}^{L} \mu_j\, \hat n_j ,
$$

其中 $t$ 为跳跃振幅，$V$ 为最近邻排斥强度，$\mu_j$ 为（可依赖于格点的）化学势。该模型是可积的：通过 [Jordan–Wigner 变换](https://doi.org/10.1007/BF01331938)，它等价于由 [Yang 和 Yang](https://doi.org/10.1103/PhysRev.150.321) 精确求解的 XXZ 链，其临界相是 [Luttinger 液体](https://doi.org/10.1088/0022-3719/14/19/010)的标准格点实现。

将[简介](../dmrg07)中的对照表逐键应用于开链，可得

$$
t = \frac{J}{2}, \qquad V = J\Delta,
$$

$$
J\Delta\sum_{j}\Big(\hat n_j - \tfrac12\Big)\Big(\hat n_{j+1} - \tfrac12\Big)
= V\sum_{j} \hat n_j \hat n_{j+1} - \frac{V}{2}\sum_{j} z_j\, \hat n_j + \frac{V(L-1)}{4},
$$

其中 $z_j$ 是格点 $j$ 的配位数（体内 $z=2$，两个端点处 $z=1$）。因此，XXZ 链等于具有依赖于格点的化学势 $\mu_j = \tfrac{V}{2} z_j$ 的 $t$–$V$ 模型，两者相差常数 $V(L-1)/4$——这一记账细节将在下文用来与 [DMRG-03](../../dmrg03) 进行基准比较。

### 在玻色子基下运行费米子

{{< callout type="info" >}}
在开链上，所有 Jordan–Wigner 弦在最近邻项中相互抵消，因此费米子 $t$–$V$ 链、XXZ 自旋链和**硬核玻色子** $t$–$V$ 链在粒子数 $N$ 的每个扇区中都具有*完全相同*的能谱。ALPS 模型库定义的 `hardcore boson` 与 `spinless fermions` 具有完全相同的参数（`t`、`V`、`mu#`）和相同的守恒量子数 `N`。我们使用 `MODEL="hardcore boson"` 运行模拟：经典的 `dmrg` 应用程序不能可靠地处理 `MODEL="spinless fermions"` 的费米子符号记账（扫描无法变分收敛），而 Jordan–Wigner 等价性保证了在玻色子基下工作不会损失任何一般性。诸如 `sparsediag` 之类的精确对角化应用程序可以直接处理 `MODEL="spinless fermions"`，可用于在小链上验证这一等价性（见文末的思考题）。
{{< /callout >}}

## 方法选择

在半满填充时，相关的希尔伯特空间扇区的维数为

$$
\dim \mathcal{H}_{N=L/2} = \binom{L}{L/2} \;\xrightarrow{\;L=32\;}\; \binom{32}{16} \approx 6.0\times 10^{8},
$$

远远超出完全对角化或稀疏对角化的能力范围。DMRG 是计算一维基态的首选方法：下面的每次运行（32 个格点的链，最多保留 $D=100$ 个态，4 次扫描）在笔记本电脑上不到一分钟即可完成，同时将 $E_0$ 收敛到十位或更多有效数字。

## 自由费米子（$V=0$）

在 $V=0$ 时，模型是一个自由费米子能带 $\varepsilon(k) = -2t\cos k$。对于*开*链，单粒子本征态是驻波，能量为

$$
\varepsilon_n = -2t\,\cos\!\left(\frac{n\pi}{L+1}\right), \qquad n = 1,\dots,L ,
$$

因此在填充数 $N$ 下的精确基态能量就是 $N$ 个最低 $\varepsilon_n$ 之和。对于 $L=32$、$N=16$（半满填充）：

$$
E_0^{\text{exact}} = \sum_{n=1}^{16} \varepsilon_n = -20.0163879005\, t .
$$

这给了我们一份难得的奢侈：一个带有精确有限尺寸参考值的相互作用代码基准。

### 参数

| 参数 | 含义 | 值 |
|---|---|---|
| `LATTICE` | 内置开链，无需格点文件（见 [ALPS 格点库](../../../documentation/intro/latticehowtos)） | `open chain lattice` |
| `MODEL` | 硬核玻色子 $t$–$V$ 模型，无自旋费米子链的 Jordan–Wigner 等价形式 | `hardcore boson` |
| `CONSERVED_QUANTUMNUMBERS` | 固定的量子数，用于对 $H$ 进行块对角化 | `N` |
| `N_total` | 目标粒子数扇区（半满填充） | 16 |
| `t` | 最近邻跳跃振幅 | 1 |
| `V` | 最近邻排斥强度 | 0 |
| `L` | 链长 | 32 |
| `SWEEPS` | DMRG 有限系统扫描次数 | 4 |
| `NUMBER_EIGENVALUES` | 请求的本征态数目 | 1 |
| `MAXSTATES` | 截断后保留的键维数 $D$ | 100（单次运行）；20、40、60（多次运行） |

注意与自旋教程的一个结构性差异：守恒量子数只有粒子数 `N`，而且扇区用 `N_total` 而非 `Sz_total` 选择——这是[简介](../dmrg07)中对照表 $S^z_{\text{tot}} = N - L/2$ 的费米子一侧。半满填充 $N_{\text{total}} = 16$ 对应于 [DMRG-03](../../dmrg03) 中使用的 $S^z_{\text{tot}}=0$ 扇区。

### 格点

来自 [ALPS 格点库](../../../documentation/intro/latticehowtos)的内置 `open chain lattice` 就足够了：每个格点都是等价的（$\mu_j = 0$），每条键都携带相同的跳跃 $t$：

```
      t       t       t                   t       t
  o-------o-------o-------o  . . .  o-------o-------o
  1       2       3       4         30      31      32

  every bond:  hopping t, interaction V=0
  every site:  chemical potential mu=0
```

开放边界条件是 DMRG 的自然选择（见 [DMRG-01](../../dmrg01)），在这里还有一个额外的好处：Jordan–Wigner 映射是精确的，没有边界宇称因子（见[简介](../dmrg07)中关于边界的注意事项）。

### 参数文件

单次运行参数文件 `spinless_free`：

```python
LATTICE="open chain lattice"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=1
V=0
SWEEPS=4
NUMBER_EIGENVALUES=1
L=32
{MAXSTATES=100}
```

以及多次运行文件 `spinless_free_multiple`，用于研究结果随保留态数的收敛：

```python
LATTICE="open chain lattice"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=1
V=0
SWEEPS=4
NUMBER_EIGENVALUES=1
L=32
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

### 运行模拟

将 ALPS 可执行文件加入 `PATH` 后，把参数文件转换为 XML 并运行 `dmrg` 应用程序：

```bash
parameter2xml spinless_free
dmrg --write-xml spinless_free.in.xml

parameter2xml spinless_free_multiple
dmrg --write-xml spinless_free_multiple.in.xml
```

第一对命令生成 `spinless_free.task1.out.xml`；第二对命令生成三个输出文件 `spinless_free_multiple.task#.out.xml`，每个 `MAXSTATES` 值对应一个。

## 海森堡点处的相互作用费米子（$V=2t$）

现在我们打开相互作用，取 $t=\tfrac12$、$V=1$，即 $J = 2t = 1$、$\Delta = V/J = 1$：这是费米子语言下 [DMRG-03](../../dmrg03) 的各向同性海森堡链。为使对应关系*精确*成立而非仅在渐近意义下成立，必须包含前面推导的依赖于格点的化学势 $\mu_j = \tfrac{V}{2} z_j$：体内格点 $\mu = V$，而只有一个近邻的两个端点格点 $\mu = V/2$。于是预言的基态能量为

$$
E_0^{tV} \;=\; E_0^{\text{Heis}}(L=32) - \frac{V(L-1)}{4}
\;=\; -13.9973156 - \frac{31}{4} \;=\; -21.7473156 ,
$$

其中使用了 [DMRG-03](../../dmrg03) 中计算的 $L=32$ 海森堡能量。

### 参数

| 参数 | 含义 | 值 |
|---|---|---|
| `LATTICE_LIBRARY` | 自定义格点文件（见下文） | `my_lattice.xml` |
| `LATTICE` | 两个端点顶点具有单独类型的开链 | `open chain lattice with special edges` |
| `MODEL` | 硬核玻色子 $t$–$V$ 模型，无自旋费米子链的 Jordan–Wigner 等价形式 | `hardcore boson` |
| `CONSERVED_QUANTUMNUMBERS` | 固定的量子数 | `N` |
| `N_total` | 目标粒子数扇区（半满填充） | 16 |
| `t` | 最近邻跳跃振幅（$J/2$） | 0.5 |
| `V` | 最近邻排斥强度（$J\Delta$） | 1 |
| `mu0` | 两个端点格点上的化学势（$Vz/2$，$z=1$） | 0.5 |
| `mu1` | 体内格点上的化学势（$Vz/2$，$z=2$） | 1 |
| `SWEEPS` | DMRG 有限系统扫描次数 | 4 |
| `NUMBER_EIGENVALUES` | 请求的本征态数目 | 1 |
| `MAXSTATES` | 截断后保留的键维数 $D$ | 100（单次运行）；20、40、60（多次运行） |

### 格点

内置开链使每个顶点都具有相同的类型，因而具有相同的化学势。为了给两个端点格点各自的 $\mu$，我们重用 [DMRG-03](../../dmrg03) 中自旋-1 链的技巧：一个自定义格点，其中端点顶点为类型 0，体内顶点为类型 1。这样 ALPS 模型库便提供了按类型区分的参数 `mu0` 和 `mu1`：

```
   t,V     t,V     t,V                 t,V     t,V
  o-------o-------o------  . . .  ------o-------o
  1       2       3                     31      32

  site 1, 32   (type 0):  mu0 = V/2   (z = 1, one neighbor)
  sites 2..31  (type 1):  mu1 = V     (z = 2, two neighbors)
  every bond   (type 0):  hopping t, interaction V
```

这里适用与 [DMRG-03](../../dmrg03) 相同的格点图逻辑，只是*原因*不同：在那里特殊边缘携带的是不同的自旋，这里携带的是不同的化学势。完整的格点文件 `my_lattice.xml`（有删节——省略的顶点和边的规律显而易见）：

```python
<LATTICES>
<GRAPH name = "open chain lattice with special edges" dimension="1" vertices="32" edges="31">
<VERTEX id="1" type="0"><COORDINATE>1</COORDINATE></VERTEX>
<VERTEX id="2" type="1"><COORDINATE>2</COORDINATE></VERTEX>
<VERTEX id="3" type="1"><COORDINATE>3</COORDINATE></VERTEX>
<!-- ... vertices 4 to 30, all type="1" ... -->
<VERTEX id="31" type="1"><COORDINATE>31</COORDINATE></VERTEX>
<VERTEX id="32" type="0"><COORDINATE>32</COORDINATE></VERTEX>
<EDGE source="1" target="2" id="1" type="0" vector="1"/>
<EDGE source="2" target="3" id="2" type="0" vector="1"/>
<!-- ... edges 3 to 30 ... -->
<EDGE source="31" target="32" id="31" type="0" vector="1"/>
</GRAPH>
</LATTICES>
```

对任意 $L$，都可以用几行 Python 生成该文件：

```python
L = 32
print('<LATTICES>')
print(f'<GRAPH name = "open chain lattice with special edges" dimension="1" vertices="{L}" edges="{L-1}">')
for i in range(1, L+1):
    vtype = 0 if i in (1, L) else 1
    print(f'<VERTEX id="{i}" type="{vtype}"><COORDINATE>{i}</COORDINATE></VERTEX>')
for i in range(1, L):
    print(f'<EDGE source="{i}" target="{i+1}" id="{i}" type="0" vector="1"/>')
print('</GRAPH>')
print('</LATTICES>')
```

### 参数文件

单次运行参数文件 `spinless_tV`：

```python
LATTICE_LIBRARY="my_lattice.xml"
LATTICE="open chain lattice with special edges"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=0.5
V=1
mu0=0.5
mu1=1
SWEEPS=4
NUMBER_EIGENVALUES=1
{MAXSTATES=100}
```

以及多次运行文件 `spinless_tV_multiple`：

```python
LATTICE_LIBRARY="my_lattice.xml"
LATTICE="open chain lattice with special edges"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=0.5
V=1
mu0=0.5
mu1=1
SWEEPS=4
NUMBER_EIGENVALUES=1
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

### 运行模拟

```bash
parameter2xml spinless_tV
dmrg --write-xml spinless_tV.in.xml

parameter2xml spinless_tV_multiple
dmrg --write-xml spinless_tV_multiple.in.xml
```

## 结果评估

下面的 Python 脚本（用 `alpspython` 运行）加载所有运行的收敛本征态测量结果以及两次单次运行的迭代历史，打印能量和截断误差，并绘制收敛曲线：

```python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

# converged measurements of all runs
for prefix in ['spinless_free', 'spinless_free_multiple',
               'spinless_tV', 'spinless_tV_multiple']:
    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
    for run in data:
        print(prefix, '| MAXSTATES =', run[0].props['MAXSTATES'])
        for s in run:
            print('   ', s.props['observable'], ':', s.y[0])

# iteration history of the two single runs
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='spinless_free'),
                          what=['Iteration Energy','Iteration Truncation Error'])

plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('Iteration history of ground state energy (V=0)')
plt.ylabel('$E_0$')
plt.xlabel('iteration')
plt.show()
```

### 自由费米子

| `MAXSTATES` $D$ | 截断误差 $\epsilon$ | $E_0/t$ | $E_0 - E_0^{\text{exact}}$ |
|---|---|---|---|
| 20 | $5.2\times10^{-7}$ | $-20.0163691706$ | $1.9\times10^{-5}$ |
| 40 | $1.7\times10^{-9}$ | $-20.0163878550$ | $4.6\times10^{-8}$ |
| 60 | $1.3\times10^{-11}$ | $-20.0163879001$ | $4.1\times10^{-10}$ |
| 100 | $3.2\times10^{-14}$ | $-20.0163879005$ | $1.4\times10^{-12}$ |

在 $D=100$ 时，DMRG 能量 $E_0 = -20.0163879005\,t$ 与精确的自由费米子值 $-20.0163879005\,t$ 在十二位数字上一致——而这台相互作用代码对模型是自由的这一事实一无所知。迭代历史展现出 [DMRG-03](../../dmrg03) 中熟悉的模式：能量在无限系统预热阶段陡然下降，并在第一次扫描内稳定到收敛值：

![](/figs/dmrg/dmrg07_free_energy_iteration.png)

### $V=2t$ 处的相互作用费米子

| `MAXSTATES` $D$ | 截断误差 $\epsilon$ | $E_0$ | $E_0(D) - E_0(D{=}100)$ |
|---|---|---|---|
| 20 | $1.6\times10^{-7}$ | $-21.7473088794$ | $6.7\times10^{-6}$ |
| 40 | $5.7\times10^{-10}$ | $-21.7473155951$ | $2.3\times10^{-8}$ |
| 60 | $1.3\times10^{-11}$ | $-21.7473156177$ | $4.9\times10^{-10}$ |
| 100 | $4.4\times10^{-14}$ | $-21.7473156182$ | — |

$D=100$ 的结果 $E_0 = -21.7473156$ 与 Jordan–Wigner 预言 $E_0^{\text{Heis}} - V(L-1)/4 = -21.7473156$ 在 [DMRG-03](../../dmrg03) 参考能量的每一位数字上都一致——这是对[简介](../dmrg07)中推导的算符对照表的直接数值验证：

![](/figs/dmrg/dmrg07_tV_energy_iteration.png)

在两种情形下，能量误差都在很好的近似程度上*正比于截断误差*——这是 $D\to\infty$ 外推所用的标准经验法则，而多次运行让我们可以对它进行定量检验：

![](/figs/dmrg/dmrg07_energy_vs_truncation.png)

## 小结

在粒子数守恒的基下，DMRG 在 $L=32$、$D=100$ 个态时将半满填充无自旋费米子链的基态能量收敛到几乎机器精度：自由点在十二位数字上重现了精确的驻波能量 $-20.0163879005\,t$，相互作用点 $V=2t$ 通过 Jordan–Wigner 平移 $-V(L-1)/4$ 在所有给出的数字上重现了 [DMRG-03](../../dmrg03) 的海森堡能量，并且两种情形下能量误差都随截断误差线性变化。

## 思考题

1. 将 $E_0(D)$ 对截断误差 $\epsilon(D)$ 作拟合，并外推到 $\epsilon \to 0$。与未经处理的 $D=20$ 结果相比，外推得到的自由费米子能量与精确值有多接近？
2. 设置 `N_total=8`（四分之一填充）以偏离半满填充。自由费米子基准 $E_0 = \sum_{n=1}^{8}\varepsilon_n$ 仍然是精确的——DMRG 在 $D$ 方向的收敛变得更容易还是更困难？为什么？
3. 让相互作用扫过临界点：保持 $t=\tfrac12$，计算 $V = 0.5, 1, 1.5, 2, 3$ 时的 $E_0(V)$。在 $V=2t$（$\Delta>1$）之外，半满填充的链会出现电荷有序——你能否从收敛行为或局域密度中探测到这一相变？
4. 在小链上端到端地验证 Jordan–Wigner 等价性：用 `sparsediag` 分别以 `MODEL="spinless fermions"` 和 `MODEL="hardcore boson"` 运行 $L=8$、$N_{\text{total}}=4$，并确认两者的能谱在每个扇区中逐一吻合。
5. 在*不*使用特殊边缘化学势的情况下重复 $V=2t$ 的运行（内置 `open chain lattice`，均匀的 `mu=1`）。结果不再与海森堡预言相符——在对 $V(\hat n_j-\tfrac12)(\hat n_{j+1}-\tfrac12)$ 逐键记账中，是哪一项造成了这一差异？
