---
title: Brecha de Energía de una Cadena de Espín 1
description: "Jupyter md file for dmrg energy gap of spin-one chain"
toc: true
math: true
weight: 24
cascade:
    type: docs
---

En este tutorial, calcularemos la brecha de energía de una cadena de espín 1 de 64 sitios utilizando simulaciones DMRG. Veremos un comportamiento de la brecha diferente al de la cadena de espín 1/2. Aquí la brecha de energía entre el estado fundamental y el primer estado excitado de una cadena de espín 1 es finita. También veremos que el estado fundamental es 2 veces degenerado, por lo que se requiere que el cálculo conserve más estados de baja energía para identificar correctamente la brecha de energía.

De forma similar al caso de espín 1/2, el cálculo puede realizarse de dos maneras. El primer método consiste en el cálculo directo de las 4 energías más bajas en la misma ejecución de DMRG. Veremos la degeneración doble del estado fundamental y la brecha de energía entre el estado fundamental y el primer estado excitado. El segundo método consiste en el cálculo de las energías del estado fundamental en diferentes sectores de espín total, es decir, magnetización total 0, 1 y 2. Encontraremos que las energías del estado fundamental para las magnetizaciones 0 y 1 son idénticas dentro de los límites de error, y que la brecha de energía puede calcularse mediante la diferencia de energía del estado fundamental entre los sectores de magnetización 1 y 2.

## Método 1: Cálculo Directo de las 4 Energías Más Bajas

Primero cargamos las bibliotecas necesarias y preparamos los parámetros de entrada.


```python
import pyalps
import numpy as np

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 4
       } ]

```

Nótese que `local_S = 1`, lo que nos da el sistema de espín 1. `NUMBER_EIGENVALUES = 4` producirá las 4 energías más bajas de las simulaciones DMRG. Para garantizar suficiente precisión, también hemos fijado el número de barridos `SWEEPS = 5` y el truncamiento del número de estados `NUMBER_EIGENVALUES = 300`.

Luego escribimos el archivo de entrada y ejecutamos la simulación.


```python
input_file = pyalps.writeInputFiles('parm_spin_one_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

Finalmente cargamos las mediciones e imprimimos los resultados.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_gap'))

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
print('\nGap:', abs(energies[1]-energies[0]), abs(energies[2]-energies[1]))
```

A partir de la simulación, ¿observa la degeneración del estado fundamental y una brecha de energía finita hacia el primer estado excitado?

## Método 2: Uso de Números Cuánticos

Primero restringimos las simulaciones a los sectores de magnetización `Sz_total = 0` y `Sz_total = 1`. Luego se extrae la diferencia de energía del estado fundamental entre los dos sectores, lo que muestra que son degenerados. Después repetimos el cálculo con `Sz_total = 1` y `Sz_total = 2`. Los resultados se usan para extraer la brecha de energía.

Primero cargamos las bibliotecas y preparamos los parámetros de entrada.


```python
import pyalps
import numpy as np

#prepare the input parameters
parms = []
sz_tot = [0,1]
for sz in sz_tot:
    parms.append( {
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 1
       } )
```

La magnetización se toma de la lista de valores en `sz_tot = [0,1]`. Luego se asigna a la magnetización `Sz_total` en la lista de parámetros de entrada. Nótese que solo se calcula 1 estado de menor energía, es decir, `NUMBER_EIGENVALUES = 1`.

Los archivos de entrada se escriben y los cálculos se realizan mediante las siguientes APIs.


```python
input_file = pyalps.writeInputFiles('parm_spin_one_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

Luego cargamos las mediciones e imprimimos los resultados.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[sz_tot[1]]-energies[sz_tot[0]])
```

¿Observa los estados fundamentales degenerados de los dos sectores de magnetización?

A continuación, cambiamos la lista de magnetizaciones a `sz_tot = [1,2]` y repetimos la simulación. Por conveniencia, copiamos los códigos anteriores a continuación. El único cambio es la lista de magnetizaciones.


```python
import pyalps
import numpy as np

parms = []
sz_tot = [1,2]
for sz in sz_tot:
    parms.append( {
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 1
       } )


input_file = pyalps.writeInputFiles('parm_spin_one_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)

data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[sz_tot[1]]-energies[sz_tot[0]])
```

¿Puede ahora extraer correctamente la brecha de energía para una cadena de espín 1 de 64 sitios? ¿Concuerda con el resultado del Método 1?
