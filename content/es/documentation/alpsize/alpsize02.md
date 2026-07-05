---
title: Alpsize-02 Fortran Introduction
math: true
toc: true
weight: 3
---

Este capítulo explica cómo instalar y usar ALPS Fortran. Se asume que el lector tiene conocimientos básicos de programación en Fortran.

## Entorno operativo

ALPS Fortran es una biblioteca envolvente (wrapper) para ejecutar código Fortran en el sistema ALPS. Se requiere lo siguiente:

|       |          |
| :---- | :------- |
| ALPS  | Consulta la [página de instalación de ALPS](https://alps.comp-phys.org/documentation/install/) para conocer los requisitos del entorno operativo y las instrucciones de instalación. |
| CMake | Versión 3.18 o posterior. Se usa para compilar tanto ALPS Fortran como el código cliente. |
| Compilador Fortran (GNU/Intel/Fujitsu) | Debe ser el mismo compilador usado para compilar ALPS. Consulta el manual de cada compilador para las instrucciones de instalación. |

## Instalación

ALPS Fortran se proporciona como un archivo de parche (patch) aplicado al árbol de fuentes de ALPS.

1. **Descargar el parche**

   Descarga el archivo de ALPS Fortran desde el [repositorio de ALPS](https://github.com/ALPSim/ALPS) y extráelo:

        $ cd ~/
        $ wget http://xxx.xxx/alps_fortran.tar.gz
        $ tar -zxvf alps_fortran.tar.gz

   Esto crea los siguientes archivos y directorios:

        alps_fortran/
            + alps_fortran.patch
            + samples/
                + hello/
                + ising/
                + looper-2/
                + tutorial/

2. **Aplicar el parche**

   Cambia al directorio de fuentes de ALPS (`${ALPS_SRC}`) y aplica el parche:

        $ cd ${ALPS_SRC}
        $ patch -p0 < ~/alps_fortran/alps_fortran.patch

3. **Compilar e instalar ALPS**

   Compila ALPS según la [documentación de instalación](https://alps.comp-phys.org/documentation/install/). ALPS Fortran se instala junto con ALPS y genera los siguientes archivos (donde `${ALPS_ROOT}` es el prefijo de instalación de tu ALPS):

   - `${ALPS_ROOT}/lib/libalps_fortran.a`
   - `${ALPS_ROOT}/include/alps/fortran/alps_fortran.h`
   - `${ALPS_ROOT}/include/alps/fortran/fortran_wrapper.h`
   - `${ALPS_ROOT}/include/alps/fortran/fwrapper_impl.h`

## Código fuente de ejemplo

ALPS Fortran incluye tres aplicaciones de ejemplo:

- **"hello"** — No realiza ningún cálculo; simplemente imprime el contenido del archivo de parámetros en la salida estándar.
- **"ising"** — Una aplicación de ejemplo para cálculos del modelo de Ising.
- **"looper-2"** — Una aplicación de ejemplo que demuestra el uso de una biblioteca externa.

Las siguientes secciones explican cómo compilar y ejecutar la aplicación `hello`. Las aplicaciones `ising` y `looper-2` siguen el mismo procedimiento.

### Aplicación "hello"

La aplicación hello consta de los siguientes archivos:

- `hello_impl.f90` — programa principal
- `hello.C` — establece el punto de entrada
- `hello_params` — archivo de parámetros
- `CMakeLists.txt` — configuración de compilación

### Compilación

1. **Crear un directorio de compilación**

        $ mkdir -p ${HOME}/alps_fortran_build/hello
        $ cd ${HOME}/alps_fortran_build/hello

2. **Ejecutar CMake**

   Especifica el directorio de fuentes (`${SAMPLES}` es la carpeta de ejemplos extraída del archivo de ALPS Fortran):

        $ cmake -DALPS_ROOT:PATH=${ALPS_ROOT} \
        >       ${SAMPLES}/hello

3. **Compilar**

        $ make

   Tras una compilación exitosa, el ejecutable `hello` aparece en el directorio actual.

### Paralelización a nivel de hilos (threads)

1. **Ir al directorio de compilación**

        $ cd ${HOME}/alps_fortran_build/hello

   Si hay archivos de resultados (`hello_param.out.*`) de una ejecución anterior, elimínalos antes de continuar.

2. **Preparar el archivo de parámetros**

   Genera un archivo de entrada XML a partir del archivo de parámetros:

        $ cp ${SAMPLES}/hello/hello_params .
        $ parameter2xml hello_params

   Consulta la [documentación de ALPS](https://alps.comp-phys.org) para más detalles sobre el comando `parameter2xml`.

3. **Ejecutar**

        $ ./hello hello_params.in.xml

   Los parámetros definidos en `hello_params` se imprimen en la salida estándar. Salida de ejemplo:

        ##### alps_init() #####
        parameter X     =    3.2000000000000002
        parameter Y     =            0
        parameter WORLD = world
        defined parameter Z =            1
        
    [2011-May-13 11:45:42]: dispatching a new clone[1,1] on threadgroup[3]

        ##### alps_init() #####
        parameter X     =   -3.1000000000000001
        parameter Y     =            6
        parameter WORLD = alps
        defined parameter Z =            0
        
    [2011-May-13 11:45:42]: dispatching a new clone[2,1] on threadgroup[8]

        ##### alps_init() #####
        parameter X     =   1.00000000000000002E-003
        parameter Y     =         -100
        parameter WORLD = looper
        defined parameter Z =            0
        
    [2011-May-13 11:45:43]: dispatching a new clone[3,1] on threadgroup[7]
    [2011-May-13 11:45:43]: clone[3,1] finished on threadgroup[7]

        ##### alps_init() #####
        parameter X     =    100.00000000000000
        parameter Y     =            2
        parameter WORLD = japan
        defined parameter Z =            0
        
    [2011-May-13 11:45:43]: dispatching a new clone[4,1] on threadgroup[1]
    [2011-May-13 11:45:43]: clone[4,1] finished on threadgroup[1]

        ##### alps_init() #####
        parameter X     =    3.0000000000000000
        parameter Y     =            0
        parameter WORLD = wistaria
        defined parameter Z =            0

### Paralelización MPI

1. **Ir al directorio de compilación**

        $ cd ${HOME}/alps_fortran_build/hello

   Como antes, elimina cualquier archivo de resultados existente (`hello_param.out.*`) antes de continuar.

2. **Preparar el archivo de parámetros**

        $ cp ${SAMPLES}/hello/hello_params .
        $ parameter2xml hello_params

3. **Ejecutar con MPI**

        $ mpirun -np 4 -x OMP_NUM_THREADS=1 ./hello --mpi hello_params.in.xml

   Los parámetros definidos en `hello_params` se imprimen en la salida estándar, como en el ejemplo a nivel de hilos anterior.
