
---
title: DMFT-02 Hybridization
math: true
toc: true
---

## Expansión de Hibridización CT-HYB

Comenzamos ejecutando un código de Monte Carlo cuántico de tiempo continuo: el algoritmo de expansión de hibridización CT-HYB. Como ejemplo reproducimos la Fig. 11 de la revisión de DMFT de Georges et al.. La serie de seis curvas muestra cómo el sistema, un modelo de Hubbard en la red de Bethe con interacción $U=3D/\sqrt{2}$r a llenado medio, entra en una fase antiferromagnética al enfriarse. En los tutoriales 03 y 07 reproduciremos los mismos resultados con el solucionador de tiempo continuo de expansión de interacción y con el código de Monte Carlo cuántico de tiempo discreto de Hirsch-Fye, respectivamente. Los parámetros de entrada son los mismos, salvo algunos parámetros relacionados con el solucionador.

La simulación CT-HYB tomará en total aproximadamente 1 hora si se desean reproducir las 6 curvas de la Fig. 11 mencionada arriba. Los archivos para este tutorial se encuentran en el directorio tutorials/dmft-02-hybridization.

Todos los tutoriales de DMFT pueden iniciarse mediante un script de python. El script de python genera los archivos de parámetros, los ejecuta y grafica los resultados. Puede ejecutar el script corto [`tutorial2.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2.py) que reproduce solo 2 de las 6 curvas (tiempo de ejecución: aproximadamente 20 minutos), o la versión larga [`tutorial2_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2_long.py) (tiempo de ejecución: aproximadamente 1 hora) para reproducir todas las curvas de la figura.
    
El script de python `tutorial2.py` prepara automáticamente los archivos de entrada para las 2 simulaciones, `parm_beta_6.0` y `parm_beta_12.0`, y las ejecuta (/path-to-alps-installation/bin/dmft parm_beta_x).

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

#prepare the input parameters
parms=[]
for b in [6., 12.]:
    parms.append(
        {
             'ANTIFERROMAGNET'     : 1,
             'CONVERGED'           : 0.003,
             'FLAVORS'             : 2,
             'H'                   : 0,
             'H_INIT'              : 0.03*b/8.,
             'MAX_IT'              : 6,
             'MAX_TIME'            : 300,
             'MU'                  : 0,
             'N'                   : 250,
             'NMATSUBARA'          : 250,
             'N_MEAS'              : 10000,
             'OMEGA_LOOP'          : 1,
             'SEED'                : 0,
             'SITES'               : 1,
             'SOLVER'              : 'hybridization',
             'SC_WRITE_DELTA'      : 1,
             'SYMMETRIZATION'      : 0,
             'U'                   : 3,
             't'                   : 0.707106781186547,
             'SWEEPS'              : int(10000*b/16.),
             'THERMALIZATION'      : 1000,
             'BETA'                : b
        }
    )


#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

El archivo de entrada `parm_beta_6.0` producido por el script anterior, con comentarios agregados sobre los parámetros:

```
H_INIT = 0.0225   //  initial magnetic field in the direction of quantization axis, to produce the initial Weiss field
ANTIFERROMAGNET = 1   // allow antiferromagnetic ordering; in single site DMFT it is meaningfull only for bipartite lattices
SEED = 0   // Monte Carlo Random Number Seed 
CONVERGED = 0.003   // criterion for the convergency of the iterations
MAX_IT = 6   // upper limit on the number of iterations (the selfconsistency may be stopped before if criterion based on CONVERGED is reached)
SWEEPS = 3750   // Total number of sweeps to be computed (the solver may be stopped before reaching this limit on run-time limit set by MAX_TIME)
FLAVORS = 2   // flavors 0 and 1 correspond to spin up and down
SYMMETRIZATION = 0   // We are not enforcing a paramagnetic self consistency condition (symmetry in flavor 0 and 1)
NMATSUBARA = 250   // The cut-off for Matsubara frequencies 
H = 0   // Magnetic field in the direction of quantization axis
OMEGA_LOOP = 1   // the selfconsistency runs in Matsubara frequencies
SITES = 1   // number of sites of the impurity: for single site DMFT simulation it is 1
N = 250   // auxiliary discretization of the imaginary-time Green's function
BETA = 6.0   // Inverse temperature
U = 3   // Interaction strength
MAX_TIME = 300   // Upper time limit in seconds to run the impurity solver (per iteration)
SC_WRITE_DELTA = 1   // option for selfconsistency to write the hybridization function for the impurity solver
N_MEAS = 10000   // number of updates in between measurements
SOLVER = "hybridization"   // The Hybridization solver
THERMALIZATION = 1000   // Thermalization Sweeps 
MU = 0   // Chemical potential; for particle-hole symmetric models corresponds MU=0 to half-filled case
t = 0.707106781187   // hopping parameter; for the Bethe lattice considered here $W=2D=4t$
```

