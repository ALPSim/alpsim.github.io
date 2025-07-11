---
title: Transverse Field Ising Model
description: "Introduction to Transverse Field Ising Model"
toc: true
math: true
weight: 2
cascade:
    type: docs
---

## Introduction

The **transverse field Ising model (TFIM)** is a generalization of the classical Ising model that incorporates quantum mechanical effects. It is one of the most important models in quantum statistical mechanics and condensed matter physics, providing insights into quantum phase transitions, critical phenomena, and the interplay between classical and quantum fluctuations.

The transverse field quantum Ising model is given by the Hamiltonian

$$
H=J\_{z} \sum\_{\langle i,j \rangle} S_i^z S_j^z + \Gamma \sum_i S_i^x
$$

Here, the first sum runs over pairs of nearest neighbours. $\Gamma$ is referred to as transverse field; the system becomes critical for $\Gamma/J_z=\frac{1}{2}$. For $\Gamma=0$, the ground state is antiferromagnetic for $J_z\gt 0$ and ferromagnetic for $J_z \lt 0$. 

## Phenomena
Some interesting phenomena about the model are listed below.

- **Quantum Phase Transitions**
    + The TFIM exhibits a **quantum phase transition** at zero temperature, driven by the strength of the transverse field $\Gamma$.
    	+ For $\Gamma \lt \Gamma_c$, the system is in an **ordered phase** (spontaneous symmetry breaking, e.g., ferromagnetic or antiferromagnetic order).
    	+ For $\Gamma \gt \Gamma_c$, the system is in a **disordered phase** (quantum fluctuations dominate, and symmetry is restored).

- **Quantum Criticality**
    + Near the critical point $\Gamma = \Gamma_c$, the TFIM displays **quantum critical behavior**, characterized by universal scaling laws and critical exponents.
    	+ This provides insights into the nature of quantum fluctuations and their role in driving phase transitions.




## Methods

The transverse field Ising model is exactly solvable ([P. Pfeuty, Annals of Physics: 57, 79-90 (1970)](https://www.sciencedirect.com/science/article/abs/pii/0003491670902708?via%3Dihub)).
Many numerical methods have also been developed to solve the model for properties unobtainable in the exact solutions. 

| Method                  | Strengths                                                                 | Limitations                                                              | Applications                                                                 |
|-------------------------|---------------------------------------------------------------------------|--------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **ED**   | Exact results for small systems; Captures full quantum correlations.        | Limited to small systems.             | Small-system properties; Benchmarking other methods.               |
| **QMC**     | Handles larger systems; Finite-T.       | Sign problem for fermions.            | Phase diagrams; Finite-temperature properties.        |

