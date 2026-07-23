---
title: Alpsize-03 Fortran Application Development
math: true
toc: true
weight: 4
---

ALPS Fortran proporciona módulos de interfaz Fortran para el sistema ALPS. Implementando un pequeño conjunto de subrutinas requeridas, puedes ejecutar un programa Fortran bajo el planificador (scheduler) de ALPS y aprovechar sus funciones de paralelización, gestión de parámetros y agregación de resultados. Este capítulo describe cómo escribir un programa Fortran que se ejecute en ALPS, y cómo portar un programa Fortran existente al marco de ALPS Fortran.

## Introducción a ALPS Fortran

La siguiente figura muestra la relación entre el sistema ALPS, ALPS Fortran y un programa Fortran de usuario.

![Módulo ALPS Fortran](../figs/fortranmodule.png)

ALPS llama a ALPS Fortran, que a su vez llama a las subrutinas del programa de usuario según sea necesario. Esto permite que ALPS controle un programa Fortran de la misma manera que controla un programa C++. ALPS Fortran también proporciona subrutinas que dan al programa de usuario acceso a las funciones de ALPS, de modo que el programa de usuario puede llamar a las funcionalidades de ALPS como si fueran subrutinas Fortran ordinarias.

## Flujo de llamadas

La siguiente figura muestra el flujo de llamadas entre el sistema ALPS y el programa de usuario.

![Flujo de llamadas](../figs/callflow.png)

## Preparación del código fuente Fortran

Para implementar un programa usando ALPS Fortran, necesitas preparar dos archivos fuente:

- Un **archivo fuente C++** que define la función `main` (el punto de entrada del programa).
- Un **archivo fuente Fortran** que implementa las subrutinas requeridas por ALPS Fortran.

### Punto de entrada

La función `main` establece metadatos del programa como el número de versión, el aviso de derechos de autor, el nombre del worker y el nombre del evaluador. En la mayoría de los casos el cuerpo de `main` no necesita cambiar — solo es necesario actualizar las cadenas de metadatos para tu programa.

A continuación se muestra un ejemplo de punto de entrada en C++:

    #include <alps/parapack/parapack.h>
    #include "fortran_wrapper.h"
    
    // Version number
    PARAPACK_SET_VERSION("my version");
    
    // Copyright notice
    PARAPACK_SET_COPYRIGHT("my copyright");
    
    // Worker name
    PARAPACK_REGISTER_WORKER(alps::fortran_wrapper, "worker name");
    
    // Evaluator
    PARAPACK_REGISTER_EVALUATOR(alps::parapack::simple_evaluator, "evaluator name");
    
    int main(int argc, char** argv)
    {
        return alps::parapack::start(argc, argv);
    }

Reemplaza las cadenas de ejemplo (`"my version"`, `"my copyright"`, `"worker name"`, `"evaluator name"`) con los valores adecuados para tu programa.

### Código fuente Fortran

El contenido principal del archivo fuente Fortran es la lógica de cálculo. Sin embargo, siempre debes implementar un conjunto de subrutinas requeridas para que ALPS Fortran pueda controlar tu programa. Al cargar parámetros o guardar resultados, llamas a subrutinas proporcionadas por ALPS Fortran en lugar de manejar la E/S directamente.

#### Subrutinas requeridas

Las siguientes subrutinas deben estar presentes en el archivo fuente Fortran. Si falta alguna, la compilación fallará con un error de enlazado.

Cada subrutina requerida recibe `caller` como argumento — un arreglo de enteros usado internamente por ALPS Fortran para invocar funciones de ALPS. **No modifiques el valor de `caller`.** Se produce un comportamiento indefinido si se cambia su valor.

Cada subrutina debe incluir `alps/fortran/alps_fortran.h`:

    subroutine alps_init(caller)
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    
    ! --- your code here --- !

---

**`alps_init(caller)`**

| **Tipo** | **Nombre** | **E/S** | **Significado** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | manejador (handle) interno de ALPS — no modificar |

Se llama una vez antes de que comience el cálculo. Usa esta subrutina para la inicialización: asignar arreglos y leer parámetros.

