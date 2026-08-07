
---
title: Qué código elegir para su cálculo
math: true
toc: true
weight: 1
---

Actualmente existen cuatro representaciones/algoritmos QMC: looper, dirloop_sse, worm y Wang-Landau cuántico.
Los cuatro métodos (excepto a veces Looper) pueden usarse para estudiar modelos de espín (no frustrados). Solo worm y, en ocasiones, dirloop_sse pueden usarse para modelos bosónicos.

- Looper: Solo utilizable para modelos con simetría de inversión en el espacio de espín (para modelos de Heisenberg, sin campo magnético). `Looper` tiene el rango de aplicabilidad más pequeño, pero cuando es aplicable, muestra el mejor rendimiento (menor tiempo de autocorrelación).
- dirloop_sse: Representación de expansión en series estocásticas, usando bucles dirigidos (esencialmente worms). Bueno para modelos de espín con anisotropía que rompe la simetría de inversión en el espacio de espín, por ejemplo, modelos de Heisenberg en un campo magnético. También es bueno para bosones de núcleo duro, con como máximo un bosón por sitio. Extremadamente ineficiente para modelos de bosones de núcleo blando, donde unos pocos bosones en un sitio dan un término U muy grande en el hamiltoniano. Puede medir la función de Green.
- Worm: Representación de integral de camino, usando worms. Bueno para modelos de Bose-Hubbard y para modelos de espín en campos muy intensos. Puede simular modelos de Bose-Hubbard también con llenado no pequeño (fijando el parámetro N_max). [Si tiene una acción no local en el tiempo, la representación de integral de camino del algoritmo worm es un buen punto de partida para escribir su propio código.]
- Wang-Landau cuántico: Bueno para cálculos de energía libre y entropía.


