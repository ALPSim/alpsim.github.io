---
title: DWA-01 Revisiting MC05
math: true
toc: true
weight: 1
---

## Quantum phase transitions in the Bose-Hubbard model

**Attention:** this implementation of the directed worm algorithm is deprecated and will be removed in a future version of ALPS. It should currently only be used for Bose-Hubbard models with on-site interactions only. Vistrails input files are not available. 

As an example of the directed worm algorithm QMC code, we will study a quantum phase transition in the Bose-Hubbard model.

## Superfluid density in the Bose-Hubbard model

### Preparing and running the simulation from the command line

We create the parameter file `parm1a` to set up Monte Carlo simulations of the Bose-Hubbard model on a square lattice with 4x4 sites for a couple of hopping parameters ($t=0.01, 0.02, ..., 0.1$) using the dwa code. It is the same parameter file that was used for the ALPS worm [MCO5](../mc05.md) tutorial.

    LATTICE="square lattice";
    L=4;
 
    MODEL="boson Hubbard";
    Nmax = 2;
    U    = 1.0;
    mu   = 0.5;
 
    T    = 0.1;
 
    SWEEPS=20000000;
    THERMALIZATION=100000;
    SKIP=500;
 
    MEASURE[Winding Number]=1
 
    { t=0.01; }
    { t=0.02; }
    { t=0.03; }
    { t=0.04; }
    { t=0.05; }
    { t=0.06; }
    { t=0.07; }
    { t=0.08; }
    { t=0.09; }
    { t=0.1;  }
    
Using the standard sequence of commands we can run the simulation using the quantum `dwa` code:

    parameter2xml parm1a
    dwa --Tmin 5 --write-xml parm1a.in.xml

We may also run the code using the usual Python methods.

### Evaluating the simulation and preparing plots using Python

We load the results from all output files starting with `parm1a` and collect the magnetization density as a function of magnetic field.

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot as aplt

    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'),'Stiffness')
    rhos = pyalps.collectXY(data,x='t',y='Stiffness')

    plt.figure()
    aplt.plot(rhos)
    plt.xlabel('Hopping $t/U$')
    plt.ylabel('Superfluid density $\\rho _s$')
    plt.show()

## The transition from the Mott insulator to the superfluid

We next want obtain a better location of the phase transition. For this we simulate a two-dimensional square lattice for various system sizes and look for a crossing of the quantity $\rho_s L$.

### Preparing and running the simulation from the command line

In the parameter file `parm1b`, we focus on the region around the critical point for three system sizes $L=4,6$, and 8:

    LATTICE="square lattice";

    MODEL="boson Hubbard";
    Nmax  =2;
    U    = 1.0;
    mu   = 0.5;

    T    = 0.1;

    SWEEPS=2000000;
    THERMALIZATION=150000;
    SKIP=500;

    MEASURE[Winding Number]=1;

    { L=4; t=0.01; }
    { L=4; t=0.02; }
    { L=4; t=0.03; }
    { L=4; t=0.04; }
    { L=4; t=0.05; }
    { L=4; t=0.06; }
    { L=4; t=0.07; }
    { L=4; t=0.08; }
    { L=4; t=0.09; }
    { L=4; t=0.1;  }

    { L=6; t=0.01; }
    { L=6; t=0.02; }
    { L=6; t=0.03; }
    { L=6; t=0.04; }
    { L=6; t=0.05; }
    { L=6; t=0.06; }
    { L=6; t=0.07; }
    { L=6; t=0.08; }
    { L=6; t=0.09; }
    { L=6; t=0.1;  }

    { L=8; t=0.01; }
    { L=8; t=0.02; }
    { L=8; t=0.03; }
    { L=8; t=0.04; }
    { L=8; t=0.05; }
    { L=8; t=0.06; }
    { L=8; t=0.07; }
    { L=8; t=0.08; }
    { L=8; t=0.09; }
    { L=8; t=0.1;  }

### Evaluating the simulation and preparing plots using Python

We load the results from all output files starting with `parm1b` and collect the scaled stiffness as a function of the hopping parameter.

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot as aplt

    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1b'),'Stiffness')
    rhos = pyalps.collectXY(data,x='t',y='Stiffness',foreach=['L'])

    for rho in rhos:
    rho.y = rho.y * float(rho.props['L'])

    plt.figure()
    aplt.plot(rhos)
    plt.xlabel('Hopping $t/U$')
    plt.ylabel('$\\rho _sL$')
    plt.legend()
    plt.title('Scaling plot for Bose-Hubbard model')
    plt.show()

Note that the legend and labels that are nicely set up.

**For the experts:** The quantum phase transition between the superfluid and the Mott insulating phase can have two different university classes. First, if we work at constant density, then the transition will have dynamical exponent z=1 and can be described by an emergent (2+1)D CFT. For the simulations, this implies that we must scale the temperature linearly with system size and make sure that we work in the canonical ensemble or enforce that the average density is 1, $ <n>=1 $, which also works in this case. Second, if we drive the transition by changing the density (as in a drive with chemical potential), then the dynamical exponent z=2 and the transition is mean-fieldish describing a few particles (holes) on top of a (rescaled) vacuum. Note that in the tutorial we do neither of these protocols and our results are therefore only approximately locating the phase transition. Nevertheless we are close to unit density and used the correct scaling form of the stiffness in that case. We refer to [this paper](https://arxiv.org/abs/0710.2703) by B. Capogrosso-Sansone et al. for a detailed quantum Monte Carlo study of the 2D Bose-Hubbard model.

## Contributors

- Matthias Troyer
- Ping Nang Ma

## Revisions
- Lode Pollet


