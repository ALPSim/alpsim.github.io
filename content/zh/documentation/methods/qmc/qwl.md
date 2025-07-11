
---
title: Quantum Wang-Landau Algorithm 
math: true
weight: 7
---

## Introduction

The `qwl` code provides a multi-cluster implementation of the quantum Wang-Landau (QWL) method based on the stochastic series expansion (SSE) quantum Monte Carlo scheme. The QWL methods was developed by members of the ALPS collabortaion, M. Troyer, S. Wessel, and F. Alet, as an extension of the classical Wang-Landau algorithm to the quantum case. The underlying SSE method was invented by A. Sandvik and coworkers. Using the QWL approach, one can extract thermodynamic quantities, such as the energy or entropy, from a single simulation in an extended ensemble, based on a high temperature series expansion of the partition function, the coefficients of which are calculated to high order in the course of the simulation.

The current implementation of the QWL method is based on an extension of the original scheme, as proposed in the classical case by C. Zhou and R. N. Bhatt. The algorithm first performes a number of Wang-Landau refinement steps, using the Zhou-Bhatt criterion instead of the histogram flatness. After obtaining the final ensemble weights, additional simulations are performed in the resulting ensemble, including measurements of observables.

**Note:** This first version allows the simulation of isotropic Heisenberg spin-1/2 ferro- and antiferromagnetic models on arbitrary non-frustrated lattices at zero magnetic field. In the future, we plan to relax this constraint, and also provide an implementation of the QWL perturbation expansion.

## Running a simulation

is discussed in the tutorial. After running a simulation using the `qwl` program, the script `qwl_evaluate` program produces XML plot files of the thermodynamic as well as (when measured) magnetic properties, specified below.

## Input parameters

In addition to the common input parameters discussed here the `qwl` application takes the following input parameters:

| **Name** | **Default** | **Description** |
| :------- | :---------- | :-------------- |
| CUTOFF | 500 | maximum expansion order kept during the simulation |
| T_MIN | 0.1 | lowest temperature for which obervables are calculated by `qwl_evaluate` (overwritten by its commandline option \[-T_MIN ...\]) |
| T_MAX | 10 | highest temperature for which obervables are calculated by `qwl_evaluate` (overwritten by its commandline option \[-T_MAX ...\]) |
| DELTA_T | 0.1 | temperature step width used by `qwl_evaluate` (overwritten by its commandline option \[-DELTA_T ...\]) |
| MEASURE_MAGNETIC_PROPERTIES | 1 | turns on (1) or off (0) the measurement of uniform and, if LATTICE is bipartite, staggered magnetic properties (listed below) |

### Parameters for experts

In addition, the following parameters can be assigned to the algorithm, in particular to allow for simulations using the original QWL refinement scheme.

| **Name** | **Default** | **Description** |
| :------- | :---------- | :-------------- |
| NUMBER_OF_WANG_LANDAU_STEPS | 16 | number of the Wang-Landau refinement steps |
| SWEEPS | determined during Wang-Landau refinement | number of Monte Carlo steps in final fixed-weights simulation |
| USE_ZHOU_BHATT_METHOD | 1 | turns on (1) or off (0) the usage of the Zhou-Bhatt method (if turned off (0), FLATNESS_TRESHOLD and BLOCK_SWEEPS apply) |
| FLATNESS_TRESHOLD | N/A if USE_ZHOU_BHATT_METHOD=1 0.2, if USE_ZHOU_BHATT_METHOD=0 | maximum deviation of the histogram maximum/minimum from the average value to be reached before reduction of the increase factor (pplies only, if USE_ZHOU_BHATT_METHOD=0) |
| BLOCK_SWEEPS | N/A, if USE_ZHOU_BHATT_METHOD=1  10000, if USE_ZHOU_BHATT_METHOD=0 | number of sweeps within a Wang-Landau step before checking for flatness (applies only, if USE_ZHOU_BHATT_METHOD=0) |
| INITIAL_MODIFICATION_FACTOR | e, if USE_ZHOU_BHATT_METHOD=1  determined from other parameters, if USE_ZHOU_BHATT_METHOD=0 | initial value of the increase factor of the expansion coefficients during the first Wang-Landau refinement step (in sucessive steps, the factor is decreased by taking its squareroot) |
| EXPANSION_ORDER_MINIMUM | 0 | minimum expansion order of determined coefficients |
| EXPANSION_ORDER_MAXIMUM | CUTOFF | maximum expansion order of determined coefficients, must not exceed CUTOFF |
| START_STORING | NUMBER_OF_WANG_LANDAU_STEPS | number of Wang-Landau steps, where storing of expansion coefficients starts |

