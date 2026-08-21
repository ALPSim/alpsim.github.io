---
title: 一维量子系统的能谱
description: "一维能谱的 Jupyter md 文件"
toc: true
math: true
weight: 13
cascade:
    type: docs
---

在本教程中，我们将计算量子海森堡模型在各种一维晶格上的能谱。主要工作由 `sparsediag` 应用程序完成，它实现了兰索斯算法——一种迭代本征值求解器——以获得不同动量区间内的能量。收集到的数据将被绘制出来，以展示一维量子海森堡模型在各种一维晶格上的能量-动量谱。

### 海森堡链

#### 引言

自旋-1/2 海森堡链的哈密顿量最早由 [W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601) 提出，其形式为 

$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j,
$$

其中 $J>0$ 对应于最近邻自旋 $\mathbf{S}^i$ 与 $\mathbf{S}^j$ 之间的反铁磁相互作用，自旋-自旋相互作用由三个分量组成，即 

$$
\mathbf{S}^i \cdot \mathbf{S}^j=S^i_xS^j_x+S^i_yS^j_y+S^i_zS^j_z.
$$

基矢通常选取为 $S_z$ 算符的本征态。对于自旋-1/2 系统，每个晶格格点有两个基矢，$|-1/2\rangle$ 和 $|+1/2\rangle$。$S_x$ 和 $S_y$ 算符作用在这些基矢上的效果可以用升算符 $S^{\dagger}$ 和降算符 $S^{-}$ 表示：

$$
S_x=\frac{1}{2}(S^{\dagger}+S^{-}),
$$

$$
S_y=\frac{1}{2i}(S^{\dagger}-S^{-}),
$$

它们作用在基矢上的方式如下：

$$
S^{\dagger}|s\rangle = \sqrt{S(S+1)-s(s+1)}|s+1\rangle,
$$

$$
S^{-}|s\rangle = \sqrt{S(S+1)-s(s-1)}|s-1\rangle,
$$

其中 $S=1/2$，$s=-1/2, 1/2$。

利用上述每个晶格格点的基矢，哈密顿量可以写成一个厄米矩阵。当固定总磁化强度时，矩阵的规模可以被缩小，即在模拟中设置 Sz_total = 0（单重态区间）或 Sz_total = 1（三重态区间）。为了进一步缩小哈密顿量矩阵的规模并得到能谱的动量依赖关系，我们可以进一步将模拟限制在不同的晶格动量区间 $P=0, 1, 2, \cdots$ 中。 

**参数：** `LATTICE="chain lattice"`、`MODEL="spin"`、`local_S=0.5`、`J=1`、`CONSERVED_QUANTUMNUMBERS="Sz"`、`Sz_total=0`，以及 `L=10,12,14,16`。

**晶格：**
```
   J     J     J           J
o-----o-----o-----o-- ... --o     （周期链，L 个格点，每条键上的耦合为 J）
```

**方法选择：** 希尔伯特空间的维数为 $2^L$，例如在最大尺寸时 $2^{16}=65536$——这个规模足够小，使得 `sparsediag` 的兰索斯算法能够在几秒钟内求出每个 $(S_z, P)$ 区间内完整的低能谱。

#### 模拟

为了得到海森堡链的能谱，我们按照以下步骤进行。

我们首先导入所需的模块。

```python
import pyalps
import numpy as np
import matplotlib as plt
import pyalps.plot
```

为 4 种不同的晶格尺寸准备输入参数：$L=10, 12, 14$ 和 $16$。

```python
parms=[]
for l in [10, 12, 14, 16]:
    parms.append(
      { 
        'LATTICE'                   : "chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : 0.5,
        'J'                         : 1,
        'L'                         : l,
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0
      }
    )
```

写入输入文件并运行模拟。

```python
input_file = pyalps.writeInputFiles('parm_chain',parms)
res = pyalps.runApplication('sparsediag',input_file)
```

加载所有态的所有测量结果，并收集每次模拟在所有动量下的能谱。

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm_chain'))

spectra = {}
for sim in data:
  l = int(sim[0].props['L'])
  all_energies = []
  spectrum = pyalps.DataSet()
  for sec in sim:
    all_energies += list(sec.y)
    spectrum.x = np.concatenate((spectrum.x,np.array([sec.props['TOTAL_MOMENTUM'] for i in range(len(sec.y))])))
    spectrum.y = np.concatenate((spectrum.y,sec.y))
  spectrum.y -= np.min(all_energies)
  spectrum.props['line'] = 'scatter'
  spectrum.props['label'] = 'L='+str(l)
  spectra[l] = spectrum
```

绘制能量-动量谱。

```python
plt.pyplot.figure()
pyalps.plot.plot(spectra.values())
plt.pyplot.legend()
plt.pyplot.title('Antiferromagnetic Heisenberg chain (S=1/2)')
plt.pyplot.ylabel('Energy')
plt.pyplot.xlabel('Momentum')
plt.pyplot.xlim(0,2*3.1416)
plt.pyplot.ylim(0,2)
plt.pyplot.show()

