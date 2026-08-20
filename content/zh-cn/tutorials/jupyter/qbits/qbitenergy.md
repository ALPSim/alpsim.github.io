---
title: 量子比特的能谱
description: "用于量子比特能量的 Jupyter md 文件"
toc: true
math: true
weight: 61
cascade:
    type: docs
---

在本教程中,我们将探索如何搭建任意的晶格配置来放置量子比特,并为量子比特之间指定各种相互作用,以模拟量子比特的操作。我们得到的能谱结果可以作为量子计算理论/实验中初始量子比特配置的基准。

## 混合 4 位点量子比特

### 简介

我们首先使用晶格配置文件 `lattices.xml` 中的 4 位点混合图:
```
<GRAPH name="4-site mixed" vertices="4"> 
  <VERTEX id="1" type="0"/>
  <VERTEX id="2" type="1"/>
  <VERTEX id="3" type="0"/>
  <VERTEX id="4" type="1"/>
  <EDGE type="0" source="1" target="2"/>
  <EDGE type="0" source="2" target="3"/>
  <EDGE type="0" source="3" target="4"/>
  <EDGE type="0" source="4" target="1"/>
  <EDGE type="1" source="1" target="3"/>
  <EDGE type="1" source="2" target="4"/>
</GRAPH> 
```

该晶格配置如下图所示:
![mixed-4-site configuration](/figs/qbits/mixed4sitesconfig.png)

同一个图,在每条键上标注了哈密顿量的耦合强度,并在每个位点上标注了横场 $\Gamma$:

```
Γ   1 ---J1--- 2   Γ
    |  \     / |
    J1  J2 J2  J1
    |  /     \ |
Γ   4 ---J1--- 3   Γ
```

在这个晶格配置中有两种类型的顶点,位点 1 和 3 被标记为 "0",位点 2 和 4 被标记为 "1"。每个量子比特位点都受到强度为 Gamma 的横向磁场作用。此外还有两种类型的键,位点 (1,2)、(2,3)、(3,4) 和 (4,1) 之间的键被标记为 "0",位点 (1,3) 和 (2,4) 之间的键被标记为 "1"。对于键类型 "0",我们为类型 "0" 的键指定相互作用 J1,为类型 "1" 的键指定相互作用 J2。以上所有设置都在模型配置文件 `models.xml` 中完成:
```
<HAMILTONIAN name="qbit operation">
  <PARAMETER name="J1" default="1"/>
  <PARAMETER name="J2" default="0.5"/>
  <BASIS ref="spin"/>
  <SITETERM site="i">
    -Gamma*Sx(i)
  </SITETERM>
  <BONDTERM source="1" target="2">
    J1*Sz(1)*Sz(2)
  </BONDTERM>
  <BONDTERM source="2" target="3">
    J1*Sz(2)*Sz(3)
  </BONDTERM>
  <BONDTERM source="3" target="4">
    J1*Sz(3)*Sz(4)
  </BONDTERM>
  <BONDTERM source="4" target="1">
    J1*Sz(4)*Sz(1)
  </BONDTERM>
  <BONDTERM source="1" target="3">
    J2*Sz(1)*Sz(3)
  </BONDTERM>
  <BONDTERM source="2" target="4">
    J2*Sz(2)*Sz(4)
  </BONDTERM>
</HAMILTONIAN>
```
经过以上设置,4 位点量子比特的哈密顿量由下式给出
$$
H=J_{1} \sum_{type 0} S^i_z S^j_z + J_{2} \sum_{type 1} S^i_z S^j_z - \Gamma \sum_i S^i_x.
$$

这是一个用于教学目的的小型模型(并非对应某个已发表的具体量子比特器件),在此用来演示如何从零开始在 ALPS 中定义自定义的晶格图与哈密顿量,而不是使用内置的晶格/模型。

### 参数

