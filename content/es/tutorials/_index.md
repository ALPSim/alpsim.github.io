
---
title: Tutoriales
icon: school
description: "Tutoriales para ALPS"
weight: 3
toc: true
cascade:
    type: docs
---
Estos tutoriales lo guían a través de los principales métodos de simulación disponibles en ALPS, desde Monte Carlo clásico y cuántico hasta enfoques de redes tensoriales y de campo medio.
Cada tutorial plantea un modelo concreto —típicamente una cadena de espines, un modelo de Hubbard o un sistema de Bose-Hubbard— y recorre la elección de parámetros, la ejecución de la simulación y el análisis de la salida.
Los sistemas de ejemplo son intencionalmente pequeños para que cada cálculo se complete en minutos en una computadora portátil.
Todos los tutoriales están disponibles como scripts de Python; una colección creciente de [Jupyter Notebooks](jupyter) ofrece una alternativa interactiva.

## [Simulaciones Monte Carlo](mcs)

Tutoriales de Monte Carlo clásico y cuántico que cubren toda la gama de algoritmos MC en ALPS.
Comenzando con el muestreo Metropolis simple y el análisis de autocorrelación, los tutoriales avanzan hacia el Monte Carlo cuántico de bucles (loop), bucles dirigidos (directed-loop) y gusano (worm) para modelos de espín y Bose-Hubbard, el muestreo de conjunto extendido de Wang-Landau, y el estudio de transiciones de fase clásicas y cuánticas.

## [Diagonalización Exacta](ed)

Tutoriales sobre la diagonalización exacta de modelos cuánticos de red pequeños.
Los temas incluyen la diagonalización dispersa de Lanczos, el escalamiento del gap de espín en sistemas de espín cuánticos unidimensionales, las funciones espectrales y los factores de estructura dinámicos, la descripción mediante teoría de campos conforme de los espectros críticos, cadenas de espín frustradas cerca de una transición de fase cuántica, y la diagonalización completa para obtener la estadística completa de niveles de energía.

## [Grupo de Renormalización de la Matriz de Densidad (DMRG)](dmrg)

Tutoriales sobre el método DMRG aplicado a sistemas cuánticos unidimensionales.
La serie introduce el algoritmo y su convergencia, luego demuestra cómo extraer gaps de energía, medir observables locales como los perfiles de magnetización, y calcular funciones de correlación de dos puntos —cantidades clave para identificar fases cuánticas y comportamiento crítico.

## [Teoría de Campo Medio Dinámica (DMFT)](dmft)

Tutoriales sobre el ciclo de autoconsistencia DMFT y sus solucionadores de impureza cuántica.
Tras una introducción al método, los tutoriales individuales cubren los solucionadores de Monte Carlo cuántico en tiempo continuo CT-HYB y CT-INT, el solucionador de Hirsch-Fye, la transición metal-aislante de Mott, la transición de Mott selectiva por orbital, la extrapolación a temperatura finita, geometrías de red personalizadas, y la transición antiferromagnética de Néel.

## [Decimación de Bloques con Evolución Temporal (TEBD)](tebd)

Tutoriales sobre la evolución en tiempo real de sistemas cuánticos unidimensionales usando estados de producto matricial.
Los dos tutoriales estudian problemas prototípicos fuera de equilibrio: un quench súbito en el modelo de bosones de núcleo duro (hardcore boson) y la propagación de una pared de dominio en la cadena de espín XX, ilustrando cómo evolucionan el entrelazamiento y los observables locales tras un quench cuántico.

## [Redes y Modelos Personalizados](lm)

Tutoriales sobre la definición de geometrías de red y hamiltonianos de modelo personalizados usando el formato XML de ALPS.
Estos tutoriales cierran la brecha entre la biblioteca integrada de ALPS y la generalidad completa del esquema de redes y modelos, mostrando cómo especificar cualquier red periódica con una celda unitaria arbitraria y ejecutar hamiltonianos estándar o personalizados sobre ella.

## [Jupyter Notebooks](jupyter)

Versiones interactivas en Jupyter notebook de tutoriales seleccionados de ALPS, organizadas por método.
Cada notebook combina código, ecuaciones y gráficos en un único documento que se puede descargar y ejecutar localmente, lo que facilita modificar parámetros y explorar los resultados de manera interactiva.




