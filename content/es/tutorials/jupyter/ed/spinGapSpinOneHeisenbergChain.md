---
title: Brecha de Espín de una Cadena de Heisenberg de Espín 1
description: "Jupyter md file for spin gaps"
toc: true
math: true
weight: 12
cascade:
    type: docs
---

En este tutorial aprenderemos a usar el programa de diagonalización dispersa (algoritmo de Lanczos) para calcular las brechas de energía de una cadena de Heisenberg de espín 1 en 1D para varios tamaños de red ($L=4, 6, 8$, y 10). Las brechas de red finita obtenidas se usan luego para extrapolar la brecha de energía en el límite termodinámico ($L=\infty$).

El hamiltoniano para la cadena de Heisenberg de espín 1 está dado por
$$H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j$$,
donde $J>0$ para interacciones antiferromagnéticas entre dos espines vecinos más cercanos $\mathbf{S}^i$ y $\mathbf{S}^j$, y la interacción espín-espín consta de tres componentes, es decir,
$$\mathbf{S}^i \cdot \mathbf{S}^j=S^i_xS^j_x+S^i_yS^j_y+S^i_zS^j_z$$.

Los estados base habitualmente se eligen como los estados propios del operador $S_z$. Para un sistema de espín 1, hay tres estados base para cada sitio de la red, $|-1\rangle$, $|0\rangle$, y $|+1\rangle$. La aplicación de los operadores $S_x$ y $S_y$ sobre estos estados base puede expresarse en términos de los operadores de subida $S^{\dagger}$ y bajada $S^{-}$:
$$S_x=\frac{1}{2}(S^{\dagger}+S^{-})$$,
$$S_y=\frac{1}{2i}(S^{\dagger}-S^{-})$$, 
que actúan sobre los estados base de la siguiente manera:
$$S^{\dagger}|s\rangle = \sqrt{S(S+1)-s(s+1)}|s+1\rangle$$,
$$S^{-}|s\rangle = \sqrt{S(S+1)-s(s-1)}|s-1\rangle$$,
donde $S=1/2$ y $s=-S, -S+1$.

Con los estados base anteriores para cada sitio de la red, el hamiltoniano puede escribirse como una matriz hermítica. El tamaño de la matriz puede reducirse cuando se fija la magnetización total, es decir, estableciendo Sz_total = 0 (sector singlete) o Sz_total = 1 (sector triplete) en las simulaciones.


Primero importamos los módulos necesarios.


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

Luego preparamos los archivos de entrada como una lista de diccionarios de Python.


```python
parms = []
for l in [4, 6, 8, 10, 12, 14]:
  for sz in [0, 1]:
      parms.append(
        { 
          'LATTICE'                   : "chain lattice", 
          'MODEL'                     : "spin",
          'local_S'                   : 1,
          'J'                         : 1,
          'L'                         : l,
          'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
          'Sz_total'                  : sz
        }
      )

```

Escribimos el archivo de entrada y ejecutamos la simulación.


```python
input_file = pyalps.writeInputFiles('parm2a',parms)
res = pyalps.runApplication('sparsediag',input_file) #, MPI=4)
```


A continuación cargamos los espectros para cada uno de los tamaños de sistema y sectores de espín:


```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm2a'))
```

Para extraer las brechas necesitamos escribir algunas líneas de Python, para preparar una lista de longitudes y un diccionario de Python con la energía mínima en cada sector (L,Sz):


```python
lengths = []
min_energies = {}

for sim in data:
  l = int(sim[0].props['L'])
  if l not in lengths: lengths.append(l)
  sz = int(sim[0].props['Sz_total'])
  all_energies = []
  for sec in sim:
    all_energies += list(sec.y)
  min_energies[(l,sz)]= np.min(all_energies)
```

Y finalmente hacemos un gráfico de la brecha en función de 1/L y luego mostramos el gráfico


```python
gapplot = pyalps.DataSet()
gapplot.x = 1./np.sort(lengths)
gapplot.y = [min_energies[(l,1)] -min_energies[(l,0)] for l in np.sort(lengths)]  
gapplot.props['xlabel']='$1/L$'
gapplot.props['ylabel']='Triplet gap (J)'
gapplot.props['label']='S=1'
gapplot.props['line']='.'

plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.25)
plt.ylim(0,1.0)
```


Luego ajustamos los datos en el rango L=8 a L=14 para obtener la brecha en el límite termodinámico ($L\rightarrow \infty$ o $1/L\rightarrow 0$).


```python
pars = [fw.Parameter(0.411), fw.Parameter(1000), fw.Parameter(1)]
f = lambda self, x, p: p[0]()+p[1]()*np.exp(-x/p[2]())
fw.fit(None, f, pars, np.array(gapplot.y)[2:], np.sort(lengths)[2:])

x = np.linspace(0.0001, 1./min(lengths), 100)
plt.plot(x, f(None, 1/x, pars))

plt.show()
```

El resultado de la simulación se muestra en la figura:
![Fitted spin gap from simulations.](/figs/ed/spingap.png)
