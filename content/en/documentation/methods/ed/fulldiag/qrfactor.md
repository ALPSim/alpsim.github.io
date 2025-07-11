
---
title: QR Factorization
description: "QR Factorization Method"
math: true
weight: 2
---

**QR factorization** is one of the most efficient and widely used methods for diagonalizing general matrices, including symmetric and non-symmetric matrices. The QR algorithm works by iteratively decomposing a matrix $A$ into the product of an orthogonal matrix $Q$ and an upper triangular matrix $R$. By repeatedly applying this decomposition and reconstructing the matrix as $A^{\prime} = RQ$, the matrix converges to a diagonal or triangular form, from which the eigenvalues can be extracted. The eigenvectors are obtained from the accumulated product of the $Q$ matrices.

## Mathematical Foundation

For a matrix $A$, the QR factorization is given by:

$$
A = QR
$$

where:
- $Q$ is an orthogonal matrix ($Q^T Q = I$),
- $R$ is an upper triangular matrix.

The QR algorithm iteratively applies this factorization to converge $A$ to a diagonal or triangular form:

1. Start with $A_0 = A$.
2. For each iteration $k$:
   - Compute the QR factorization: $A_k = Q_k R_k$.
   - Reconstruct the matrix: $A_{k+1} = R_k Q_k$.
3. Repeat until $A_k$ converges to a diagonal or triangular matrix.

The eigenvalues of $A$ are found on the diagonal of the final matrix $A_k$, and the eigenvectors are obtained from the product of all $Q_k$ matrices.

## Algorithm

1. **Initialization**:
   - Start with the matrix $A_0 = A$.

2. **QR Factorization**:
   - Decompose $A_k$ into $Q_k$ and $R_k$:
     $$
     A_k = Q_k R_k
     $$

3. **Reconstruction**:
   - Reconstruct the matrix $A_{k+1}$ as:
     $$
     A\_{k+1} = R_k Q_k
     $$

4. **Accumulate Transformations**:
   - Update the eigenvector matrix $P$ as:
     $$
     P\_{k+1} = P_k Q_k
     $$
   - Initialize $P_0 = I$ (identity matrix).

5. **Check for Convergence**:
   - Repeat the process until $A_k$ is sufficiently diagonal or triangular (i.e., the off-diagonal elements are below a specified tolerance).

6. **Extract Eigenvalues and Eigenvectors**:
   - The eigenvalues are the diagonal elements of the final $A_k$.
   - The eigenvectors are the columns of the final $P_k$.

## An Example

As an example we perform QR factorization of a real symmetrix matrix using single-precision arithmetic.

### Step 1: Initialize
Start with the matrix $A$:
$$
A = \begin{pmatrix}
4.000000 & -1.000000 & 3.000000 \\\
-1.000000 & 3.000000 & -1.000000 \\\
3.000000 & -1.000000 & 5.000000
\end{pmatrix}.
$$

### Step 2: First QR Iteration

#### Step 2.1: Compute $Q$ and $R$
Perform QR factorization on $A$ using the Gram-Schmidt process.

- **First column of $Q$**:
  Normalize the first column of $A$:
  $$
  \mathbf{a}_1 = \begin{pmatrix} 4.000000 \\\ -1.000000 \\\ 3.000000 \end{pmatrix}, \quad
  \|\mathbf{a}_1\| = \sqrt{4^2 + (-1)^2 + 3^2} = \sqrt{26} \approx 5.099020.
  $$
  Thus:
  $$
  \mathbf{q}_1 = \frac{1}{5.099020} \begin{pmatrix} 4.000000 \\\ -1.000000 \\\ 3.000000 \end{pmatrix} \approx \begin{pmatrix} 0.784465 \\\ -0.196116 \\\ 0.588349 \end{pmatrix}.
  $$

