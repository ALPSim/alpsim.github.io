
---
title: Introducción
toc: true
weight: 1
---

## Descripción general

En la biblioteca ALPS, las simulaciones se basan en la biblioteca del planificador (scheduler), que le permite especificar parámetros para sus simulaciones, incluyendo múltiples definiciones de parámetros (por ejemplo, si desea simular un sistema físico a varias temperaturas). La biblioteca del planificador luego iniciará trabajos para cada conjunto de parámetros, ya sea en una máquina serial o paralela, y usa puntos de control para evitar la pérdida de datos al exceder los límites de tiempo de ejecución de la máquina. La biblioteca del planificador solicita un archivo de trabajo (job) que especifica los archivos de tarea (task) para cada conjunto de parámetros para el cual se ejecutará una simulación de Monte Carlo. Los archivos de trabajo y de tarea se dan en formato XML. El planificador leerá estos archivos y escribirá los observables en el archivo de tarea. Un archivo de trabajo de ejemplo podría verse así:

    <JOB>
    <OUTPUT file="parm.xml"/>
    <TASK status="new">
    <INPUT file="parm.task1.in.xml"/>
    <OUTPUT file="parm.task1.xml"/>
    </TASK>
    <TASK status="new">
    <INPUT file="parm.task2.in.xml"/>
    <OUTPUT file="parm.task2.xml"/>
    </TASK>
    <TASK status="new">
    <INPUT file="parm.task3.in.xml"/>
    <OUTPUT file="parm.task3.xml"/>
    </TASK> 
    </JOB>

y un archivo de tarea de ejemplo como:

    <SIMULATION>
    <PARAMETERS>
    <PARAMETER name="L">100</PARAMETER>
    <PARAMETER name="SWEEPS">10000</PARAMETER>
    <PARAMETER name="T">0.5</PARAMETER>
    <PARAMETER name="THERMALIZATION">100</PARAMETER>
    </PARAMETERS> 
    </SIMULATION>
    
Aquí discutiremos cómo preparar, ejecutar y evaluar simulaciones de ALPS. ALPS 2 admite dos formas de realizar simulaciones:

- [Uso de la línea de comandos \(con herramientas de evaluación limitadas\)](../commandline)
- [Uso de Python](../usepython)

Ambas formas producen los mismos archivos de salida. La línea de comandos y Python pueden combinarse según se desee. Las características comunes son las tres fases de una simulación:

- Preparación de los archivos de entrada
- Ejecución de la simulación
- Evaluación de los resultados 

## Comentario sobre generadores de números aleatorios

Siempre que use simulaciones de Monte Carlo, debe recordar que trabaja con números pseudoaleatorios. Siempre existe una pequeña posibilidad de que su aplicación sea justamente la que muestre, por casualidad, que un generador de números pseudoaleatorios hasta ahora bueno no es ideal. Por lo tanto, como es práctica estándar en todas las simulaciones de Monte Carlo de alta precisión, debe ejecutar una simulación con más de un generador de números aleatorios si busca una alta precisión. El parámetro RNG de la simulación le permite cambiar el generador de números aleatorios para validar sus resultados.



