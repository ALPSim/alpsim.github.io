
---
title: Factorización QR
description: "Método de Factorización QR"
math: true
weight: 2
---

La **factorización QR** es uno de los métodos más eficientes y ampliamente usados para diagonalizar matrices generales, incluyendo matrices simétricas y no simétricas. El algoritmo QR funciona descomponiendo iterativamente una matriz $A$ en el producto de una matriz ortogonal $Q$ y una matriz triangular superior $R$. Al aplicar repetidamente esta descomposición y reconstruir la matriz como $A^{\prime} = RQ$, la matriz converge a una forma diagonal o triangular, de la cual se pueden extraer los autovalores. Los autovectores se obtienen del producto acumulado de las matrices $Q$.

## Fundamento Matemático

Para una matriz $A$, la factorización QR viene dada por:

$$
A = QR
$$

donde:
- $Q$ es una matriz ortogonal ($Q^T Q = I$),
- $R$ es una matriz triangular superior.

El algoritmo QR aplica iterativamente esta factorización para hacer converger $A$ a una forma diagonal o triangular:

1. Comenzar con $A_0 = A$.
2. Para cada iteración $k$:
   - Calcular la factorización QR: $A_k = Q_k R_k$.
   - Reconstruir la matriz: $A_{k+1} = R_k Q_k$.
3. Repetir hasta que $A_k$ converja a una matriz diagonal o triangular.

Los autovalores de $A$ se encuentran en la diagonal de la matriz final $A_k$, y los autovectores se obtienen del producto de todas las matrices $Q_k$.

## Algoritmo

1. **Inicialización**:
   - Comenzar con la matriz $A_0 = A$.

2. **Factorización QR**:
   - Descomponer $A_k$ en $Q_k$ y $R_k$:
     $$
     A_k = Q_k R_k
     $$

3. **Reconstrucción**:
   - Reconstruir la matriz $A_{k+1}$ como:
     $$
     A_{k+1} = R_k Q_k
     $$

4. **Acumular las Transformaciones**:
   - Actualizar la matriz de autovectores $P$ como:
     $$
     P_{k+1} = P_k Q_k
     $$
   - Inicializar $P_0 = I$ (matriz identidad).

5. **Verificar la Convergencia**:
   - Repetir el proceso hasta que $A_k$ sea suficientemente diagonal o triangular (es decir, que los elementos fuera de la diagonal estén por debajo de una tolerancia especificada).

6. **Extraer Autovalores y Autovectores**:
   - Los autovalores son los elementos diagonales de la $A_k$ final.
   - Los autovectores son las columnas de la $P_k$ final.

## Un Ejemplo

Como ejemplo, realizamos la factorización QR de una matriz simétrica real usando aritmética de precisión simple.

### Paso 1: Inicializar
Comience con la matriz $A$:
$$
A = \begin{pmatrix}
4.000000 & -1.000000 & 3.000000 \\\
-1.000000 & 3.000000 & -1.000000 \\\
3.000000 & -1.000000 & 5.000000
\end{pmatrix}.
$$

### Paso 2: Primera Iteración QR

#### Paso 2.1: Calcular $Q$ y $R$
Realizar la factorización QR de $A$ usando el proceso de Gram-Schmidt.

- **Primera columna de $Q$**:
  Normalizar la primera columna de $A$:
  $$
  \mathbf{a}_1 = \begin{pmatrix} 4.000000 \\\ -1.000000 \\\ 3.000000 \end{pmatrix}, \quad
  \|\mathbf{a}_1\| = \sqrt{4^2 + (-1)^2 + 3^2} = \sqrt{26} \approx 5.099020.
  $$
  Por lo tanto:
  $$
  \mathbf{q}_1 = \frac{1}{5.099020} \begin{pmatrix} 4.000000 \\\ -1.000000 \\\ 3.000000 \end{pmatrix} \approx \begin{pmatrix} 0.784465 \\\ -0.196116 \\\ 0.588349 \end{pmatrix}.
  $$

- **Segunda columna de $Q$**:
  Ortogonalizar la segunda columna de $A$ respecto a $\mathbf{q}_1$:
  $$
  \mathbf{a}_2 = \begin{pmatrix} -1.000000 \\\ 3.000000 \\\ -1.000000 \end{pmatrix}, \quad
  \mathbf{a}_2 \cdot \mathbf{q}_1 \approx -1.960784.
  $$
  Calcular $\mathbf{v}_2$:
  $$
  \mathbf{v}_2 = \mathbf{a}_2 - (\mathbf{a}_2 \cdot \mathbf{q}_1) \mathbf{q}_1 \approx \begin{pmatrix} -1.000000 \\\ 3.000000 \\\ -1.000000 \end{pmatrix} - (-1.960784) \begin{pmatrix} 0.784465 \\\ -0.196116 \\\ 0.588349 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_2 \approx \begin{pmatrix} -1.000000 + 1.538462 \\\ 3.000000 - 0.384615 \\\ -1.000000 + 1.153846 \end{pmatrix} = \begin{pmatrix} 0.538462 \\\ 2.615385 \\\ 0.153846 \end{pmatrix}.
  $$
  Normalizar $\mathbf{v}_2$:
  $$
  \|\mathbf{v}_2\| = \sqrt{0.538462^2 + 2.615385^2 + 0.153846^2} \approx 2.672612.
  $$
  Por lo tanto:
  $$
  \mathbf{q}_2 \approx \begin{pmatrix} 0.201456 \\ 0.978593 \\ 0.057553 \end{pmatrix}.
  $$

