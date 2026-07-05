
---
title: Alpsize-01 CMake
math: true
toc: true
weight: 2
---

## Empaquetado con CMake

ALPS usa CMake (versión 3.18 o posterior) como su sistema de compilación. CMake es una herramienta multiplataforma para gestionar el proceso de compilación del software. Compilas tu código usando `cmake` seguido de `make`, controlado por un archivo de configuración llamado **CMakeLists.txt**. Escribir un CMakeLists.txt es, en general, mucho más simple que escribir un Makefile a mano.

`CMakeLists.txt` consta de varias partes: un encabezado, la importación del entorno ALPS, la descripción de las dependencias del objetivo (target) y, si es necesario, definiciones de pruebas.
La biblioteca ALPS proporciona un archivo de configuración de CMake en `${ALPS_ROOT}/share/alps/ALPSConfig.cmake` (donde `${ALPS_ROOT}` es el prefijo de instalación de tu ALPS, por ejemplo `/opt/alps`). Incluir ese archivo establece todas las variables de configuración usadas al compilar ALPS. Incluir `${ALPS_ROOT}/share/alps/UseALPS.cmake` establece automáticamente las opciones del compilador y del enlazador para usar ALPS. A continuación se muestra un ejemplo de `CMakeLists.txt`. Un conjunto completo de archivos fuente está disponible en el [repositorio de ALPS](https://github.com/ALPSim/ALPS):

```
cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(alpsize NONE)
 
# find ALPS Library
find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)
message(STATUS "Found ALPS: ${ALPS_ROOT_DIR} (revision: ${ALPS_VERSION})")
include(${ALPS_USE_FILE})
 
# enable C and C++ compilers
enable_language(C CXX)
 
# rule for generating 'hello world' program
add_executable(hello hello.C)
target_link_libraries(hello ${ALPS_LIBRARIES})
add_alps_test(hello)
```
    
Ten en cuenta que la opción NO_SYSTEM_ENVIRONMENT_PATH en find_package es esencial. De lo contrario, las variables (compiladores, etc.) serán sobrescritas por las predeterminadas del sistema.

## Ejecutando CMake

Al ejecutar cmake, especifica la ruta a tu instalación de ALPS con `-DALPS_ROOT_DIR`:

    $ cmake -DALPS_ROOT_DIR=/path/to/alps /path/to/your/source
    
Alternativamente, define la variable de entorno `$ALPS_HOME` para que CMake encuentre ALPS automáticamente:

    $ export ALPS_HOME=/path/to/alps
    $ cmake /path/to/your/source
    -- Found ALPS: ...
    [snip]
    -- Configuring done
    -- Generating done
    -- Build files have been written to: /home/alps/tutorial
    
CMake generará un Makefile. Luego, ejecuta make para compilar el programa:

    $ make
    [100%] Building CXX object CMakeFiles/hello.dir/hello.C.o
    Linking CXX executable hello
    [100%] Built target hello
    $ ./hello
    hello, world
    
Ejecuta algunas pruebas usando la herramienta CTest. CTest ejecutará hello y comparará su salida con el contenido de `hello.op`:

    $ ctest
    Test project /home/alps/tutorial
        Start 1: hello
    1/1 Test #1: hello ............................   Passed    0.07 sec

    100% tests passed, 0 tests failed out of 1

    Total Test time (real) =   0.07 sec
