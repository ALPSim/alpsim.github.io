
---
title: DMFT-04 Mott
math: true
toc: true
---

## Transición de Mott

Las transiciones de Mott son transiciones metal-aislante (MIT) que ocurren en muchos materiales, por ejemplo compuestos de metales de transición, en función de la presión o del dopaje. La revisión de Imada et al. ofrece una excelente introducción al tema y menciona $V_2O_3$ y los compuestos orgánicos como ejemplos típicos.

Las MIT se investigan fácilmente mediante DMFT, ya que la física relevante es esencialmente local (o independiente de k): a llenado medio, la MIT puede modelarse mediante una autoenergía con un polo en $\omega=0$ que divide la banda no interactuante en una banda de Hubbard superior y otra inferior. En este contexto es instructivo suprimir el orden antiferromagnético de largo alcance e imponer una solución paramagnética en la simulación DMFT, para emular la fase aislante paramagnética. Para ello, las funciones de Green de espín arriba y espín abajo se simetrizan (parámetro `SYMMETRIZATION = 1;`).

Para ejecutar las simulaciones en python use [`tutorial4a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4a.py):

```    
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

#prepare the input parameters
parms=[]
for u in [4.,5.,6.,8.]: 
    parms.append(
            { 
              'ANTIFERROMAGNET'         : 0,
              'CHECKPOINT'              : 'solverdump_U_'+str(u),
              'CONVERGED'               : 0.001,
              'FLAVORS'                 : 2,
              'H'                       : 0,
              'H_INIT'                  : 0.,
              'MAX_IT'                  : 20,
              'MAX_TIME'                : 600,
              'MU'                      : 0,
              'N'                       : 500,
              'NMATSUBARA'              : 500, 
              'N_MEAS'                  : 1000,
              'N_ORDER'                 : 50,
              'OMEGA_LOOP'              : 1,
              'SEED'                    : 0, 
              'SITES'                   : 1,              
              'SOLVER'                  : 'hybridization',
              'SC_WRITE_DELTA'          : 1,
              'SYMMETRIZATION'          : 1,
              't'                       : 1,
              'SWEEPS'                  : 1500*u,
              'BETA'                    : 20.0,
              'THERMALIZATION'          : 500,
              'U'                       : u
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_u_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)
```

Investigamos la transición de Mott en DMFT de sitio único, en función de la interacción a temperatura fija $\beta t=20$ (véase p. ej. la Fig. 2 de [este artículo](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)). Partiendo de una solución no interactuante, vemos en la función de Green en tiempo imaginario que la solución es metálica para $U/t \leq 4.5$, y aislante para $U/t\geq 5$. Podría encontrarse una región de coexistencia partiendo de una solución aislante (o atómica) e intentando convertirla para $U$ menores.

Las funciones de Green en tiempo imaginario no son fáciles de interpretar, por lo que muchos autores emplean [métodos de continuación analítica](). Sin embargo, hay dos características claras: el valor en $\beta$ corresponde a $-n$, el valor negativo de la densidad (por espín). La segunda característica es que $-\beta G(\beta/2) \rightarrow \pi A(0)$ al disminuir la temperatura ($\beta\rightarrow\infty$); donde $A(0)$ es la función espectral en la energía de Fermi. A partir de la dependencia con la temperatura de la función de Green en tiempo imaginario podemos por tanto ver de inmediato si el sistema es metálico o aislante. Para inspeccionar mejor el comportamiento de la función de Green, graficaremos los datos en escala logarítmica:

```
listobs=['0']   # we look at only one flavor, as they are SYMMETRIZED
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_u_*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)

for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.y = -d.y
    d.props['label'] = r'$U=$'+str(d.props['U'])
plt.figure()
plt.yscale('log')
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-04: Mott-insulator transition for the Hubbard model on the Bethe lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

Debería observar que para $U$ pequeño obtiene una solución metálica, y para $U$ grande una solución aislante, a $\beta$ fija. El valor más grande de $U$ está muy dentro de la fase aislante.

La convergencia puede comprobarse con [`tutorial4b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4b.py):

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


## Please run the tutorial4a.py before this one

listobs = ['0']   # we look at convergence of a single flavor (=0) 

## load all results
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_u_*.h5'), measurements=listobs, verbose=True)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['U','observable'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.y *= -1.
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$-G_{flavor=%8s}(\tau)$' % common_props['observable'])
    plt.title('DMFT-04: ' + r'$U = %.4s$' % common_props['U'])
    pyalps.plot.plot(sim)
    plt.legend()
    plt.yscale("log")

plt.show()
```

