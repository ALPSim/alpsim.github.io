
---
title: Bose Glass 
math: true
weight: 8
---

## El modelo de Bose glass

El siguiente archivo de parámetros configura una simulación de Monte Carlo del modelo cuántico de Bose-Hubbard con un potencial químico aleatorio dependiente del sitio en una red cuadrada usando el código worm. El potencial químico se extrae de una distribución uniforme en el rango [-5,+5].

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

Para usar condiciones de contorno periódicas, debe ajustar el tipo de contorno de la red cuadrada no homogénea en el archivo `lattice.xml`:

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

Puede ejecutar la simulación usando la misma secuencia de comandos que en el tutorial del algoritmo worm.