## Measurements 

The `qwl_evaluate` program takes an XML output file of a qwl simulation,

    qwl_evaluate [-T_MIN ...] [-T_MAX ...] [-DELTA_T ...] prefix.out.xml

and produces XML plot files (`prefix.plot.energy.xml` etc.) for the following quantities vs. temperature:

| **Name** | **Description** |
| :------- | :-------------- |
| Energy Density | energy per site |
| Free Energy Density | free energy per site |
| Entropy Density | entropy per site |
| Specific Heat per Site | specific heat per site |
| Uniform Structure Factor per Site | longitudinal uniform structure factor (if MEASURE_MAGNETIC_PROPERTIES=1) |
| Uniform Susceptibility per Site | uniform susceptibility (if MEASURE_MAGNETIC_PROPERTIES=1) |
| Staggered Structure Factor per Site | longitudinal staggered structure factor (if MEASURE_MAGNETIC_PROPERTIES=1 and for bipartite lattices only) |

The following quantities are directly measured by the `qwl` application, and are of relevance mainly from an algorithmic perspective.

| **Name** | **Description** |
| :------- | :-------------- |
| Coefficients | estimate of the logarithms $\ln\[g(n)\]$ of the coefficients $g(n)$ of the high temperature series expansion of the partition function, $Z= \sum_n g(n)\beta_n$, after SWEEPS fixed-weights sweeps, taking into account the final histogram (this usually constitutes the best estimate)|
| Coefficients # | estimate of $\ln\[g(n)\]$, after the #-th Wang-Landau refinement step (# ≥ START_STORING) |
| Histogram | normalized histogram of visited expansion orders during the fixed-weights sweeps |
| Fraction | fraction of up-walkers for the visited expansion orders during the fixed-weights sweeps |
| Time Up | time to tunnel from lowest to highest expansion coefficent during the fixed-weights sweeps |
| Time Down | time to tunnel from highest to lowest expansion coefficent during the fixed-weights sweeps |
| Time Total | time to tunnel from lowest to highest and back to lowest expansion coefficent during the fixed-weights sweeps |
| Total Sweeps | number of sweeps used for the total simulation, including Wang-Landau refinement |
| Total Sweeps # | number of sweeps used for the #-th Wang-Landau refinement step (# ≥ START_STORING) |
| Uniform Structure Factor Coefficients | expansion coefficients of the uniform structure factor (if MEASURE_MAGNETIC_PROPERTIES=1) |
| Staggered Structure Factor Coefficients | expansion coefficients of the staggered structure factor(if MEASURE_MAGNETIC_PROPERTIES=1 and for bipartite lattices only) |

Other quantities might also be available depending on the exact version of the qwl application.

## References

- M. Troyer, S. Wessel and F. Alet, Phys. Rev. Lett. 90, 120201 (2003)
- S. Wessel, N. Stoop, E. Gull, S. Trebst, and M. Troyer, J. Stat. Mech. P12005 (2007)
- S. Trebst, D. A. Huse, and M. Troyer, Phys. Rev. E 70, 046701 (2004)
- C. Zhou and R.N. Bhatt, Phys. Rev. E 72, 025701(R) (2005) 

