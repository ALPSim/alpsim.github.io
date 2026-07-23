
---
title: Implementación
math: true
weight: 3
---

`sparsediag` es un programa de diagonalización exacta en ALPS que usa el algoritmo de Lanczos de la biblioteca IETL para calcular los estados propios de menor energía del hamiltoniano. Por lo tanto, puede usarse para calcular propiedades del estado fundamental de cualquier modelo que pueda definirse usando las bibliotecas de ALPS. La principal limitación es el tamaño del sistema cuántico, es decir, la memoria y el tiempo de CPU pueden volverse inaceptables en tamaños en los que otras aplicaciones más especializadas todavía funcionan bien.

## Parámetros de Entrada en ALPS

El código `sparsediag` toma los siguientes parámetros:

| **Parámetro** | **Valor por defecto** | **Significado** |
| :------------ | :---------- | :---------- |
| NUMBER_EIGENVALUES | 1 | el número de estados propios de menor energía a calcular |


