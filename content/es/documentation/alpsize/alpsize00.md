
---
title: Alpsize-00 Usercode ALPSize
math: true
toc: true
weight: 1
---

## Introducción a ALPSize

Empaquetando tu código con CMake y enlazándolo contra la biblioteca ALPS, puedes usar la
infraestructura del planificador (scheduler) de ALPS — incluyendo **Parameters** y **Alea** — con una configuración mínima.
Usar el planificador de ALPS ofrece las siguientes ventajas:

- Paralelización de parámetros sin código adicional.
- Se ejecuta en una computadora portátil, un servidor de clúster o una supercomputadora con el mismo binario.
- Agregación de resultados y post-procesamiento integrados.
- Paralelización multinivel sencilla de código ya paralelizado.
- Adaptadores listos para usar para métodos avanzados como el intercambio de réplicas (replica exchange).

## Tutorial

Cada uno de los pasos siguientes corresponde a un subdirectorio en el paquete de tutoriales de ALPSize.
Trabaja con ellos en orden; cada uno se construye sobre el anterior.

### Empaquetado con CMake

00_cmake — Verifica que el sistema de compilación CMake + ALPS esté configurado correctamente, compilando y ejecutando un programa mínimo de "hola mundo".

    $ cmake .
    $ make
    $ ./hello

### Implementación del algoritmo de Wolff en C

01_original-c — Una implementación directa en C del algoritmo de clúster de Wolff sin características de ALPS ni de C++; establece la línea base.

    $ cmake .
    $ make
    $ ./wolff

### Implementación del algoritmo de Wolff en C++

02_basic-cpp — Convierte el código C a C++ idiomático: reemplaza `<math.h>` por `<cmath>`, usa E/S de `std::` y adopta el estilo de comentarios de C++.

- Reemplazar `<math.h>` por `<cmath>` (y otras cabeceras de C por sus equivalentes en C++)
- Usar el espacio de nombres `std`
- Reemplazar `printf`/`fprintf` por `std::cout`/`std::cerr`
- Comentarios al estilo C++

        $ cmake .
        $ make
        $ ./wolff

### Uso de la Standard Template Library

03_stl — Reemplaza arreglos brutos y la gestión manual de memoria por `std::vector` y `std::stack`, dejando que la biblioteca estándar maneje la asignación.

- `std::vector<>`: arreglo unidimensional
    - El tamaño se asigna y libera automáticamente
    - El tipo de elemento (incluidos tipos definidos por el usuario) se especifica como parámetro de plantilla
- `std::stack<>`: pila con la misma gestión automática de memoria

            $ cmake .
            $ make
            $ ./wolff

### Uso de la biblioteca Boost C++

04_boost — Sustituye por Boost los arreglos de longitud fija, un mejor generador de números aleatorios y un temporizador.

- `<boost/array.hpp>`: arreglo de longitud fija
- `<boost/random.hpp>`: generación de números aleatorios
    - Mersenne Twister, Lagged Fibonacci y otros generadores
    - Distribuciones uniforme, normal, de Poisson, exponencial
- `<boost/timer.hpp>`: temporizador para medir el tiempo de ejecución

            $ cmake .
            $ make
            $ ./wolff

### Uso de ALPS/parameters

05_parameters — Lee los parámetros de simulación desde un archivo mediante `ALPS/parameters`, eliminando las constantes fijadas en el código.

    $ cmake .
    $ make
    $ ./wolff <wolff.ip

### Uso de ALPS/alea

06_alea — Acumula y analiza los datos de observables usando `ALPS/alea`, incluyendo la estimación automática de errores estadísticos.

    $ cmake .
    $ make
    $ ./wolff wolff.ip

### Uso de ALPS/lattice

07_lattice — Define la red de simulación mediante `ALPS/lattice`, separando la geometría de la física.

    $ cmake .
    $ make
    $ ./lattice <lattice.ip
    $ ./wolff <wolff.ip

### ALPSize completo con el planificador ALPS/Parapack

08_scheduler — Envuelve la simulación en una clase Worker y cede el control al planificador Parapack de ALPS, habilitando la paralelización transparente.

- La lógica de la simulación está encapsulada en una clase `Worker`
- La clase Worker debe implementar:
    - Constructor y la función miembro `init_observables`
    - Función miembro `run`
    - Funciones miembro `is_thermalized` y `progress`
    - Funciones miembro `save` y `load`
- Registra el Worker en el planificador usando la macro `PARAPACK_REGISTER_WORKER`
- El planificador prepara `Parameters` y `ObservableSet` y llama al constructor y a las funciones `init_observables` y `run`
- `lattice_mc_worker` hereda tanto de `lattice_helper` como de `rng_helper`, por lo que sus métodos están disponibles directamente

        $ cmake .
        $ make
        $ ./hello < hello.ip
        $ ./wolff < wolff.ip
