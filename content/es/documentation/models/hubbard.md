---
title: Modelo de Hubbard
math: true
weight: 5
---

## Introducción

El **modelo de Hubbard** fue introducido por primera vez por John Hubbard en 1963 para describir el comportamiento de los electrones en una red, particularmente en óxidos de metales de transición y otros materiales con fuertes interacciones electrón-electrón. Posteriormente se extendió para describir cualquier fermión con interacciones en el mismo sitio en una red. Si solo se usa una banda de energía para formar el modelo de red, entonces cada sitio de la red puede albergar como máximo $2s+1$ fermiones con espín $s$.

El modelo de Hubbard de una banda con fermiones de espín-$\frac{1}{2}$ viene dado por el siguiente hamiltoniano

$$
H = -t \sum_{\langle i,j \rangle, \sigma} \left( c_{i,\sigma}^\dagger c_{j,\sigma} + \text{h.c.} \right) + U \sum_i n_{i,\uparrow} n_{i,\downarrow},
$$

donde 

- $c_{i,\sigma}^\dagger$ y $c_{i,\sigma}$ son los operadores de creación y aniquilación para un fermión con espín $\sigma$ (arriba $\uparrow$ o abajo $\downarrow$) en el sitio $i$, y $\text{h.c.}$ representa el conjugado hermítico. 
- $t$ es la amplitud de salto (hopping) entre sitios vecinos $\langle i,j \rangle$.
- $U$ es la energía de interacción en el mismo sitio, con $U > 0$ correspondiendo a interacciones repulsivas y $U < 0$ correspondiendo a interacciones atractivas.
- $n_{i,\sigma} = c_{i,\sigma}^\dagger c_{i,\sigma}$ es el operador de número para fermiones con espín $\sigma$ en el sitio $i$.

El primer término del hamiltoniano describe la energía cinética del sistema de muchos cuerpos con partículas que saltan entre sitios vecinos. El segundo término representa la energía potencial del sistema. La competencia entre la energía cinética, la energía potencial y la temperatura puede dar lugar a propiedades interesantes.

## Fenómenos

1. **Transición metal-aislante**:
   - El modelo de Fermi-Hubbard exhibe una transición metal-aislante conocida como la **transición de Mott**. A llenado medio (un electrón por sitio), para valores grandes de $U/t$, el sistema se convierte en un aislante de Mott, donde los electrones se localizan debido a la fuerte repulsión, impidiendo la conducción.
   - Para valores pequeños de $U/t$, el sistema se comporta como un metal, con electrones saltando libremente a través de la red.

2. **Magnetismo**:
   - En la fase aislante de Mott, el modelo de Fermi-Hubbard puede exhibir ordenamiento magnético. A llenado medio y valores grandes de $U/t$, el hamiltoniano efectivo de baja energía se reduce al **modelo de Heisenberg**, que describe interacciones antiferromagnéticas entre espines.

3. **Superconductividad**:
   - Para interacciones atractivas $U < 0$, el modelo puede exhibir superconductividad, donde los fermiones se emparejan para formar pares de Cooper.

4. **Dopaje y separación de fases**:
   - Cuando el sistema se dopa fuera del llenado medio (p. ej., agregando o quitando electrones), pueden surgir fases ricas como el orden en franjas (stripe order), ondas de densidad de carga y superconductividad de alta temperatura.


## Métodos

Varios métodos numéricos para resolver el modelo de Fermi-Hubbard se enumeran en la siguiente tabla:

| Método                  | Fortalezas                              | Limitaciones                          | Aplicaciones                          |
|-------------------------|----------------------------------------|--------------------------------------|---------------------------------------|
| **ED**   | Resultados exactos para sistemas pequeños; Captura correlaciones cuánticas completas.        | Limitado a sistemas pequeños.             | Propiedades de sistemas pequeños; Comparación con otros métodos.               |
| **QMC**     | Maneja sistemas más grandes; T finita.       | Problema del signo para fermiones.            | Diagramas de fase; Propiedades a temperatura finita.        |
| **DMRG**                    | Muy preciso para sistemas 1D; Eficiente para estados de baja entrelazamiento.         | Menos eficiente para sistemas 2D/3D o altamente entrelazados.             | Estado fundamental; Excitaciones de baja energía.  |
| **DMFT**                    | Captura correlaciones locales.            | Ignora correlaciones no locales.      | Transición de Mott; Propiedades espectrales  |
