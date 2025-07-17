
---
title: Worm Algorithm 
math: true
weight: 5
---

## Introduction

The worm code provides a full generic implementation for Quantum Monte Carlo (QMC) simulations based on the worm algorithms which was invented by N. Prokof'ev and collaborators. Technically, it provides a continuous-time QMC code based on a path integral representation of the partition function.

The current implementation allows to simulate the following models on arbitrary lattices:

- Quantum spin (unfrustrated) models with arbitrary spin size, magnetic field and anisotropy
- (Softcore) bosonic models without a sign problem

Support for simulations with a sign problem could be added if desired.

## Running a simulation

An example simulation is discussed in the tutorial.

## Input parameters

The worm code uses the common input parameters discussed here.

## Parameters for experts

In addition, specific simulations parameters can be assigned (use only if you see what it means!):

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| SKIP | 1 | the number of Monte Carlo sweeps between each measurement |
| RESTRICT_MEASUREMENTS[N] | | if defined this restricts measurements to configurations where the quantum number N (particle number) has the value given as this parameter. Note that the simulation will still be performed in the grand canonical ensemble and the chemical potential needs to be tuned to the right range, to actually sample configurations with the desired particle number. |
| RESTRICT_MEASUREMENTS[Sz] | | if defined this restricts measurements to configurations where the quantum number Sz (magnetization) has the value given as this parameter. Note that the simulation will still be performed in the grand canonical ensemble and the magnetic field needs to be tuned to the right range, to actually sample configurations with the desiredmagnetization. |
| WORMS_PER_KINK | 1 | determines how often a worm should visit a kink on average per sweep. |
| MEASURE_GREEN | false | flag that indicates whether the Green's function should be measured. Don't use - this is untested! |

## Compile time parameters

Furthermore, at compile time you can define the following variables in the file `WRun.h`

| **Parameter** | **Meaning** |
| :------------ | :---------- |
| NONLOCAL | undefine to speed up the code for local interactions. |
| USE_VECTOR | define to use a `std::vector` instead of a `std::list` as data structure. |
| USE_SET | define to use a `std::set` instead of a `std::list` as data structure. |

## Measurements

The following observables are measured by the worm code application:

| **Name** | **Description** |
| :------- | :-------------- |
| Energy | total energy of the system |
| Energy Density | energy per site |
| Density | particle number (for bosonic models) |
| Density^2 | square of the particle number (for bosonic models) |
| Stiffness | stiffness of the system (for bosonic models) |
| Green's function | Green's function (works only for local interactions) |

## Contributors

The following persons have contributed to the worm application:

- Simon Trebst
- Matthias Troyer 

