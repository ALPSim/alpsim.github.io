
---
title: Introduction
math: true
weight: 1
---
Exact diagonalization (ED) is a numerical technique used to solve quantum many-body problems by directly diagonalizing the Hamiltonian matrix of a system. This method provides exact eigenstates and eigenvalues, making it a powerful tool for studying small to moderately sized quantum systems. A classic example of its application is the Heisenberg model, which describes interacting spins on a lattice and is widely used to understand magnetic phenomena in condensed matter physics.

## The Heisenberg Model as a Case Study

The Heisenberg model is defined by the Hamiltonian:

$$
\mathcal{H} = J \sum\_{\langle i,j \rangle} \mathbf{S}\_i \cdot \mathbf{S}\_j,
$$

where $\mathbf{S}\_i$ is the spin-1/2 operator at site $i$, $J$ is the exchange interaction (ferromagnetic for $J \lt 0$ and antiferromagnetic for $J \gt 0$), and the sum runs over nearest-neighbor pairs $\langle i,j \rangle$. For simplicity, we consider a 1D chain with periodic boundary conditions.

### Example: 4-Site 1D Heisenberg Chain

Let’s study a 4-site 1D Heisenberg chain with periodic boundary conditions. The Hamiltonian for this system is:

$$
\mathcal{H} = J \left( \mathbf{S}\_1 \cdot \mathbf{S}\_2 + \mathbf{S}\_2 \cdot \mathbf{S}\_3 + \mathbf{S}\_3 \cdot \mathbf{S}\_4 + \mathbf{S}\_4 \cdot \mathbf{S}\_1 \right).
$$

The spin-1/2 operators $\mathbf{S}\_i = (S_i^x, S_i^y, S_i^z)$ can be expressed in terms of Pauli matrices $\boldsymbol{\sigma}\_i$ as $\mathbf{S}\_i = \frac{1}{2} \boldsymbol{\sigma}\_i$. The dot product $\mathbf{S}\_i \cdot \mathbf{S}\_j$ can be written as:

$$
\mathbf{S}\_i \cdot \mathbf{S}\_j = S_i^x S_j^x + S_i^y S_j^y + S_i^z S_j^z.
$$

### Basis States

For a 4-site system with spin-1/2 particles, the Hilbert space has $2^4 = 16$ basis states. These states are product states of individual spin configurations, denoted as $| \sigma_1 \sigma_2 \sigma_3 \sigma_4 \rangle$, where $\sigma_i = \uparrow$ or $\downarrow$. For example, one basis state is $| \uparrow \uparrow \downarrow \downarrow \rangle$.

The basis states are eigen states of $S_i^z$ operators. When it is applied to the $i$'th site, it gives
$$
S\_i^z|\uparrow\rangle = \frac{1}{2}|\uparrow\rangle,
$$
and
$$
S\_i^z|\downarrow\rangle = -\frac{1}{2}|\downarrow\rangle.
$$
To see the result of applying Hamiltonian to the basis states, we need to express the off-diagonal operators, i.e., $S_i^x$ and $S_i^y$ in terms of raising $S^{\dagger}$ and lowering $S^{-}$ operators:
$$
S\_i^x=\frac{1}{2}(S_i^{\dagger}+S_i^{-}),
$$
$$
S_i^y=\frac{1}{2i}(S_i^{\dagger}-S_i^{-}),
$$
which act on the basis states in the following way:
$$
S_i^{\dagger}|s\rangle = \sqrt{S(S+1)-s(s+1)}|s+1\rangle,
$$
$$
S_i^{-}|s\rangle = \sqrt{S(S+1)-s(s-1)}|s-1\rangle,
$$
where $S=1/2$ and $s=-1/2, 1/2$.
With the above transformation, the Hamiltonian element becomes
$$
\mathbf{S}\_i \cdot \mathbf{S}\_j = \frac{1}{2}(S_i^{\dagger}S_j^{-}+S_i^{-}S_j^{\dagger})+S\_i^zS\_j^z.
$$

### Hamiltonian Matrix

To construct the Hamiltonian matrix, we evaluate the action of $\mathcal{H}$ on each basis state. For instance, consider the term $\mathbf{S}\_1 \cdot \mathbf{S}\_2$:

