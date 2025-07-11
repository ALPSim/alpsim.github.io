
---
title: Code-04 AleaHOWTO
math: true
toc: true
weight: 5
---

## ALEA Library

The Alea library allows to
- do Monte Carlo measurements
- calculate errors and autocorrelation times with binning analysis (Jackknife analysis)
- calculate mean values and errors of functions of measurements

### Monte Carlo measurements

We include the ALEA library in a C++ code with

    #include <alps/alea.h>
    
First we have to create an observable

    alps::RealObservable obs_a("observable a");
    
where the argument in the constructor stands for the name of the observable. Measurements can easily added to the observable by using the "<<" operator. For example

    obs_a << 1.2;
    
adds the number 1.2 to the observable `obs_a`.

Every Monte Carlo simulation needs thermalization. After a certain number of thermalization steps the observable has to be reset by

    obs_a.reset(true);
    
Printing an observable is simply done by

    std::cout << obs_a;
    
Here is a complete example program:

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

### Functions of Obervables

It is possible to evaluate functions of observables. We first have to create observable evaluators from the observables containing the measurements. For example, assume we have added measurements to `obs_a` and `obs_b` and we want to calculate `obs_c = obs_a/obs_b`. This can be done by

    alps::RealObsevaluator obseval_a(obs_a);
    alps::RealObsevaluator obseval_b(obs_b);
    alps::RealObsevaluator obseval_c;
    obseval_c = obseval_b / obseval_a;
    std::cout << obseval_c;

Simple example programs can also be found in the ALPS source directory in "test/alea".
