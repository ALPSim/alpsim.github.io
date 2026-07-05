
---
title: Algoritmo de Lanczos
math: true
weight: 1
---

El método de Lanczos es un algoritmo iterativo que reduce una matriz simétrica $A$ de tamaño $N \times N$ a una matriz tridiagonal $T$ de tamaño $m \times m$, donde $m \ll N$. Los autovalores de $T$ aproximan los autovalores extremos de $A$, y los autovectores correspondientes pueden reconstruirse.

### Pasos Clave del Método de Lanczos

1. **Inicialización**:
   - Elegir un vector inicial aleatorio $v_1$ de norma unitaria.
   - Fijar $\beta_0 = 0$ y $v_0 = 0$.

2. **Iteración**:
   Para $j = 1, 2, \dots, m$:
   - Calcular $w = A v_j - \beta_{j-1} v_{j-1}$.
   - Calcular $\alpha_j = v_j^\top w$.
   - Calcular $w = w - \alpha_j v_j$.
   - Calcular $\beta_j = \|w\|$.
   - Si $\beta_j = 0$, detener; en caso contrario, fijar $v_{j+1} = w / \beta_j$.

3. **Matriz Tridiagonal**:
   Después de $m$ iteraciones, la matriz $T$ se construye como:
   $$
   T = \begin{pmatrix}
   \alpha_1 & \beta_1 & 0 & \dots & 0 \\\
   \beta_1 & \alpha_2 & \beta_2 & \dots & 0 \\\
   0 & \beta_2 & \alpha_3 & \dots & 0 \\\
   \vdots & \vdots & \vdots & \ddots & \beta_{m-1} \\\
   0 & 0 & 0 & \beta_{m-1} & \alpha_m
   \end{pmatrix}
   $$

4. **Diagonalización de $T$**:
   - Diagonalizar $T$ usando técnicas estándar de matrices densas (p. ej., el algoritmo QR).
   - Los autovalores de $T$ aproximan los autovalores extremos de $A$.
   - Los autovectores correspondientes de $A$ pueden reconstruirse a partir de los vectores de Lanczos $v_j$.

### Ventajas del Método de Lanczos

1. **Eficiencia**:
   - Solo se requieren productos matriz-vector, lo que lo hace adecuado para matrices dispersas.
   - El uso de memoria es $O(N \cdot m)$ en lugar de $O(N^2)$.

2. **Escalabilidad**:
   - Funciona bien para matrices muy grandes donde los métodos densos son inviables.

3. **Enfoque en Autovalores Extremos**:
   - El método de Lanczos es particularmente eficaz para encontrar los autovalores más grandes o más pequeños y sus autovectores.

### Desafíos y Consideraciones

1. **Pérdida de Ortogonalidad**:
   - En aritmética de precisión finita, los vectores de Lanczos $v_j$ pueden perder ortogonalidad, dando lugar a autovalores espurios.
   - Entre los remedios se incluyen la reortogonalización o el uso de variantes más avanzadas como el **Método de Lanczos Reiniciado Implícitamente**.

2. **Elección de $m$**:
   - El número de iteraciones $m$ debe elegirse cuidadosamente para equilibrar precisión y costo computacional.

3. **Convergencia**:
   - La convergencia hacia los autovalores extremos suele ser rápida, pero los autovalores interiores pueden requerir muchas iteraciones.
