---
title: Espectros de Sistemas Cuánticos 1D
description: "Jupyter md file for 1D spectra"
toc: true
math: true
weight: 13
cascade:
    type: docs
---

En este tutorial calcularemos los espectros de energía del modelo cuántico de Heisenberg en varias redes 1D. El trabajo principal lo realiza la aplicación `sparsediag`, que implementa el algoritmo de Lanczos, un solucionador de valores propios iterativo, para obtener energías en diferentes sectores de momento. Los datos recopilados se graficarán para mostrar los espectros de energía-momento del modelo cuántico de Heisenberg 1D en varias redes 1D.

### Cadena de Heisenberg

#### Introducción

El hamiltoniano para la cadena de Heisenberg de espín 1/2 está dado por
$$H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j$$,
donde $J>0$ para interacciones antiferromagnéticas entre dos espines vecinos más cercanos $\mathbf{S}^i$ y $\mathbf{S}^j$, y la interacción espín-espín consta de tres componentes, es decir,
$$\mathbf{S}^i \cdot \mathbf{S}^j=S^i_xS^j_x+S^i_yS^j_y+S^i_zS^j_z$$.

Los estados base habitualmente se eligen como los estados propios del operador $S_z$. Para un sistema de espín 1/2, hay dos estados base para cada sitio de la red, $|-1/2\rangle$ y $|+1/2\rangle$. La aplicación de los operadores $S_x$ y $S_y$ sobre estos estados base puede expresarse en términos de los operadores de subida $S^{\dagger}$ y bajada $S^{-}$:
$$S_x=\frac{1}{2}(S^{\dagger}+S^{-})$$,
$$S_y=\frac{1}{2i}(S^{\dagger}-S^{-})$$, 
que actúan sobre los estados base de la siguiente manera:
$$S^{\dagger}|s\rangle = \sqrt{S(S+1)-s(s+1)}|s+1\rangle$$,
$$S^{-}|s\rangle = \sqrt{S(S+1)-s(s-1)}|s-1\rangle$$,
donde $S=1/2$ y $s=-1/2, 1/2$.

Con los estados base anteriores para cada sitio de la red, el hamiltoniano puede escribirse como una matriz hermítica. El tamaño de la matriz puede reducirse cuando se fija la magnetización total, es decir, estableciendo Sz_total = 0 (sector singlete) o Sz_total = 1 (sector triplete) en las simulaciones. Para reducir aún más el tamaño de la matriz hamiltoniana y obtener la dependencia del momento de los espectros de energía, podemos restringir aún más las simulaciones a diferentes sectores de momento de red $P=0, 1, 2, \cdots$.


#### Simulación

Para obtener el espectro de energía de la cadena de Heisenberg, seguimos los pasos a continuación.

Primero importamos los módulos necesarios.


```python
import pyalps
import numpy as np
import matplotlib as plt
import pyalps.plot
```

Preparamos los parámetros de entrada para 4 tamaños de red diferentes: $L=10, 12, 14$, y $16$.


```python
parms=[]
for l in [10, 12, 14, 16]:
    parms.append(
      { 
        'LATTICE'                   : "chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : 0.5,
        'J'                         : 1,
        'L'                         : l,
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0
      }
    )
```

Escribimos el archivo de entrada y ejecutamos la simulación.


```python
input_file = pyalps.writeInputFiles('parm_chain',parms)
res = pyalps.runApplication('sparsediag',input_file)
```


Cargamos todas las mediciones de todos los estados y recopilamos los espectros de todos los momentos para cada simulación.


```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm_chain'))

spectra = {}
for sim in data:
  l = int(sim[0].props['L'])
  all_energies = []
  spectrum = pyalps.DataSet()
  for sec in sim:
    all_energies += list(sec.y)
    spectrum.x = np.concatenate((spectrum.x,np.array([sec.props['TOTAL_MOMENTUM'] for i in range(len(sec.y))])))
    spectrum.y = np.concatenate((spectrum.y,sec.y))
  spectrum.y -= np.min(all_energies)
  spectrum.props['line'] = 'scatter'
  spectrum.props['label'] = 'L='+str(l)
  spectra[l] = spectrum
```

Graficamos el espectro de energía en función del momento.


```python
plt.pyplot.figure()
pyalps.plot.plot(spectra.values())
plt.pyplot.legend()
plt.pyplot.title('Antiferromagnetic Heisenberg chain (S=1/2)')
plt.pyplot.ylabel('Energy')
plt.pyplot.xlabel('Momentum')
plt.pyplot.xlim(0,2*3.1416)
plt.pyplot.ylim(0,2)
plt.pyplot.show()

```

A continuación se muestra el espectro de energía para una cadena de Heisenberg 1D:
![Energy spectrum Heisenberg chain](/figs/ed/spectrumchain.png)

### Escalera de Heisenberg de Dos Piernas

#### Introducción

El hamiltoniano para la cadena de Heisenberg de espín 1/2 de dos piernas está dado por
$$H = J_0\sum_{\langle \alpha i,\alpha j \rangle} \mathbf{S}^{\alpha i} \cdot \mathbf{S}^{\alpha j} + J_1\sum_{\langle 1 i,2 i \rangle} \mathbf{S}^{1 i} \cdot \mathbf{S}^{2 i}$$,
donde $\alpha=1,2$ denota las dos piernas/cadenas, $i,j=1,2,\cdots,L$ etiquetan los sitios de la red dentro de una cadena, $J_0>0$ es la interacción antiferromagnética intra-cadena entre dos espines vecinos más cercanos $\mathbf{S}^{\alpha i}$ y $\mathbf{S}^{\alpha j}$ en la misma cadena, y $J_1>0$ es el acoplamiento espín-espín entre cadenas entre $\mathbf{S}^{1 i}$ de la primera pierna y $\mathbf{S}^{2 i}$ de la segunda pierna con $i=1,2,\cdots,L$.

