---
title: Alpsize-03 Fortran Application Development
math: true
toc: true
weight: 4
---

ALPS Fortran provides Fortran interface modules for the ALPS system. By implementing a small set of required subroutines, you can run a Fortran program under the ALPS scheduler and take advantage of its parallelization, parameter management, and result-aggregation features. This chapter describes how to write a Fortran program that runs on ALPS, and how to port an existing Fortran program into the ALPS Fortran framework.

## Introduction to ALPS Fortran

The following figure shows the relationship between the ALPS system, ALPS Fortran, and a user Fortran program.

![ALPS Fortran module](../figs/fortranmodule.png)

ALPS calls ALPS Fortran, which in turn calls the subroutines of the user program as needed. This allows ALPS to control a Fortran program in the same way it controls a C++ program. ALPS Fortran also provides subroutines that give the user program access to ALPS functions, so the user program can call ALPS features as if they were ordinary Fortran subroutines.

## Call Flow

The following figure shows the call flow between the ALPS system and the user program.

![Call flow](../figs/callflow.png)

## Preparing the Fortran Source Code

To implement a program using ALPS Fortran, you need to prepare two source files:

- A **C++ source file** that defines the `main` function (the entry point of the program).
- A **Fortran source file** that implements the subroutines required by ALPS Fortran.

### Entry Point

The `main` function sets program metadata such as the version number, copyright notice, worker name, and evaluator name. In most cases the body of `main` does not need to change — only the metadata strings need to be updated for your program.

The following is an example C++ entry point:

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

Replace the example strings (`"my version"`, `"my copyright"`, `"worker name"`, `"evaluator name"`) with values appropriate for your program.

### Fortran Source Code

The main content of the Fortran source file is the calculation logic. However, you must always implement a set of required subroutines so that ALPS Fortran can control your program. When loading parameters or saving results, you call subroutines provided by ALPS Fortran rather than handling I/O directly.

#### Required Subroutines

The following subroutines must be present in the Fortran source file. If any are missing, the build will fail with a link error.

Every required subroutine receives `caller` as an argument — an integer array used internally by ALPS Fortran to invoke ALPS functions. **Do not modify the value of `caller`.** Undefined behaviour results if its value is changed.

Each subroutine must include `alps/fortran/alps_fortran.h`:

    subroutine alps_init(caller)
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    
    ! --- your code here --- !

---

**`alps_init(caller)`**

| **Type** | **Name** | **I/O** | **Meaning** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | internal ALPS handle — do not modify |

Called once before the calculation begins. Use this subroutine for initialization: allocate arrays and read parameters.

---

**`alps_init_observables(caller)`**

| **Type** | **Name** | **I/O** | **Meaning** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | internal ALPS handle |

