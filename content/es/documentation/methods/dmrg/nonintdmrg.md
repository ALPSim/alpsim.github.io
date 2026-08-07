
---
title: Partícula en una caja 
math: true
weight: 10
---

## Aplicación de ALPS: DMRG no interactuante

El paquete de DMRG no interactuante es una de las aplicaciones del proyecto ALPS. Proporciona una implementación genérica de un programa de DMRG simplificado para sistemas cuánticos no interactuantes, basado en el programa de ejemplo presentado en [^Preschel].
La aplicación admite la simulación de sistemas de enlace fuerte (tight-binding) y sistemas de enlace fuerte extendidos (p. ej. con hopping a segundos vecinos, potenciales locales externos, ...) en redes arbitrarias. Calcula la energía del estado fundamental y la función de onda del estado fundamental del sistema. Nótese que no es posible tratar términos de interacción con este programa.
Este programa no pretende ser realmente una herramienta de cálculo seria; su propósito principal es ilustrar cómo funciona el método DMRG mediante un problema simple no interactuante. Con este fin, los comentarios en el propio código fuente deberían ser útiles.


## Ejecutar una simulación

Para ejecutar una simulación, es necesario crear un archivo de parámetros, por ejemplo

    LATTICE_LIBRARY = "lattices.xml"
    LATTICE = "chain lattice"
    L = 20
    SWEEPS = 100
    OUTPUT_LEVEL = 1
    WAVEFUNCTION_FILE = "psi.dat"
    t = 1.2
    V = 0

Estos parámetros describen un cálculo para un modelo de enlace fuerte de una sola partícula usando la "chain lattice" definida en el archivo `lattices.xml`. La "chain lattice" define una red 1D periódica de longitud dada por el parámetro L (especificado en este ejemplo como L=20). El parámetro de hopping t actúa entre los enlaces de la red, por lo que la red especifica efectivamente la condición de contorno (para la "chain lattice", esta es periódica). Como es típico en DMRG, las condiciones de contorno abiertas son más eficientes y convergen en muchos menos barridos que las condiciones periódicas. Esta simulación realizará 100 barridos completos de DMRG. La variable OUTPUT_LEVEL especifica la cantidad de información de depuración producida durante los barridos, un número mayor implica más información. Para iniciar el cálculo, asegúrese de que la biblioteca de redes `lattices.xml` esté en el directorio actual y simplemente ejecute `simple_dmrg <  parameters`. La función de onda resultante se escribe en la salida estándar, así como en el archivo de salida especificado por `WAVEFUNCTION_FILE`.

## Parámetros de entrada

La simulación se controla mediante los siguientes parámetros de entrada, que pueden especificarse en el archivo de parámetros:

| **Nombre** | **Valor por defecto** | **Descripción** |
| :------- | :---------- | :-------------- |
| LATTICE_LIBRARY | lattices.xml | ruta a un archivo que contiene descripciones de redes |
| LATTICE | | nombre de la red |
| t | 1 | intensidad del término de hopping a primeros vecinos |
| t# | 0 | parámetro de hopping en un enlace de tipo # (#=0,1,...) |
| V | 0 | potencial local aplicado a todos los sitios |
| V# | 0 | potencial local en un sitio de tipo # (#=1,2,...) |
| SWEEPS | | número de barridos de sistema finito |
| OUTPUT_LEVEL | 1 | cantidad de información de salida durante los barridos |
| WAVEFUNCTION_FILE | | archivo de salida |
| PRECISION | 10 | precisión del flujo de salida |

### Propiedades del sistema: condiciones de contorno y extensión

Las condiciones de contorno y la extensión (en una o más dimensiones) se describen en la biblioteca de redes.

### Términos de hopping a segundos vecinos

Los términos de hopping a sitios distintos de los primeros vecinos pueden especificarse usando una celda unidad diferente al especificar la red. Los distintos términos de hopping deben corresponder a distintos tipos de enlace, con el parámetro de hopping controlado por t# en el archivo de parámetros. t0 toma por defecto el valor de t, todos los demás t# toman por defecto 0.

### Potencial local

El parámetro V especifica una función que se usa para un potencial externo. Un potencial adicional uniforme se especifica mediante un único número que describe su intensidad, pero un caso más interesante es tener un potencial espacialmente variable, donde V es función de las coordenadas de los sitios de la red. El siguiente archivo de parámetros, por ejemplo, simula una partícula en un potencial armónico unidimensional:

    LATTICE_LIBRARY = "lattices.xml"
    LATTICE = "chain lattice"
    L = 200
    SWEEPS = 20
    V = 4 * (x/L - 0.5) * (x/L - 0.5)

Un potencial periódico puede especificarse mediante su expansión en serie de Fourier. Por ejemplo, un potencial triangular con ancho N/L se especifica aproximadamente como

    K = 2*3.1415927*N/L
    V = cos(K*x) + cos(3*K*x) / 9 + cos(5*K*x) / 25 + cos(7*K*x) / 36

Nótese que V especifica el potencial externo que se aplica a todos los sitios de la red. También es posible asignar un potencial solo a ciertos tipos de sitio, lo cual se hace especificando una función V# (donde # es el tipo de sitio especificado en la descripción de la red). Si se define un potencial V#, se añade al potencial global V para los sitios relevantes.
De nuevo, para sistemas periódicos o potenciales complejos, la convergencia puede ser bastante lenta; para el potencial triangular, 100 barridos son suficientes para obtener buena convergencia con 40 sitios y N=4, pero compárese esto con 100 sitios y N=10. Esto se debe en parte a la forma simplista en que se construye la función de onda antes del primer barrido de DMRG propiamente dicho.

### Salida

La salida se controla mediante los parámetros OUTPUT_LEVEL, WAVEFUNCTION_FILE y PRECISION.
El parámetro OUTPUT_LEVEL puede variar de 0 a 4. Cuanto mayor sea el valor, mayor será la cantidad de información producida durante los barridos de sistema finito. El valor por defecto es 1, que muestra la energía al final de cada barrido. El nivel 4 produce una gran cantidad de salida y es útil solo para depuración o para seguir muy de cerca los detalles del cálculo.
El archivo de salida se especifica mediante WAVEFUNCTION_FILE, y el parámetro PRECISION fija la precisión de los resultados impresos. El WAVEFUNCTION_FILE tiene un formato tal que puede graficarse directamente usando xmgrace, p. ej. "xmgrace psi.dat".

## Mediciones

Dentro de esta aplicación simple de dmrg, solo se calculan la energía del estado fundamental y la función de onda del estado fundamental. Los observables pueden calcularse posteriormente a partir de la función de onda de salida.

## Colaboradores

Las siguientes personas han contribuido a la aplicación de dmrg no interactuante:

- Salvatore Manmana
- Ian McCulloch
- Matthias Troyer
- Reinhard Noack


[^Preschel]: I. Peschel, X. Wang, M. Kaulke, y K. Hallberg, Chapter 3 of "Density Matrix Renormalization - A New Numerical Method in Physics" (Springer, Berlin, 1999).