```

下图是一维海森堡链的能谱：
![Energy spectrum Heisenberg chain](/figs/ed/spectrumchain.png)

### 双腿海森堡梯子

#### 引言

双腿自旋-1/2 海森堡链的哈密顿量为 

$$
H = J_0\sum_{\langle \alpha i,\alpha j \rangle} \mathbf{S}^{\alpha i} \cdot \mathbf{S}^{\alpha j} + J_1\sum_{\langle 1 i,2 i \rangle} \mathbf{S}^{1 i} \cdot \mathbf{S}^{2 i},
$$

其中，$\alpha=1,2$ 表示两条腿/链，$i,j=1,2,\cdots,L$ 标记链内的晶格格点，$J_0>0$ 是同一条链内最近邻自旋 $\mathbf{S}^{\alpha i}$ 与 $\mathbf{S}^{\alpha j}$ 之间的链内反铁磁相互作用，$J_1>0$ 是第一条腿的 $\mathbf{S}^{1 i}$ 与第二条腿的 $\mathbf{S}^{2 i}$（$i=1,2,\cdots,L$）之间的链间自旋-自旋耦合。 

**参数：** `LATTICE="ladder"`、`MODEL="spin"`、`local_S=0.5`、`J0=1`、`J1=1`、`CONSERVED_QUANTUMNUMBERS="Sz"`、`Sz_total=0`，以及 `L=6,8,10`。

**晶格：**
```
o--J0--o--J0--o    （第 1 条腿）
|      |      |
J1     J1     J1
|      |      |
o--J0--o--J0--o    （第 2 条腿，共 L 个横档）
```

**方法选择：** 梯子共有 $2L$ 个格点，因此希尔伯特空间维数为 $2^{2L}$——在 $L=10$ 时 $2^{20}\approx10^6$——在施加 $S_z=0$ 限制之后，这仍然完全在 `sparsediag` 的兰索斯求解器能力范围之内。

#### 模拟

我们首先导入所需的模块。

```python
import pyalps
import numpy as np
import matplotlib as plt
import pyalps.plot
```

通过设置链内和链间相互作用 J0 和 J1 的值，以及链长 L=6、8 和 10，准备输入参数。

```python
parms=[]
for l in [6, 8, 10]:
    parms.append(
      { 
        'LATTICE'                   : "ladder", 
        'MODEL'                     : "spin",
        'local_S'                   : 0.5,
        'J0'                        : 1,
        'J1'                        : 1,
        'L'                         : l,
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0
      }
    )

```

写入输入文件并运行模拟

```python
input_file = pyalps.writeInputFiles('parm_ladder',parms)
res = pyalps.runApplication('sparsediag',input_file)
```

加载所有态的所有测量结果，并收集每次模拟在所有动量下的能谱。

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm_ladder'))

spectra = {}
for sim in data:
  l = int(sim[0].props['L'])
  all_energies = []
  spectrum = pyalps.DataSet()
  for sec in sim:
    all_energies += list(sec.y)
    spectrum.x = np.concatenate((spectrum.x,np.array([sec.props['TOTAL_MOMENTUM'] for i in range(len(sec.y))])))
    spectrum.y = np.concatenate((spectrum.y,sec.y))
  spectrum.y -= np.min(all_energies)
  spectrum.props['line'] = 'scatter'
  spectrum.props['label'] = 'L='+str(l)
  spectra[l] = spectrum
```

绘制能谱。

```python
plt.pyplot.figure()
pyalps.plot.plot(spectra.values())
plt.pyplot.legend()
plt.pyplot.title('Antiferromagnetic Heisenberg ladder (S=1/2)')
plt.pyplot.ylabel('Energy')
plt.pyplot.xlabel('Momentum')
plt.pyplot.xlim(0,2*3.1416)
plt.pyplot.ylim(0,2.5)
plt.pyplot.show()
```

下图展示了海森堡梯子的能谱：
![Energy spectrum Heisenberg ladder](/figs/ed/spectrumladder.png)

### 孤立二聚体

#### 引言

在第三个模拟中，我们从与前一情形相同的哈密顿量出发

$$
H = J_0\sum_{\langle \alpha i,\alpha j \rangle} \mathbf{S}^{\alpha i} \cdot \mathbf{S}^{\alpha j} + J_1\sum_{\langle 1 i,2 i \rangle} \mathbf{S}^{1 i} \cdot \mathbf{S}^{2 i},
$$

其中，$\alpha=1,2$ 表示两条腿/链，$i,j=1,2,\cdots,L$ 标记链内的晶格格点，我们设定 $J_0=0$，即最近邻自旋之间没有链内相互作用，而 $J_1=1$ 是 $\mathbf{S}^{1 i}$ 与 $\mathbf{S}^{2 i}$（$i=1,2,\cdots,L$）之间的链间自旋-自旋耦合。此时系统变为 $L$ 个孤立的二聚体。 

