---
title: Brecha de Energía de una Cadena de Espín 1/2
description: "Jupyter md file for dmrg energy gap of spin-half chain"
toc: true
math: true
weight: 22
cascade:
    type: docs
---

En este tutorial, calcularemos la brecha de energía de una cadena de espín 1/2 de 32 sitios utilizando simulaciones DMRG. Como se sabe, la brecha se aproxima a 0 en el límite termodinámico para una cadena de espín 1/2.

El cálculo puede realizarse mediante dos métodos. El primer método consiste en el cálculo directo de las energías del estado fundamental y del primer estado excitado en la misma simulación DMRG. La diferencia entre las dos energías da la brecha de energía. El segundo método consiste en el cálculo de dos energías del estado fundamental en dos sectores de espín: los sectores singlete y triplete, fijando la magnetización total de espín en 0 o en 1.

### Método 1: Cálculo Directo de las Energías del Estado Fundamental y del Estado Excitado

Primero cargamos las bibliotecas necesarias y preparamos los parámetros de entrada.


```python
import pyalps
import numpy as np

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'L'                         : 32,
        'MAXSTATES'                 : 100,
        'NUMBER_EIGENVALUES'        : 2
       } ]

```

Nótese que `NUMBER_EIGENVALUES = 2`, lo que significa que se conservarán en la simulación las energías del estado fundamental y del primer estado excitado.

Luego escribimos el archivo de entrada y ejecutamos la simulación.


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

Finalmente cargamos las mediciones e imprimimos los resultados.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap'))

energies = np.empty(0)
for s in data[0]:
    if s.props['observable'] == 'Energy':
        energies = s.y
    else:
        print(s.props['observable'], ':', s.y[0])
energies.sort()
print('Energies:', end=' ')
for e in energies:
    print(e, end=' ')
print('\nGap:', abs(energies[1]-energies[0]))
```

### Método 2: Uso de Números Cuánticos

Como sabemos, el estado fundamental de una cadena de espín 1/2 existe en el sector singlete de espín. Por lo tanto, si restringimos la simulación al sector de magnetización `Sz_total = 0`, la energía más baja de la simulación DMRG producirá la energía del estado fundamental singlete de espín de la cadena de espín 1/2. Esto es lo que hicimos en la simulación anterior. Si restringimos la simulación al sector de magnetización `Sz_total = 1`, la energía más baja de la simulación DMRG solo puede provenir del estado triplete de espín. Por supuesto, la energía más baja del sector `Sz_total = 1` será la misma que la energía del primer estado excitado del sector `Sz_total = 0`, ya que sin campos magnéticos externos, los 3 subsectores (`Sz_total = -1`, `Sz_total = 0` y `Sz_total = 1`) del sector triplete son degenerados.

Primero cargamos las bibliotecas y preparamos los parámetros de entrada.


```python
import pyalps
import numpy as np

parms = []
for sz in [0,1]:
    parms.append( { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'L'                         : 32,
        'MAXSTATES'                 : 40,
        'NUMBER_EIGENVALUES'        : 1
       } )
```

Nótese que ahora recorremos `Sz_total = 0` y `Sz_total = 1`, lo que producirá dos archivos de parámetros de entrada para dos simulaciones DMRG, tal como se realiza a continuación.


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

Luego cargamos las mediciones e imprimimos los resultados.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[1]-energies[0])
```

Comparemos las energías y la brecha obtenidas con ambos métodos. ¿Concuerdan entre sí?
