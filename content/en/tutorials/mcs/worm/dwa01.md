---
title: DWA-01 Revisiting MC05
math: true
toc: true
weight: 1
---

## Quantum phase transitions in the Bose-Hubbard model

**Attention:** this implementation of the directed worm algorithm is an experimental code and should be used only for the Bose Hubbard model without interactions between neighbors. Otherwise the code may crash or yield incorrect results.

As an example of the directed worm algorithm QMC code, we will study a quantum phase transition in the Bose-Hubbard mode.

## Superfluid density in the Bose Hubbard model

### Preparing and running the simulation from the command line

We create the parameter file `parm1a` to set up Monte Carlo simulations of the quantum Bose Hubbard model on a square lattice with 4x4 sites for a couple of hopping parameters (t=0.01, 0.02, ..., 0.1) using the dwa code.

    LATTICE="square lattice";
    L=4;
 
    MODEL="boson Hubbard";
    Nmax = 2;
    U    = 1.0;
    mu   = 0.5;
 
    T    = 0.1;
 
    SWEEPS=5000000;
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

We next want to pin down the location of the phase transition more accurately. For this we simulate a two-dimensional square lattice for various system sizes and look for a crossing of the quantity $\rho_s L$.

### Preparing and running the simulation from the command line

In the parameter file `parm1b`, we focus on the region around the critical point for three system sizes L=4,6, and 8:

    LATTICE="square lattice";

    MODEL="boson Hubbard";
    Nmax  =2;
    U    = 1.0;
    mu   = 0.5;

    T    = 0.05;

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

We load the results from all output files starting with `parm1b` and collect the magntization density as a function of magnetic field.

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

Note the legend and labels that are nicely set up.

## Contributors

- Matthias Troyer
- Ping Nang Ma



