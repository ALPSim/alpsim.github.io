---
title: Espectros de Energía de Qbits
description: "Jupyter md file for qbit energy"
toc: true
math: true
weight: 61
cascade:
    type: docs
---

En este tutorial exploraremos cómo configurar redes arbitrarias para alojar qbits y asignar diversas interacciones entre qbits para simular operaciones sobre qbits. Nuestros resultados sobre los espectros de energía podrían servir como puntos de referencia para configuraciones iniciales de qbits en teorías/experimentos de computación cuántica.

## Qbits Mixtos de 4 Sitios

### Introducción

Primero usamos el grafo mixto de 4 sitios en el archivo de configuración de red: `lattices.xml`
```
<GRAPH name="4-site mixed" vertices="4"> 
  <VERTEX id="1" type="0"/>
  <VERTEX id="2" type="1"/>
  <VERTEX id="3" type="0"/>
  <VERTEX id="4" type="1"/>
  <EDGE type="0" source="1" target="2"/>
  <EDGE type="0" source="2" target="3"/>
  <EDGE type="0" source="3" target="4"/>
  <EDGE type="0" source="4" target="1"/>
  <EDGE type="1" source="1" target="3"/>
  <EDGE type="1" source="2" target="4"/>
</GRAPH> 
```

La configuración de la red se ilustra en el siguiente diagrama:
![mixed-4-site configuration](/figs/qbits/mixed4sitesconfig.png)

En esta configuración de red hay dos tipos de vértices, etiquetados como "0" para los sitios 1 y 3, y "1" para los sitios 2 y 4. Para cada sitio de qbit hay un campo magnético transversal de intensidad Gamma. También hay dos tipos de enlaces, etiquetados como "0" para los enlaces entre los sitios (1,2), (2,3), (3,4) y (4,1), y "1" para los enlaces entre los sitios (1,3) y (2,4). Para los enlaces de tipo "0" asignaremos una interacción J1, y J2 para los enlaces de tipo "1". Todo esto se realiza en el archivo de configuración del modelo: `models.xml`
```
<HAMILTONIAN name="qbit operation">
  <PARAMETER name="J1" default="1"/>
  <PARAMETER name="J2" default="0.5"/>
  <BASIS ref="spin"/>
  <SITETERM site="i">
    -Gamma*Sx(i)
  </SITETERM>
  <BONDTERM source="1" target="2">
    J1*Sz(1)*Sz(2)
  </BONDTERM>
  <BONDTERM source="2" target="3">
    J1*Sz(2)*Sz(3)
  </BONDTERM>
  <BONDTERM source="3" target="4">
    J1*Sz(3)*Sz(4)
  </BONDTERM>
  <BONDTERM source="4" target="1">
    J1*Sz(4)*Sz(1)
  </BONDTERM>
  <BONDTERM source="1" target="3">
    J2*Sz(1)*Sz(3)
  </BONDTERM>
  <BONDTERM source="2" target="4">
    J2*Sz(2)*Sz(4)
  </BONDTERM>
</HAMILTONIAN>
```
Con las configuraciones anteriores, el hamiltoniano para los qbits de 4 sitios está dado por
$$
H=J_{1} \sum_{type 0} S^i_z S^j_z + J_{2} \sum_{type 1} S^i_z S^j_z - \Gamma \sum_i S^i_x.
$$

### Simulación

Primero importamos algunos módulos:


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
```

Luego configuramos los parámetros del sistema y recorremos la segunda constante de acoplamiento J2.


```python
parms = []
# Loop over second coupling constant
for J2 in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6]:
    parms.append({
        'GRAPH'      : "4-site mixed",
        'MODEL'      : "qbit operation",
        'local_S'    : 0.5,
        'Gamma'      : 0.5,
        'J2'         : J2,
        'NUMBER_EIGENVALUES' : 5
    })
```

Ahora configuramos los archivos de entrada y ejecutamos las simulaciones.


```python
prefix = 'qbitenergy'
input_file = pyalps.writeInputFiles(prefix,parms)
res = pyalps.runApplication('sparsediag', input_file)
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
```

Luego recorremos el parámetro J2 y graficamos el nivel de energía más bajo para cada J2.


```python
x = []
E0 = []
for Lsets in data:
    J2 = pyalps.flatten(Lsets)[0].props['J2']
    x.append(J2)
    lowestE = pyalps.flatten(Lsets)[0].y[0]
    E0.append(lowestE)
    
# Set the scatter plot label
lbl="J1=1.0, Gamma=0.5"
plt.scatter(x,E0, label=lbl)
plt.legend()
plt.xlabel("J2")
plt.ylabel("E")
plt.title("4-site Mixed Graph")
plt.show()

```

Los espectros de energía resultantes para las energías más bajas con varias constantes de acoplamiento J2 se muestran en el siguiente diagrama:
![Lowest energies vs. J2](/figs/qbits/sites4mixed.png)

