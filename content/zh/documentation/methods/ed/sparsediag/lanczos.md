
---
title: Lanczos Algorithm
math: true
weight: 1
---

The Lanczos method is an iterative algorithm that reduces a symmetric matrix $A$ of size $N \times N$ to a tridiagonal matrix $T$ of size $m \times m$, where $m \ll N$. The eigenvalues of $T$ approximate the extremal eigenvalues of $A$, and the corresponding eigenvectors can be reconstructed.

### Key Steps of the Lanczos Method

1. **Initialization**:
   - Choose a random starting vector $v_1$ with unit norm.
   - Set $\beta_0 = 0$ and $v_0 = 0$.

2. **Iteration**:
   For $j = 1, 2, \dots, m$:
   - Compute $w = A v_j - \beta\_{j-1} v\_{j-1}$.
   - Compute $\alpha_j = v_j^\top w$.
   - Compute $w = w - \alpha_j v_j$.
   - Compute $\beta_j = \|w\|$.
   - If $\beta_j = 0$, stop; otherwise, set $v\_{j+1} = w / \beta_j$.

3. **Tridiagonal Matrix**:
   After $m$ iterations, the matrix $T$ is constructed as:
   $$
   T = \begin{pmatrix}
   \alpha_1 & \beta_1 & 0 & \dots & 0 \\\
   \beta_1 & \alpha_2 & \beta_2 & \dots & 0 \\\
   0 & \beta_2 & \alpha_3 & \dots & 0 \\\
   \vdots & \vdots & \vdots & \ddots & \beta\_{m-1} \\\
   0 & 0 & 0 & \beta\_{m-1} & \alpha_m
   \end{pmatrix}
   $$

4. **Diagonalization of $T$**:
   - Diagonalize $T$ using standard dense matrix techniques (e.g., QR algorithm).
   - The eigenvalues of $T$ approximate the extremal eigenvalues of $A$.
   - The corresponding eigenvectors of $A$ can be reconstructed from the Lanczos vectors $v_j$.

### Advantages of the Lanczos Method

1. **Efficiency**:
   - Only matrix-vector products are required, making it suitable for sparse matrices.
   - Memory usage is $O(N \cdot m)$ instead of $O(N^2)$.

2. **Scalability**:
   - Works well for very large matrices where dense methods are infeasible.

3. **Focus on Extremal Eigenvalues**:
   - The Lanczos method is particularly effective at finding the largest or smallest eigenvalues and their eigenvectors.

### Challenges and Considerations

1. **Loss of Orthogonality**:
   - In finite-precision arithmetic, the Lanczos vectors $v_j$ can lose orthogonality, leading to spurious eigenvalues.
   - Remedies include reorthogonalization or using more advanced variants like the **Implicitly Restarted Lanczos Method**.

2. **Choice of $m$**:
   - The number of iterations $m$ must be chosen carefully to balance accuracy and computational cost.

3. **Convergence**:
   - Convergence to the extremal eigenvalues is typically fast, but interior eigenvalues may require many iterations.
