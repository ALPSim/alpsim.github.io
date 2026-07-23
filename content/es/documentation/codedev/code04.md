
---
title: Code-04 AleaHOWTO
math: true
toc: true
weight: 5
---

## Biblioteca ALEA

La biblioteca Alea permite
- realizar mediciones de Monte Carlo
- calcular errores y tiempos de autocorrelación mediante análisis por bins (análisis jackknife)
- calcular valores medios y errores de funciones de mediciones

### Mediciones de Monte Carlo

Incluimos la biblioteca ALEA en un código C++ con

    #include <alps/alea.h>
    
Primero tenemos que crear un observable

    alps::RealObservable obs_a("observable a");
    
donde el argumento en el constructor representa el nombre del observable. Las mediciones se pueden añadir fácilmente al observable usando el operador "<<". Por ejemplo

    obs_a << 1.2;
    
añade el número 1.2 al observable `obs_a`.

Toda simulación de Monte Carlo necesita termalización. Después de un cierto número de pasos de termalización, el observable debe reiniciarse mediante

    obs_a.reset(true);
    
Imprimir un observable se hace simplemente con

    std::cout << obs_a;
    
Aquí hay un programa de ejemplo completo:

    #include <iostream>
    #include <alps/alea.h>
    #include <boost/random.hpp> 

    int main()
    {
        //DEFINE RANDOM NUMBER GENERATOR
        typedef boost::minstd_rand0 random_base_type;
        typedef boost::uniform_01<random_base_type> random_type;
        random_base_type random_int;
        random_type random(random_int);

        //DEFINE OBSERVABLE
        alps::RealObservable obs_a("observable a");

        //ADD 1000 MEASUREMENTS TO THE OBSERVABLE
        for(int i = 0; i < 1000; ++i){ 
            obs_a << random();
        }

        //RESET OBSERVABLES (THERMALIZATION FINISHED)
        obs_a.reset(true);

        //ADD 10000 MEASUREMENTS TO THE OBSERVABLE
        for(int i = 0; i < 10000; ++i){
            obs_a << random();
        }

        //OUTPUT OBSERVABLE
        std::cout << obs_a;       
    }

### Funciones de observables

Es posible evaluar funciones de observables. Primero tenemos que crear evaluadores de observables a partir de los observables que contienen las mediciones. Por ejemplo, supongamos que hemos añadido mediciones a `obs_a` y `obs_b` y queremos calcular `obs_c = obs_a/obs_b`. Esto se puede hacer mediante

    alps::RealObsevaluator obseval_a(obs_a);
    alps::RealObsevaluator obseval_b(obs_b);
    alps::RealObsevaluator obseval_c;
    obseval_c = obseval_b / obseval_a;
    std::cout << obseval_c;

También se pueden encontrar programas de ejemplo sencillos en el directorio de fuentes de ALPS, en "test/alea".
