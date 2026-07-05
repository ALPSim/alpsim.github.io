
---
title: Diagonalización Dispersa
math: true
weight: 3
---

La matriz hamiltoniana en mecánica cuántica para sistemas con interacciones locales es dispersa, es decir, la mayoría de sus elementos son cero. Almacenar y manipular matrices densas de tamaño $N \times N$ requiere $O(N^2)$ de memoria y $O(N^3)$ de tiempo computacional para la diagonalización. Para $N$ grande, esto se vuelve inviable. El método de Lanczos está diseñado para aprovechar esta dispersión, requiriendo solo productos matriz-vector en lugar de almacenamiento o manipulación explícita de la matriz.

El [método de Lanczos](lanczos) es un algoritmo potente para encontrar unos pocos autovalores extremos y sus correspondientes autovectores de matrices grandes y dispersas. Es particularmente útil para redes cuánticas, donde los sistemas suelen describirse mediante matrices de alta dimensión que son demasiado grandes para tratar con técnicas de matrices densas. El método de Lanczos explota la dispersión de estas matrices para calcular eficientemente los autovalores y autovectores deseados.

También se discute la [implementación de la diagonalización dispersa en ALPS](implem). 
