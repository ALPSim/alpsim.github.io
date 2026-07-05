
---
title: DMFT-07 Hirsch-Fye
math: true
toc: true
---

## Código de Hirsch Fye

Comenzamos ejecutando un código de Monte Carlo de tiempo discreto: el [código de Hirsch Fye](https://link.aps.org/doi/10.1103/PhysRevLett.56.2521). Como ejemplo reproducimos la Fig. 11 de la revisión de DMFT de [Georges it et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). La serie de seis curvas muestra cómo el sistema, un modelo de Hubbard en la red de Bethe con interacción $U=3D/\sqrt{2}$ a llenado medio, entra en una fase antiferromagnética al enfriarse.

El algoritmo de Hirsch Fye se describe [aquí](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13), y esta revisión también proporciona una implementación de código abierto de los códigos. Aunque se han desarrollado muchas mejoras (véase p. ej. [Alvarez08]() o [Nukala09](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111)), el algoritmo ha sido reemplazado por [algoritmos de tiempo continuo](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123) que eliminan los errores sistemáticos de discretización.

La simulación de Hirsch Fye tomará unos 20 segundos por iteración. Los scripts de python para ejecutar esta simulación incluyen una versión corta [`tutorial7.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7.py) que ejecuta simulaciones solo a 2 temperaturas (toma 5 minutos), o una versión que reproduce las 6 temperaturas en [`tutorial7_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7_long.py). Para la evaluación puede usar el mismo script `tutorial2eval.py` descrito en el tutorial [ALPS_2_Tutorials:DMFT-02_Hybridization](../dmft02), o puede usar el script [`tutorial7eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7eval.py).

Los parámetros principales son los mismos que los descritos en el tutorial [ALPS_2_Tutorials:DMFT-02_Hybridization](../dmft02).

Al ser un método de tiempo discreto, HF sufre errores de $\Delta\tau$. Elija un conjunto de parámetros y ejecútelo para valores de $N$ sucesivamente mayores.