- **Second column of $Q$**:
  Orthogonalize the second column of $A$ with respect to $\mathbf{q}_1$:
  $$
  \mathbf{a}_2 = \begin{pmatrix} -1.000000 \\\ 3.000000 \\\ -1.000000 \end{pmatrix}, \quad
  \mathbf{a}_2 \cdot \mathbf{q}_1 \approx -1.960784.
  $$
  Compute $\mathbf{v}_2$:
  $$
  \mathbf{v}_2 = \mathbf{a}_2 - (\mathbf{a}_2 \cdot \mathbf{q}_1) \mathbf{q}_1 \approx \begin{pmatrix} -1.000000 \\\ 3.000000 \\\ -1.000000 \end{pmatrix} - (-1.960784) \begin{pmatrix} 0.784465 \\\ -0.196116 \\\ 0.588349 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_2 \approx \begin{pmatrix} -1.000000 + 1.538462 \\\ 3.000000 - 0.384615 \\\ -1.000000 + 1.153846 \end{pmatrix} = \begin{pmatrix} 0.538462 \\\ 2.615385 \\\ 0.153846 \end{pmatrix}.
  $$
  Normalize $\mathbf{v}_2$:
  $$
  \|\mathbf{v}_2\| = \sqrt{0.538462^2 + 2.615385^2 + 0.153846^2} \approx 2.672612.
  $$
  Thus:
  $$
  \mathbf{q}_2 \approx \begin{pmatrix} 0.201456 \\ 0.978593 \\ 0.057553 \end{pmatrix}.
  $$

- **Third column of $Q$**:
  Orthogonalize the third column of $A$ with respect to $\mathbf{q}_1$ and $\mathbf{q}_2$:
  $$
  \mathbf{a}_3 = \begin{pmatrix} 3.000000 \\\ -1.000000 \\\ 5.000000 \end{pmatrix}, \quad
  \mathbf{a}_3 \cdot \mathbf{q}_1 \approx 5.882353,
  $$
  $$
  \mathbf{a}_3 \cdot \mathbf{q}_2 \approx 0.000000.
  $$
  Compute $\mathbf{v}_3$:
  $$
  \mathbf{v}_3 = \mathbf{a}_3 - (\mathbf{a}_3 \cdot \mathbf{q}_1) \mathbf{q}_1 - (\mathbf{a}_3 \cdot \mathbf{q}_2) \mathbf{q}_2.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 3.000000 \\\ -1.000000 \\\ 5.000000 \end{pmatrix} - 5.882353 \begin{pmatrix} 0.784465 \\\ -0.196116 \\\ 0.588349 \end{pmatrix} - 0.000000 \begin{pmatrix} 0.201456 \\\ 0.978593 \\\ 0.057553 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 3.000000 - 4.615385 \\\ -1.000000 + 1.153846 \\\ 5.000000 - 3.461538 \end{pmatrix} = \begin{pmatrix} -1.615385 \\\ 0.153846 \\\ 1.538462 \end{pmatrix}.
  $$
  Normalize $\mathbf{v}_3$:
  $$
  \|\mathbf{v}_3\| = \sqrt{(-1.615385)^2 + 0.153846^2 + 1.538462^2} \approx 2.236068.
  $$
  Thus:
  $$
  \mathbf{q}_3 \approx \begin{pmatrix} -0.722222 \\\ 0.068783 \\\ 0.688889 \end{pmatrix}.
  $$

- **Construct $Q$ and $R$**:
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

#### Step 2.2: Update $A$
Compute $A = RQ$:
$$
A = RQ \approx \begin{pmatrix}
6.561553 & -0.759257 & 0.000000 \\\
-0.759257 & 3.000000 & -0.650791 \\\
0.000000 & -0.650791 & 2.438447
\end{pmatrix}.
$$

### Step 3: Second QR Iteration

#### Step 3.1: Compute $Q$ and $R$
Perform QR factorization on the updated $A$.

- **First column of $Q$**:
  Normalize the first column of $A$:
  $$
  \mathbf{a}_1 = \begin{pmatrix} 6.561553 \\\ -0.759257 \\\ 0.000000 \end{pmatrix}, \quad
  \|\mathbf{a}_1\| \approx 6.617647.
  $$
  Thus:
  $$
  \mathbf{q}_1 \approx \begin{pmatrix} 0.990000 \\\ -0.114706 \\\ 0.000000 \end{pmatrix}.
  $$

