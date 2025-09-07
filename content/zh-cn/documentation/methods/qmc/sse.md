
---
title: Stochastic Series Expansion (SSE)
math: true
weight: 4
---

The Stochastic Series Expansion (SSE) method is a finite-temperature QMC technique that expands the partition function $Z$ of the quantum system in a power series of the Hamiltonian. It was originally applied to the Heisenberg model [^Sandvik99], but can be easily extended to other quantum models, such as Bose-Hubbard model.

The partition function of a quantum model is given by:

$$
Z = \text{Tr}(e^{-\beta \mathcal{H}}),
$$

where $\beta = 1/(k_B T)$ is the inverse temperature and $\mathcal{H}$ is the Hamiltonian. The key idea of SSE is to express the exponential operator $e^{-\beta \mathcal{H}}$ as a Taylor series:

$$
e^{-\beta \mathcal{H}} = \sum\_{n=0}^\infty \frac{(-\beta)^n}{n!} \mathcal{H}^n.
$$

By inserting a complete set of basis states $\{|\alpha\rangle\}$, the partition function can be rewritten as:

$$
Z = \sum\_{\alpha} \sum\_{n=0}^\infty \frac{(-\beta)^n}{n!} \langle \alpha | \mathcal{H}^n | \alpha \rangle.
$$

Depending on the temperatures, the SSE expansion order in the simulation will never exceed a finite order $N$. The SSE method then truncates this expansion series at order $N$ and samples the terms stochastically. The Hamiltonian $\mathcal{H}$ is typically decomposed into a sum of elementary interaction terms $H\_{i,j}$, such as bond operators for the Heisenberg model:

$$
\mathcal{H} = -\sum\_{i,j} H\_{i,j}.
$$

Each term $H\_{i,j}$ acts on a pair of sites and can be represented in a suitable basis. The SSE algorithm then samples configurations consisting of a sequence of these operators.

For the Heisenberg model, the bond operator $H_{i,j}$ can be expressed as:

$$
H_{i,j} = J \left( S_i^z S_j^z + \frac{1}{2} (S_i^+ S_j^- + S_i^- S_j^+) \right),
$$

where $S_i^z$ is the $z$-component of the spin operator, and $S_i^+$ and $S_i^-$ are the spin raising and lowering operators, respectively. The first term, $S_i^z S_j^z$, represents the **diagonal part** of the interaction, while the second term, $\frac{1}{2} (S_i^+ S_j^- + S_i^- S_j^+)$, represents the **off-diagonal part**.

### Diagonal and Off-Diagonal Matrix Elements

#### Heisenberg Model
In the SSE framework, the Heisenberg Hamiltonian is expressed in terms of diagonal and off-diagonal operators. For a given basis state $|\alpha\rangle$, the matrix elements of the bond operator $H\_{i,j}$ are:

1. **Diagonal Matrix Elements**:
   These correspond to the $S_i^z S_j^z$ term and are given by:
   $$
   \langle \alpha | S_i^z S_j^z | \alpha \rangle = S_i^z S_j^z,
   $$
   where $S_i^z$ and $S_j^z$ are the $z$-components of the spins in the state $|\alpha\rangle$.

