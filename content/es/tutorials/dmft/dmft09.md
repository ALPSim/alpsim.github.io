
---
title: DMFT-09 Néel Transition
math: true
toc: true
---

## Transición de Néel en DMFT de sitio único

En este ejemplo reproducimos la Fig. 11 de la [revisión de DMFT de Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). La serie de seis curvas muestra cómo el sistema, un modelo de Hubbard en la red de Bethe con interacción $U=3D/\sqrt{2}$ a llenado medio, entra en una fase antiferromagnética al enfriarse.

Estos ejemplos pueden iniciarse invocando directamente un comando o un script de python en la línea de comandos. Ejecutar manualmente uno de los conjuntos de parámetros de dmft, por ejemplo entrando al directorio `beta_14_U3_tsqrt2` en `tutorials/dmft-02-hybridization`, y ejecutando el código dmft `/opt/alps/bin/dmft hybrid.param`, lleva a los mismos resultados.

Nota: el ejemplo combina los tutoriales [DMFT-02 Hybridization](../dmft02), [DMFT-03 Interaction](../dmft03), y [DMFT-07 Hirsch-Fye](../dmft07).

### Expansión de Hibridización CT-HYB

Comenzamos ejecutando un código de Monte Carlo cuántico de tiempo continuo: el algoritmo de expansión de hibridización CT-HYB. La simulación CT-HYB tomará alrededor de un minuto por iteración. Los archivos de parámetros para ejecutar esta simulación se encuentran en el directorio `tutorials/dmft-02-hybridization`.

Los parámetros principales son:

```
SEED = 0;                    // Monte Carlo Random Number Seed
THERMALIZATION = 1000;       // Thermalization Sweeps
SWEEPS = 100000000;          // Total Sweeps to be computed
MAX_TIME = 60;               // Maximum time to run the simulation
BETA = 12.;                  // Inverse temperature
SITES = 1;                   // This is a single site DMFT simulation, so Sites is 1
N = 1000;                    // auxiliary discretization of the imaginary-time Green's function
NMATSUBARA = 1000;           // The number of Matsubara frequencies
U = 3;                       // Interaction energy
t = 0.707106781187;          // hopping parameter. For the Bethe lattice considered here $W=2D=4t$
MU = 0;                      // Chemical potential
H = 0;                       // Magnetic field
SYMMETRIZATION = 0;          // We are not enforcing a paramagnetic self consistency condition
SOLVER = Hybridization;      // The Hybridization solver
```

Para iniciar una simulación desde la línea de comandos, escriba:

```
dmft hybrid.param
```

El código se ejecutará hasta por 10 iteraciones de autoconsistencia. En el directorio en el que ejecute el programa encontrará archivos de funciones de Green G_tau_i, así como las autoenergías (selfenergy_i) y funciones de Green en espacio de frecuencias G_omega_i en su directorio de salida. G_tau en estos ejemplos tiene dos columnas: una de espín arriba y otra de espín abajo. La entrada en $\beta$ es la densidad negativa; donde difiere fuera de las barras de error, el sistema está en una fase antiferromagnética. Puede ejecutar las siguientes líneas en el shell de python para graficar las funciones de Green para distintos $\beta$ y comparar su resultado con la Fig. 11 de [Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). En la sección Hirsch-Fye más abajo reproduciremos los mismos resultados con un código de Monte Carlo cuántico de tiempo discreto: el código Hirsch Fye. Los parámetros son los mismos, salvo por el comando del solucionador.

Puede encontrar los archivos de parámetros (llamados \*tsqrt2) en el directorio `tutorials/dmft-02-hybridization` en los ejemplos. Alternativamente puede ejecutar el script de python `tutorial2a.py`:

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.pyplot

