---
title: Modelo t-J
math: true
weight: 6
---

## Introducción

El **modelo t-J** es un marco teórico ampliamente estudiado en la física de la materia condensada, particularmente en el contexto de sistemas de electrones fuertemente correlacionados. Se utiliza a menudo para describir la física de baja energía de los superconductores de alta temperatura, como los cupratos, y otros materiales donde las correlaciones electrónicas desempeñan un papel crucial. El modelo se deriva como un hamiltoniano efectivo a partir del modelo de Hubbard más general en el límite de fuerte repulsión de Coulomb en el mismo sitio.

El modelo t-J describe la dinámica de electrones (o huecos) que se mueven en una red, donde la doble ocupación de cualquier sitio de la red está prohibida debido a las fuertes interacciones repulsivas. Esta restricción es una característica clave del modelo y refleja los fuertes efectos de correlación en el sistema. El hamiltoniano del modelo t-J consta de dos términos principales:

$$
H = -t \sum_{\langle i,j \rangle, \sigma} \left( c_{i,\sigma}^\dagger c_{j,\sigma} + \text{h.c.} \right) + J \sum_{\langle i,j \rangle} \left( \mathbf{S}_i \cdot \mathbf{S}_j - \frac{n_i n_j}{4} \right),
$$

donde:
- $t$ es la amplitud de salto entre sitios primeros vecinos $\langle i,j \rangle$,
- $J$ es la interacción de intercambio antiferromagnética entre espines en sitios vecinos,
- $c_{i,\sigma}^\dagger$ y $c_{i,\sigma}$ son los operadores de creación y aniquilación para electrones con espín $\sigma$ en el sitio $i$, proyectados sobre el subespacio sin doble ocupación,
- $\mathbf{S}_i$ es el operador de espín en el sitio $i$,
- $n_i = \sum_\sigma c_{i,\sigma}^\dagger c_{i,\sigma}$ es el operador de número en el sitio $i$.

El primer término del hamiltoniano representa la energía cinética de los electrones que saltan entre sitios de la red, mientras que el segundo término describe las interacciones espín-espín entre sitios vecinos. La proyección sobre el subespacio sin doble ocupación es un aspecto crucial del modelo, que refleja los fuertes efectos de correlación.

## Fenómenos
El modelo t-J es particularmente notable por su capacidad de capturar fenómenos clave en sistemas fuertemente correlacionados, tales como:
- **Superconductividad de alta temperatura**: El modelo exhibe mecanismos de apareamiento que podrían explicar la superconductividad en los cupratos.
- **Magnetismo**: Describe el orden antiferromagnético y la dinámica de espín en el régimen no dopado.
- **Comportamiento de metal extraño (strange metal)**: El modelo puede exhibir comportamiento de líquido no-Fermi en ciertos regímenes de parámetros.

A pesar de su simplicidad en comparación con el modelo de Hubbard completo, el modelo t-J proporciona una comprensión profunda de la física de los materiales fuertemente correlacionados y sigue siendo una herramienta central en los estudios teóricos y computacionales de sistemas cuánticos de muchos cuerpos.

## Métodos

Varios métodos numéricos para resolver el modelo t-J se enumeran en la siguiente tabla:

| Método                  | Fortalezas                              | Limitaciones                          | Aplicaciones                          |
|-------------------------|----------------------------------------|--------------------------------------|---------------------------------------|
| **ED**                  | Resultados exactos para sistemas pequeños; Captura exactamente la restricción de no doble ocupación. | Limitado a tamaños de sistema pequeños debido al crecimiento exponencial del espacio de Hilbert restringido. | Propiedades de clústeres pequeños; Comparación con otros métodos; Funciones espectrales. |
| **QMC**                 | Maneja sistemas más grandes; Propiedades a T finita accesibles. | Problema del signo severo en presencia de huecos (dopaje fuera del llenado medio). | Regímenes no dopados o ligeramente dopados; Propiedades magnéticas a temperatura finita. |
| **DMRG**                | Muy preciso para sistemas 1D; Impone la restricción de no doble ocupación de forma natural. | Menos eficiente para sistemas 2D o altamente entrelazados. | Estado fundamental y excitaciones de baja energía de cadenas y escaleras t-J en 1D. |
| **VMC**                 | Optimiza directamente funciones de onda de prueba, incluyendo estados RVB; Escala a sistemas más grandes. | La precisión depende de la calidad del ansatz variacional. | Apareamiento superconductor; Física RVB; Diagrama de fase de sistemas dopados. |