---

**`alps_init_observables(caller)`**

| **Tipo** | **Nombre** | **E/S** | **Significado** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | manejador interno de ALPS |

Se llama una vez después de `alps_init`. Usa esta subrutina para registrar los observables (cantidades de medición) con `alps::ObservableSet`. Se llama una vez por cada conjunto de parámetros de entrada. Consulta la [documentación de ALPS](https://alps.comp-phys.org) para más detalles sobre `alps::ObservableSet`.

---

**`alps_run(caller)`**

| **Tipo** | **Nombre** | **E/S** | **Significado** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | manejador interno de ALPS |

Contiene la lógica de cálculo principal. ALPS llama a esta subrutina repetidamente hasta que `alps_progress` devuelve un valor ≥ 1.0. Dado que ALPS gestiona el bucle de iteración, **no escribas un bucle externo dentro de `alps_run`**. Al ejecutarse con paralelismo a nivel de hilos, esta subrutina se ejecuta en múltiples hilos simultáneamente y debe ser segura para hilos (thread-safe).

---

**`alps_progress(prgrs, caller)`**

| **Tipo** | **Nombre** | **E/S** | **Significado** |
| :------- | :------- | :------ | :---------- |
| real\*8  | prgrs    | out | indicador de progreso (0.0 ≤ prgrs; el cálculo termina cuando prgrs ≥ 1.0) |
| integer  | caller(2) | in | manejador interno de ALPS |

Llamada por ALPS después de cada llamada a `alps_run`. Mientras `prgrs < 1.0`, ALPS continúa llamando a `alps_run`. Cuando `prgrs ≥ 1.0`, ALPS considera que el cálculo está completo y se detiene. Debe ser segura para hilos al ejecutarse con paralelismo a nivel de hilos.

---

**`alps_is_thermalized(thrmlz, caller)`**

| **Tipo** | **Nombre** | **E/S** | **Significado** |
| :------- | :------- | :------ | :---------- |
| integer  | thrmlz   | out | indicador de termalización: 0 = aún no termalizado, 1 = termalizado |
| integer  | caller(2) | in | manejador interno de ALPS |

Llamada por ALPS después de cada `alps_run`. Mientras `thrmlz = 0`, ALPS no guarda los resultados de medición (el sistema todavía se está termalizando). Cuando `thrmlz = 1`, ALPS comienza a guardar resultados. Debe ser segura para hilos al ejecutarse con paralelismo a nivel de hilos.

---

**`alps_finalize(caller)`**

| **Tipo** | **Nombre** | **E/S** | **Significado** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | manejador interno de ALPS |

Se llama una vez después de que `alps_progress` devuelve un valor ≥ 1.0. Usa esta subrutina para la limpieza: liberar arreglos y cualquier otro recurso.

---

**`alps_save(caller)`**

| **Tipo** | **Nombre** | **E/S** | **Significado** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | manejador interno de ALPS |

Llamada por ALPS después de cada `alps_run`. Escribe los datos de punto de control (checkpoint) en el archivo de reinicio usando `alps_dump`. Debe ser segura para hilos al ejecutarse con paralelismo a nivel de hilos.

---

**`alps_load(caller)`**

| **Tipo** | **Nombre** | **E/S** | **Significado** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | manejador interno de ALPS |

Se llama una vez cuando el programa se reinicia. Carga los datos de punto de control desde el archivo de reinicio usando `alps_restore`.

---

#### Subrutinas proporcionadas por ALPS Fortran

Para llamar a las funciones de ALPS desde tu programa Fortran, usa las subrutinas proporcionadas por ALPS Fortran. Cada una toma `caller(2)` como parámetro; pasa la variable `caller` recibida por la subrutina requerida que la contiene.

---

**`alps_get_parameter(data, name, type, caller)`**

| **Tipo**  | **Nombre**   | **E/S** | **Significado** |
| :-------- | :--------- | :------ | :---------- |
| —         | data       | out | variable que recibe el valor del parámetro |
| character | name(\*)   | in  | nombre del parámetro |
| integer   | type       | in  | constante de tipo de dato (definida en `alps_fortran.h`) |
| integer   | caller(2)  | in  | manejador interno de ALPS |

Lee un parámetro nombrado del archivo de parámetros de ALPS en `data`. Típicamente se llama dentro de `alps_init`. Las constantes de tipo disponibles están definidas en `alps_fortran.h`.

---

**`alps_parameter_defined(res, name, caller)`**

| **Tipo**  | **Nombre**   | **E/S** | **Significado** |
| :-------- | :--------- | :------ | :---------- |
| integer   | res        | out | 1 si el parámetro está definido, 0 si no |
| character | name(\*)   | in  | nombre del parámetro |
| integer   | caller(2)  | in  | manejador interno de ALPS |

Devuelve si el parámetro nombrado está presente en el archivo de parámetros. Se usa típicamente en `alps_init` para gestionar parámetros opcionales.

---

**`alps_init_observable(count, type, name, caller)`**

| **Tipo**  | **Nombre**   | **E/S** | **Significado** |
| :-------- | :--------- | :------ | :---------- |
| integer   | count      | in | número de elementos en el observable |
| integer   | type       | in | constante de tipo de dato |
| character | name(\*)   | in | nombre bajo el cual se registra el observable |
| integer   | caller(2)  | in | manejador interno de ALPS |

Registra un observable nombrado con `alps::ObservableSet` dentro de `alps_init_observables`. El tipo de observable se determina por `type` y `count`:

| **type** | **count** | **Tipo de observable** |
| :------- | :-------- | :------------------ |
| ALPS_INT                | 1   | IntObservable |
| ALPS_INT                | > 1 | IntVectorObservable |
| ALPS_REAL               | 1   | RealObservable |
| ALPS_REAL               | > 1 | RealVectorObservable |
| ALPS_DOUBLE_PRECISION   | 1   | RealObservable |
| ALPS_DOUBLE_PRECISION   | > 1 | RealVectorObservable |

---

**`alps_accumulate_observable(data, count, type, name, caller)`**

| **Tipo**  | **Nombre**   | **E/S** | **Significado** |
| :-------- | :--------- | :------ | :---------- |
| —         | data       | in  | valor(es) a registrar |
| integer   | count      | in  | número de elementos |
| integer   | type       | in  | constante de tipo de dato |
| character | name(\*)   | in  | nombre del observable en el que se almacena |
| integer   | caller(2)  | in  | manejador interno de ALPS |

Registra un resultado de medición en un observable nombrado. Se llama dentro de `alps_run`. `count`, `type` y `name` deben coincidir con los usados en `alps_init_observable`.

---

**`alps_dump(data, count, type, caller)`**

| **Tipo**  | **Nombre**  | **E/S** | **Significado** |
| :-------- | :-------- | :------ | :---------- |
| —         | data      | in  | datos a guardar |
| integer   | count     | in  | número de elementos |
| integer   | type      | in  | constante de tipo de dato |
| integer   | caller(2) | in  | manejador interno de ALPS |

Escribe datos en el archivo de reinicio. Se llama dentro de `alps_save`. Los datos guardados con `alps_dump` deben restaurarse en el mismo orden usando `alps_restore`.

---

**`alps_restore(data, count, type, caller)`**

| **Tipo**  | **Nombre**  | **E/S** | **Significado** |
| :-------- | :-------- | :------ | :---------- |
| —         | data      | out | ubicación de almacenamiento para los datos cargados |
| integer   | count     | in  | número de elementos |
| integer   | type      | in  | constante de tipo de dato |
| integer   | caller(2) | in  | manejador interno de ALPS |

Lee datos del archivo de reinicio. Se llama dentro de `alps_load`. Los datos deben restaurarse en el mismo orden en que fueron guardados por `alps_dump`.

---

### Edición del CMakeLists.txt

Los programas de usuario se compilan con CMake, igual que el propio ALPS. A continuación se muestra un `CMakeLists.txt` de ejemplo. Reemplaza `hello_sample`, `hello`, `main.C` y `hello_impl.f` con los nombres reales de tu proyecto:

    # CMakeLists.txt
    
    cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
    
    project(hello_sample)
    
    find_package(ALPS REQUIRED NO_SYSTEM_ENVIRONMENT_PATH)
    message(STATUS "ALPS version: ${ALPS_VERSION}")
    include(${ALPS_USE_FILE})
    
    add_executable(hello main.C hello_impl.f)
    target_link_libraries(hello ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})

