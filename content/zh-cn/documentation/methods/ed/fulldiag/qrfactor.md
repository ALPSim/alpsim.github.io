
---
title: QR 分解
description: "QR 分解方法"
math: true
weight: 2
---

**QR 分解**是对角化一般矩阵（包括对称矩阵和非对称矩阵）最高效、应用最广泛的方法之一。QR 算法通过迭代地把矩阵 $A$ 分解为正交矩阵 $Q$ 与上三角矩阵 $R$ 的乘积来工作。反复进行这种分解，并将矩阵重构为 $A^{\prime} = RQ$，矩阵就会收敛到对角或三角形式，从中即可提取本征值。本征矢则由各个 $Q$ 矩阵的累积乘积给出。

## 数学基础

对于矩阵 $A$，其 QR 分解为：

$$
A = QR
$$

其中：
- $Q$ 是正交矩阵（$Q^T Q = I$），
- $R$ 是上三角矩阵。

QR 算法迭代地应用这一分解，使 $A$ 收敛到对角或三角形式：

1. 从 $A_0 = A$ 开始。
2. 对于每次迭代 $k$：
   - 计算 QR 分解：$A_k = Q_k R_k$。
   - 重构矩阵：$A_{k+1} = R_k Q_k$。
3. 重复直到 $A_k$ 收敛为对角矩阵或三角矩阵。

$A$ 的本征值位于最终矩阵 $A_k$ 的对角线上，本征矢则由所有 $Q_k$ 矩阵的乘积给出。

## 算法

1. **初始化**：
   - 从矩阵 $A_0 = A$ 开始。

2. **QR 分解**：
   - 将 $A_k$ 分解为 $Q_k$ 和 $R_k$：
     $$
     A_k = Q_k R_k
     $$

3. **重构**：
   - 按如下方式重构矩阵 $A_{k+1}$：
     $$
     A_{k+1} = R_k Q_k
     $$

4. **累积变换**：
   - 按如下方式更新本征矢矩阵 $P$：
     $$
     P_{k+1} = P_k Q_k
     $$
   - 初始化 $P_0 = I$（单位矩阵）。

5. **检查收敛**：
   - 重复上述过程，直到 $A_k$ 足够接近对角或三角形式（即非对角元低于指定的容差）。

6. **提取本征值和本征矢**：
   - 本征值是最终 $A_k$ 的对角元。
   - 本征矢是最终 $P_k$ 的各列。

## 示例

作为示例，我们用单精度运算对一个实对称矩阵进行 QR 分解。

### 第 1 步：初始化
从矩阵 $A$ 开始：
$$
A = \begin{pmatrix}
4.000000 & -1.000000 & 3.000000 \\\
-1.000000 & 3.000000 & -1.000000 \\\
3.000000 & -1.000000 & 5.000000
\end{pmatrix}.
$$

### 第 2 步：第一次 QR 迭代

#### 第 2.1 步：计算 $Q$ 和 $R$
用 Gram-Schmidt 过程对 $A$ 进行 QR 分解。

- **$Q$ 的第一列**：
  将 $A$ 的第一列归一化：
  $$
  \mathbf{a}_1 = \begin{pmatrix} 4.000000 \\\ -1.000000 \\\ 3.000000 \end{pmatrix}, \quad
  \|\mathbf{a}_1\| = \sqrt{4^2 + (-1)^2 + 3^2} = \sqrt{26} \approx 5.099020.
  $$
  因此：
  $$
  \mathbf{q}_1 = \frac{1}{5.099020} \begin{pmatrix} 4.000000 \\\ -1.000000 \\\ 3.000000 \end{pmatrix} \approx \begin{pmatrix} 0.784465 \\\ -0.196116 \\\ 0.588349 \end{pmatrix}.
  $$

- **$Q$ 的第二列**：
  将 $A$ 的第二列相对于 $\mathbf{q}_1$ 正交化：
  $$
  \mathbf{a}_2 = \begin{pmatrix} -1.000000 \\\ 3.000000 \\\ -1.000000 \end{pmatrix}, \quad
  \mathbf{a}_2 \cdot \mathbf{q}_1 \approx -1.960784.
  $$
  计算 $\mathbf{v}_2$：
  $$
  \mathbf{v}_2 = \mathbf{a}_2 - (\mathbf{a}_2 \cdot \mathbf{q}_1) \mathbf{q}_1 \approx \begin{pmatrix} -1.000000 \\\ 3.000000 \\\ -1.000000 \end{pmatrix} - (-1.960784) \begin{pmatrix} 0.784465 \\\ -0.196116 \\\ 0.588349 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_2 \approx \begin{pmatrix} -1.000000 + 1.538462 \\\ 3.000000 - 0.384615 \\\ -1.000000 + 1.153846 \end{pmatrix} = \begin{pmatrix} 0.538462 \\\ 2.615385 \\\ 0.153846 \end{pmatrix}.
  $$
  将 $\mathbf{v}_2$ 归一化：
  $$
  \|\mathbf{v}_2\| = \sqrt{0.538462^2 + 2.615385^2 + 0.153846^2} \approx 2.672612.
  $$
  因此：
  $$
  \mathbf{q}_2 \approx \begin{pmatrix} 0.201456 \\ 0.978593 \\ 0.057553 \end{pmatrix}.
  $$

