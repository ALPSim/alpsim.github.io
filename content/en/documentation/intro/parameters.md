
---
title: Common Parameters
math: true
toc: true
weight: 7
---

The following input parameters are common to most ALPS applications.

## Lattice definition

ALPS applications on lattices specify the lattice with the following three parameters (see [Lattice Definitions](../latticehowtos) for how the lattice library itself is built):

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| LATTICE_LIBRARY | lattices.xml | path to a file containing lattice descriptions |
| LATTICE | | name of the lattice, specified by dimensionality, extent and unit cell |
| GRAPH | | as an alternative to LATTICE, a specific arbitrary graph defined in the lattice library can be referenced directly |

In addition, the lattice description can require further parameters (e.g. L or W) as specified in the lattice description file.

## Model definition

ALPS quantum lattice models can be specified using the following parameters (see [ALPS Model Definitions](../modeldef) for how the model library itself is built):

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| MODEL_LIBRARY | models.xml | path to a file containing model descriptions |
| MODEL | | name of the model (for example "spin" or "boson") |

The model description can also require further parameters (e.g. S=1/2 or S=1, h=0.5 for spin models, t=1.5 or mu=0.5 for boson models) as specified in the model description file.

## Parameters for finite temperature simulations

| **Parameter** | **Meaning** |
| :------------ | :---------- |
| T | the temperature |
| BETA | inverse of temperature, used instead of T if T is not given |

## Additional parameters for Monte Carlo simulations

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| SEED | 0 | the random number seed for this run. It is incremented by one each time a new run is created for the same task, so that repeated runs don't reuse the same seed. |
| RNG | "mt19937" | the pseudo-random number generator to use. Allowed values are "lagged_fibonacci607" and "mt19937". |
| WORK_FACTOR | 1 | a multiplier applied to this simulation's estimated workload when the scheduler load-balances multiple tasks against each other. |
| SWEEPS | | number of Monte Carlo steps (after thermalization) |
| THERMALIZATION | | number of Monte Carlo sweeps for thermalization |

These are parameters set in the parameter file itself. When running from the command line, the scheduler also accepts a separate set of runtime flags — such as `--time-limit`, `--checkpoint-time`, `--Tmin`/`--Tmax`, and `--mpi`/`--Nmin`/`--Nmax` for parallel runs — passed directly to the program rather than written into the parameter file; see [Using the command line](../runalps/commandline) for the full list.

## Additional parameters for exact diagonalization

These parameters are specific to the [sparsediag](../../methods/ed/sparsediag) and [fulldiag](../../methods/ed/fulldiag) applications:

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| CONSERVED_QUANTUMNUMBERS | | specifies conserved global quantum numbers, used to split the computation into smaller computations for the different sectors. If more than one quantum number is conserved, they are listed in double quotes and separated by commas, as in CONSERVED_QUANTUMNUMBERS="N,Sz" |
| N_total, Sz_total, ... | | fixes the corresponding quantum number to a specific value, provided a `<CONSTRAINT>` for it is defined in the model (see [Lattice Basis](../modeldef/latticebasis)). Such a constraint is applied only when the parameter is given a value and the quantum number is also listed in CONSERVED_QUANTUMNUMBERS. |
| TRANSLATION_SYMMETRY | true | fulldiag and sparsediag exploit translational symmetry and classify eigenstates by their momentum quantum numbers when possible. This symmetry reduction can be switched off with TRANSLATION_SYMMETRY=false. |
| TOTAL_MOMENTUM | | fixes the value of the total momentum. Further explanations can be found below. |
| MEASURE_ENERGY | false | fulldiag and sparsediag do not store any information on eigenstates by default unless measurements are explicitly specified. The energy can always be computed for any eigenstate, however; set MEASURE_ENERGY=true to include it in the output even when no other measurements are requested. |

**Note:** Instead of true and false, you can also specify 1 and 0, respectively.

If the lattice supports translation symmetries, you can specify the total momentum quantum numbers, but you should be quite careful in doing so.
TOTAL_MOMENTUM takes the momentum quantum numbers as a vector, i.e. a space-separated list of numbers. Typically, each momentum quantum number $k_i$ will be of the form

$k_i = 2\pi n_i/L_i$,

where $n_i$ is an integer and $L_i$ the linear extent in the corresponding direction. It is possible to specify a symbolic number such as 2*Pi/5 if you put the values in quotation marks, e.g. TOTAL_MOMENTUM="2*Pi/5 0".

**Warning:** An illegal value of TOTAL_MOMENTUM may lead to incorrect results without any further error message.

---

For how the LATTICE/LATTICE_LIBRARY parameters relate to the lattice library, see [Lattice Definitions](../latticehowtos). For how the MODEL/MODEL_LIBRARY parameters relate to the model library, see [ALPS Model Definitions](../modeldef). For the other ALPS documentation sections, see the [General Introduction](..).
