
---
title: Solucionadores de la Teoría de Campo Medio Dinámico (DMFT)
description: "Tutoriales para ALPS"
toc: true
weight: 4
math: true
---

La teoría de campo medio dinámico (DMFT) mapea el modelo de Hubbard en la red a un problema de impureza cuántica determinado de forma autoconsistente, capturando fenómenos fuertemente correlacionados —como la transición de Mott metal-aislante— que las teorías de campo medio estáticas no pueden describir en absoluto. Estos tutoriales recorren el bucle de autoconsistencia de DMFT de ALPS y sus solucionadores de impureza cuántica, y luego los aplican a una serie de ejemplos con una clara motivación física en la red de Bethe y más allá.

## Introducción

- [DMFT-01 Una introducción a DMFT](dmft01) — motiva la aproximación DMFT y su mapeo a un problema de impureza cuántica, y presenta una hoja de ruta de los tutoriales que siguen.

## Solucionadores de impureza

ALPS ofrece tres solucionadores para el problema de impureza de DMFT, todos aplicados aquí a la misma transición metal-aislante antiferromagnético para poder comparar directamente sus resultados: el algoritmo de expansión de hibridización en tiempo continuo (CT-HYB), el algoritmo de expansión de interacción en tiempo continuo (CT-INT), y el algoritmo más antiguo de tiempo discreto de Hirsch-Fye, cuyos errores sistemáticos de $\Delta\tau$ motivaron el desarrollo de los métodos de tiempo continuo.

- [DMFT-02 CT-HYB: el solucionador QMC CT-HYB](dmft02) — presenta el solucionador de expansión de hibridización y lo utiliza para trazar la transición metal-aislante antiferromagnético del modelo de Hubbard en la red de Bethe en función de la temperatura.
- [DMFT-03 CT-INT: el solucionador QMC CT-INT](dmft03) — repite el mismo ejercicio con el solucionador de expansión de interacción.
- [DMFT-07 El solucionador de Hirsch-Fye](dmft07) — repite el ejercicio una vez más con el solucionador de tiempo discreto de Hirsch-Fye, y explica por qué los algoritmos de tiempo continuo lo han reemplazado en gran medida.

## Aplicaciones físicas

- [DMFT-04 Transición de Mott](dmft04) — estudia la transición de Mott paramagnética, la transición metal-aislante que se realiza en materiales como el $V_2O_3$, suprimiendo el orden antiferromagnético y explorando la fuerza de la interacción a temperatura fija.
- [DMFT-05 Transición de Mott orbitalmente selectiva](dmft05) — extiende el método a un modelo de dos bandas en el que un orbital puede volverse aislante de Mott mientras el otro permanece metálico, un fenómeno identificado por primera vez en rutenatos como el Ca$_{2-x}$Sr$_x$RuO$_4$.
- [DMFT-06 Metal paramagnético y errores de extrapolación](dmft06) — compara las autoenergías de CT-HYB y CT-INT para un metal paramagnético con resultados de referencia de Hirsch-Fye y diagonalización exacta, mostrando cómo se manifiestan en la práctica los errores de discretización y estadísticos.

## Más allá de la red de Bethe

- [DMFT-08 Fijando una red particular](dmft08) — muestra cómo ir más allá de la densidad de estados semicircular por defecto de la red de Bethe hacia una red general, incluyendo geometrías cuadradas, cúbicas y hexagonales, y dispersiones bidimensionales evaluadas mediante una integral en el espacio k con transformación de Hilbert.

## Uniéndolo todo

- [DMFT-09 Transición de Néel en DMFT de sitio único](dmft09) — un ejemplo combinado que reproduce la transición de Néel antiferromagnética con los tres solucionadores de impureza uno junto al otro, de modo que sus resultados puedan compararse directamente.
