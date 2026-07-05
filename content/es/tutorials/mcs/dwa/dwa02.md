---
title: DWA-02 Perfil de Densidad
math: true
toc: true
weight: 2
---

## Perfil de densidad

**Atención:** esta implementación del algoritmo directed worm está obsoleta y será eliminada en una futura versión de ALPS. Actualmente solo debería usarse para modelos de Bose-Hubbard con interacciones exclusivamente en el sitio.

Como segundo ejemplo del código QMC del algoritmo directed worm, estudiaremos el perfil de densidad del modelo de Bose-Hubbard sometido a una trampa armónica.

### Densidad integrada por columna

En esta subsección, calculamos el perfil de densidad de un superfluido en una trampa armónica. Para visualizarlo, sumaremos la densidad sobre la tercera dirección.

#### Preparación y ejecución de la simulación desde la línea de comandos

Creamos el archivo de parámetros `parm2a` para configurar una simulación Monte Carlo de una trampa de red óptica $21^3$:

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
    

Cargamos las mediciones de densidad local de todos los archivos de salida que comienzan con `parm2a`.

    import pyalps
    import pyalps.plot as aplt;
    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm2a'), 'Local Density');

y visualizamos la densidad integrada por columna:

    aplt.plot3D(data, centeredAtOrigin=True)

### Densidad de sección transversal

Queremos observar una meseta de Mott en la trampa, por lo que creamos el archivo de parámetros `parm2b` para configurar una simulación Monte Carlo del modelo de Bose-Hubbard con una gran intensidad de interacción:

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

Ejecutamos el mismo código que la vez anterior sobre `parm2b` para preparar los gráficos, excepto que esta vez queremos visualizar la densidad de la sección transversal en el centro. Por ello, pasamos `layer="center"` a `aplt.plot3D`.

    import pyalps
    import pyalps.plot as aplt;
    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm2b'), 'Local Density');
    aplt.plot3D(data, centeredAtOrigin=True, layer="center")

Al rotar la figura, se puede apreciar claramente una meseta de Mott en el centro de la trampa.

## Colaboradores

- Matthias Troyer
- Ping Nang Ma

## Revisiones

- Lode Pollet
