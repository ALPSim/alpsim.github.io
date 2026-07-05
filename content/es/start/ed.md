---
title: Exact Diagonalization
linkTitle: Diagonalización Exacta
description: "Calcula la brecha de Haldane de la cadena de Heisenberg con S=1 usando diagonalización exacta dispersa."
weight: 5
math: true
---

{{< callout type="info" >}}
Este tutorial asume que pyalps ya está instalado. Si aún no lo has configurado, consulta la guía de [Primeros Pasos](../).
{{< /callout >}}

## ¿Qué es la diagonalización exacta?

La **diagonalización exacta (exact diagonalization, ED)** es el enfoque más directo para resolver un problema cuántico de muchos cuerpos: construir explícitamente la matriz del hamiltoniano en una base de estados de muchos cuerpos, y luego encontrar sus autovalores y autovectores. El resultado es numéricamente exacto — sin aproximaciones, sin problema de signo, sin error de muestreo. La contrapartida es el costo: para una cadena de espín-$S$ de $L$ sitios, el espacio de Hilbert tiene dimensión $(2S+1)^L$, que crece exponencialmente. Para $S=1$ esto significa $3^{16} \approx 43$ millones de estados para $L = 16$, y $3^{20} \approx 3.5$ mil millones para $L = 20$ — ya al límite de lo manejable incluso en grandes computadoras.

El código `sparsediag` de ALPS aborda esto mediante **diagonalización dispersa (sparse diagonalization)** vía el algoritmo de Lanczos: en lugar de diagonalizar la matriz completa, construye un pequeño subespacio de Krylov a partir de productos matriz-vector repetidos $H|\psi\rangle$ y extrae de él los primeros autovalores más bajos. Esto es práctico porque el hamiltoniano de Heisenberg es extremadamente disperso — cada estado de base está conectado a solo $O(L)$ otros (uno por enlace), por lo que cada producto matriz-vector cuesta $O(L \cdot \dim)$ en lugar de $O(\dim^2)$.

ED complementa a QMC: da espectros exactos del estado fundamental y de baja energía a temperatura cero, funciona para cualquier modelo sin importar los problemas de signo, pero está limitado a tamaños de sistema accesibles por Lanczos ($L \lesssim 20$ para $S=1$).

## El modelo físico: la cadena de Heisenberg con S=1

Este tutorial estudia el modelo de Heisenberg antiferromagnético en una cadena unidimensional,

$$
H = J \sum_{i=1}^{L} \mathbf{S}_i \cdot \mathbf{S}_{i+1}, \quad J > 0,
$$

donde cada $\mathbf{S}_i$ es un operador de espín-1. Este modelo describe una cadena de momentos magnéticos con intercambio antiferromagnético a primeros vecinos.

### La conjetura de Haldane

En 1983, Duncan Haldane hizo una predicción sorprendente: el estado fundamental de las cadenas antiferromagnéticas de espín entero ($S = 1, 2, \ldots$) tiene **brecha (gapped)** — hay un costo de energía finito $\Delta$ para crear cualquier excitación por encima del estado fundamental. Las cadenas de espín semientero ($S = 1/2, 3/2, \ldots$), en cambio, no tienen brecha (**gapless**), con un espectro continuo de excitaciones de baja energía que llega hasta energía cero.

Esto fue inesperado porque la intuición clásica y los argumentos simples de campo medio sugieren que ambos casos deberían comportarse de manera similar. La distinción surge de una contribución topológica en la descripción de teoría cuántica de campos que está presente para espín semientero pero ausente para espín entero. La conjetura de Haldane fue inicialmente controvertida, pero desde entonces se ha confirmado numéricamente con gran precisión y experimentalmente en materiales como el Ni(C$_2$H$_8$N$_2$)$_2$NO$_2$(ClO$_4$) (NENP).

Para la cadena con $S = 1$, la brecha converge a

$$
\Delta \approx 0.411\,J
$$

en el límite termodinámico ($L \to \infty$). En una cadena finita de longitud $L$, la brecha aparente es mayor y se cierra exponencialmente hacia el valor termodinámico:

$$
\Delta(L) \approx \Delta + A\, e^{-L/\xi},
$$

donde $\xi \approx 6$ es la longitud de correlación de la fase de Haldane. Dado que $\xi$ no es pequeño, las cadenas de hasta $L = 16$ todavía muestran correcciones de tamaño finito significativas — por eso se necesita una extrapolación cuidadosa.

## Estrategia

Vamos a:
1. Ejecutar `sparsediag` en cadenas de longitud $L \in \{4, 6, 8, 10, 12, 14, 16\}$.
2. Para cada $L$, calcular la energía más baja en el sector $S_z = 0$ (estado fundamental singlete) y en el sector $S_z = 1$ (estado triplete más bajo).
3. Formar la brecha $\Delta(L) = E_0(S_z=1,L) - E_0(S_z=0,L)$.
4. Ajustar la fórmula exponencial de tamaño finito y extraer $\Delta$.

## Importaciones

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

## Sectores de números cuánticos

Antes de ver el código, vale la pena entender por qué ejecutamos dos diagonalizaciones separadas por cada longitud de cadena — una con `Sz_total=0` y otra con `Sz_total=1`.

El hamiltoniano de Heisenberg conmuta con la magnetización total $S_z^{\text{total}} = \sum_i S_z^i$, lo que significa que el $S_z$ total se conserva: $[H, S_z^{\text{total}}] = 0$. El espacio de Hilbert completo, por lo tanto, se bloque-diagonaliza en sectores independientes etiquetados por $S_z^{\text{total}} = -SL, \ldots, SL$. Podemos diagonalizar cada bloque de forma independiente.

Esta es la clave para hacer que ED sea manejable. Para $L = 16$, $S = 1$, el espacio de Hilbert completo tiene dimensión $3^{16} \approx 43$ millones; el sector $S_z = 0$ tiene dimensión aproximadamente $14$ millones — menor, pero, crucialmente, ALPS también aprovecha la simetría traslacional y la paridad, reduciendo la dimensión efectiva en otro factor de $2L$. Trabajar en sectores en lugar de en el espacio completo es esencial.

El **estado fundamental singlete** del antiferromagneto se encuentra en $S_z = 0$. El **estado excitado triplete más bajo** — el primer estado con espín total 1 — aparece como el estado fundamental del sector $S_z = 1$. Su diferencia de energía es la brecha de tripletes.

## Parámetros y archivos de entrada

```python
parms = []
for l in [4, 6, 8, 10, 12, 14, 16]:
    for sz in [0, 1]:
        parms.append(
          {
            'LATTICE'                  : "chain lattice",
            'MODEL'                    : "spin",
            'local_S'                  : 1,               # S=1 spin chain
            'J'                        : 1,               # antiferromagnetic exchange (sets energy scale)
            'L'                        : l,               # chain length
            'CONSERVED_QUANTUMNUMBERS' : 'Sz',            # tell ALPS to block-diagonalize in Sz
            'Sz_total'                 : sz               # target sector (0=singlet, 1=triplet)
          }
        )

input_file = pyalps.writeInputFiles('parm2a', parms)
```

`writeInputFiles` crea los archivos de entrada XML en el formato de ALPS que lee `sparsediag`. El prefijo `'parm2a'` se usa para nombrar los archivos de salida.

## Ejecutando el solucionador

```python
res = pyalps.runApplication('sparsediag', input_file)
```

`sparsediag` ejecuta el algoritmo de Lanczos en cada conjunto de parámetros. Para cada combinación de $(L, S_z)$, bloque-diagonaliza aún más dentro del sector $S_z$ usando la simetría traslacional — así que en realidad resuelve una matriz más pequeña por cada momento de red $k = 0, \frac{2\pi}{L}, \ldots, \frac{2\pi(L-1)}{L}$. La salida se almacena en archivos HDF5 nombrados según el prefijo.

## Cargando los resultados y entendiendo la estructura de datos

```python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm2a'))
```

