---
title: Modelo de Ising Cuántico con Campo Transversal
description: "Jupyter md file for transverse field ising"
toc: true
math: true
weight: 11
cascade:
    type: docs
---

### Introducción

En este tutorial, examinaremos cadenas de espines críticas y estableceremos una conexión con su descripción en términos de la teoría de campos conforme.

El modelo que consideraremos es la cadena de Ising crítica, dada por el hamiltoniano

$$
H=J_{z} \sum_{\langle i,j \rangle} S^i_z S^j_z + \Gamma \sum_i S^i_x
$$

Aquí, la primera suma recorre pares de vecinos más cercanos. $\Gamma$ se conoce como campo transversal; el sistema se vuelve crítico para $\Gamma/J=\frac{1}{2}$. Para $\Gamma=0$, el estado fundamental es antiferromagnético para $J\gt 0$ y ferromagnético para $J \lt 0$. El sistema es exactamente resoluble ([P. Pfeuty, Annals of Physics: 57, 79-90 (1970)](https://www.sciencedirect.com/science/article/abs/pii/0003491670902708?via%3Dihub)).

En la ecuación anterior, $\Delta$ se refiere a la dimensión de escala de ese campo. Los campos de escala aparecen en grupos: el más bajo, llamado campo primario, viene acompañado de un número infinito de descendientes con dimensión de escala $\Delta + m$, $m \in \lbrace 1, 2, 3, ... \rbrace$.

En la solución exacta del modelo de Ising (Ec. (3.7) en [el artículo de P. Pfeuty](https://www.sciencedirect.com/science/article/abs/pii/0003491670902708?via%3Dihub)), se encuentra que las correlaciones de largo alcance decaen como:
$$
\langle S^i_z S^{i+n}_z \rangle \sim n^{-2\times 1/8}
$$
$$
\langle S^i_y S^{i+n}_y \rangle \sim n^{-2\times(1+1/8)}
$$
$$
\langle S^i_x S^{i+n}_x \rangle \sim n^{-2\times 1}
$$
Adicionalmente, esperamos que la dimensión de escala del operador identidad sea 0.

Por lo tanto, esperamos que aparezcan dimensiones de escala de 0, 1/8, 1, 1+1/8 en la CFT del modelo de Ising. Para verificar esto, reescalaremos todas las energías del espectro según $E \rightarrow \frac{E-E_0}{(E_1-E_0)8}$. Esto obligará a que los dos estados más bajos ocurran donde esperamos las dimensiones de escala; podemos entonces verificar si el resto del espectro es consistente con esto.


### Simulación

Primero importaremos algunos módulos:


```python
import pyalps
import pyalps.plot
import numpy as np
import matplotlib.pyplot as plt
import copy
import math
```

Luego, configuremos los parámetros para dos tamaños de sistema. Tenga cuidado de usar el campo transversal $\Gamma$, no el campo longitudinal $h$.


```python
# Some general parameters with different lattice sizes:
parms = []
for L in [10,12]:
    parms.append({
        'LATTICE'    : "chain lattice",
        'MODEL'      : "spin",
        'local_S'    : 0.5,
        'Jxy'        : 0,
        'Jz'         : -1,
        'Gamma'      : 0.5,
        'NUMBER_EIGENVALUES' : 5,
        'L'          : L
    })

```

Como puede ver, simularemos dos tamaños de sistema. Ahora configuremos los archivos de entrada y ejecutemos la simulación:


```python
prefix = 'ising'
input_file = pyalps.writeInputFiles(prefix,parms)
res = pyalps.runApplication('sparsediag', input_file)
# res = pyalps.runApplication('sparsediag', input_file, MPI=2, mpirun='mpirun')
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
```


Para realizar las asignaciones de CFT, necesitamos calcular el estado fundamental y el primer estado excitado para cada L.
El resultado de la operación de carga anterior será una lista jerárquica ordenada por L, así que simplemente podemos iterar a través de ella


```python
E0 = {}
E1 = {}
for Lsets in data:
    L = pyalps.flatten(Lsets)[0].props['L']
    # Make a big list of all energy values
    allE = []
    for q in pyalps.flatten(Lsets):
        allE += list(q.y)
    allE = np.sort(allE)
    E0[L] = allE[0]
    E1[L] = allE[1]
```

Restamos E0, dividimos entre la brecha, multiplicamos por 1/8, que sabemos que es la dimensión de escala no nula más pequeña de la CFT de Ising


```python
for q in pyalps.flatten(data):
    L = q.props['L']
    q.y = (q.y-E0[L])/(E1[L]-E0[L]) * (1./8.)

spectrum = pyalps.collectXY(data, 'TOTAL_MOMENTUM', 'Energy', foreach=['L'])
```

Graficamos las primeras dimensiones de escala conocidas exactamente


```python
for SD in [0.125, 1, 1+0.125, 2]:
    d = pyalps.DataSet()
    d.x = np.array([0,4])
    d.y = SD+0*d.x
    # d.props['label'] = str(SD)
    spectrum += [d]

pyalps.plot.plot(spectrum)

plt.legend(prop={'size':8})
plt.xlabel("$k$")
plt.ylabel("$E_0$")

plt.xlim(-0.02, math.pi+0.02)

plt.show()

```

El resultado de la simulación se muestra en la figura:
![Energy scaling for quantum ising model.](/figs/ed/energyscaling.png)