## Portar un programa Fortran existente

Esta sección recorre el proceso de portar el programa del modelo de Ising `ising_original.f` a ALPS Fortran, usando los archivos de tutorial extraídos de `alps_fortran.tar.gz`.

### Preparación para el port

Copia los siguientes archivos del directorio del tutorial a tu directorio de trabajo:

- `ising_original.f` — código fuente original
- `template.f90` — plantilla de programa ALPS Fortran
- `main.C` — punto de entrada
- `CMakeLists.txt` — plantilla de configuración de compilación

`template.f90` contiene definiciones esqueleto (stub) de todas las subrutinas requeridas. Para un programa nuevo, comienza desde `template.f90` en lugar de escribir las subrutinas desde cero.

La estructura del código original es:

| Líneas   | Procesamiento |
| :------ | :--------- |
| 4–7     | Declaración e inicialización de variables |
| 8–23    | Inicialización de elementos de arreglos |
| 24–47   | Bucle principal |
| 25–34   | Cálculo |
| 36      | Verificación de termalización |
| 37–46   | Guardado de resultados |
| 48–58   | Salida de resultados |

### Portando el código Fortran

Cada bloque de `ising_original.f` se asigna a la subrutina de ALPS Fortran correspondiente. El archivo `tutorial/alps_ising.f90` es la versión portada completa.