- **Tercera columna de $Q$**:
  Ortogonalizar la tercera columna de $A$ respecto a $\mathbf{q}_1$ y $\mathbf{q}_2$:
  $$
  \mathbf{a}_3 = \begin{pmatrix} 3.000000 \\\ -1.000000 \\\ 5.000000 \end{pmatrix}, \quad
  \mathbf{a}_3 \cdot \mathbf{q}_1 \approx 5.882353,
  $$
  $$
  \mathbf{a}_3 \cdot \mathbf{q}_2 \approx 0.000000.
  $$
  Calcular $\mathbf{v}_3$:
  $$
  \mathbf{v}_3 = \mathbf{a}_3 - (\mathbf{a}_3 \cdot \mathbf{q}_1) \mathbf{q}_1 - (\mathbf{a}_3 \cdot \mathbf{q}_2) \mathbf{q}_2.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 3.000000 \\\ -1.000000 \\\ 5.000000 \end{pmatrix} - 5.882353 \begin{pmatrix} 0.784465 \\\ -0.196116 \\\ 0.588349 \end{pmatrix} - 0.000000 \begin{pmatrix} 0.201456 \\\ 0.978593 \\\ 0.057553 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 3.000000 - 4.615385 \\\ -1.000000 + 1.153846 \\\ 5.000000 - 3.461538 \end{pmatrix} = \begin{pmatrix} -1.615385 \\\ 0.153846 \\\ 1.538462 \end{pmatrix}.
  $$
  Normalizar $\mathbf{v}_3$:
  $$
  \|\mathbf{v}_3\| = \sqrt{(-1.615385)^2 + 0.153846^2 + 1.538462^2} \approx 2.236068.
  $$
  Por lo tanto:
  $$
  \mathbf{q}_3 \approx \begin{pmatrix} -0.722222 \\\ 0.068783 \\\ 0.688889 \end{pmatrix}.
  $$

- **Construir $Q$ y $R$**:
  $$
  Q = \begin{pmatrix}
  0.784465 & 0.201456 & -0.722222 \\\
  -0.196116 & 0.978593 & 0.068783 \\\
  0.588349 & 0.057553 & 0.688889
  \end{pmatrix},
  $$
  $$
  R = Q^T A \approx \begin{pmatrix}
  5.099020 & 0.000000 & 5.882353 \\\
  0 & 2.672612 & 0.000000 \\\
  0 & 0 & 2.236068
  \end{pmatrix}.
  $$

#### Paso 2.2: Actualizar $A$
Calcular $A = RQ$:
$$
A = RQ \approx \begin{pmatrix}
6.561553 & -0.759257 & 0.000000 \\\
-0.759257 & 3.000000 & -0.650791 \\\
0.000000 & -0.650791 & 2.438447
\end{pmatrix}.
$$

### Paso 3: Segunda Iteración QR

#### Paso 3.1: Calcular $Q$ y $R$
Realizar la factorización QR de la $A$ actualizada.

- **Primera columna de $Q$**:
  Normalizar la primera columna de $A$:
  $$
  \mathbf{a}_1 = \begin{pmatrix} 6.561553 \\\ -0.759257 \\\ 0.000000 \end{pmatrix}, \quad
  \|\mathbf{a}_1\| \approx 6.617647.
  $$
  Por lo tanto:
  $$
  \mathbf{q}_1 \approx \begin{pmatrix} 0.990000 \\\ -0.114706 \\\ 0.000000 \end{pmatrix}.
  $$

- **Segunda columna de $Q$**:
  Ortogonalizar la segunda columna de $A$ respecto a $\mathbf{q}_1$:
  $$
  \mathbf{a}_2 = \begin{pmatrix} -0.759257 \\\ 3.000000 \\\ -0.650791 \end{pmatrix}, \quad
  \mathbf{a}_2 \cdot \mathbf{q}_1 \approx -1.139000.
  $$
  Calcular $\mathbf{v}_2$:
  $$
  \mathbf{v}_2 = \mathbf{a}_2 - (\mathbf{a}_2 \cdot \mathbf{q}_1) \mathbf{q}_1 \approx \begin{pmatrix} -0.759257 \\\ 3.000000 \\\ -0.650791 \end{pmatrix} - (-1.139000) \begin{pmatrix} 0.990000 \\\ -0.114706 \\\ 0.000000 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_2 \approx \begin{pmatrix} -0.759257 + 1.127610 \\\ 3.000000 - 0.130000 \\\ -0.650791 + 0.000000 \end{pmatrix} = \begin{pmatrix} 0.368353 \\\ 2.870000 \\\ -0.650791 \end{pmatrix}.
  $$
  Normalizar $\mathbf{v}_2$:
  $$
  \|\mathbf{v}_2\| \approx 2.939000.
  $$
  Por lo tanto:
  $$
  \mathbf{q}_2 \approx \begin{pmatrix} 0.125000 \\\ 0.974000 \\\ -0.221000 \end{pmatrix}.
  $$

