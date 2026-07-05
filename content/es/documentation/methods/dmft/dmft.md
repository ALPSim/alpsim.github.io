
---
title: Teoría de Campo Medio Dinámico y Solvers de Impureza
math: true
weight: 9
---

## Lista de Parámetros

### Parámetros físicos

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| U | la interacción de Hubbard U |
| BETA | la temperatura inversa |
| MU | el potencial químico |
| H | el campo magnético en la dirección del eje de cuantización (convencionalmente $z$) (PERO: ¡los solvers ignoran esta variable!) |
| SITES | número de sitios de impureza (para DMFT: 1) |
| FLAVORS | número de sabores/orbitales de la impureza (comúnmente 2: espín arriba/abajo) |
| t | en el caso de la red de Bethe proporciona el hopping (el ancho de banda es entonces $W=4t$, el medio ancho de banda es $D=2t$); si la opción TWODBS está activada, entonces fija el hopping a primeros vecinos en la red cuadrada o hexagonal |
| t0, t1, ... | (disponible actualmente solo para el bucle de autoconsistencia en tiempo imaginario) fija el hopping para la red de Bethe en el caso multibanda (los sabores 2i y 2i+1 comparten el mismo parámetro ti) |
| J | acoplamiento para los problemas multibanda |
| U' | (por defecto U-2J) |
| tprime | se aplica solo si la opción TWODBS está activada y solo para la red cuadrada, entonces fija el hopping a segundos vecinos |
| TWODBS | (por defecto fija la red cuadrada) puede elegir entre red cuadrada o hexagonal |

### Parámetros para el bucle de autoconsistencia

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| OMEGA_LOOP | fíjelo en 1 a menos que quiera trabajar con una densidad de estados semicircular (correspondiente a la red de Bethe en infinitas dimensiones) |
| ANTIFERROMAGNET | si es 1, se empleará el bucle de autoconsistencia antiferromagnético (fórmula 97 en la revisión de 1996 de A. Georges et al) |
|SYMMETRIZATION | si es 1, se impone la solución paramagnética (en versiones anteriores a la 2.1: hubo un error de ortografía, SYMMATRIZATION, en varios lugares, y se requería usar tanto SYMMETRIZATION como SYMMATRIZATION fijados al mismo valor) |
| MAX_IT | número máximo de iteraciones en el bucle de autoconsistencia (normalmente 10-20 son suficientes) |
| CONVERGED | criterio para detener el bucle de autoconsistencia antes de alcanzar MAX_IT: si el cambio máximo en la función de Green en la representación de Matsubara es menor que CONVERGED, el bucle se detendrá |
| TOLERANCE | (solo para hirschfyesim) igual que arriba |
| RELAX_RATE | (por defecto 1; actualmente implementado solo para el bucle de autoconsistencia con OMEGA_LOOP activado) las nuevas funciones de Green se calculan en general como RELAX_RATE \* $G_{new}(i\omega_n)$ + (1-RELAX_RATE) \* $G_{old}(i\omega_n)$, lo cual puede ayudar si se producen oscilaciones |

### Parámetros generales

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| GENERAL_FOURIER_TRANFORMER | actívelo si tiene OMEGA_LOOP y una red distinta de la de Bethe |
| EPS_i (i=0,1,...,FLAVORS-1) | desplazamiento de potencial para el sabor i (necesario para GENERAL_FOURIER_TRANSFORMER) |
| EPSSQ_i (i=0,1,...,FLAVORS-1) | el segundo momento de la estructura de bandas para el sabor i (necesario para GENERAL_FOURIER_TRANSFORMER) |
| DOSFILE | fija el nombre del archivo que contiene la densidad de estados (se esperan 2 columnas con el valor de energía y la densidad de estados correspondiente a esa energía; se requieren energías equidistantes; se requiere un número impar de filas debido a la integración de Simpson) |
| TWODBS | activa la transformación de Hilbert para sistemas bidimensionales, actualmente compatible con la red cuadrada (con hoppings a primeros y segundos vecinos) y la red hexagonal (con hoppings a primeros vecinos) \[Nota: se puede añadir fácilmente una red bidimensional diferente\] |
| L | parámetro opcional disponible en caso de que TWODBS esté activado; define la mitad de la discretización lineal en la integración de la autoconsistencia (por defecto: 200) |
| SOLVER | especifica el solver de impureza ("Hybridization" o "Interaction Expansion"; el solver "Hirsch-Fye" sufre de errores de discretización y por lo tanto no se recomienda) |