#### Simulación

Primero importamos los módulos necesarios.


```python
import pyalps
import numpy as np
import matplotlib as plt
import pyalps.plot
```

Preparamos los parámetros de entrada estableciendo los valores para las interacciones intra- e inter-cadena J0 y J1, y las longitudes de cadena L=6,8, y 10.


```python
parms=[]
for l in [6, 8, 10]:
    parms.append(
      { 
        'LATTICE'                   : "ladder", 
        'MODEL'                     : "spin",
        'local_S'                   : 0.5,
        'J0'                        : 1,
        'J1'                        : 1,
        'L'                         : l,
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0
      }
    )

```

Escribimos el archivo de entrada y ejecutamos la simulación


```python
input_file = pyalps.writeInputFiles('parm_ladder',parms)
res = pyalps.runApplication('sparsediag',input_file)
```


Cargamos todas las mediciones de todos los estados y recopilamos los espectros de todos los momentos para cada simulación.


```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm_ladder'))

spectra = {}
for sim in data:
  l = int(sim[0].props['L'])
  all_energies = []
  spectrum = pyalps.DataSet()
  for sec in sim:
    all_energies += list(sec.y)
    spectrum.x = np.concatenate((spectrum.x,np.array([sec.props['TOTAL_MOMENTUM'] for i in range(len(sec.y))])))
    spectrum.y = np.concatenate((spectrum.y,sec.y))
  spectrum.y -= np.min(all_energies)
  spectrum.props['line'] = 'scatter'
  spectrum.props['label'] = 'L='+str(l)
  spectra[l] = spectrum
```

Graficamos el espectro de energía.


```python
plt.pyplot.figure()
pyalps.plot.plot(spectra.values())
plt.pyplot.legend()
plt.pyplot.title('Antiferromagnetic Heisenberg ladder (S=1/2)')
plt.pyplot.ylabel('Energy')
plt.pyplot.xlabel('Momentum')
plt.pyplot.xlim(0,2*3.1416)
plt.pyplot.ylim(0,2.5)
plt.pyplot.show()
```

A continuación se muestra el espectro de energía para una escalera de Heisenberg:
![Energy spectrum Heisenberg ladder](/figs/ed/spectrumladder.png)

### Dímeros Aislados

#### Introducción

Para nuestra tercera simulación, partimos del mismo hamiltoniano que en el caso anterior
$$H = J_0\sum_{\langle \alpha i,\alpha j \rangle} \mathbf{S}^{\alpha i} \cdot \mathbf{S}^{\alpha j} + J_1\sum_{\langle 1 i,2 i \rangle} \mathbf{S}^{1 i} \cdot \mathbf{S}^{2 i}$$,
donde $\alpha=1,2$ denota las dos piernas/cadenas, $i,j=1,2,\cdots,L$ etiquetan los sitios de la red dentro de una cadena, fijamos $J_0=0$, es decir, sin interacciones intra-cadena entre dos espines vecinos más cercanos, y $J_1=1$ es el acoplamiento espín-espín entre cadenas entre $\mathbf{S}^{1 i}$ y $\mathbf{S}^{2 i}$ con $i=1,2,\cdots,L$. El sistema se convierte entonces en $L$ dímeros aislados.

#### Simulación

Primero importamos los módulos necesarios.


```python
import pyalps
import numpy as np
import matplotlib as plt
import pyalps.plot
```

Preparamos los parámetros de entrada.


```python
parms=[]
for l in [6, 8, 10]:
    parms.append(
      { 
        'LATTICE'                   : "ladder", 
        'MODEL'                     : "spin",
        'local_S'                   : 0.5,
        'J0'                        : 0,
        'J1'                        : 1,
        'L'                         : l,
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0
      }
    )
```

Escribimos el archivo de entrada y ejecutamos la simulación.


```python
input_file = pyalps.writeInputFiles('parm_dimers',parms)
res = pyalps.runApplication('sparsediag',input_file)
```


Cargamos todas las mediciones de todos los estados.


```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm_dimers'))
```

Recopilamos los espectros de todos los momentos para cada simulación.


```python
spectra = {}
for sim in data:
  l = int(sim[0].props['L'])
  all_energies = []
  spectrum = pyalps.DataSet()
  for sec in sim:
    all_energies += list(sec.y)
    spectrum.x = np.concatenate((spectrum.x,np.array([sec.props['TOTAL_MOMENTUM'] for i in range(len(sec.y))])))
    spectrum.y = np.concatenate((spectrum.y,sec.y))
  spectrum.y -= np.min(all_energies)
  spectrum.props['line'] = 'scatter'
  spectrum.props['label'] = 'L='+str(l)
  spectra[l] = spectrum

```

Luego graficamos el espectro de energía.


```python
plt.pyplot.figure()
pyalps.plot.plot(spectra.values())
plt.pyplot.legend()
plt.pyplot.title('Isolated antiferromagnetic S=1/2 dimers')
plt.pyplot.ylabel('Energy')
plt.pyplot.xlabel('Momentum')
plt.pyplot.xlim(0,2*3.1416)
plt.pyplot.ylim(0,2.5)
plt.pyplot.show()
```

El espectro de energía para los isómeros de Heisenberg se muestra a continuación:
![Energy spectrum Heisenberg isomers](/figs/ed/spectrumisolateddimers.png)
