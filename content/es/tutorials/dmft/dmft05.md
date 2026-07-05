
---
title: DMFT-05 OSMT
math: true
toc: true
---

## Transición de Mott orbitalmente selectiva

Un fenómeno interesante en modelos multiorbitales es la transición de Mott orbitalmente selectiva, examinada por primera vez por [Anisimov et al., Eur. Phys. J. B 25, 191 (2002)](https://doi.org/10.1140/epjb/e20020021). Una variante de esta, una transición de Mott *selectiva en momento*, se ha discutido recientemente en [cálculos de clúster](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.045120) como una representación de clúster de la física del pseudogap.

En una transición de Mott orbitalmente selectiva, algunos de los orbitales involucrados se vuelven aislantes de Mott en función del dopaje o de las interacciones, mientras que otros permanecen metálicos.

Como modelo mínimo consideramos dos bandas: una banda ancha y una banda estrecha. Además de la repulsión de Coulomb intraorbital $U$, consideramos las interacciones $U'$ y $J$, con $U' = U-2J$. Nos limitamos a interacciones tipo Ising, una simplificación que a menudo es problemática para compuestos reales.

### Ejecutando la simulación

Elegimos aquí un caso con dos anchos de banda, $t_0=0.5$ y $t_1=1$, e interacciones tipo densidad-densidad de $U'=U/2$, $J=U/4$, con $U$ entre $1.8$ y $2.8$: $U=1.8$ muestra un comportamiento tipo líquido de Fermi en ambos orbitales, $U=2.2$ es orbitalmente selectivo, y $U=2.8$ es aislante en ambos orbitales.

Las líneas de comando en python para ejecutar las simulaciones se encuentran en [`tutorial5a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5a.py):

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u,j in [[1.8,0.45],[2.2,0.55],[2.8,0.7]]:
    parms.append(
            { 
              'CONVERGED'           : 0.001,
              'FLAVORS'             : 4,
              'H'                   : 0,
              'H_INIT'              : 0.,
              'MAX_IT'              : 15,
              'MAX_TIME'            : 600,
              'MU'                  : 0,
              'N'                   : 500,
              'NMATSUBARA'          : 500,
              'N_MEAS'              : 2000,
              'N_ORDER'             : 50,
              'SEED'                : 0,
              'SOLVER'              : 'hybridization',
              'SC_WRITE_DELTA'      : 1,
              'SYMMETRIZATION'      : 1,
              'SWEEPS'              : 10000,
              'BETA'                : 30,
              'THERMALIZATION'      : 500,
              'U'                   : u,
              'J'                   : j,
              't0'                  : 0.5,
              't1'                  : 1,
              'CHECKPOINT'          : 'dump'
        }
        )

# For more precise calculations we propose to enhance the SWEEPS

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_u_'+str(p['U'])+'_j_'+str(p['J']),p)
    res = pyalps.runDMFT(input_file)
```

Un artículo que usa los mismos parámetros de ejemplo puede encontrarse [aquí](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.72.081103).

### Interpretando los resultados

Como se discutió en el tutorial anterior [DMFT-04 Mott](../dmft04), el carácter (no) metálico de la función de Green se observa mejor graficando los datos en escala logarítmica.

```
listobs = ['0', '2']   # flavor 0 is SYMMETRIZED with 1, flavor 2 is SYMMETRIZED with 3
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_u_*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.y = -d.y
    d.props['label'] = r'$U=$'+str(d.props['U'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
plt.figure()
plt.yscale('log')
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-05: Orbitally Selective Mott Transition on the Bethe lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

### Comprobando la convergencia

La convergencia puede comprobarse con [`tutorial5b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5b.py), que muestra todas las iteraciones de $G_f^{it}(\tau)$ en escala logarítmica.
