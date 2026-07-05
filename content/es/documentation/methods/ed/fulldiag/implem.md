
---
title: Implementación 
math: true
weight: 3
---

## Introducción

El paquete `fulldiag` usa la biblioteca LAPACK para realizar una diagonalización completa del hamiltoniano. Por lo tanto, puede usarse para calcular propiedades termodinámicas de cualquier modelo que pueda definirse usando las bibliotecas de ALPS. La principal limitación es el tamaño, es decir, la memoria y el tiempo de CPU pueden volverse inaceptables en tamaños en los que otras aplicaciones más especializadas todavía funcionan bien.

La versión 1.3 permite el cálculo de propiedades magnéticas o de carga para modelos con un acoplamiento a una cantidad conservada de la forma $-hS_z$ o $-\mu N$, es decir, un SITETERM $-h S_z(i)$ o $-\mu n(i)$. De hecho, la adaptación a otras situaciones con un acoplamiento a una cantidad conservada debería ser relativamente sencilla cambiando unas pocas líneas en el archivo fuente fulldiag.h (esto simplemente no se admite por el momento, ya que requiere que el usuario modifique al menos 5 cadenas). Si la cantidad conservada no está presente, se evaluarán dos cantidades menos (véase más abajo).

**Advertencia:** Se pueden obtener resultados incorrectos si la supuesta cantidad conservada en realidad no conmuta con el hamiltoniano. También se obtendrán en general resultados incorrectos si los coeficientes no tienen la forma anterior, y el campo magnético $h$ o el potencial químico $\mu$ son cambiados por `fulldiag_evaluate`.


## Ejecutar un cálculo

se discute en el tutorial de `fulldiag`. Después de obtener el espectro completo usando el programa `fulldiag`, el programa de evaluación `fulldiag_evaluate` puede usarse para producir eficientemente archivos XML de gráficos de las propiedades termodinámicas así como magnéticas, especificadas más abajo.

### Parámetros de entrada

Los parámetros para la aplicación `fulldiag` se describen todos entre los parámetros de entrada comunes (nótese en particular los parámetros adicionales para la diagonalización exacta).
Los siguientes parámetros adicionales solo los usa `fulldiag_evaluate`:

| **Parámetro** | **Valor por defecto** | **Significado** |
| :------------ | :---------- | :---------- |
| T_MIN |  | temperatura más baja para la que se calculan los observables |
| T_MAX |  | temperatura más alta para la que se calculan los observables |
| DELTA_T | | ancho del paso de temperatura |
| couple | | couple mu cambia el acoplamiento por defecto de $-h S_z$ a $-\ mu N$. También cambia el significado de otros pocos parámetros y cantidades (véase más abajo). |
| H_MIN (MU_MIN) | | campo magnético más bajo (potencial químico si se especifica --couple mu) para el que se calculan los observables |
| H_MAX (MU_MAX) | | campo magnético más alto (potencial químico si se especifica --couple mu) para el que se calculan los observables |
| DELTA_H (DELTA_MU) | | ancho del paso de campo magnético (ancho del paso de potencial químico si se especifica --couple mu) |
| versus | | versus h (versus mu si se especifica --couple mu) coloca el campo magnético (potencial químico) en el eje $x$ en lugar de la temperatura |
| MEASURE_MAGNETIC_PROPERTIES (MEASURE_CHARGE_PROPERTIES) | 1 | activa (1) o desactiva (0) la evaluación de propiedades magnéticas (o de carga) (véase más abajo). Recuerde que con la versión actual de `fulldiag`, tales mediciones solo son posibles para modelos con un $S_z$ o $N$ total conservado. También debe especificarse un CONSERVED_QUANTUMNUMBERS=... correspondiente en los parámetros de `fulldiag`. |
| DENSITIES | 1 | especifica si normalizar las cantidades por sitio (1) o para el sistema total (0) |

Todos estos parámetros pueden sobrescribirse mediante el argumento de línea de comandos con el mismo nombre.

## Evaluación de propiedades termodinámicas

El programa `fulldiag_evaluate` toma un archivo de salida XML de `fulldiag`,

    fulldiag_evaluate [--T_MIN ...] [--T_MAX ...] [--DELTA_T ...]
        [--H_MIN ...] [--H_MAX ... ] [--DELTA_H ... ] [--versus h]
        [--DENSITIES ...] inputfile [outputfileprefix]</tt>

o

    fulldiag_evaluate --couple mu [--T_MIN ...] [--T_MAX ...] [--DELTA_T ...]
        [--MU_MIN ...] [--MU_MAX ... ] [--DELTA_MU ...] [--versus mu]
        [--DENSITIES ...] inputfile [outputfileprefix]</tt>

Se pueden especificar dos rangos opcionales para la temperatura (T_MIN, T_MAX, DELTA_T) y el campo magnético (H_MIN, H_MAX, DELTA_H) o el potencial químico (MU_MIN, MU_MAX, DELTA_MU). `fulldiag_evaluate` produce archivos XML de gráficos (`outputfileprefix.plot.energy.xml`, etc., donde outputfileprefix se deriva del nombre del archivo de entrada si no se especifica) para las siguientes cantidades en función de la temperatura:

- Energía [Densidad]
- Energía Libre [Densidad]
- Entropía [Densidad]
- Calor Específico [Densidad]
- Magnetización [Densidad] (si MEASURE_MAGNETIC_PROPERTIES=1, y sin couple mu)
- Susceptibilidad Uniforme [Densidad] (si MEASURE_MAGNETIC_PROPERTIES=1, y sin couple mu)
- Número de Partículas [Densidad] (si MEASURE_CHARGE_PROPERTIES=1, y con couple mu)
- Compresibilidad [Densidad] (si MEASURE_CHARGE_PROPERTIES=1, y con couple mu)

Nótese que las cantidades se muestran como densidades, es decir, normalizadas al número de sitios si el parámetro DENSITIES=1, mientras que la salida es para el sistema total si DENSITIES=0. Por defecto, los gráficos se producen con la temperatura en el eje $x$. Use el argumento --versus h (--versus mu) para obtener gráficos con el campo magnético (potencial químico) en el eje $x$

`fulldiag` almacena información que incluye los autovalores y un resultado para las cantidades físicas accesibles (medidas para el sistema total). Estas son de interés principalmente para especialistas y, esperamos, autoexplicativas si es necesario.

## Colaboradores

Las siguientes personas han contribuido a la aplicación `fulldiag`:

- Matthias Troyer
- Andreas Honecker 


