
---
title: Implementation
math: true
weight: 5
---

The `spinmc` package is one of the applications of the ALPS project. It provides a a generic implementation of local and cluster updates for classical spin systems.
The applications supports the following models on arbitrary lattices:

- [Ising models](../ising)
- XY models
- Heisenberg models
- 3-, 4- and 10-state Potts models

The application can easily be extended to additional q states Potts models and $O(N)$ models by editing the file mc/spins/spinmc_factory.C in a straightforward manner.

## Running a simulation

is discussed in the tutorial.

## Input parameters

In addition to the general input parameters of the ALPS scheduler library the spinmc application takes the following input parameters:

| **Name**  | **Default** | **Description** |
| :---- | :----   | :----       |
| LATTICE_LIBRARY | lattices.xml | path to a file containing lattice descriptions |
| LATTICE | | name of the lattice |
| MODEL | | either Ising, XY, Heisenberg or Potts |
| q | | the number of different states in a Potts model |
| UPDATE | | the update type, either local or cluster |
| ERROR_VARIABLE | | the name of an observable whose error you would like ALPS to monitor (must be used with ERROR_LIMIT) |
| ERROR_LIMIT | | once ERROR_VARIABLE's absolute error is less than this amount, ALPS will stop the task (must be used with ERROR_VARIABLE) |
| T | | the temperature |
| J | | the default coupling constant |
| J# | J | the coupling constant on a bond with type # (#=0,1,...). |
| D | | onsite single-ion anisotropy coupling constants (one for each spin component in a list, e.g. D="0.0 0.0 10.0") |
| CONVENTION | classical | specifies whether the classical or quantum conventions are used (see below) |
| S |  1 if CONVENTION=classical  1/2 if CONVENTION=quantum | the default spin size |
| S# | S | the spin size on a site with type # (#=0,1,...). |
| $g$ | 1 | the Landee $g$-factor, used for suscpetibility measurements |
| h | 0 | external magnetic field (only with local update) |

In addition, the lattice description can require further parameters (e.g. L or W) as specified in the lattice description file.
Note: while the classical Monte carlo program uses XML lattice description it does not use XML model descriptions. The model is instead specifiec by the parameters in the table above.

## Local versus cluster updates

Cluster updates should be used as long as there is no magnetic field applied and the spin system is not frustrated. Otherwise local updates are preferred.

## Quantum versus classical conventions

Quantum and classical spin models often use different conventions for the coupling constants, and the CONVENTION parameter allows to choose between the two.
- **classical** convention is to have positive signs denote ferromagnetic coupling. The coupling strengths are multiplied by $S^2$ if a parameter S is specified.
- **quantum** convention is to have positive signs denote anti-ferromagnetic coupling. The coupling strengths are multiplied by S(S+1) where S defaults to 1/2. 

## Measurements

The following observables are measured by the spinmc application:

| **Name**  | **Description** |
| :---- | :---------- |
| Energy | the total energy of the system |
| Energy Density | the energy density (energy per site) of the system |
| Specific Heat | the specific heat per site of the system |
| Magnetization | the z-component of the magnetization |
| \|Magnetization\| | absolute value of the z-component of the magnetization |
| Magnetization^2 | square of the z-component of the magnetization |
| Magnetization along Field | the component of the magnetization along the external magnetic field |
| Staggered Magnetization | the z-component of the staggered magnetization (only on bipartite lattices) |
| Staggered Magnetization^2 | square of the z-component of the staggered magnetization (only on bipartite lattices) |
| Susceptibility | the uniform susceptibility, includes a factor of $g^2$ |
| Cluster size | the mean cluster size as a fraction of the lattice volume (only for cluster updates) |

Note: To evaluate the specific heat the evaluation program spinmc_evaluate has to be run on the task files (\*task\*.xml).

