---
title: Modelo de Bose-Hubbard
math: true
weight: 8
---

## Introducción

El **modelo de Bose-Hubbard** es una piedra angular de la física teórica, particularmente en el estudio de sistemas cuánticos de muchos cuerpos y gases atómicos ultrafríos. Describe el comportamiento de bosones que interactúan en una red, capturando la competencia entre la energía cinética (salto de bosones, hopping) y la energía potencial (interacciones en el mismo sitio). Este modelo se usa ampliamente para entender fenómenos como las transiciones de fase cuánticas, la superfluidez y el aislamiento de Mott.

El modelo de Bose-Hubbard se define mediante el siguiente hamiltoniano:

$$
H = -t \sum_{\langle i,j \rangle} \left( b_i^\dagger b_j + \text{h.c.} \right) + \frac{U}{2} \sum_i n_i (n_i - 1) - \mu \sum_i n_i,
$$

donde:
- $t$ es la amplitud de salto (hopping) entre sitios primeros vecinos $\langle i,j \rangle$,
- $U$ es la intensidad de la interacción en el mismo sitio, que representa el costo energético de tener múltiples bosones en el mismo sitio,
- $\mu$ es el potencial químico, que controla el número total de bosones en el sistema,
- $b_i^\dagger$ y $b_i$ son los operadores de creación y aniquilación bosónicos en el sitio $i$,
- $n_i = b_i^\dagger b_i$ es el operador de número, que representa la ocupación de bosones en el sitio $i$.

El primer término del hamiltoniano describe la energía cinética de los bosones que saltan entre los sitios de la red, favoreciendo la deslocalización y la formación de una fase superfluida. El segundo término representa la energía de interacción en el mismo sitio, que penaliza la ocupación de múltiples bosones en el mismo sitio y favorece la localización. El tercer término, que involucra el potencial químico $\mu$, controla la densidad total de partículas en el sistema.

## Fenómenos
El modelo de Bose-Hubbard exhibe un rico diagrama de fases, con dos fases principales:
1. **Fase superfluida**: A valores pequeños de $U/t$, los bosones se deslocalizan a través de la red, formando un estado superfluido coherente con coherencia de fase de largo alcance.
2. **Fase aislante de Mott**: A valores grandes de $U/t$, los bosones se localizan en sitios individuales de la red debido a las fuertes interacciones repulsivas, dando lugar a un estado aislante con gap y ocupación entera de bosones por sitio.

La transición entre estas fases es un ejemplo paradigmático de una **transición de fase cuántica**, impulsada por fluctuaciones cuánticas en lugar de efectos térmicos. Esta transición se ha observado experimentalmente en gases atómicos ultrafríos atrapados en redes ópticas, lo que convierte al modelo de Bose-Hubbard en una herramienta clave para entender y simular fenómenos cuánticos de muchos cuerpos.

El modelo de Bose-Hubbard también está estrechamente relacionado con otros modelos en física de la materia condensada, como el **arreglo de uniones Josephson** y el **modelo XY**, y sirve como base para el estudio de sistemas más complejos, incluyendo sistemas bosónicos desordenados y con interacciones de largo alcance.

## Métodos
