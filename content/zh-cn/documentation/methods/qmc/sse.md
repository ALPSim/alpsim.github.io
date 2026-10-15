---
title: 随机级数展开（SSE）
math: true
weight: 4
---

随机级数展开（SSE）方法是一种有限温度 QMC 技术，它将量子系统的配分函数 $Z$ 展开为哈密顿量的幂级数。它最初被应用于海森堡模型 [^Sandvik99]，但可以很容易地推广到其他量子模型，例如玻色-Hubbard 模型。

量子模型的配分函数为：

$$
Z = \text{Tr}(e^{-\beta \mathcal{H}}),
$$

其中 $\beta = 1/(k_B T)$ 为逆温度，$\mathcal{H}$ 为哈密顿量。SSE 的核心思想是将指数算符 $e^{-\beta \mathcal{H}}$ 表示为泰勒级数：

$$
e^{-\beta \mathcal{H}} = \sum_{n=0}^\infty \frac{(-\beta)^n}{n!} \mathcal{H}^n.
$$

插入一组完备基矢 $\{|\alpha\rangle\}$ 后，配分函数可以改写为：

$$
Z = \sum_{\alpha} \sum_{n=0}^\infty \frac{(-\beta)^n}{n!} \langle \alpha | \mathcal{H}^n | \alpha \rangle.
$$

取决于温度，模拟中的 SSE 展开阶数永远不会超过某个有限阶数 $N$。于是 SSE 方法在 $N$ 阶处截断该展开级数，并对其中各项进行随机采样。哈密顿量 $\mathcal{H}$ 通常被分解为一系列基本相互作用项 $H_{i,j}$ 之和，例如海森堡模型中的键算符：

$$
\mathcal{H} = -\sum_{i,j} H_{i,j}.
$$

每一项 $H_{i,j}$ 作用在一对格点上，并可以在合适的基下表示。SSE 算法随后对由这些算符组成的序列构成的构型进行采样。

对于海森堡模型，键算符 $H_{i,j}$ 可以表示为：

$$
H_{i,j} = J \left( S_i^z S_j^z + \frac{1}{2} (S_i^+ S_j^- + S_i^- S_j^+) \right),
$$

其中 $S_i^z$ 是自旋算符的 $z$ 分量，$S_i^+$ 和 $S_i^-$ 分别是自旋升算符和降算符。第一项 $S_i^z S_j^z$ 表示相互作用的**对角部分**，第二项 $\frac{1}{2} (S_i^+ S_j^- + S_i^- S_j^+)$ 表示**非对角部分**。

### 对角与非对角矩阵元

#### 海森堡模型
在 SSE 框架中，海森堡哈密顿量用对角算符和非对角算符来表示。对于给定的基矢 $|\alpha\rangle$，键算符 $H_{i,j}$ 的矩阵元为：

1. **对角矩阵元**：
   它们对应于 $S_i^z S_j^z$ 项，由下式给出：
   $$
   \langle \alpha | S_i^z S_j^z | \alpha \rangle = S_i^z S_j^z,
   $$
   其中 $S_i^z$ 和 $S_j^z$ 是态 $|\alpha\rangle$ 中自旋的 $z$ 分量。

