---
title: Modelo de Ising con Campo Transversal
description: "Introducción al Modelo de Ising con Campo Transversal"
toc: true
math: true
weight: 2
cascade:
    type: docs
---

## Introducción

El **modelo de Ising con campo transversal (Transverse Field Ising Model, TFIM)** es una generalización del modelo de Ising clásico que incorpora efectos mecánico-cuánticos. Es uno de los modelos más importantes en la mecánica estadística cuántica y la física de la materia condensada, y proporciona información sobre las transiciones de fase cuánticas, los fenómenos críticos y la interacción entre las fluctuaciones clásicas y cuánticas.

El modelo de Ising cuántico con campo transversal viene dado por el hamiltoniano

$$
H=J_{z} \sum_{\langle i,j \rangle} S_i^z S_j^z + \Gamma \sum_i S_i^x
$$

Aquí, la primera suma recorre pares de primeros vecinos. $\Gamma$ se denomina campo transversal; el sistema se vuelve crítico para $\Gamma/J_z=\frac{1}{2}$. Para $\Gamma=0$, el estado fundamental es antiferromagnético para $J_z\gt 0$ y ferromagnético para $J_z \lt 0$. 

## Fenómenos
A continuación se enumeran algunos fenómenos interesantes sobre el modelo.

- **Transiciones de fase cuánticas**
    + El TFIM exhibe una **transición de fase cuántica** a temperatura cero, impulsada por la intensidad del campo transversal $\Gamma$.
    	+ Para $\Gamma \lt \Gamma_c$, el sistema está en una **fase ordenada** (ruptura espontánea de simetría, p. ej., orden ferromagnético o antiferromagnético).
    	+ Para $\Gamma \gt \Gamma_c$, el sistema está en una **fase desordenada** (las fluctuaciones cuánticas dominan, y la simetría se restaura).

- **Criticalidad cuántica**
    + Cerca del punto crítico $\Gamma = \Gamma_c$, el TFIM exhibe **comportamiento crítico cuántico**, caracterizado por leyes de escala universales y exponentes críticos.
    	+ Esto proporciona información sobre la naturaleza de las fluctuaciones cuánticas y su papel en impulsar las transiciones de fase.




## Métodos

El modelo de Ising con campo transversal es exactamente resoluble ([P. Pfeuty, Annals of Physics: 57, 79-90 (1970)](https://www.sciencedirect.com/science/article/abs/pii/0003491670902708?via%3Dihub)).
También se han desarrollado muchos métodos numéricos para resolver el modelo en propiedades no obtenibles en las soluciones exactas. 

| Método                  | Fortalezas                                                                 | Limitaciones                                                              | Aplicaciones                                                                 |
|-------------------------|---------------------------------------------------------------------------|--------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **ED**   | Resultados exactos para sistemas pequeños; Captura correlaciones cuánticas completas.        | Limitado a sistemas pequeños.             | Propiedades de sistemas pequeños; Comparación con otros métodos.               |
| **QMC**     | Maneja sistemas más grandes; T finita.       | Problema del signo para fermiones.            | Diagramas de fase; Propiedades a temperatura finita.        |

