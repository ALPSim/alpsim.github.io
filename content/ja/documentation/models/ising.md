---
title: Ising Model
math: true
weight: 1
---

## Introduction

The **Ising model** is one of the most fundamental and widely studied models in statistical mechanics and condensed matter physics. It was first proposed by Wilhelm Lenz in 1920 and later solved in one dimension by his student Ernst Ising in 1925. The model provides a simplified description of phase transitions and critical phenomena in magnetic systems.

$$
\mathcal{H} = J \sum\_{\langle i,j \rangle} S_i^z S_j^z + h \sum_i S_i^z
$$

where:
- $S_i^z$ and $S_j^z$ are up ($+1$) or down ($-1$) spins at lattice sites $i$ and $j$,
- $J$ is the interaction strength between neighboring spins (antiferromagnetic if $J > 0$, ferromagnetic if $J \< 0$),
- $h$ is an external magnetic field,
- The sum $\langle i,j \rangle$ runs over nearest-neighbor pairs of spins.


## Phenomena
The Ising model has been applied to a wide range of physical systems and phenomena.

- **Ferromagnetism**: For $J \< 0$, spins tend to align in the same direction, leading to spontaneous magnetization at low temperatures.
- **Antiferromagnetism**: For $J \> 0$, spins tend to align in alternating directions, resulting in no net magnetization but strong local ordering.
- **Phase Transitions**: The Ising model exhibits a phase transition from a disordered (paramagnetic) phase at high temperatures to an ordered (ferromagnetic or antiferromagnetic) phase at low temperatures.

## Methods

The Ising model without the magnetic field can be exactly solved in 1D and 2D, but various numerical methods have also been developed to study its properties. Below is a summary of key numerical techniques related to ALPS:

| Method                     | Strengths                                                                 | Limitations                                                                 | Applications                                                                 |
|----------------------------|---------------------------------------------------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **MC** | Works well for large systems; Can handle finite temperatures.       | Slow convergence near critical points; Requires careful sampling.    | Phase transitions; Critical phenomena; Finite-temperature properties. |
| **Cluster Algorithms (e.g., Wolff, Swendsen-Wang)** | Reduces critical slowing down; Efficient near critical points.      | Complex implementation; Limited to specific models.                  | Critical phenomena; Large-scale simulations.                         |
---
