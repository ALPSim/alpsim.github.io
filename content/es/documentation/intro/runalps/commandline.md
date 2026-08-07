
---
title: ALPS usando la línea de comandos
toc: true
weight: 2
---

## Preparación de la entrada

Dado que el formato XML de los archivos de trabajo (job) y tarea (task) probablemente no es con lo que quiera lidiar a diario, la herramienta parameter2xml le permite especificar los parámetros de la simulación en un archivo de texto plano que se convierte al formato XML por su conveniencia.

La herramienta `parameter2xml` transforma un archivo de parámetros de texto plano en el formato XML anterior, creando así el archivo de trabajo (job) y todos los archivos de tarea (task) necesarios. El archivo de parámetros consiste en una serie de asignaciones de parámetros de la forma:

    MODEL="Ising";
    SWEEPS=1000;
    THERMALIZATION=100; 
    WORK_FACTOR=L*SWEEPS;
    { L=10; T=0.1; }
    { L=20; T=0.05; }

donde cada grupo de asignaciones dentro de un bloque de llaves {...} indica un conjunto de parámetros para una única simulación. Las asignaciones fuera de un bloque de llaves son válidas globalmente para todas las simulaciones posteriores al punto de definición. Las cadenas se dan entre comillas dobles, como en "Ising".

Dos parámetros tienen un significado especial:

| **Parámetro** | **Predeterminado** | **Significado** |
| :------------ | :---------- | :---------- |
| SEED | 0 | La semilla de números aleatorios utilizada en la siguiente ejecución de Monte Carlo creada. Después de usar una semilla en la creación de una ejecución de Monte Carlo, este valor se incrementa en uno. |
| WORK_FACTOR 1 | Un factor por el cual se multiplica el trabajo que debe realizarse para una simulación en el balanceo de carga. |

 La sintaxis para invocar `parameter2xml` es:
 
    parameter2xml [-f] parameterfile [xmlfileprefix]

que convierte un archivo de parámetros en un conjunto de archivos XML, comenzando con el prefijo dado como segundo argumento opcional. El valor predeterminado para el segundo argumento es el mismo nombre que el archivo de parámetros.
La herramienta `parameter2xml` verifica la existencia de los archivos XML de salida, y pregunta al usuario si realmente desea sobrescribir los archivos de entrada. Se puede forzar a `parameter2xml` a sobrescribir los XML de entrada con la opción "-f".

## Invocación del programa

### Ejecución de la simulación en una máquina serial

La simulación se inicia primero creando el archivo de trabajo (job), y luego dando el nombre del archivo de trabajo XML como argumento al programa. En nuestro ejemplo, el programa se llama my_program y la secuencia para ejecutarlo es:

    parameter2xml parm job 
    my_program  job.in.xml

Los resultados se almacenarán en un archivo `job.out.xml`, que hace referencia a los archivos `job.task1.out.xml`, `job.task2.out.xml` y `job.task3.out.xml` para los resultados de las tres simulaciones.

#### Opciones de línea de comandos

El programa toma varias opciones de línea de comandos, para controlar el comportamiento del planificador (scheduler). Estas opciones son más útiles para simulaciones de Monte Carlo.

| **Opción** | **Predeterminado** | **Descripción** |
| :--------- | :---------- | :-------------- |
| --time-limit timelimit | infinito | da el tiempo (en segundos) durante el cual el programa debe ejecutarse antes de escribir un punto de control final y salir. |
| --checkpoint-time checkpointtime | 1800 | da el tiempo (en segundos) tras el cual el programa debe escribir un punto de control. |
| --Tmin checkingtime | 60 | da el tiempo mínimo (en segundos) que el planificador espera antes de comprobar (de nuevo) si una simulación ha terminado. |
| --Tmax checkingtime | 900 | da el tiempo máximo (en segundos) que el planificador espera antes de comprobar (de nuevo) si una simulación ha terminado. |
| --write-xml | | con esta opción, el resultado se escribirá en los archivos .out.xml, mientras que de lo contrario solo se escribe en los archivos hdf5. |

### Ejecución de la simulación en una máquina paralela

