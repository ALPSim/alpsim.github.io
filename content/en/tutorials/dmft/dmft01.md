
---
title: DMFT-01 Intro
math: true
toc: true
---

## Introduction to the ALPS DMFT Tutorials

This is a set of introductory tutorials for the ALPS DMFT code. They illustrate Dynamical Mean Field Theory (DMFT) and showcase applications of the continuous-time impurity solvers implemented in ALPS.

### What is DMFT?

Dynamical mean field theory (DMFT) provides an approximate solution to the quantum many-body problem in which the local physics is treated exactly, while spatial correlations are neglected. It was originally derived in the limit of infinite coordination number, where (after an appropriate rescaling of the hopping) the approximation becomes exact. Today it is used mainly for the simulation of correlated materials, often combined with the Local Density Approximation (LDA) in the so-called LDA+DMFT method.

In this limit, the lattice problem maps onto a quantum impurity problem with a time-dependent effective action and a self-consistency condition. The effective action is solved by an "impurity solver". A thorough introduction to the method and its applications can be found in the review by [Georges, Kotliar, Krauth, and Rozenberg, Rev. Mod. Phys. 68, 13 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13); see also the [ALPS DMFT documentation](../../../documentation/methods/dmft) for further theoretical background.

### Impurity solvers used in this tutorial series

We discuss two impurity solver algorithms: an implementation of the hybridization-expansion code, and an implementation of the interaction-expansion algorithm. A discrete-time Hirsch-Fye code is also provided; it is numerically obsolete and serves mostly as a pedagogical example.

### Roadmap

- **Tutorial 02** introduces the metal-AFM insulator transition as a function of temperature in infinite dimensions, using the hybridization-expansion impurity solver.
- **Tutorial 03** repeats the same exercise with the interaction-expansion solver.
- **Tutorial 04** introduces the Mott transition.
- **Tutorial 05** introduces the orbitally selective Mott transition.
- **Tutorial 06** applies the method to a paramagnetic metal.
- **Tutorial 07** repeats the metal-insulator transition once more, using the discrete-time Hirsch-Fye impurity solver.
- **Tutorial 08** shows how to solve the Hubbard model for a lattice other than the (default) Bethe lattice, given its density of states.
- **Tutorial 09** reproduces the Néel transition, combining the hybridization-expansion, interaction-expansion, and Hirsch-Fye solvers from Tutorials 02, 03, and 07.