2. **Off-Diagonal Matrix Elements**:
   These correspond to the spin-flip terms $S_i^+ S_j^-$ and $S_i^- S_j^+$. For a state $|\alpha\rangle$, the off-diagonal matrix elements are:
   $$
   \langle \alpha | S_i^+ S_j^- | \alpha^{\prime} \rangle = \frac{1}{2} \delta_{\alpha, \alpha^{\prime} \text{ with } S_i^+ S_j^-},
   $$
   and
   $$
   \langle \alpha | S_i^- S_j^+ | \alpha^{\prime} \rangle = \frac{1}{2} \delta_{\alpha, \alpha' \text{ with } S_i^- S_j^+},
   $$
   where $\alpha$ and $\alpha^{\prime}$ is the state obtained by flipping the spins at sites $i$ and $j$.
   
#### Bose-Hubbard Model
The Bose-Hubbard model describes bosons on a lattice with on-site interactions and nearest-neighbor hopping. The Hamiltonian is given by:

$$
H = -t \sum_{\langle i,j \rangle} (b_i^\dagger b_j + \text{h.c.}) + \frac{U}{2} \sum_i n_i (n_i - 1) - \mu \sum_i n_i,
$$

where:
- $t$ is the hopping amplitude,
- $U$ is the on-site interaction strength,
- $\mu$ is the chemical potential,
- $b_i^\dagger$ and $b_i$ are the bosonic creation and annihilation operators at site $i$,
- $n_i = b_i^\dagger b_i$ is the number operator,
- $\langle i,j \rangle$ denotes nearest-neighbor pairs.

The Bose-Hubbard Hamiltonian $\mathcal{H}$ is decomposed into a set of bond operators $H\_{i,j}$ (for hopping) and $H_i$ (for on-site interactions):
$$
H = -\sum_b H_b,
$$
where $b$ labels the bonds or sites. For the Bose-Hubbard model:
- Hopping terms: $H_{i,j} = t (b_i^\dagger b_j + b_j^\dagger b_i)$,
- On-site terms: $H_i = \frac{U}{2} n_i (n_i - 1) - \mu n_i$.

### Insertion of Basis States

In the SSE method, the partition function is expanded in terms of basis states $|\alpha\rangle$ and operator sequences. A typical configuration in the SSE expansion consists of:

1. A basis state $|\alpha_0\rangle$ (the initial state).
2. A sequence of operators $H\_{i,j}$ acting on the state.

The partition function can then be written as:

$$
Z = \sum_{\alpha_0} \sum\_{n=0}^N \frac{(-\beta)^n}{n!} \sum_{\{H_{i,j}\}} \langle \alpha_0 | H_{i_1,j_1} H_{i_2,j_2} \cdots H_{i_n,j_n} | \alpha_0 \rangle,
$$

where $N$ is the cutoff of the expansion order and $\{H\_{i,j}\}$ represents a sequence of $n$ operators. The matrix elements of the operators are evaluated in the basis states, and the sequence of operators must satisfy the condition that the final state matches the initial state $|\alpha_0\rangle$.

### Steps in the SSE Algorithm

1. **Initialization**: Start with an initial state $|\alpha\rangle$ and an empty operator sequence.
2. **Operator Insertion**: Propose to insert or remove diagonal operators $H\_{i,j}$ into the sequence, updating the state $|\alpha\rangle$ accordingly.
3. **Diagonal Updates**: Ensure that the sequence of operators is consistent with the Hamiltonian and the basis states.
4. **Loop Updates**: Perform non-local updates to improve sampling efficiency, often using cluster or loop algorithms tailored to the spin or other bosonic models [^Syljuasen02] [^pollet04] [^Alet05].
5. **Measurement**: Compute physical quantities, such as energy, magnetization, and correlation functions, by averaging over the sampled configurations.

The SSE method is particularly advantageous for the Heisenberg model because it avoids the sign problem for certain geometries (e.g., bipartite lattices) and provides efficient sampling of both low-temperature and high-temperature regimes. It has been successfully applied to study a wide range of phenomena, including quantum phase transitions, spin dynamics, and Bosonic systems.


[^Sandvik99]: Sandvik, A. W., "Stochastic Series Expansion Method with Operator-Loop Update", *Physical Review B*, 59, R14157-R14160 (1999).
[^Syljuasen02]: Syljuåsen, O. F. and Sandvik, A. W., "Quantum Monte Carlo with Directed Loops", *Physical Review E*, 66, 046701 (2002).
[^pollet04]: Pollet, L., et al., "Optimal Monte Carlo Updating", *Physical Review E*, 70, 056705 (2004).
[^Alet05]: Alet, F., et al., "Generalized Directed Loop Method for Quantum Monte Carlo Simulations", *Physical Review E*, 71, 036706 (2005).
