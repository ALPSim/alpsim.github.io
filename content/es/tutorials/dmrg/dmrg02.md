
---
title: DMRG-02 Gaps
math: true
toc: true
---

## Cálculo Del Gap

Como ya se mencionó, el gap de energía de un sistema cuántico viene dado por la diferencia de energía entre el primer estado excitado y el estado fundamental

$$
\Delta = E_1 - E_0
$$

en el límite termodinámico. Esto significa que tenemos que resolver dos problemas: (i) el cálculo de

$$
\Delta(L) = E_1 (L) - E_0 (L)
$$

para tamaños de sistema finitos, y (ii) la extrapolación de $\Delta (L)$ al límite termodinámico $L= \infty$. Esto último no es específico de DMRG, pero debido a la preferencia de DMRG por condiciones de frontera abiertas resulta algo más complicado que en el caso más habitual de condiciones de frontera periódicas.

### Obtención Del Gap Para Sistemas Finitos

Obviamente, debemos poder acceder al primer estado excitado y a su energía. DMRG conoce fundamentalmente dos formas de hacer esto: una manera pedestre que siempre funciona, pero no es tan elegante, y una manera más inteligente, que es muy limpia, pero no funciona en todas las circunstancias.

1. La manera pedestre es configurar un cálculo DMRG que calcule ambos estados al mismo tiempo. Sin embargo, para un número dado de estados, la precisión disminuirá algo, ya que dos estados cuánticos distintos deben describirse bien simultáneamente.

2. La manera más inteligente reduce el cálculo del gap al cálculo de dos estados fundamentales. En muchos sistemas cuánticos, el estado fundamental y el primer estado excitado difieren en un buen número cuántico y por lo tanto ambos son estados fundamentales en sus respectivos sectores. Por ejemplo, para la cadena de espín-1/2, el estado fundamental es un singlete de espín total 0, y por lo tanto es el estado fundamental en el sector de magnetización 0. El primer estado excitado es un triplete de espín total 1, es decir, consiste en un estado excitado de magnetización 0, y en los estados fundamentales de los sectores de magnetización +1 y -1, respectivamente. Por lo tanto, puede calcularse como el estado fundamental en el sector de magnetización +1.

Hagamos primero este cálculo para la cadena de espín-1/2:

#### Ejemplo: sin números cuánticos

##### Usando archivos de parámetros

En el siguiente ejemplo, incluimos una línea en el archivo de parámetros para la cadena de espín S=1/2 [`spin_one_half_gap`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_gap) para indicarle al código que también queremos calcular la energía del primer estado excitado. El algoritmo construirá una matriz de densidad que apunta a dos estados: el estado fundamental y el primer estado excitado, ambos en el mismo subespacio con Sz=0. Como el primer estado excitado es un triplete, esto producirá el gap singlete-triplete.

```python
LATTICE="open chain lattice"
MODEL="spin"
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=0
J=1
SWEEPS=4
{L=32, MAXSTATES=100
NUMBER_EIGENVALUES=2}
```
    
Observe que solo agregamos la última línea, especificando el número de autoestados a calcular. Al apuntar a ambos estados, el algoritmo asegura que ambos se representen con precisión. Sin embargo, esto no es del todo cierto si conservamos solo 100 estados. Compare la energía del estado fundamental obtenida con el presente archivo de parámetros y la simulación anterior que apuntaba solo al estado fundamental.

Es importante notar que la entropía de entrelazamiento en este ejemplo carece totalmente de sentido, ya que el algoritmo está calculando una matriz de densidad que mezcla dos estados.

##### Usando Python

