
---
title: Decimación de Bloques con Evolución Temporal 
math: true
weight: 11
---

## Introducción

El algoritmo de Decimación de Bloques con Evolución Temporal (TEBD, por sus siglas en inglés) es un método para simular la evolución temporal de sistemas cuánticos de red unidimensionales gobernados por un hamiltoniano con, a lo sumo, interacciones a primeros vecinos. Está estrechamente relacionado con el método del Grupo de Renormalización de la Matriz de Densidad (DMRG) en que ambos métodos operan sobre una clase de estados conocidos como Estados de Producto de Matrices (Matrix Product States, MPS). Además de la evolución temporal real, la evolución en tiempo imaginario también puede usarse para encontrar estados fundamentales. Esencialmente, TEBD consta de dos partes: una representación MPS canónica de un estado de muchos cuerpos, y un protocolo para encontrar el MPS más cercano a un estado sobre el que actúa un operador de dos sitios.

La implementación particular de TEBD usada en ALPS simula una serie de quenches globales de parámetros de la forma $g(t)=g(t_i)+((t-t_i)/\tau)^p (g(t_f)-g(t_i))$. La escala temporal $\tau$, la potencia $p$, los valores inicial y final $g(t_f)$ y $g(t_i)$, y los parámetros del hamiltoniano $g$ de cada quench pueden ser especificados por el usuario. Además, dado que el método TEBD produce funciones de onda, hay disponible una amplia gama de observables, incluyendo entropías, funciones de correlación, y solapamientos entre estados en distintos tiempos. En el artículo de ALPS se da una lista de las mediciones para cada uno de los modelos.

Además, tenga en cuenta que la implementación actual de TEBD en ALPS ignora cualquier información sobre la red y usa una red de cadena abierta de longitud L.

## Parámetros específicos de TEBD

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| CHI_LIMIT | La dimensión de enlace máxima del MPS permitida durante la propagación en tiempo real. El valor por defecto es 50. |
| TRUNC_LIMIT | El error de truncación máximo permitido para una evolución específica de dos sitios. Si la dimensión de enlace correspondiente a esta truncación es mayor que CHI_LIMIT, entonces se elige CHI_LIMIT en su lugar. El valor por defecto es $10^{-12}$ |
| TAUS | Los elementos de este vector son las escalas temporales $\tau$ de los quenches globales. |
| GS | Los elementos de este vector son los parámetros del hamiltoniano g de los quenches globales, dados como variables de carácter. Nótese que los elementos de este vector pueden ser a su vez vectores, lo cual corresponde a hacer quench de varios parámetros al mismo tiempo. Si es así, los elementos correspondientes de POWS, GIS, y GFS también deben ser vectores de la misma longitud. Nótese que TAUS, NUMSTEPS, y STEPSFORSTORE no serán vectores, ya que la escala temporal, el número de pasos temporales, y el número de pasos entre salidas son los mismos para cada parámetro sobre el que se hace quench. |
| POWS | Los elementos de este vector son las potencias $p$ de los quenches globales. |
| GIS | Los elementos de este vector son los valores iniciales de los parámetros del hamiltoniano $g$ de los quenches globales. |
| GFS | Los elementos de este vector son los valores finales de los parámetros del hamiltoniano $g$ de los quenches globales. |
| CONSERVED_QUANTUMNUMBERS | Números cuánticos conservados por el modelo de interés. Para modelos de espín se puede conservar 'Sz_total', y para modelos de partículas se puede conservar 'N_total'. |
| NUMSTEPS | Los elementos de este vector son el número de pasos temporales de los quenches globales. Esto define implícitamente los pasos temporales dt de los quenches. |
| STEPSFORSTORE | Los elementos de este vector son el número de pasos temporales entre el cálculo y la salida de observables. |
| INITIAL_STATE | El estado usado en t=0, antes de que comience la propagación en tiempo real. Actualmente, solo se admiten dos valores: 'kink', que produce un estado inicial específico que se discutirá más adelante en el tutorial 2a (enlace), y 'ground', que calcula el estado fundamental de un hamiltoniano inicial especificado mediante propagación en tiempo imaginario. El valor por defecto es 'ground'. Véanse los tutoriales para ejemplos. |
| ITP_CHIS | Los elementos de este vector son las dimensiones de enlace máximas usadas en las iteraciones de propagación en tiempo imaginario para encontrar el estado fundamental. Solo se referencia si INITIAL_STATE es 'ground'. |
| ITP_DTS | Los elementos de este vector son los pasos temporales usados en las iteraciones de propagación en tiempo imaginario para encontrar el estado fundamental. Solo se referencia si INITIAL_STATE es 'ground'. |
| ITP_CONVS | Los elementos de este vector son los parámetros de convergencia usados en las iteraciones de propagación en tiempo imaginario para encontrar el estado fundamental. Una iteración de propagación en tiempo imaginario termina si la diferencia máxima entre los valores singulares en algún intervalo temporal es menor que el parámetro de convergencia. Solo se referencia si INITIAL_STATE es 'ground'. |
| SIMID | Una entrada entera opcional que diferencia una serie de simulaciones y puede simplificar los comandos de graficado. |
| NUM_THREADS | El número de hilos OpenMP usados. |
| VERBOSE | Si se fija a 'true', el código mostrará valores de tiempo, errores de truncación, y otros mensajes de ejecución. El valor por defecto es 'false'. |

## Referencias

- G. Vidal, *Efficient classical simulation of slightly entangled quantum computations*,
Phys. Rev. Lett. 91, 147902 (2003).

- G. Vidal, *Efficient simulation of one-dimensional quantum many-body systems*,
Phys. Rev. Lett 93, 040502 (2004).

- A. J. Daley, C. Kollath, U. Schollwöck, y G. Vidal, *Time-dependent density-matrix renormalization-group using adaptive effective Hilbert spaces*, J. Stat. Mech. (2004) P04005.

