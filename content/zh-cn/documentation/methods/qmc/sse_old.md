---
title: 基于 SSE 的有向环算法 
math: true
weight: 4
---

## 简介

`dirloop_sse` 程序包提供了在随机级数展开表示下的量子蒙特卡洛（QMC）方法——有向环算法——的完整通用实现。`dirloop_SSE` 方法由 Anders Sandvik 及其合作者发明和发展。它是研究量子自旋或玻色晶格模型的一种强大而优雅的 QMC 方法。

我们这里介绍的当前实现采用了该方法最新的发展成果，发表于：
- A. W. Sandvik, Phys. Rev. B 59, 14157 (1999).
- F. Alet, S. Wessel, and M. Troyer Phys. Rev. E 71, 036706 (2005).
- L. Pollet, S. M. A. Rombouts, K. Van Houcke, and K. Heyde, Phys. Rev. E 70, 056705 (2005).

该版本允许在任意晶格上模拟：
- 具有任意自旋大小、磁场和各向异性的量子自旋模型（甚至是阻挫模型——见下面的说明）
- （软核）玻色模型

本版本允许模拟存在符号问题的系统（例如阻挫自旋系统）。不过，这种情况只经过了有限的测试，因此如果你的模型存在符号问题，请务必小心……

**请注意**，对于阻挫模型，参数 Epsilon 的某些取值可能使算法失去各态历经性（例如，当你得到的是一个"纯环"算法时）。需要仔细检查这一点。

## 运行模拟

详见教程。

## 输入参数

除了 ALPS 应用程序的通用输入参数之外，`dirloop_sse` 应用程序还接受以下专家参数（只有在你明白其含义时才使用！）：

| **参数** | **默认值** | **含义** |
| :------------ | :---------- | :---------- |
| SKIP | 1 | 两次测量之间的蒙特卡洛扫描次数 |
| RESTRICT_MEASUREMENTS[N] |  | 若定义此参数，则只在量子数 N（粒子数）取该参数所给值的构型上进行测量。注意，模拟仍然在巨正则系综中进行，需要将化学势调到合适的范围，才能真正采样到具有所需粒子数的构型。|
| RESTRICT_MEASUREMENTS[Sz] | | 若定义此参数，则只在量子数 Sz（磁化强度）取该参数所给值的构型上进行测量。注意，模拟仍然在巨正则系综中进行，需要将磁场调到合适的范围，才能真正采样到具有所需磁化强度的构型。|
| NUMBER_OF_WORMS_PER_SWEEP | 自洽计算 | 环更新过程中执行的蠕虫数目。默认情况下，该数目在热化阶段自洽地计算得到。不过，你也可以在整个模拟过程中强制指定其值 |
| EPSILON | 0 | 对所有相互作用附加的对角能量平移。EPSILON 的取值会影响算法的性能，存在如下权衡：取值越大，模拟时间越长，但反弹概率越低。目前的经验表明，应当对 Epsilon 使用非零值，但不宜过大（例如对自旋 S 模型取 S/2）。请注意，对于阻挫模型，Epsilon 的某些取值可能使算法失去各态历经性。你必须仔细检查。 |
| WHICH_LOOP_TYPE | "minbounce" | 字符串，指定在顶点处的散射采用哪种类型的更新：（"heatbath"）热浴，参见 A. W. Sandvik, Phys. Rev. B 59, 14157 (1999)。（"minbounce"）最小反弹，参见 F. Alet, S. Wessel, and M. Troyer Phys. Rev. E 71, 036706 (2005)。（"locopt"）局域最优，参见 L. Pollet, S. M. A. Rombouts, K. Van Houcke, and K. Heyde, Phys. Rev. E 70, 056705 (2005)。默认情况下，算法使用 "minbounce" 更新。 |
| NO_WORMWEIGHT | 0 | 布尔值，指定蠕虫矩阵元是设为 1（NO_WORMWEIGHT = true），还是取决于自旋/密度构型的真实值（NO_WORMWEIGHT=false）。默认情况下，NO_WORMWEIGHT 为 false。 |

## 测量

对于任何模型，`dirloop_sse` 都会测量以下观测量：

| **名称** | **描述** |
| :------- | :-------------- |
| Energy | 系统的总能量 |
| Energy Density | 每格点能量 |

对于自旋模型，即定义了 Sz 量子数的模型，dirloop_sse 会测量以下观测量：

| **名称** | **描述** |
| :------- | :-------------- |
| Magnetization | 总磁化强度的 z 分量 |
| Magnetization Density | 每格点总磁化强度的 z 分量 |
| \|Magnetization\| | 磁化强度 z 分量的绝对值 |
| \|Magnetization Density\| | 每格点磁化强度 z 分量的绝对值 |
| Magnetization^2 | 总磁化强度 z 分量的平方 |
| Magnetization Density^2 | 每格点总磁化强度 z 分量的平方 |
| Magnetization^4 | 总磁化强度 z 分量的四次方 |
| Magnetization Density^4 | 每格点总磁化强度 z 分量的四次方 |
| Susceptibility | 均匀磁化率（自旋模型） |

二分晶格上的自旋模型还具有交错磁化强度：

| **名称** | **描述** |
| :------- | :-------------- |
| Staggered Magnetization | 交错磁化强度的 z 分量 |
| Staggered Magnetization Density | 每格点交错磁化强度的 z 分量 |
| Staggered Magnetization^2 | 交错磁化强度 z 分量的平方 |
| Staggered Magnetization Density^2 | 每格点交错磁化强度 z 分量的平方 |

对于粒子模型，即定义了 N 量子数的模型，`dirloop_sse` 会测量以下观测量：

| **名称** | **描述** |
| :------- | :-------------- |
| Density | 粒子密度 |
| Density^2 | 粒子密度的平方 |

以及对于所有模型：

| **名称** | **描述** |
| :------- | :-------------- |
| Stiffness | 系统的刚度（对自旋模型和玻色模型均适用）|

根据应用程序的具体版本，还可能提供其他观测量。

## 贡献者

以下人员为 `dirloop_sse` 应用程序做出了贡献：

- Fabien Alet
- Matthias Troyer 
- Lode Pollet


