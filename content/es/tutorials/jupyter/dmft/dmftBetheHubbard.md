---
title: DMFT del Modelo de Hubbard en una Red de Bethe
description: "Jupyter md file for dmft green function"
toc: true
math: true
weight: 31
cascade:
    type: docs
---

La teoría del campo medio dinámico (DMFT) para sistemas de electrones fuertemente correlacionados se basa en la aplicación de modelos de red a modelos de impureza cuántica sujetos a una condición de autoconsistencia [Georges, et al, Rev. Mod. Phys. 68, 13 (1996)]. Esta aplicación es exacta para modelos de electrones correlacionados en el límite de coordinación de red grande o dimensiones espaciales infinitas. La red de Bethe es un ejemplo de red con dimensiones espaciales infinitas y puede simularse mediante DMFT con ALPS.

### Red de Bethe
A continuación se muestra un ejemplo de red de Bethe, donde hay 3 números de coordinación para cada sitio de la red. La dimensión efectiva de la red es infinita. Por lo tanto, ofrece una gran oportunidad para implementar DMFT en dicha red, donde el método DMFT puede ser evaluado y explorado.
![Bethe Lattice](/figs/dmft/betheLattice.png)

### Modelo de Hubbard
Simularemos el modelo de Hubbard definido en una red de Bethe con DMFT. El modelo de Hubbard se define a continuación.
$$
H = -t \sum_{\langle i,j \rangle, \sigma} \left( c_{i,\sigma}^\dagger c_{j,\sigma} + \text{h.c.} \right) + U \sum_i n_{i,\uparrow} n_{i,\downarrow},
$$

donde

- $c_{i,\sigma}^\dagger$ y $c_{i,\sigma}$ son los operadores de creación y aniquilación para un fermión con sabor $\sigma$ (arriba $\uparrow$ o abajo $\downarrow$) en el sitio $i$, y $\text{h.c.}$ representa el conjugado hermítico.
- $t$ es la amplitud de hopping entre sitios vecinos $\langle i,j \rangle$.
- $U$ es la energía de interacción en el mismo sitio, donde $U > 0$ corresponde a interacciones repulsivas.
- $n_{i,\sigma} = c_{i,\sigma}^\dagger c_{i,\sigma}$ es el operador de número para fermiones con sabor $\sigma$ en el sitio $i$.

### Simulación
Primero importamos los módulos necesarios.


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
```

Luego preparamos los archivos de entrada como una lista de diccionarios de Python.


```python
parms=[]
for b in [6., 12.]: 
    parms.append(
            {                         
              'ANTIFERROMAGNET'         : 1,
              'CONVERGED'               : 0.005,
              'FLAVORS'                 : 2,
              'H'                       : 0,
              'H_INIT'                  : 0.05,
              'MAX_IT'                  : 10,
              'MAX_TIME'                : 10,
              'MU'                      : 0,
              'N'                       : 500,
              'NMATSUBARA'              : 500, 
              'OMEGA_LOOP'              : 1,
              'SEED'                    : 0, 
              'SITES'                   : 1,
              'SOLVER'                  : 'Interaction Expansion',
              'SYMMETRIZATION'          : 0,
              'U'                       : 3,
              't'                       : 0.707106781186547,
              'SWEEPS'                  : 100000000,
              'THERMALIZATION'          : 1000,
              'ALPHA'                   : -0.01,
              'HISTOGRAM_MEASUREMENT'   : 1,
              'BETA'                    : b
            }
        )
```

El parámetro "BETA" se refiere a la temperatura inversa, y estamos simulando el sistema a dos temperaturas diferentes: "BETA = 6" a alta temperatura y "BETA = 12" a baja temperatura. Luego escribimos el archivo de entrada y ejecutamos la simulación.


```python
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

A continuación cargamos el resultado de la simulación.


```python
listobs=['0', '1']
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
```

Y finalmente hacemos un gráfico de la función de Green de una sola partícula $G$ en función del tiempo imaginario $\tau$ y luego mostramos el gráfico.


```python
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title("Green's Function vs. the Imaginary Time")
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

El gráfico de la simulación debería verse como el siguiente:
![green fucntion gtau](/figs/dmft/greenTau.png)

El resultado muestra una transición de Néel para el modelo de Hubbard en la red de Bethe, donde el sistema pasa de un estado antiferromagnético a bajas temperaturas ("BETA = 12") a un estado paramagnético a altas temperaturas ("BETA = 6").


```python

```