#### Declaración de variables

Las variables declaradas en `ising_original.f` deben moverse a un módulo de ALPS Fortran para que sean accesibles desde múltiples subrutinas.

- Antes del port:

        4:    DIMENSION IS(20,20),IP(20),IM(20),P(-4:4),A(4)
        5:    C PARAMETERS
        6:          DATA TEMP/2.5/, L/10/, MCS/1000/, INT/1000/
        7:          DATA IX/1234567/, V0/.465661288D-9/

- Después del port:

        1:    module ising_mod
        2:      implicit none
        3:      real, parameter :: V0 = .465661288D-9
        4:
        5:      integer, allocatable, dimension(:) :: IP, IM
        6:      integer, allocatable, dimension(:,:) :: IS
        7:      real*8, allocatable, dimension(:) :: P
        8:      integer :: K, MCS, INT, L, IX
        9:      real :: TEMP
        10:   end module ising_mod

`IP`, `IM`, `IS` y `P` se asignan en `alps_init`, por lo que sus tamaños no están fijados aquí. El arreglo `A` (que almacenaba resultados acumulados) es reemplazado por observables de ALPS y ya no es necesario. Los valores de las variables se leen del archivo de parámetros en tiempo de ejecución. Se añade `K` para contar iteraciones; la verificación de termalización después del port se maneja monitoreando `K` en lugar de usar un bucle con `GOTO`.

**Nota: la versión MPI de este ejemplo no necesita ser segura para hilos, por lo que la seguridad de hilos no se considera aquí.**

#### Inicialización

El bloque de inicialización del código original (configuración de arreglos) se convierte en `alps_init`. Los parámetros se leen del archivo de parámetros mediante `alps_get_parameter`, y los observables para almacenar resultados se registran en `alps_init_observables`. ALPS llama a estas subrutinas automáticamente — no las llamas tú mismo.

- Antes del port:

        8:    C TABLES
        9:          DO 10 I=-4,4
        10:         W=EXP(FLOAT(I)/TEMP)
        11:    10   P(I)=W/(W+1/W)
        12:         DO 11 I=1,L
        13:         IP(I)=I+1
        14:    11   IM(I)=I-1
        15:         IP(L)=1
        16:         IM(1)=L
        17:   C INITIAL CONFIGURATION
        18:         DO 20 I=1,L
        19:         DO 20 J=1,L
        20:    20   IS(I,J)=1
        21:   C ACCUMULATION DATA RESET
        22:         DO 21 I=1,4
        23:    21   A(I)=0.0

