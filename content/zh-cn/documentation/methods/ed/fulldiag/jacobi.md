
---
title: Jacobi Rotation
description: "Jacobi Rotation Method"
math: true
weight: 1
---

The **Jacobi rotation method** is a classical iterative algorithm used to diagonalize symmetric matrices. It is particularly well-suited for small to medium-sized matrices and is known for its simplicity and robustness. The method works by systematically eliminating off-diagonal elements through a series of orthogonal transformations (rotations), eventually converging to a diagonal matrix whose elements are the eigenvalues of the original matrix.

The Jacobi method targets the largest off-diagonal element of the matrix and applies a rotation to zero it out. This process is repeated iteratively until all off-diagonal elements are sufficiently small, resulting in a diagonal matrix. The eigenvalues of the original matrix are then found on the diagonal, and the eigenvectors are obtained from the product of all the rotation matrices applied during the process.


## Principles

For a symmetric matrix $A$, the goal is to find an orthogonal matrix $P$ such that:

$$
D = P^T A P
$$

where $D$ is a diagonal matrix containing the eigenvalues of $A$, and the columns of $P$ are the corresponding eigenvectors.

The Jacobi method achieves this by applying a sequence of orthogonal transformations (rotations) to $A$. Each rotation targets a specific off-diagonal element $A\_{ij}$ and zeroes it out.


## Rotation Matrix

A Jacobi rotation matrix $R$ is an orthogonal matrix that differs from the identity matrix only in four elements:

$$
R = \begin{pmatrix}
1 & \cdots & 0 & \cdots & 0 & \cdots & 0 \\\
\vdots & \ddots & \vdots & & \vdots & & \vdots \\\
0 & \cdots & \cos \theta & \cdots & -\sin \theta & \cdots & 0 \\\
\vdots & & \vdots & \ddots & \vdots & & \vdots \\\
0 & \cdots & \sin \theta & \cdots & \cos \theta & \cdots & 0 \\\
\vdots & & \vdots & & \vdots & \ddots & \vdots \\\
0 & \cdots & 0 & \cdots & 0 & \cdots & 1
\end{pmatrix}
$$

Here, $\cos \theta$ and $\sin \theta$ are placed at the intersections of the $i$-th and $j$-th rows and columns. The angle $\theta$ is chosen such that the off-diagonal element $A\_{ij}$ is zeroed out.


## Algorithm

1. **Identify the Largest Off-Diagonal Element**:
   - Find the largest off-diagonal element $A\_{ij}$ (in absolute value) in the matrix $A$.

2. **Compute the Rotation Angle $\theta$**:
   - The angle $\theta$ is chosen to satisfy:
     $$
     \tan(2\theta) = \frac{2A\_{ij}}{A\_{ii} - A\_{jj}}
     $$
   - From this, compute $\cos \theta$ and $\sin \theta$.

3. **Construct the Rotation Matrix $R$**:
   - Build the rotation matrix $R$ using $\cos \theta$ and $\sin \theta$.

4. **Apply the Rotation**:
   - Update the matrix $A$ as:
     $$
     A^{\prime} = R^T A R
     $$
   - This transformation zeroes out $A\_{ij}$ and $A\_{ji}$.

5. **Accumulate the Transformations**:
   - Update the eigenvector matrix $P$ as:
     $$
     P^{\prime} = P R
     $$
   - This accumulates the rotations to form the final eigenvector matrix.

6. **Repeat Until Convergence**:
   - Repeat the process until all off-diagonal elements are smaller than a specified tolerance $ \epsilon$.

---

## An Example

Consider a symmetric matrix $A$:

$$
A = \begin{pmatrix}
4 & 1 & 2 \\\
1 & 3 & 1 \\\
2 & 1 & 5
\end{pmatrix}
$$

### Step 1: Initialize
Start with the matrix $A$ and an identity matrix $P$ to accumulate the rotations:
$$
A = \begin{pmatrix}
4.000000 & 1.000000 & 2.000000 \\\
1.000000 & 3.000000 & 1.000000 \\\
2.000000 & 1.000000 & 5.000000
\end{pmatrix}, \quad
P = \begin{pmatrix}
1.000000 & 0.000000 & 0.000000 \\\
0.000000 & 1.000000 & 0.000000 \\\
0.000000 & 0.000000 & 0.000000
\end{pmatrix}.
$$

### Step 2: Find the Largest Off-Diagonal Element
The largest off-diagonal element in $A$ is $A_{13} = 2.000000$.

### Step 3: Compute the Rotation Parameters
For the rotation in the $(1, 3)$ plane:
- Compute the angle $\theta$:
  $$
  \theta = \frac{1}{2} \arctan\left(\frac{2A_{13}}{A_{11} - A_{33}}\right).
  $$
  Substituting the values:
  $$
  \theta = \frac{1}{2} \arctan\left(\frac{2 \cdot 2.000000}{4.000000 - 5.000000}\right) = \frac{1}{2} \arctan(-4.000000).
  $$
  Using single-precision arithmetic:
  $$
  \theta \approx -0.674741 \, \text{radians}.
  $$

- Compute $c = \cos(\theta)$ and $s = \sin(\theta)$:
  $$
  c \approx 0.780869, \quad s \approx -0.624695.
  $$

### Step 4: Apply the Rotation
Construct the rotation matrix $J$:
$$
J = \begin{pmatrix}
c & 0 & s \\\
0 & 1 & 0 \\\
-s & 0 & c
\end{pmatrix} \approx \begin{pmatrix}
0.780869 & 0.000000 & -0.624695 \\\
0.000000 & 1.000000 & 0.000000 \\\
0.624695 & 0.000000 & 0.780869
\end{pmatrix}.
$$

Update $A$ and $P$:
$$
A = J^T A J, \quad P = P J.
$$

After the rotation:
$$
A \approx \begin{pmatrix}
5.561553 & 0.780869 & 0.000000 \\\
0.780869 & 3.000000 & 0.624695 \\\
0.000000 & 0.624695 & 2.438447
\end{pmatrix},
$$
$$
P \approx \begin{pmatrix}
0.780869 & 0.000000 & -0.624695 \\\
0.000000 & 1.000000 & 0.000000 \\\
0.624695 & 0.000000 & 0.780869
\end{pmatrix}.
$$

### Step 5: Repeat for Other Off-Diagonal Elements
Repeat the process for the next largest off-diagonal element until all off-diagonal elements are sufficiently small (e.g., below a tolerance of $10^{-6}$).

### Step 6: Final Diagonalized Matrix
After convergence, the diagonalized matrix $A$ will be:
$$
A \approx \begin{pmatrix}
6.000000 & 0.000000 & 0.000000 \\\
0.000000 & 3.000000 & 0.000000 \\\
0.000000 & 0.000000 & 3.000000
\end{pmatrix}.
$$

The corresponding eigenvector matrix $P$ will be:
$$
P \approx \begin{pmatrix}
0.707107 & 0.000000 & -0.707107 \\\
0.000000 & 1.000000 & 0.000000 \\\
0.707107 & 0.000000 & 0.707107
\end{pmatrix}.
$$

## Advantages

- **Simplicity**: The algorithm is straightforward to implement.
- **Robustness**: It is guaranteed to converge for symmetric matrices.
- **Accuracy**: Provides highly accurate eigenvalues and eigenvectors.


## Limitations

- **Slow Convergence**: The method requires many iterations for large matrices.
- **Inefficiency for Large Matrices**: Not suitable for very large or sparse matrices.
- **Computational Cost**: Each rotation involves updating the entire matrix, which can be costly for large systems.
