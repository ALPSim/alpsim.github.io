
---
title: Particle in a box 
math: true
weight: 10
---

## ALPS application: noninteracting DMRG

The noninteracting DMRG package is one of the applications of the ALPS project. It provides a generic implementation of a simplified DMRG program for noninteracting quantum systems, basing on the example program presented in [^Preschel].
The application supports the simulation of tight-binding systems and extended tight-binding systems (e.g. with next-nearest neighbour hopping, external local potentials, ...) on arbitrary lattices. It calculates the ground state energy and the ground state wavefunction of the system. Note that it is not possible to handle interaction terms using this program.
This program is not really intended to be a serious calculation tool - instead its main purpose is to illustrate how the DMRG method works via a simple non-interacting problem. To this end, the comments in the source code itself should be helpful.


## Running a simulation

In order to run a simulation, one needs to create a parameter file, e.g.

    LATTICE_LIBRARY = "lattices.xml"
    LATTICE = "chain lattice"
    L = 20
    SWEEPS = 100
    OUTPUT_LEVEL = 1
    WAVEFUNCTION_FILE = "psi.dat"
    t = 1.2
    V = 0

These parameters describe a calculation for a single particle tight-binding model using the "chain lattice" defined in the `lattices.xml` file. The "chain lattice" defines a 1D periodic lattice of length given by the parameter L (specified in this example as L=20). The hopping parameter t acts between the bonds of the lattice, thus the lattice effectively specifies the boundary condition (for the "chain lattice", this is periodic). As is typical for DMRG, open boundary conditions are more efficient and converge in far fewer sweeps than periodic boundaries. This simulation will carry out 100 complete DMRG sweeps. The variable OUTPUT_LEVEL specifies the amount of debug information produced during the sweeps, a higher number for more information. To start the calculation, make sure that the lattice library `lattices.xml` is in the current directory and simply execute `simple_dmrg <  parameters`. The resultant wavefunction is written to standard output as well as to the output file specified by  `WAVEFUNCTION_FILE`.

## Input parameters

The simulation is controlled by the following input parameters that can be specified in the parameter file:

| **Name** | **Default** | **Description** |
| :------- | :---------- | :-------------- |
| LATTICE_LIBRARY | lattices.xml | path to a file containing lattice descriptions |
| LATTICE | | name of the lattice |
| t | 1 | strength of nearest-neighbour hopping term |
| t# | 0 | hopping parameter on a bond with type # (#=0,1,...) |
| V | 0 | local potential applied to all sites |
| V# | 0 | local potential on a site with type # (#=1,2,...) |
| SWEEPS | | number of finite-system-sweeps |
| OUTPUT_LEVEL | 1 | amount of output information during the sweeps |
| WAVEFUNCTION_FILE | | output file |
| PRECISION | 10 | precision for the output stream |

### System properties: boundary conditions and extension

The boundary conditions and the extension (in one or higher dimensions) are described in the lattice library.

### Next-nearest-neighbour hopping terms

Hopping terms to other than the nearest neighbour sites can be specified by using a different unit cell when specifying the lattice. The different hopping terms should correspond to different bond types with the hopping parameter controlled by t# in the parameter file. t0 defaults to t, all other t# default to 0.

### Local potential

The parameter V specifies a function that is used for an external potential. A uniform additional potential is specified by a single number describing its strength, but a more interesting case is to have a spatially varying potential whereby V as a function of the coordinates of the lattice sites. The following parameter file e.g. simulates a particle in a one-dimensional harmonic potential:

    LATTICE_LIBRARY = "lattices.xml"
    LATTICE = "chain lattice"
    L = 200
    SWEEPS = 20
    V = 4 * (x/L - 0.5) * (x/L - 0.5)

A periodic potential can be specified by its fourier series expansion. For example, a triangular potential with width N/L is specified approximately as by

    K = 2*3.1415927*N/L
    V = cos(K*x) + cos(3*K*x) / 9 + cos(5*K*x) / 25 + cos(7*K*x) / 36

Note that V specifies the external potential which is applied to every site of the lattice. It is also possible to assing a potential only to certain site types, which is done by specifing a function V# (with # being site type specified in the lattice description). If a V# potential is defined, it is added to the global potential V for the relevant sites.
Again, for periodic systems or complex potentials, the convergence can be quite slow; for the triangular potential, 100 sweeps is enough to get good convergence for 40 sites with N=4, but compare this with 100 sites and N=10. This is partly due to the simplistic way the wavefunction is constructed prior to the first proper DMRG sweep.

### Output

The output is controlled by the parameters OUTPUT_LEVEL, WAVEFUNCTION_FILE, and PRECISION.
The OUTPUT_LEVEL parameter can range from 0 to 4. The higher the value, the higher the amount of information produced during the finite system sweeps. The default is 1, which shows the energy at the end of every sweep. Level 4 produces a large amount of output and is useful only for debugging or following the details of the calculation very closely.
The output file is specified by WAVEFUNCTION_FILE, and the parameter PRECISION sets the precision of the printed results. The WAVEFUNCTION_FILE is formatted in a way that it can be directly plotted using xmgrace, e.g. "xmgrace psi.dat".

## Measurements

Within this simple dmrg application, only the ground state energy and ground state wavefunction are calculated. Observables can be calculated afterwards basing on the output wavefunction.

## Contributors

The following persons have contributed to the noninteracting dmrg application:

- Salvatore Manmana
- Ian McCulloch
- Matthias Troyer
- Reinhard Noack


[^Preschel]: I. Peschel, X. Wang, M. Kaulke, and K. Hallberg, Chapter 3 of "Density Matrix Renormalization - A New Numerical Method in Physics" (Springer, Berlin, 1999).
