---
title: Modelo de Heisenberg
math: true
weight: 3
---

## Introducción

El **modelo de Heisenberg** es uno de los modelos más fundamentales y ampliamente estudiados en la física de la materia condensada y el magnetismo cuántico. Fue introducido por Werner Heisenberg en 1928 para describir las propiedades magnéticas de los materiales, en particular las interacciones de intercambio entre espines localizados en una red cristalina. Desde entonces, el modelo se ha utilizado para entender el ordenamiento magnético, la dinámica de espines y las transiciones de fase cuánticas en una variedad de sistemas.

El hamiltoniano del modelo de Heisenberg viene dado por:

$$
H = J \sum_{\langle i,j \rangle} \mathbf{S}_i \cdot \mathbf{S}_j,
$$

donde
- $\mathbf{S}_i$: Vector de espín en el sitio $i$.
- $J$: Intensidad de la interacción de intercambio. $J < 0$ para interacciones ferromagnéticas (los espines favorecen la alineación), y $J > 0$ para interacciones antiferromagnéticas (los espines favorecen la anti-alineación).
- $\langle i,j \rangle$: Suma sobre pares de primeros vecinos.

Para espines cuánticos, $\mathbf{S}_i$ son operadores de espín que obedecen las relaciones de conmutación del momento angular. Para espines clásicos, $\mathbf{S}_i$ son vectores unitarios en el espacio 3D.

## Fenómenos

El modelo de Heisenberg ha sido fundamental para entender una amplia gama de fenómenos magnéticos, entre ellos:
1. **Ferromagnetismo**: Alineación de los espines en la misma dirección, que da lugar a un momento magnético macroscópico.
2. **Antiferromagnetismo**: Alineación alternante de los espines, que resulta en una magnetización neta nula pero un fuerte ordenamiento local.
3. **Ondas de espín y magnones**: Excitaciones colectivas de los espines que se propagan a través de la red.
4. **Transiciones de fase cuánticas**: Transiciones entre distintos estados fundamentales magnéticos impulsadas por fluctuaciones cuánticas.

El modelo es muy versátil y puede extenderse para incluir términos adicionales, como anisotropía, campos magnéticos externos o interacciones de mayor alcance, para describir sistemas magnéticos más complejos.

## Métodos

El modelo de Heisenberg puede resolverse mediante varios métodos numéricos. A continuación se presenta un resumen de algunas técnicas numéricas clave:

| Método                     | Fortalezas                                                                 | Limitaciones                                                                 | Aplicaciones                                                                 |
|----------------------------|---------------------------------------------------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **ED**  | Resultados exactos para sistemas pequeños; Captura correlaciones cuánticas completas. | Limitado a sistemas pequeños | Cadenas de espín o clústeres pequeños; Comparación con otros métodos.            |
| **QMC** | Maneja sistemas más grandes; T finita       | Problema del signo para sistemas frustrados o fermiónicos.                         | Diagramas de fase; Propiedades a temperatura finita.                  |
| **DMRG** | Muy preciso para sistemas 1D; Eficiente para estados de baja entrelazamiento. | Menos eficiente para sistemas 2D/3D o altamente entrelazados.                        | Estado fundamental; Excitaciones de baja energía.                     |
| **DMFT** | Captura correlaciones locales. | Ignora correlaciones no locales.                   | Transición de Mott; Propiedades espectrales                     |

---
