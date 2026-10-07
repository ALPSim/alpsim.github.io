
---
title: 对称性
math: true
weight: 2
---
哈密顿量的希尔伯特空间维数随格点数呈指数增长，这限制了可研究的量子模型的尺寸。不过，借助晶格和哈密顿量的对称性进行块对角化，可以把完整的哈密顿量矩阵约化为若干个更小的矩阵。

下面我们以一条具有周期性边界的 4 格点自旋 $\frac{1}{2}$ 链为例，说明如何利用这些对称性对完整的哈密顿量矩阵进行块对角化。

## 希尔伯特空间

4 格点自旋 $\frac{1}{2}$ 链的希尔伯特空间维数为 $2^4 = 16$。该空间的一组基可以写为：

$$
\{ |s_1, s_2, s_3, s_4\rangle \}, \quad s_i \in \{\uparrow, \downarrow\}
$$

## 哈密顿量的对称性

哈密顿量具有若干对称性，可以用来对其进行块对角化，从而降低计算量：

- **总磁化强度 $S^z_{\text{total}}$ 守恒**：
   总 $S^z$ 算符 $S^z_{\text{total}} = \sum_{i=1}^4 S_i^z$ 与 $\mathcal{H}$ 对易。因此，哈密顿量在固定 $S^z_{\text{total}}$ 的各个扇区中是块对角的。

- **平移对称性**：
   哈密顿量在平移 $T$ 下不变，其中 $T|s_1, s_2, s_3, s_4\rangle = |s_4, s_1, s_2, s_3\rangle$。利用这一对称性可以对 $\mathcal{H}$ 做进一步的块对角化。

- **自旋反转对称性**：
   哈密顿量在自旋反转 $P$ 下不变，其中 $P|s_1, s_2, s_3, s_4\rangle = |-s_1, -s_2, -s_3, -s_4\rangle$。这一对称性同样可以加以利用。

- **反射对称性**：
   哈密顿量在反射 $R$ 下不变，其中 $R|s_1, s_2, s_3, s_4\rangle = |s_4, s_3, s_2, s_1\rangle$。

## 块对角化

我们将利用总磁化强度 $S^z_{\text{total}}$ 和平移对称性来约化希尔伯特空间。

### 第 1 步：总磁化强度扇区

$S^z_{\text{total}}$ 的可能取值为 $-2, -1, 0, 1, 2$。我们可以把希尔伯特空间划分为以下扇区：

- $S^z_{\text{total}} = 2$：只有一个态，$|\uparrow, \uparrow, \uparrow, \uparrow\rangle$。
- $S^z_{\text{total}} = 1$：四个态，例如 $|\downarrow, \uparrow, \uparrow, \uparrow\rangle$、$|\uparrow, \downarrow, \uparrow, \uparrow\rangle$ 等。
- $S^z_{\text{total}} = 0$：六个态，例如 $|\uparrow, \uparrow, \downarrow, \downarrow\rangle$、$|\uparrow, \downarrow, \uparrow, \downarrow\rangle$ 等。
- $S^z_{\text{total}} = -1$：四个态，例如 $|\downarrow, \downarrow, \downarrow, \uparrow\rangle$、$|\downarrow, \downarrow, \uparrow, \downarrow\rangle$ 等。
- $S^z_{\text{total}} = -2$：只有一个态，$|\downarrow, \downarrow, \downarrow, \downarrow\rangle$。

### 第 2 步：平移对称性

在每个 $S^z_{\text{total}}$ 扇区内，还可以利用平移对称性做进一步的块对角化。平移算符 $T$ 的本征值为 $e^{ik}$，其中 $k = 0, \pi/2, \pi, 3\pi/2$（因为 $T^4 = 1$）。

例如，在 $S^z_{\text{total}} = 0$ 扇区中，可以把各个态组织成动量本征态。总动量为 $k$ 的一个态可以写为

$$
|\phi\rangle = \frac{1}{\sqrt{M}} \sum_{n=0}^3 e^{ikn} T^n |\psi\rangle,
$$

其中 $|\psi\rangle$ 是实空间中的一个代表态，$|\phi\rangle$ 是动量空间中的态，它在 $T$ 的作用下保持不变。归一化因子 $M=4$，除非该态的循环周期小于 4，这一情形将在后文讨论。

### 第 3 步：构造哈密顿量矩阵块

对每个 $S^z_{\text{total}}$ 和动量 $k$，我们在约化后的基中构造哈密顿量矩阵。其矩阵元为：

$$
\langle \phi^{\prime} | \mathcal{H} | \phi \rangle = J \sum_{i=1}^4 \langle \phi^{\prime} | \mathbf{S}_i \cdot \mathbf{S}_{i+1} | \phi \rangle
$$

### 第 4 步：对角化

最后，对哈密顿量的每个矩阵块进行对角化，得到本征值和本征态。

### 示例：$S^z_{\text{total}} = 0$ 扇区

$S^z_{\text{total}} = 0$ 扇区由恰好有 2 个自旋向上（$\uparrow$）和 2 个自旋向下（$\downarrow$）的态组成。对于 4 格点链，该扇区共有 $\binom{4}{2} = 6$ 个基矢态：

$$
|\psi_1\rangle = |\uparrow, \uparrow, \downarrow, \downarrow\rangle, \quad |\psi_2\rangle = |\uparrow, \downarrow, \uparrow, \downarrow\rangle, \quad |\psi_3\rangle = |\uparrow, \downarrow, \downarrow, \uparrow\rangle
$$
$$
|\psi_4\rangle = |\downarrow, \uparrow, \uparrow, \downarrow\rangle, \quad |\psi_5\rangle = |\downarrow, \uparrow, \downarrow, \uparrow\rangle, \quad |\psi_6\rangle = |\downarrow, \downarrow, \uparrow, \uparrow\rangle
$$