- Después del port (`alps_init`):

        13:   subroutine alps_init(caller)
        14:     use ising_mod
        15:     implicit none
        16:     include "alps/fortran/alps_fortran.h"
        17:     integer :: caller(2)
        18:     integer :: i, j
        19:     real*8 :: W
        20:
        21:     call alps_get_parameter(TEMP, "TEMPERATURE", ALPS_REAL, caller)
        22:     call alps_get_parameter(L, "L", ALPS_INT, caller)
        23:     call alps_get_parameter(MCS, "MCS", ALPS_INT, caller)
        24:     call alps_get_parameter(INT, "INT", ALPS_INT, caller)
        25:
        26:     allocate( IP(L) )
        27:     allocate( IM(L) )
        28:     allocate( P(-4:4) )
        29:     allocate( IS(L, L) )
        30:
        31:     K = 0
        32:     IX = 1234567
        33:
        34:     do i = -4, 4
        35:        W = exp(float(i)/TEMP)
        36:        P(i) = W / (W + 1/W)
        37:     end do
        38:
        39:     do i = 1, L
        40:        IP(i) = i + 1
        41:        IM(i) = i - 1
        42:     end do
        43:
        44:     do i = 1, L
        45:        do j = 1, L
        46:           IS(i, j) = 1
        47:        end do
        48:     end do
        49:
        50:     IP(L) = 1
        51:     IM(1) = L
        52:
        53:     return
        54:   end subroutine alps_init

Las líneas 21–24 llaman a `alps_get_parameter` para leer los valores de los parámetros del archivo de parámetros de ALPS. La configuración del arreglo (líneas 34–51) es por lo demás idéntica al código original.

- Después del port (`alps_init_observables`):

        92:   subroutine alps_init_observables(caller)
        93:     implicit none
        94:     include "alps/fortran/alps_fortran.h"
        95:     integer :: caller(2)
        96:
        97:     call alps_init_observable(1, ALPS_REAL, "Energy", caller)
        98:     call alps_init_observable(1, ALPS_REAL, "Magnetization", caller)
        99:
        100:    return
        101:  end subroutine alps_init_observables

Los observables llamados `"Energy"` y `"Magnetization"` se registran como buffers para los resultados. En el código original, las sumas y sumas de cuadrados se acumulaban manualmente en el arreglo `A`; después del port, `alps_accumulate_observable` se encarga de esto automáticamente.

#### Cálculo y guardado de resultados

El código original usa un bucle `DO` (línea 25) para la iteración. Después del port, `alps_run` realiza una iteración por llamada — ALPS gestiona el bucle llamando repetidamente a `alps_run` hasta que `alps_progress` devuelve ≥ 1.0.

- Antes del port:

        24:   C SIMULATION
        25:         DO 30 K=1,MCS+INT
        26:         KIJ=0
        27:         DO 31 I=1,L
        28:         DO 31 J=1,L
        29:         M=IS(IP(I),J)+IS(I,IP(J))+IS(IM(I),J)+IS(I,IM(J))
        30:         KIJ=KIJ+1
        31:         IS(I,J)=-1
        32:         IX=IAND(IX*5*11,2147483647)
        33:         IF(P(M).GT.V0*IX) IS(I,J)=1
        34:    31   CONTINUE
        35:   C DATA
        36:         IF(K.LE.INT) GOTO 30
        37:         EN=0
        38:         MG=0
        39:         DO 40 I=1,L
        40:         DO 40 J=1,L
        41:         EN=EN+IS(I,J)*(IS(IP(I),J)+IS(I,IP(J)))
        42:    40   MG=MG+IS(I,J)
        43:         A(1)=A(1)+EN
        44:         A(2)=A(2)+EN**2
        45:         A(3)=A(3)+MG
        46:         A(4)=A(4)+MG**2
        47:    30   CONTINUE

