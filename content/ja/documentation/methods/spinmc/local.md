---
title: Local Updates
math: true
weight: 2
---

In a Monte Carlo simulation, system states are usually sampled through local updates, where individual site configuration is updated one at a time based on its local environment. We will use Ising model to illustrate how the sampling of states is achieved. 

The Hamiltonian of the Ising model is given by the Hamiltonian:
$$
\mathcal{H} = -J \sum_{\langle i,j \rangle} s_i^z s_j^z - h \sum_i s_i^z,
$$
where:
- $J$ is the interaction strength between neighboring spins,
- $\langle i,j \rangle$ denotes a sum over nearest-neighbor pairs,
- $s_i^z=\pm 1$ is the spin at site $i$,
- $h$ is an external magnetic field.

## Steps of a Monte Carlo Simulation

### 1. Initialize the System
- Start with a lattice of spins (e.g., a 2D square lattice of size $L \times L$).
- Initialize the spins randomly (e.g., $s_i^z = \pm 1$ with equal probability) or in a specific configuration (e.g., all spins up).

### 2. Perform Local Updates
Local updates are performed using either the Metropolis-Hastings algorithm or the heat-bath algorithm.

#### Metropolis-Hastings Local Update
For each spin $s_i^z$:
1. **Propose a flip**: Flip the spin $s_i^z$ to its opposite value, $s_i^z \to -s_i^z$.
2. **Calculate the energy change**: Compute the change in energy $\Delta E$ due to the proposed flip. For the Ising model, the energy change depends only on the spin $s_i^z$ and its nearest neighbors:
   $$
   \Delta E = 2 J s_i^z \sum_{j \in \text{neighbors}(i)} s_j^z + 2 h s_i^z.
   $$
   Here, the sum is over the nearest neighbors of spin $s_i^z$.
3. **Accept or reject the flip**:
     $$
     P_{\text{accept}} = \text{min}(1, e^{-\beta \Delta E}),
     $$
     where $\beta = 1/(k_B T)$ is the inverse temperature. This means
   - If $\Delta E \leq 0$, always accept the flip.
   - If $\Delta E > 0$, accept the flip with probability: $e^{-\beta \Delta E}$.
   - If the flip is rejected, leave the spin unchanged.

#### Heat-Bath Local Update
Alternatively, the heat-bath algorithm can be used for local updates. For each spin $s_i^z$:
1. **Compute the local field**: The local field acting on spin $s_i^z$ is given by:
   $$
   h_i = -J \sum_{j \in \text{neighbors}(i)} s_j^z - h.
   $$
2. **Sample the new spin state**: The spin $s_i^z$ is updated to $+1$ or $-1$ with probabilities:
   $$
   P_{ -1 \to +1} = \frac{e^{-\beta h_i}}{e^{-\beta h_i} + e^{\beta h_i}},
   $$
   $$
   P_{ +1 \to -1} = \frac{e^{\beta h_i}}{e^{-\beta h_i} + e^{\beta h_i}}.
   $$
   These probabilities ensure that the spin is sampled from its equilibrium distribution given its local environment.

### 3. Repeat for Many Sweeps
- A sweep consists of attempting to update every spin in the lattice once.
- Repeat the local update process for many sweeps to allow the system to reach equilibrium and to collect statistics.

