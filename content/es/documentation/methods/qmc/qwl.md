
---
title: Algoritmo de Wang-Landau Cuántico 
math: true
weight: 7
---

## Introducción

El código `qwl` proporciona una implementación multi-cluster del método de Wang-Landau cuántico (QWL) basado en el esquema de Monte Carlo cuántico de expansión en serie estocástica (SSE). El método QWL fue desarrollado por miembros de la colaboración ALPS, M. Troyer, S. Wessel, y F. Alet, como una extensión del algoritmo clásico de Wang-Landau al caso cuántico. El método SSE subyacente fue inventado por A. Sandvik y colaboradores. Usando el enfoque QWL, se pueden extraer cantidades termodinámicas, como la energía o la entropía, a partir de una sola simulación en un ensemble extendido, basado en una expansión en serie de alta temperatura de la función de partición, cuyos coeficientes se calculan a alto orden en el transcurso de la simulación.

La implementación actual del método QWL se basa en una extensión del esquema original, propuesto en el caso clásico por C. Zhou y R. N. Bhatt. El algoritmo primero realiza una serie de pasos de refinamiento de Wang-Landau, usando el criterio de Zhou-Bhatt en lugar de la planitud del histograma. Tras obtener los pesos finales del ensemble, se realizan simulaciones adicionales en el ensemble resultante, incluyendo mediciones de observables.

**Nota:** Esta primera versión permite la simulación de modelos de espín de Heisenberg isotrópico-1/2, ferro- y antiferromagnéticos, en redes arbitrarias no frustradas a campo magnético cero. En el futuro, planeamos relajar esta restricción, y también proporcionar una implementación de la expansión perturbativa QWL.

## Ejecutar una simulación

se discute en el tutorial. Después de ejecutar una simulación usando el programa `qwl`, el script `qwl_evaluate` produce archivos XML de gráficos de las propiedades termodinámicas, así como (cuando se miden) las propiedades magnéticas, especificadas más abajo.

## Parámetros de entrada

Además de los parámetros de entrada comunes discutidos aquí, la aplicación `qwl` toma los siguientes parámetros de entrada:

| **Nombre** | **Valor por defecto** | **Descripción** |
| :------- | :---------- | :-------------- |
| CUTOFF | 500 | orden de expansión máximo conservado durante la simulación |
| T_MIN | 0.1 | temperatura más baja para la que `qwl_evaluate` calcula los observables (sobrescrito por su opción de línea de comandos \[-T_MIN ...\]) |
| T_MAX | 10 | temperatura más alta para la que `qwl_evaluate` calcula los observables (sobrescrito por su opción de línea de comandos \[-T_MAX ...\]) |
| DELTA_T | 0.1 | ancho del paso de temperatura usado por `qwl_evaluate` (sobrescrito por su opción de línea de comandos \[-DELTA_T ...\]) |
| MEASURE_MAGNETIC_PROPERTIES | 1 | activa (1) o desactiva (0) la medición de propiedades magnéticas uniformes y, si LATTICE es bipartita, alternadas (listadas más abajo) |

### Parámetros para expertos

Además, los siguientes parámetros pueden asignarse al algoritmo, en particular para permitir simulaciones usando el esquema de refinamiento QWL original.

| **Nombre** | **Valor por defecto** | **Descripción** |
| :------- | :---------- | :-------------- |
| NUMBER_OF_WANG_LANDAU_STEPS | 16 | número de pasos de refinamiento de Wang-Landau |
| SWEEPS | determinado durante el refinamiento de Wang-Landau | número de pasos de Monte Carlo en la simulación final de pesos fijos |
| USE_ZHOU_BHATT_METHOD | 1 | activa (1) o desactiva (0) el uso del método de Zhou-Bhatt (si está desactivado (0), se aplican FLATNESS_TRESHOLD y BLOCK_SWEEPS) |
| FLATNESS_TRESHOLD | N/A si USE_ZHOU_BHATT_METHOD=1; 0.2, si USE_ZHOU_BHATT_METHOD=0 | desviación máxima del máximo/mínimo del histograma respecto al valor promedio a alcanzar antes de reducir el factor de incremento (se aplica solo si USE_ZHOU_BHATT_METHOD=0) |
| BLOCK_SWEEPS | N/A, si USE_ZHOU_BHATT_METHOD=1; 10000, si USE_ZHOU_BHATT_METHOD=0 | número de barridos dentro de un paso de Wang-Landau antes de verificar la planitud (se aplica solo si USE_ZHOU_BHATT_METHOD=0) |
| INITIAL_MODIFICATION_FACTOR | e, si USE_ZHOU_BHATT_METHOD=1; determinado a partir de otros parámetros, si USE_ZHOU_BHATT_METHOD=0 | valor inicial del factor de incremento de los coeficientes de expansión durante el primer paso de refinamiento de Wang-Landau (en pasos sucesivos, el factor se reduce tomando su raíz cuadrada) |
| EXPANSION_ORDER_MINIMUM | 0 | orden de expansión mínimo de los coeficientes determinados |
| EXPANSION_ORDER_MAXIMUM | CUTOFF | orden de expansión máximo de los coeficientes determinados, no debe exceder CUTOFF |
| START_STORING | NUMBER_OF_WANG_LANDAU_STEPS | número de pasos de Wang-Landau en el que comienza el almacenamiento de los coeficientes de expansión |

