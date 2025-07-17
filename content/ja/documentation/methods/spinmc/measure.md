---
title: Measurements
math: true
weight: 4
---

After the system reaches equilibrium, we can measure physical quantities, such as, energy, magnetization, and various susceptibilities. However, measuring physical quantities accurately requires careful consideration of autocorrelation and the generation of independent samples. Autocorrelation refers to the correlation between measurements taken at different Monte Carlo steps, which can lead to biased estimates and underestimated errors. Generating independent samples ensures that the measurements are statistically meaningful.

## Autocorrelation of Physical Quantities

### 1. **Autocorrelation Function**
The autocorrelation function $C_A(t)$ measures the correlation between measurements of a quantity $A$ separated by a time interval $t$ (in Monte Carlo steps):
$$
C_A(t) = \frac{\langle A_k A_{k+t} \rangle - \langle A_k \rangle^2}{\langle A_k^2 \rangle - \langle A_k \rangle^2},
$$
where $\langle A_k A_{k+t} \rangle$ is the average of the product of measurements separated by $t$ steps.

### 2. **Autocorrelation Time**
The autocorrelation time $\tau_A$ characterizes how quickly the autocorrelation function decays. It is defined as:
$$
\tau_A = \sum_{t=1}^{\infty} C_A(t).
$$
In practice, $\tau_A$ is estimated by fitting $C_A(t)$ to an exponential decay:
$$
C_A(t) \sim e^{-t / \tau_A}.
$$

### 3. **Effect of Autocorrelation**
Autocorrelation reduces the effective number of independent samples, leading to underestimated statistical errors. To account for this, the error in the measured quantity $A$ is corrected by:
$$
\sigma_A = \sqrt{\frac{\text{Var}(A)}{N_{\text{eff}}}},
$$
where $\text{Var}(A)$ is the variance of $A$, and $N_{\text{eff}}$ is the effective number of independent samples:
- $\text{Var}(A)$ is the **variance** of $A$, defined as:
  $$
  \text{Var}(A) = \langle A^2 \rangle - \langle A \rangle^2,
  $$
  where $\langle A^2 \rangle$ is the average of the squared measurements, and $\langle A \rangle$ is the average of the measurements.
- $N_{\text{eff}}$ is the effective number of independent samples:
  $$
  N_{\text{eff}} = \frac{N_{\text{meas}}}{1 + 2 \tau_A}.
  $$
  
## Generating Independent Samples

### 1. Spacing Measurements
To reduce autocorrelation, measurements should be spaced by at least the autocorrelation time $\tau_A$. This ensures that consecutive measurements are approximately independent. For example, if $\tau_A = 10$, measurements should be taken every 10 Monte Carlo steps.

### 2. Blocking Method
The blocking method is a technique to generate independent samples by grouping measurements into blocks. Each block should be larger than the autocorrelation time. The average of each block is treated as an independent sample, and the variance of these block averages is used to estimate the error.

### 3. Parallel Tempering
For systems with slow dynamics, parallel tempering can be used to generate independent samples. This involves running multiple simulations at different temperatures and periodically swapping configurations between them. The swaps help the system explore configuration space more efficiently.

## Physical Quantities

Some example physical quantities are shown below for Ising model. For different models, different quantities would need to be considered. 

### Magnetization:
  $$
  M = \frac{1}{N} \sum_i s_i^z,
  $$
  where $N$ is the total number of spins.
  
### Energy:
  $$
  E = -J \sum_{\langle i,j \rangle} s_i^z s_j^z - h \sum_i s_i^z.
  $$
  
### Magnetic susceptibility: 

The magnetic susceptibility $\chi$ measures the response of the system's magnetization to an external magnetic field. It is defined as:
$$
\chi = \frac{\partial \langle M \rangle}{\partial h},
$$
where $\langle M \rangle$ is the average magnetization, and $h$ is the external magnetic field. In Monte Carlo simulations, $\chi$ is computed from the fluctuations in the magnetization $M$ using the formula:
$$
\chi = \frac{\beta}{N} \left( \langle M^2 \rangle - \langle M \rangle^2 \right),
$$
where:
- $\beta = 1/(k_B T)$ is the inverse temperature,
- $N$ is the total number of spins,
- $\langle M \rangle$ is the average magnetization,
- $\langle M^2 \rangle$ is the average of the squared magnetization.

### Specific Heat:

The specific heat $C$ measures the system's heat capacity, or how much energy is required to change its temperature. It is defined as:
$$
C = \frac{\partial \langle E \rangle}{\partial T},
$$
where $\langle E \rangle$ is the average energy of the system.

In Monte Carlo simulations, $C$ is computed from the fluctuations in the energy $E$ using the formula:
$$
C = \frac{\beta^2}{N} \left( \langle E^2 \rangle - \langle E \rangle^2 \right),
$$
where:
- $\beta = 1/(k_B T)$ is the inverse temperature,
- $N$ is the total number of spins,
- $\langle E \rangle$ is the average energy,
- $\langle E^2 \rangle$ is the average of the squared energy.