### Parámetros para el campo de Weiss inicial/final

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| H_INIT | campo magnético en la dirección del eje de cuantización (convencionalmente $z$), que se usa en el cálculo de la G0 inicial no interactuante (si no se ha cargado) |
| G0OMEGA_INPUT | nombre del archivo de texto que especifica el campo de Weiss en frecuencias de Matsubara $i\omega_n$ (se esperan 1+FLAVORS columnas, y un total de NMATSUBARA filas, usar solo con OMEGA_LOOP) |
| G0TAU_INPUT | nombre del archivo de texto que especifica el campo de Weiss en la representación de tiempo imaginario (se esperan 1+FLAVORS columnas, y un total de $N+1$ filas, solo con OMEGA_LOOP desactivado) |
| GOMEGA_input | especifica el nombre del archivo de texto donde se escribirá la G0 inicial en la representación de Matsubara (por defecto no se escribe, ya que es idéntica a G0_omega_1) |
| G0TAU_input | nombre del archivo de texto para la salida de la G0 inicial en tiempo imaginario (por defecto no se escribe, ya que es idéntica a G0_tau_1) |
| G0OMEGA_output | nombre del archivo de salida que contiene el campo de Weiss final en frecuencias de Matsubara (por defecto G0omega_output) (con OMEGA_LOOP) |
| G0TAU_output | nombre del archivo de salida que contiene el campo de Weiss final en frecuencias de Matsubara (por defecto G0tau_output) (con OMEGA_LOOP desactivado) |
| INSULATING | si se especifica esta opción, la G0 inicial se establecerá en el límite aislante |

### Parámetros que fijan la precisión de la representación de la función de Green y el campo de Weiss

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| NMATSUBARA | número de frecuencias de Matsubara usadas para representar la función de Green y el campo de Weiss (normalmente igual a N) |
| N | número de bins para la función de Green y el campo de Weiss en tiempo imaginario (representados en total por N+1 valores) (recomendado: aproximadamente 1000 para los solvers de tiempo continuo) |

### Parámetros del solver de impureza por expansión de hibridación

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| MAX_TIME | fija el tiempo máximo, dado en segundos, dedicado a resolver el problema de impureza (básicamente fija la duración de una sola iteración) |
| SWEEPS | número de barridos deseados realizados durante el cálculo (recomendación: fíjelo muy alto, p. ej. $10^9$, y el solver se detendrá por el límite de tiempo dado por MAX_TIME) |
| THERMALIZATION | número de barridos antes de las mediciones de Monte Carlo para alcanzar una configuración cercana al equilibrio (del orden de 1000) |
| EPSSQAV | el segundo momento de la estructura de bandas (necesario si ha especificado su propio DOSFILE) |
| N_ORDER | fija el tamaño del histograma (si el orden de hibridación es mayor, no se almacenará en el histograma) (un valor del orden de 100 podría ser razonable) |
| N_MEAS | número de pasos de Monte Carlo entre mediciones (del orden de 10000) |
| N_SHIFT | número de desplazamientos de segmentos en un solo paso de Monte Carlo (aparentemente no se usa, así que 0) |
| MEASURE_FOURPOINT | si está activado, se miden los correladores de cuatro puntos |
| N4point | (solo se usa si MEASURE_FOURPOINT está activado) descripción aún no disponible |
| CHECKPOINT | prefijo del nombre de archivo para los archivos de checkpoint y para la salida final en h5 y xml |

### Parámetros del solver de impureza por expansión de interacción

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| MAX_TIME | fija el tiempo máximo, dado en segundos, dedicado a resolver el problema de impureza |
| SWEEPS | número de barridos deseados realizados durante el cálculo (recomendación: fíjelo muy alto, p. ej. $10^9$, y el solver se detendrá por el límite de tiempo dado por MAX_TIME) |
| THERMALIZATION | número de barridos antes de las mediciones de Monte Carlo para alcanzar una configuración cercana al equilibrio (del orden de 1000) |
| SWEEP_MULTIPLICATOR | (por defecto: 1) |
| NRUNS | (por defecto: 1) |
| ALPHA | |
| RECALC_PERIOD | (por defecto: 5000) |
| MEASUREMENT_PERIOD | (por defecto: 200) |
| CONVERGENCE_CHECK_PERIOD | (valor por defecto provisto) |
| ALMOSTZERO | (por defecto: $10^{-16}$) |
| NSELF | (por defecto: 10N) |
| NMATSUBARA_MEASUREMENTS | (por defecto: NMATSUBARA) |
| HISTOGRAM_MEASUREMENT | (por defecto: false) |
| GET_COMPACTED_MEASUREMENTS | |
| ATOMIC | |
| TAU_DISCRETIZATION_FOR_EXP | |
| CHECKPOINT | prefijo del nombre de archivo para los archivos de checkpoint y para la salida final en h5 y xml |

### Parámetros adicionales

| **Nombre** | **Descripción** |
| :------- | :-------------- |
| SEED | semilla aleatoria para el generador pseudoaleatorio |
| RNG | generador pseudoaleatorio usado (por defecto es "mt19937"), puede cambiarse a "lagged_fibonacci607" |

## Notas de uso