## Mediciones 

El programa `qwl_evaluate` toma un archivo de salida XML de una simulación qwl,

    qwl_evaluate [-T_MIN ...] [-T_MAX ...] [-DELTA_T ...] prefix.out.xml

y produce archivos XML de gráficos (`prefix.plot.energy.xml`, etc.) para las siguientes cantidades vs. temperatura:

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| Energy Density | energía por sitio |
| Free Energy Density | energía libre por sitio |
| Entropy Density | entropía por sitio |
| Specific Heat per Site | calor específico por sitio |
| Uniform Structure Factor per Site | factor de estructura uniforme longitudinal por sitio (si MEASURE_MAGNETIC_PROPERTIES=1) |
| Uniform Susceptibility per Site | susceptibilidad uniforme por sitio (si MEASURE_MAGNETIC_PROPERTIES=1) |
| Staggered Structure Factor per Site | factor de estructura alternado longitudinal por sitio (si MEASURE_MAGNETIC_PROPERTIES=1, y solo para redes bipartitas) |

Las siguientes cantidades son medidas directamente por la aplicación `qwl`, y son de relevancia principalmente desde una perspectiva algorítmica.

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| Coefficients | estimación de los logaritmos $\ln[g(n)]$ de los coeficientes $g(n)$ de la expansión en serie de alta temperatura de la función de partición, $Z= \sum_n g(n)\beta_n$, después de SWEEPS barridos de pesos fijos, tomando en cuenta el histograma final (esto normalmente constituye la mejor estimación)|
| Coefficients # | estimación de $\ln[g(n)]$, después del #-ésimo paso de refinamiento de Wang-Landau (# ≥ START_STORING) |
| Histogram | histograma normalizado de los órdenes de expansión visitados durante los barridos de pesos fijos |
| Fraction | fracción de caminantes ascendentes para los órdenes de expansión visitados durante los barridos de pesos fijos |
| Time Up | tiempo para atravesar (tunelar) desde el coeficiente de expansión más bajo al más alto durante los barridos de pesos fijos |
| Time Down | tiempo para atravesar (tunelar) desde el coeficiente de expansión más alto al más bajo durante los barridos de pesos fijos |
| Time Total | tiempo para atravesar (tunelar) desde el más bajo al más alto y de vuelta al más bajo coeficiente de expansión durante los barridos de pesos fijos |
| Total Sweeps | número de barridos usados para la simulación total, incluyendo el refinamiento de Wang-Landau |
| Total Sweeps # | número de barridos usados para el #-ésimo paso de refinamiento de Wang-Landau (# ≥ START_STORING) |
| Uniform Structure Factor Coefficients | coeficientes de expansión del factor de estructura uniforme (si MEASURE_MAGNETIC_PROPERTIES=1) |
| Staggered Structure Factor Coefficients | coeficientes de expansión del factor de estructura alternado (si MEASURE_MAGNETIC_PROPERTIES=1, y solo para redes bipartitas) |

Otras cantidades también pueden estar disponibles según la versión exacta de la aplicación qwl.

## Referencias

- M. Troyer, S. Wessel y F. Alet, Phys. Rev. Lett. 90, 120201 (2003)
- S. Wessel, N. Stoop, E. Gull, S. Trebst, y M. Troyer, J. Stat. Mech. P12005 (2007)
- S. Trebst, D. A. Huse, y M. Troyer, Phys. Rev. E 70, 046701 (2004)
- C. Zhou y R.N. Bhatt, Phys. Rev. E 72, 025701(R) (2005) 

