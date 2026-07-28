
---
title: DMRG-01 Introduction
math: true
toc: true
---

In this tutorial series we learn how to use the `dmrg` application, ALPS's implementation of the density-matrix renormalization group, to compute ground state energies, excitation gaps, local observables, and correlation functions of one-dimensional quantum spin chains. There is a single executable, `dmrg` (found in the `bin` directory of your ALPS installation), that is used throughout every module of this series; what changes from module to module is which control parameters and measurements you request from it, not the executable itself. This first module introduces the algorithm and its control parameters; the following modules put them to work on progressively more demanding measurements.

## General Remarks

Before we start, let us briefly discuss the inner logic of the DMRG algorithm without discussing it in full detail. Given a one-dimensional quantum system with local state spaces of dimension $d$, where $d=2S+1$ for spins of magnitude $S$, the Hilbert space dimension increases exponentially as $d^L$ with system size $L$. Exact diagonalization achieves exact results in this exponentially large Hilbert space, at the price of small system sizes. Quantum Monte Carlo gives approximate results by stochastically sampling this large space, reaching much larger system sizes. The density-matrix renormalization group (DMRG) tries yet another approach, namely to identify very small subspaces of size $D$ of the exponentially large Hilbert space which are hoped to contain good, very good, even excellent approximations to the states of interest such as the ground state.

A first key control parameter is, therefore, $D$, called *matrix dimension* or *number of block states*. The parameter $D$ controls the number of states in the subspace. DMRG is monotonic in this parameter: the larger it is, the larger the subspace is and the better the approximation can be. There is also an exact limit: if $D\rightarrow d^L$, no states are discarded and the solution would be exact. This is, however, of no practical relevance; if such a large number of states could be achieved on the computer, exact diagonalization would be a superior alternative.

The second key control parameter is of course the system size $L$.

The third control parameter(s) can only be understood by looking even closer at the DMRG algorithm. In order to find the best approximation to a state, DMRG proceeds in two steps:

1. In a first step (so-called *infinite-system* DMRG) the algorithm tries to find good subspaces by iteratively analyzing chains of length 2, 4, 6, until the desired system size $L$ is reached. The procedure consists of splitting the chain in every iteration and insert two new sites at the center; the name comes from the fact that this procedure can of course be carried on infinitely, to take $L$ to infinity; but don't expect very meaningful results as you approach infinity! A second remark is that this procedure favours chains of even length for DMRG treatment.
2. In a second step (so-called *finite-system* DMRG) DMRG deals with the fact that the subspace selection for shorter chains could not yet take into account all the quantum fluctuations and correlations that would be present in the chain of final length $L$. What the method does, is to go through a series of further iterations to improve the quality of the subspaces. One such iteration visiting all sites of a chain is referred to as a *sweep* in DMRG. The number of sweeps is the last important control parameter: if it is too small, the precision of the results for a given $D$ is not achieved; if it is too large, the calculational effort could be wasted, although it is of course always good to err on the safe side.

In a last remark, let us consider the *truncation error*, which is a good indicator of the accuracy achieved by a DMRG run. In a simplified perspective, at each point in the algorithm DMRG makes one step in the direction of exponential growth of state space and then asks how much accuracy can be retained if not allowing that step, by means of an analysis of a density matrix regarding the distribution of weights (eigenvalues) corresponding to its eigenstates. The approximations of DMRG are then reflected in the fact that some statistical weight has to be discarded, which is the so-called truncation error. In many DMRG applications, it can be as small as $10^{-12}$, showing that the approximations made by DMRG are extremely light, which is the reason for the enormous success of the method. For the purpose of the tutorial it is important to know that the error in local quantities (energies, magnetizations, ...) is roughly proportional to (but usually quite a bit larger than) the truncation error, provided that the number of sweeps is large enough.

### Vive la difference ...

The most important difference to other numerical methods is that DMRG prefers open boundary conditions, such that there are two chain ends at site 1 and $L$, not a closed loop as for example exact diagonalization and most analytical methods would prefer. This will lead to some of the more subtle aspects of DMRG calculations that show up throughout this tutorial series, from the special lattice needed for the spin-1 chain in [DMRG-03](../dmrg03) to the boundary-vs-bulk distinction in the excitations studied in [DMRG-05](../dmrg05).

## The ALPS DMRG Code and Its Control Parameters

Besides inputs such as the Hamiltonian and lattice geometry, the DMRG simulation requires a set of specific control parameters. Some of these are listed below. We refer the users to the [DMRG reference page](../../../documentation/methods/dmrg/dmrg) for further details.

### DMRG-specific parameters

**NUMBER_EIGENVALUES**
Number of eigenstates and energies to calculate. Default is 1, should be set to 2 to calculate gaps.

**SWEEPS**
Number of DMRG sweeps for the finite-size algorithm. Each sweep involves a left-to-right half-sweep, and a right-to-left half-sweep.

**NUM_WARMUP_STATES**
Number of initial states to grow the DMRG blocks. If not specified, the algorithm will use a default value of 20 states.

**STATES**
Number of DMRG states kept on each half sweep. The user should specify either 2*SWEEPS different values of STATES or one MAXSTATES or NUMSTATES value.

**MAXSTATES**
Maximum number of DMRG states kept. The user may choose to specify either STATES values for each half-sweep, or a MAXSTATES or NUMSTATES that the program will use to grow the basis. The program will automatically determine how many states to use for each sweep, increasing the basis size in steps of STATES/(2*SWEEPS) until reaching MAXSTATES.

**NUMSTATES**
Constant number of DMRG states kept for all sweeps.

**TRUNCATION_ERROR** 
Users can choose to set the tolerance for the simulation, instead of the number of states. The program will automatically determine how many states to keep in order to satisfy this tolerance. Care must be taken, since this could lead to an uncontrollable growth in the basis size, and a crash as a consequence. It is therefore advisable to also specify the maximum number of states as a constraint, using either MAXSTATES or NUMSTATES, as explained above.

**LANCZOS_TOLERANCE** 
Tolerance for the diagonalization (Davidson/Lanczos) part of the code. the default value is 10^-7.

**CONSERVED_QUANTUMNUMBERS**
Quantum numbers conserved by the model of interest. They will be used in the code in order to reduce matrices into block forms. If no value is specified for a particular quantum number, the program will work in the grand canonical ensemble. For instance, for spin chains if you do not specify Sz_total, the program will use a Hilbert space with dim=2^N states. Running in the "canonical" (by setting Sz_total=0, for instance) will improve performance considerably by working in a subspace with the reduced dimension. For an example of how to do this, take a look at the parms file included with the dmrg code.

### How to choose the right parameters

Default input values are not recommended. DMRG convergence is strongly affected by the number of states used in the warmup, the number of sweeps, and the maximum number of states kept for each iteration. It is a good practice to look at the convergence of the ground-state energy and truncation error as a function of the number of states. This will indicate an optimal number of states to be kept in order to maintain the errors below a certain tolerance.

In order to determine if enough sweeps have been performed, one could look at the spatial distribution of the correlations, or local quantities such as the spin magnetization, or the particle density. For instance, in a model that is symmetric under reflections, we should expect that these observables will also be symmetric. Another quantity that should be symmetric is the entanglement entropy. If this behavior is not reflected in the results, it is likely that this is due to not having enough sweeps in the calculation (another plausible scenario is phase separation).

If the Hamiltonian preserves quantum numbers, such as Sz or N, it is then possible to fix these values to run the simulation in a subspace of reduced dimension. This results in much faster runs, and reduced memory usage.
