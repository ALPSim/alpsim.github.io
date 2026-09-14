---
title: Spinless Fermions
description: "Tutorials for ALPS"
toc: true
weight: 7
math: true
---

These tutorials apply the ALPS `dmrg` application to one-dimensional spinless fermions.
Dropping the spin degree of freedom leaves the simplest interacting fermionic chain there is, which makes it a clean setting for the features of the method that spin models never exercise.
Chief among these are the Jordan-Wigner string that maps fermionic operators onto spin operators, the use of particle number rather than total $S_z$ as the conserved quantum number, and a low-energy description in terms of Luttinger-liquid parameters instead of a spin gap.
The series builds on the spin-chain tutorials, so it assumes familiarity with the DMRG control parameters introduced in [DMRG-01](../dmrg01).

## Introduction

- [DMRG-07 Introduction](dmrg07) — introduces the spinless-fermion chain and the parameters used throughout this series.

## Simulations

- [DMRG-08 Ground State Energies](dmrg08) — computes ground state energies of the spinless-fermion chain with the `dmrg` application, benchmarked against exact free fermions and the Heisenberg result of DMRG-03.
- [DMRG-09 Particle-Number Sectors](dmrg09) — the fixed-$N$ blocks built by `CONSERVED_QUANTUMNUMBERS="N"`: energies and density profiles of the $N=0$, $1$ and $2$ sectors, checked against closed-form answers.
- [DMRG-10 Model](dmrg10) — spinless fermions against hardcore bosons: why the two are the same Hamiltonian on an open chain, and why only the boson form is usable with the `dmrg` binary.
- [DMRG-11 Boundary Conditions](dmrg11) — open against periodic chains at equal bond dimension: the $1/L$ surface term of the open chain against the ring's conformal $1/L^2$, and the bond dimension the ring costs in exchange.