$$
\mathbf{S}\_1 \cdot \mathbf{S}\_2 = \frac{1}{2}(S_1^{\dagger}S_2^{-}+S_1^{-}S_2^{\dagger})+S\_1^zS\_2^z.
$$

This term flips spins at sites 1 and 2 if they are antiparallel and contributes a factor of $\frac{1}{4}$ if they are parallel. For example:

$$
\mathbf{S}\_1 \cdot \mathbf{S}\_2 | \uparrow \downarrow \uparrow \uparrow \rangle = \frac{1}{4} \left( | \downarrow \uparrow \uparrow \uparrow \rangle - | \uparrow \downarrow \uparrow \uparrow \rangle \right).
$$

Repeating this process for all terms in $\mathcal{H}$ and all basis states, we construct the $16 \times 16$ Hamiltonian matrix. For brevity, we do not write the full matrix here, but it can be systematically built using the above rules.

## Diagonalization

Once the Hamiltonian matrix is constructed, it is diagonalized numerically to obtain the eigenstates and eigenvalues. These results provide insights into the ground state energy, low-lying excitations, and magnetic properties of the system. For example, for the antiferromagnetic Heisenberg chain ($J > 0$), ED reveals a singlet ground state with no long-range order, consistent with the Bethe ansatz solution for larger systems.

### Scaling with Lattice Size

For the 1D Heisenberg model, the size of the Hamiltonian matrix grows exponentially with the number of lattice sites, making ED computationally challenging for large systems. Understanding how the matrix size scales with lattice size is crucial for assessing the feasibility of numerical methods like sparse and full diagonalization.

For a system with $N$ sites, each site can be in one of two states: spin-up ($\uparrow$) or spin-down ($\downarrow$). The Hilbert space dimension, which determines the size of the Hamiltonian matrix, is given by:

$$
\text{Dimension of Hilbert space} = 2^N.
$$

For example:
- For $N = 4$, the Hilbert space has $2^4 = 16$ states.
- For $N = 10$, the Hilbert space has $2^{10} = 1024$ states.
- For $N = 20$, the Hilbert space has $2^{20} = 1,048,576$ states.

This exponential growth means that the Hamiltonian matrix size quickly becomes unmanageable as $N$ increases. For instance, a 20-site system requires diagonalizing a $1,048,576 \times 1,048,576$ matrix, which is computationally intensive.

### Sparse vs. Full Diagonalization

The Hamiltonian matrix of the 1D Heisenberg model is typically sparse, meaning most of its elements are zero. This sparsity arises because the Hamiltonian only connects states that differ by a single spin flip (nearest-neighbor interactions). For example, in a 4-site system, the Hamiltonian matrix might look like this (simplified):

$$
\mathcal{H} = \begin{pmatrix}
E_1 & J/2 & 0 & \cdots \\\
J/2 & E_2 & J/2 & \cdots \\\
0 & J/2 & E_3 & \cdots \\\
\vdots & \vdots & \vdots & \ddots
\end{pmatrix},
$$

where $E_i$ are diagonal elements (energies of basis states), and $J/2$ represents off-diagonal elements due to spin-flip terms.

#### Full Diagonalization
Full diagonalization involves computing all eigenvalues and eigenvectors of the Hamiltonian matrix. While this provides complete information about the system, it is computationally expensive for large matrices due to the $O(M^3)$ scaling, where $M$ is the matrix size. For example, full diagonalization of a $10^6 \times 10^6$ matrix is impractical on most computers.

#### Sparse Diagonalization
Sparse diagonalization exploits the sparsity of the Hamiltonian matrix to compute only a subset of eigenvalues and eigenvectors, typically the lowest few eigenstates (e.g., the ground state and low-lying excitations). Algorithms like the Lanczos method or Arnoldi iteration are commonly used for sparse diagonalization. These methods scale much better with system size, often requiring only $O(M)$ memory and $O(M^2)$ time for a few eigenstates, making them suitable for larger systems.

#### Comparisons
The size of the Hamiltonian matrix in the 1D Heisenberg model grows exponentially with the number of lattice sites, posing a significant computational challenge. While full diagonalization provides complete information about the system, it is limited to small lattices due to its high computational cost. Sparse diagonalization, on the other hand, leverages the sparsity of the Hamiltonian to study larger systems by focusing on the most relevant eigenstates. This trade-off between full and sparse diagonalization highlights the importance of choosing the right numerical approach based on the system size and the desired physical insights.
