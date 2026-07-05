---
title: Modelo de Bosones de Núcleo Duro
math: true
weight: 7
---

## Introducción

El **modelo de bosones de núcleo duro (hardcore boson)** es un marco teórico fundamental en la física de la materia condensada y la teoría cuántica de muchos cuerpos, utilizado para estudiar sistemas de partículas bosónicas con una repulsión infinita en el mismo sitio que impide que más de una partícula ocupe el mismo sitio de la red. Esta restricción, conocida como la condición de "núcleo duro", imita el principio de exclusión de Pauli de los fermiones pero aplicado a bosones, convirtiendo al modelo en un puente único entre el comportamiento bosónico y fermiónico.

En el modelo de bosones de núcleo duro, las partículas se describen mediante operadores de creación ($b_i^\dagger$) y aniquilación ($b_i$) que obedecen relaciones de conmutación modificadas debido a la restricción de núcleo duro. En concreto, los operadores satisfacen:

$$
[b_i, b_j^\dagger] = \delta_{ij} (1 - 2 b_i^\dagger b_i), \quad (b_i^\dagger)^2 = (b_i)^2 = 0,
$$

donde la condición $(b_i^\dagger)^2 = 0$ impone la restricción de núcleo duro, garantizando que no más de un bosón pueda ocupar un solo sitio. El hamiltoniano del modelo de bosones de núcleo duro típicamente incluye términos de salto (hopping) e interacción entre partículas, y puede escribirse como:

$$
H = -t \sum_{\langle i,j \rangle} \left( b_i^\dagger b_j + \text{h.c.} \right) + V \sum_{\langle i,j \rangle} n_i n_j,
$$

donde:
- $t$ es la amplitud de salto entre sitios primeros vecinos $\langle i,j \rangle$,
- $V$ es la intensidad de la interacción entre bosones en sitios vecinos,
- $n_i = b_i^\dagger b_i$ es el operador de número, que representa la ocupación del sitio $i$.

El primer término del hamiltoniano describe la energía cinética de los bosones que saltan entre los sitios de la red, mientras que el segundo término da cuenta de las interacciones entre bosones en sitios adyacentes. Dependiendo de los valores de $t$ y $V$, el sistema puede exhibir una variedad de fases, incluyendo fases superfluida, aislante de Mott y de onda de densidad de carga.

## Fenómenos
El modelo de bosones de núcleo duro se usa ampliamente para explorar fenómenos como:
- **Transiciones de fase cuánticas**: Transiciones entre fases superfluidas y aislantes impulsadas por cambios en parámetros como la densidad o la intensidad de la interacción.
- **Condensación de Bose-Einstein**: La aparición de coherencia macroscópica en sistemas de bosones que interactúan.
- **Magnetismo cuántico**: El mapeo del modelo a sistemas de espín, donde los bosones de núcleo duro pueden representar excitaciones de espín.

A pesar de su simplicidad, el modelo de bosones de núcleo duro captura características esenciales de los sistemas bosónicos fuertemente correlacionados y sirve como una herramienta valiosa para entender la física cuántica de muchos cuerpos. También está estrechamente relacionado con otros modelos, como el modelo XY y el modelo de Heisenberg, mediante mapeos entre los grados de libertad bosónicos y de espín.

## Métodos

