---
title: Extrapolación de la Brecha de Energía para una Cadena de Espín 1/2
description: "Jupyter md file for dmrg energy gap of spin-half chain"
toc: true
math: true
weight: 23
cascade:
    type: docs
---

En este tutorial, calcularemos la brecha de energía para una cadena de espín 1/2 con varios tamaños de red: 32, 64, 96 y 128. Fijaremos el número de estados en la simulación DMRG en $D=100$, lo que produce resultados con suficiente precisión. Las brechas de energía en función del tamaño de la red se graficarán y se extrapolarán al límite termodinámico.

Primero importamos las bibliotecas necesarias.


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

Preparamos los archivos de entrada con varios tamaños de red para múltiples ejecuciones.


```python
parms= []
for lattice in [32, 64, 96, 128]:
    parms.append({
            'LATTICE'                   : "open chain lattice",
            'MODEL'                     : "spin",
            'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
            'Sz_total'                  : 0,
            'J'                         : 1,
            'SWEEPS'                    : 4,
            'L'                         : lattice,
            'MAXSTATES'                 : 100,
            'NUMBER_EIGENVALUES'        : 2
        })
```

Nótese que hemos fijado el número máximo de estados que se conservan en las simulaciones DMRG. Los dos valores propios más bajos se conservarán y se usarán para calcular la brecha de energía.

Luego escribimos los archivos de entrada y ejecutamos las simulaciones.


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_gap_multiple',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

Después de las simulaciones, cargamos todas las mediciones para todas las redes y ordenamos los resultados según los tamaños de red.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap_multiple'))

sorted_data = sorted(data, key=lambda x: x[0].props['L'])
```

Se crea un conjunto de datos para la función de graficado de pyalps. Las brechas de energía para cada tamaño de red también se incluyen en el conjunto de datos.


```python
gapplot = pyalps.DataSet()
gapplot.props['xlabel']='$1/L$'
gapplot.props['ylabel']='Gap $\Delta/J$'
gapplot.props['label']='D=100'
gapplot.props['line']='.'

x = []
y = []
for measure in sorted_data:
    for s in measure:
        if s.props['observable'] == 'Energy':
            L = s.props['L']
            iL = 1.0/L
            gap = abs(s.y[1] - s.y[0])
            s.props['gap'] = gap
            x.append(iL)
            y.append(gap)

gapplot.x = x
gapplot.y = y
```

Graficamos la relación de la brecha de energía en función de 1/L, la cual se ajusta con una curva lineal. La curva ajustada también se grafica en la misma figura.


```python
# plot the gap vs. 1/L curve:
plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.04)
plt.ylim(0,0.2)

# fit the curve with a linear function
pars = [fw.Parameter(0.1), fw.Parameter(0.2)]
f = lambda self, x, p: p[0]()+p[1]()*x
fw.fit(None, f, pars, np.array(gapplot.y), np.array(gapplot.x))

# plot the fitted curve
x = np.linspace(0.0, 0.035, 100)
plt.plot(x, f(None,x,pars))

print("Gap at thermodynamic limit: ", pars[0]())

plt.show()
```

La figura final de la brecha de energía debería verse como la siguiente:
![Energy Gap of a Spin-1/2 Chain](/figs/dmrg/extrapolationGapSHalf.png)
