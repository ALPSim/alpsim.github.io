---
title: CT-HYB Impurity Solver
linkTitle: CT-HYB
description: "Simula el apantallamiento Kondo de una impureza magnética usando el solucionador de impurezas cuánticas CT-HYB."
weight: 3
math: true
---

{{< callout type="info" >}}
Este tutorial asume que pyalps ya está instalado. Si aún no lo has configurado, consulta la guía de [Primeros Pasos](../).
{{< /callout >}}

Este tutorial demuestra el solucionador de Monte Carlo cuántico de **expansión de hibridización en tiempo continuo (continuous-time hybridization-expansion, CT-HYB)** — un método exacto y numéricamente no sesgado para modelos de impurezas cuánticas, introducido originalmente por Werner et al. ([Phys. Rev. Lett. 97, 076405, 2006](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.97.076405)). Simulamos el **efecto Kondo**: a medida que disminuye la temperatura, los electrones de conducción apantallan una impureza magnética, reduciendo progresivamente su momento local efectivo. El momento efectivo adimensional es $4T\chi_{dd}$, donde $\chi_{dd}$ es la susceptibilidad de espín local. A alta temperatura se acerca a 1 (espín libre, $S = 1/2$); para una interacción de Coulomb $U > 0$ distinta de cero, disminuye hacia cero a baja temperatura, señalando un apantallamiento Kondo completo. Usamos una densidad de estados semielíptica como función de hibridización — una elección estándar correspondiente a la red de Bethe, comúnmente encontrada en cálculos de teoría de campo medio dinámica (dynamical mean-field theory, DMFT).

## Importaciones

```python
from pyalps.hdf5 import archive       # HDF5 archive interface
import pyalps.cthyb as cthyb          # CT-HYB impurity solver
import matplotlib.pyplot as plt       # for plotting results
from numpy import exp, log, sqrt, pi  # math utilities
```

## Malla de temperaturas

Generamos 11 puntos de temperatura entre $T_{\min} = 0.05$ y $T_{\max} = 100.0$, espaciados de forma equitativa en escala logarítmica para muestrear tanto el régimen de alta temperatura de espín libre como el régimen de baja temperatura de apantallamiento Kondo:

```python
N_T  = 11     # number of temperature points (includes both endpoints)
Tmin = 0.05   # minimum temperature
Tmax = 100.0  # maximum temperature
Tdiv = exp(log(Tmax/Tmin)/(N_T - 1))
T = Tmax
Tvalues = []
for i in range(N_T):
    Tvalues.append(T)
    T /= Tdiv
```

## Parámetros de la simulación

Comparamos dos valores de la interacción de Coulomb en el mismo sitio: $U = 0$ (referencia no interactuante) y $U = 2$ (interactuante, régimen Kondo). Parámetros clave:

- **`N_TAU`**: Número de puntos de malla en tiempo imaginario $\tau \in [0, \beta]$. Debe ser lo suficientemente grande para resolver la temperatura más baja; una regla práctica segura es $N_\tau \geq 5\beta U$.
- **`runtime`**: Segundos de tiempo de reloj (wall-clock) asignados a cada llamada al solucionador. Aumenta esto para ejecuciones de producción con el fin de mejorar la precisión estadística.

```python
Uvalues = [0., 2.]  # on-site Coulomb interaction values
N_TAU   = 1000      # imaginary-time points; at least 5*BETA*U for the lowest temperature
runtime = 5         # solver runtime per temperature point (seconds)
```

## Construyendo la lista de parámetros

Para cada combinación de $U$ y $T$, construimos un diccionario de parámetros:

- **`SWEEPS`**: Cota superior de movimientos de Monte Carlo. En la práctica, `MAX_TIME` detiene primero al solucionador.
- **`THERMALIZATION`**: Movimientos descartados al inicio antes de que comiencen las mediciones (equilibración).
- **`N_MEAS`**: Se registra una medición una vez cada `N_MEAS` barridos.
- **`N_ORBITALS`**: Número de sabores (flavors) de espín-orbital — aquí 2, para espín arriba y espín abajo.
- **`MU`**: Potencial químico. Se fija en $U/2$ para imponer simetría partícula-hueco a llenado medio.
- **`BETA`**: Temperatura inversa $\beta = 1/T$.

```python
values     = [[] for u in Uvalues]
errors     = [[] for u in Uvalues]
parameters = []
for un, u in enumerate(Uvalues):
    for t in Tvalues:
        parameters.append(
         {
           # solver parameters
           'SWEEPS'             : 1000000000,                          # total Monte Carlo moves (capped by MAX_TIME)
           'THERMALIZATION'     : 1000,                                # equilibration moves (discarded)
           'SEED'               : 42,                                  # random number seed
           'N_MEAS'             : 10,                                  # sweeps between measurements
           'N_ORBITALS'         : 2,                                   # spin-orbital flavors (spin-up, spin-down)
           'BASENAME'           : "hyb.param_U%.1f_BETA%.3f"%(u,1/t), # base name for the HDF5 output file
           'MAX_TIME'           : runtime,                             # wall-clock time limit per solver call (seconds)
           'VERBOSE'            : 1,                                   # print solver progress
           'TEXT_OUTPUT'        : 0,                                   # disable human-readable text output
           # file names
           'DELTA'              : "Delta_BETA%.3f.h5"%(1/t),           # hybridization function input file
           'DELTA_IN_HDF5'      : 1,                                   # read hybridization from HDF5
           # physical parameters
           'U'                  : u,                                   # on-site Coulomb repulsion
           'MU'                 : u/2.,                                # chemical potential (half-filling)
           'BETA'               : 1/t,                                 # inverse temperature
           # measurements
           'MEASURE_nnw'        : 1,                                   # density-density correlator on Matsubara frequencies
           'MEASURE_time'       : 0,                                   # disable imaginary-time measurements
           # discretization
           'N_HISTOGRAM_ORDERS' : 50,                                  # max perturbation order for histogram
           'N_TAU'              : N_TAU,                               # imaginary-time points (tau_0=0, tau_{N_TAU}=beta)
           'N_MATSUBARA'        : int(N_TAU/(2*pi)),                   # Matsubara frequency points
           'N_W'                : 1,                                   # bosonic Matsubara points for local susceptibility
           # bookkeeping
           't'                  : 1,                                   # hopping amplitude (sets energy scale)
           'Un'                 : un,                                  # index into Uvalues (for postprocessing)
         }
        )
```

