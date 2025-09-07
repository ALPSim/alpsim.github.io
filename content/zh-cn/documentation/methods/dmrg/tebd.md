
---
title: Time-Evolving Block Decimation 
math: true
weight: 11
---

## Introduction

The Time-Evolving Block Decimation (TEBD) algorithm is a method for simulating the time evolution of one-dimensional quantum lattice systems governed by a Hamiltonian with at most nearest neighbor interactions.  It is closely related to the Density Matrix Renormalization Group (DMRG) method in that both methods operate on a class of states known as Matrix Product States (MPS).  In addition to real time evolution, imaginary time evolution can also be used to find ground states.  Essentially, TEBD consists of two parts: a canonical MPS representation of a many-body state, and a protocol for finding the MPS closest to a state which is acted upon by a two-site operator.

The particular implementation of TEBD used in ALPS simulates a series of global parameter quenches of the form $g(t)=g(t_i)+((t-t_i)/\tau)^p (g(t_f)-g(t_i))$.  The timescale $\tau$, power $p$, initial and final values $g(t_f)$ and $g(t_i)$, and Hamiltonian parameters $g$ of each quench are all amenable to specification by the user.  Additionally, because the TEBD method produces wavefunctions, a wide range of observables are available, including entropies, correlation functions, and overlaps between the states at different times. A list of the measurements for each of the models is given in The ALPS paper.

Also, please note that the present implementation of TEBD in ALPS ignores any information about the lattice and uses an open chain lattice of length L.

## TEBD-specific parameters

| **Name** | **Description** |
| :------- | :-------------- |
| CHI_LIMIT | The maximum bond dimension of the MPS allowed during real time propagation.  The default value is 50. |
| TRUNC_LIMIT | The maximum truncation error allowed for a specific two-site evolution.  If the bond dimension corresponding to this truncation is greater than CHI_LIMIT, then CHI_LIMIT is chosen instead.  The default value is $10^{-12}$ |
| TAUS | The elements of this vector are the timescales $\tau$ of the global quenches. |
| GS | The elements of this vector are the Hamiltonian parameters g of the global quenches, given as character variables. Note that the elements of this vector may themselves be vectors, which corresponds to quenching several parameters at the same time. If this is so the corresponding elements of POWS, GIS, and GFS must also be vectors of the same length. Note that TAUS, NUMSTEPS, and STEPSFORSTORE will not be vectors, as the timescale, number of time steps, and number of steps between outputs are the same for each parameter being quenched. |
| POWS | The elements of this vector are the powers $p$ of the global quenches. |
| GIS | The elements of this vector are the initial values of the Hamiltonian parameters $g$ of the global quenches. |
| GFS | The elements of this vector are the final values of the Hamiltonian parameters $g$ of the global quenches. |
| CONSERVED_QUANTUMNUMBERS | Quantum numbers conserved by the model of interest. For spin models 'Sz_total' can be conserved, and for particle models 'N_total' can be conserved. |
| NUMSTEPS | The elements of this vector are the number of timesteps of the global quenches.  This implicitly defines the time steps dt of the quenches. |
| STEPSFORSTORE | The elements of this vector are the number of timesteps between the calculation and output of observables. |
| INITIAL_STATE | The state used at t=0, before real time propagation begins.  Currently, only two values are supported: 'kink', which produces a specific initial state to be discussed further in tutorial 2a (link), and 'ground', which calculates the ground state of a specified initial hamiltonian via imaginary time propagation.  The default value is 'ground'.  See the tutorials for examples. |
| ITP_CHIS | The elements of this vector are the maximum bond dimensions used in iterations of imaginary time propagation to find the group state.  It is only referenced if INITIAL_STATE is 'ground'. |
| ITP_DTS | The elements of this vector are the time steps used in iterations of imaginary time propagation to find the group state.  It is only referenced if INITIAL_STATE is 'ground'. |
| ITP_CONVS | The elements of this vector are the convergence parameters used in iterations of imaginary time propagation to find the group state.  An iteration of imaginary time propagation exits if the maximal difference between singular values at some time interval is less than the convergence parameter.  It is only referenced if INITIAL_STATE is 'ground'. |
| SIMID | An optional integer input which differentiates a series of simulations and can simplify plotting commands. |
| NUM_THREADS | The number of OpenMP threads used. |
| VERBOSE | If set to 'true' then the code will output, time values, truncation errors, and other running messages. The default value is 'false'. |

## References

- G. Vidal, *Efficient classical simulation of slightly entangled quantum computations*,
Phys. Rev. Lett. 91, 147902 (2003).

- G. Vidal, *Efficient simulation of one-dimensional quantum many-body systems*,
Phys. Rev. Lett 93, 040502 (2004).

- A. J. Daley, C. Kollath, U. Schollwöck, and G. Vidal, *Time-dependent density-matrix renormalization-group using adaptive effective Hilbert spaces*, J. Stat. Mech. (2004) P04005.

