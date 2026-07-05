
---
title: Code-00 Using ALPS in your projects
math: true
toc: true
weight: 1
---

## Uso de CMake

Las bibliotecas de ALPS también proporcionan un archivo de configuración de ALPS para CMake en `/opt/alps/share/alps/ALPSConfig.cmake`. Incluir ese archivo establecerá todas las variables de configuración usadas al compilar ALPS. Además, incluir el archivo `/opt/alps/share/alps/UseALPS.cmake` en tu archivo CMake establecerá automáticamente las opciones del compilador y del enlazador para usar ALPS. Aquí hay un `CMakeLists.txt` de ejemplo:
 
    cmake_minimum_required(VERSION 2.8 FATAL_ERROR)
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

Ten en cuenta que la opción NO_SYSTEM_ENVIRONMENT_PATH en find_package es esencial. De lo contrario, las variables (compiladores, etc.) serán sobrescritas por las predeterminadas del sistema.
Al ejecutar cmake, especifica la ruta donde se puede encontrar ALPS:

    cmake -DALPS_ROOT_DIR=/opt/alps /somewhere/to/your/source/code
    
O bien, se puede indicar a cmake la ubicación de ALPS usando la variable de entorno $ALPS_HOME:

    export ALPS_HOME=/opt/alps
    cmake /somewhere/to/your/source/code

## Uso de make

Si puedes, por favor usa cmake en lugar de make. Las bibliotecas de ALPS vienen con un archivo de inclusión para tu Makefile que establece todas las rutas de inclusión, rutas de enlace y bibliotecas necesarias para enlazar y usar ALPS. Este archivo de inclusión se encuentra en /opt/alps/share/alps/include.mk — o una ubicación similar si has instalado ALPS en una ruta distinta de /opt/alps. Aquí se proporciona un Makefile de ejemplo que usa este archivo de inclusión, en el tutorial del modelo de Ising en C++.
