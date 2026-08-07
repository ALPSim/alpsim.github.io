---
title: Energía del Estado Fundamental de una Cadena de Espines
description: "Jupyter md file for dmrg energy of spin chain"
toc: true
math: true
weight: 21
cascade:
    type: docs
---

En este ejemplo, usaremos simulaciones del Grupo de Renormalización de la Matriz Densidad (DMRG) para estudiar la energía del estado fundamental de una cadena de Heisenberg de espín 1/2 de 32 sitios con condiciones de frontera abiertas. Observaremos la convergencia de la energía del estado fundamental, así como el decaimiento de los errores de truncamiento en función del número de iteraciones.




```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'L'                         : 32,
        'MAXSTATES'                 : 100
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

A continuación, cargamos las propiedades del estado fundamental medidas por el código DMRG


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))
```

y las imprimimos en la terminal.


```python
for s in data[0]:
    print(s.props['observable'], ' : ', s.y[0])
```

Adicionalmente, podemos cargar datos detallados de cada paso de iteración.


```python
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                          what=['Iteration Energy','Iteration Truncation Error'])
```

Lo anterior nos permite observar cómo convergió el algoritmo DMRG hacia los resultados finales.

Finalmente graficamos la convergencia de la energía del estado fundamental y el error de truncamiento en función de las iteraciones.


```python
plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('Iteration history of ground state energy (S=1/2)')
plt.ylim(-15,0)
plt.ylabel('$E_0$')
plt.xlabel('iteration')

plt.figure()
pyalps.plot.plot(iter[0][1])
plt.title('Iteration history of truncation error (S=1/2)')
plt.yscale('log')
plt.ylabel('error')
plt.xlabel('iteration')

plt.show()
```

La convergencia de la energía del estado fundamental en función del número de iteraciones se muestra en la siguiente figura.
![Ground State Energy](/figs/dmrg/dmrg_energy.png)

También podemos observar el decaimiento del error de truncamiento a medida que aumenta el número de iteraciones.
![Truncation Error](/figs/dmrg/dmrg_truncation.png)
