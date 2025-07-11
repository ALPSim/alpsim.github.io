
---
title: Implementation 
math: true
weight: 3
---

## Introduction

The `fulldiag` package uses LAPACK library for a complete diagonalization of the Hamiltonian. Hence, it can be used for computing thermodynamic properties of any model that can be defined using the ALPS libraries. The main limitation is one of size, i.e., memory and CPU time may become unacceptable at sizes where other, more specialized applications still work well.

Release 1.3 allows the computation of magnetic or charge properties properties for models with a coupling to a conserved quantity of the form $-hS\_z$ or $-\mu N$, i.e., a SITETERM $-h S_z(i)$ or $-\mu n(i)$. In fact, adaptation to other situations with a coupling to a conserved quantity should be relatively straightforward by changing a few lines in the source file fulldiag.h (this is just not supported at the moment, since it requires the modification of at least 5 strings by the user). If the conserved quantity is not present, two quantities less will be evaluated (see below).

**Warning:** Incorrect results may be obtained if the supposed conserved quantity does actually not commute with the Hamiltonian. Incorrect results will also in general be obtained if the coefficients are not of the above form, and the magnetic field $h$ or chemical potential $\mu$ are changed by `fulldiag_evaluate`.


## Running a computation

is discussed in the `fulldiag` tutorial. After obtaining the full spectrum using the `fulldiag` program, the evaluation program `fulldiag_evaluate` can be used to efficiently produce XML plot files of the thermodynamic as well as magnetic properties, specified below.

### Input parameters

The parameters for the `fulldiag` application are all described among the common input parameters (note in particular the additional parameters for exact diagonalization).
The following further parameters are used only by `fulldiag_evaluate`:

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| T_MIN |  | lowest temperature for which obervables are calculated |
| T_MAX |  | highest temperature for which obervables are calculated |
| DELTA_T | | temperature step width |
| couple | | couple mu changes the coupling from the default $-h S_z$ to $-\ mu N$. It also changes the meaning of a few other parameters and quantities (see below). |
| H_MIN (MU_MIN) | | lowest magnetic field (chemical potential if --couple mu is specified) for which obervables are calculated |
| H_MAX (MU_MAX) | | highest magnetic field (chemical potential if --couple mu is specified) for which obervables are calculated |
| DELTA_H (DELTA_MU) | | magnetic field step width (chemical potential step width if --couple mu is specified) |
| versus | | versus h (versus mu if --couple mu is specified) puts the magnetic field (chemical potential) on the $x$-axis rather than temperature |
| MEASURE_MAGNETIC_PROPERTIES (MEASURE_CHARGE_PROPERTIES) | 1 | turns on (1) or off (0) the evaluation of magnetic (or charge) properties (see below). Recall that with the current version of `fulldiag`, such measurements are possible only for models with a conserved total $S_z$ or $N$. A corresponding CONSERVED_QUANTUMNUMBERS=... must also be specified in the parameters of `fulldiag`. |
| DENSITIES | 1 | specify whether to normalize quantities per site (1) or for the total system (0) |

All these parameters can be overwritten by the command line argument with the same name.

## Evaluation of thermodynamic properties

The `fulldiag_evaluate` program takes an XML output file of `fulldiag`, 

    fulldiag_evaluate [--T_MIN ...] [--T_MAX ...] [--DELTA_T ...]
        [--H_MIN ...] [--H_MAX ... ] [--DELTA_H ... ] [--versus h]
        [--DENSITIES ...] inputfile [outputfileprefix]</tt>

or 

    fulldiag_evaluate --couple mu [--T_MIN ...] [--T_MAX ...] [--DELTA_T ...]
        [--MU_MIN ...] [--MU_MAX ... ] [--DELTA_MU ...] [--versus mu]
        [--DENSITIES ...] inputfile [outputfileprefix]</tt>

Two optional ranges for temperature (T_MIN, T_MAX, DELTA_T) and magnetic field (H_MIN, H_MAX, DELTA_H) or chemical potential (MU_MIN, MU_MAX, DELTA_MU) can be specified. `fulldiag_evaluate` produces XML plot files (`outputfileprefix.plot.energy.xml` etc., where outputfileprefix is derived from the name of the inputfile if not specified) for the following quantities versus temperature:

- Energy [Density]
- Free Energy [Density]
- Entropy [Density]
- Specific Heat [Density]
- Magnetization [Density] (if MEASURE_MAGNETIC_PROPERTIES=1, and without couple mu)
- Uniform Susceptibility [Density] (if MEASURE_MAGNETIC_PROPERTIES=1, and without couple mu)
- Particle number [Density] (if MEASURE_CHARGE_PROPERTIES=1, and with couple mu)
- Compressibility [Density] (if MEASURE_CHARGE_PROPERTIES=1, and with couple mu)

Note that quantities are output as densities, i.e., normalized to the number of sites if the parameter DENSITIES=1, while output is for the total system if DENSITIES=0. By default, plots are produced with temperature on the $x$-axis. Use the argument --versus h (--versus mu) in order to obtain plots with magnetic field (chemical potential) on the $x$-axis

`fulldiag` stores information including eigenvalues and a result for the accessible physical quantities (measured for the total system). These are of interest mainly to specialists and, as we hope, self-explanatory if needed.

## Contributors

The following persons have contributed to the `fulldiag` application:

- Matthias Troyer
- Andreas Honecker 


