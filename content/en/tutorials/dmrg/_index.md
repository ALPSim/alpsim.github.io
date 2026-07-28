
---
title: Density Matrix Renormalization Group
description: "Tutorials for ALPS"
toc: true
weight: 3
math: true
---

The density-matrix renormalization group (DMRG) finds accurate approximations to the ground state (and a few low-lying excited states) of one-dimensional quantum lattice models by iteratively truncating the Hilbert space to its most relevant $D$-dimensional subspace. These tutorials work through the ALPS `dmrg` application on the spin-1/2 and spin-1 antiferromagnetic Heisenberg chains, a pair of models that look superficially similar but differ fundamentally in their low-energy physics, making them an ideal testbed for the method.

## Introduction

- [DMRG-01 Introduction](dmrg01) — introduces the `dmrg` executable and the DMRG algorithm (infinite- and finite-system sweeps, truncation error), its control parameters, and gives a roadmap of the tutorials that follow.

## Ground State Energies and Model Physics

- [DMRG-02 Ground State Energies](dmrg02) — runs the first `dmrg` calculations, computing ground state energies of the spin-1/2 and spin-1 chains at fixed length and extrapolating to the energy per site (or bond) in the thermodynamic limit.
- [DMRG-03 Heisenberg Spin Chains](dmrg03) — surveys the physics of the two models in depth: the critical, gapless spin-1/2 chain solvable by the Bethe ansatz, and the gapped, non-critical spin-1 (Haldane) chain, with the benchmark values used throughout the rest of the series.

## Excitations and Correlations

- [DMRG-04 Gaps](dmrg04) — computes the singlet-triplet gap of the spin-1/2 chain and the Haldane gap of the spin-1 chain at finite length, and extrapolates both to the thermodynamic limit.
- [DMRG-05 Local Observables](dmrg05) — uses the local magnetization profile to distinguish boundary from bulk excitations in the spin-1 chain, a subtlety arising from DMRG's preference for open boundary conditions.
- [DMRG-06 Correlations](dmrg06) — computes spin-spin correlation functions, extracting the critical power-law exponent of the spin-1/2 chain and the correlation length of the spin-1 chain.








