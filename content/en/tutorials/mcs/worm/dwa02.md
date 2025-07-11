
---
title: DWA-02 Density Profile
math: true
toc: true
weight: 2
---

## Density profile

As a second example of the directed worm algorithm QMC code, we will study the density profile of an optical lattice in an harmonic trap.

### Column integrated density

In this subsection, we want to mimick the experimental setup.

#### Preparing and running the simulation from the command line

We create the parameter file `parm2a` to set up a Monte Carlo simulation of a $120^3$ optical lattice trap that mimicks the experiment:

    LATTICE="inhomogeneous simple cubic lattice"
    L=120

    MODEL='boson Hubbard"
    Nmax=20

    t=1.
    U=8.11
    mu="4.05 - (0.0073752*(x-(L-1)/2.)*(x-(L-1)/2.) + 0.0036849*(y-(L-1)/2.)*(y-(L-1)/2.) + 0.0039068155*(z-(L-1)/2.)*(z-(L-1)/2.))"
 
    THERMALIZATION=1500
    SWEEPS=7000
    SKIP=50
 
    MEASURE[Local Density]=1

    { T=1. }
    
(This simulation roughly takes roughly 3 hours.)

We load the local density measurements from all output files starting with `parm2a`.

    import pyalps
    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm2a'), 'Local Density');

and visualize the column integrated density:

    import pyalps.plot as aplt;
    aplt.plot3D(data, centeredAtOrigin=True)

### Cross section density

We want to observe a Mott plateau.

We create the parameter file `parm2a` to set up a Monte Carlo simulation of a $80^3$ optical lattice trap that mimicks the Bloch experiment:

    LATTICE="inhomogeneous simple cubic lattice"
    L=60

    MODEL="boson Hubbard"
    Nmax=20
 
    t=1.
    U=60.
    mu="40. - (0.09416*(x-(L-1)/2.)*(x-(L-1)/2.) + 0.12955*(y-(L-1)/2.)*(y-(L-1)/2.) + 0.11496*(z-(L-1)/2.)*(z-(L-1)/2.))"

    THERMALIZATION=1000000
    SWEEPS=3000000
    SKIP=1000

    MEASURE[Local Density]=1

    { T=1. }

We run the same code as last time on `parm1b` to prepare the plots, except this time, we want to visualize the cross-section density at the center. Therefore, we pass `layer="center"` to `aplt.plot3D`.

    aplt.plot3D(data, centeredAtOrigin=True, layer="center")

## Contributors

- Matthias Troyer
- Ping Nang Ma