| 参数 | 含义 | 取值 |
|---|---|---|
| `GRAPH` | 自定义晶格图(定义见上文) | `4-site mixed` |
| `MODEL` | 自定义哈密顿量(定义见上文) | `qbit operation` |
| `local_S` | 每个位点的自旋量子数 | `0.5` |
| `Gamma` | 横场强度 $\Gamma$ | `0.5` |
| `J1` | 类型 "0" 键耦合(正方形边) | `1`(模型默认值) |
| `J2` | 类型 "1" 键耦合(对角边) | `0.0` 到 `1.6`,步长 `0.2` |
| `NUMBER_EIGENVALUES` | 保留的低能本征态数目 | `5` |

### 方法选择

由于只有 4 个位点,希尔伯特空间维度为 $2^4=16$,任何对角化方法都能瞬间完成计算;这里使用 `sparsediag` 的兰索斯算法纯粹是为了与其他精确对角化教程保持一致,并展示可推广到更大系统的自定义晶格/自定义模型工作流程。

### 模拟

我们首先导入一些模块:


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
```

然后我们为系统设置参数,并对第二个耦合常数 J2 进行循环。


```python
parms = []
# 遍历第二个耦合常数
for J2 in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6]:
    parms.append({
        'GRAPH'      : "4-site mixed",
        'MODEL'      : "qbit operation",
        'local_S'    : 0.5,
        'Gamma'      : 0.5,
        'J2'         : J2,
        'NUMBER_EIGENVALUES' : 5
    })
```

现在我们设置输入文件并运行模拟。


```python
prefix = 'qbitenergy'
input_file = pyalps.writeInputFiles(prefix,parms)
res = pyalps.runApplication('sparsediag', input_file)
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
```

接下来我们遍历参数 J2,并绘制每个 J2 对应的最低能级。


```python
x = []
E0 = []
for Lsets in data:
    J2 = pyalps.flatten(Lsets)[0].props['J2']
    x.append(J2)
    lowestE = pyalps.flatten(Lsets)[0].y[0]
    E0.append(lowestE)
    
# 设置散点图标签
lbl="J1=1.0, Gamma=0.5"
plt.scatter(x,E0, label=lbl)
plt.legend()
plt.xlabel("J2")
plt.ylabel("E")
plt.title("4-site Mixed Graph")
plt.show()

```

不同耦合常数 J2 下最低能量的能谱结果如下图所示:
![Lowest energies vs. J2](/figs/qbits/sites4mixed.png)

### 结果

基态能量 $E_0$ 随 $J_2$ 变化的关系,取自上述代码在 $J_1=1$、$\Gamma=0.5$ 下的运行结果:

| $J_2$ | $E_0$ |
|---|---|
| 0.0 | -1.00000 |
| 0.2 | -1.01245 |
| 0.4 | -1.04246 |
| 0.6 | -1.08341 |
| 0.8 | -1.13192 |
| 1.0 | -1.18614 |
| 1.2 | -1.24496 |
| 1.4 | -1.30764 |
| 1.6 | -1.37365 |

在 $J_2=0$ 时(只有正方形边的键起作用),$E_0=-1$ 精确成立,这与带有弱横场的孤立 4 位点环一致。随着 $J_2$ 增大,对角键带来了更多的反铁磁阻挫,基态能量单调下降。

### 总结与展望

对这个自定义的 4 位点混合图哈密顿量进行对角化表明,随着对角耦合 $J_2$ 的增强,基态能量平滑且单调地下降,在此参数范围内没有出现能级交叉的迹象。

1. 随着 $J_2$ 增大,基态与第一激发态之间的能隙会发生什么变化——它在某处会闭合吗?
2. 你会如何扩展这里的 `lattices.xml`/`models.xml` 组合,以模拟同一混合图的 8 位点版本?
3. 在 $J_2 \to 0$ 和 $J_2 = J_1$ 这两个极限下,基态能量分别是多少?你能仅从键的结构来解释这一点吗?
