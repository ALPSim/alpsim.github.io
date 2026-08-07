
---
title: Implementación
math: true
weight: 5
---

El paquete `spinmc` es una de las aplicaciones del proyecto ALPS. Proporciona una implementación genérica de actualizaciones locales y de cluster para sistemas de espín clásicos.
La aplicación admite los siguientes modelos en redes arbitrarias:

- [Modelos de Ising](../../../models/ising)
- Modelos XY
- Modelos de Heisenberg
- Modelos de Potts de 3, 4 y 10 estados

La aplicación puede extenderse fácilmente a modelos de Potts con q estados adicionales y a modelos $O(N)$ editando el archivo mc/spins/spinmc_factory.C de forma directa.

## Ejecutar una simulación

se discute en el tutorial.

## Parámetros de entrada

Además de los parámetros de entrada generales de la biblioteca de planificación (scheduler) de ALPS, la aplicación spinmc toma los siguientes parámetros de entrada:

| **Nombre**  | **Valor por defecto** | **Descripción** |
| :---- | :----   | :----       |
| LATTICE_LIBRARY | lattices.xml | ruta a un archivo que contiene descripciones de redes |
| LATTICE | | nombre de la red |
| MODEL | | Ising, XY, Heisenberg o Potts |
| q | | el número de estados distintos en un modelo de Potts |
| UPDATE | | el tipo de actualización, local o de cluster |
| ERROR_VARIABLE | | el nombre de un observable cuyo error desea que ALPS monitoree (debe usarse junto con ERROR_LIMIT) |
| ERROR_LIMIT | | una vez que el error absoluto de ERROR_VARIABLE es menor que esta cantidad, ALPS detendrá la tarea (debe usarse junto con ERROR_VARIABLE) |
| T | | la temperatura |
| J | | la constante de acoplamiento por defecto |
| J# | J | la constante de acoplamiento en un enlace de tipo # (#=0,1,...). |
| D | | constantes de acoplamiento de anisotropía de un solo ion en el mismo sitio (una para cada componente de espín en una lista, p. ej. D="0.0 0.0 10.0") |
| CONVENTION | classical | especifica si se usan las convenciones clásica o cuántica (véase más abajo) |
| S |  1 si CONVENTION=classical; 1/2 si CONVENTION=quantum | el tamaño de espín por defecto |
| S# | S | el tamaño de espín en un sitio de tipo # (#=0,1,...). |
| $g$ | 1 | el factor $g$ de Landé, usado para mediciones de susceptibilidad |
| h | 0 | campo magnético externo (solo con actualización local) |

Además, la descripción de la red puede requerir parámetros adicionales (p. ej. L o W) según lo especificado en el archivo de descripción de la red.
Nota: aunque el programa clásico de Monte Carlo usa una descripción de red en XML, no usa descripciones de modelo en XML. El modelo se especifica en su lugar mediante los parámetros de la tabla anterior.

## Actualizaciones locales frente a actualizaciones de cluster

Las actualizaciones de cluster deben usarse siempre que no se aplique campo magnético y el sistema de espín no esté frustrado. De lo contrario, se prefieren las actualizaciones locales.

## Convenciones cuántica frente a clásica

Los modelos de espín cuántico y clásico suelen usar convenciones diferentes para las constantes de acoplamiento, y el parámetro CONVENTION permite elegir entre las dos.
- La convención **classical** es que los signos positivos denoten acoplamiento ferromagnético. Las intensidades de acoplamiento se multiplican por $S^2$ si se especifica un parámetro S.
- La convención **quantum** es que los signos positivos denoten acoplamiento antiferromagnético. Las intensidades de acoplamiento se multiplican por S(S+1), donde S toma por defecto 1/2.

## Mediciones

Los siguientes observables son medidos por la aplicación spinmc:

| **Nombre**  | **Descripción** |
| :---- | :---------- |
| Energy | la energía total del sistema |
| Energy Density | la densidad de energía (energía por sitio) del sistema |
| Specific Heat | el calor específico por sitio del sistema |
| Magnetization | la componente z de la magnetización |
| \|Magnetization\| | valor absoluto de la componente z de la magnetización |
| Magnetization^2 | cuadrado de la componente z de la magnetización |
| Magnetization along Field | la componente de la magnetización a lo largo del campo magnético externo |
| Staggered Magnetization | la componente z de la magnetización alternada (solo en redes bipartitas) |
| Staggered Magnetization^2 | cuadrado de la componente z de la magnetización alternada (solo en redes bipartitas) |
| Susceptibility | la susceptibilidad uniforme, incluye un factor de $g^2$ |
| Cluster size | el tamaño medio del cluster como fracción del volumen de la red (solo para actualizaciones de cluster) |

Nota: para evaluar el calor específico, el programa de evaluación spinmc_evaluate debe ejecutarse sobre los archivos de tarea (\*task\*.xml).

