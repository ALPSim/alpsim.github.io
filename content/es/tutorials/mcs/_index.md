
---
title: Simulaciones Monte Carlo
description: "Tutoriales para ALPS"
toc: true
weight: 1
---

Los tutoriales de Monte Carlo de ALPS abarcan simulaciones tanto clásicas como cuánticas de modelos de espín y sistemas bosónicos en red.
El Monte Carlo clásico usa actualizaciones locales de Metropolis o actualizaciones de cúmulo (Wolff) para sistemas descritos por un peso de Boltzmann clásico.
Los algoritmos de Monte Carlo cuántico (QMC) — loop, directed-loop SSE, worm y directed worm — operan sobre representaciones de integral de camino o de series de operadores y dan acceso a las propiedades termodinámicas de modelos cuánticos en red a temperatura finita.
Un método de Wang-Landau cuántico de ensemble extendido calcula la densidad de estados completa y las cantidades termodinámicas en todas las temperaturas en una sola ejecución.
Los tutoriales avanzan desde diagnósticos fundamentales como los tiempos de autocorrelación y la equilibración, pasando por observables específicos como las susceptibilidades y las curvas de magnetización, hasta la detección de transiciones de fase clásicas y cuánticas.

## Elegir un código

Antes de comenzar una simulación es importante seleccionar el algoritmo más adecuado para su modelo y observable.
La guía siguiente compara las cuatro representaciones QMC disponibles en ALPS — `looper`, `dirloop_sse`, `worm` y `qwl` — y resume sus respectivas fortalezas y limitaciones.

- [¿Qué código elegir para su simulación?](com)

## Monte Carlo clásico (`spinmc`)

La aplicación `spinmc` implementa Monte Carlo clásico con actualizaciones locales de Metropolis y actualizaciones de cúmulo para modelos de espín clásicos.
Los dos primeros tutoriales introducen los diagnósticos más importantes para cualquier ejecución de MC — el tiempo de autocorrelación y la equilibración — sentando las bases para todo el trabajo posterior.
El método se retoma más adelante para estudiar el escalamiento de tamaño finito y la transición de fase de segundo orden del modelo de Ising 2D.

- [MC-01(a) Simulaciones Monte Carlo clásicas y autocorrelaciones](mc01a)
- [MC-01(b) Simulaciones Monte Carlo clásicas y equilibración/convergencia](mc01b)
- [MC-07 Transición de fase en el modelo de Ising](mc07)

## QMC de loop y directed-loop (`looper`, `dirloop_sse`)

El código `looper` implementa el algoritmo de loop en una representación de bucles de operadores y es más eficiente para modelos de espín isótropos sin campo magnético.
El código `dirloop_sse` usa bucles dirigidos en la representación de expansión en series estocásticas (SSE); maneja modelos con anisotropía o un campo magnético externo que rompen la simetría de inversión de espín requerida por `looper`.
Estos tutoriales cubren las susceptibilidades de cadenas y escaleras de Heisenberg, las curvas de magnetización en un campo, y la identificación de una transición de fase cuántica en una red dimerizada.

- [MC-02 Cálculo de susceptibilidades magnéticas mediante los códigos MC clásico y looper QMC](mc02)
- [MC-03 Cálculo de curvas de magnetización mediante el código directed loop QMC](mc03)
- [MC-08 Transición de fase cuántica en un modelo de espín cuántico](mc08)
- [MC-09 Monte Carlo cuántico](qmc)

## Worm QMC (`worm`)

El código `worm` usa el algoritmo worm en la representación de integral de camino y es el método de elección para modelos de Bose-Hubbard y para modelos de espín en campos magnéticos intensos.
Los tutoriales muestran cómo habilitar y evaluar funciones de correlación y funciones de Green, y demuestran la transición de fase cuántica superfluido–aislante de Mott en el modelo de Bose-Hubbard.

- [MC-04 Mediciones personalizadas en los códigos QMC](mc04)
- [MC-05 Simulación del modelo de Bose-Hubbard usando el código worm QMC](mc05)

## Wang-Landau cuántico (`qwl`)

El código de Wang-Landau cuántico construye estocásticamente la densidad de estados de un hamiltoniano cuántico y deriva la termodinámica completa — energía libre, entropía y calor específico — en todas las temperaturas a partir de una sola simulación.
Este tutorial aplica el método a cadenas y escaleras de espín de Heisenberg ferromagnéticas y antiferromagnéticas.

- [MC-06 Simulaciones de ensemble extendido (Wang-Landau cuántico)](mc06)

## Algoritmo Directed Worm (`dwa`)

El algoritmo directed worm es un método QMC de integral de camino altamente eficiente para bosones en red que combina actualizaciones worm con estimadores mejorados.
Los tutoriales retoman la física de Bose-Hubbard de MC-05 con el código `dwa` y luego estudian el perfil de densidad de una red óptica tridimensional en una trampa armónica — un sistema directamente relevante para experimentos con átomos ultrafríos.

- [MC-10 Simulaciones Monte Carlo con Directed Worm](dwa)
