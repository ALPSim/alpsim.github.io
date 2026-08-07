---
title: Extrapolación de la Brecha de Energía para una Cadena de Espín 1
description: "Jupyter md file for dmrg energy gap of spin-half chain"
toc: true
math: true
weight: 25
cascade:
    type: docs
---

En este tutorial, realizaremos múltiples simulaciones DMRG de una cadena de espín 1 con varios tamaños de red: 32, 64, 96 y 128. Las brechas de energía se calcularán para cada tamaño de red y se usarán para extrapolar el valor de la brecha en el límite termodinámico $L\rightarrow\infty$, basándose en una relación analítica conocida entre las brechas y los tamaños de red. Nuestras simulaciones DMRG tendrán un número fijo de estados $D=200$.

Primero importamos las bibliotecas necesarias.


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

Preparamos los archivos de entrada con varios tamaños de red 32, 64, 96 y 128 para múltiples ejecuciones.


```python
parms= []
for lattice in [32, 64, 96, 128]:
    parms.append({
            'LATTICE'                   : "open chain lattice",
            'MODEL'                     : "spin",
            'local_S'                   : '1',
            'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
            'Sz_total'                  : 0,
            'J'                         : 1,
            'SWEEPS'                    : 5,
            'L'                         : lattice,
            'MAXSTATES'                 : 200,
            'NUMBER_EIGENVALUES'        : 4
        })
```

Nótese que conservaremos las 4 energías más bajas en cada ejecución DMRG, ya que el estado fundamental tiene una degeneración doble, como se sabe del tutorial anterior.

Luego escribimos los archivos de entrada y ejecutamos las simulaciones. Advertencia: la simulación tardará un tiempo (unos 20-30 minutos dependiendo del sistema informático que tenga). ¡Puede dejarla ejecutándose y volver más tarde!


```python
input_file = pyalps.writeInputFiles('parm_spin_one_gap_multiple',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

Cuando todas las simulaciones hayan terminado, cargamos todas las mediciones para todas las redes y ordenamos los resultados según los tamaños de red.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_gap_multiple'))

sorted_data = sorted(data, key=lambda x: x[0].props['L'])
```

Se crea un conjunto de datos para la función de graficado de pyalps. Las brechas de energía para cada tamaño de red también se incluyen en el conjunto de datos.


```python
gapplot = pyalps.DataSet()
gapplot.props['xlabel']='$1/L^2$'
gapplot.props['ylabel']='Gap $\Delta/J$'
gapplot.props['label']='D=200'
gapplot.props['line']='.'

x = []
y = []
for measure in sorted_data:
    for s in measure:
        if s.props['observable'] == 'Energy':
            L = s.props['L']
            iL = (1.0/L)**2
            gap = abs(s.y[2] - s.y[1])
            s.props['gap'] = gap
            x.append(iL)
            y.append(gap)

gapplot.x = x
gapplot.y = y
```

Nótese que el eje $x$ es $1/L^2$, lo cual es diferente del caso de espín 1/2. Esto se debe a la relación analítica entre las brechas de energía y los tamaños de red, tal como fue analizada por Haldane con el modelo sigma no lineal para las excitaciones más bajas alrededor de $k=\pi$,
$$
E(k)=E_0+\sqrt{\Delta^2+c^2(k-\pi)^2}.
$$
Para condiciones de frontera abiertas, podemos aproximar $k-\pi$ por $1/L$, lo que da una brecha de energía de sistema finito de
$$
\Delta(L)\approx\Delta(1+\frac{c^2}{2\Delta^2L^2}).
$$
Esto indica que en el límite asintótico la convergencia de la brecha debería ser como $1/L^2$.

Por lo tanto, graficamos la relación de la brecha de energía en función de $1/L^2$, la cual se ajusta con una curva lineal. La intersección de la curva ajustada (graficada en la misma figura) con el eje vertical da el valor de la brecha de energía en el límite termodinámico $L\rightarrow\infty$.


```python
# create data set for plot: gap vs. (1/L)^2
gapplot = pyalps.DataSet()
gapplot.props['xlabel']='$1/L^2$'
gapplot.props['ylabel']='Gap $\Delta/J$'
gapplot.props['label']='D=200'
gapplot.props['line']='.'

x = []
y = []
for measure in sorted_data:
    for s in measure:
        if s.props['observable'] == 'Energy':
            L = s.props['L']
            iL = (1.0/L)**2
            gap = abs(s.y[2] - s.y[1])
            s.props['gap'] = gap
            x.append(iL)
            y.append(gap)

gapplot.x = x
gapplot.y = y

# plot the gap vs. (1/L)^2 curve:
plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.0011)
plt.ylim(0.3,0.5)

# fit the curve with a linear function
pars = [fw.Parameter(0.1), fw.Parameter(0.2)]
f = lambda self, x, p: p[0]()+p[1]()*x
fw.fit(None, f, pars, np.array(gapplot.y), np.array(gapplot.x))

# plot the fitted curve
x = np.linspace(0.0, 0.0011, 100)
plt.plot(x, f(None,x,pars))

print("Gap at thermodynamic limit: ", pars[0]())

plt.show()
```

El valor final de la brecha de energía debería ser $\Delta/J=0.41176$, cercano al valor exacto $\Delta/J=0.41052$. La figura debería verse como la siguiente:
![Energy Gap of a Spin-1 Chain](/figs/dmrg/extrapolationGapSOne.png)
