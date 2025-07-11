---
title: Hubbard Model
math: true
weight: 5
---

## Introduction

The **Hubbard model** was first introduced by John Hubbard in 1963 to describe the behavior of electrons in a lattice, particularly in transition metal oxides and other materials with strong electron-electron interactions. It was later extended to describe any Fermions with on-site interactions on a lattice. If only one energy band is used to form the lattice model, then each lattice site can accommodate at most $2s+1$ Fermions with spin $s$.

The one-band Hubbard model with spin-$\frac{1}{2}$ Fermions is given by the following Hamiltonian

$$
H = -t \sum\_{\langle i,j \rangle, \sigma} \left( c\_{i,\sigma}^\dagger c\_{j,\sigma} + \text{h.c.} \right) + U \sum_i n\_{i,\uparrow} n\_{i,\downarrow},
$$

where 

- $c\_{i,\sigma}^\dagger$ and $c\_{i,\sigma}$ are creation and annihilation operators for a fermion with spin $\sigma$ (up $\uparrow$ or down $\downarrow$) at site $i$ and $\text{h.c.}$ represents Hermitian Conjugate. 
- $t$ is hopping amplitude between neighboring sites $\langle i,j \rangle$.
- $U$ is on-site interaction energy, with $U > 0$ corresponding to repulsive interactions and $U \< 0$ corresponding to attractive interactions.
- $n\_{i,\sigma} = c\_{i,\sigma}^\dagger c\_{i,\sigma}$ is number operator for fermions with spin $\sigma$ at site $i$.

The first term of the Hamiltonian describes the kinetic energy of the many-body system with particles hopping between neighboring sites. The second term represents the potential energy of the system. The competition between the kinetic energy, potential energy, as well as the temperature can lead to interesting properties.

## Phenomena

1. **Metal-Insulator Transition**:
   - The Fermi-Hubbard model exhibits a metal-insulator transition known as the **Mott transition**. At half-filling (one electron per site), for large $U/t$, the system becomes a Mott insulator, where electrons are localized due to strong repulsion, preventing conduction.
   - For small $U/t$, the system behaves as a metal, with electrons freely hopping across the lattice.

2. **Magnetism**:
   - In the Mott insulating phase, the Fermi-Hubbard model can exhibit magnetic ordering. At half-filling and large $U/t$, the effective low-energy Hamiltonian reduces to the **Heisenberg model**, which describes antiferromagnetic interactions between spins.

3. **Superconductivity**:
   - For attractive interactions $U \< 0$, the model can exhibit superconductivity, where fermions pair up to form Cooper pairs.

4. **Doping and Phase Separation**:
   - When the system is doped away from half-filling (e.g., by adding or removing electrons), rich phases such as stripe order, charge density waves, and high-temperature superconductivity can emerge.


## Methods

Various numerical methods for solving Fermi-Hubbard model are listed in the following table:

| Method                  | Strengths                              | Limitations                          | Applications                          |
|-------------------------|----------------------------------------|--------------------------------------|---------------------------------------|
| **ED**   | Exact results for small systems; Captures full quantum correlations.        | Limited to small systems.             | Small-system properties; Benchmarking other methods.               |
| **QMC**     | Handles larger systems; Finite-T.       | Sign problem for fermions.            | Phase diagrams; Finite-temperature properties.        |
| **DMRG**                    | Highly accurate for 1D systems; Efficient for low-entanglement states.         | Less efficient for 2D/3D or highly entangled systems.             | Ground state; Low-energy excitations.  |
| **DMFT**                    | Captures local correlations.            | Neglects non-local correlations.      | Mott transition; Spectral properties  |
