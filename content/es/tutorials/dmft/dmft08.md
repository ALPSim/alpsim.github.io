
---
title: DMFT-08 Lattices
math: true
toc: true
---

## Fijando una red particular

### Opción DOSFILE

Todos los tutoriales anteriores trataban con la red de Bethe, que tiene una densidad de estados semicircular. Ahora mostramos cómo fijar los parámetros de entrada para especificar la densidad de estados de una red particular. Para ejecutar la simulación, puede tomar los scripts de los tutoriales anteriores y simplemente reemplazar la lista de parámetros para hacer simulaciones similares. Puede por ejemplo estudiar la transición MIT tal como se hizo en el Tutorial 4.

Para una red general, debe proporcionar la densidad de estados de su red. Aparte de eso, son necesarios varios otros cambios para ejecutar la simulación. A continuación se muestra un script de python funcional [`tutorial8a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8a.py) que fija un archivo de entrada y ejecuta la simulación:

```
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u in [3.]: 
  for b in [6.]:
    parms.append(
            { 
                'BETA' : b,          # inverse temperature
                'MU' : 0.0,          # chemical potential corresponding to half-filling
                'U' : u,             # Hubbard interaction
                'FLAVORS' : 2,       # corresponds to spin up/down
                'SITES' : 1,         # number of sites in the impurity
                'H' : 0.0,           # there is no magnetic field
                'H_INIT' : 0.05,     #  we set initial field to split spin up/down in order to trigger AF phase
                'OMEGA_LOOP' : 1,        # the selfconsistency runs in Matsubara frequencies
                'ANTIFERROMAGNET' : 1,   # allow Neel order
                'SYMMETRIZATION' : 0,    # do not enforce paramagnetic solution
                'NMATSUBARA' : 500,      # number of Matsubara frequencies
                'N' : 500,               # bins in imaginary time
                'CONVERGED' : 0.005,     # criterion for convergency
                'MAX_TIME' : 60,         # max. time spent in solver in a single iteration in seconds
                'G0OMEGA_INPUT' : "",    # forces to start from the local non-interacting Green's function
                'MAX_IT' : 10,           # max. number of self-consistency iterations
                'SWEEPS' : 10000,    # max. number of sweeps in a single iteration
                'THERMALIZATION' : 500, # number of thermalization sweeps
                'SEED' : 0,              # random seed
                'SOLVER' : "hybridization",   # we take the hybridization impurity solver
                'SC_WRITE_DELTA' : 1,         # input for the hybridization impurity solver is the hybridization function Delta, which has to be written by the selfconsistency
                'N_MEAS' : 5000,              # number of Monte Carlo steps between measurements
                'N_ORDER' : 50,               # histogram size
                'DOSFILE' : "DOS/DOS_Square_GRID4000", # specification of the file with density of states
                'GENERAL_FOURIER_TRANSFORMER' : 1,  # Fourier transformer for a general bandstructure
                'EPS_0' : 0,                        # potential shift for the flavor 0
                'EPS_1' : 0,                        # potential shift for the flavor 1
                'EPSSQ_0' : 4,                      # the second moment of the bandstructure for the flavor 0
                'EPSSQ_1' : 4,                      # the second moment of the bandstructure for the flavor 1
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('hybrid_DOS_beta_'+str(p['BETA'])+'_U_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)
```

Los parámetros específicos de la red que aparecen en los archivos de entrada se listan a continuación:

```
DOSFILE = DOS_Square_GRID4000; // specification of the file with density of states
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                      // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                      // the second moment of the bandstructure for the flavor 1
```

Nota1: si no proporciona los parámetros de estructura de bandas (EPS_i, EPSSQ_i) en el archivo de entrada, estos se calcularán a partir de la DOS proporcionada (desde la revisión 6146) como $EPS_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon$, $EPSSQ_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon^2$.

Nota2: el bucle de autoconsistencia antiferromagnética asume orden de Néel. Por lo tanto, solo es aplicable a redes bipartitas.

Nota3: la densidad de estados debe ser proporcionada por el usuario. En el tutorial proporcionamos la DOS para

- la red cuadrada DOS_Square_GRID4000 (generada por [`DOS_Square.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Square.py) fijando GRID=4000); los parámetros correspondientes son EPSSQ_i=4
- la red cúbica DOS_Cubic_GRID360 (generada por [`DOS_Cubic.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Cubic.py) fijando GRID=360); los parámetros correspondientes son EPSSQ_i=6
- la red hexagonal DOS_Hexagonal_GRID4000 (generada por [`DOS_Hexagonal.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Hexagonal.py) fijando GRID=4000); los parámetros correspondientes son EPSSQ_i=3
- la red de Bethe DOS_Bethe (generada por `DOS_Bethe.py`); los parámetros correspondientes son EPSSQ_i=1; para pruebas

Nota4: para una simulación multibanda [$n_{\text{bands}}=FLAVORS/2$] con DOS conocida, el archivo DOS debe consistir en $2n_{\text{bands}}$ columnas. El número de bins [=número de líneas del archivo de entrada] de la DOS debe ser el mismo para todas las bandas. La línea $i$-ésima tiene la siguiente estructura

$$
e_{1,i}\ \ \ DOS_{band1}(e_{1,i})\ \ \ e_{2,i}\ \ \ DOS_{band2}(e_{2,i})\ \ \ \ldots
$$

### Opción TWODBS

Para el caso de una red bidimensional, existe una implementación de la transformación de Hilbert con una integral sobre el espacio k [el parámetro L fija la discretización en cada dimensión del espacio recíproco]. Actualmente hay implementación para estas dispersiones:

- red cuadrada [fijar TWODBS=square] con saltos a primeros vecinos [parámetro correspondiente: t] y a segundos vecinos [parámetro correspondiente: tprime]; el segundo momento EPSSQ_i es $4(t^2 + tprime^2)$;
- red hexagonal [fijar TWODBS=hexagonal] con saltos a primeros vecinos [parámetro correspondiente: t]; el segundo momento EPSSQ_i es $3t^2$.

A continuación se muestra un script de python funcional [`tutorial8b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8b.py) para producir el archivo de entrada y ejecutar la simulación:

```
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u in [3.]: 
  for b in [6.]:
    parms.append(
            { 
                'BETA' : b,          # inverse temperature
                'MU' : 0.0,          # chemical potential corresponding to half-filling
                'U' : u,             # Hubbard interaction
                'FLAVORS' : 2,       # corresponds to spin up/down
                'SITES' : 1,         # number of sites in the impurity
                'H' : 0.0,           # there is no magnetic field
                'H_INIT' : 0.05,     #  we set initial field to split spin up/down in order to trigger AF phase
                'OMEGA_LOOP' : 1,        # the selfconsistency runs in Matsubara frequencies
                'ANTIFERROMAGNET' : 1,   # allow Neel order
                'SYMMETRIZATION' : 0,    # do not enforce paramagnetic solution
                'NMATSUBARA' : 500,      # number of Matsubara frequencies
                'N' : 500,               # bins in imaginary time
                'CONVERGED' : 0.005,     # criterion for convergency
                'MAX_TIME' : 60,         # max. time spent in solver in a single iteration in seconds
                'G0OMEGA_INPUT' : "",    # forces to start from the local non-interacting Green's function
                'MAX_IT' : 10,           # max. number of self-consistency iterations
                'SWEEPS' : 10000,    # max. number of sweeps in a single iteration
                'THERMALIZATION' : 500, # number of thermalization sweeps
                'SEED' : 0,              # random seed
                'SOLVER' : "hybridization",   # we take the hybridization impurity solver
                'SC_WRITE_DELTA' : 1,         # input for the hybridization impurity solver is the hybridization function Delta, which has to be written by the selfconsistency
                'N_MEAS' : 5000,              # number of Monte Carlo steps between measurements
                'N_ORDER' : 50,               # histogram size
                'TWODBS' : 1,     # the Hilbert transformation integral runs in k-space, sets square lattice
                't' : 1,          # the nearest-neighbor hopping
                'tprime' : 0,     # the second nearest-neighbor hopping
                'L' : 64,         # discretization in k-space in the Hilbert transformation
                'GENERAL_FOURIER_TRANSFORMER' : 1,  # Fourier transformer for a general bandstructure
                'EPS_0' : 0,                        # potential shift for the flavor 0
                'EPS_1' : 0,                        # potential shift for the flavor 1
                'EPSSQ_0' : 4,                      # the second moment of the bandstructure for the flavor 0
                'EPSSQ_1' : 4,                      # the second moment of the bandstructure for the flavor 1
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('hybrid_TWODBS_beta_'+str(p['BETA'])+'_U_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)
```

Los parámetros específicos de la red se listan aquí:

```
TWODBS = 1;     // the Hilbert transformation integral runs in k-space; sets square lattice
t = 1;          // the nearest-neighbor hopping
tprime = 0;     // the second nearest-neighbor hopping
L = 128;        // discretization in k-space in the Hilbert transformation
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                   // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                   // the second moment of the bandstructure for the flavor 1
```

### Observaciones finales

Pregunta: ¿qué información de la red entra en el cálculo DMFT? Compare con el campo medio clásico.

Tarea: intente rehacer el Tutorial 4 para una red distinta (a la red de Bethe) e inspeccione la MIT. ¿Hay algún cambio significativo?

Recuerde las predicciones de campo medio para el modelo de Ising (para distintas dimensiones).