## Función de hibridización

El solucionador CT-HYB requiere la función de hibridización $\Delta(\tau)$ como entrada, que codifica el acoplamiento al baño de electrones de conducción. Usamos una densidad de estados semielíptica con semiancho de banda $D = 2t$, y calculamos $\Delta(\tau) = t^2 G_0(\tau)$ mediante una transformada de Fourier de la función de Green no interactuante. La cola de alta frecuencia se sustrae antes de la transformada por estabilidad numérica, y luego se añade de nuevo analíticamente.

```python
for parms in parameters:
    ar = archive(parms['BASENAME']+'.out.h5', 'a')
    ar['/parameters'] = parms
    del ar
    print("Creating hybridization function...")
    g  = []
    I  = complex(0., 1.)
    mu = 0.0
    for n in range(parms['N_MATSUBARA']):
        w = (2*n+1)*pi/parms['BETA']
        g.append(2.0/(I*w + mu + I*sqrt(4*parms['t']**2 - (I*w+mu)**2)))  # semielliptic Green's function
    delta = []
    for i in range(parms['N_TAU']+1):
        tau   = i*parms['BETA']/parms['N_TAU']
        g0tau = 0.0
        for n in range(parms['N_MATSUBARA']):
            iw     = complex(0.0, (2*n+1)*pi/parms['BETA'])
            g0tau += ((g[n] - 1.0/iw)*exp(-iw*tau)).real  # Fourier transform with tail subtracted
        g0tau *= 2.0/parms['BETA']
        g0tau += -1.0/2.0                                  # add back the tail contribution
        delta.append(parms['t']**2 * g0tau)                # Delta(tau) = t^2 * G0(tau)

    ar = archive(parms['DELTA'], 'w')
    for m in range(parms['N_ORBITALS']):
        ar['/Delta_%i'%m] = delta
    del ar
```

## Ejecutando el solucionador

```python
for parms in parameters:
    cthyb.solve(parms)
```

## Post-procesamiento y graficado

Extraemos el correlador densidad-densidad $\langle n_\uparrow n_\uparrow \rangle$, $\langle n_\downarrow n_\downarrow \rangle$ y $\langle n_\uparrow n_\downarrow \rangle$ en la frecuencia de Matsubara bosónica cero para calcular la susceptibilidad de espín local $\chi_{dd} = (\langle n_\uparrow n_\uparrow \rangle + \langle n_\downarrow n_\downarrow \rangle - 2\langle n_\uparrow n_\downarrow \rangle)/4$.

```python
for parms in parameters:
    ar      = archive(parms['BASENAME']+'.out.h5', 'a')
    nn_0_0  = ar['simulation/results/nnw_re_0_0/mean/value']
    nn_1_1  = ar['simulation/results/nnw_re_1_1/mean/value']
    nn_1_0  = ar['simulation/results/nnw_re_1_0/mean/value']
    dnn_0_0 = ar['simulation/results/nnw_re_0_0/mean/error']
    dnn_1_1 = ar['simulation/results/nnw_re_1_1/mean/error']
    dnn_1_0 = ar['simulation/results/nnw_re_1_0/mean/error']

    nn  = nn_0_0 + nn_1_1 - 2*nn_1_0
    dnn = sqrt(dnn_0_0**2 + dnn_1_1**2 + (2*dnn_1_0)**2)

    ar['chi']  = nn/4.
    ar['dchi'] = dnn/4.
    del ar

    T = 1/parms['BETA']
    values[parms['Un']].append(T*nn[0])
    errors[parms['Un']].append(T*dnn[0])

plt.figure()
plt.xlabel(r'$T$')
plt.ylabel(r'$4T\chi_{dd}$')
plt.title('Kondo screening of a magnetic impurity\n(CT-HYB hybridization-expansion solver)')
for un in range(len(Uvalues)):
    plt.errorbar(Tvalues, values[un], yerr=errors[un], label="U=%.1f"%Uvalues[un])
plt.xscale('log')
plt.legend()
plt.show()
```

La gráfica muestra $4T\chi_{dd}$ en función de la temperatura en escala logarítmica. Para $U = 0$, el momento efectivo es aproximadamente constante (límite no interactuante). Para $U = 2$, disminuye hacia cero a baja temperatura, demostrando el apantallamiento Kondo de la impureza de espín por parte de los electrones de conducción.

![Momento local efectivo vs temperatura mostrando el apantallamiento Kondo](/figs/Kondo.png)

## Video Tutorial

<br>
{{< youtube id="uAMQTJmvvts" >}}
