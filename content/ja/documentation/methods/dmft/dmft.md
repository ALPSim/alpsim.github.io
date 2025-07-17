
---
title: Dynamical Mean Field Theory and Impurity Solvers
math: true
weight: 9
---

## List of Parameters

### Physical parameters

| **Name** | **Description** |
| :------- | :-------------- |
| U | the Hubbard interaction U |
| BETA | the inverse temperature |
| MU | the chemical potential |
| H | the magnetic field in the quantization axis (conventionally $z$) direction (BUT: the solvers do ignore the variable!) |
| SITES | number of impurity sites (for DMFT: 1) |
| FLAVORS | number of flavors/orbitals of the impurity (commonly 2: spin up/down) |
| t | in case of Bethe lattice it does provide the hopping (the bandwidth is then $W=4t$, the half-bandwidth is $D=2t$); if the option TWODBS is switched on then it does set the nearest-neighbor hopping on the square or hexagonal lattice |
| t0, t1, ... | (available currently only for selfconsistency loop in imaginary time) sets the hopping for the Bethe lattice in multiband case (flavors 2i and 2i+1 share the same parameter ti) |
| J | coupling for the multiband problems |
| U' | (by default U-2J) |
| tprime | applies only if the option TWODBS is switched on and only for the square lattice, then it does set the next-nearest-neighbor hopping |
| TWODBS | (by default sets the square lattice) you may choose either square or hexagonal lattice |

### Parameters for the self-consistency loop 

