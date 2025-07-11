
---
title: Introduction
description: "Introduction to ALPS General Library"
weight: 1
---

This is a collection of code used by more than one of the ALPS libraries. The header files and libraries provided here should be considered implementation details for the other officially supported libraries and are subject to change without notice.

We hope to move the functionality of the headers in this library to standardized libraries such as the Boost C++ library, or to split some components off into domain-specific libraries.

We welcome your ideas, suggestions and contributions. If you are interested in using some of the components in this library, please contact us and we can work together in achieving a good release version.

- Configuration
    - alps/config.h contains configuration options.

- Traits classes
    - alps/typetraits.h contains type traits not found in the standard and boost libraries.
    - alps/vectortraits.h contains vector type traits and support for container free numerical algorithms.

- Character functions
    - alps/cctype.h includes <cctype> and undefines harmful macros that some implementations forget to undefinf.

- Bit operations
    - alps/bitops.h contains bit operations modeled after the Cray intrinsics.

- Mathematical functions and function objects
    - alps/functional.h contains mathematical function objects not found in the standard and boost libraries.
    - alps/math.hpp contains mathematical functions not found in the standard and boost libraries.
    - alps/vectormath.h contains a few basic mathematical operations on std::vector.
    - alps/random.h contains functions to randomize a vector and a fast buffered RNG class.

- Classes for parameters and their evaluation
    - alps/stringvalue.h a class that can store any numerical, boolean or string value in a string representation.
    - alps/parameters.h a class that can store parameters, identified by name
    - alps/parameterlist.h a collection of Parameters
    - alps/expression.h the Expression class for limited symbolic evaluation of expressions

- Fixed-Capacity STL Containers
    - alps/fixed_capacity_vector.h an STL-compliant vector class with fixed capcity.
    - alps/fixed_capacity_deque.h an STL-compliant deque class with fixed capcity.
    - alps/fixed_capacity_traits.h a traits class for fixed capcity containers.
    - alps/fixed_capacity_fwd.h forward declarations of fixed capcity containers.\* Configuration
