
---
title: The Density Matrix Renormalization Group 
math: true
weight: 11
---

## Introduction

The Density Matrix Renormalization Group (DMRG) method is a widely-utilized sophisticated algorithm to obtain low-lying eigenvalues and eigenvectors of very large matrices such as those found in quantum many-body problems. DMRG possesses features that make it extremely powerful: it can treat systems with hundreds of quantum spins or electrons, provide extremely accurate ground-state energies, and compute gaps in low-dimensional systems. Together with quantum Monte Carlo methods, it dominates most of the numerical research in the field of strongly correlated electron systems.
The DMRG is particularly suitable for one-dimensional systems, where it is definitely the method of choice if one is only interested in ground state properties and low-lying eigenstates. The algorithm is much more efficient in systems with open boundary conditions, and quasi-2d systems (ladders) with cylindrical boundary conditions, where convergence is achieved with a relatively small number of states.

## DMRG-specific parameters

| **Name** | **Description** |
| :------- | :-------------- |
| NUMBER_EIGENVALUES | Number of eigenstates and energies to calculate. Default is 1, should be set to 2 to calculate gaps. |
| SWEEPS | Number of DMRG sweeps. Each sweep involves a left-to-right half-sweep, and a right-to-left half-sweep. |
| NUM_WARMUP_STATES | Number of initial states to grow the DMRG blocks. If not specified, the algorithm will use default value used of 20. |
| STATES | Number of DMRG states kept on each half sweep. The user should specify either 2\*SWEEPS different values of STATES or one MAXSTATES or NUMSTATES value. |
| MAXSTATES | Maximum number of DMRG states kept. The user should choose to specify either STATES values for each half-sweep, or a MAXSTATES or NUMSTATES that the program will use to grow the basis. The program will automatically determine how many states to use for each sweep, growing in steps of STATES/(2\*SWEEPS) until reaching MAXSTATES. |
| NUMSTATES | Constant number of DMRG states kept for all sweeps. |
| TRUNCATION_ERROR | The user can choose to set the tolerance for the simulation, instead of the number of states. The program will automagically determine how many states to keep in order to satisfy this tolerance. Care must be taken, since this could lead to an uncontrollable growth in the basis size, and a crash as a consequence. It is therefore advisable to also specify the maximum number of states as a constraint, using either MAXSTATES or NUMSTATES, as explained before. |
| LANCZOS_TOLERANCE | Tolerance for the exact diagonalization (Davidson/Lanczos) piece of the simulation. The default value is 10^-7. |
| CONSERVED_QUANTUMNUMBERS | Quantum numbers conserved by the model of interest. They will be used in the code in order to reduce matrices in block form. If no value is specified for a particular quantum number, the program will work in the grand canonical. For instance in spin chains if you don't specify Sz_total, the program will run using a Hilbert space with dim=2^N states. Running in the "canonical" (by setting Sz_total=0, for instance) will improve performance considerably by working in a subspace with a reduced dimension. For an example of how to do this, take a look at the parms file included with the dmrg code. |
| VERBOSE | If set to an integer > 0, it will print extra output information, such as density-matrix eigenvalues. There are different verbose levels up to a maximum of 3, for debugging purposes, although the user shouldn't need a level larger than 1. |
| START_SWEEP | (Available after v1.3b6) Starting sweep for resuming a simulation that was interrupted, or extending it with a new set of states. |
| START_DIR | Starting direction for the resumed simulation. Can assume the values 0 or 1, for "left-to-right" or "right-to-left", respectively. It has effect only in the presence of START_SWEEP. Its default value is 0. |
| START_ITER | Starting iteration for the resumed simulation. It has effect only in the presence of START_SWEEP. Its default value is 1. |
| TEMP_DIRECTORY | The DMRG program stores information in temporary files that reside in your local folder. There could be a large number of them, and this could overwhelm your file system, especially if you are using NFS. The address for storing these files could be changed by setting the variable TEMP_DIRECTORY in the parameter file. Another way to do this is by setting the system environment variable TMPDIR. |

## References

- S. R. White, Density matrix formulation for quantum renormalization groups, Phys. Rev. Lett. 69, 2863 (1992).
- S. R. White, Density-matrix algorithms for quantum renormalization groups, Phys. Rev. B 48, 10345 (1993).
- U. Schollwöck, The density-matrix renormalization group, Rev. Mod. Phys. 77, 259 (2005).
- K. Hallberg, Density Matrix Renormalization: A Review of the Method and its Applications, arXiv:cond-mat/0303557.
- R. Noack and S. Manmana, Diagonalization- and Numerical Renormalization-Group-Based Methods for Interacting Quantum Systems, arXiv:cond-mat/0510321