#prepare the input parameters
parms=[]
for b in [6.,8.,10.,12.,14.,16.]:
    parms.append(
        {
            'ANTIFERROMAGNET'     : 1,
            'CONVERGED'           : 0.03,
            'F'                   : 10,
            'FLAVORS'             : 2,
            'H'                   : 0,
            'H_INIT'              : 0.2,
            'MAX_IT'              : 10,
            'MAX_TIME'            : 60,
            'MU'                  : 0,
            'N'                   : 1000,
            'NMATSUBARA'          : 1000,
            'N_FLIP'              : 0,
            'N_MEAS'              : 10000,
            'N_MOVE'              : 0,
            'N_ORDER'             : 50,
            'N_SHIFT'             : 0,
            'OMEGA_LOOP'          : 1,
            'OVERLAP'             : 0,
            'SEED'                : 0,
            'SITES'               : 1,
            'SOLVER'              : 'Hybridization',
            'SYMMETRIZATION'      : 0,
            'TOLERANCE'           : 0.01,
            'U'                   : 3,
            't'                   : 0.707106781186547,
            'SWEEPS'              : 100000000,
            'THERMALIZATION'      : 1000,
            'BETA'                : b,
            'CHECKPOINT'          : 'solverdump_beta_'+str(b)+'.task1.out.h5',
            'G0TAU_INPUT'         : 'G0_tau_input_beta_'+str(b)
        }
    )
#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

Después de ejecutar estas simulaciones, compare el resultado con los resultados de Hirsch-Fye de la sección Hirsch Fye o de la revisión de DMFT, o con los resultados de expansión de interacción de la sección Expansión de Interacción CT-INT. Para volver a ejecutar una simulación, puede especificar una solución de partida definiendo G0OMEGA_INPUT, por ejemplo copiando G0omga_output a G0_omega_input, especificando G0OMEGA_INPUT = G0_omega_input en el archivo de parámetros y volviendo a ejecutar el código. Puede observar la transición a la fase antiferromagnética graficando las funciones de Green con el siguiente script:

```
flavors=parms[0]['FLAVORS']
listobs=[]   
for f in range(0,flavors):
    listobs.append('Green_'+str(f))

ll=pyalps.load.Hdf5Loader()
data = ll.ReadMeasurementFromFile(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', measurements=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G(\tau)$')
plt.title('Hubbard model on the Bethe lattice')
pyalps.pyplot.plot(data)
plt.legend()
plt.show()
```

Notará que los resultados son relativamente ruidosos. La razón es que el orden de expansión a temperaturas tan altas es muy pequeño, lo que hace que el procedimiento de medición sea ineficiente. Puede mejorar la estadística aumentando el tiempo total de ejecución (MAX_TIME) o ejecutándolo en más de una CPU. Para ejecutarlo con MPI, pruebe `mpirun -np procs dmft parameter_file` o consulte la página de manual de su instalación de mpi.

Si desea comprobar la convergencia de su autoconsistencia DMFT, puede graficar las funciones de Green de distintas iteraciones usando `tutorial2b.py`:

```
ll=pyalps.load.Hdf5Loader()
for p in parms:
    data = ll.ReadDMFTIterations(pyalps.getResultFiles(pattern='parm_beta_'+str(p['BETA'])+'.h5'), measurements=listobs, verbose=True)
    grouped = pyalps.groupSets(pyalps.flatten(data), ['iteration'])
    nd=[]
    for group in grouped:
        r = pyalps.DataSet()
        r.y = np.array(group[0].y)
        r.x = np.array([e*group[0].props['BETA']/float(group[0].props['N']) for e in group[0].x])
        r.props = group[0].props
        r.props['label'] = r.props['iteration']
        nd.append( r )
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G(\tau)$')
    plt.title(r'\beta = %.4s' %nd[0].props['BETA'])
    pyalps.pyplot.plot(nd)
    plt.legend()
    plt.show()
```

Generalmente es mejor observar la convergencia en la autoenergía, que es mucho más sensible. Tenga en cuenta que se requieren simulaciones más largas para obtener funciones de Green y autoenergías más suaves.

### Expansión de Interacción CT-INT

Es instructivo ejecutar los mismos cálculos de la sección Expansión de Hibridización CT-HYB con un código CT-INT. Este código realiza una expansión en la interacción (en lugar de en la hibridización). Los archivos de parámetros correspondientes son muy similares; puede encontrarlos en el directorio `tutorials/dmft-03-interaction`. Si prefiere ejecutar las simulaciones en python puede usar los archivos `tutorial3a.py` y `tutorial3b.py`.

### Hirsch Fye

