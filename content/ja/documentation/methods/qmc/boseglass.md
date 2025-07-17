
---
title: Bose Glass 
math: true
weight: 8
---

## The Bose glass model

The following parameter file sets up a Monte Carlo simulation of the quantum Bose Hubbard model with a random site dependent chemical potential on a square lattice using the worm code. The chemical potential is drawn from an uniform distribution in the range [-5,+5].

    LATTICE="inhomogeneous square lattice";
    L=4;

    MODEL="boson Hubbard";
    NONLOCAL=0;
    U    = 1.0;
    Nmax = 2;
    t = 1.0;
    T = 0.1;
    delta = 5.0;
    SWEEPS=500000;
    THERMALIZATION=10000;

    { DISORDERSEED = 34275; mu=delta*2*(random()-0.5); }
    { DISORDERSEED = 49802; mu=delta*2*(random()-0.5); }
    { DISORDERSEED = 82529; mu=delta*2*(random()-0.5); }

In order to use periodic boundary conditions you have to adjust the boundary type of the inhomogeneous square lattice in the `lattice.xml` file:

    <LATTICEGRAPH name = "inhomogeneous square lattice">
    <FINITELATTICE>
        <LATTICE ref="square lattice"/>
        <PARAMETER name="W" default="L"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL ref="simple2d"/>
    <INHOMOGENEOUS><VERTEX/></INHOMOGENEOUS>
    </LATTICEGRAPH>

You can run the simulation by using the same sequence of commands as in the worm algorithm tutorial.


