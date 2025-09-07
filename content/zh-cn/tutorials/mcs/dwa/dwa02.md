---
title: DWA-02 Density Profile
math: true
toc: true
weight: 2
---

## Density profile

**Attention:** this implementation of the directed worm algorithm is deprecated and will be removed in a future version of ALPS. It should currently only be used for Bose-Hubbard models with on-site interactions only.

As a second example of the directed worm algorithm QMC code, we will study the density profile of the Bose-Hubbard model subject to an harmonic trap.

### Column integrated density

In this subsection, we compute the density profile of a superfluid in a harmonic trap. To visualize, we will sum the density over the third direction.

#### Preparing and running the simulation from the command line

We create the parameter file `parm2a` to set up a Monte Carlo simulation of a $21^3$ optical lattice trap:

    LATTICE="inhomogeneous simple cubic lattice"
    L=21

    MODEL='boson Hubbard"
    Nmax=5

    t=1.
    U=8.11
    mu="4.05 - (0.2*(x-(L-1)/2.)*(x-(L-1)/2.) + 0.2*(y-(L-1)/2.)*(y-(L-1)/2.) + 0.2*(z-(L-1)/2.)*(z-(L-1)/2.))"
 
    THERMALIZATION=2000
    SWEEPS=20000
    SKIP=10
 
    MEASURE[Local Density]=1

    { T=1. }
    

We load the local density measurements from all output files starting with `parm2a`.

    import pyalps
    import pyalps.plot as aplt;
    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm2a'), 'Local Density');

and visualize the column integrated density:

    aplt.plot3D(data, centeredAtOrigin=True)

### Cross section density

We want to observe a Mott plateau in the trapand therefore create the parameter file `parm2b` to set up a Monte Carlo simulation of the Bose-Hubbard model with a large interaction strength:

    LATTICE="inhomogeneous simple cubic lattice"
    L=21

    MODEL="boson Hubbard"
    Nmax=5
 
    t=1.
    U=60.
    mu="30. - (0.2*(x-(L-1)/2.)*(x-(L-1)/2.) + 0.2*(y-(L-1)/2.)*(y-(L-1)/2.) + 0.2*(z-(L-1)/2.)*(z-(L-1)/2.))"

    THERMALIZATION=100000
    SWEEPS=2000000
    SKIP=1000

    MEASURE[Local Density]=1

    { T=1. }

We run the same code as last time on `parm2b` to prepare the plots, except this time, we want to visualize the cross-section density at the center. Therefore, we pass `layer="center"` to `aplt.plot3D`.

    import pyalps
    import pyalps.plot as aplt;
    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm2b'), 'Local Density');
    aplt.plot3D(data, centeredAtOrigin=True, layer="center")

By rotating the figure, a clear Mott plateau can be seen in the center of the trap.

## Contributors

- Matthias Troyer
- Ping Nang Ma

## Revisions

- Lode Pollet