$S^z_{\text{total}}=0$ 扇区的完整哈密顿量矩阵为
$$
\mathcal{H} = J\begin{pmatrix}
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
 0.5 & -1 & 0.5 & 0.5 & 0 & 0.5 \\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
 0.5 & 0 & 0.5 & 0.5 & -1 & 0.5 \\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
\end{pmatrix}.
$$
对上述矩阵做精确对角化，得到 $E_1=-2J$、$E_2=-J$、$E_3=0$、$E_4=0$、$E_5=0$ 和 $E_6=J$。

#### 动量扇区
如上所述，动量 $k$ 取 $k = 0, \pi/2, \pi, 3\pi/2$。平移算符 $T$ 作用在态 $|\psi_i\rangle$ 上的结果为：

$$
T^n |\psi_i\rangle = e^{ikn} |\psi_j\rangle.
$$

当 $n=1$ 时，每个格点上的自旋构型向右平移 1 个晶格间距。当 $n=4$ 时，态 $|\psi_j\rangle=|\psi_i\rangle$。一个态的循环周期有可能小于 $4$。例如，$|\psi_2\rangle$ 和 $|\psi_5\rangle$ 的周期都是 2。此时上述变换式中的归一化因子 $M=2$。

下面我们为每个动量扇区构造具有平移对称性的态。

#### $S^z_{\text{total}} = 0$ 且 $k = 0$ 扇区
动量 $k = 0$ 扇区由平移对称的态组成。对于 $S^z_{\text{total}} = 0$，共有 2 个基矢态：

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle + |\psi_4\rangle + |\psi_6\rangle + |\psi_3\rangle \right).
$$

$$
|\phi_2\rangle = \frac{1}{\sqrt{2}}(|\psi_2\rangle + |\psi_5\rangle).
$$
在上述动量空间基矢态的构造中，我们用了两个**代表态** $|\psi_1\rangle$ 和 $|\psi_2\rangle$，并通过平移算符 $T$ 生成基矢态。无法再生成其他独立的态。因此，$S^z_{\text{total}} = 0$ 且 $k = 0$ 扇区的维数为 2。

该扇区中的哈密顿量矩阵为：
$$
\mathcal{H} = J\begin{pmatrix}
0 & \sqrt{2} \\
\sqrt{2} & -1 \\
\end{pmatrix}.
$$
对该矩阵做精确对角化，得到 $E_1=-2J$ 和 $E_2=J$。

#### $S^z_{\text{total}} = 0$ 且 $k = 1$ 扇区
动量 $k = 1$ 扇区对应于 $k = \frac{\pi}{2}$。对于 $S^z_{\text{total}} = 0$，只有 1 个基矢态：

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle + i|\psi_4\rangle - |\psi_6\rangle - i|\psi_3\rangle \right).
$$

该扇区中的哈密顿量矩阵为：

$$
\mathcal{H} = \begin{pmatrix}
0
\end{pmatrix}.
$$
因此，$S^z_{\text{total}} = 0$ 且 $k = 1$ 扇区的本征值为 $E_3=0$。

#### $S^z_{\text{total}} = 0$ 且 $k = 2$ 扇区
动量 $k = 2$ 扇区对应于 $k = \pi$。对于 $S_z = 0$，共有 2 个基矢态：

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle - |\psi_4\rangle + |\psi_6\rangle -|\psi_3\rangle \right),
$$
$$
|\phi_2\rangle = \frac{1}{\sqrt{2}} \left( |\psi_2\rangle - |\psi_5\rangle \right),
$$

该扇区中的哈密顿量矩阵为：

$$
\mathcal{H} = J \begin{pmatrix}
0 & 0 \\
0 & -1 \\
\end{pmatrix},
$$
对其做精确对角化，得到 $E_4=-J$ 和 $E_5=0$。

#### $S^z_{\text{total}} = 0$ 且 $k = 3$ 扇区
动量 $k = 3$ 扇区对应于 $k = \frac{3\pi}{2}$。对于 $S_z = 0$，只有 1 个基矢态：

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle - i|\psi_4\rangle - |\psi_6\rangle + i|\psi_3\rangle \right).
$$

该扇区中的哈密顿量矩阵为：

$$
\mathcal{H} = \begin{pmatrix}
0
\end{pmatrix}.
$$
于是最后一个本征值为 $E_6=0$。

#### 小结
- **$k = 0$**：两个态，能量为 $-2J$ 和 $J$。
- **$k = 1$**：一个态，能量为 $0$。
- **$k = 2$**：两个态，能量为 $-J$ 和 $0$。
- **$k = 3$**：一个态，能量为 $0$。

这些能级与不利用平移对称性、直接对 $S^z_{\text{total}}=0$ 扇区的 $6\times 6$ 哈密顿量矩阵做精确对角化所得的结果一致。

对所有矩阵块进行对角化之后，我们就得到了具有周期性边界条件的 4 格点海森堡链的精确本征值和本征态。利用对称性可以把矩阵尺寸缩小约 $1/N$ 倍，其中 $N$ 为格点数。

这一方法可以推广到更大的体系，不过需要在精确对角化程序中设计一种高效的方式来索引和访问希尔伯特空间中的所有态。计算代价仍然随体系尺寸呈指数增长。
