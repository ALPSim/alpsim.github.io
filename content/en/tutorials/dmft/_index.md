
---
title: Dynamical Mean Field Theory (DMFT) Solvers
description: "Tutorials for ALPS"
toc: true
weight: 4
math: true
---

Dynamical mean field theory (DMFT) maps the lattice Hubbard model onto a self-consistently determined quantum impurity problem, capturing strongly correlated phenomena — such as the Mott metal-insulator transition — that static mean-field theories miss entirely. These tutorials work through the ALPS DMFT self-consistency loop and its quantum impurity solvers, then apply them to a series of physically motivated examples on the Bethe lattice and beyond.

## Introduction

- [DMFT-01 An introduction to DMFT](dmft01) — motivates the DMFT approximation and its mapping onto a quantum impurity problem, and gives a roadmap of the tutorials that follow.

## Impurity Solvers

ALPS provides three solvers for the DMFT impurity problem, all applied here to the same metal–antiferromagnetic-insulator transition so their results can be directly compared: the continuous-time hybridization-expansion algorithm (CT-HYB), the continuous-time interaction-expansion algorithm (CT-INT), and the older discrete-time Hirsch-Fye algorithm, whose systematic $\Delta\tau$ errors motivated the development of the continuous-time methods.

- [DMFT-02 CT-HYB: the CT-HYB QMC solver](dmft02) — introduces the hybridization-expansion solver and uses it to trace out the metal–antiferromagnetic-insulator transition of the Hubbard model on the Bethe lattice as a function of temperature.
- [DMFT-03 CT-INT: the CT-INT QMC solver](dmft03) — repeats the same exercise with the interaction-expansion solver.
- [DMFT-07 The Hirsch-Fye solver](dmft07) — repeats the exercise once more with the discrete-time Hirsch-Fye solver, and discusses why continuous-time algorithms have largely superseded it.

## Physics Applications

- [DMFT-04 Mott Transition](dmft04) — studies the paramagnetic Mott transition, the metal-insulator transition realized in materials such as $V_2O_3$, by suppressing antiferromagnetic order and scanning the interaction strength at fixed temperature.
- [DMFT-05 Orbitally Selective Mott Transition](dmft05) — extends the method to a two-band model in which one orbital can become Mott insulating while the other remains metallic, a phenomenon first identified in ruthenates such as Ca$_{2-x}$Sr$_x$RuO$_4$.
- [DMFT-06 Paramagnetic metal and extrapolation errors](dmft06) — compares CT-HYB and CT-INT self-energies for a paramagnetic metal against Hirsch-Fye and exact-diagonalization benchmarks, illustrating how discretization and statistical errors show up in practice.

## Beyond the Bethe Lattice

- [DMFT-08 Setting a particular lattice](dmft08) — shows how to move beyond the default semicircular Bethe-lattice density of states to a general lattice, including square, cubic, and hexagonal geometries and two-dimensional dispersions evaluated by Hilbert-transformed k-space integration.

## Putting It Together

- [DMFT-09 Néel transition in single site DMFT](dmft09) — a combined example that reproduces the antiferromagnetic Néel transition with all three impurity solvers side by side, so their results can be compared directly.
