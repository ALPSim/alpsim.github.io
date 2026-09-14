
---
title: Density Matrix Renormalization Group (DMRG)
description: "Tutorials for ALPS"
toc: true
weight: 3
math: true
---

The density-matrix renormalization group (DMRG) finds accurate approximations to the ground state (and a few low-lying excited states) of one-dimensional quantum lattice models by iteratively truncating the Hilbert space to its most relevant $D$-dimensional subspace. These tutorials work through the ALPS `dmrg` application on the spin-1/2 and spin-1 antiferromagnetic Heisenberg chains, a pair of models that look superficially similar but differ fundamentally in their low-energy physics, making them an ideal testbed for the method.

DMRG was introduced by Steven White in two seminal papers, [Density matrix formulation for quantum renormalization groups](https://doi.org/10.1103/PhysRevLett.69.2863) (Phys. Rev. Lett. 69, 2863, 1992) and [Density-matrix algorithms for quantum renormalization groups](https://doi.org/10.1103/PhysRevB.48.10345) (Phys. Rev. B 48, 10345, 1993), which respectively laid out the method and its finite-system refinement into the algorithm used by ALPS today. See the [DMRG reference page](../../documentation/methods/dmrg/dmrg) for further background and references.

## Introduction

- [DMRG-01 Introduction](dmrg01) — introduces the `dmrg` executable and the DMRG algorithm (infinite- and finite-system sweeps, truncation error) and its control parameters.

## Model physics and ground state energies

- [DMRG-02 Heisenberg Spin Chains](dmrg02) — surveys the physics of the two models in depth: the critical, gapless spin-1/2 chain solvable by the Bethe ansatz, and the gapped, non-critical spin-1 (Haldane) chain, with the benchmark values used throughout the rest of the series.
- [DMRG-03 Ground State Energies](dmrg03) — runs the first `dmrg` calculations, computing ground state energies of the spin-1/2 and spin-1 chains at fixed length and extrapolating to the energy per site (or bond) in the thermodynamic limit.

## Excitations and correlations

- [DMRG-04 Gaps](dmrg04) — computes the singlet-triplet gap of the spin-1/2 chain and the Haldane gap of the spin-1 chain at finite length, and extrapolates both to the thermodynamic limit.
- [DMRG-05 Local Observables](dmrg05) — uses the local magnetization profile to distinguish boundary from bulk excitations in the spin-1 chain, a subtlety arising from DMRG's preference for open boundary conditions.
- [DMRG-06 Correlations](dmrg06) — computes spin-spin correlation functions, extracting the critical power-law exponent of the spin-1/2 chain and the correlation length of the spin-1 chain.