Comparamos los resultados de tiempo continuo ejecutando un código de Monte Carlo de tiempo discreto: el [código Hirsch Fye](https://link.aps.org/doi/10.1103/PhysRevLett.56.2521). El algoritmo de Hirsch Fye se describe [aquí](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13), y esta revisión también proporciona una implementación de código abierto de los códigos. Aunque se han desarrollado muchas mejoras (véase p. ej. Alvarez (2008) o [Nukala09](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111)), el algoritmo ha sido reemplazado por [algoritmos de tiempo continuo](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123).

La simulación Hirsch Fye tomará alrededor de un minuto por iteración. Los archivos de parámetros para ejecutar esta simulación se encuentran en [este tutorial](../dmft07).

Los parámetros principales son:

```
SEED = 0;                    // Monte Carlo Random Number Seed
THERMALIZATION = 10000;      // Thermalization Sweeps
SWEEPS = 1000000;            // Total Sweeps to be computed
MAX_TIME = 60;               // Maximum time to run the simulation
BETA = 12.;                  // Inverse temperature
SITES = 1;                   // This is a single site DMFT simulation, so Sites is 1
N = 16;                      // Number of time slices (you will see that this parameter is rather small)
NMATSUBARA = 500;            // The number of Matsubara frequencies
U = 3;                       // Interaction energy
t = 0.707106781187;          // hopping parameter. For the Bethe lattice considered here $W=2D=4t$
MU = 0;                      // Chemical potential
H = 0;                       // Magnetic field
SYMMETRIZATION = 0;          // We are not enforcing a paramagnetic self consistency condition
SOLVER = /opt/alps/bin/hirschfye;  // The path to the external Hirsch Fye solver
```

Para iniciar una simulación escriba:

```
dmft hirschfye.param
```

o ejecute el script de python `tutorial7a.py`:

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.pyplot

#prepare the input parameters 
parms=[]
for b in [6.,8.,10.,12.,14.,16.]: 
    parms.append(
        { 
            'ANTIFERROMAGNET'     : 1,
            'CONVERGED'           : 0.03,
            'FLAVORS'             : 2,
            'H'                   : 0,
            'MAX_IT'              : 10,
            'MAX_TIME'            : 60,
            'MU'                  : 0,
            'N'                   : 16,
            'NMATSUBARA'          : 500, 
            'OMEGA_LOOP'          : 1,
            'SEED'                : 0, 
            'SITES'               : 1,
            'SOLVER'              : '/opt/alps/bin/hirschfye',
            'SYMMETRIZATION'      : 0,
            'TOLERANCE'           : 0.01,
            'U'                   : 3,
            't'                   : 0.707106781186547,
            'SWEEPS'              : 1000000,
            'THERMALIZATION'      : 10000,
            'BETA'                : b,
            'G0OMEGA_INPUT'       : 'G0_omega_input_beta_'+str(b),
            'BASENAME'            : 'hirschfye.param'
        }
    )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

El código se ejecutará hasta por 10 iteraciones de autoconsistencia. En el directorio en el que ejecute el programa encontrará archivos de funciones de Green G_tau_i, así como las autoenergías (selfenergy_i) y funciones de Green en espacio de frecuencias G_omega_i en su directorio de salida. G_tau en estos ejemplos tiene dos columnas: una de espín arriba y otra de espín abajo. La entrada en $\beta$ es la densidad negativa; donde difiere fuera de las barras de error, el sistema está en una fase antiferromagnética. Puede ejecutar las siguientes líneas en el shell de python para graficar las funciones de Green para distintos $\beta$ y comparar su resultado con la Fig. 11 de [Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13).

```
flavors=parms[0]['FLAVORS']
listobs=[]   
for f in range(0,flavors):
    listobs.append('Green_'+str(f))

ll=pyalps.load.Hdf5Loader()
data = ll.ReadMeasurementFromFile(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', measurements=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G(\tau)$')
plt.title('Hubbard model on the Bethe lattice')
pyalps.pyplot.plot(data)
plt.legend()
plt.show()
```

Al ser un método de tiempo discreto, HF sufre errores de $\Delta\tau$. Elija un conjunto de parámetros y ejecútelo para valores de N sucesivamente mayores. Además: está ejecutando la simulación DMFT usando una función de baño (casi) convergida como entrada. Al eliminar el archivo G0_omega_input puede reiniciar el cálculo desde la solución libre y observar la convergencia.