- **$Q$ 的第三列**：
  将 $A$ 的第三列相对于 $\mathbf{q}_1$ 和 $\mathbf{q}_2$ 正交化：
  $$
  \mathbf{a}_3 = \begin{pmatrix} 3.000000 \\\ -1.000000 \\\ 5.000000 \end{pmatrix}, \quad
  \mathbf{a}_3 \cdot \mathbf{q}_1 \approx 5.882353,
  $$
  $$
  \mathbf{a}_3 \cdot \mathbf{q}_2 \approx 0.000000.
  $$
  计算 $\mathbf{v}_3$：
  $$
  \mathbf{v}_3 = \mathbf{a}_3 - (\mathbf{a}_3 \cdot \mathbf{q}_1) \mathbf{q}_1 - (\mathbf{a}_3 \cdot \mathbf{q}_2) \mathbf{q}_2.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 3.000000 \\\ -1.000000 \\\ 5.000000 \end{pmatrix} - 5.882353 \begin{pmatrix} 0.784465 \\\ -0.196116 \\\ 0.588349 \end{pmatrix} - 0.000000 \begin{pmatrix} 0.201456 \\\ 0.978593 \\\ 0.057553 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 3.000000 - 4.615385 \\\ -1.000000 + 1.153846 \\\ 5.000000 - 3.461538 \end{pmatrix} = \begin{pmatrix} -1.615385 \\\ 0.153846 \\\ 1.538462 \end{pmatrix}.
  $$
  将 $\mathbf{v}_3$ 归一化：
  $$
  \|\mathbf{v}_3\| = \sqrt{(-1.615385)^2 + 0.153846^2 + 1.538462^2} \approx 2.236068.
  $$
  因此：
  $$
  \mathbf{q}_3 \approx \begin{pmatrix} -0.722222 \\\ 0.068783 \\\ 0.688889 \end{pmatrix}.
  $$

- **构造 $Q$ 和 $R$**：
  $$
  Q = \begin{pmatrix}
  0.784465 & 0.201456 & -0.722222 \\\
  -0.196116 & 0.978593 & 0.068783 \\\
  0.588349 & 0.057553 & 0.688889
  \end{pmatrix},
  $$
  $$
  R = Q^T A \approx \begin{pmatrix}
  5.099020 & 0.000000 & 5.882353 \\\
  0 & 2.672612 & 0.000000 \\\
  0 & 0 & 2.236068
  \end{pmatrix}.
  $$

#### 第 2.2 步：更新 $A$
计算 $A = RQ$：
$$
A = RQ \approx \begin{pmatrix}
6.561553 & -0.759257 & 0.000000 \\\
-0.759257 & 3.000000 & -0.650791 \\\
0.000000 & -0.650791 & 2.438447
\end{pmatrix}.
$$

### 第 3 步：第二次 QR 迭代

#### 第 3.1 步：计算 $Q$ 和 $R$
对更新后的 $A$ 进行 QR 分解。

- **$Q$ 的第一列**：
  将 $A$ 的第一列归一化：
  $$
  \mathbf{a}_1 = \begin{pmatrix} 6.561553 \\\ -0.759257 \\\ 0.000000 \end{pmatrix}, \quad
  \|\mathbf{a}_1\| \approx 6.617647.
  $$
  因此：
  $$
  \mathbf{q}_1 \approx \begin{pmatrix} 0.990000 \\\ -0.114706 \\\ 0.000000 \end{pmatrix}.
  $$

- **$Q$ 的第二列**：
  将 $A$ 的第二列相对于 $\mathbf{q}_1$ 正交化：
  $$
  \mathbf{a}_2 = \begin{pmatrix} -0.759257 \\\ 3.000000 \\\ -0.650791 \end{pmatrix}, \quad
  \mathbf{a}_2 \cdot \mathbf{q}_1 \approx -1.139000.
  $$
  计算 $\mathbf{v}_2$：
  $$
  \mathbf{v}_2 = \mathbf{a}_2 - (\mathbf{a}_2 \cdot \mathbf{q}_1) \mathbf{q}_1 \approx \begin{pmatrix} -0.759257 \\\ 3.000000 \\\ -0.650791 \end{pmatrix} - (-1.139000) \begin{pmatrix} 0.990000 \\\ -0.114706 \\\ 0.000000 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_2 \approx \begin{pmatrix} -0.759257 + 1.127610 \\\ 3.000000 - 0.130000 \\\ -0.650791 + 0.000000 \end{pmatrix} = \begin{pmatrix} 0.368353 \\\ 2.870000 \\\ -0.650791 \end{pmatrix}.
  $$
  将 $\mathbf{v}_2$ 归一化：
  $$
  \|\mathbf{v}_2\| \approx 2.939000.
  $$
  因此：
  $$
  \mathbf{q}_2 \approx \begin{pmatrix} 0.125000 \\\ 0.974000 \\\ -0.221000 \end{pmatrix}.
  $$