**参数：** 与上文相同的 `ladder` 晶格和 `spin` 模型，但设定 `J0=0`（两腿解耦）和 `J1=1`，`L=6,8,10`。

**晶格：**
```
o      o      o
|      |      |
J1     J1     J1     （J0 = 0：无腿间键 → L 个独立二聚体）
|      |      |
o      o      o
```

**方法选择：** 设定 $J_0=0$ 将梯子解耦为 $L$ 个独立的双格点二聚体，因此精确能谱可以解析求得（每个二聚体贡献一个单重态 $E=-3J_1/4$ 和一个三重态 $E=J_1/4$）；这一情形被用作对上文耦合梯子 `sparsediag` 结果的合理性检验。

#### 模拟

我们首先导入所需的模块。

```python
import pyalps
import numpy as np
import matplotlib as plt
import pyalps.plot
```

准备输入参数。

```python
parms=[]
for l in [6, 8, 10]:
    parms.append(
      { 
        'LATTICE'                   : "ladder", 
        'MODEL'                     : "spin",
        'local_S'                   : 0.5,
        'J0'                        : 0,
        'J1'                        : 1,
        'L'                         : l,
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0
      }
    )
```

写入输入文件并运行模拟。

```python
input_file = pyalps.writeInputFiles('parm_dimers',parms)
res = pyalps.runApplication('sparsediag',input_file)
```

加载所有态的所有测量结果。

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm_dimers'))
```

收集每次模拟在所有动量下的能谱。

```python
spectra = {}
for sim in data:
  l = int(sim[0].props['L'])
  all_energies = []
  spectrum = pyalps.DataSet()
  for sec in sim:
    all_energies += list(sec.y)
    spectrum.x = np.concatenate((spectrum.x,np.array([sec.props['TOTAL_MOMENTUM'] for i in range(len(sec.y))])))
    spectrum.y = np.concatenate((spectrum.y,sec.y))
  spectrum.y -= np.min(all_energies)
  spectrum.props['line'] = 'scatter'
  spectrum.props['label'] = 'L='+str(l)
  spectra[l] = spectrum

```

然后我们绘制能谱。

```python
plt.pyplot.figure()
pyalps.plot.plot(spectra.values())
plt.pyplot.legend()
plt.pyplot.title('Isolated antiferromagnetic S=1/2 dimers')
plt.pyplot.ylabel('Energy')
plt.pyplot.xlabel('Momentum')
plt.pyplot.xlim(0,2*3.1416)
plt.pyplot.ylim(0,2.5)
plt.pyplot.show()
```

海森堡二聚体的能谱如下所示：
![Energy spectrum of isolated Heisenberg dimers](/figs/ed/spectrumisolateddimers.png)

### 结果

运行上述代码后得到的基态能量以及到第一激发态的能隙：

| 体系 | $L$ | $E_0$ | $E_0/L$ | 到 $E_1$ 的能隙 |
|---|---|---|---|---|
| 链 | 10 | -4.51545 | -0.45154 | 0.42324 |
| 链 | 12 | -5.38739 | -0.44895 | 0.35585 |
| 链 | 14 | -6.26355 | -0.44740 | 0.30711 |
| 链 | 16 | -7.14230 | -0.44639 | 0.27019 |
| 梯子 | 6 | -7.01325 | -0.58444 | 0.62657 |
| 梯子 | 8 | -9.28325 | -0.58020 | 0.55740 |
| 梯子 | 10 | -11.57719 | -0.57772 | 0.52811 |
| 二聚体 | 6 | -4.50000 | -0.75000 | 1.00000 |
| 二聚体 | 8 | -6.00000 | -0.75000 | 1.00000 |
| 二聚体 | 10 | -7.50000 | -0.75000 | 1.00000 |

随着 $L$ 增大，链的 $E_0/L$ 正趋向精确的热力学极限值 $-\ln2+1/4\approx-0.4431$，而孤立二聚体的情形以机器精度重现了精确解析结果 $E_0/L=-3J_1/4=-0.75$ 和能隙 $=J_1=1$——这为验证介于两者之间的梯子结果（$J_0=J_1=1$）的可靠性提供了有用的检验。

### 总结与展望

在有限一维晶格上的精确对角化重现了海森堡链所预期的无能隙谱、双腿梯子中较大的自旋能隙（这是额外链间耦合的结果），以及本文用作基准的可精确求解的孤立二聚体极限。

1. 当 $J_1/J_0$ 从孤立链极限开始增大时，梯子的能隙在何时趋近于孤立二聚体的值 $J_1$？
2. 对于三腿梯子，你预期动量分辨的能谱会如何变化？
3. 你能否从双格点海森堡哈密顿量出发，解析地验证孤立二聚体的结果？
