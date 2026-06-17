
---
title: Tutorials
icon: school
description: "Tutorials for ALPS"
weight: 3
toc: true
cascade:
    type: docs
---
These tutorials guide you through the major simulation methods available in ALPS, from classical and quantum Monte Carlo to tensor-network and mean-field approaches.
Each tutorial sets up a concrete model — typically a spin chain, Hubbard model, or Bose-Hubbard system — and walks through choosing parameters, running the simulation, and analysing the output.
The example systems are intentionally small so that every calculation completes in minutes on a laptop.
All tutorials are available as Python scripts; a growing collection of [Jupyter Notebooks](jupyter) provides an interactive alternative.

## [Monte Carlo Simulations](mcs)

Classical and quantum Monte Carlo tutorials covering the full range of MC algorithms in ALPS.
Starting from simple Metropolis sampling and autocorrelation analysis, the tutorials progress to loop, directed-loop, and worm quantum Monte Carlo for spin and Bose-Hubbard models, extended-ensemble Wang-Landau sampling, and the study of classical and quantum phase transitions.

## [Exact Diagonalization](ed)

Tutorials for the exact diagonalization of small quantum lattice models.
Topics include sparse Lanczos diagonalization, spin-gap scaling in one-dimensional quantum spin systems, spectral functions and dynamical structure factors, the conformal-field-theory description of critical spectra, frustrated spin chains near a quantum phase transition, and full diagonalization for complete energy-level statistics.

## [Density Matrix Renormalization Group (DMRG)](dmrg)

Tutorials for the DMRG method applied to one-dimensional quantum systems.
The series introduces the algorithm and its convergence, then demonstrates how to extract energy gaps, measure local observables such as magnetization profiles, and compute two-point correlation functions — key quantities for identifying quantum phases and critical behaviour.

## [Dynamical Mean Field Theory (DMFT)](dmft)

Tutorials for the DMFT self-consistency loop and its quantum impurity solvers.
After an introduction to the method, individual tutorials cover the CT-HYB and CT-INT continuous-time QMC solvers, the Hirsch-Fye solver, the Mott metal-insulator transition, the orbitally selective Mott transition, finite-temperature extrapolation, custom lattice geometries, and the antiferromagnetic Néel transition.

## [Time-Evolving Block Decimation (TEBD)](tebd)

Tutorials for real-time evolution of one-dimensional quantum systems using matrix product states.
The two tutorials study prototypical non-equilibrium problems: a sudden quench in the hardcore boson model and the propagation of a domain wall in the XX spin chain, illustrating how entanglement and local observables evolve after a quantum quench.

## [Custom Lattices and Models](lm)

Tutorials for defining custom lattice geometries and model Hamiltonians using the ALPS XML format.
These tutorials bridge the gap between the built-in ALPS library and the full generality of the lattice and model schema, showing how to specify any periodic lattice with an arbitrary unit cell and run standard or custom Hamiltonians on it.

## [Jupyter Notebooks](jupyter)

Interactive Jupyter notebook versions of selected ALPS tutorials, organised by method.
Each notebook combines code, equations, and plots in a single document that can be downloaded and run locally, making it straightforward to modify parameters and explore results interactively.