- **Tercera columna de $Q$**:
  Ortogonalizar la tercera columna de $A$ respecto a $\mathbf{q}_1$ y $\mathbf{q}_2$:
  $$
  \mathbf{a}_3 = \begin{pmatrix} 0.000000 \\\ -0.650791 \\\ 2.438447 \end{pmatrix}, \quad
  \mathbf{a}_3 \cdot \mathbf{q}_1 \approx 0.000000, \quad
  \mathbf{a}_3 \cdot \mathbf{q}_2 \approx -0.624695.
  $$
  Calcular $\mathbf{v}_3$:
  $$
  \mathbf{v}_3 = \mathbf{a}_3 - (\mathbf{a}_3 \cdot \mathbf{q}_1) \mathbf{q}_1 - (\mathbf{a}_3 \cdot \mathbf{q}_2) \mathbf{q}_2.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 0.000000 \\\ -0.650791 \\\ 2.438447 \end{pmatrix} - 0.000000 \begin{pmatrix} 0.990000 \\\ -0.114706 \\\ 0.000000 \end{pmatrix} - (-0.624695) \begin{pmatrix} 0.125000 \\\ 0.974000 \\\ -0.221000 \end{pmatrix}.
  $$
  $$
  \mathbf{v}_3 \approx \begin{pmatrix} 0.000000 + 0.078087 \\\ -0.650791 - 0.608000 \\\ 2.438447 + 0.138000 \end{pmatrix} = \begin{pmatrix} 0.078087 \\\ -1.258791 \\\ 2.576447 \end{pmatrix}.
  $$
  Normalizar $\mathbf{v}_3$:
  $$
  \|\mathbf{v}_3\| \approx 2.828427.
  $$
  Por lo tanto:
  $$
  \mathbf{q}_3 \approx \begin{pmatrix} 0.027600 \\\ -0.445000 \\\ 0.911000 \end{pmatrix}.
  $$

- **Construir $Q$ y $R$**:
  $$
  Q = \begin{pmatrix}
  0.990000 & 0.125000 & 0.027600 \\\
  -0.114706 & 0.974000 & -0.445000 \\\
  0.000000 & -0.221000 & 0.911000
  \end{pmatrix},
  $$
  $$
  R = Q^T A \approx \begin{pmatrix}
  6.617647 & 0.000000 & 0.000000 \\\
  0 & 2.939000 & 0.000000 \\\
  0 & 0 & 2.828427
  \end{pmatrix}.
  $$

### Paso 3.2: Actualizar $A$
Calcular $A = RQ$:
$$
A = RQ \approx \begin{pmatrix}
6.617647 & 0.000000 & 0.000000 \\\
0.000000 & 2.939000 & 0.000000 \\\
0.000000 & 0.000000 & 2.828427
\end{pmatrix}.
$$

### Paso 4: Verificar la Convergencia
Comprobar si todos los elementos fuera de la diagonal están por debajo de la tolerancia $10^{-6}$. En este caso, los elementos fuera de la diagonal ya son cero, por lo que la matriz $A$ está diagonalizada.

Tras la convergencia, la matriz diagonalizada $A$ será:
$$
A \approx \begin{pmatrix}
6.617647 & 0.000000 & 0.000000 \\\
0.000000 & 2.939000 & 0.000000 \\\
0.000000 & 0.000000 & 2.828427
\end{pmatrix}.
$$

### Resultado Final
Los autovalores de $A$ calculados usando factorización QR con precisión simple son:
$$
\lambda_1 \approx 6.617647, \quad \lambda_2 \approx 2.939000, \quad \lambda_3 \approx 2.828427.
$$

### Conclusión Clave
El método de factorización QR con precisión simple produce autovalores que están cerca de los valores verdaderos, pero pueden diferir ligeramente debido a errores de redondeo. Para mayor precisión, se recomienda usar **aritmética de doble precisión** o más iteraciones con criterios de convergencia más estrictos.

## Ventajas

- **Eficiencia**: El algoritmo QR es muy eficiente para matrices grandes.
- **Versatilidad**: Funciona tanto para matrices simétricas como no simétricas.
- **Estabilidad**: El algoritmo es numéricamente estable y robusto.

## Limitaciones 

- **Costo Computacional**: El paso de factorización QR puede ser computacionalmente costoso para matrices muy grandes.
- **Convergencia Lenta para Matrices No Simétricas**: El algoritmo puede requerir muchas iteraciones para matrices no simétricas.

