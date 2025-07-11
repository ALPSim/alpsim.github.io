
---
title: DMFT-01 Intro
math: true
toc: true
---

## Introduction - The ALPS DMFT tutorials

This is a set of introductory tutorials for the ALPS DMFT code. They should illustrate the Dynamical Mean Field Theory and in particular showcase some application of the new continuous-time impurity solvers.

The dynamical mean field theory (DMFT) provides an approximate solution to the quantum many body problem, in which the local physics is treated exactly but spatial correlations are neglected. Originally discussed in the infinite coordination number limit, where (after appropriate rescaling of hoppings) the approximation becomes exact, it is now mostly used for the simulation of correlated materials, e.g. in conjunction with LDA in the so-called LDA+DMFT method. In this limit the lattice problem maps onto an impurity problem with a time-dependent effective action, and a self-consistency condition. The effective action is solved by an impurity solver. An introductory article as well as lecture notes and various reviews give an introduction to the subject.

We discuss two impurity solver algorithms: an implementation of the hybridization expansion code, as well as an implementation of the interaction expansion algorithm. The discrete time Hirsch-Fye code is obsolete and serves mostly as a pedagogical example code.

Tutorial 02 will introduce the Metal - AFM insulator transition as a function of temperature in infinite dimension, using a hybridization expansion impurity solver. Tutorial 03 will repeat the same exercise with an interaction expansion solver and tutorial 07 repeats it once more with the discrete time Hirsch-Fye impurity solver. Tutorial 04 and 05 will give an introduction to the Mott transition and orbitally selective Mott transition, and tutorial 06 shows an application to a paramagnetic metal. Tutorial 08 is an example on approximative solution of the Hubbard model for a specific lattice.