- Nota sobre redes bipartitas: la opción ANTIFERROMAGNET asume un ordenamiento tipo Néel y por lo tanto requiere una red bipartita. Nótese que en una red bipartita la densidad de estados es simétrica (a menos que se aplique un desplazamiento de potencial global).
- Desde la revisión 6217, si proporciona DOSFILE o si usa TWODBS y no se fija ninguno de los parámetros EPS_i, EPSSQ_i, EPSSQAV, entonces EPS_i se fijará al primer momento de la DOS normalizada (en el caso de TWODBS: 0) y EPSSQ_i y EPSSQAV se fijarán al segundo momento de la DOS normalizada usando la densidad de estados proporcionada (en el caso de TWODBS: usando los valores codificados).
- Desde la revisión 6217 puede usar TWODBS="hexagonal" para simular la red hexagonal bidimensional (solo hoppings a primeros vecinos). Si usa TWODBS con otro valor, se asume la red cuadrada.

## Archivos de entrada/salida

### Los archivos con prefijo BASENAME: (donde BASENAME es el nombre del archivo de parámetros de entrada)

- BASENAME: es el archivo de entrada que debe cargar la aplicación `dmft`
- BASENAME.h5: contiene la función de Green de la impureza $G(\tau)$ resuelta por iteración y el campo de Weiss $G^0(\tau)$ en la representación de tiempo imaginario; si el bucle de autoconsistencia se ha realizado en la representación de Matsubara (= si OMEGA_LOOP ha estado activado), también se almacenarán $G(i\omega_n)$ y $G^0(i\omega_n)$. La autoenergía no se almacena directamente allí, pero puede obtenerse fácilmente mediante la ecuación de Dyson (véase DMFT-01 Una introducción a DMFT)

### Los archivos de salida/entrada en la representación de Matsubara: (archivo de texto que consiste de NMATSUBARA filas, una por cada frecuencia de Matsubara)

- G_omega_i (G0_omega_i): contiene la parte imaginaria de la función de Green (campo de Weiss) dada en frecuencias de Matsubara tras la iteración i-ésima; las filas contienen $\omega_n$ seguido de la parte imaginaria de la función de Green (campo de Weiss) para cada sabor; por lo tanto hay 1+FLAVORS columnas en el archivo
- G_omegareal_i (G0_omegareal_i): lo mismo que arriba para la parte real
- selfenergy_i: contiene la autoenergía tras la iteración i-ésima; cada fila consiste de $\omega_n$ seguido de la parte real e imaginaria de la autoenergía para cada sabor; por lo tanto hay 1+2FLAVORS columnas en el archivo
- G0omega_output (a menos que se especifique de otra forma mediante la variable G0OMEGA_output): contiene n (correspondiente a $\omega_n=\frac{(2n+1)\pi}{\beta})$ seguido del campo de Weiss complejo para cada sabor; por lo tanto hay una columna entera seguida de FLAVORS columnas de números complejos definidos por la parte real e imaginaria entre paréntesis
- G0OMEGA_INPUT: variable que especifica el archivo de entrada con el campo de Weiss inicial en la representación de Matsubara; se espera el mismo formato que el archivo de salida anterior; por lo tanto puede copiarlo e iniciar una simulación a partir de él

### Los archivos de salida/entrada en la representación de tiempo imaginario: (archivo de texto que consiste de $N+1$ filas, una por cada tiempo imaginario $\in\langle 0,\beta\rangle$)

- G_tau_i (G0_tau_i): contiene la función de Green (campo de Weiss) (real) tras la iteración i-ésima; las filas contienen $\tau_n$ seguido de la función de Green (campo de Weiss) para cada sabor; por lo tanto hay 1+FLAVORS columnas en el archivo
- G0tau_output (a menos que se especifique de otra forma mediante la variable G0TAU_output): contiene n (correspondiente a $\tau_n=\frac{n}{N}\beta$) seguido del campo de Weiss complejo para cada sabor; por lo tanto hay una columna entera seguida de FLAVORS columnas de números complejos definidos por la parte real e imaginaria entre paréntesis; en total $N+1$ filas
- G0OMEGA_INPUT: variable que especifica el archivo de entrada con el campo de Weiss inicial en la representación de tiempo imaginario; se espera el mismo formato que el archivo de salida anterior; por lo tanto puede copiarlo e iniciar una simulación a partir de él

### Los archivos de salida con prefijo dado por la variable opcional CHECKPOINT:

- CHECKPOINT.h5: contiene las mediciones de cada iteración
- CHECKPOINT.xml: contiene los parámetros de entrada e información de la ejecución
- CHECKPOINT.run\*: contiene información para reanudar la simulación (estos son los verdaderos checkpoints); uno por cada proceso

### Los archivos de salida para el solver de impureza por expansión de hibridación: (archivos de texto)

- overlap: la fila i-ésima contiene $\langle n_\downarrow n_\uparrow\rangle$ en la iteración i-ésima
- matrix_size:


## Literatura

- Una revisión sobre DMFT: A. Georges, G. Kotliar, W. Krauth, y M. J. Rozenberg, Dynamical mean-field theory of strongly correlated fermion systems and the limit of infinite dimensions, Rev. Mod. Phys. 68, 13 (1996).
- Sobre el solver de impureza por expansión de hibridación: P. Werner y A. J. Millis, Hybridization expansion impurity solver: General formulation and application to Kondo lattice and two-orbital models, Phys. Rev. B 74, 155107 (2006).
