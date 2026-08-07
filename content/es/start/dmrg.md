---
title: Density Matrix Renormalization Group
linkTitle: DMRG
description: "Encuentra el estado fundamental de una cadena de Heisenberg de 32 sitios con S=1/2 usando DMRG y estudia su convergencia."
weight: 4
math: true
---

{{< callout type="info" >}}
Este tutorial asume que pyalps ya está instalado. Si aún no lo has configurado, consulta la guía de [Primeros Pasos](../).
{{< /callout >}}

## ¿Qué es DMRG?

El **Density Matrix Renormalization Group (DMRG)** fue introducido por Steven White en 1992 y rápidamente se convirtió en el método de elección para modelos de red cuánticos unidimensionales. DMRG encuentra el estado fundamental de manera variacional dentro de la familia de **estados de producto matricial (matrix product states, MPS)**: funciones de onda de la forma

$$
|\psi\rangle = \sum_{s_1, \ldots, s_L} A_1^{s_1} A_2^{s_2} \cdots A_L^{s_L} \, |s_1 s_2 \cdots s_L\rangle,
$$

donde cada $A_i^{s_i}$ es una matriz de dimensión a lo sumo $m \times m$. El entero $m$ — llamado la **dimensión de enlace (bond dimension)** — controla la precisión de la aproximación: $m = 1$ es un estado producto, y aumentar $m$ captura más entrelazamiento cuántico.

¿Por qué funciona esto tan bien en 1D? Los estados fundamentales con brecha (gapped) de hamiltonianos locales satisfacen una **ley de área**: la entropía de entrelazamiento de cualquier bloque contiguo de sitios está acotada por una constante independiente del tamaño del bloque. Esto significa que el estado fundamental exacto puede aproximarse bien con un MPS de $m$ fijo y moderado. Para la cadena de Heisenberg con $S = 1/2$ (que no tiene brecha, es "gapless"), la entropía de entrelazamiento crece solo logarítmicamente, por lo que $m \sim 100$–$1000$ suele ser suficiente.

DMRG optimiza las matrices $A_i$ mediante **barridos (sweeping)**: comienza desde un extremo de la cadena, optimiza las matrices en cada sitio por turno mientras mantiene fijas todas las demás, luego barre de vuelta desde el otro extremo, repitiendo hasta la convergencia. Cada paso de optimización es un pequeño problema de autovalores — mucho más barato que la diagonalización completa que requiere ED. El costo de un barrido de DMRG escala como $O(L m^3 d)$, donde $d$ es la dimensión del espacio de Hilbert local, frente a $O(d^L)$ para ED. Para $L = 32$ y $d = 2$, ED requeriría $2^{32} \approx 4$ mil millones de estados; DMRG con $m = 100$ es completamente rutinario.

**¿Por qué condiciones de frontera abiertas?** DMRG es mucho más eficiente en cadenas con fronteras abiertas (open boundary conditions, OBC) que con condiciones de frontera periódicas (periodic boundary conditions, PBC). Con PBC, la estructura de entrelazamiento envuelve la cadena, duplicando aproximadamente la dimensión de enlace efectiva necesaria para la misma precisión. Por lo tanto, OBC es la elección estándar para los cálculos de DMRG.

## El modelo físico

Estudiamos la cadena de Heisenberg antiferromagnética con $S = 1/2$,

$$
H = J \sum_{i=1}^{L-1} \mathbf{S}_i \cdot \mathbf{S}_{i+1}, \quad J > 0,
$$

en $L = 32$ sitios con condiciones de frontera abiertas. A diferencia de la cadena con $S = 1$ (que tiene la brecha de Haldane), la cadena con $S = 1/2$ no tiene brecha (**gapless**): su espectro de baja energía forma un líquido de Tomonaga-Luttinger (TLL) con correlaciones de ley de potencia. Su energía exacta del estado fundamental por enlace, en el límite termodinámico, está dada por el ansatz de Bethe:

$$
e_0 = \frac{1}{4} - \ln 2 \approx -0.4431\,J \quad \text{por enlace}.
$$

Este es uno de los sistemas de referencia (benchmark) más estudiados en física cuántica computacional, y un punto de partida ideal para aprender DMRG.

## Ejecutando la simulación

Toda la configuración, ejecución y análisis caben en un único script de Python:

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

