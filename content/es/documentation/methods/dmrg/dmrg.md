
---
title: El Grupo de Renormalización de la Matriz de Densidad
math: true
weight: 11
---

## Introducción

El método del Grupo de Renormalización de la Matriz de Densidad (DMRG, por sus siglas en inglés) es un algoritmo sofisticado y ampliamente utilizado para obtener los autovalores y autovectores de menor energía de matrices muy grandes, como las que aparecen en problemas cuánticos de muchos cuerpos. El DMRG posee características que lo hacen extremadamente potente: puede tratar sistemas con cientos de espines o electrones cuánticos, proporcionar energías del estado fundamental extremadamente precisas, y calcular gaps en sistemas de baja dimensión. Junto con los métodos de Monte Carlo cuántico, domina la mayor parte de la investigación numérica en el campo de los sistemas electrónicos fuertemente correlacionados.
El DMRG es particularmente adecuado para sistemas unidimensionales, donde es sin duda el método de elección si solo se está interesado en las propiedades del estado fundamental y en los estados propios de menor energía. El algoritmo es mucho más eficiente en sistemas con condiciones de contorno abiertas, y en sistemas cuasi-2D (escaleras) con condiciones de contorno cilíndricas, donde se alcanza la convergencia con un número relativamente pequeño de estados.

## Parámetros específicos de DMRG

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| NUMBER_EIGENVALUES | Número de estados propios y energías a calcular. El valor por defecto es 1, debe fijarse a 2 para calcular gaps. |
| SWEEPS | Número de barridos de DMRG. Cada barrido consiste en un medio barrido de izquierda a derecha y un medio barrido de derecha a izquierda. |
| NUM_WARMUP_STATES | Número de estados iniciales para hacer crecer los bloques de DMRG. Si no se especifica, el algoritmo usará el valor por defecto de 20. |
| STATES | Número de estados de DMRG conservados en cada medio barrido. El usuario debe especificar ya sea 2\*SWEEPS valores distintos de STATES, o un único valor de MAXSTATES o NUMSTATES. |
| MAXSTATES | Número máximo de estados de DMRG conservados. El usuario puede elegir especificar valores de STATES para cada medio barrido, o un MAXSTATES o NUMSTATES que el programa usará para hacer crecer la base. El programa determinará automáticamente cuántos estados usar en cada barrido, creciendo en pasos de STATES/(2\*SWEEPS) hasta alcanzar MAXSTATES. |
| NUMSTATES | Número constante de estados de DMRG conservados en todos los barridos. |
| TRUNCATION_ERROR | El usuario puede optar por fijar la tolerancia de la simulación, en lugar del número de estados. El programa determinará automágicamente cuántos estados conservar para satisfacer esta tolerancia. Debe tenerse cuidado, ya que esto podría llevar a un crecimiento incontrolable del tamaño de la base, y provocar un fallo como consecuencia. Por ello es recomendable especificar también el número máximo de estados como restricción, usando MAXSTATES o NUMSTATES, como se explicó antes. |
| LANCZOS_TOLERANCE | Tolerancia para la parte de diagonalización exacta (Davidson/Lanczos) de la simulación. El valor por defecto es 10^-7. |
| CONSERVED_QUANTUMNUMBERS | Números cuánticos conservados por el modelo de interés. Se usarán en el código para reducir las matrices a forma de bloques. Si no se especifica ningún valor para un número cuántico en particular, el programa trabajará en el gran canónico. Por ejemplo, en cadenas de espín, si no especifica Sz_total, el programa se ejecutará usando un espacio de Hilbert con dim=2^N estados. Ejecutar en el "canónico" (fijando Sz_total=0, por ejemplo) mejorará considerablemente el rendimiento al trabajar en un subespacio de dimensión reducida. Para un ejemplo de cómo hacer esto, consulte el archivo de parámetros incluido con el código dmrg. |
| VERBOSE | Si se fija a un entero > 0, imprimirá información de salida adicional, como los autovalores de la matriz de densidad. Hay distintos niveles de verbosidad hasta un máximo de 3, con fines de depuración, aunque el usuario no debería necesitar un nivel superior a 1. |
| START_SWEEP | (Disponible desde la v1.3b6) Barrido inicial para reanudar una simulación que fue interrumpida, o para extenderla con un nuevo conjunto de estados. |
| START_DIR | Dirección inicial para la simulación reanudada. Puede tomar los valores 0 o 1, para "izquierda a derecha" o "derecha a izquierda", respectivamente. Solo tiene efecto en presencia de START_SWEEP. Su valor por defecto es 0. |
| START_ITER | Iteración inicial para la simulación reanudada. Solo tiene efecto en presencia de START_SWEEP. Su valor por defecto es 1. |
| TEMP_DIRECTORY | El programa DMRG almacena información en archivos temporales que residen en su carpeta local. Puede haber un gran número de ellos, y esto podría sobrecargar su sistema de archivos, especialmente si está usando NFS. La ruta para almacenar estos archivos puede cambiarse fijando la variable TEMP_DIRECTORY en el archivo de parámetros. Otra forma de hacerlo es fijando la variable de entorno del sistema TMPDIR. |

## Referencias

- S. R. White, Density matrix formulation for quantum renormalization groups, Phys. Rev. Lett. 69, 2863 (1992).
- S. R. White, Density-matrix algorithms for quantum renormalization groups, Phys. Rev. B 48, 10345 (1993).
- U. Schollwöck, The density-matrix renormalization group, Rev. Mod. Phys. 77, 259 (2005).
- K. Hallberg, Density Matrix Renormalization: A Review of the Method and its Applications, arXiv:cond-mat/0303557.
- R. Noack y S. Manmana, Diagonalization- and Numerical Renormalization-Group-Based Methods for Interacting Quantum Systems, arXiv:cond-mat/0510321
