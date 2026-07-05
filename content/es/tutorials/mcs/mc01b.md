
---
title: MC-01b Equilibración
math: true
toc: true
weight: 3
---

Toda simulación Monte Carlo parte de alguna configuración inicial — a menudo un estado aleatorio o totalmente ordenado — que está lejos del equilibrio.
Durante la primera fase de la ejecución, la cadena de Markov se relaja hacia la distribución de equilibrio, y las mediciones tomadas durante este período de *termalización* están sesgadas por la elección del punto de partida.
Deben descartarse antes de calcular los promedios.
El número de barridos necesarios para que el sistema pierda la memoria de su estado inicial viene dado por el tiempo de autocorrelación (véase [MC-01a](../mc01a)); cerca de una transición de fase, donde las correlaciones tienen alcance largo, la termalización puede requerir muchos miles de barridos.

Este tutorial cubre dos diagnósticos relacionados:

- **Equilibración**: ¿ha abandonado la simulación su estado inicial y alcanzado la distribución de equilibrio?
- **Convergencia**: ¿se ha ejecutado la simulación el tiempo suficiente para que los errores estadísticos en los promedios medidos sean aceptablemente pequeños?

Ambos se comprueban inspeccionando la serie temporal de un observable medido — en este caso, la magnetización de un modelo de Ising 2D en su temperatura crítica.

## Equilibración

### Preparación y ejecución de la simulación desde la línea de comandos

El archivo de parámetros <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01b-equilibration-and-convergence/parm1a" download>`parm1a`</a> configura una única simulación del modelo de Ising en una red cuadrada de $48 \times 48$ a la temperatura crítica:

```
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=10000
SWEEPS=50000
UPDATE="local"
MODEL="Ising"
{L=48;}
```

Convierta el archivo de parámetros a XML y ejecute `spinmc`:

```
parameter2xml parm1a
spinmc --Tmin 10 --write-xml parm1a.in.xml
```

### Preparación y ejecución de la simulación en Python

El script completo está disponible como <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01b-equilibration-and-convergence/tutorial1a.py" download>`tutorial1a.py`</a>.
Comienza importando los módulos requeridos y definiendo los parámetros de la simulación:

```Python
import pyalps
import matplotlib.pyplot as plt

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'THERMALIZATION'  : 10000,
    'SWEEPS'          : 50000,
    }]
```

Escriba los parámetros en un archivo de entrada XML y ejecute `spinmc`:

```Python
input_file = pyalps.writeInputFiles('parm1a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)
```

### Inspección de la serie temporal

La forma más directa de comprobar la equilibración es graficar la serie temporal de un observable medido.
Cargamos la serie temporal de la magnetización desde el archivo de salida y la graficamos:

```Python
files = pyalps.getResultFiles(prefix='parm1a')
ts_M = pyalps.loadTimeSeries(files[0], '|Magnetization|')

plt.plot(ts_M)
plt.xlabel('Monte Carlo sweep')
plt.ylabel('|Magnetization|')
plt.title('Magnetization time series')
plt.show()
```

Inspeccione el gráfico resultante: el observable debería estabilizarse en un valor aproximadamente estacionario tras un transitorio inicial.
Si la serie temporal sigue derivando al final de la ejecución, o si muestra una tendencia clara en los barridos iniciales que se extiende bien dentro de la fase de medición, el período de termalización (`THERMALIZATION`) es demasiado corto y debe aumentarse.

### Comprobación automatizada: `pyalps.checkSteadyState`

En lugar de juzgar la equilibración a simple vista, `pyalps.checkSteadyState` aplica una prueba estadística para determinar si una serie temporal ha alcanzado una distribución estacionaria.
Devuelve los datos anotados con una marca que indica si cada observable ha superado la prueba.
El nivel de confianza predeterminado es del 68.27% (un sigma); puede aumentarse:

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')

# Default: 68.27% confidence interval
data = pyalps.checkSteadyState(data)

# Stricter: 90% confidence interval
data = pyalps.checkSteadyState(data, confidenceInterval=0.9)
```

## Convergencia

La convergencia es una cuestión distinta de la equilibración: incluso después de que el sistema se haya equilibrado por completo, los errores estadísticos en los promedios medidos solo disminuyen como $1/\sqrt{N}$ con el número de muestras independientes $N$.
Una comprobación de convergencia verifica que la simulación ha acumulado suficientes mediciones para que las estimaciones de error sean fiables y estables.

`pyalps.checkConvergence` comprueba si los errores en los promedios medidos se han estabilizado.
Se usa de la misma manera que `checkSteadyState`:

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')
data = pyalps.checkConvergence(data)
```

Si la comprobación falla, aumente `SWEEPS` y vuelva a ejecutar la simulación.

## Preguntas

- Acorte significativamente el período de `THERMALIZATION` (por ejemplo, a 100 barridos). ¿Puede ver el transitorio inicial en la serie temporal? ¿Lo señala `checkSteadyState`?
- ¿Cómo cambia la longitud de termalización requerida al alejarse de la temperatura crítica? Pruebe con $T = 1.5$ y $T = 3.5$.
- Aumente y disminuya `SWEEPS` en un factor de diez. ¿Cómo cambian las barras de error de la magnetización? ¿Coincide esto con el escalamiento esperado de $1/\sqrt{N}$?
- ¿Por qué es importante comprobar tanto la equilibración como la convergencia? ¿Puede una simulación superar una comprobación y fallar la otra?