2. **非对角矩阵元**：
   它们对应于自旋翻转项 $S_i^+ S_j^-$ 和 $S_i^- S_j^+$。对于态 $|\alpha\rangle$，非对角矩阵元为：
   $$
   \langle \alpha | S_i^+ S_j^- | \alpha^{\prime} \rangle = \frac{1}{2} \delta_{\alpha, \alpha^{\prime} \text{ with } S_i^+ S_j^-},
   $$
   以及
   $$
   \langle \alpha | S_i^- S_j^+ | \alpha^{\prime} \rangle = \frac{1}{2} \delta_{\alpha, \alpha' \text{ with } S_i^- S_j^+},
   $$
   其中 $\alpha$ 和 $\alpha^{\prime}$ 是通过翻转格点 $i$ 和 $j$ 上的自旋得到的态。
   
#### 玻色-Hubbard 模型
玻色-Hubbard 模型描述晶格上具有在位相互作用和最近邻跃迁的玻色子。其哈密顿量为：

$$
H = -t \sum_{\langle i,j \rangle} (b_i^\dagger b_j + \text{h.c.}) + \frac{U}{2} \sum_i n_i (n_i - 1) - \mu \sum_i n_i,
$$

其中：
- $t$ 为跃迁幅度，
- $U$ 为在位相互作用强度，
- $\mu$ 为化学势，
- $b_i^\dagger$ 和 $b_i$ 为格点 $i$ 上的玻色产生算符和湮灭算符，
- $n_i = b_i^\dagger b_i$ 为粒子数算符，
- $\langle i,j \rangle$ 表示最近邻对。

玻色-Hubbard 哈密顿量 $\mathcal{H}$ 被分解为一组键算符 $H_{i,j}$（对应跃迁）和 $H_i$（对应在位相互作用）：
$$
H = -\sum_b H_b,
$$
其中 $b$ 标记键或格点。对于玻色-Hubbard 模型：
- 跃迁项：$H_{i,j} = t (b_i^\dagger b_j + b_j^\dagger b_i)$，
- 在位项：$H_i = \frac{U}{2} n_i (n_i - 1) - \mu n_i$。

### 基矢的插入

在 SSE 方法中，配分函数以基矢 $|\alpha\rangle$ 和算符序列的形式展开。SSE 展开中的一个典型构型包括：

1. 一个基矢 $|\alpha_0\rangle$（初始态）。
2. 作用在该态上的一个算符序列 $H_{i,j}$。

于是配分函数可以写为：

$$
Z = \sum_{\alpha_0} \sum_{n=0}^N \frac{(-\beta)^n}{n!} \sum_{\{H_{i,j}\}} \langle \alpha_0 | H_{i_1,j_1} H_{i_2,j_2} \cdots H_{i_n,j_n} | \alpha_0 \rangle,
$$

其中 $N$ 是展开阶数的截断，$\{H_{i,j}\}$ 表示由 $n$ 个算符组成的序列。算符的矩阵元在基矢中计算，并且算符序列必须满足末态与初态 $|\alpha_0\rangle$ 相同的条件。

### SSE 算法的步骤

1. **初始化**：从一个初始态 $|\alpha\rangle$ 和一个空的算符序列开始。
2. **算符插入**：提议在序列中插入或移除对角算符 $H_{i,j}$，并相应地更新态 $|\alpha\rangle$。
3. **对角更新**：确保算符序列与哈密顿量及基矢相容。
4. **环更新**：执行非局域更新以提高采样效率，通常采用针对自旋或其他玻色模型量身定制的团簇或环算法 [^Syljuasen02] [^pollet04] [^Alet05]。
5. **测量**：通过对采样构型求平均，计算能量、磁化强度和关联函数等物理量。

SSE 方法对海森堡模型特别有利，因为它在某些几何结构（例如二分晶格）上不存在符号问题，并且在低温区和高温区都能高效采样。它已被成功应用于研究广泛的现象，包括量子相变、自旋动力学以及玻色系统。


[^Sandvik99]: Sandvik, A. W., "Stochastic Series Expansion Method with Operator-Loop Update", *Physical Review B*, 59, R14157-R14160 (1999).
[^Syljuasen02]: Syljuåsen, O. F. and Sandvik, A. W., "Quantum Monte Carlo with Directed Loops", *Physical Review E*, 66, 046701 (2002).
[^pollet04]: Pollet, L., et al., "Optimal Monte Carlo Updating", *Physical Review E*, 70, 056705 (2004).
[^Alet05]: Alet, F., et al., "Generalized Directed Loop Method for Quantum Monte Carlo Simulations", *Physical Review E*, 71, 036706 (2005).
