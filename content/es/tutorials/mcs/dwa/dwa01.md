---
title: DWA-01 Retomando MC05
math: true
toc: true
weight: 1
---

## Transiciones de fase cuánticas en el modelo de Bose-Hubbard

**Atención:** esta implementación del algoritmo directed worm está obsoleta y será eliminada en una futura versión de ALPS. Actualmente solo debería usarse para modelos de Bose-Hubbard con interacciones exclusivamente en el sitio.

Como ejemplo del código QMC del algoritmo directed worm, estudiaremos una transición de fase cuántica en el modelo de Bose-Hubbard.

## Densidad superfluida en el modelo de Bose-Hubbard

### Preparación y ejecución de la simulación desde la línea de comandos

Creamos el archivo de parámetros `parm1a` para configurar simulaciones Monte Carlo del modelo de Bose-Hubbard en una red cuadrada de 4x4 sitios para varios parámetros de hopping ($t=0.01, 0.02, ..., 0.1$) usando el código dwa. Es el mismo archivo de parámetros que se usó para el tutorial worm de ALPS [MCO5](../../mc05).

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
    
Usando la secuencia estándar de comandos podemos ejecutar la simulación con el código cuántico `dwa`:

    parameter2xml parm1a
    dwa --Tmin 5 --write-xml parm1a.in.xml

También podemos ejecutar el código usando los métodos habituales de Python.

### Evaluación de la simulación y preparación de gráficos con Python

Cargamos los resultados de todos los archivos de salida que comienzan con `parm1a` y recopilamos la densidad de magnetización en función del campo magnético.

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

## La transición del aislante de Mott al superfluido

A continuación queremos obtener una mejor localización de la transición de fase. Para ello simulamos una red cuadrada bidimensional para varios tamaños de sistema y buscamos un cruce de la cantidad $\rho_s L$.

### Preparación y ejecución de la simulación desde la línea de comandos

En el archivo de parámetros `parm1b`, nos enfocamos en la región alrededor del punto crítico para tres tamaños de sistema $L=4,6$, y 8:

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

### Evaluación de la simulación y preparación de gráficos con Python

Cargamos los resultados de todos los archivos de salida que comienzan con `parm1b` y recopilamos la rigidez escalada en función del parámetro de hopping.

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

Nótese que la leyenda y las etiquetas quedan bien configuradas.

**Para los expertos:** 
La transición de fase cuántica entre el superfluido y la fase aislante de Mott puede tener dos clases de universalidad diferentes. Primero, si trabajamos a densidad constante, entonces la transición tendrá exponente dinámico $z=1$ y puede describirse mediante el modelo XY 3D (más precisamente, una CFT (2+1)D emergente). Para las simulaciones, esto implica que debemos escalar la temperatura inversa linealmente con el tamaño del sistema y asegurarnos de trabajar en el ensemble canónico, o exigir que la densidad promedio sea 1, $\langle n \rangle = 1$, lo cual también funciona en este caso. Segundo, si impulsamos la transición cambiando la densidad (como en un impulso con potencial químico), entonces el exponente dinámico es $z=2$ y la transición es de tipo campo medio, describiendo unas pocas partículas (huecos) sobre un vacío (reescalado). Nótese que en el tutorial no seguimos ninguno de estos dos protocolos, por lo que nuestros resultados solo localizan aproximadamente la transición de fase. La forma de escala de la rigidez usada en el tutorial es la del modelo XY 3D. Remitimos a [este artículo](https://arxiv.org/abs/0710.2703) de B. Capogrosso-Sansone et al. para un estudio detallado de Monte Carlo cuántico del modelo de Bose-Hubbard 2D.

## Colaboradores

- Matthias Troyer
- Ping Nang Ma

## Revisiones
- Lode Pollet