- Después del port (`alps_run`):

        56:   ! subroutine alps_run
        57:   subroutine alps_run(caller)
        58:     use ising_mod
        59:     implicit none
        60:     include "alps/fortran/alps_fortran.h"
        61:     integer :: caller(2)
        62:     integer :: i, j, M
        63:     real*8 :: EN, MG
        64:
        65:     do i = 1, L
        66:        do j = 1, L
        67:           M = IS(IP(i), j) + IS(i, IP(j)) + IS(IM(i), j) + IS(i, IM(j))
        68:           IS(i, j) = -1
        69:
        70:           IX = IAND(IX * 5 * 11, 2147483647)
        71:           if(P(M).gt.V0*IX) IS(i, j) = 1
        72:        end do
        73:     end do
        74:
        75:     EN = 0.0D0
        76:     MG = 0.0D0
        77:     do i = 1, L
        78:        do j = 1, L
        79:           EN = EN + IS(i, j) * (IS(IP(i), j) + IS(i, IP(j)))
        80:           MG = MG + IS(i, j)
        81:        end do
        82:     end do
        83:
        84:     call alps_accumulate_observable(EN, 1, &
               ALPS_DOUBLE_PRECISION, "Energy", caller)
        85:     call alps_accumulate_observable(MG, 1, &
               ALPS_DOUBLE_PRECISION, "Magnetization", caller)
        86:     K = K + 1
        87:
        88:     return
        89:   end subroutine alps_run

El cálculo (líneas 65–82) es idéntico al original. El bucle externo `DO 30` está ausente — ALPS llama a `alps_run` repetidamente en su lugar. La línea 86 incrementa `K` para llevar la cuenta de las iteraciones. Las líneas 84–85 registran los resultados mediante `alps_accumulate_observable`; la suma y el cuadrado que se hacían manualmente en el original (líneas 43–46) se gestionan automáticamente mediante el observable.

- Después del port (`alps_progress`):

        103:  ! alps_progress
        104:  subroutine alps_progress(prgrs, caller)
        105:    use ising_mod
        106:    implicit none
        107:    include "alps/fortran/alps_fortran.h"
        108:    integer :: caller(2)
        109:    real*8 :: prgrs
        110:
        111:    prgrs = K / (INT + MCS)
        112:
        113:  end subroutine alps_progress

`alps_progress` controla cuándo se detiene la iteración. Una vez que `prgrs ≥ 1.0` (es decir, `K ≥ INT + MCS`), ALPS deja de llamar a `alps_run`.

#### Verificación de termalización

En el código original, la verificación de termalización está incrustada en el bucle principal (línea 36). Después del port se convierte en una subrutina separada.

- Antes del port:

        36:         IF(K.LE.INT) GOTO 30

- Después del port (`alps_is_thermalized`):

        115:  ! alps_is_thermalized
        116:  subroutine alps_is_thermalized(thrmlz, caller)
        117:    use ising_mod
        118:    implicit none
        119:    include "alps/fortran/alps_fortran.h"
        120:    integer :: caller(2)
        121:    integer :: thrmlz
        122:
        123:    if(K >= INT) then
        124:       thrmlz = 1
        125:    else
        126:       thrmlz = 0
        127:    end if
        128:
        129:    return
        130:  end subroutine alps_is_thermalized

Al igual que con `alps_progress`, el estado de termalización se determina a partir del contador de iteraciones `K`. Cuando `thrmlz = 1`, ALPS comienza a guardar los resultados de medición.

#### Salida y post-procesamiento

Al usar ALPS, la salida y el post-procesamiento se manejan automáticamente. El código de salida del programa original no es necesario después del port.

- Antes del port:

        48:   C STATISTICS
        49:         DO 50 I=1,4
        50:    50   A(I)=A(I)/MCS
        51:         C=(A(2)-A(1)**2)/L**2/TEMP**2
        52:         X=(A(4)-A(3)**2)/L**2/TEMP
        53:         ENG=A(1)/L**2
        54:         AMG=A(3)/L**2
        55:         WRITE(6,100) TEMP,L,ENG,C,AMG,X
        56:    100  FORMAT(' TEMP=',F10.5,' SIZE=',I5,
        57:        * /' ENG =',F10.5,' C   =',F10.5,
        58:        * /' MAG =',F10.5,' X   =',F10.5)

