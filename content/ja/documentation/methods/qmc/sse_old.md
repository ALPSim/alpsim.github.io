
---
title: Directed Loop Algorithm with SSE 
math: true
weight: 4
---

## Introduction

The `dirloop_sse` package provides a full generic implementation of the Quantum Monte Carlo (QMC) method called directed loop algorithm in the Stochastic Series Expansion representation. The `dirloop_SSE` method was invented and developped by Anders Sandvik and coworkers. It is a powerful and elegant QMC method to study quantum spin or bosonic lattice models.

The current implementation we present here uses the most recent developments of this method published in:
- A. W. Sandvik, Phys. Rev. B 59, 14157 (1999).
- F. Alet, S. Wessel, and M. Troyer Phys. Rev. E 71, 036706 (2005).
- L. Pollet, S. M. A. Rombouts, K. Van Houcke, and K. Heyde, Phys. Rev. E 70, 056705 (2005).

This version allows to simulate on arbitrary lattices:
- Quantum spin (even frustrated - see remark below) models with arbitrary spin size, magnetic field and anisotropy
- (Softcore) bosonic models

This release allows to simulate systems with a sign problem (e.g. frustrated spin systems). However, this case was moderately tested so please be careful if your model has a sign problem ...

**Please note** that for frustrated models, some values of the parameter Epsilon might render the algorithm non ergodic (for example, when you have a "pure loop" algorithm). One needs to check this carefully.

## Running a simulation

is discussed in the tutorial.

## Input parameters

In addition to the common input parameters of the ALPS applications the `dirloop_sse` application takes the following input parameters for experts (use only if you see what it means!):

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| SKIP | 1 | the number of Monte Carlo sweeps between each measurement |
| RESTRICT_MEASUREMENTS[N] |  | if defined this restricts measurements to configurations where the quantum number N (particle number) has the value given as this parameter. Note that the simulation will still be performed in the grand canonical ensemble and the chemical potential needs to be tuned to the right range, to actually sample configurations with the desired particle number.|
| RESTRICT_MEASUREMENTS[Sz] | | if defined this restricts measurements to configurations where the quantum number Sz (magnetization) has the value given as this parameter. Note that the simulation will still performed in the grand canonical ensemble and the magnetic field needs to be tuned to the right range, to actually sample configurations with the desiredmagnetization.|
| NUMBER_OF_WORMS_PER_SWEEP | Calculated self consistently | number of worms done during the loop update. By default, this number is calculated self-consistently during the thermalization part. Nevertheless, you can force its value during the whole simulation |
| EPSILON | 0 | supplementary diagonal energy shift for all interactions. The value of EPSILON affects the performances of the algorithm with the following tradeoff : the higher it is, the longer the simulation time but the lowest are bounce probabilities. Current wisdom indicates that one should use non-zero values for Epsilon, but not too high (for example S/2 for spin S models). Please note that for frustrated models, some values of Epsilon might render the algorithm non-ergodic. You have to check carefully. |
| WHICH_LOOP_TYPE | "minbounce" | string to indicate which type of updates should be used for the scattering at the vertices : ( "heatbath" ) heatbath, see A. W. Sandvik, Phys. Rev. B 59, 14157 (1999). ( "minbounce" ) minimum bounces, see F. Alet, S. Wessel, and M. Troyer Phys. Rev. E 71, 036706 (2005). ( "locopt" ) locally optimal, see L. Pollet, S. M. A. Rombouts, K. Van Houcke, and K. Heyde, Phys. Rev. E 70, 056705 (2005). By default the algorithm uses the "minbounce" updates. |
| NO_WORMWEIGHT | 0 | boolean to indicate whether the worm matrixelement should be set to unity (NO_WORMWEIGHT = true) or to its real value depending on the spin/density configuration (NO_WORMWEIGHT=false). By default, NO_WORMWEIGHT is false. |

## Measurements

The following observables are measured by the `dirloop_sse` for any model application:

| **Name** | **Description** |
| :------- | :-------------- |
| Energy | total energy of the system |
| Energy Density | energy per site |

The following observables are measured by the dirloop_sse for spin models, i.e. models that have an Sz quantumnumber defined:

| **Name** | **Description** |
| :------- | :-------------- |
| Magnetization | the z-component of the total magnetization |
| Magnetization Density | the z-component of the total magnetization per site |
| \|Magnetization\| | absolute value of the z-component of the magnetization |
| \|Magnetization Density\| | absolute value of the z-component of the magnetization per site |
| Magnetization^2 | square of the z-component of the total magnetization |
| Magnetization Density^2 | square of the z-component of the total magnetization per site |
| Magnetization^4 | fourth power of the z-component of the total magnetization |
| Magnetization Density^4 | fourth power of the z-component of the total magnetization per site |
| Susceptibility | the uniform susceptibility (spin models) |

Spin models on bipartite lattices also have a staggered magnetization:

| **Name** | **Description** |
| :------- | :-------------- |
| Staggered Magnetization | the z-component of the staggered magnetization |
| Staggered Magnetization Density | the z-component of the staggered magnetization per site |
| Staggered Magnetization^2 | square of the z-component of the staggered magnetization |
| Staggered Magnetization Density^2 | square of the z-component of the staggered magnetization per site |

The following observables are measured by the `dirloop_sse` for particle models, i.e. models that have an N quantumnumber defined:

| **Name** | **Description** |
| :------- | :-------------- |
| Density | particle density |
| Density^2 | square of the particle density |

And for all models

| **Name** | **Description** |
| :------- | :-------------- |
| Stiffness | stiffness of the system (both for spin and bosonic models)|

Other observables might also be available depending on the exact version of the application.

## Contributors

The following persons have contributed to the `dirloop_sse` application:

- Fabien Alet
- Matthias Troyer 
- Lode Pollet


