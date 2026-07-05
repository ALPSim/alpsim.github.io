
---
title: Algoritmo de Bucles Dirigidos con SSE 
math: true
weight: 4
---

## Introducción

El paquete `dirloop_sse` proporciona una implementación genérica completa del método de Monte Carlo cuántico (QMC) llamado algoritmo de bucles dirigidos en la representación de Expansión en Serie Estocástica (SSE). El método `dirloop_SSE` fue inventado y desarrollado por Anders Sandvik y colaboradores. Es un método QMC potente y elegante para estudiar modelos cuánticos de espín o bosónicos en redes.

La implementación actual que presentamos aquí usa los desarrollos más recientes de este método publicados en:
- A. W. Sandvik, Phys. Rev. B 59, 14157 (1999).
- F. Alet, S. Wessel, y M. Troyer Phys. Rev. E 71, 036706 (2005).
- L. Pollet, S. M. A. Rombouts, K. Van Houcke, y K. Heyde, Phys. Rev. E 70, 056705 (2005).

Esta versión permite simular, en redes arbitrarias:
- Modelos de espín cuántico (incluso frustrados; véase la observación más abajo) con tamaño de espín, campo magnético y anisotropía arbitrarios
- Modelos bosónicos (softcore)

Esta versión permite simular sistemas con un problema de signo (p. ej., sistemas de espín frustrados). Sin embargo, este caso ha sido probado de forma moderada, así que tenga cuidado si su modelo tiene un problema de signo...

**Tenga en cuenta** que para modelos frustrados, algunos valores del parámetro Epsilon podrían hacer que el algoritmo no sea ergódico (por ejemplo, cuando se tiene un algoritmo de "bucle puro"). Esto debe verificarse cuidadosamente.

## Ejecutar una simulación

se discute en el tutorial.

## Parámetros de entrada

Además de los parámetros de entrada comunes de las aplicaciones de ALPS, la aplicación `dirloop_sse` toma los siguientes parámetros de entrada para expertos (¡úselos solo si sabe lo que significan!):

| **Parámetro** | **Valor por defecto** | **Significado** |
| :------------ | :---------- | :---------- |
| SKIP | 1 | el número de barridos de Monte Carlo entre cada medición |
| RESTRICT_MEASUREMENTS[N] |  | si se define, esto restringe las mediciones a configuraciones donde el número cuántico N (número de partículas) tiene el valor dado por este parámetro. Nótese que la simulación se seguirá realizando en el ensemble gran canónico y el potencial químico debe ajustarse al rango correcto, para muestrear realmente configuraciones con el número de partículas deseado.|
| RESTRICT_MEASUREMENTS[Sz] | | si se define, esto restringe las mediciones a configuraciones donde el número cuántico Sz (magnetización) tiene el valor dado por este parámetro. Nótese que la simulación se seguirá realizando en el ensemble gran canónico y el campo magnético debe ajustarse al rango correcto, para muestrear realmente configuraciones con la magnetización deseada.|
| NUMBER_OF_WORMS_PER_SWEEP | Calculado autoconsistentemente | número de worms realizados durante la actualización de bucle. Por defecto, este número se calcula autoconsistentemente durante la parte de termalización. Sin embargo, puede forzar su valor durante toda la simulación |
| EPSILON | 0 | desplazamiento de energía diagonal suplementario para todas las interacciones. El valor de EPSILON afecta el rendimiento del algoritmo con el siguiente compromiso: cuanto más alto sea, más largo será el tiempo de simulación, pero más bajas serán las probabilidades de rebote. La experiencia actual indica que se deben usar valores distintos de cero para Epsilon, pero no demasiado altos (por ejemplo, S/2 para modelos de espín S). Nótese que para modelos frustrados, algunos valores de Epsilon podrían hacer que el algoritmo no sea ergódico. Debe verificarse cuidadosamente. |
| WHICH_LOOP_TYPE | "minbounce" | cadena que indica qué tipo de actualizaciones deben usarse para la dispersión en los vértices: ( "heatbath" ) heatbath, véase A. W. Sandvik, Phys. Rev. B 59, 14157 (1999). ( "minbounce" ) rebotes mínimos, véase F. Alet, S. Wessel, y M. Troyer Phys. Rev. E 71, 036706 (2005). ( "locopt" ) localmente óptimo, véase L. Pollet, S. M. A. Rombouts, K. Van Houcke, y K. Heyde, Phys. Rev. E 70, 056705 (2005). Por defecto el algoritmo usa las actualizaciones "minbounce". |
| NO_WORMWEIGHT | 0 | booleano que indica si el elemento de matriz del worm debe fijarse a la unidad (NO_WORMWEIGHT = true) o a su valor real dependiendo de la configuración de espín/densidad (NO_WORMWEIGHT=false). Por defecto, NO_WORMWEIGHT es false. |

## Mediciones

Los siguientes observables son medidos por `dirloop_sse` para cualquier aplicación de modelo:

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| Energy | energía total del sistema |
| Energy Density | energía por sitio |

Los siguientes observables son medidos por dirloop_sse para modelos de espín, es decir, modelos que tienen un número cuántico Sz definido:

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| Magnetization | la componente z de la magnetización total |
| Magnetization Density | la componente z de la magnetización total por sitio |
| \|Magnetization\| | valor absoluto de la componente z de la magnetización |
| \|Magnetization Density\| | valor absoluto de la componente z de la magnetización por sitio |
| Magnetization^2 | cuadrado de la componente z de la magnetización total |
| Magnetization Density^2 | cuadrado de la componente z de la magnetización total por sitio |
| Magnetization^4 | cuarta potencia de la componente z de la magnetización total |
| Magnetization Density^4 | cuarta potencia de la componente z de la magnetización total por sitio |
| Susceptibility | la susceptibilidad uniforme (modelos de espín) |

Los modelos de espín en redes bipartitas también tienen una magnetización alternada:

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| Staggered Magnetization | la componente z de la magnetización alternada |
| Staggered Magnetization Density | la componente z de la magnetización alternada por sitio |
| Staggered Magnetization^2 | cuadrado de la componente z de la magnetización alternada |
| Staggered Magnetization Density^2 | cuadrado de la componente z de la magnetización alternada por sitio |

Los siguientes observables son medidos por `dirloop_sse` para modelos de partículas, es decir, modelos que tienen un número cuántico N definido:

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| Density | densidad de partículas |
| Density^2 | cuadrado de la densidad de partículas |

Y para todos los modelos

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| Stiffness | rigidez del sistema (tanto para modelos de espín como bosónicos)|

Otros observables también pueden estar disponibles según la versión exacta de la aplicación.

## Colaboradores

Las siguientes personas han contribuido a la aplicación `dirloop_sse`:

- Fabien Alet
- Matthias Troyer 
- Lode Pollet


