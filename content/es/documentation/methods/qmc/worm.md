
---
title: Algoritmo Worm 
math: true
weight: 5
---

## Introducción

El código worm proporciona una implementación genérica completa para simulaciones de Monte Carlo cuántico (QMC) basadas en los algoritmos worm, inventados por N. Prokof'ev y colaboradores. Técnicamente, proporciona un código de QMC de tiempo continuo basado en una representación de integral de camino de la función de partición.

La implementación actual permite simular los siguientes modelos en redes arbitrarias:

- Modelos de espín cuántico (no frustrados) con tamaño de espín, campo magnético y anisotropía arbitrarios
- Modelos bosónicos (softcore) sin problema de signo

Se podría añadir soporte para simulaciones con problema de signo si se desea.

## Ejecutar una simulación

Se discute un ejemplo de simulación en el tutorial.

## Parámetros de entrada

El código worm usa los parámetros de entrada comunes discutidos aquí.

## Parámetros para expertos

Además, se pueden asignar parámetros de simulación específicos (¡úselos solo si sabe lo que significan!):

| **Parámetro** | **Valor por defecto** | **Significado** |
| :------------ | :---------- | :---------- |
| SKIP | 1 | el número de barridos de Monte Carlo entre cada medición |
| RESTRICT_MEASUREMENTS[N] | | si se define, esto restringe las mediciones a configuraciones donde el número cuántico N (número de partículas) tiene el valor dado por este parámetro. Nótese que la simulación se seguirá realizando en el ensemble gran canónico y el potencial químico debe ajustarse al rango correcto, para muestrear realmente configuraciones con el número de partículas deseado. |
| RESTRICT_MEASUREMENTS[Sz] | | si se define, esto restringe las mediciones a configuraciones donde el número cuántico Sz (magnetización) tiene el valor dado por este parámetro. Nótese que la simulación se seguirá realizando en el ensemble gran canónico y el campo magnético debe ajustarse al rango correcto, para muestrear realmente configuraciones con la magnetización deseada. |
| WORMS_PER_KINK | 1 | determina con qué frecuencia un worm debe visitar un kink en promedio por barrido. |
| MEASURE_GREEN | false | indicador que señala si debe medirse la función de Green. No lo use: ¡esto no está probado! |

## Parámetros en tiempo de compilación

Además, en tiempo de compilación puede definir las siguientes variables en el archivo `WRun.h`

| **Parámetro** | **Significado** |
| :------------ | :---------- |
| NONLOCAL | anular la definición para acelerar el código para interacciones locales. |
| USE_VECTOR | definir para usar un `std::vector` en lugar de un `std::list` como estructura de datos. |
| USE_SET | definir para usar un `std::set` en lugar de un `std::list` como estructura de datos. |

## Mediciones

Los siguientes observables son medidos por la aplicación del código worm:

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| Energy | energía total del sistema |
| Energy Density | energía por sitio |
| Density | número de partículas (para modelos bosónicos) |
| Density^2 | cuadrado del número de partículas (para modelos bosónicos) |
| Stiffness | rigidez del sistema (para modelos bosónicos) |
| Green's function | función de Green (funciona solo para interacciones locales) |

## Colaboradores

Las siguientes personas han contribuido a la aplicación worm:

- Simon Trebst
- Matthias Troyer 

