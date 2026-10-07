---
title: 测量
math: true
weight: 4
---

系统达到平衡之后，我们就可以测量能量、磁化强度以及各种磁化率等物理量。然而，要准确测量物理量，需要仔细考虑自相关以及独立样本的生成。自相关是指在不同蒙特卡洛步上进行的测量之间的关联，它会导致有偏的估计以及被低估的误差。生成独立样本可以保证测量结果在统计上是有意义的。

## 物理量的自相关

### 1. **自相关函数**
自相关函数 $C_A(t)$ 度量物理量 $A$ 相隔时间间隔 $t$（以蒙特卡洛步计）的两次测量之间的关联：
$$
C_A(t) = \frac{\langle A_k A_{k+t} \rangle - \langle A_k \rangle^2}{\langle A_k^2 \rangle - \langle A_k \rangle^2},
$$
其中 $\langle A_k A_{k+t} \rangle$ 是相隔 $t$ 步的两次测量之积的平均值。

### 2. **自相关时间**
自相关时间 $\tau_A$ 刻画了自相关函数衰减的快慢。其定义为：
$$
\tau_A = \sum_{t=1}^{\infty} C_A(t).
$$
在实际中，$\tau_A$ 通过将 $C_A(t)$ 拟合为指数衰减来估计：
$$
C_A(t) \sim e^{-t / \tau_A}.
$$

### 3. **自相关的影响**
自相关会减少独立样本的有效数目，导致统计误差被低估。为此，测量量 $A$ 的误差修正为：
$$
\sigma_A = \sqrt{\frac{\text{Var}(A)}{N_{\text{eff}}}},
$$
其中 $\text{Var}(A)$ 是 $A$ 的方差，$N_{\text{eff}}$ 是独立样本的有效数目：
- $\text{Var}(A)$ 是 $A$ 的**方差**，定义为：
  $$
  \text{Var}(A) = \langle A^2 \rangle - \langle A \rangle^2,
  $$
  其中 $\langle A^2 \rangle$ 是测量值平方的平均值，$\langle A \rangle$ 是测量值的平均值。
- $N_{\text{eff}}$ 是独立样本的有效数目：
  $$
  N_{\text{eff}} = \frac{N_{\text{meas}}}{1 + 2 \tau_A}.
  $$
  
## 生成独立样本

### 1. 间隔测量
为了减小自相关，测量之间的间隔应至少为自相关时间 $\tau_A$。这样可以保证相继的测量近似独立。例如，若 $\tau_A = 10$，则应每隔 10 个蒙特卡洛步进行一次测量。

### 2. 分块方法
分块方法是一种通过将测量分组为若干块来生成独立样本的技术。每一块都应大于自相关时间。每一块的平均值被视为一个独立样本，并用这些块平均值的方差来估计误差。

### 3. 并行回火
对于动力学缓慢的系统，可以使用并行回火来生成独立样本。其做法是在不同温度下同时运行多个模拟，并周期性地在它们之间交换构型。这种交换有助于系统更高效地探索构型空间。

## 物理量

下面给出伊辛模型的一些物理量示例。对于不同的模型，需要考虑不同的物理量。

### 磁化强度：
  $$
  M = \frac{1}{N} \sum_i s_i^z,
  $$
  其中 $N$ 是自旋的总数。
  
### 能量：
  $$
  E = -J \sum_{\langle i,j \rangle} s_i^z s_j^z - h \sum_i s_i^z.
  $$
  
### 磁化率：

磁化率 $\chi$ 度量系统磁化强度对外磁场的响应。其定义为：
$$
\chi = \frac{\partial \langle M \rangle}{\partial h},
$$
其中 $\langle M \rangle$ 是平均磁化强度，$h$ 是外磁场。在蒙特卡洛模拟中，$\chi$ 由磁化强度 $M$ 的涨落通过以下公式计算：
$$
\chi = \frac{\beta}{N} \left( \langle M^2 \rangle - \langle M \rangle^2 \right),
$$
其中：
- $\beta = 1/(k_B T)$ 为逆温度，
- $N$ 是自旋的总数，
- $\langle M \rangle$ 是平均磁化强度，
- $\langle M^2 \rangle$ 是磁化强度平方的平均值。

### 比热：

比热 $C$ 度量系统的热容，即改变系统温度所需的能量。其定义为：
$$
C = \frac{\partial \langle E \rangle}{\partial T},
$$
其中 $\langle E \rangle$ 是系统的平均能量。

在蒙特卡洛模拟中，$C$ 由能量 $E$ 的涨落通过以下公式计算：
$$
C = \frac{\beta^2}{N} \left( \langle E^2 \rangle - \langle E \rangle^2 \right),
$$
其中：
- $\beta = 1/(k_B T)$ 为逆温度，
- $N$ 是自旋的总数，
- $\langle E \rangle$ 是平均能量，
- $\langle E^2 \rangle$ 是能量平方的平均值。