Observe que no hay ningún parámetro que especifique la estructura de bandas o el tipo de red. Por defecto se asume una red de Bethe, pero esto puede cambiarse (ver [DMFT-08 Fijando una red particular](../dmft08)).

También falta una especificación del campo de Weiss inicial (fijado por las variables G0OMEGA_INPUT o G0TAU_INPUT); el programa, por tanto, calculará al inicializar la función de Green no interactuante. Utilizará el campo magnético inicial H_INIT, que produce en este caso una pequeña diferencia entre los flavors (0 y 1, que representan $\uparrow$,\ $\downarrow$) para partir de un punto alejado de la solución paramagnética; la razón es que en simulaciones muy cortas (como este tutorial) partir de un campo de Weiss paramagnético podría significar que el ruido aleatorio no produjera suficiente diferencia en las primeras iteraciones para alejar al sistema del régimen paramagnético. Un paramagneto mal convergido aparecería entonces como una solución. La dependencia de H_INIT con BETA sirve para optimizar la ejecución, reduciendo el número de iteraciones necesarias.

El código ejecutará hasta 6 iteraciones de autoconsistencia. Para una simulación precisa se puede aumentar este número, y la simulación se detendrá según el criterio de convergencia especificado por el parámetro CONVERGED. En el directorio en el que se ejecuta el programa encontrará archivos de funciones de Green G_tau_i, así como las autoenergías (selfenergy_i) y las funciones de Green en representación de Matsubara (espacio de frecuencias) G_omega_i. G_tau en estos ejemplos tiene dos columnas: una de espín arriba y otra de espín abajo. La entrada en \tau=\beta^- es la ocupación negativa (densidad); con ello podemos obtener la magnetización del sistema.

Las barras de error pueden estimarse mediante iteraciones sucesivas sobre un sistema convergido.

Para volver a ejecutar una simulación, puede especificar una solución de partida definiendo el parámetro de entrada G0OMEGA_INPUT, por ejemplo copiando el G0omega_output deseado a filename_X y especificando el parámetro de entrada 'G0OMEGA_INPUT':'filename_X' en el script de python (o G0OMEGA_INPUT=filename_X directamente en el archivo de entrada) y volviendo a ejecutar el código.

Como en la Fig. 11 de la revisión de DMFT de Georges it et al., puede observar la transición a la fase antiferromagnética graficando las funciones de Green en la representación de tiempo imaginario (parte de `tutorial2.py` y `tutorial2_long.py`):

```
listobs=['0', '1']   # we will plot both flavors 0 and 1

# load the imaginary-time Green's function in final iteration from all result files
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])   # rescale horizontal axis
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-02: Neel transition for the Hubbard model on the Bethe lattice\n(using the Hybridization expansion impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

Notará que los resultados son relativamente ruidosos. La razón es que el orden de expansión a temperaturas tan altas es muy pequeño, lo que hace que el procedimiento de medición sea ineficiente. Puede mejorar la estadística aumentando el tiempo total de ejecución (MAX_TIME) y/o el número de SWEEPS. El solucionador puede ejecutarse en más de una CPU usando MPI; pruebe `SOLVER = "mpirun -np procs /path-to-ALPS-installation/bin/hybridization"` (actualmente no funciona debido a un problema con el prefijo de la ruta) o consulte la página de manual de su instalación de mpi.

Si desea comprobar la convergencia de su autoconsistencia DMFT, puede graficar las funciones de Green de distintas iteraciones usando [`tutorial2eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2eval.py), cuyo código se muestra aquí:

