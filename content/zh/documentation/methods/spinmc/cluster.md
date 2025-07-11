---
title: Cluster Updates
math: true
weight: 3
---

Near the critical temperature $T_c$ of a system, the system exhibits long-range correlations, and local update methods become inefficient due to critical slowing down. Local update propositions are always rejected during the simulation, and the system seems to be trapped in a specific state configuration. Cluster update algorithms address this issue by flipping large clusters of spins in a single step, allowing the system to explore configuration space more effectively.

## Wolff Algorithm

The Wolff algorithm is a cluster update method designed to overcome critical slowing down in the Ising model. It builds clusters of spins based on their alignment and flips them collectively, ensuring efficient sampling near the critical temperature.

### Key Steps of the Wolff Algorithm:
1. **Choose a Seed Spin**:
   - Randomly select a seed spin $s_i^z$ from the lattice.

2. **Build the Cluster**:
   - For each neighbor $s_j^z$ of the seed spin, add it to the cluster with probability:
     $$
     P_{\text{add}} = 1 - e^{-2 \beta J},
     $$
     if $s_j^z = s_i^z$. This probability depends on the temperature and the interaction strength $J$.

3. **Flip the Cluster**:
   - Once the cluster is built, flip all spins in the cluster (i.e., $s_i^z \to -s_i^z$ for all spins in the cluster).

4. **Repeat**:
   - Repeat the process for many Monte Carlo steps to ensure proper sampling of the configuration space.

### Advantages of the Wolff Algorithm:
- **Efficiency**: The Wolff algorithm significantly reduces critical slowing down by flipping large clusters of spins simultaneously.
- **Detailed Balance**: The algorithm satisfies detailed balance, ensuring that the system evolves toward the correct equilibrium distribution.
- **No Tuning**: Unlike the Metropolis-Hastings algorithm, the Wolff algorithm does not require tuning of parameters like the step size.


## Wang-Landau Algorithm

The Wang-Landau algorithm is a Monte Carlo method that directly estimates the density of states $g(E)$ of a system, enabling the calculation of thermodynamic quantities over a wide range of energies and temperatures. It is particularly useful for systems with complex energy landscapes.

### Key Steps of the Wang-Landau Algorithm:
1. **Initialize the Density of States**:
   - Start with a rough estimate of the density of states $g(E)$, typically set to $1$ for all energies.

2. **Perform Random Walks in Energy Space**:
   - Use a Monte Carlo process (e.g., Metropolis or Wolff updates) to explore the energy space. Accept moves with probability:
     $$
     P_{E_1 \to E_2} = \min\left(1, \frac{g(E_1)}{g(E_2)}\right).
     $$

3. **Update the Density of States**:
   - After each move, update the density of states:
     $$
     g(E) \to g(E) \cdot f,
     $$
     where $f > 1$ is a modification factor (initially $f = e$).

4. **Refine the Estimate**:
   - Repeat the process, gradually reducing the modification factor $f$ (e.g., $f \to \sqrt{f}$) until $g(E)$ converges to the true density of states.

5. **Calculate Thermodynamic Quantities**:
   - Once $g(E)$ is known, thermodynamic quantities like the partition function, free energy, and specific heat can be calculated.

### Advantages of the Wang-Landau Algorithm:
- **Direct Estimation of $g(E)$**: The algorithm provides a direct way to compute the density of states, enabling the study of thermodynamic properties over a wide range of temperatures.
- **Efficiency**: The Wang-Landau algorithm is particularly effective for systems with complex energy landscapes, where traditional methods may struggle.
- **No Prior Knowledge Required**: The algorithm does not require prior knowledge of the system's energy distribution.

