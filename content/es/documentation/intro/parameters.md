
---
title: Parámetros Comunes
math: true
toc: true
weight: 7
---

Los siguientes parámetros de entrada son comunes a la mayoría de las aplicaciones de ALPS

## Definición de la red

Las aplicaciones de ALPS sobre redes especifican la red con los siguientes tres parámetros

| **Parámetro** | **Predeterminado** | **Significado** |
| :------------ | :---------- | :---------- |
| LATTICE_LIBRARY | lattices.xml | ruta a un archivo que contiene las descripciones de redes |
| LATTICE | | nombre de la red, especificado por dimensionalidad, extensión y celda unitaria. |
| GRAPH | | como alternativa a una red, también se puede especificar un grafo arbitrario específico definido en la biblioteca de redes. |

Además, la descripción de la red puede requerir parámetros adicionales (p. ej. L o W) según lo especificado en el archivo de descripción de la red.

## Definición del modelo 

Los modelos cuánticos de red de ALPS pueden especificarse usando los siguientes parámetros

| **Parámetro** | **Predeterminado** | **Significado** |
| :------------ | :---------- | :---------- |
| MODEL_LIBRARY | models.xml | ruta a un archivo que contiene las descripciones de modelos |
| MODEL | | nombre del modelo (por ejemplo "spin" o "boson") |

La descripción del modelo también puede requerir parámetros adicionales (p. ej. S=1/2 o S=1, h=0.5 para modelos de espín, t=1.5 o mu=0.5 para modelos de bosones) según lo especificado en el archivo de descripción del modelo.

## Parámetros para simulaciones a temperatura finita

| **Parámetro** | **Significado** |
| :------------ | :---------- |
| T | la temperatura |
| BETA | inverso de la temperatura (si no se da la temperatura) |

## Parámetros adicionales para simulaciones de Monte Carlo 

| **Parámetro** | **Predeterminado** | **Significado** |
| :------------ | :---------- | :---------- |
| SEED | 0 | La semilla de números aleatorios utilizada en la siguiente ejecución. Después de usar una semilla en la creación de una ejecución de Monte Carlo, este valor se incrementa en uno. |
| RNG | "mt19937" | El generador de números pseudoaleatorios que se utilizará. Los valores permitidos son "lagged_fibonacci607" y "mt19937". |
| WORK_FACTOR | 1 | Un factor por el cual se multiplica el trabajo que debe realizarse para una simulación en el balanceo de carga. |
| SWEEPS | | número de pasos de Monte Carlo (después de la termalización) |
| THERMALIZATION | | Número de barridos de Monte Carlo para la termalización |

## Parámetros adicionales para diagonalización exacta 

| **Parámetro** | **Predeterminado** | **Significado** |
| :------------ | :---------- | :---------- |
| CONSERVED_QUANTUMNUMBERS | | especifica los números cuánticos globales conservados que se utilizan para dividir el cálculo en cálculos más pequeños para los distintos sectores. Si se conserva más de un número cuántico, los números cuánticos se enumeran entre comillas dobles y separados por comas, como en CONSERVED_QUANTUMNUMBERS="N,Sz" |
| N_total, Sz_total, ... | | y parámetros similares podrían definirse para su modelo mediante una restricción en la definición de su modelo. Estas restricciones se usarán si estos parámetros están especificados y el número cuántico figura en CONSERVED_QUANTUMNUMBERS. |
| TRANSLATION_SYMMETRY | true | fulldiag y sparsediag aprovechan la simetría de traslación y clasifican los autoestados por sus números cuánticos de momento cuando es posible. Esta reducción de simetría puede desactivarse con TRANSLATION_SYMMETRY=false. |
| TOTAL_MOMENTUM | | fija el valor del momento total. Más explicaciones se pueden encontrar a continuación. |
| MEASURE_ENERGY | false | si no se especifican mediciones explícitamente, fulldiag y sparsediag no almacenan por defecto ninguna información sobre los autoestados. Por supuesto, la energía siempre puede calcularse para cualquier autoestado. Si desea tener esto en la salida y no se especifican otras mediciones, puede especificar MEASURE_ENERGY=true. |

**Nota:** En lugar de true y false, también puede especificar 1 y 0, respectivamente.

Si la red admite simetrías de traslación, puede especificar los números cuánticos de momento total, pero debe ser bastante cuidadoso al hacerlo.
TOTAL_MOMENTUM toma los números cuánticos de momento como un vector, es decir, una lista de números separados por espacios. Típicamente, cada número cuántico de momento $k_i$ tendrá la forma

$k_i = 2\pi n_i/L_i$,

donde $n_i$ es un entero y $L_i$ la extensión lineal en la dirección correspondiente. Es posible especificar un número simbólico como 2*Pi/5 si coloca los valores entre comillas, por ejemplo TOTAL_MOMENTUM="2*Pi/5 0".

**Advertencia:** Un valor ilegal de TOTAL_MOMENTUM puede llevar a resultados incorrectos sin ningún mensaje de error adicional.

