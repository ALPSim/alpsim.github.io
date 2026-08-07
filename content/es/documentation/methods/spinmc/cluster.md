
---
title: Actualizaciones de Cluster
math: true
weight: 3
---

Cerca de la temperatura crítica $T_c$ de un sistema, el sistema exhibe correlaciones de largo alcance, y los métodos de actualización local se vuelven ineficientes debido al enlentecimiento crítico (critical slowing down). Las propuestas de actualización local son rechazadas casi siempre durante la simulación, y el sistema parece quedar atrapado en una configuración de estado específica. Los algoritmos de actualización de cluster abordan este problema invirtiendo grandes clusters de espines en un solo paso, permitiendo que el sistema explore el espacio de configuraciones de manera más eficaz.

## Algoritmo de Wolff

El algoritmo de Wolff es un método de actualización de cluster diseñado para superar el enlentecimiento crítico en el modelo de Ising. Construye clusters de espines según su alineación y los invierte colectivamente, garantizando un muestreo eficiente cerca de la temperatura crítica.

### Pasos Clave del Algoritmo de Wolff:
1. **Elegir un Espín Semilla**:
   - Seleccionar aleatoriamente un espín semilla $s_i^z$ de la red.

2. **Construir el Cluster**:
   - Para cada vecino $s_j^z$ del espín semilla, añadirlo al cluster con probabilidad:
     $$
     P_{\text{add}} = 1 - e^{-2 \beta J},
     $$
     si $s_j^z = s_i^z$. Esta probabilidad depende de la temperatura y de la intensidad de interacción $J$.

3. **Invertir el Cluster**:
   - Una vez construido el cluster, invertir todos los espines del cluster (es decir, $s_i^z \to -s_i^z$ para todos los espines del cluster).

4. **Repetir**:
   - Repetir el proceso durante muchos pasos de Monte Carlo para asegurar un muestreo adecuado del espacio de configuraciones.

### Ventajas del Algoritmo de Wolff:
- **Eficiencia**: El algoritmo de Wolff reduce significativamente el enlentecimiento crítico al invertir grandes clusters de espines simultáneamente.
- **Balance Detallado**: El algoritmo satisface el balance detallado, garantizando que el sistema evolucione hacia la distribución de equilibrio correcta.
- **Sin Ajuste**: A diferencia del algoritmo de Metropolis-Hastings, el algoritmo de Wolff no requiere ajustar parámetros como el tamaño del paso.


## Algoritmo de Wang-Landau

El algoritmo de Wang-Landau es un método de Monte Carlo que estima directamente la densidad de estados $g(E)$ de un sistema, permitiendo el cálculo de cantidades termodinámicas en un amplio rango de energías y temperaturas. Es particularmente útil para sistemas con paisajes energéticos complejos.

### Pasos Clave del Algoritmo de Wang-Landau:
1. **Inicializar la Densidad de Estados**:
   - Comenzar con una estimación aproximada de la densidad de estados $g(E)$, típicamente fijada en $1$ para todas las energías.

2. **Realizar Caminatas Aleatorias en el Espacio de Energías**:
   - Usar un proceso de Monte Carlo (p. ej., actualizaciones de Metropolis o de Wolff) para explorar el espacio de energías. Aceptar movimientos con probabilidad:
     $$
     P_{E_1 \to E_2} = \min\left(1, \frac{g(E_1)}{g(E_2)}\right).
     $$

3. **Actualizar la Densidad de Estados**:
   - Después de cada movimiento, actualizar la densidad de estados:
     $$
     g(E) \to g(E) \cdot f,
     $$
     donde $f > 1$ es un factor de modificación (inicialmente $f = e$).

4. **Refinar la Estimación**:
   - Repetir el proceso, reduciendo gradualmente el factor de modificación $f$ (p. ej., $f \to \sqrt{f}$) hasta que $g(E)$ converja a la densidad de estados verdadera.

5. **Calcular Cantidades Termodinámicas**:
   - Una vez conocido $g(E)$, se pueden calcular cantidades termodinámicas como la función de partición, la energía libre, y el calor específico.

### Ventajas del Algoritmo de Wang-Landau:
- **Estimación Directa de $g(E)$**: El algoritmo proporciona una forma directa de calcular la densidad de estados, permitiendo el estudio de propiedades termodinámicas en un amplio rango de temperaturas.
- **Eficiencia**: El algoritmo de Wang-Landau es particularmente eficaz para sistemas con paisajes energéticos complejos, donde los métodos tradicionales pueden tener dificultades.
- **No Requiere Conocimiento Previo**: El algoritmo no requiere conocimiento previo de la distribución de energía del sistema.