- **$Q$ 的第三列**：
  将 $A$ 的第三列相对于 $\mathbf{q}_1$ 和 $\mathbf{q}_2$ 正交化：
  $$
  \mathbf{a}_3 = \begin{pmatrix} 0.000000 \\\ -0.650791 \\\ 2.438447 \end{pmatrix}, \quad
  \mathbf{a}_3 \cdot \mathbf{q}_1 \approx 0.000000, \quad
  \mathbf{a}_3 \cdot \mathbf{q}_2 \approx -0.624695.
  $$
  计算 $\mathbf{v}_3$：
  $$
  \mathbf{v}_3 = \mathbf{a}_3 - (\mathbf{a}_3 \cdot \mathbf{q}_1) \mathbf{q}_1 - (\mathbf{a}_3 \cdot \mathbf{q}_2) \mathbf{q}_2.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 0.000000 \\\ -0.650791 \\\ 2.438447 \end{pmatrix} - 0.000000 \begin{pmatrix} 0.990000 \\\ -0.114706 \\\ 0.000000 \end{pmatrix} - (-0.624695) \begin{pmatrix} 0.125000 \\\ 0.974000 \\\ -0.221000 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 0.000000 + 0.078087 \\\ -0.650791 - 0.608000 \\\ 2.438447 + 0.138000 \end{pmatrix} = \begin{pmatrix} 0.078087 \\\ -1.258791 \\\ 2.576447 \end{pmatrix}.
  $$
  将 $\mathbf{v}_3$ 归一化：
  $$
  \|\mathbf{v}_3\| \approx 2.828427.
  $$
  因此：
  $$
  \mathbf{q}_3 \approx \begin{pmatrix} 0.027600 \\\ -0.445000 \\\ 0.911000 \end{pmatrix}.
  $$

- **构造 $Q$ 和 $R$**：
  $$
  Q = \begin{pmatrix}
  0.990000 & 0.125000 & 0.027600 \\\
  -0.114706 & 0.974000 & -0.445000 \\\
  0.000000 & -0.221000 & 0.911000
  \end{pmatrix},
  $$
  $$
  R = Q^T A \approx \begin{pmatrix}
  6.617647 & 0.000000 & 0.000000 \\\
  0 & 2.939000 & 0.000000 \\\
  0 & 0 & 2.828427
  \end{pmatrix}.
  $$

### 第 3.2 步：更新 $A$
计算 $A = RQ$：
$$
A = RQ \approx \begin{pmatrix}
6.617647 & 0.000000 & 0.000000 \\\
0.000000 & 2.939000 & 0.000000 \\\
0.000000 & 0.000000 & 2.828427
\end{pmatrix}.
$$

### 第 4 步：检查收敛
检查所有非对角元是否都低于容差 $10^{-6}$。在本例中，非对角元已经为零，因此矩阵 $A$ 已被对角化。

收敛后，对角化后的矩阵 $A$ 为：
$$
A \approx \begin{pmatrix}
6.617647 & 0.000000 & 0.000000 \\\
0.000000 & 2.939000 & 0.000000 \\\
0.000000 & 0.000000 & 2.828427
\end{pmatrix}.
$$

### 最终结果
用单精度 QR 分解计算得到的 $A$ 的本征值为：
$$
\lambda_1 \approx 6.617647, \quad \lambda_2 \approx 2.939000, \quad \lambda_3 \approx 2.828427.
$$

### 要点
单精度的 QR 分解方法得到的本征值接近真实值，但可能因舍入误差而略有偏差。若需要更高的精度，建议使用**双精度运算**，或采用更严格的收敛判据进行更多次迭代。

## 优点

- **高效**：QR 算法对大矩阵非常高效。
- **通用**：它既适用于对称矩阵，也适用于非对称矩阵。
- **稳定**：该算法数值稳定且稳健。

## 局限性 

- **计算代价**：对于非常大的矩阵，QR 分解这一步的计算代价可能很高。
- **非对称矩阵收敛慢**：对于非对称矩阵，该算法可能需要很多次迭代。

