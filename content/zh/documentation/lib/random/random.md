
---
title: The Random Library
description: "ALPS Random Library"
weight: 1
---

- [Multivariate normal distribution](#multivariate-normal-distribution)
- [Runtime-polymorphic buffered generator classes](#runtime-polymorphic-buffered-generator-classes)
- [Parallel random number generators](#parallel-random-number-generators)
- [Wrappers to the SPRNG parallel random number library](#wrappers-to-the-sprng-parallel-random-number-library)

The Random library provides extensions to the Boost Random library, in particular a multivariate normal distribution and parallel random number generators.

## Multivariate normal distribution

The [multivariate_normal_distribution class template](../../random/classmnd) implements a multi-variate normal distribution of correlated normally distributed random numbers.

Multivariate normally distributed random numbers are sequences of n random numbers, distributed with given mean values M(i), and covariance matrix Cov(i,j).

Instead of using a sequence type aresult_type the design decision was to keep the underlying real number type as the `result_type`. Hence, n succesive calls are required to obtain all n multivariate normal numbers. This removes the need to choose a specific container type asresult_type, while still allowing any container to be filled using, for example, `std::generate`.

The constructor of the distribution takes the Cholesky decomposition C of the covariance matrix Cov = C[sup T]C, and the vector of mean values M. The algoritm used first creates a vector v of n normally distributed random numbers with 0 mean and unit variance and then calculates the multivariate randim numbers using the equation m + C * v.

## Runtime-polymorphic buffered generator classes

- [Introduction](#introduction)
- [Example 1: a buffered generator](#example-1-a-buffered-generator)
- [Example 2: a buffered engine](#example-2-a-buffered-engine)

### Introduction

`Boost.Random` and the TR1 random number library provide a number of efficient pseudo random number generators. These pseudo random number generators follow an algorithmic prescription to generate numbers that look "sufficiently" random to be used in place of true random numbers. Since, however these "random numbers" are not truly random, one has to be careful when using them for high-precision Monte Carlo simulations. Experience has shown that the only reliable test for the quality of a random number generator for a given application is to redo the calculation with more than one type of random number generator.

In order to facilitate the switching of random number engines at runtime, we here provide polymorphic generator classes. Since the cost os a virtual operator(), requiring a virtual function call for every single number is prohibitive in high performance applications, the [buffered_generator](../../random/classbg) uses a virtual function [memfunref alps::buffered_generator::fill_buffer fill_buffer] to generate not just one but a sequence of numbers, and then return values from that buffer using an inlines <code>operator()</code> until the buffer is exhausted.

We provide an abstract class template [buffered_generator<ResultType>](../../random/classbg) and a concrete derived class template [basic_buffered_generator<GeneratorType,ResultType>](../../random/classbbg) which uses a given generator to fill the buffer.

Since generators can have different ranges, we additionally provide, for convenience, a [buffered_uniform_01<GeneratorType,ResultType>](../../random/classbu01) random number generator class template. This template models a uniform random number generator by providing `min()` and `max()` functions and can thus be used with any of the distributions of `Boost.Random`.

### Example 1: a buffered generator

The first example shows how a buffered generator can be created and used in a simulation.

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

### Example 2: a buffered engine
The next example uses a polymorphic [`buffered_uniform_01`](../../random/classbu01) generator as a uniform random number generation engine to create variates with different distributions: uniform and normally distributed. Note that the [buffered_generator](../../random/classbg) is a model of Generator but not of UniformRandomNumberGenerator and can thus not be used as an engine in a `variate_generator`.

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

## Parallel random number generators

- [Introduction to Parallel Random Number Generator](#introduction-to-parallel-random-number-generator)
- [Parallel Uniform Random Number Generator concept](#parallel-uniform-random-number-generator-concept)
- [Named parameters interface](#named-parameters-interface)
- [Parallel seeding functions](#parallel-seeding-functions)
- [Parallel random number generators](#parallel-random-number-generators)

### Introduction to Parallel Random Number Generator

Stochastic simulations on parallel machines face an additional problem over simulations on a single CPU: we not only need one random number stream but uncorrelated random number streams for each CPU. Since massively parallel machines with 65536 CPUs exist, this can be a formidable challenge.

The [Scalable Parallel Pseuo Random Number Generators Library (SPRNG)](http://www.sprng.org/) is a C-library that was designed to solve this challenge. As explained in detail in the [SPRNG paper](http://www.sprng.org/Version1.0/paper/node7.html), there are several methods of creating independent parallel random number streams, using parametrization of the generator, or cycle division techniques.

Since the method to create independent streams depends on the choice of generator, no generic seeding can be implemented, but the seeding mechanism is specific to the generator. However, a common interface is possible, and we follow the design of the SPRNG library by requiring the following two parameters next to a global seed

- `stream_number`: the number of the current stream
- `total_streams`: the total number of streams required

Any parallel random number generator has to guarantee that generators created with the same values of `total_streams`, `global_seed` but different values for `stream_number` produce independent non-overlapping sequences of random numbers. In a parallel application, typically the node number is chosen as `stream_number` and the total number of nodes as `total_streams`.

### Parallel Uniform Random Number Generator concept

A parallel uniform random number generator is a refinement of the UniformRandomNumberGenerator that provides not one but many independent streams (sequences) of uniform random numbers.

In the following table,

- `X` denotes a model of the concept ParallelUniformRandomNumberGenerator.
- `v` is an object of typeX.
- `s` is an integral value.
- `num` and `total` are unsigned integral values saitsfying `num < total`.
- `first` and `last` are input iterators with a value type convertible to `unsigned int`. `first` is required to be non-const.
Parallel uniform random number generators seeded with the same values of `num` and `total` must produce independent non-overlapping sequences of random numbers, if all other arguments besides v are equivalent, including where applicable, the values of the range `[first, last)`.

**Table 3.1. ParallelUniformRandomNumberGenerator requirements**

| **Expression** | **Return type** | **Note** |
| :------------- | :-------------- | :------- |
| `seed(v,num,total)` | `void` | default parallel seeding of `v` |
| `seed(v,num,total,s)` | `void` | parallel seeding of `v` from a seed `s` |
| `seed(v,num,total,first,last)` | `void` | parallel seeding of `v` from two iterators. The semantics is identical to that of the seeding of a UniformRandomNumberGenerator from a pair of iterators, with the only distinction that for identical elements in the range `[first, last)` and identical values of total but different values of `num`, independent non-overlapping sequences of random numbers will be produced by the generator. |

### Named parameters interface

To simplify seeding of parallel random number generators, the generators provided in this library implement a named parameter interface:

**Table 3.2. ParallelUniformRandomNumberGenerator named parameters interface**

| **Expression** | **Return type** | **Note** |
| :------------- | :-------------- | :------- |
| `X::max_streams` | `int` | the maximum number of independent streams provided by `X` |
| `X(...)` | `X` | creates an object of type `X` with the named parameter arguments given in the table below |
| `v.seed(...)` | `void` | seeds `v` with the named parameter arguments given in the table below |
| `v.seed(first,last,...)` | `void` | seeds `v` with the range of values given by `[first, last)`, and the named parameter arguments given in the table below |


using the following parameters:

**Table 3.3. Named parameters for seeding of a ParallelUniformRandomNumberGenerator**

| **Parameter name** | **Default** | **Legal values** |
| :----------------- | :---------- | :--------------- |
| `total_streams` | 1 | `0 <= total_streams < X::max_streams` |
| `stream_number` | 0 | `0 <= stream_number < total_streams` |
| `global_seed` | 0 |  |

Parallel uniform random number generators created with the same values of `total_streams`, `global_seed` but different values for `stream_number` will produce independent non-overlapping sequences of random numbers.

### Parallel seeding functions

The headers [`alps/random/parallel/seed.hpp`](../../random/reference) and [`alps/random/parallel/mpi.hpp`](../../random/reference) provide default implementations of the parallel seeding functions required by the ParallelUniformRandomNumberGenerator concept, and additional convencience functions.

### Parallel random number generators

The ALPS Random library includes a 64-bit linear congruential generator and the WELL generators in the headers [`alps/random/parallel/lcg64.hpp`](../../random/reference) and [`alps/random/parallel/well.hpp`](../../random/reference).

The 64-bit linear congruential generator template [`alps::random::parallel::lcg64`](../../random/classlcg64) comes with three predfined instantiations [`lcg64a`](../../random/reference), [`lcg64b`](../../random/reference), and [`lcg64c`](../../random/reference), using three well-tested choices of multipliers. As for other linear congruential generators, the recursion relation x(n+1) := (a * x(n) + c) mod m is used. In this implementation, m=2^64 and the multiplier a, which is given as template parameter is different for the three generators . The prime additive constant c is chosen depending on the stream number, thus giving independent sequences for each stream.

The WELL generators provided by two instantiations [`well512a`](../../random/reference) and [`well1024a`](../../random/reference) of the class template [`alps::random::parallel::well`](../../random/classwell) model a parallel uniform pseude random number generator, whose algorithm is described in [Improved Long-Period Generators Based on Linear Recurrences Modulo 2, F. Panneton, P. L'Ecuyer and M. Matsumoto, submitted to ACM TOMS](http://www.iro.umontreal.ca/~panneton/WELLRNG.html). The parallel seeding is based on stochastic cycle division: \* The single seed method calls a pseudo-random number generator (default: `boost::mt19937`), which provides the random seeds for `total_streams` WELL generators. \* In the iterator method the state vector of all `total_streams` WELL generators is filled from a buffer.

## Wrappers to the SPRNG parallel random number library

- [Introduction to Wrappers](#introduction-to-wrappers)
- [SPRNG wrappers](#sprng-wrappers)
- [Building SPRNG](#building-sprng)

### Introduction to Wrappers

The [Scalable Parallel Pseuo Random Number Generators Library (SPRNG)](http://www.sprng.org/) is the most widely used and portable C-library for parallel random number generators. This header provides Boost.Random and TR1-conforming wrappers to the generators in the SPRNG library.

### SPRNG wrappers

In addition to the members required for a parallel random number generator the SPNRG wrappers provide the follwing, where X is the type of a SPRNG generators and v and object of that type:


| **Expression** | **Notes** |
| :------------- | :-------- |
| `X::sprng_type` | the integer SPRNG random number generator type |
| `X::max_param` | the number of different parameter values allowed for the generator |

The named parameters follow the convention for parallel random number generators, with the addition of one extra named parameter.

| **Parameter name** | **Default** | **Legal values** |
| :----------------- | :---------- | :--------------- |
| parameter | 0 | `0 <= parameter < X::max_param` |

This parameter parametrizes the generators, e.g. by choosing different multipliers in a linear congruential generator. Generators with identical seeds, but different parameters are guaranteed to provide independent sequences of random numbers. Since the value of `max_param` is typically small, the use of this extra parameter is limited, and it is in general better to obtain independent sequences by using different values for the `stream_number` parameter.

The following table lists the specific values of the constants for the various SPRNG Generators:


| **SPRNG generator** | **sprng_type** | **max_streams** | **max_param** |
| :------------------ | :------------- | :-------------- | :------------ |
| `alps::random::sprng::lfg` | 0 | 2^31-1 | 11 |
| `alps::random::sprng::lcg` | 1 | 2^19 | 7 |
| `alps::random::sprng::lcg64` | 2 | 146138719 | 3 |
| `alps::random::sprng::cmrg` | 3 | 146138719 | 3 |
| `alps::random::sprng::mlfg` | 4 | 2^31-1 | 11 |
| `alps::random::sprng::pmlcg` | 5 | 2^30 | 1 |

The class members and their semantics are the same as those defined in the parallel random number generator concepts.

### Building SPRNG

The SPRNG wrappers are a header-only library but executables will need to be linked with the SPRNG library, which can be downloaded in source form from the [SPRNG web page](http://www.sprng.org/).

The path to the SPRNG library needs to be specified by either a statement

    using sprng : path-to-sprng-library ;
    
in the `user-config.jam` file or by setting the environment variable `SPRNG_ROOT`. The path can point either to a compiled library or alternatively to the source distribution. In the latter case the SPRNG library is built from source when needed.

The PMLCG generator additionally needs the [GMP](https://gmplib.org/) library. To use this generator the GMP library needs to be installed, and its path specified as the optional second argument to

    using sprng : path-to-sprng-library : path-to-gmp-library ;