```
listobs=['0']   # we look at a single flavor (=0) 
res_files = pyalps.getResultFiles(pattern='parm_*.h5')  # we look for result files

## load all iterations of G_{flavor=0}(tau)
data = pyalps.loadDMFTIterations(res_files, observable="G_tau", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G_{flavor=0}(\tau)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta= common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```

Cabe destacar que los resultados resueltos por iteración se cargan con una función distinta (`pyalps.loadDMFTIterations`) a la de los resultados finales (`pyalps.loadMeasurements`), porque los datos resueltos por iteración se almacenan usando una estructura de carpetas distinta (/simulation/iteration/number/results/) de la usada por defecto en ALPS (/simulation/results/) para el almacenamiento de los resultados finales.

Como ya se mencionó, la ocupación $n_f$ es igual a $G_f(\tau=\beta^-)$, que es la última entrada de la función de Green en tiempo imaginario para el flavor $f$. El código para imprimir las ocupaciones finales y graficarlas frente a $\beta$ forma parte de `tutorial2eval.py`,

```
## load the final iteration of G_{flavor=0}(tau)
data_G_tau = pyalps.loadMeasurements(res_files, respath='/simulation/results/G_tau', what=listobs, verbose=False)  

print("Occupation in the last iteration at flavor=0")
for d in pyalps.flatten(data_G_tau):
    # obtain occupation using relation: <n_{flavor=0}> = -<G_{flavor=0}(tau=beta)>
    d.y = np.array([-d.y[-1]])
    print("n_0(beta =",d.props['BETA'],") =",d.y[0])
    d.x = np.array([0])
    d.props['observable'] = 'occupation'

occupation = pyalps.collectXY(data_G_tau, 'BETA', 'occupation')
for d in occupation:
    d.props['line']="scatter"

plt.figure()
pyalps.plot.plot(occupation)
plt.xlabel(r'$\beta$')
plt.ylabel(r'$n_{flavor=0}$')
plt.title('Occupation versus BETA')

plt.show()
```

Como nuestra autoconsistencia está en frecuencias de Matsubara (recuerde el parámetro OMEGA_LOOP=1), el criterio de convergencia es $\mathrm{max}|G_{f}^{it}(i\omega_n)-G_{f}^{it+1}(i\omega_n)|\lt$CONVERGED. La parte imaginaria (la parte real de forma análoga) de la función de Green en frecuencia de Matsubara se grafica mediante

```
from math import pi

## load all iterations of G_{flavor=0}(i omega_n)
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d.x])
        d.y = np.array(d.y.imag)
        d.props['label'] = "it"+d.props['iteration']
        d.props['line']="scatter"
        d.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ G_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```

Generalmente es mejor observar la convergencia en la autoenergía, que es mucho más sensible. Tenga en cuenta que se requieren simulaciones más largas para obtener funciones de Green y autoenergías más suaves; en esta simulación el ruido en el rango intermedio de frecuencias de Matsubara es muy fuerte. La autoenergía se obtiene mediante la ecuación de Dyson como $\Sigma_f^{it}(i\omega_n)=G0_f^{it}(i\omega_n)^{-1}-G_f^{it}(i\omega_n)^{-1}$, y su parte imaginaria se grafica mediante este fragmento de `tutorial2eval.py` (la parte real de forma análoga):

```
## load all iterations of G_{flavor=0}(i omega_n) and G0_{flavor=0}(i omega_n)
data_G = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)
data_G0 = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G0_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped_G = pyalps.groupSets(pyalps.flatten(data_G), ['BETA','observable'])
for sim in grouped_G:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## compute selfenergy using the Dyson equation, rescale x-axis and set label
    for d_G in sim:
        # find corresponding dataset from data_G0
        d_G0 = [s for s in pyalps.flatten(data_G0) if s.props['iteration']==d_G.props['iteration'] and s.props['BETA']==common_props['BETA']][0]
        d_G.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d_G.x])
        # Dyson equation
        Sigma = np.array([1./d_G0.y[w] - 1./d_G.y[w] for w in range(len(d_G.y))])
        d_G.y = np.array(Sigma.imag)
        d_G.props['label'] = "it"+d_G.props['iteration']
        d_G.props['line']="scatter"
        d_G.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ \Sigma_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```
