
---
title: Symmetry
math: true
weight: 2
---
The size of the Hilbert space of a Hamiltonian grows exponentially with the number of lattice sites, which limits the size of a quantum model that can be studied. It is, however, possible to reduce the full Hamiltonian matrix into several smaller matrices by block diagonalization with lattice and Hamiltonian symmetries. 

In the following we will use a 4-site spin-$\frac{1}{2}$ chain with periodic boundary to illustrate how to employ these symmetries for block-diagonalizing the full Hamiltonian matrix.

## Hilbert Space

The Hilbert space for a 4-site spin-$\frac{1}{2}$ chain has dimension $2^4 = 16$. A basis for this space can be written as:

$$
\{ |s_1, s_2, s_3, s_4\rangle \}, \quad s_i \in \{\uparrow, \downarrow\}
$$

## Symmetries of the Hamiltonian

The Hamiltonian has several symmetries that can be used to block-diagonalize it, reducing the computational effort:

- **Total magnetization $\(S^z\_{\text{total}}\)$ conservation**:
   The total $S^z$ operator, $S^z\_{\text{total}} = \sum\_{i=1}^4 S_i^z$, commutes with $\mathcal{H}$. Thus, the Hamiltonian is block-diagonal in sectors of fixed $S^z\_{\text{total}}$.

- **Translational symmetry**:
   The Hamiltonian is invariant under translations $T$, where $T|s_1, s_2, s_3, s_4\rangle = |s_4, s_1, s_2, s_3\rangle$. This symmetry can be used to further block-diagonalize $\mathcal{H}$.

- **Spin inversion symmetry**:
   The Hamiltonian is invariant under spin inversion $P$, where $P|s_1, s_2, s_3, s_4\rangle = |-s_1, -s_2, -s_3, -s_4\rangle$. This symmetry can also be exploited.

- **Reflection symmetry**:
   The Hamiltonian is invariant under reflection $R$, where $R|s_1, s_2, s_3, s_4\rangle = |s_4, s_3, s_2, s_1\rangle$.

## Block-Diagonalization

We will use the total magnetization $S^z\_{\text{total}}$ and translational symmetry to reduce the Hilbert space.

### Step 1: Total Magnetization Sectors

The possible values of $S^z\_{\text{total}}$ are $-2, -1, 0, 1, 2$. We can divide the Hilbert space into these sectors:

- $S^z\_{\text{total}} = 2$: Only one state, $|\uparrow, \uparrow, \uparrow, \uparrow\rangle$.
- $S^z\_{\text{total}} = 1$: Four states, e.g., $|\downarrow, \uparrow, \uparrow, \uparrow\rangle$, $|\uparrow, \downarrow, \uparrow, \uparrow\rangle$, etc.
- $S^z\_{\text{total}} = 0$: Six states, e.g., $|\uparrow, \uparrow, \downarrow, \downarrow\rangle$, $|\uparrow, \downarrow, \uparrow, \downarrow\rangle$, etc.
- $S^z\_{\text{total}} = -1$: Four states, e.g., $|\downarrow, \downarrow, \downarrow, \uparrow\rangle$, $|\downarrow, \downarrow, \uparrow, \downarrow\rangle$, etc.
- $S^z\_{\text{total}} = -2$: Only one state, $|\downarrow, \downarrow, \downarrow, \downarrow\rangle$.

### Step 2: Translational Symmetry

Within each $S^z\_{\text{total}}$ sector, we can further block-diagonalize using translational symmetry. The translation operator $T$ has eigenvalues $e^{ik}$, where $k = 0, \pi/2, \pi, 3\pi/2$ (since $T^4 = 1$).

For example, in the $S^z\_{\text{total}} = 0$ sector, the states can be organized into momentum eigenstates. One of the states with total momentum $k$ is given by

$$
|\phi\rangle = \frac{1}{\sqrt{M}} \sum\_{n=0}^3 e^{ikn} T^n |\psi\rangle,
$$

where $|\psi\rangle$ is a representative state in real space and $|\phi\rangle$ is a state in momentum space, which is invariant under the application of $T$. The normalization factor $M=4$ unless the cyclic periodicity of the state is less than 4, which will be discussed later.

### Step 3: Constructing the Hamiltonian Blocks

For each $S^z\_{\text{total}}$ and momentum $k$, we construct the Hamiltonian matrix in the reduced basis. The matrix elements are:

$$
\langle \phi^{\prime} | \mathcal{H} | \phi \rangle = J \sum\_{i=1}^4 \langle \phi^{\prime} | \mathbf{S}\_i \cdot \mathbf{S}\_{i+1} | \phi \rangle
$$

### Step 4: Diagonalization

Finally, we diagonalize each block of the Hamiltonian to obtain the eigenvalues and eigenstates.

### Example: $S^z\_{\text{total}} = 0$ Sector

The $S^z\_{\text{total}} = 0$ sector consists of states with exactly 2 spins up ($\uparrow$) and 2 spins down ($\downarrow$). For a 4-site chain, there are $\binom{4}{2} = 6$ basis states in this sector:

$$
|\psi_1\rangle = |\uparrow, \uparrow, \downarrow, \downarrow\rangle, \quad |\psi_2\rangle = |\uparrow, \downarrow, \uparrow, \downarrow\rangle, \quad |\psi_3\rangle = |\uparrow, \downarrow, \downarrow, \uparrow\rangle, \\\
|\psi_4\rangle = |\downarrow, \uparrow, \uparrow, \downarrow\rangle, \quad |\psi_5\rangle = |\downarrow, \uparrow, \downarrow, \uparrow\rangle, \quad |\psi_6\rangle = |\downarrow, \downarrow, \uparrow, \uparrow\rangle
$$