El script [`spin_one_half_gap.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_gap.py) ejecuta la misma simulación que el script de espín-1/2 del tutorial DMRG-01, salvo que cambia el NUMBER_EIGENVALUES solicitado a dos, y carga todos los datos para estos autoestados.

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
        'L'                         : 32,
        'MAXSTATES'                 : 100,
        'NUMBER_EIGENVALUES'        : 2
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)

data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap'))
```

Mientras iteramos sobre todas las mediciones, extraemos las energías

```python
energies = np.empty(0)
for s in data[0]:
    if s.props['observable'] == 'Energy':
        energies = s.y
    else:
        print(s.props['observable'], ':', s.y[0])
```

y calculamos el gap.

```python
energies.sort()
print('Energies:', end=' ')
for e in energies:
    print(e, end=' ')
print('\nGap:', abs(energies[1]-energies[0]))
```

#### Ejemplo: con números cuánticos

Para calcular el gap singlete-triplete aprovechando la conservación de números cuánticos, necesitamos realizar dos simulaciones independientes, una con Sz=0 y otra con Sz=1. La diferencia de las dos energías dará el gap.

##### Usando archivos de parámetros

Esto significa que solo necesitamos cambiar el valor de Sz_total en el archivo de parámetros spin_one_half:

```python
LATTICE="open chain lattice"
MODEL="spin"
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=1
SWEEPS=4
J=1
{L=32, MAXSTATES=40}
```

Puede descargar este archivo aquí: [`spin_one_half_triplet`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_triplet).

##### Usando Python

El script [`spin_one_half_triplet.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_triplet.py) ejecuta una simulación para ambos sectores de Sz definidos por dos diccionarios de Python con los parámetros.

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

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
       
input_file = pyalps.writeInputFiles('parm_spin_one_half_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

Después de cargar los resultados de la forma habitual, imprimimos las mediciones para ambos sectores y guardamos la energía del estado fundamental para cada valor de Sz en un diccionario.

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_triplet'))

# print results:
energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]
```

Luego, podemos calcular el gap como la diferencia de energía entre los sectores Sz=1 y Sz=0

```python
print('Gap:', energies[1]-energies[0])
```

### Extrapolación Del Gap Al Límite Termodinámico

En un primer intento, fije $D=50,100,150$ y calcule el gap para longitudes $L=32,64,96,128$. Para $D$ fija, grafique el gap frente a $1/L$. Lo que debería ver es que, para $D$ pequeño, los resultados no se ubicarán en una línea recta que pase por 0, sino que se curvarán hacia arriba desde ella. Este comportamiento mejora cuando $D$ se hace más grande. Discuta por qué podría ser esto.

En un segundo intento, más significativo, fije las longitudes $L=32,64,96,128$ y varíe $D=50,100,150,200$ para extrapolar el gap para cada longitud fija en $D$ (o, como se explicó arriba, en el error de truncación). ¿Cómo se ve ahora el gráfico del gap frente a $1/L$?

Modifique el archivo [`spin_one_half_multiple`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-01-dmrg/spin_one_half_multiple) para configurar todas las ejecuciones para Sz=0 y Sz=1, para distintos tamaños de sistema y distinto número de estados. Use cinco barridos, y extrapole el valor del gap siguiendo el procedimiento descrito en el tutorial.


El caso de la cadena de espín-1/2 es un poco frustrante, porque todo lo que podrá decir, incluso si lleva la computadora al límite, es que el gap parece ser extremadamente pequeño según lo mejor de sus capacidades y por lo tanto es probable que se anule. Pero ¿quién puede asegurarle que no está ante un caso en el que el gap es, digamos, $e^{-50}$? Esto, por supuesto, es un sobrio recordatorio de los límites incluso de un método numérico de alta precisión.

Pasemos entonces a una pregunta más gratificante: ¿cuál es el gap de la cadena de Heisenberg antiferromagnética de espín-1?

Aquí hay un giro molesto, que por ahora solo enunciaremos y realizaremos, pero explicaremos más adelante: calcule el gap no entre los estados fundamentales de los sectores de magnetización 0 y 1, sino 1 y 2. Si lo desea, hágalo también para 0 y 1, como referencia posterior, pero lo que sigue se refiere a 1 y 2.

Suponga que tiene $\Delta (L)$ con precisión de máquina, ya sea mediante una extrapolación adecuada como la discutida arriba, o mediante un cálculo de muy alta precisión. Si no quiere hacer lo primero, calcule el gap para tamaños de sistema $L=8,16,32,48,64,96,128,192,256$ con $D=300$ estados cada uno y 5 barridos.

Como los efectos de los extremos abiertos disminuirán como $1/L$, siempre tiene sentido graficar primero los gaps $\Delta (L)$ frente a $1/L$, tal como se hizo ya en el caso de espín-1/2. Produzca dicho gráfico.

Lo que se ve es una curva bastante recta para $L$ pequeño que luego empieza a curvarse hacia arriba. ¿Qué gap obtendría si extrapola ingenuamente la parte lineal de la curva? (Esta pregunta es relevante para situaciones en las que la longitud de correlación de la cadena es tan larga que se vuelve difícil ver el comportamiento asintótico en las escalas de longitud alcanzables.) ¿Está sobreestimado o subestimado?

¿Qué gap obtiene si toma la cadena más larga que tiene? ¿Está sobreestimado o subestimado?

Lo ideal sería tener una idea de cómo es analíticamente el comportamiento asintótico (la parte curva para longitudes grandes) para poder extrapolar. Haga un gráfico del gap como $\Delta (L)$ frente a $1/L^2$. ¿Cómo se ve ahora la curva para longitudes grandes? Extrapole el gap.

El último gráfico estuvo de hecho motivado por el siguiente argumento: a partir del análisis de Haldane de la cadena de espín-1 mediante el modelo sigma no lineal, se espera que las excitaciones de menor energía (que para condiciones de frontera periódicas pueden etiquetarse por un momento $k$) estén alrededor de $k=\pi$ y tengan una energía

$$
E(k) = E_0 + \sqrt{\Delta^2 + c^2 (k-\pi)^2}.
$$

Para las condiciones de frontera abiertas, podemos aproximar $k-\pi$ por $1/L$ (piense en una partícula en una caja), lo que da un gap de tamaño finito de

$$
\Delta(L) \approx \Delta \left( 1 + \frac{c^2}{2\Delta^2 L^2} \right) 
$$

e indica que en el límite asintótico la convergencia debería ser esencialmente como $1/L^2$. ¿Qué tan cerca llega del resultado $\Delta/J=0.41052$?

Para quienes también calcularon el gap entre los estados fundamentales de los sectores de magnetización 0 y 1, muestren que el gap que obtienen ahí es esencialmente cero. Todos los demás, tomen este resultado por sentado y empiecen a preocuparse: ¿por qué el gap finito es el correcto y el gap nulo es el incorrecto? ¿Es esto una lotería física? De hecho, hay una muy buena razón por la que la cadena de espín-1 muestra este comportamiento peculiar para condiciones de frontera abiertas, que puede encontrarse analíticamente; pero incluso si no tuviéramos la fortuna de conocerla, ¡podríamos detectar el problema de inmediato! Esto puede hacerse mediante la observación de observables locales.
