
---
title: Ejecutar Aplicaciones
math: true
toc: true
weight: 1
---


`pyalps.writeParameterFile(fname, parms)`

- Esta función escribe un archivo de entrada de texto para aplicaciones simples de ALPS como DMFT

- Los argumentos son:

  - filename: el nombre del archivo de parámetros que se va a escribir
  - parms: el diccionario de parámetros

`pyalps.writeInputFiles(fname, parms, baseseed=None)`

 - Esta función escribe los archivos de entrada XML para ALPS

 - Los parámetros son: 
     - fname: el nombre de archivo base de los archivos XML que se escribirán
     - parms: una lista de diccionarios que contienen los parámetros de la simulación
     - baseseed: parámetro opcional que da una semilla de números aleatorios a partir de la cual se calcularán las semillas de las simulaciones individuales. El valor predeterminado se toma de la hora actual.

 - La función devuelve el nombre del archivo de entrada XML principal


`pyalps.runApplication(appname, parmfiles, T=None, Tmin=None, Tmax=None, writexml=False, MPI=None, mpirun='mpirun')`
  ejecuta una aplicación de ALPS

- Esta función ejecuta una aplicación de ALPS.
- Los parámetros son:

    - appname: el nombre de la aplicación parmfile: el nombre del archivo de entrada XML principal writexml: parámetro opcional, que debe establecerse en True si todos los resultados deben escribirse en los archivos XML además de los archivos HDF5
    - T: límite de tiempo de la simulación MC
    - Tmin: parámetro opcional que especifica el tiempo mínimo entre comprobaciones de si una simulación MC ha terminado
    - Tmax: parámetro opcional que especifica el tiempo máximo entre comprobaciones de si una simulación MC ha terminado
    - MPI: parámetro opcional que especifica el número de procesos que se usarán en una simulación MPI. MPI no se usa si este parámetro se deja en su valor predeterminado None.
    - mpirun: parámetro opcional que da el nombre del ejecutable usado para lanzar aplicaciones MPI. El valor predeterminado es «mpirun»

`pyalps.runDMFT(infiles, apppath='')`
  ejecuta la aplicación DMFT de ALPS

- La aplicación DMFT de ALPS aún no utiliza los archivos de entrada estándar de ALPS ni el planificador (scheduler). Por lo tanto, existe una función independiente para invocarla. Esta función toma un parámetro obligatorio: un único archivo de entrada o una lista de archivos de entrada. El parámetro opcional apppath permite establecer la ruta al binario.

`pyalps.evaluateLoop(infiles, appname='loop', write_xml=False)`
evalúa los resultados de la aplicación QMC looper

- esta función llama a la herramienta de evaluación de la aplicación looper. Además, los resultados evaluados se vuelven a escribir en los archivos. Además de una lista de archivos de resultados, toma un argumento opcional:

    - write_xml: si este argumento opcional se establece en True, los resultados también se escribirán en los archivos XML

`pyalps.evaluateSpinMC(infiles, appname='spinmc_evaluate', write_xml=False)`
evalúa los resultados de la aplicación `spinmc`

- esta función llama a la herramienta de evaluación de la aplicación spinmc. Además, los resultados evaluados se vuelven a escribir en los archivos. Además de una lista de archivos de resultados, toma un argumento opcional:

    - write_xml: si este argumento opcional se establece en True, los resultados también se escribirán en los archivos XML

`pyalps.evaluateQWL(infiles, appname='qwl_evaluate', DELTA_T=None, T_MIN=None, T_MAX=None)`
evalúa los resultados de la aplicación de Wang-Landau cuántico

- esta función llama a la herramienta de evaluación de la aplicación de Wang-Landau cuántico. Además de una lista de archivos de resultados, toma los siguientes argumentos: 
   - T_MIN: el extremo inferior del rango de temperaturas para el cual se evalúan las cantidades
   - T_MAX: el extremo superior del rango de temperaturas para el cual se evalúan las cantidades
   - DELTA_T: los pasos de temperatura que se usarán entre T_MIN y T_MAX

- Esta función devuelve una lista de listas de objetos DataSet, para las distintas propiedades evaluadas en cada uno de los archivos de entrada.

`pyalps.evaluateFulldiagVersusT(infiles, appname='fulldiag_evaluate', DELTA_T=None, T_MIN=None, T_MAX=None, H=None)`
evalúa los resultados de la aplicación `fulldiag` en función de la temperatura

- esta función llama a la herramienta de evaluación de la aplicación `fulldiag` y evalúa varias cantidades en función de la temperatura. Además de una lista de archivos de resultados, toma los siguientes argumentos: 
   - T_MIN: el extremo inferior del rango de temperaturas para el cual se evalúan las cantidades
   - T_MAX: el extremo superior del rango de temperaturas para el cual se evalúan las cantidades
   - DELTA_T: los pasos de temperatura que se usarán entre T_MIN y T_MAX 
   - H: (opcional) el campo magnético en el cual deben evaluarse todos los datos

- Esta función devuelve una lista de listas de objetos DataSet, para las distintas propiedades evaluadas en cada uno de los archivos de entrada.

`pyalps.evaluateFulldiagVersusH(infiles, appname='fulldiag_evaluate', DELTA_H=None, H_MIN=None, H_MAX=None, T=None)`
evalúa los resultados de la aplicación `fulldiag` en función del campo magnético h

- esta función llama a la herramienta de evaluación de la aplicación fulldiag y evalúa varias cantidades en función del campo magnético. Además de una lista de archivos de resultados, toma los siguientes argumentos: 
   - H_MIN: el extremo inferior del rango de campo para el cual se evalúan las cantidades
   - H_MAX: el extremo superior del rango de temperaturas para el cual se evalúan las cantidades
   - DELTA_H: los pasos de campo que se usarán entre H_MIN y H_MAX 
   - T: el campo de temperatura en el cual deben evaluarse todos los datos

- Esta función devuelve una lista de listas de objetos DataSet, para las distintas propiedades evaluadas en cada uno de los archivos de entrada.