The full Hamiltonian matrix for the $S^z\_{\text{total}}=0$ sector is given by
$$
\mathcal{H} = J\begin{pmatrix}
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\\
 0.5 & -1 & 0.5 & 0.5 & 0 & 0.5 \\\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\\
 0.5 & 0 & 0.5 & 0.5 & -1 & 0.5 \\\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\\
\end{pmatrix}.
$$
Exact diagonalization of the above matrix gives $E_1=-2J$, $E_2=-J$, $E_3=0$, $E_4=0$, $E_5=0$, and $E_6=J$.

#### Momentum Sectors
The momentum $k$ is given by $k = 0, \pi/2, \pi, 3\pi/2$, as discussed above. The translation operator $T$ acts on a state $|\psi_i\rangle$ as:

$$
T^n |\psi_i\rangle = e^{ikn} |\psi_j\rangle.
$$

For $n=1$, each site spin configuration shifts to the right by 1 lattice spacing. When $n=4$, the state $|\psi_j\rangle=|\psi_i\rangle$. It is possible that a state cyclic periodicity is smaller than $4$. For example, $|\psi_2\rangle$ and $|\psi_5\rangle$ both have periodicity 2. The normalization factor $M=2$ in the above transformation equation.

In the following, we construct translationally symmetric states for each momentum sector.

#### $S^z\_{\text{total}} = 0$ and $k = 0$ Sector
The momentum $k = 0$ sector consists of translationally symmetric states. For $S^z\_{\text{total}} = 0$, there are 2 basis states:

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle + |\psi_4\rangle + |\psi_6\rangle + |\psi_3\rangle \right).
$$

$$
|\phi\_2\rangle = \frac{1}{\sqrt{2}}(|\psi_2\rangle + |\psi_5\rangle).
$$
In the above construction of basis states in momentum space, two **representative states** $|\psi_1\rangle$ and $|\psi_2\rangle$ have been used with the translational operator $T$ to generate the basis states. No other independent states can be generated. Therefore, the dimension of the $S^z\_{\text{total}} = 0$ and $k = 0$ sector is 2.

The Hamiltonian matrix in this sector is given by:
$$
\mathcal{H} = J\begin{pmatrix}
0 & \sqrt{2} \\\
\sqrt{2} & -1 \\\
\end{pmatrix}.
$$
Exact diagonalization of the matrix gives $E_1=-2J$ and $E_2=J$.

#### $S^z\_{\text{total}} = 0$ and $k = 1$ Sector
The momentum $k = 1$ sector corresponds to $k = \frac{\pi}{2}$. For $S^z\_{\text{total}} = 0$, there is only 1 basis state:

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle + i|\psi_4\rangle - |\psi_6\rangle - i|\psi_3\rangle \right).
$$

The Hamiltonian matrix in this sector is:

$$
\mathcal{H} = \begin{pmatrix}
0
\end{pmatrix}.
$$
Therefore, the eigenvalue of the $S^z\_{\text{total}} = 0$ and $k = 1$ Sector is $E_3=0$.

#### $S^z\_{\text{total}} = 0$ and $k = 2$ Sector
The momentum $k = 2$ sector corresponds to $k = \pi$. For $S_z = 0$, there are 2 basis states:

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle - |\psi_4\rangle + |\psi_6\rangle -|\psi_3\rangle \right),
$$
$$
|\phi_2\rangle = \frac{1}{\sqrt{2}} \left( |\psi_2\rangle - |\psi_5\rangle \right),
$$

The Hamiltonian matrix in this sector is:

$$
\mathcal{H} = J \begin{pmatrix}
0 & 0 \\\
0 & -1 \\\
\end{pmatrix},
$$
the exact diagonalization of which gives $E_4=-J$ and $E_5=0$.

#### $S^z\_{\text{total}} = 0$ and $k = 3$ Sector
The momentum $k = 3$ sector corresponds to $k = \frac{3\pi}{2}$. For $S_z = 0$, there is only 1 basis state:

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle - i|\psi_4\rangle - |\psi_6\rangle + i|\psi_3\rangle \right).
$$

The Hamiltonian matrix in this sector is:

$$
\mathcal{H} = \begin{pmatrix}
0
\end{pmatrix}.
$$
The last eigenvalue is then $E_6=0$.

#### Summary
- **$k = 0$**: two state, energies $-2J$ and $J$.
- **$k = 1$**: one state, energy $0$.
- **$k = 2$**: two states,energies $-J$ and $0$.
- **$k = 3$**: one state, energy $0$.

These energy levels are in agreement with those from the direct exact diagonalization of the $6\times 6$ Hamiltonian matrix for the $S^z\_{\text{total}}=0$ sector without the translational symmetry.

After diagonalizing all blocks, we obtain the exact eigenvalues and eigenstates of the 4-site Heisenberg chain with periodic boundary conditions. The use of symmetries reduces the size of the matrices by approximately a factor of $1/N$, where $N$ is the number of lattice sites.

This approach can be generalized to larger systems, although one needs to think of an efficent way in the exact diagonalization code to index and access all states in the Hilbert space. The computational cost still grows exponentially with system size.