- **Second column of $Q$**:
  Orthogonalize the second column of $A$ with respect to $\mathbf{q}_1$:
  $$
  \mathbf{a}_2 = \begin{pmatrix} -0.759257 \\\ 3.000000 \\\ -0.650791 \end{pmatrix}, \quad
  \mathbf{a}_2 \cdot \mathbf{q}_1 \approx -1.139000.
  $$
  Compute $\mathbf{v}_2$:
  $$
  \mathbf{v}_2 = \mathbf{a}_2 - (\mathbf{a}_2 \cdot \mathbf{q}_1) \mathbf{q}_1 \approx \begin{pmatrix} -0.759257 \\\ 3.000000 \\\ -0.650791 \end{pmatrix} - (-1.139000) \begin{pmatrix} 0.990000 \\\ -0.114706 \\\ 0.000000 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_2 \approx \begin{pmatrix} -0.759257 + 1.127610 \\\ 3.000000 - 0.130000 \\\ -0.650791 + 0.000000 \end{pmatrix} = \begin{pmatrix} 0.368353 \\\ 2.870000 \\\ -0.650791 \end{pmatrix}.
  $$
  Normalize $\mathbf{v}_2$:
  $$
  \|\mathbf{v}_2\| \approx 2.939000.
  $$
  Thus:
  $$
  \mathbf{q}_2 \approx \begin{pmatrix} 0.125000 \\\ 0.974000 \\\ -0.221000 \end{pmatrix}.
  $$

- **Third column of $Q$**:
  Orthogonalize the third column of $A$ with respect to $\mathbf{q}_1$ and $\mathbf{q}_2$:
  $$
  \mathbf{a}_3 = \begin{pmatrix} 0.000000 \\\ -0.650791 \\\ 2.438447 \end{pmatrix}, \quad
  \mathbf{a}_3 \cdot \mathbf{q}_1 \approx 0.000000, \quad
  \mathbf{a}_3 \cdot \mathbf{q}_2 \approx -0.624695.
  $$
  Compute $\mathbf{v}_3$:
  $$
  \mathbf{v}_3 = \mathbf{a}_3 - (\mathbf{a}_3 \cdot \mathbf{q}_1) \mathbf{q}_1 - (\mathbf{a}_3 \cdot \mathbf{q}_2) \mathbf{q}_2.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 0.000000 \\\ -0.650791 \\\ 2.438447 \end{pmatrix} - 0.000000 \begin{pmatrix} 0.990000 \\\ -0.114706 \\\ 0.000000 \end{pmatrix} - (-0.624695) \begin{pmatrix} 0.125000 \\\ 0.974000 \\\ -0.221000 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 0.000000 + 0.078087 \\\ -0.650791 - 0.608000 \\\ 2.438447 + 0.138000 \end{pmatrix} = \begin{pmatrix} 0.078087 \\\ -1.258791 \\\ 2.576447 \end{pmatrix}.
  $$
  Normalize $\mathbf{v}_3$:
  $$
  \|\mathbf{v}_3\| \approx 2.828427.
  $$
  Thus:
  $$
  \mathbf{q}_3 \approx \begin{pmatrix} 0.027600 \\\ -0.445000 \\\ 0.911000 \end{pmatrix}.
  $$

- **Construct $Q$ and $R$**:
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

### Step 3.2: Update $A$
Compute $A = RQ$:
$$
A = RQ \approx \begin{pmatrix}
6.617647 & 0.000000 & 0.000000 \\\
0.000000 & 2.939000 & 0.000000 \\\
0.000000 & 0.000000 & 2.828427
\end{pmatrix}.
$$

### Step 4: Check Convergence
Check if all off-diagonal elements are below the tolerance $10^{-6}$. In this case, the off-diagonal elements are already zero, so the matrix $A$ is diagonalized.

After convergence, the diagonalized matrix $A$ will be:
$$
A \approx \begin{pmatrix}
6.617647 & 0.000000 & 0.000000 \\\
0.000000 & 2.939000 & 0.000000 \\\
0.000000 & 0.000000 & 2.828427
\end{pmatrix}.
$$

### Final Result
The eigenvalues of $A$ computed using QR factorization with single precision are:
$$
\lambda_1 \approx 6.617647, \quad \lambda_2 \approx 2.939000, \quad \lambda_3 \approx 2.828427.
$$

### Key Takeaway
The QR factorization method with single precision produces eigenvalues that are close to the true values but may differ slightly due to rounding errors. For higher accuracy, **double-precision arithmetic** or more iterations with stricter convergence criteria are recommended.

## Advantages

- **Efficiency**: The QR algorithm is highly efficient for large matrices.
- **Versatility**: It works for both symmetric and non-symmetric matrices.
- **Stability**: The algorithm is numerically stable and robust.

## Limitations 

- **Computational Cost**: The QR factorization step can be computationally expensive for very large matrices.
- **Slow Convergence for Non-Symmetric Matrices**: The algorithm may require many iterations for non-symmetric matrices.

