---
title: Heisenberg Model
math: true
weight: 3
---

## Introduction

The **Heisenberg model** is one of the most fundamental and widely studied models in condensed matter physics and quantum magnetism. It was introduced by Werner Heisenberg in 1928 to describe the magnetic properties of materials, particularly the exchange interactions between localized spins in a crystal lattice. The model has since been used for understanding magnetic ordering, spin dynamics, and quantum phase transitions in a variety of systems.

The Hamiltonian of the Heisenberg model is given by:

$$
H = J \sum\_{\langle i,j \rangle} \mathbf{S}\_i \cdot \mathbf{S}\_j,
$$

where
- $\mathbf{S}\_i$: Spin vector at site $i$.
- $J$: Exchange interaction strength. $J \< 0$ for ferromagnetic interactions (spins favor alignment), and $J > 0$ for antiferromagnetic interactions (spins favor anti-alignment).
- $\langle i,j \rangle$: Sum over nearest-neighbor pairs.

For quantum spins, $\mathbf{S}\_i$ are spin operators obeying the commutation relations of angular momentum. For classical spins, $\mathbf{S}\_i$ are unit vectors in 3D space.

## Phenomena

The Heisenberg model has been instrumental in understanding a wide range of magnetic phenomena, including:
1. **Ferromagnetism**: Alignment of spins in the same direction, leading to a macroscopic magnetic moment.
2. **Antiferromagnetism**: Alternating alignment of spins, resulting in no net magnetization but strong local ordering.
3. **Spin waves and magnons**: Collective excitations of spins that propagate through the lattice.
4. **Quantum phase transitions**: Transitions between different magnetic ground states driven by quantum fluctuations.

The model is highly versatile and can be extended to include additional terms, such as anisotropy, external magnetic fields, or longer-range interactions, to describe more complex magnetic systems.

## Methods

The Heisenberg model can be solved by various numerical methods. Below is a summary of some key numerical techniques:

| Method                     | Strengths                                                                 | Limitations                                                                 | Applications                                                                 |
|----------------------------|---------------------------------------------------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **ED**  | Exact results for small systems; Captures full quantum correlations. | Limited to small systems | Small spin chains or clusters; Benchmarking other methods.            |
| **QMC** | Handles larger systems; Finite-T       | Sign problem for frustrated or fermionic systems.                         | Phase diagrams; Finite-temperature properties.                  |
| **DMRG** | Highly accurate for 1D systems; Efficient for low-entanglement states. | Less efficient for 2D/3D or highly entangled systems.                        | Ground state; Low-energy excitations.                     |
| **DMFT** | Captures local correlations. | Neglects non-local correlations.                   | Mott transition; Spectral properties                     |

---