parms = [ {
        'LATTICE'                  : "open chain lattice",   # open boundary conditions (better for DMRG)
        'MODEL'                    : "spin",
        'CONSERVED_QUANTUMNUMBERS' : 'N,Sz',                 # exploit N and Sz conservation to block-diagonalize
        'Sz_total'                 : 0,                      # target the Sz=0 sector (ground state)
        'J'                        : 1,                      # antiferromagnetic exchange
        'SWEEPS'                   : 4,                      # number of DMRG sweeps (left→right→left = 1 sweep)
        'NUMBER_EIGENVALUES'       : 1,                      # find only the ground state
        'L'                        : 32,                     # chain length
        'MAXSTATES'                : 100                     # bond dimension m (key accuracy parameter)
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half', parms)
res = pyalps.runApplication('dmrg', input_file, writexml=True)
```

### Notas sobre los parámetros

- **`MAXSTATES`** es el parámetro de precisión más importante. Establece la dimensión de enlace máxima $m$. Aumentarlo mejora la precisión a costa del tiempo de cómputo (que escala como $m^3$). Para este benchmark de 32 sitios, $m = 100$ da un error de truncamiento muy por debajo de $10^{-6}$.
- **`SWEEPS`** es el número de barridos completos de izquierda a derecha y de vuelta. Cuatro barridos son suficientes para demostrar la convergencia aquí; los cálculos de producción suelen usar entre 10 y 20 barridos, o barrer hasta que el cambio de energía por barrido caiga por debajo de un umbral.
- **`CONSERVED_QUANTUMNUMBERS: 'N,Sz'`** le indica a DMRG que aproveche tanto el número total de partículas $N$ como la magnetización total $S_z$ como buenos números cuánticos, bloque-diagonalizando las matrices del MPS. Esto hace que el cálculo sea más rápido y numéricamente más estable.
- **`NUMBER_EIGENVALUES: 1`** apunta únicamente al estado fundamental. Aumentar este valor permite que DMRG apunte simultáneamente a los primeros autoestados más bajos, con un costo adicional.

## Cargando los observables del estado fundamental

Después de la simulación, `loadEigenstateMeasurements` recupera todos los observables medidos por el código DMRG — energía, magnetización, funciones de correlación y cualquier otra cantidad que ALPS haya calculado para el estado fundamental convergido final:

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))

for s in data[0]:
    print(s.props['observable'], ' : ', s.y[0])
```

Cada elemento `s` en `data[0]` corresponde a un observable. `s.props['observable']` es su nombre (por ejemplo, `'Energy'`, `'Magnetization'`) y `s.y[0]` es su valor. La energía del estado fundamental debería estar cerca de $E_0 \approx -14.3\,J$ para esta cadena abierta de 32 sitios.

## Cargando el historial de iteraciones

Para entender cómo convergió el algoritmo, cargamos las mediciones por barrido:

```python
itr = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                               what=['Iteration Energy', 'Iteration Truncation Error'])
```

`itr[0][0]` contiene la energía registrada en cada medio barrido; `itr[0][1]` contiene el error de truncamiento en cada paso. El **error de truncamiento** es la suma de los autovalores descartados de la matriz de densidad reducida — el peso en el estado fundamental exacto que el MPS con $m$ estados no puede representar. Un cálculo bien convergido debería alcanzar un error de truncamiento por debajo de $10^{-6}$; para $m = 100$ en este sistema, son típicos valores alrededor de $10^{-8}$–$10^{-7}$.

## Graficando la convergencia

```python
plt.figure()
pyalps.plot.plot(itr[0][0])
plt.title('Iteration history of ground state energy (S=1/2)')
plt.ylim(-15, 0)
plt.ylabel('$E_0$')
plt.xlabel('Iteration')

plt.figure()
pyalps.plot.plot(itr[0][1])
plt.title('Iteration history of truncation error (S=1/2)')
plt.yscale('log')
plt.ylabel('Truncation error')
plt.xlabel('Iteration')

plt.show()
```

## Resultados

La energía converge rápidamente a una meseta dentro de los primeros barridos. La siguiente gráfica muestra la energía en función del número de iteración — se estabiliza mucho antes del barrido final:

![Convergencia de la energía del estado fundamental a lo largo de las iteraciones de DMRG](/figs/dmrg/dmrg_energy.png)

El error de truncamiento decae monótonamente en escala logarítmica, reflejando la mejora en la calidad de la aproximación MPS con cada barrido:

![Decaimiento del error de truncamiento a lo largo de las iteraciones de DMRG (escala logarítmica)](/figs/dmrg/dmrg_truncation.png)

Una vez que ambas curvas se han aplanado, el cálculo está convergido. Para mejorar aún más la precisión, aumenta `MAXSTATES` y verifica que la energía y el error de truncamiento cambien de forma despreciable.
