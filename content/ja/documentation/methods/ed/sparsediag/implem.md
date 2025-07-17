
---
title: Implementation
math: true
weight: 3
---

The `sparsediag` is an exact diagonalization program in ALPS, using the Lanczos algorithm of the IETL library to compute low-lying eigestates of the Hamiltonian. Hence, it can be used for computing ground-state properties of any model that can be defined using the ALPS libraries. The main limitation is the size of the quantum system, i.e., memory and CPU time may become unacceptable at sizes where other, more specialized applications still work well.

## Input Parameters in ALPS

The `sparsediag` code takes the following parameters:

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| NUMBER_EIGENVALUES | 1 | the number of low-lying eigenstates to be calculated |


