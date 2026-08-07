
---
title: Expansión en Serie Estocástica (SSE)
math: true
weight: 4
---

El método de Expansión en Serie Estocástica (SSE) es una técnica de Monte Carlo cuántico (QMC) a temperatura finita que expande la función de partición $Z$ del sistema cuántico en una serie de potencias del hamiltoniano. Originalmente se aplicó al modelo de Heisenberg [^Sandvik99], pero puede extenderse fácilmente a otros modelos cuánticos, como el modelo de Bose-Hubbard.

La función de partición de un modelo cuántico viene dada por:

$$
Z = \text{Tr}(e^{-\beta \mathcal{H}}),
$$

donde $\beta = 1/(k_B T)$ es la temperatura inversa y $\mathcal{H}$ es el hamiltoniano. La idea clave de SSE es expresar el operador exponencial $e^{-\beta \mathcal{H}}$ como una serie de Taylor:

$$
e^{-\beta \mathcal{H}} = \sum_{n=0}^\infty \frac{(-\beta)^n}{n!} \mathcal{H}^n.
$$

Insertando un conjunto completo de estados de base $\{|\alpha\rangle\}$, la función de partición puede reescribirse como:

$$
Z = \sum_{\alpha} \sum_{n=0}^\infty \frac{(-\beta)^n}{n!} \langle \alpha | \mathcal{H}^n | \alpha \rangle.
$$

Dependiendo de la temperatura, el orden de expansión de SSE en la simulación nunca excederá un orden finito $N$. El método SSE entonces trunca esta serie de expansión en el orden $N$ y muestrea los términos estocásticamente. El hamiltoniano $\mathcal{H}$ se descompone típicamente en una suma de términos de interacción elementales $H_{i,j}$, como los operadores de enlace para el modelo de Heisenberg:

$$
\mathcal{H} = -\sum_{i,j} H_{i,j}.
$$

Cada término $H_{i,j}$ actúa sobre un par de sitios y puede representarse en una base adecuada. El algoritmo SSE entonces muestrea configuraciones que consisten en una secuencia de estos operadores.

Para el modelo de Heisenberg, el operador de enlace $H_{i,j}$ puede expresarse como:

$$
H_{i,j} = J \left( S_i^z S_j^z + \frac{1}{2} (S_i^+ S_j^- + S_i^- S_j^+) \right),
$$

donde $S_i^z$ es la componente $z$ del operador de espín, y $S_i^+$ y $S_i^-$ son los operadores de subida y bajada de espín, respectivamente. El primer término, $S_i^z S_j^z$, representa la **parte diagonal** de la interacción, mientras que el segundo término, $\frac{1}{2} (S_i^+ S_j^- + S_i^- S_j^+)$, representa la **parte no diagonal**.

### Elementos de matriz diagonales y no diagonales

#### Modelo de Heisenberg
En el marco de SSE, el hamiltoniano de Heisenberg se expresa en términos de operadores diagonales y no diagonales. Para un estado de base dado $|\alpha\rangle$, los elementos de matriz del operador de enlace $H_{i,j}$ son:

1. **Elementos de Matriz Diagonales**:
   Estos corresponden al término $S_i^z S_j^z$ y vienen dados por:
   $$
   \langle \alpha | S_i^z S_j^z | \alpha \rangle = S_i^z S_j^z,
   $$
   donde $S_i^z$ y $S_j^z$ son las componentes $z$ de los espines en el estado $|\alpha\rangle$.

