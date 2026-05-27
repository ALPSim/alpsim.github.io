
---
title: Monte Carlo Simulations
description: "Tutorials for ALPS"
toc: true
weight: 1
---

The ALPS Monte Carlo tutorials cover both classical and quantum simulations of spin models and bosonic lattice systems.
Classical Monte Carlo uses local Metropolis or cluster (Wolff) updates for systems described by a classical Boltzmann weight.
Quantum Monte Carlo (QMC) algorithms — loop, directed-loop SSE, worm, and directed worm — work on path-integral or operator-series representations and give access to thermodynamic properties of quantum lattice models at finite temperature.
An extended-ensemble quantum Wang-Landau method computes the full density of states and thermodynamic quantities across all temperatures in a single run.
The tutorials progress from fundamental diagnostics such as autocorrelation times and equilibration, through specific observables such as susceptibilities and magnetization curves, to the detection of classical and quantum phase transitions.

## Choosing a Code

Before starting a simulation it is important to select the algorithm best suited to your model and observable.
The guide below compares the four QMC representations available in ALPS — `looper`, `dirloop_sse`, `worm`, and `qwl` — and summarises their respective strengths and limitations.

- [Which code to choose for your simulation?](com)

## Classical Monte Carlo (`spinmc`)

The `spinmc` application implements classical Monte Carlo with local Metropolis updates and cluster updates for classical spin models.
The first two tutorials introduce the most important diagnostics for any MC run — autocorrelation time and equilibration — laying the groundwork for all subsequent work.
The method is revisited later to study finite-size scaling and the second-order phase transition of the 2D Ising model.

- [MC-01(a) Classical Monte Carlo simulations and autocorrelations](mc01a)
- [MC-01(b) Classical Monte Carlo simulations and equilibration/convergence](mc01b)
- [MC-07 Phase transition in the Ising model](mc07)

## Loop and Directed-Loop QMC (`looper`, `dirloop_sse`)

The `looper` code implements the loop algorithm in an operator-loop representation and is most efficient for isotropic spin models without a magnetic field.
The `dirloop_sse` code uses directed loops in the stochastic series expansion (SSE) representation; it handles models with anisotropy or an external magnetic field that break the spin-inversion symmetry required by `looper`.
These tutorials cover susceptibilities of Heisenberg chains and ladders, magnetization curves in a field, and the identification of a quantum phase transition in a dimerised lattice.

- [MC-02 Calculating magnetic susceptibilities by the classical MC and looper QMC codes](mc02)
- [MC-03 Calculating magnetization curves by the directed loop QMC code](mc03)
- [MC-08 Quantum phase transition in a quantum spin model](mc08)
- [MC-09 Quantum Monte Carlo](qmc)

## Worm QMC (`worm`)

The `worm` code uses the worm algorithm in the path-integral representation and is the method of choice for Bose-Hubbard models and for spin models in strong magnetic fields.
The tutorials show how to enable and evaluate correlation functions and Green functions, and demonstrate the superfluid–Mott-insulator quantum phase transition in the Bose-Hubbard model.

- [MC-04 Custom measurements in the QMC codes](mc04)
- [MC-05 Simulating the Bose-Hubbard model using the worm QMC code](mc05)

## Quantum Wang-Landau (`qwl`)

The quantum Wang-Landau code stochastically constructs the density of states of a quantum Hamiltonian and derives the full thermodynamics — free energy, entropy, and specific heat — at all temperatures from a single simulation.
This tutorial applies the method to ferromagnetic and antiferromagnetic Heisenberg spin chains and ladders.

- [MC-06 Extended ensemble simulations (Quantum Wang-Landau)](mc06)

## Directed Worm Algorithm (`dwa`)

The directed worm algorithm is a highly efficient path-integral QMC method for lattice bosons that combines worm updates with improved estimators.
The tutorials revisit the Bose-Hubbard physics of MC-05 with the `dwa` code and then study the density profile of a three-dimensional optical lattice in a harmonic trap — a system directly relevant to ultracold-atom experiments.

- [MC-10 Monte Carlo Simulations with Directed Worm](dwa)
