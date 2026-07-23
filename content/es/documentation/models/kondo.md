---
title: Modelo de Red de Kondo
math: true
weight: 9
---

## Introducción

En la física de la materia condensada, el **modelo de red de Kondo (Kondo Lattice Model, KLM)** se utiliza para describir la interacción entre momentos magnéticos localizados y electrones de conducción en un sistema metálico. Este modelo es particularmente importante para entender el comportamiento de los materiales de fermiones pesados, donde la interacción entre los electrones f localizados y los electrones de conducción deslocalizados da lugar a fenómenos ricos y complejos como el apantallamiento Kondo, el ordenamiento magnético y la superconductividad no convencional.

El hamiltoniano del modelo de red de Kondo puede escribirse como:

$$
H = H_{\text{band}} + H_{\text{Kondo}}
$$

donde:
- $H_{\text{band}}$ describe la energía cinética de los electrones de conducción:
  $$
  H_{\text{band}} = \sum_{k, \sigma} \epsilon_k c_{k\sigma}^\dagger c_{k\sigma}
  $$
  Aquí, $c_{k\sigma}^\dagger$ y $c_{k\sigma}$ son los operadores de creación y aniquilación para electrones de conducción con momento $k$ y espín $\sigma$, y $\epsilon_k$ es la relación de dispersión.

- $H_{\text{Kondo}}$ representa la interacción Kondo entre los espines localizados $\mathbf{S}_i$ y los electrones de conducción:
  $$
  H_{\text{Kondo}} = J \sum_i \mathbf{S}_i \cdot \mathbf{s}_i
  $$
  Aquí, $\mathbf{s}_i$ es la densidad de espín de los electrones de conducción en el sitio $i$, y $J$ es la constante de acoplamiento de intercambio.
  
El KLM anterior describe tres componentes clave del modelo:
- **Momentos magnéticos localizados**: En el KLM, los momentos magnéticos localizados (a menudo representados por espines) están asociados con átomos en una red periódica. Estos momentos surgen de orbitales f parcialmente llenos en compuestos de tierras raras o actínidos.

- **Electrones de conducción**: Los electrones de conducción están deslocalizados y forman un mar de Fermi. Interactúan con los espines localizados a través de un acoplamiento de intercambio, típicamente descrito por la interacción Kondo.

- **Interacción Kondo**: La interacción entre los espines localizados y los electrones de conducción se modela mediante un acoplamiento de intercambio antiferromagnético, a menudo denotado como $J$. Este acoplamiento da lugar al efecto Kondo, donde los espines localizados son apantallados por los electrones de conducción a bajas temperaturas.

## Fenómenos

El modelo de red de Kondo exhibe una variedad de fenómenos físicos intrigantes, entre ellos:

- **Apantallamiento Kondo**: A bajas temperaturas, los espines localizados son apantallados por los electrones de conducción, formando un estado fundamental no magnético conocido como el singlete de Kondo.

- **Comportamiento de fermiones pesados**: El apantallamiento de los espines localizados conduce a la formación de cuasipartículas con masas efectivas enormemente aumentadas, dando lugar al comportamiento de fermiones pesados.

- **Ordenamiento magnético**: Dependiendo de la intensidad de la interacción Kondo y de la estructura de la red, el sistema puede exhibir ordenamiento magnético, como antiferromagnetismo o ferromagnetismo.

- **Superconductividad no convencional**: En algunos materiales de fermiones pesados, el modelo de red de Kondo puede dar lugar a estados superconductores no convencionales con simetrías de apareamiento no triviales.


## Métodos