es tan sencillo como ejecutarla en una sola máquina. Daremos el ejemplo usando MPI. Después de iniciar el entorno MPI (usando, p. ej., lamboot para LAM MPI), se ejecuta el programa en paralelo usando mpirun. En nuestro ejemplo, para ejecutarlo en cuatro procesos, se hace:

    parameter2xml parm job 
    mpirun -np 4 my_program --mpi job.in.xml
 
 #### Opciones de línea de comandos
 
 Además de las opciones de línea de comandos para el programa secuencial, hay dos más para el programa paralelo:
 
 | **Opción** | **Predeterminado** | **Descripción** |
| :--------- | :---------- | :-------------- |
| --mpi | | especifica que el programa debe ejecutarse en modo MPI |
| --Nmax numprocs | infinito | da el número máximo de procesos a asignar a una simulación. |
| --Nmin numprocs | 1 | da el número mínimo de procesos a asignar a una simulación. |

Si hay más procesadores disponibles que simulaciones, se iniciará más de una ejecución de Monte Carlo para cada simulación. 

## Análisis de los resultados de la simulación 

Durante las simulaciones se miden y almacenan en los respectivos archivos de tarea los valores esperados de varios observables (especificados e implementados en el código de simulación). Para archivar los archivos de tarea producidos por una simulación y para extraer datos de estos archivos o del archivo respectivamente, se documentan a continuación varias herramientas.

### `convert2xml`

Los archivos de salida de la simulación solo contienen las mediciones recopiladas de todas las ejecuciones. Se puede obtener información detallada sobre las ejecuciones individuales de Monte Carlo de cada simulación convirtiendo los archivos de punto de control a XML, usando la herramienta `convert2xml`, p. ej.:

    convert2xml run-file

Esto producirá un archivo xml de la tarea, que contiene la información extraída de esta ejecución de Monte Carlo.

### Evaluación de observables

Existen los siguientes binarios para la evaluación usando la línea de comandos: `dirloop_sse_evalute`, `spin_mc_evaluate`, `worm_evaluate`, `fulldiag_evaluate` y `qwl_evaluate`. Tres de ellos (`dirloop_sse_evaluate`, `spinmc_evaluate` y `worm_evaluate`) usan la misma sintaxis:

    spinmc_evaluate [--write-xml] job.task1.out.xml [job.task2.out.xml ... ]

Esto calculará observables adicionales (p. ej. calor específico, compresibilidad, ...) que no se calcularon durante la simulación, usando los archivos de datos mc almacenados. Usando '--write-xml' se volverá a escribir todo en los archivos .out.xml. Sin este indicador, el resultado se escribirá solo en los archivos hdf5.
Para la sintaxis de los otros dos binarios (`fulldiag_evaluate` y `qwl_evaluate`) consulte los Tutoriales sobre QWL y ED.
La estructura de los programas evaluate es relativamente sencilla. Es directo crear o modificar tales programas de evaluación. El siguiente ejemplo lee los valores esperados de los operadores de número de partículas n y n2 de la simulación de un modelo bosónico de Hubbard, calcula el valor esperado de la compresibilidad y lo escribe de vuelta en el punto de control.

    #include <alps/scheduler.h>
    #include <alps/alea.h>
 
    void evaluate(const boost::filesystem::path& p, std::ostream& out) {
        alps::ProcessList nowhere;
        alps::scheduler::MCSimulation sim(nowhere,p);
 
        // read in parameters
        alps::Parameters parms=sim.get_parameters();
        double beta=parms.defined("beta") ? static_cast<double>(parms["beta"]) : (1./static_cast<double>(parms["T"]));             
 
        // determine compressibility
        alps::RealObsevaluator n  = sim.get_measurements()["Particle number"];
        alps::RealObsevaluator n2 = sim.get_measurements()["Particle number^2"];
        alps::RealObsevaluator kappa= beta*(n2 - n*n);  
        kappa.rename("Compressibility");
 
        // write compressibility back to checkpoint  
        sim << kappa;
        sim.checkpoint(p);
    }
 
    int main(int argc, char** argv)
    {
        alps::scheduler::BasicFactory<alps::scheduler::MCSimulation,alps::scheduler::DummyMCRun> factory;
        alps::scheduler::init(factory);
        boost::filesystem::path p(argv[1],boost::filesystem::native);
        evaluate(p,std::cout);
    }

Tenga en cuenta que ALPS 2 proporciona un análisis y evaluación de datos mucho más sencillo en Python, y este ejemplo en C++ solo debe ser usado por quienes requieran análisis en sus programas C++.



