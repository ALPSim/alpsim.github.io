
---
title: Introducción
math: true
weight: 1
---

Las simulaciones clásicas de Monte Carlo (MC) son una técnica computacional potente y ampliamente utilizada para estudiar la mecánica estadística de sistemas físicos. Llamado así por el famoso casino de Monte Carlo debido a su dependencia del muestreo aleatorio, este método es particularmente adecuado para investigar sistemas con un gran número de grados de libertad, donde las soluciones analíticas suelen ser intratables. Las simulaciones de Monte Carlo se basan en procesos estocásticos y reglas probabilísticas, permitiendo la exploración de propiedades de equilibrio, transiciones de fase, y comportamiento termodinámico en un sistema físico.

En el núcleo de las simulaciones clásicas de Monte Carlo está el concepto de muestreo por importancia, donde las configuraciones del sistema se generan según una distribución de probabilidad que típicamente es la distribución de Boltzmann en el ensemble canónico. Al muestrear configuraciones en proporción a su peso estadístico, los métodos de Monte Carlo permiten el cálculo de promedios de ensemble de cantidades físicas, como la energía, la magnetización, o las funciones de correlación, sin enumerar explícitamente todos los estados posibles del sistema, una tarea que a menudo es computacionalmente inviable.

## Principios Clave de las Simulaciones de Monte Carlo

### Ergodicidad
Un requisito fundamental para las simulaciones de Monte Carlo es la ergodicidad, que garantiza que la simulación explore todo el espacio de configuraciones del sistema dado suficiente tiempo. En otras palabras, todo estado posible del sistema debe ser accesible mediante una secuencia de movimientos de Monte Carlo. Sin ergodicidad, la simulación puede quedar atrapada en un subconjunto de configuraciones, produciendo resultados sesgados. Garantizar la ergodicidad a menudo requiere un diseño cuidadoso de los movimientos de Monte Carlo, especialmente para sistemas con paisajes energéticos complejos.

### Balance Detallado
Otro principio crítico en las simulaciones de Monte Carlo es el balance detallado, que garantiza que el sistema evolucione hacia el equilibrio y muestree estados según la distribución de probabilidad deseada (p. ej., la distribución de Boltzmann). El balance detallado es una condición que garantiza que las probabilidades de transición entre estados satisfagan:
$$
P_i \cdot P_{i \to j} = P_j \cdot P_{j \to i},
$$
donde $P_i$ y $P_j$ son las probabilidades de equilibrio de los estados $i$ y $j$, y $P_{i \to j}$ es la probabilidad de transición del estado $i$ al estado $j$.

## Algoritmo de Metropolis-Hastings
El algoritmo de Metropolis-Hastings, una de las técnicas de Monte Carlo más comúnmente usadas, impone el balance detallado aceptando o rechazando los movimientos propuestos según un criterio probabilístico que depende del cambio de energía y de la temperatura del sistema. Emplea un proceso de cadena de Markov para generar una secuencia de configuraciones, garantizando que el sistema evolucione hacia el equilibrio. El algoritmo implica los siguientes pasos:
1. Proponer un cambio aleatorio al sistema (p. ej., desplazamientos de partículas o inversiones de espín).
2. Calcular el cambio de energía $\Delta E$ asociado con el movimiento propuesto.
3. Aceptar o rechazar el movimiento según la probabilidad de aceptación:
$$
P_{i \to j} = \min\left(1, e^{-\beta \Delta E}\right),
$$
donde $\beta = 1/(k_B T)$ es la temperatura inversa. Esta regla de aceptación garantiza el balance detallado y conduce al sistema hacia el equilibrio.

## Algoritmo de Heat-Bath
Para el algoritmo de heat-bath, las probabilidades de transición se diseñan explícitamente para satisfacer esta condición. La probabilidad de equilibrio de un estado viene dada por la distribución de Boltzmann:
$$
P_i \propto e^{-\beta E_i},
$$
donde $E_i$ es la energía total del sistema en el estado $i$. Sea la probabilidad de transición del estado $i$ al estado $j$
$$
P_{i \to j} = \frac{e^{-\beta E_j}}{e^{-\beta E_i} + e^{-\beta E_j}},
$$
y correspondientemente la probabilidad de transición del estado $j$ al estado $i$
$$
P_{j \to i} = \frac{e^{-\beta E_i}}{e^{-\beta E_i} + e^{-\beta E_j}}.
$$

Sustituyendo las probabilidades de transición en la condición de balance detallado, tenemos:
$$
P_i \cdot P_{i \to j} = e^{-\beta E_i} \cdot \frac{e^{-\beta E_j}}{e^{-\beta E_i} + e^{-\beta E_j}} = e^{-\beta E_j} \cdot \frac{e^{-\beta E_i}}{e^{-\beta E_i} + e^{-\beta E_j}} = P_j \cdot P_{j \to i}.
$$
Por lo tanto, el algoritmo de heat-bath satisface intrínsecamente el balance detallado.
