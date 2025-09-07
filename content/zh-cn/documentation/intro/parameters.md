
---
title: Common Parameters
math: true
toc: true
weight: 7
---

The following input parameters are common to most of the ALPS applications

## Lattice definition

ALPS applications on lattices specify the lattice with the following three parameters

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| LATTICE_LIBRARY | lattices.xml | path to a file containing lattice descriptions |
| LATTICE | | name of the lattice, specified by dimensionality, extent and unit cell. |
| GRAPH | | as an alternative to a lattice, also a specific arbitrary graph defined in the lattice library can be specified. |

In addition, the lattice description can require further parameters (e.g. L or W) as specified in the lattice description file.

## Model definition 

ALPS quantum lattice models can be specified using the following parameters

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| MODEL_LIBRARY | models.xml | path to a file containing model descriptions |
| MODEL | | name of the model (for example "spin" or "boson") |

The model description can also require further parameters (e.g. S=1/2 or S=1, h=0.5 for spin models, t=1.5 or mu=0.5 for boson models) as specified in the model description file.

## Parameters for finite temperature simulations

| **Parameter** | **Meaning** |
| :------------ | :---------- |
| T | the temperature |
| BETA | inverse of temperature (if temperature is not given) |

## Additional parameters for Monte Carlo simulations 

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| SEED | 0 | The random number seed used in the next run. After using a seed in the creation of a Monte Carlo run, this value gets incremented by one. |
| RNG | "mt19937" | The pseudo-random number generator to be used. Allowed values are "lagged_fibonacci607" and "mt19937". |
| WORK_FACTOR | 1 | A factor by which the work that needs to be done for a simulation is multiplied in load balancing. |
| SWEEPS | | number of Monte Carlo steps (after thermalization) |
| THERMALIZATION | | Number of Monte Carlo sweeps for thermalization |

## Additional parameters for exact diagonalization 

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| CONSERVED_QUANTUMNUMBERS | | specifies conserved global quantum numbers which are used to split the computation into smaller computations for the different sectors. If more than one quantum number is conserved, the quantum numbers are listed in double quotes and separated by commas as in CONSERVED_QUANTUMNUMBERS="N,Sz" |
| N_total, Sz_total, ... | | and similar parameters might be defined for your model through a constraint in your model definition. These constraints will be used if these parameters are specified and the quantumnumber is listed in CONSERVED_QUANTUMNUMBERS. |
| TRANSLATION_SYMMETRY | true | fulldiag and sparsediag exploit translational symmetry and classify eigenstates by their momentum quantum numbers when possible. This symmetry reductions can be switched off with TRANSLATION_SYMMETRY=false. |
| TOTAL_MOMENTUM | | fixes the value of the total momentum. Further explanations can be found below. |
| MEASURE_ENERGY | false | if no measurements are explicitly specified, fulldiag and sparsediag do not store any information on eigenstates by default. Of course, the energy can always be computed for any eigenstate. If you wish to have this in the output and no other measurements are specified, you can specify MEASURE_ENERGY=true. |

**Note:** Instead of true and false, you can also specify 1 and 0, respectively.

If the lattice supports translation symmetries, you can specify the total momentum quantum numbers, but you should be quite careful in doing so.
TOTAL_MOMENTUM takes the momentum quantum numbers as a vector, i.e. a space\-separated list of numbers. Typically, each momentum quantum number $k_i$ will be of the form

$k_i = 2\pi n_i/L_i$,

where $n_i$ is an integer and $L_i$ the linear extent in the corresponding direction. It is possible to specify a symbolic number such as 2*Pi/5 if you put the values in quotation marks, e.g. TOTAL_MOMENTUM="2*Pi/5 0".

**Warning:** An illegal value of TOTAL_MOMENTUM may lead to incorrect results without any further error message.

