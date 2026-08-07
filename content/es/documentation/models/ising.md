---
title: Modelo de Ising
math: true
weight: 1
---

## Introducción

El **modelo de Ising** es uno de los modelos más fundamentales y ampliamente estudiados en mecánica estadística y física de la materia condensada. Fue propuesto por primera vez por Wilhelm Lenz en 1920 y resuelto posteriormente en una dimensión por su estudiante Ernst Ising en 1925. El modelo proporciona una descripción simplificada de las transiciones de fase y los fenómenos críticos en sistemas magnéticos.

$$
\mathcal{H} = J \sum_{\langle i,j \rangle} S_i^z S_j^z + h \sum_i S_i^z
$$

donde:
- $S_i^z$ y $S_j^z$ son espines arriba ($+1$) o abajo ($-1$) en los sitios de red $i$ y $j$,
- $J$ es la intensidad de la interacción entre espines vecinos (antiferromagnética si $J > 0$, ferromagnética si $J < 0$),
- $h$ es un campo magnético externo,
- La suma $\langle i,j \rangle$ recorre los pares de espines primeros vecinos.


## Fenómenos
El modelo de Ising se ha aplicado a una amplia gama de sistemas físicos y fenómenos.

- **Ferromagnetismo**: Para $J < 0$, los espines tienden a alinearse en la misma dirección, dando lugar a una magnetización espontánea a bajas temperaturas.
- **Antiferromagnetismo**: Para $J > 0$, los espines tienden a alinearse en direcciones alternantes, resultando en ninguna magnetización neta pero un fuerte ordenamiento local.
- **Transiciones de fase**: El modelo de Ising exhibe una transición de fase de una fase desordenada (paramagnética) a altas temperaturas a una fase ordenada (ferromagnética o antiferromagnética) a bajas temperaturas.

## Métodos

El modelo de Ising sin campo magnético puede resolverse exactamente en 1D y 2D, pero también se han desarrollado varios métodos numéricos para estudiar sus propiedades. A continuación se presenta un resumen de las técnicas numéricas clave relacionadas con ALPS:

| Método                     | Fortalezas                                                                 | Limitaciones                                                                 | Aplicaciones                                                                 |
|----------------------------|---------------------------------------------------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **MC** | Funciona bien para sistemas grandes; Puede manejar temperaturas finitas.       | Convergencia lenta cerca de puntos críticos; Requiere un muestreo cuidadoso.    | Transiciones de fase; Fenómenos críticos; Propiedades a temperatura finita. |
| **Algoritmos de clúster (p. ej., Wolff, Swendsen-Wang)** | Reduce el enlentecimiento crítico (critical slowing down); Eficiente cerca de puntos críticos.      | Implementación compleja; Limitado a modelos específicos.                  | Fenómenos críticos; Simulaciones a gran escala.                         |
---