2. **Elementos de Matriz No Diagonales**:
   Estos corresponden a los términos de inversión de espín $S_i^+ S_j^-$ y $S_i^- S_j^+$. Para un estado $|\alpha\rangle$, los elementos de matriz no diagonales son:
   $$
   \langle \alpha | S_i^+ S_j^- | \alpha^{\prime} \rangle = \frac{1}{2} \delta_{\alpha, \alpha^{\prime} \text{ with } S_i^+ S_j^-},
   $$
   y
   $$
   \langle \alpha | S_i^- S_j^+ | \alpha^{\prime} \rangle = \frac{1}{2} \delta_{\alpha, \alpha' \text{ with } S_i^- S_j^+},
   $$
   donde $\alpha$ y $\alpha^{\prime}$ es el estado obtenido al invertir los espines en los sitios $i$ y $j$.
   
#### Modelo de Bose-Hubbard
El modelo de Bose-Hubbard describe bosones en una red con interacciones en el mismo sitio y hopping a primeros vecinos. El hamiltoniano viene dado por:

$$
H = -t \sum_{\langle i,j \rangle} (b_i^\dagger b_j + \text{h.c.}) + \frac{U}{2} \sum_i n_i (n_i - 1) - \mu \sum_i n_i,
$$

donde:
- $t$ es la amplitud de hopping,
- $U$ es la intensidad de la interacción en el mismo sitio,
- $\mu$ es el potencial químico,
- $b_i^\dagger$ y $b_i$ son los operadores bosónicos de creación y aniquilación en el sitio $i$,
- $n_i = b_i^\dagger b_i$ es el operador número,
- $\langle i,j \rangle$ denota pares de primeros vecinos.

El hamiltoniano de Bose-Hubbard $\mathcal{H}$ se descompone en un conjunto de operadores de enlace $H_{i,j}$ (para el hopping) y $H_i$ (para las interacciones en el mismo sitio):
$$
H = -\sum_b H_b,
$$
donde $b$ etiqueta los enlaces o sitios. Para el modelo de Bose-Hubbard:
- Términos de hopping: $H_{i,j} = t (b_i^\dagger b_j + b_j^\dagger b_i)$,
- Términos en el mismo sitio: $H_i = \frac{U}{2} n_i (n_i - 1) - \mu n_i$.

### Inserción de Estados de Base

En el método SSE, la función de partición se expande en términos de estados de base $|\alpha\rangle$ y secuencias de operadores. Una configuración típica en la expansión SSE consiste en:

1. Un estado de base $|\alpha_0\rangle$ (el estado inicial).
2. Una secuencia de operadores $H_{i,j}$ actuando sobre el estado.

La función de partición puede escribirse entonces como:

$$
Z = \sum_{\alpha_0} \sum_{n=0}^N \frac{(-\beta)^n}{n!} \sum_{\{H_{i,j}\}} \langle \alpha_0 | H_{i_1,j_1} H_{i_2,j_2} \cdots H_{i_n,j_n} | \alpha_0 \rangle,
$$

donde $N$ es el corte del orden de expansión y $\{H_{i,j}\}$ representa una secuencia de $n$ operadores. Los elementos de matriz de los operadores se evalúan en los estados de base, y la secuencia de operadores debe satisfacer la condición de que el estado final coincida con el estado inicial $|\alpha_0\rangle$.

### Pasos del Algoritmo SSE

1. **Inicialización**: Comenzar con un estado inicial $|\alpha\rangle$ y una secuencia de operadores vacía.
2. **Inserción de Operadores**: Proponer insertar o eliminar operadores diagonales $H_{i,j}$ en la secuencia, actualizando el estado $|\alpha\rangle$ correspondientemente.
3. **Actualizaciones Diagonales**: Asegurar que la secuencia de operadores sea consistente con el hamiltoniano y los estados de base.
4. **Actualizaciones de Bucle**: Realizar actualizaciones no locales para mejorar la eficiencia del muestreo, a menudo usando algoritmos de cluster o de bucle adaptados a los modelos de espín u otros modelos bosónicos [^Syljuasen02] [^pollet04] [^Alet05].
5. **Medición**: Calcular cantidades físicas, como la energía, la magnetización, y las funciones de correlación, promediando sobre las configuraciones muestreadas.

El método SSE es particularmente ventajoso para el modelo de Heisenberg porque evita el problema de signo para ciertas geometrías (p. ej., redes bipartitas) y proporciona un muestreo eficiente tanto en los regímenes de baja como de alta temperatura. Se ha aplicado con éxito para estudiar una amplia gama de fenómenos, incluyendo transiciones de fase cuánticas, dinámica de espín, y sistemas bosónicos.


[^Sandvik99]: Sandvik, A. W., "Stochastic Series Expansion Method with Operator-Loop Update", *Physical Review B*, 59, R14157-R14160 (1999).
[^Syljuasen02]: Syljuåsen, O. F. y Sandvik, A. W., "Quantum Monte Carlo with Directed Loops", *Physical Review E*, 66, 046701 (2002).
[^pollet04]: Pollet, L., et al., "Optimal Monte Carlo Updating", *Physical Review E*, 70, 056705 (2004).
[^Alet05]: Alet, F., et al., "Generalized Directed Loop Method for Quantum Monte Carlo Simulations", *Physical Review E*, 71, 036706 (2005).