Called once after `alps_init`. Use this subroutine to register the observables (measurement quantities) with `alps::ObservableSet`. Called once per set of input parameters. See the [ALPS documentation](https://alps.comp-phys.org) for details on `alps::ObservableSet`.

---

**`alps_run(caller)`**

| **Type** | **Name** | **I/O** | **Meaning** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | internal ALPS handle |

Contains the core calculation logic. ALPS calls this subroutine repeatedly until `alps_progress` returns a value ≥ 1.0. Because ALPS manages the iteration loop, **do not write an outer loop inside `alps_run`**. When running with thread-level parallelism, this subroutine executes on multiple threads simultaneously and must be thread-safe.

---

**`alps_progress(prgrs, caller)`**

| **Type** | **Name** | **I/O** | **Meaning** |
| :------- | :------- | :------ | :---------- |
| real\*8  | prgrs    | out | progress indicator (0.0 ≤ prgrs; calculation ends when prgrs ≥ 1.0) |
| integer  | caller(2) | in | internal ALPS handle |

Called by ALPS after each call to `alps_run`. While `prgrs < 1.0`, ALPS continues calling `alps_run`. When `prgrs ≥ 1.0`, ALPS considers the calculation complete and stops. Must be thread-safe when running with thread-level parallelism.

---

**`alps_is_thermalized(thrmlz, caller)`**

| **Type** | **Name** | **I/O** | **Meaning** |
| :------- | :------- | :------ | :---------- |
| integer  | thrmlz   | out | thermalization flag: 0 = not yet thermalized, 1 = thermalized |
| integer  | caller(2) | in | internal ALPS handle |

Called by ALPS after each `alps_run`. While `thrmlz = 0`, ALPS does not save measurement results (the system is still thermalizing). When `thrmlz = 1`, ALPS begins saving results. Must be thread-safe when running with thread-level parallelism.

---

**`alps_finalize(caller)`**

| **Type** | **Name** | **I/O** | **Meaning** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | internal ALPS handle |

Called once after `alps_progress` returns a value ≥ 1.0. Use this subroutine for cleanup: deallocate arrays and release any other resources.

---

**`alps_save(caller)`**

| **Type** | **Name** | **I/O** | **Meaning** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | internal ALPS handle |

Called by ALPS after each `alps_run`. Write checkpoint data to the restart file using `alps_dump`. Must be thread-safe when running with thread-level parallelism.

---

**`alps_load(caller)`**

| **Type** | **Name** | **I/O** | **Meaning** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | internal ALPS handle |

Called once when the program is restarted. Load checkpoint data from the restart file using `alps_restore`.

---

#### Subroutines Provided by ALPS Fortran

To call ALPS functions from your Fortran program, use the subroutines provided by ALPS Fortran. Each takes `caller(2)` as a parameter; pass the `caller` variable received by the enclosing required subroutine.

---

**`alps_get_parameter(data, name, type, caller)`**

| **Type**  | **Name**   | **I/O** | **Meaning** |
| :-------- | :--------- | :------ | :---------- |
| —         | data       | out | variable to receive the parameter value |
| character | name(\*)   | in  | parameter name |
| integer   | type       | in  | data type constant (defined in `alps_fortran.h`) |
| integer   | caller(2)  | in  | internal ALPS handle |

Reads a named parameter from the ALPS parameter file into `data`. Typically called inside `alps_init`. The available type constants are defined in `alps_fortran.h`.

---

**`alps_parameter_defined(res, name, caller)`**

| **Type**  | **Name**   | **I/O** | **Meaning** |
| :-------- | :--------- | :------ | :---------- |
| integer   | res        | out | 1 if the parameter is defined, 0 if not |
| character | name(\*)   | in  | parameter name |
| integer   | caller(2)  | in  | internal ALPS handle |

Returns whether the named parameter is present in the parameter file. Typically used in `alps_init` to handle optional parameters.

---

**`alps_init_observable(count, type, name, caller)`**

| **Type**  | **Name**   | **I/O** | **Meaning** |
| :-------- | :--------- | :------ | :---------- |
| integer   | count      | in | number of elements in the observable |
| integer   | type       | in | data type constant |
| character | name(\*)   | in | name to register the observable under |
| integer   | caller(2)  | in | internal ALPS handle |

Registers a named observable with `alps::ObservableSet` inside `alps_init_observables`. The observable type is determined by `type` and `count`:

| **type** | **count** | **Observable type** |
| :------- | :-------- | :------------------ |
| ALPS_INT                | 1   | IntObservable |
| ALPS_INT                | > 1 | IntVectorObservable |
| ALPS_REAL               | 1   | RealObservable |
| ALPS_REAL               | > 1 | RealVectorObservable |
| ALPS_DOUBLE_PRECISION   | 1   | RealObservable |
| ALPS_DOUBLE_PRECISION   | > 1 | RealVectorObservable |

---

**`alps_accumulate_observable(data, count, type, name, caller)`**

| **Type**  | **Name**   | **I/O** | **Meaning** |
| :-------- | :--------- | :------ | :---------- |
| —         | data       | in  | value(s) to record |
| integer   | count      | in  | number of elements |
| integer   | type       | in  | data type constant |
| character | name(\*)   | in  | name of the observable to store into |
| integer   | caller(2)  | in  | internal ALPS handle |

Records a measurement result into a named observable. Called inside `alps_run`. The `count`, `type`, and `name` must match those used in `alps_init_observable`.

---

**`alps_dump(data, count, type, caller)`**

| **Type**  | **Name**  | **I/O** | **Meaning** |
| :-------- | :-------- | :------ | :---------- |
| —         | data      | in  | data to save |
| integer   | count     | in  | number of elements |
| integer   | type      | in  | data type constant |
| integer   | caller(2) | in  | internal ALPS handle |

Writes data to the restart file. Called inside `alps_save`. Data saved with `alps_dump` must be restored in the same order using `alps_restore`.

---

**`alps_restore(data, count, type, caller)`**

| **Type**  | **Name**  | **I/O** | **Meaning** |
| :-------- | :-------- | :------ | :---------- |
| —         | data      | out | storage location for loaded data |
| integer   | count     | in  | number of elements |
| integer   | type      | in  | data type constant |
| integer   | caller(2) | in  | internal ALPS handle |

Reads data from the restart file. Called inside `alps_load`. Data must be restored in the same order it was saved by `alps_dump`.

---

### Editing the CMakeLists.txt

User programs are built with CMake, just like ALPS itself. Below is a sample `CMakeLists.txt`. Replace `hello_sample`, `hello`, `main.C`, and `hello_impl.f` with the actual names for your project:

    # CMakeLists.txt
    
    cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
    
    project(hello_sample)
    
    find_package(ALPS REQUIRED NO_SYSTEM_ENVIRONMENT_PATH)
    message(STATUS "ALPS version: ${ALPS_VERSION}")
    include(${ALPS_USE_FILE})
    
    add_executable(hello main.C hello_impl.f)
    target_link_libraries(hello ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})

## Porting an Existing Fortran Program

This section walks through porting the Ising model program `ising_original.f` to ALPS Fortran, using the tutorial files extracted from `alps_fortran.tar.gz`.

### Preparing for the Port

Copy the following files from the tutorial directory to your working directory:

- `ising_original.f` — original source code
- `template.f90` — ALPS Fortran program template
- `main.C` — entry point
- `CMakeLists.txt` — build configuration template

`template.f90` contains stub definitions of all required subroutines. For a new program, start from `template.f90` rather than writing the subroutines from scratch.