- Después del port: no se requiere código.

#### Finalización

El código original no tiene limpieza explícita porque usa arreglos estáticos. Después del port, los arreglos asignados dinámicamente deben liberarse en `alps_finalize`.

- Antes del port: no se requiere código.

- Después del port (`alps_finalize`):

        160:  ! alps_finalize
        161:  subroutine alps_finalize(caller)
        162:    use ising_mod
        163:    implicit none
        164:    include "alps/fortran/alps_fortran.h"
        165:    integer :: caller(2)
        166:
        167:    deallocate(IP)
        168:    deallocate(IM)
        169:    deallocate(P)
        170:    deallocate(IS)
        171:
        172:    return
        173:  end subroutine alps_finalize

#### Soporte de reinicio (restart)

Implementar `alps_save` y `alps_load` añade capacidad de punto de control/reinicio (checkpoint/restart). El código original no tiene soporte de reinicio; el ejemplo siguiente muestra cómo añadirlo.

- Antes del port: no se requiere código.

- Después del port (`alps_save`):

        132:  ! alps_save
        133:  subroutine alps_save(caller)
        134:    use ising_mod
        135:    implicit none
        136:    include "alps/fortran/alps_fortran.h"
        137:    integer :: caller(2)
        138:
        139:    call alps_dump(K, 1, ALPS_INT, caller)
        140:    call alps_dump(IX, 1, ALPS_INT, caller)
        141:    call alps_dump(IS, L * L, ALPS_INT, caller)
        142:
        143:    return
        144:  end subroutine alps_save

Solo se guardan las variables necesarias para reanudar el cálculo (`K`, `IX`, `IS`).

- Después del port (`alps_load`):

        146:  ! alps_load
        147:  subroutine alps_load(caller)
        148:    use ising_mod
        149:    implicit none
        150:    include "alps/fortran/alps_fortran.h"
        151:    integer :: caller(2)
        152:
        153:    call alps_restore(K, 1, ALPS_INT, caller)
        154:    call alps_restore(IX, 1, ALPS_INT, caller)
        155:    call alps_restore(IS, L * L, ALPS_INT, caller)
        156:
        157:    return
        158:  end subroutine alps_load

Los datos deben restaurarse en el mismo orden en que fueron guardados. Nótese que cuando un programa ALPS se reinicia, `alps_init` se llama antes que `alps_load`, por lo que la asignación de memoria y la inicialización de variables ocurren en `alps_init` como de costumbre — `alps_load` solo necesita restaurar los valores guardados.

#### Soporte multi-hilo

Para ejecutar con paralelismo a nivel de hilos, todas las variables del módulo accedidas por las subrutinas paralelas deben declararse `threadprivate`. Añade la siguiente línea a `ising_mod`:

- Después del port (multi-hilo):

        1:    module ising_mod
        2:      implicit none
        3:      real, parameter :: V0 = .465661288D-9
        4:
        5:      integer, allocatable, dimension(:) :: IP, IM
        6:      integer, allocatable, dimension(:,:) :: IS
        7:      real*8, allocatable, dimension(:) :: P
        8:      integer :: K, MCS, INT, L, IX
        9:      real :: TEMP
        10:   !$omp threadprivate (K, MCS, INT, TEMP, IP, IM, P, IS, IX, L)
        11:   end module ising_mod

### Sobre `main.C`

El archivo `main.C` proporciona el punto de entrada del programa. El cuerpo de `main` en sí no necesita cambiar; actualiza solo las cadenas de metadatos como se describe en la sección [Punto de entrada](#punto-de-entrada) anterior.

### Sobre `CMakeLists.txt`

Actualiza `CMakeLists.txt` para que coincida con los nombres de tus archivos fuente. A continuación se muestra un ejemplo completo:

    cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
    
    project(tutorial)
    
    find_package(ALPS REQUIRED NO_SYSTEM_ENVIRONMENT_PATH)
    message(STATUS "ALPS version: ${ALPS_VERSION}")
    include(${ALPS_USE_FILE})
    
    add_executable(tutorial main.C tutorial.f90)
    target_link_libraries(tutorial ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
