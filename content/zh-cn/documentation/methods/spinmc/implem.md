---
title: 实现
math: true
weight: 5
---

`spinmc` 程序包是 ALPS 项目的应用程序之一。它为经典自旋系统提供了局域更新和团簇更新的通用实现。
该应用程序支持在任意晶格上模拟以下模型：

- [伊辛模型](../../../models/ising)
- XY 模型
- 海森堡模型
- 3、4 和 10 态 Potts 模型

通过以直接的方式编辑文件 mc/spins/spinmc_factory.C，可以很容易地将该应用程序扩展到其他 q 态 Potts 模型和 $O(N)$ 模型。

## 运行模拟

详见教程。

## 输入参数

除了 ALPS 调度器库的通用输入参数之外，spinmc 应用程序还接受以下输入参数：

| **名称**  | **默认值** | **描述** |
| :---- | :----   | :----       |
| LATTICE_LIBRARY | lattices.xml | 包含晶格描述的文件路径 |
| LATTICE | | 晶格的名称 |
| MODEL | | Ising、XY、Heisenberg 或 Potts 之一 |
| q | | Potts 模型中不同状态的数目 |
| UPDATE | | 更新类型，local 或 cluster 之一 |
| ERROR_VARIABLE | | 希望 ALPS 监控其误差的观测量的名称（必须与 ERROR_LIMIT 一起使用） |
| ERROR_LIMIT | | 一旦 ERROR_VARIABLE 的绝对误差小于此值，ALPS 将停止该任务（必须与 ERROR_VARIABLE 一起使用） |
| T | | 温度 |
| J | | 默认耦合常数 |
| J# | J | 类型为 #（#=0,1,...）的键上的耦合常数。 |
| D | | 在位单离子各向异性耦合常数（以列表形式为每个自旋分量各给出一个，例如 D="0.0 0.0 10.0"） |
| CONVENTION | classical | 指定使用经典约定还是量子约定（见下文） |
| S |  若 CONVENTION=classical 则为 1；若 CONVENTION=quantum 则为 1/2 | 默认自旋大小 |
| S# | S | 类型为 #（#=0,1,...）的格点上的自旋大小。 |
| $g$ | 1 | Landee $g$ 因子，用于磁化率测量 |
| h | 0 | 外磁场（仅适用于局域更新） |

此外，晶格描述可能还需要晶格描述文件中指定的其他参数（例如 L 或 W）。
注意：经典蒙特卡洛程序虽然使用 XML 晶格描述，但并不使用 XML 模型描述。模型改由上表中的参数指定。

## 局域更新与团簇更新

只要没有施加磁场且自旋系统没有阻挫，就应使用团簇更新。否则优先使用局域更新。

## 量子约定与经典约定

量子自旋模型和经典自旋模型对耦合常数通常采用不同的约定，CONVENTION 参数允许在两者之间进行选择。
- **classical**（经典）约定以正号表示铁磁耦合。如果指定了参数 S，耦合强度会乘以 $S^2$。
- **quantum**（量子）约定以正号表示反铁磁耦合。耦合强度会乘以 S(S+1)，其中 S 默认为 1/2。

## 测量

spinmc 应用程序会测量以下观测量：

| **名称**  | **描述** |
| :---- | :---------- |
| Energy | 系统的总能量 |
| Energy Density | 系统的能量密度（每格点能量） |
| Specific Heat | 系统的每格点比热 |
| Magnetization | 磁化强度的 z 分量 |
| \|Magnetization\| | 磁化强度 z 分量的绝对值 |
| Magnetization^2 | 磁化强度 z 分量的平方 |
| Magnetization along Field | 磁化强度沿外磁场方向的分量 |
| Staggered Magnetization | 交错磁化强度的 z 分量（仅适用于二分晶格） |
| Staggered Magnetization^2 | 交错磁化强度 z 分量的平方（仅适用于二分晶格） |
| Susceptibility | 均匀磁化率，包含因子 $g^2$ |
| Cluster size | 以晶格体积的比例表示的平均团簇大小（仅适用于团簇更新） |

注意：要计算比热，必须在任务文件（\*task\*.xml）上运行计算程序 spinmc_evaluate。
