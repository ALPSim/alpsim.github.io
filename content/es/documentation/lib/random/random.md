
---
title: La Biblioteca Random
description: "Biblioteca Random de ALPS"
weight: 1
---

- [Distribución normal multivariante](#multivariate-normal-distribution)
- [Clases generadoras con búfer polimórficas en tiempo de ejecución](#runtime-polymorphic-buffered-generator-classes)
- [Generadores de números aleatorios paralelos](#parallel-random-number-generators)
- [Envoltorios para la biblioteca paralela de números aleatorios SPRNG](#wrappers-to-the-sprng-parallel-random-number-library)

La biblioteca Random proporciona extensiones a la biblioteca Boost Random, en particular una distribución normal multivariante y generadores de números aleatorios paralelos.

## Distribución normal multivariante

La plantilla de clase multivariate_normal_distribution implementa una distribución normal multivariante de números aleatorios correlacionados con distribución normal.

Los números aleatorios con distribución normal multivariante son secuencias de n números aleatorios, distribuidos con valores medios M(i) dados, y matriz de covarianza Cov(i,j).

En lugar de usar un tipo de secuencia como result_type, la decisión de diseño fue mantener el tipo de número real subyacente como el `result_type`. Por lo tanto, se requieren n llamadas sucesivas para obtener los n números normales multivariantes. Esto elimina la necesidad de elegir un tipo de contenedor específico como result_type, a la vez que permite que cualquier contenedor se rellene usando, por ejemplo, `std::generate`.

El constructor de la distribución toma la descomposición de Cholesky C de la matriz de covarianza Cov = C[sup T]C, y el vector de valores medios M. El algoritmo utilizado primero crea un vector v de n números aleatorios con distribución normal, media 0 y varianza unitaria, y luego calcula los números aleatorios multivariantes usando la ecuación m + C * v.

## Clases generadoras con búfer polimórficas en tiempo de ejecución

- [Introducción](#introduction)
- [Ejemplo 1: un generador con búfer](#example-1-a-buffered-generator)
- [Ejemplo 2: un motor con búfer](#example-2-a-buffered-engine)

### Introducción

`Boost.Random` y la biblioteca de números aleatorios TR1 proporcionan varios generadores de números pseudoaleatorios eficientes. Estos generadores de números pseudoaleatorios siguen una prescripción algorítmica para generar números que parecen "suficientemente" aleatorios como para usarse en lugar de números verdaderamente aleatorios. Sin embargo, dado que estos "números aleatorios" no son verdaderamente aleatorios, hay que tener cuidado al usarlos en simulaciones de Monte Carlo de alta precisión. La experiencia ha demostrado que la única prueba fiable de la calidad de un generador de números aleatorios para una aplicación dada es repetir el cálculo con más de un tipo de generador de números aleatorios.

Para facilitar el cambio de motores de números aleatorios en tiempo de ejecución, aquí proporcionamos clases generadoras polimórficas. Dado que el costo de un operator() virtual, que requiere una llamada a función virtual para cada número, es prohibitivo en aplicaciones de alto rendimiento, buffered_generator usa una función virtual [memfunref alps::buffered_generator::fill_buffer fill_buffer] para generar no solo un número sino una secuencia de números, y luego devuelve valores de ese búfer usando un <code>operator()</code> en línea hasta que el búfer se agota.

Proporcionamos una plantilla de clase abstracta buffered_generator<ResultType> y una plantilla de clase derivada concreta basic_buffered_generator<GeneratorType,ResultType> que usa un generador dado para rellenar el búfer.

Dado que los generadores pueden tener diferentes rangos, adicionalmente proporcionamos, por conveniencia, una plantilla de clase generadora de números aleatorios buffered_uniform_01<GeneratorType,ResultType>. Esta plantilla modela un generador de números aleatorios uniforme al proporcionar las funciones `min()` y `max()`, y por lo tanto puede usarse con cualquiera de las distribuciones de `Boost.Random`.

### Ejemplo 1: un generador con búfer

El primer ejemplo muestra cómo se puede crear y usar un generador con búfer en una simulación.

    #include <alps/random/buffered_generator.hpp>
    #include <boost/random.hpp>
    #include <iostream>

    // A simple example simulation - usually it will be much more complex
    double simulate(alps::buffered_generator<double>& gen)
    {
        double sum=0;
        for (int i=0;i<100000;i++)
            sum += gen();
        return sum;
    }

    // create a buffered_generator
    template <class RNG>
    void simulate_it()
    {
        typedef boost::variate_generator<RNG&,boost::normal_distribution<> > gen_type;
        RNG engine;
        alps::basic_buffered_generator<gen_type,double> 
            gen(gen_type(engine,boost::normal_distribution<>()));
   
        std::cout << simulate(gen) << std::endl;
    }

    // call the simulation with two different generators
    int main()
    {
        simulate_it<boost::mt11213b>();
        simulate_it<boost::mt19937>();
    }

### Ejemplo 2: un motor con búfer
El siguiente ejemplo usa un generador polimórfico `buffered_uniform_01` como motor de generación de números aleatorios uniformes para crear variantes con distintas distribuciones: uniforme y con distribución normal. Nótese que buffered_generator es un modelo de Generator pero no de UniformRandomNumberGenerator, y por lo tanto no puede usarse como motor en un `variate_generator`.

    #include <alps/random/buffered_uniform_01.hpp>
    #include <boost/random.hpp>
    #include <iostream>

    // A simple example simulation - usually it will be much more complex
    double simulate(alps::buffered_uniform_01<double>& gen)
    {
        double sum=0;
        for (int i=0;i<100000;i++)
            sum += gen();
   
        typedef boost::variate_generator<alps::buffered_uniform_01<double>&,boost::normal_distribution<> > gen_type;
        gen_type gauss(gen,boost::normal_distribution<>());
        for (int i=0;i<100000;i++)
            sum += gauss();
        return sum;
    }

    // create a buffered_generator
    template <class RNG>
    void simulate_it()
    {
        alps::basic_buffered_uniform_01<RNG> gen;
        std::cout << simulate(gen) << std::endl;
    }

    // call the simulation with two different generators
    int main()
    {
        simulate_it<boost::mt11213b>();
        simulate_it<boost::mt19937>();
    }

## Generadores de números aleatorios paralelos

- [Introducción a los Generadores de Números Aleatorios Paralelos](#introduction-to-parallel-random-number-generator)
- [Concepto de Generador de Números Aleatorios Uniforme Paralelo](#parallel-uniform-random-number-generator-concept)
- [Interfaz de parámetros nombrados](#named-parameters-interface)
- [Funciones de siembra paralela](#parallel-seeding-functions)
- [Generadores de números aleatorios paralelos](#parallel-random-number-generators)

### Introducción a los Generadores de Números Aleatorios Paralelos

Las simulaciones estocásticas en máquinas paralelas enfrentan un problema adicional respecto a las simulaciones en una sola CPU: no solo necesitamos un flujo de números aleatorios, sino flujos de números aleatorios no correlacionados para cada CPU. Dado que existen máquinas masivamente paralelas con 65536 CPUs, esto puede ser un desafío formidable.

La [Biblioteca Escalable de Generadores de Números Pseudoaleatorios Paralelos (SPRNG)](http://www.sprng.org/) es una biblioteca en C diseñada para resolver este desafío. Como se explica en detalle en el [artículo de SPRNG](http://www.sprng.org/Version1.0/paper/node7.html), existen varios métodos para crear flujos de números aleatorios paralelos independientes, usando parametrización del generador o técnicas de división de ciclos.

Dado que el método para crear flujos independientes depende de la elección del generador, no se puede implementar una siembra genérica, sino que el mecanismo de siembra es específico del generador. Sin embargo, es posible una interfaz común, y seguimos el diseño de la biblioteca SPRNG requiriendo los siguientes dos parámetros además de una semilla global

- `stream_number`: el número del flujo actual
- `total_streams`: el número total de flujos requeridos

Cualquier generador de números aleatorios paralelo debe garantizar que los generadores creados con los mismos valores de `total_streams`, `global_seed` pero diferentes valores de `stream_number` produzcan secuencias independientes y sin solapamiento de números aleatorios. En una aplicación paralela, típicamente se elige el número de nodo como `stream_number` y el número total de nodos como `total_streams`.

### Concepto de Generador de Números Aleatorios Uniforme Paralelo

Un generador de números aleatorios uniforme paralelo es un refinamiento del UniformRandomNumberGenerator que proporciona no uno sino muchos flujos (secuencias) independientes de números aleatorios uniformes.

En la siguiente tabla,

- `X` denota un modelo del concepto ParallelUniformRandomNumberGenerator.
- `v` es un objeto de tipo X.
- `s` es un valor integral.
- `num` y `total` son valores integrales sin signo que satisfacen `num < total`.
- `first` y `last` son iteradores de entrada con un tipo de valor convertible a `unsigned int`. Se requiere que `first` no sea const.
Los generadores de números aleatorios uniformes paralelos sembrados con los mismos valores de `num` y `total` deben producir secuencias independientes y sin solapamiento de números aleatorios, si todos los demás argumentos además de v son equivalentes, incluyendo, cuando corresponda, los valores del rango `[first, last)`.

**Tabla 3.1. Requisitos de ParallelUniformRandomNumberGenerator**

| **Expresión** | **Tipo de retorno** | **Nota** |
| :------------- | :-------------- | :------- |
| `seed(v,num,total)` | `void` | siembra paralela por defecto de `v` |
| `seed(v,num,total,s)` | `void` | siembra paralela de `v` a partir de una semilla `s` |
| `seed(v,num,total,first,last)` | `void` | siembra paralela de `v` a partir de dos iteradores. La semántica es idéntica a la de la siembra de un UniformRandomNumberGenerator a partir de un par de iteradores, con la única distinción de que para elementos idénticos en el rango `[first, last)` y valores idénticos de total pero diferentes valores de `num`, el generador producirá secuencias independientes y sin solapamiento de números aleatorios. |

### Interfaz de parámetros nombrados

Para simplificar la siembra de generadores de números aleatorios paralelos, los generadores proporcionados en esta biblioteca implementan una interfaz de parámetros nombrados:

**Tabla 3.2. Interfaz de parámetros nombrados de ParallelUniformRandomNumberGenerator**

| **Expresión** | **Tipo de retorno** | **Nota** |
| :------------- | :-------------- | :------- |
| `X::max_streams` | `int` | el número máximo de flujos independientes proporcionados por `X` |
| `X(...)` | `X` | crea un objeto de tipo `X` con los argumentos de parámetros nombrados dados en la tabla siguiente |
| `v.seed(...)` | `void` | siembra `v` con los argumentos de parámetros nombrados dados en la tabla siguiente |
| `v.seed(first,last,...)` | `void` | siembra `v` con el rango de valores dado por `[first, last)`, y los argumentos de parámetros nombrados dados en la tabla siguiente |


usando los siguientes parámetros:

**Tabla 3.3. Parámetros nombrados para la siembra de un ParallelUniformRandomNumberGenerator**

| **Nombre del parámetro** | **Valor por defecto** | **Valores permitidos** |
| :----------------- | :---------- | :--------------- |
| `total_streams` | 1 | `0 <= total_streams < X::max_streams` |
| `stream_number` | 0 | `0 <= stream_number < total_streams` |
| `global_seed` | 0 |  |

Los generadores de números aleatorios uniformes paralelos creados con los mismos valores de `total_streams`, `global_seed` pero diferentes valores de `stream_number` producirán secuencias independientes y sin solapamiento de números aleatorios.

### Funciones de siembra paralela

Las cabeceras [`alps/random/parallel/seed.hpp`](../../random/reference) y [`alps/random/parallel/mpi.hpp`](../../random/reference) proporcionan implementaciones por defecto de las funciones de siembra paralela requeridas por el concepto ParallelUniformRandomNumberGenerator, así como funciones de conveniencia adicionales.

### Generadores de números aleatorios paralelos

La biblioteca ALPS Random incluye un generador congruencial lineal de 64 bits y los generadores WELL en las cabeceras [`alps/random/parallel/lcg64.hpp`](../../random/reference) y [`alps/random/parallel/well.hpp`](../../random/reference).

La plantilla de generador congruencial lineal de 64 bits `alps::random::parallel::lcg64` viene con tres instanciaciones predefinidas [`lcg64a`](../../random/reference), [`lcg64b`](../../random/reference), y [`lcg64c`](../../random/reference), usando tres elecciones bien probadas de multiplicadores. Como en otros generadores congruenciales lineales, se usa la relación de recurrencia x(n+1) := (a * x(n) + c) mod m. En esta implementación, m=2^64 y el multiplicador a, que se da como parámetro de plantilla, es diferente para los tres generadores. La constante aditiva prima c se elige en función del número de flujo, dando así secuencias independientes para cada flujo.

Los generadores WELL, proporcionados por dos instanciaciones [`well512a`](../../random/reference) y [`well1024a`](../../random/reference) de la plantilla de clase `alps::random::parallel::well`, modelan un generador de números pseudoaleatorios uniforme paralelo, cuyo algoritmo se describe en [Improved Long-Period Generators Based on Linear Recurrences Modulo 2, F. Panneton, P. L'Ecuyer y M. Matsumoto, submitted to ACM TOMS](https://doi.org/10.1145/1132973.1132974). La siembra paralela se basa en la división estocástica de ciclos: \* El método de semilla única llama a un generador de números pseudoaleatorios (por defecto: `boost::mt19937`), que proporciona las semillas aleatorias para los generadores WELL de `total_streams`. \* En el método de iteradores, el vector de estado de todos los generadores WELL de `total_streams` se rellena a partir de un búfer.

## Envoltorios para la biblioteca paralela de números aleatorios SPRNG

- [Introducción a los Envoltorios](#introduction-to-wrappers)
- [Envoltorios de SPRNG](#sprng-wrappers)
- [Compilación de SPRNG](#building-sprng)

### Introducción a los Envoltorios

La [Biblioteca Escalable de Generadores de Números Pseudoaleatorios Paralelos (SPRNG)](http://www.sprng.org/) es la biblioteca en C para generadores de números aleatorios paralelos más ampliamente usada y portable. Esta cabecera proporciona envoltorios conformes con Boost.Random y TR1 para los generadores de la biblioteca SPRNG.

### Envoltorios de SPRNG

Además de los miembros requeridos para un generador de números aleatorios paralelo, los envoltorios SPRNG proporcionan lo siguiente, donde X es el tipo de un generador SPRNG y v un objeto de ese tipo:


| **Expresión** | **Notas** |
| :------------- | :-------- |
| `X::sprng_type` | el tipo entero de generador de números aleatorios SPRNG |
| `X::max_param` | el número de valores de parámetro diferentes permitidos para el generador |

Los parámetros nombrados siguen la convención de los generadores de números aleatorios paralelos, con la adición de un parámetro nombrado adicional.

| **Nombre del parámetro** | **Valor por defecto** | **Valores permitidos** |
| :----------------- | :---------- | :--------------- |
| parameter | 0 | `0 <= parameter < X::max_param` |

Este parámetro parametriza los generadores, por ejemplo eligiendo diferentes multiplicadores en un generador congruencial lineal. Los generadores con semillas idénticas, pero diferentes parámetros, tienen garantizado proporcionar secuencias independientes de números aleatorios. Dado que el valor de `max_param` suele ser pequeño, el uso de este parámetro adicional es limitado, y en general es mejor obtener secuencias independientes usando diferentes valores para el parámetro `stream_number`.

La siguiente tabla enumera los valores específicos de las constantes para los distintos Generadores SPRNG:


| **Generador SPRNG** | **sprng_type** | **max_streams** | **max_param** |
| :------------------ | :------------- | :-------------- | :------------ |
| `alps::random::sprng::lfg` | 0 | 2^31-1 | 11 |
| `alps::random::sprng::lcg` | 1 | 2^19 | 7 |
| `alps::random::sprng::lcg64` | 2 | 146138719 | 3 |
| `alps::random::sprng::cmrg` | 3 | 146138719 | 3 |
| `alps::random::sprng::mlfg` | 4 | 2^31-1 | 11 |
| `alps::random::sprng::pmlcg` | 5 | 2^30 | 1 |

Los miembros de la clase y su semántica son los mismos que los definidos en los conceptos de generador de números aleatorios paralelo.

### Compilación de SPRNG

Los envoltorios de SPRNG son una biblioteca de solo cabecera, pero los ejecutables necesitarán enlazarse con la biblioteca SPRNG, que puede descargarse en forma de código fuente desde la [página web de SPRNG](http://www.sprng.org/).

La ruta a la biblioteca SPRNG debe especificarse mediante una instrucción

    using sprng : path-to-sprng-library ;
    
en el archivo `user-config.jam`, o estableciendo la variable de entorno `SPRNG_ROOT`. La ruta puede apuntar tanto a una biblioteca compilada como, alternativamente, a la distribución de código fuente. En este último caso, la biblioteca SPRNG se compila desde el código fuente cuando es necesario.

El generador PMLCG además necesita la biblioteca [GMP](https://gmplib.org/). Para usar este generador, la biblioteca GMP debe estar instalada, y su ruta debe especificarse como el segundo argumento opcional a

    using sprng : path-to-sprng-library : path-to-gmp-library ;
