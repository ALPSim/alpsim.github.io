
---
title: Introducción
description: "Introducción a la Biblioteca General de ALPS"
weight: 1
---

Esta es una colección de código utilizado por más de una de las bibliotecas ALPS. Los archivos de cabecera y las bibliotecas proporcionados aquí deben considerarse detalles de implementación de las demás bibliotecas oficialmente soportadas y están sujetos a cambios sin previo aviso.

Esperamos trasladar la funcionalidad de las cabeceras de esta biblioteca a bibliotecas estandarizadas como la biblioteca Boost C++, o dividir algunos componentes en bibliotecas específicas de dominio.

Damos la bienvenida a sus ideas, sugerencias y contribuciones. Si está interesado en usar alguno de los componentes de esta biblioteca, por favor contáctenos y podremos trabajar juntos para lograr una buena versión de lanzamiento.

- Configuración
    - alps/config.h contiene opciones de configuración.

- Clases traits
    - alps/typetraits.h contiene traits de tipo que no se encuentran en las bibliotecas estándar y boost.
    - alps/vectortraits.h contiene traits de tipo vector y soporte para algoritmos numéricos independientes del contenedor.

- Funciones de caracteres
    - alps/cctype.h incluye <cctype> y elimina la definición de macros dañinas que algunas implementaciones olvidan eliminar.

- Operaciones de bits
    - alps/bitops.h contiene operaciones de bits inspiradas en los intrínsecos de Cray.

- Funciones matemáticas y objetos función
    - alps/functional.h contiene objetos función matemáticos que no se encuentran en las bibliotecas estándar y boost.
    - alps/math.hpp contiene funciones matemáticas que no se encuentran en las bibliotecas estándar y boost.
    - alps/vectormath.h contiene algunas operaciones matemáticas básicas sobre std::vector.
    - alps/random.h contiene funciones para aleatorizar un vector y una clase RNG rápida con búfer.

- Clases para parámetros y su evaluación
    - alps/stringvalue.h una clase que puede almacenar cualquier valor numérico, booleano o de cadena en una representación de cadena.
    - alps/parameters.h una clase que puede almacenar parámetros, identificados por nombre
    - alps/parameterlist.h una colección de Parameters
    - alps/expression.h la clase Expression para la evaluación simbólica limitada de expresiones

- Contenedores STL de Capacidad Fija
    - alps/fixed_capacity_vector.h una clase vector compatible con STL de capacidad fija.
    - alps/fixed_capacity_deque.h una clase deque compatible con STL de capacidad fija.
    - alps/fixed_capacity_traits.h una clase traits para contenedores de capacidad fija.
    - alps/fixed_capacity_fwd.h declaraciones anticipadas de contenedores de capacidad fija.\* Configuración
