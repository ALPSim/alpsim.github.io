
---
title: Diagonalización Exacta
description: "Tutoriales para ALPS"
toc: true
weight: 2
math: true
---

Los tutoriales de diagonalización exacta de ALPS cubren las aplicaciones `sparsediag` y `fulldiag` para modelos cuánticos de red finitos.
`sparsediag` utiliza el algoritmo iterativo de Lanczos para calcular los autoestados más bajos en cada sector de simetría ($S_z$ total, momento, ...), mientras que `fulldiag` diagonaliza el hamiltoniano completo para obtener el espectro completo y, a partir de él, la termodinámica a temperatura finita.
Dado que ambos métodos trabajan directamente con la matriz del hamiltoniano, los resultados son numéricamente exactos —libres de los errores estadísticos y del problema del signo que limitan al Monte Carlo cuántico— al precio de un espacio de Hilbert que crece exponencialmente y restringe los tamaños de sistema accesibles a, como mucho, unas pocas decenas de sitios.
Los tutoriales avanzan desde medidas básicas sobre autoestados, pasando por el escalamiento de tamaño finito de gaps de excitación y espectros completos, hasta la identificación de transiciones de fase cuánticas y su descripción mediante teoría de campos conforme, y finalmente hasta la diagonalización completa para obtener cantidades termodinámicas de sistemas finitos.

## Diagonalización Dispersa (`sparsediag`)

El código `sparsediag` encuentra los autoestados más bajos de un hamiltoniano cuántico mediante el algoritmo de Lanczos, trabajando sector por sector en los números cuánticos conservados.
Estos tutoriales presentan las medidas personalizadas disponibles sobre los autoestados calculados, y luego las utilizan para extraer gaps de excitación y espectros completos de baja energía de cadenas y escaleras de espín unidimensionales.

- [ED-01 Diagonalización Dispersa (Lanczos)](ed01) — configura `sparsediag` para una pequeña cadena de Heisenberg S=1 y muestra cómo definir y leer medidas personalizadas —funciones de correlación y el factor de estructura estático— sobre los autoestados calculados, tanto desde la línea de comandos como desde Python.
- [ED-02 Gaps de espín en sistemas cuánticos 1D](ed02) — calcula el gap singlete-triplete de la cadena de Heisenberg S=1 diagonalizando sectores $S_z$ separados, y estudia cómo el gap se extrapola con la longitud de la cadena para revelar el gap de Haldane en el límite termodinámico.
- [ED-03 Espectros de sistemas cuánticos 1D](ed03) — calcula el espectro de baja energía resuelto en momento de la cadena de Heisenberg, de una escalera de Heisenberg de dos patas, y de un sistema de dímeros aislados, ilustrando cómo la geometría de la red determina el espectro de excitaciones.

## Teoría de Campos Conforme y Criticidad Cuántica

En un punto crítico cuántico, el espectro de tamaño finito de un modelo de red 1D codifica el contenido de operadores de la teoría de campos conforme (CFT) subyacente: los gaps de energía escalan como $1/L$ con amplitudes universales fijadas por las dimensiones de escala de los operadores de la CFT.
Estos tutoriales usan `sparsediag` para extraer ese contenido de operadores directamente de los espectros de tamaño finito, y lo utilizan para localizar y caracterizar una transición de fase cuántica.

- [ED-04 Descripción mediante teoría de campos conforme de los espectros críticos 1D](ed04) — calcula los espectros de tamaño finito de la cadena de Ising crítica con campo transverso y de la cadena de Heisenberg crítica, y compara las dimensiones de escala extraídas con los campos primarios de la CFT conocidos y sus descendientes.
- [ED-05 Transición de fase en una cadena de espín frustrada](ed05) — añade un acoplamiento a segundos vecinos $J_2$ a la cadena de Heisenberg y localiza el punto crítico que separa las fases sin gap y dimerizada (Majumdar-Ghosh) siguiendo los cruces de niveles y los gaps en distintos sectores de simetría, y luego revisita el contenido de la CFT exactamente en el punto crítico.

## Diagonalización Completa (`fulldiag`)

El código `fulldiag` calcula el espectro completo de un hamiltoniano finito, a partir del cual se obtienen directamente, sumando sobre todos los autoestados y sin ninguna incertidumbre estadística, las cantidades termodinámicas exactas a temperatura finita —energía, calor específico, susceptibilidad.

- [ED-06 Diagonalización Completa](ed06) — calcula la termodinámica de cadenas y escaleras de Heisenberg S=1, de pequeñas moléculas magnéticas incluyendo dímeros acoplados y el complejo molecular $V_{15}$, y, como ejercicio adicional, del modelo de Hubbard en una pequeña red cuadrada.