`data` es una lista de simulaciones, una por cada conjunto de parámetros. Cada elemento `sim` en `data` es a su vez una lista de objetos `DataSet` — uno por cada subsector de momento de red $k$ dentro del sector $S_z$ elegido. Cada `DataSet` lleva:
- `sec.props`: los parámetros de esta ejecución (incluyendo `'L'`, `'Sz_total'`, `'TOTAL_MOMENTUM'`).
- `sec.y`: un arreglo de NumPy con los autovalores encontrados en este subsector $k$.

## Extrayendo la brecha

El estado fundamental en cada sector $S_z$ puede tener cualquier momento de red, así que recolectamos todos los autovalores a través de todos los subsectores $k$ y tomamos el mínimo global:

```python
lengths      = []
min_energies = {}
for sim in data:
    l  = int(sim[0].props['L'])
    if l not in lengths: lengths.append(l)
    sz = int(sim[0].props['Sz_total'])
    all_energies = []
    for sec in sim:          # loop over k-subsectors within this (L, Sz) run
        all_energies += list(sec.y)
    min_energies[(l, sz)] = np.min(all_energies)
```

Después de este bucle, `min_energies[(l, 0)]` es la energía del estado fundamental en el sector singlete y `min_energies[(l, 1)]` es la energía del estado fundamental en el sector triplete, para cada longitud de cadena `l`.

## Extrapolación de tamaño finito

La brecha en cada tamaño finito es:

$$
\Delta(L) = E_0(S_z=1,\, L) - E_0(S_z=0,\, L).
$$

La graficamos en función de $1/L$ y ajustamos la corrección exponencial de tamaño finito:

$$
\Delta(L) = \Delta + A\, e^{-L/\xi}.
$$

Nótese que la gráfica usa $1/L$ como eje $x$ (de modo que el límite termodinámico está en $x = 0$), pero la función de ajuste `f` está escrita en términos de $L$ y se llama con `1/x`. Los objetos `fw.Parameter` mantienen los parámetros de ajuste; después de que `fw.fit` se ejecuta, `p[0]()` recupera el valor ajustado de $\Delta$, `p[1]()` da $A$, y `p[2]()` da $\xi$.

Ajustamos solo $L \geq 8$ (el índice `[2:]` omite $L = 4$ y $L = 6$) para evitar las mayores correcciones al escalamiento que ocurren en las cadenas más pequeñas, donde la longitud de la cadena no es mucho mayor que el espaciado de red:

```python
gapplot = pyalps.DataSet()
gapplot.x = 1./np.sort(lengths)
gapplot.y = [min_energies[(l,1)] - min_energies[(l,0)] for l in np.sort(lengths)]
gapplot.props['xlabel'] = '$1/L$'
gapplot.props['ylabel'] = 'Triplet gap $\Delta/J$'
gapplot.props['label']  = 'S=1'
gapplot.props['line']   = '.'

plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0, 0.25)
plt.ylim(0, 1.0)

# Initial guesses: Delta~0.411 (known Haldane gap), A~1000, xi~6
pars = [fw.Parameter(0.411), fw.Parameter(1000), fw.Parameter(6)]
f = lambda self, x, p: p[0]() + p[1]()*np.exp(-x/p[2]())
fw.fit(None, f, pars, np.array(gapplot.y)[2:], np.sort(lengths)[2:])  # fit L >= 8

x = np.linspace(0.0001, 1./min(lengths), 100)
plt.plot(x, f(None, 1/x, pars))

plt.show()
```

## Resultado

La curva ajustada se extrapola a la intersección con el eje $y$ en $1/L = 0$, dando $\Delta \approx 0.411\,J$ — en buen acuerdo con las mejores estimaciones numéricas de la brecha de Haldane (White & Huse, 1993: $\Delta = 0.41048\,J$). Esto confirma la fase de Haldane y valida el solucionador `sparsediag` de ALPS.

La gráfica muestra la brecha de tripletes disminuyendo a medida que $L$ crece, con la curva ajustada capturando la convergencia exponencial:

![Brecha de tripletes vs 1/L para la cadena de Heisenberg con S=1, extrapolando a la brecha de Haldane](/figs/ED_spin.png)