The structure of the original code is:

| Lines   | Processing |
| :------ | :--------- |
| 4–7     | Variable declaration and initialization |
| 8–23    | Array element initialization |
| 24–47   | Main loop |
| 25–34   | Calculation |
| 36      | Thermalization check |
| 37–46   | Saving results |
| 48–58   | Results output |

### Porting the Fortran Code

Each block of `ising_original.f` is assigned to a corresponding ALPS Fortran subroutine. The file `tutorial/alps_ising.f90` is the completed ported version.

#### Variable Declaration

Variables declared in `ising_original.f` must be moved into an ALPS Fortran module so they are accessible from multiple subroutines.

- Before porting:

        4:    DIMENSION IS(20,20),IP(20),IM(20),P(-4:4),A(4)
        5:    C PARAMETERS
        6:          DATA TEMP/2.5/, L/10/, MCS/1000/, INT/1000/
        7:          DATA IX/1234567/, V0/.465661288D-9/

- After porting:

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

`IP`, `IM`, `IS`, and `P` are allocated in `alps_init`, so their sizes are not fixed here. Array `A` (which stored accumulated results) is replaced by ALPS observables and is no longer needed. Variable values are read from the parameter file at runtime. `K` is added to count iterations; the thermalization check after porting is handled by monitoring `K` rather than using a loop with `GOTO`.

**Note: the MPI version of this example does not need to be thread-safe, so thread safety is not considered here.**

#### Initialization

The initialization block of the original code (array setup) becomes `alps_init`. Parameters are read from the parameter file via `alps_get_parameter`, and observables for storing results are registered in `alps_init_observables`. ALPS calls these subroutines automatically — you do not call them yourself.

- Before porting:

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

- After porting (`alps_init`):

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

Lines 21–24 call `alps_get_parameter` to read the parameter values from the ALPS parameter file. The array setup (lines 34–51) is otherwise identical to the original code.

- After porting (`alps_init_observables`):

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

Observables named `"Energy"` and `"Magnetization"` are registered as buffers for the results. In the original code, sums and sums of squares were accumulated manually in array `A`; after porting, `alps_accumulate_observable` handles this automatically.

#### Calculation and Saving Results

The original code uses a `DO` loop (line 25) for iteration. After porting, `alps_run` performs one iteration per call — ALPS manages the loop by repeatedly calling `alps_run` until `alps_progress` returns ≥ 1.0.

- Before porting:

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

- After porting (`alps_run`):

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

The calculation (lines 65–82) is identical to the original. The outer `DO 30` loop is absent — ALPS calls `alps_run` repeatedly instead. Line 86 increments `K` to track iterations. Lines 84–85 record results via `alps_accumulate_observable`; the summation and squaring done manually in the original (lines 43–46) is handled automatically by the observable.

- After porting (`alps_progress`):

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

`alps_progress` controls when iteration stops. Once `prgrs ≥ 1.0` (i.e., `K ≥ INT + MCS`), ALPS stops calling `alps_run`.

#### Thermalization Check

In the original code, the thermalization check is embedded in the main loop (line 36). After porting it becomes a separate subroutine.

- Before porting:

        36:         IF(K.LE.INT) GOTO 30

- After porting (`alps_is_thermalized`):

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

As with `alps_progress`, the thermalization state is determined from the iteration counter `K`. When `thrmlz = 1`, ALPS begins saving measurement results.

#### Output and Post-processing

When using ALPS, output and post-processing are handled automatically. The output code in the original program is not needed after porting.

- Before porting:

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

- After porting: no code required.

#### Finalization

The original code has no explicit cleanup because it uses static arrays. After porting, dynamically allocated arrays must be deallocated in `alps_finalize`.

- Before porting: no code required.

- After porting (`alps_finalize`):

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

#### Restart Support

Implementing `alps_save` and `alps_load` adds checkpoint/restart capability. The original code has no restart support; the example below shows how to add it.

- Before porting: no code required.

- After porting (`alps_save`):

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

Only the variables needed to resume computation (`K`, `IX`, `IS`) are saved.

- After porting (`alps_load`):

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

Data must be restored in the same order it was saved. Note that when an ALPS program restarts, `alps_init` is called before `alps_load`, so memory allocation and variable initialization happen in `alps_init` as usual — `alps_load` only needs to restore the saved values.

#### Multi-thread Support

To run with thread-level parallelism, all module variables accessed by the parallel subroutines must be declared `threadprivate`. Add the following line to `ising_mod`:

- After porting (multi-thread):

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

### About `main.C`

The `main.C` file provides the program entry point. The body of `main` itself does not need to change; update only the metadata strings as described in the [Entry Point](#entry-point) section above.

### About `CMakeLists.txt`

Update `CMakeLists.txt` to match your source file names. The following is a complete example:

    cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
    
    project(tutorial)
    
    find_package(ALPS REQUIRED NO_SYSTEM_ENVIRONMENT_PATH)
    message(STATUS "ALPS version: ${ALPS_VERSION}")
    include(${ALPS_USE_FILE})
    
    add_executable(tutorial main.C tutorial.f90)
    target_link_libraries(tutorial ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