| **Name** | **Description** |
| :------- | :-------------- |
| OMEGA_LOOP | set it 1 unless you want to work with semicircular density of states (corresponding to the Bethe lattice in infinitely many dimensions) |
| ANTIFERROMAGNET | if 1 then the antiferromagnetic self-consistency loop will be employed (formula 97 in review '96 of A.Georges et al) |
|SYMMETRIZATION | if 1 then paramagnetic solution is enforced (in versions before 2.1: there has been a misspelling SYMMATRIZATION at several places and a usage of both, SYMMETRIZATION and set to the same value was required) |
| MAX_IT | maximum number of iteration in self-consistency loop (usually 10-20 will be enough) |
| CONVERGED | criterium for stopping the self-consistency loop before reaching MAX_IT - if the maximum change in Green's function in Matsubara representation is less than CONVERGED, the loop will stop |
| TOLERANCE | (only for hirschfyesim) as above |
| RELAX_RATE | (by default 1; currently implemented only for selfconsistency loop with OMEGA_LOOP switched on) the new Green's function are in general computed as RELAX\_RATE \* $G\_{new}(i\omega_n)$ + (1-RELAX\_RATE) \* $G\_{old}(i\omega_n)$, which may help if oscillations occur |

### General parameters

| **Name** | **Description** |
| :------- | :-------------- |
| GENERAL_FOURIER_TRANFORMER | set it on if you have OMEGA_LOOP and other than the Bethe lattice |
| EPS_i (i=0,1,...,FLAVORS-1) | potential shift for the flavor i (necessary for GENERAL_FOURIER_TRANSFORMER) |
| EPSSQ_i (i=0,1,...,FLAVORS-1) | the second moment of the bandstructure for the flavor i (necessary for GENERAL_FOURIER_TRANSFORMER) |
| DOSFILE | sets the name for the file containing the density of states (expected 2 columns with energy value and corresponding density of states at that energy; equidistant energies required; odd number of rows required due to Simpson integration) |
| TWODBS | switches on the Hilbert transformation for 2-dimensional systems, currently supported square lattice (with nearest and next-nearest neighbor hoppings) and hexagonal lattice (with nearest neighbor hoppings) \[Note: a different 2-dimensional lattice may be easily added\] |
| L | optional parameter available in case of TWODBS is on; defines the half of the linear discretization in the integration in the self-consistency (default: 200) |
| SOLVER | specifies the impurity solver ("Hybridization" or "Interaction Expansion"; the solver "Hirsch-Fye" does suffer from discretization errors and is thus not recommended) |

### Parameters for the initial/final Weiss field

| **Name** | **Description** |
| :------- | :-------------- |
| H_INIT | magnetic field in the quantization axis (conventionally $z$) direction, which is used in computation of the non-interacting initial G0 (if it is not loaded) |
| G0OMEGA_INPUT | name for the text file specifying the Weiss field in Matsubara frequencies $i\omega_n$ (expected 1+FLAVORS columns, and total NMATSUBARA rows, use only with OMEGA_LOOP) |
| G0TAU_INPUT | name for the text file specifying the Weiss field in imaginary time representation (expected 1+FLAVORS columns, and total $N+1$ rows, only with OMEGA_LOOP switched off) |
| GOMEGA_input | specifies the name for the text file where the initial G0 in Matsubara representation will be written (by default it is not written, as it is identical with G0_omega_1) |
| G0TAU_input | name for the text file for the output of the initial G0 in imaginary time (by default it is not written, as it is identical with G0_tau_1) |
| G0OMEGA_output | name for the output file containing the final Weiss field in Matsubara frequencies (by default G0omega_output)(with OMEGA_LOOP) |
| G0TAU_output | name for the output file containing the final Weiss field in Matsubara frequencies (by default G0tau_output) (with OMEGA_LOOP off) |
| INSULATING | if you have specified this option, then the initial G0 will be set up in the insulating limit |

### Parameters setting the precision of representation of the Green's function and the Weiss field

| **Name** | **Description** |
| :------- | :-------------- |
| NMATSUBARA | number of Matsubara frequencies used to represent the Green's function and the Weiss field (usually equals N) |
| N | number of bins for the Green's function and the Weiss field in imaginary time (represented in total by N+1 values) (recommended: roughly 1000 for the continuous-time solvers) |

### Hybridization expansion impurity solver parameters

| **Name** | **Description** |
| :------- | :-------------- |
| MAX_TIME | sets the maximum time given in seconds spent on the impurity problem solving (basically this sets the duration of a single iteration) |
| SWEEPS | number of desired sweeps performed during the calculation (recommendation: set it very high, e.g. $10^9$ and the solver will stop on the time limit given by MAX_TIME) |
| THERMALIZATION | number of sweeps before the Monte Carlo measurements in order to reach configuration close to equilibrium (of the order of 1000) |
| EPSSQAV | the second moment of the bandstructure (necessary if you have specified your own DOSFILE) |
| N_ORDER | setting histogram size (if the hybridization order is larger then it will be not stored in the histogram) (value of the order of 100 might be reasonable) |
| N_MEAS | number of Monte Carlo steps between measurements (of the order of 10000) |
| N_SHIFT | number of shifts of segments in a single Monte Carlo step (apparently unused, so 0) |
| MEASURE_FOURPOINT | if switched on then the four-point correlators are being measured |
| N4point | (only used if MEASURE_FOURPOINT is on) description missing so far |
| CHECKPOINT | filename prefix for checkpointing files and for the final h5 and xml output |

### Interaction expansion1 impurity solver parameters 

| **Name** | **Description** |
| :------- | :-------------- |
| MAX_TIME | sets the maximum time given in seconds spent on the impurity problem solving |
| SWEEPS | number of desired sweeps performed during the calculation (recommendation: set it very high, e.g. $10^9$ and the solver will stop on the time limit given by MAX_TIME) |
| THERMALIZATION | number of sweeps before the Monte Carlo measurements in order to reach configuration close to equilibrium (of the order of 1000) |
| SWEEP_MULTIPLICATOR | (default: 1) |
| NRUNS | (default: 1) |
| ALPHA | |
| RECALC_PERIOD | (default: 5000) |
| MEASUREMENT_PERIOD | (default: 200) |
| CONVERGENCE_CHECK_PERIOD | (default provided) |
| ALMOSTZERO | (default: $10^{-16}$) |
| NSELF | (default: 10N) |
| NMATSUBARA_MEASUREMENTS | (default: NMATSUBARA) |
| HISTOGRAM_MEASUREMENT | (default: false) |
| GET_COMPACTED_MEASUREMENTS | |
| ATOMIC | |
| TAU_DISCRETIZATION_FOR_EXP | |
| CHECKPOINT | filename prefix for the checkpointing files and for the final h5 and xml output |

### Additional parameters 

| **Name** | **Description** |
| :------- | :-------------- |
| SEED | random seed for the pseudorandom generator |
| RNG | pseudorandom generator used (default is "mt19937"), might be switched to "lagged_fibonacci607" |

## Usage notes

- Remark on bipartite lattices: the ANTIFERROMAGNET option does assume a Neel-like ordering and requires thus a bipartite lattice. Note that on a bipartite lattice the density of states is symmetric (unless you apply a global potential shift).
- Since revision 6217, if you provide the DOSFILE or if you use TWODBS and if none of the parameters EPS_i, EPSSQ_i, EPSSQAV is set, then the EPS_i will be set to the first moment of the normalized DOS (in case of TWODBS: 0) and the EPSSQ_i and EPSSQAV will be set to the second moment of the normalized DOS using the provided density of states (in case of TWODBS: using the hard-coded values).
- Since revision 6217 you may use TWODBS="hexagonal" to simulate the 2-dimensional hexagonal lattice (nearest-neighbor hoppings only). If you use TWODBS with other value, square lattice is assumed.

## Input/output files 

### The files with prefix BASENAME: (where BASENAME is the name of the parameter input file)

- BASENAME: it is the input file to be loaded by the application `dmft`
- BASENAME.h5: contains the iteration resolved impurity Green's function $G(\tau)$ and the Weiss field $G^0(\tau)$ in the imaginary time representation; if the selfconsistency loop has been performed in Matsubara representation (= if OMEGA_LOOP has been on) then there will be stored the $G(i\omega_n)$ and $G^0(i\omega_n)$ as well. The selfenergy is there not stored directly, but may be obtained via Dyson equation easily (look into DMFT-01 An introduction to DMFT)

### The output/input files in Matsubara representation: (text file which consists of NMATSUBARA rows, each for one Matsubara frequency) 

- G_omega_i (G0_omega_i): contains the imaginary part of the Green's function (Weiss field) given in Matsubara frequencies after the i-th iteration; rows contain the $\omega_n$ followed by the imaginary part of the Green's function (Weiss field) for each flavor; thus there are 1+FLAVORS columns in the file
- G_omegareal_i (G0_omegareal_i): the same as above for the real part
- selfenergy_i: contains the selfenergy after the i-th iteration; each row consists of $\omega_n$ followed by the real and imaginary part of the selfenergy for each flavor; thus there are 1+2FLAVORS columns in the file
- G0omega_output (unless not specified differently by the variable G0OMEGA_output): contains the n (corresponding to $\omega_n=\frac{(2n+1)\pi}{\beta})$ followed by the complex Weiss field for each flavor; thus there is one integer column followed by FLAVORS columns of complex numbers defined by the real and imaginary part in brackets
- G0OMEGA_INPUT: variable specifying the input file with the initial Weiss field in Matsubara representation; does expect the same format as the above output file; thus you may copy it and start a simulation from it

### The output/input files in imaginary time representation: (text file which consists of $N+1$ rows, each for one imaginary time $\in\langle 0,\beta\rangle$)

- G_tau_i (G0_tau_i): contains the (real) Green's function (Weiss field) after the i-th iteration; rows contain the $\tau_n$ followed by the Green's function (Weiss field) for each flavor; thus there are 1+FLAVORS columns in the file 
- G0tau_output (unless not specified differently by the variable G0TAU_output): contains the n (corresponding to $\tau_n=\frac{n}{N}\beta$) followed by the complex Weiss field for each flavor; thus there is one integer column followed by FLAVORS columns of complex numbers defined by the real and imaginary part in brackets; in total $N+1$ rows
- G0OMEGA_INPUT: variable specifying the input file with the initial Weiss field in imaginary time representation; does expect the same format as the above output file; thus you may copy it and start a simulation from it

### The output files with prefix given by the optional variable CHECKPOINT:

- CHECKPOINT.h5: contains the measurements for each iteration
- CHECKPOINT.xml: contains the input parameters and run information
- CHECKPOINT.run\*: contains information to rerun the simulation (these are the true checkpoints); for each process

### The output files for the hybridization expansion impurity solver: (text files) 

- overlap: i-th row contains the $\langle n\_\downarrow n\_\uparrow\rangle$ in the i-th iteration 
- matrix_size:


## Literature

- A review on DMFT: A. Georges, G. Kotliar, W. Krauth, and M. J. Rozenberg, Dynamical mean-field theory of strongly correlated fermion systems and the limit of infinite dimensions, Rev. Mod. Phys. 68, 13 (1996).
- On the hybridization expansion impurity solver: P. Werner and A. J. Millis, Hybridization expansion impurity solver: General formulation and application to Kondo lattice and two-orbital models, Phys. Rev. B 74, 155107 (2006).
