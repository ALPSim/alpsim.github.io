
---
title: Alpsize-03 Fortran Application Development
math: true
toc: true
weight: 4
---

ALPS Fortran is the Fortran interface modules of ALPS. Using ALPS Fortran, You can run Fortran code program easily on ALPS by implementing some necessary subroutine. This chapter describes the procedures for writing the Fortran code to run on ALPS. In addition, also described in this chapter on how to modify (`CMakeList.txt`) file setting procedures and build the Fortran code to be ported to the existing ALPS Fortran.

## Introduction ALPS Fortran

The following figure shows the relationship diagram between ALPS system,ALPS Fortran,and user fortran program.

![ALPS Fortran module](../figs/fortranmodule.png)

ALPS Fortran is called from the ALPS, call the Subroutine of the user program as necessary.Thus, ALPS can control the Program has been implemented in Fortran as well as the C++ Program.On the other hand, ALPS Fortran has provided a Subroutine call the functions of ALPS.Therefore, user program will be able to use the ALPS functions as well as to call the normal Fortran Subroutine.

## call flows subroutine

The following figure shows the flow chart of the ALPS system and user program. Subroutines for each of the below, refer to the [2.3.3].

![Call flow](../figs/callflow.png)

## Preparation fortran source code

To implement the Program using ALPS Fortran, you will need to prepare following two source code.

- C++ source code for implementing main function(entory point of Program).
- Fortran source code for implementing according to a rule of the ALPS Fortran.

### Entry Point　

This section describes the setting Program function main, such as main function(entry point of the Program) and the worker name. Main function is only to describe the fixed contents, usually does not need to be changed. Settings with Program, please refer to the following code,

- Program version numbers
- Program copyright
- Worker name
- Evaluator name

The following is an example of a C + + source code.

    1:    #include <alps/parapack/parapack.h>
    2:    #include "fortran_wrapper.h"
    3:    
    4:    // Version number setting
    5:    PARAPACK_SET_VERSION("my version");
    6:    
    7:    // Copywrite display setting
    8:    PARAPACK_SET_COPYRIGHT("my copyright");
    9:    
    10:    // Worker name setting
    11:    PARAPACK_REGISTER_WORKER(alps::fortran_wrapper, "worker name</span>");
    12:    
    13:    // Evaluator setting
    14:    PARAPACK_REGISTER_EVALUATOR(alps::parapack::simple_evaluator,"evaluator name");
    15:    
    16:    
    17:    /**
    18:     * Programのentry point
    19:     */
    20:    int main(int argc, char** argv)
    21:    {
    22:        return alps::parapack::start(argc, argv);
    23:    }

In the above example, it needs to be changed will be the red part characters.

### Fortran source code

The main contents of the Fortran source code is the calculation logic. However, there is always a need to implement some Subroutine to use the ALPS Fortran.You call the ALPS function via the Subroutine provided by the ALPS Fortran when performing the loading of the parameters and saving the calculation results.

#### required Subroutine　

for the user program to control the function of ALPS, you will need some Subroutine in the Fortran source code.read on below for a description of each Subroutine,Implement appropriately,and is a link error if you omit them, you can not build. when implementing these Subroutine, keep in mind the following points:

- All Subroutine will be passed "(2) :: caller integer" as argument.caller is a variable that is used internally to take ALPS function.Therefore, please do not rewrite the value of the caller. If the value of caller behavior has been changed is not guaranteed.

- include the "alps / fortran / alps_fortran.h" In each Subroutine. This file will be required when calling the ALPS functions from Fortran code.

So, with regard to the Subroutine required, you will need the following three lines immediately below the signature of the Subroutine.

    1:    subroutine alps_init(caller)
    2:    implicit none
    3:    include "alps/fortran/alps_fortran.h"
    4:    integer :: caller(2)
    5:    
    6:    ! --- snip --- !

**`alps_init(caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
|integer  |  caller(2)  |  in  |  local variable |

- Explanation

This Subroutine will be called once before the calculation is performed.This is where the initialization process of the Program like as allocating arrays.

**`alps_init_observables(caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  local variable |

- Explanation

This Subroutine will be called only once after it has been a call is `alps_init`. This is where you initialize the `alps :: ObservableSet`.This Subroutine is called once in one input parameter. Incidentally, detail information of the `alps :: ObservableSet`, refer to the ALPS HP.

**`alps_run(caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  local variable |

- Explanation

This subroutine is implemented the logic calculation.until it returns a value greater than or equal to 1.0 by alps_progress,This Subroutine is called repeatedly from ALPS.Therefore, in this Subroutine is necessary to take the loop structure is not available. In addition,while running at thread-level-parallelism,this subroutine work on multi-threading.Therefore, when used in thread-level-parallelism is required to provide thread-safe implementation

**`alps_progress(prgrs, caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| real\*8  |  prgrs  |  out  |  Programの進捗状態(0.0 ≦ prgrs) |
| integer  |  caller(2)  |  in   | local variable |

- Explanation

This Subroutine will be called by the ALPS has been finished after `alps_run`, ALPS is returned to the progress situation of the Program.While the prgrs value less than 1.0, ALPS will call repeatedly `alps_run`. When `prgrs` value more than 1.0 are substituted, ALPS judges that a calculation was completed, and will finish the program.In addition,while running at thread-level-parallelism,this subroutine work on multi-threading.Therefore, when used in thread-level-parallelism is required to provide thread-safe implementation

**`alps_is_thermalized(thrmlz, caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| real\*8  |  thrmlz   | out   | thermalize ending flag(0:Not Completed / 1:Completed ) |
| integer  |  caller(2) |   in  |  local variable |

- Explanation

This Subroutine will be called by the ALPS has been finished after alps_run, returns the incomplete / complete thermalize.When a value of thrmlz is 0, Program judges the calculation is now in thermalize, and does not save a calculation result data.On the other hand,value is 1, Program judges that thermalize was completed, and the calculation result saving is started. In addition,while running at thread-level-parallelism,this subroutine work on multi-threading.Therefore, when used in thread-level-parallelism is required to provide thread-safe implementation

**`alps_finalize(caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  local variable |

- Explanation

This Subroutine will be called only once (after returning the value greater than or equal to 1.0 from alps_progress) after completing your calculation. This is where you end processing such as the release of allocated memory.

**`alps_save(caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in   | local variable |

- Explanation

This subroutine is called from ALPS has been finished after `alps_run`. Saves the restartrestart-file using the function of ALPS.In addition,while running at thread-level-parallelism,this subroutine work on multi-threading.Therefore, when used in thread-level-parallelism is required to provide thread-safe implementation.

**`alps_load(caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  local variable |

- Explanation

This Subroutine will be called once, when the Program is restart. Load the saved restart-file using the ALPS functions.

#### Subroutine provided ALPS Fortran

When you call the ALPS functions from the user program, call the Subroutine provided by the ALPS Fortran. These subroutine will require "(2) :: caller integer" as argument. caller is a local variable that is passed from the ALPS Fortran, you will need to pass the Subroutine provided as a variable passed in the argument to (2.2.3.1) Subroutine required.

**`alps_get_parameter(data, name, type, caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| -  |  data  |  out  |   store of the value |
| character   | name(\*)  |  in  |  parameter name to take out |
| integer  |  type  |  in  |  data type |
| integer  |  caller(2)  |  in  |  local variable |

- Explanation

Specify the name, ane receive a parameter from ALPS. parameter name, type, number of elements is specified **name**, **type**, in each count.This Subroutine will be used to initialize the arrays and variables in the mainly `alps_init`. In addition, the possible value of the type is defined in the `alps_fortran.h`.

**`alps_parameter_defined(res, name, caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  res   | out  |  The presence or absence of definition of parameter(1:absence / 0:definition) |
| character  |  name(\*)  |  in  |  parameter name |
| integer  |  caller(2)  |  in  |  local variable |

- Explanation

Returns whether the parameter is defined in the parameter file is specified by **name**. *1Italic* text is assigned to the res if it is defined. *0Italic* text is assigned if it is not.This Subroutine will be used to initialize the arrays and variables in the mainly `alps_init`.

**`alps_init_observable(count, type, name, caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  count  |  in   | Number of element of a stored calculation result |
| integer  |  type  |  in  |  data type |
| character  |  name(\*)  |  in  |  The name of Observable to store |
| integer  |  caller(2)  |  in  |  local variable |

- Explanation

This Subroutine is used to register a name that is specified in the Observable to `alps :: ObservableSet` in `alps_init_observable`. Observable types are determined as follows by **type** and **count**.

| **type** | **count** | **Observable** |
| :------- | :-------- | :------------- |
| ALPS_INT  |  1   | IntObservable |
| ALPS_INT  |  1\<  |  in |
| ALPS_REAL  |  1  |  RealObservable |
| ALPS_REAL  |  1\<  |  RealVectorObservable |
| ALPS_DOUBLE_PRECISION  |  1   | RealObservable |
| ALPS_DOUBLE_PRECISION  |  1\<  |  RealVectorObservable |


**`alps_accumulate_observable(data, count, type, name, caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| -   | data  |  in   | the calculation results to store |
| integer  |  count   | in  |  Number of element of a stored calculation result |
| integer  |  type  |  in  |  data type |
| character  |  name(\*)  |  in   | The name of Observable to store |
| integer  |  caller(2)  |  in  |  local variable |

- Explanation

Save the result data to Observable with the specified name. This Subroutine is used to store the results of a calculation in `alps_run`. count / name / type must match the ones specified in `init_observable`.

**`alps_dump(data, count, type, caller)`**

- Argument
| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| -  |  data  |  in  |  the values to store |
| integer  |  count  |  in  |  Number of elements of values to store |
| integer  |  type  |  in  |  data type |
| integer  |  call(2)  |  in  |  local variable |

- Explanation

This Subroutine is used to save the restart-file in the `alps_save`. interruption data was saved using `alps_dump` will be used at restart.

**`alps_restore(data, count, type, caller)`**

- Argument

| **Type**  |  **Name**  |  **I/O**  |  **Meaning** |
| :-------  |  :-------  |  :------  |  :---------- |
| -  |  data   | out  |  storage location of loaded values |
| integer  |  count  |  in  |  Number of element of value to load |
| integer  |  type  |  in  |  data type |
| integer  |  caller(2)  |  in  |  local variable |

- Explanation

This Subroutine is used to load the restart-file in the `alps_load` to restart-file data is saved in the order in which they were saved in `alps_dump`. Therefore, when loading is `alps_restore`, remove the data in the same order as when it is saved.

### editing configuration file

user program builds using CMake as well as ALPS. It is a sample of setting file(`CMakeLists.txt`) to build user program in CMake as follows.

    1:    # CMakeList.txt
    2:    # editing configuration file for CMake
    3:    
    4:    cmake_minimum_required(VERSION 2.8.0 FATAL_ERROR)
    5:    
    6:    #Project name setting
    7:    project(**hello_sample**)
    8:    
    9:    # find ALPS Fortran setting
    10:    find_package(ALPS REQUIRED NO_SYSTEM_ENVIRONMENT_PATH)
    11:    message(STATUS "ALPS version: ${ALPS_VERSION}")
    12:    include(${ALPS_USE_FILE})
    13:    
    14:    # Source code required to create and run file name
    15:    add_executable(**hello main.C hello_impl.f**)
    16:    # External library file required to generate execution
    17:    target_link_libraries(**hello** ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
    
In the above example, it needs to be changed will be the part of characters inside \*\*...\*\*.

## Porting of existing program code

In this section, in case of the ising model program shown below,Describes the procedure that ALPS to work on the existing Fortran Program.

### preparation porting　

In this section, we will use the file in the tutorial directory that is generated by extracting the `alps_fortran.tar.gz`.In preparation for the porting work, copy the following file to a working directory in the tutorial directory.

- `ising_original.f`：original source code
- `template.f90`：Template source cod of ALPS Fortran Program
- `main.C`：entry point of Program
- `CMakeList.txt`：Template of `CMakeList.txt`

All Subroutine which are necessary implementing ALPSProgram in `template.f90` is defined.Therefore, when developing a new Program you can proceed with the development based on `template.f90`.

The rough structure of original code is as follows.

|      | **Processing contents** |
| :--- | :---------------------- |
| 4-7  |  Variable Declaration & Initialization |
| 8-23  |  Array element Initialization |
| 24-47 |   main loop |
| 25-34  |  calculation |
| 36   | thermalize check |
| 37-46  |  saving calculation resutls |
| 48-58  |  results output |


### porting fortran code

The porting of Fortran code, we will assign to Subroutine, the processing being done in each block of `ising_original.f`. This section describes an example of `tutorial/alps_ising.f90` as a sample of after-porting code.

#### Variable declaration

Each variable has been declared in the `ising_original.f` is at the porting is turned into ALPS module.In order to porting to ALPS because there is a need to Subroutine for each processing unit, and modify it to allow access to the variables from each Subroutine.

- before porting

        4:    DIMENSION IS(20,20),IP(20),IM(20),P(-4:4),A(4)
        5:    C PARAMETERS
        6:          DATA TEMP/2.5/, L/10/, MCS/1000/, INT/1000/
        7:          DATA IX/1234567/, V0/.465661288D-9/


- after porting

        1:    module ising_mod
        2:      implicit none
        3:      real, parameter :: V0 = .465661288D-9
        4:
        5:      integer, allocatable, dimension(:) :: IP, IM
        6:      integer, allocatable, dimension(:,:) :: IS
        7:      real*8, allocatable, dimension(:) :: P
        8:      integer :: K, MCS, INT, L, IX
        9:      real :: TEMP
        10:    end module ising_mod
        11:

IP, IM, IS, P array are initialized in `alps_init`, the size of the after transplantation does not specify here.In addition, original array A is for storing a result, this array is in the after-porting will use the mechanism of ALPS.Therefore, array A is not necessary for code after the porting.Also, the value of each variable after porting gotten from the parameter file.In addition, K is a variable variable after the porting to count the number of iterations. Thermalize check after porting is responsible for control and repeat with the value of K to do without a loop.
**In this section, so that is expected to run in parallel MPI, for thread-safe is not considered.**

#### Initializing process

Initialization process of the original code may have to initialize each element of the array, at after-porting code, run in the initialization process is Subroutine `alps_init`.First,Initializes the array variables, using the `alps_get_parameter`, then initialize the array elements.Also, do not prepare the array for storing the results after porting, prepare the Observable for saving the results in `alps_init_observableSubroutine`.In addition, it is not necessary for `alps_init` and `alps_init_observable` to call it in after-porting code because it is called automatically by ALPS.Also, do not prepare an array for storing the results, prepare the Observable for saving the results in `alps_init_observableSubroutine`.

- before porting

        8:    C TABLES
        9:          DO 10 I=-4,4
        10:          W=EXP(FLOAT(I)/TEMP)
        11:     10   P(I)=W/(W+1/W)
        12:          DO 11 I=1,L
        13:          IP(I)=I+1
        14:     11   IM(I)=I-1
        15:          IP(L)=1
        16:          IM(1)=L
        17:    C INITIAL CONFIGURATION
        18:          DO 20 I=1,L
        19:          DO 20 J=1,L
        20:     20   IS(I,J)=1
        21:    C ACCUMULATION DATA RESET
        22:          DO 21 I=1,4
        23:     21   A(I)=0.0

- after porting(`alps_init`)

        13:    subroutine alps_init(caller)
        14:      use ising_mod
        15:      implicit none
        16:      include "alps/fortran/alps_fortran.h"
        17:      integer :: caller(2)
        18:      integer :: i, j
        19:      real*8 :: W
        20:
        21:      call alps_get_parameter(TEMP, "TEMPERATURE", ALPS_REAL, caller)
        22:      call alps_get_parameter(L, "L", ALPS_INT, caller)
        23:      call alps_get_parameter(MCS, "MCS", ALPS_INT, caller)
        24:      call alps_get_parameter(INT, "INT", ALPS_INT, caller)
        25:
        26:      allocate( IP(L) )
        27:      allocate( IM(L) )
        28:      allocate( P(-4:4) )
        29:      allocate( IS(L, L) )
        30:
        31:      K = 0
        32:      IX = 1234567
        33:
        34:      do i = -4, 4
        35:         W = exp(float(i)/TEMP)
        36:         P(i) = W / (W + 1/W)
        37:      end do
        38:
        39:      do i = 1, L
        40:         IP(i) = i + 1
        41:         IM(i) = i - 1
        42:      end do
        43:
        44:      do i = 1, L
        45:         do j = 1, L
        46:            IS(i, j) = 1
        47:         end do
        48:      end do
        49:
        50:      IP(L) = 1
        51:      IM(1) = L
        52:
        53:      return
        54:    end subroutine alps_init

Above code shows that it calls the `alps_get_parameter` in line 21 to 24, getting the contents of the parameter file through the ALPS.In addition, the processing of line 34-51 is the same as the original code.

- after porting(`alps_init_observables`)

        92:    subroutine alps_init_observables(caller)
        93:      implicit none
        94:      include "alps/fortran/alps_fortran.h"
        95:      integer :: caller(2)
        96:
        97:      call alps_init_observable(1, ALPS_REAL, "Energy", caller)
        98:      call alps_init_observable(1, ALPS_REAL, "Magnetization", caller)
        99:
        100:      return
        101:    end subroutine alps_init_observables
    
Observable are available with the name "Magnetization" and "Energy" as a buffer for storing the calculation result after porting.In the original code, calculates the sum of squares with the sum for each Magnetization and Energy, but,these calculations is done automatically by Observable after porting.

#### calcuration and saving results

Although there has been in the do loop iteration (line 25 original-code)in the original code, and after porting, uses the `alps_progressSubroutine` `alps_run` without a do loop.

- before porting

        24:    C SIMULATION
        25:          DO 30 K=1,MCS+INT
        26:          KIJ=0
        27:          DO 31 I=1,L
        28:          DO 31 J=1,L
        29:          M=IS(IP(I),J)+IS(I,IP(J))+IS(IM(I),J)+IS(I,IM(J))
        30:          KIJ=KIJ+1
        31:          IS(I,J)=-1
        32:          IX=IAND(IX*5*11,2147483647)
        33:          IF(P(M).GT.V0*IX) IS(I,J)=1
        34:     31   CONTINUE
        35:    C DATA
        36:          IF(K.LE.INT) GOTO 30
        37:          EN=0
        38:          MG=0
        39:          DO 40 I=1,L
        40:          DO 40 J=1,L
        41:          EN=EN+IS(I,J)*(IS(IP(I),J)+IS(I,IP(J)))
        42:     40   MG=MG+IS(I,J)
        43:          A(1)=A(1)+EN
        44:          A(2)=A(2)+EN**2
        45:          A(3)=A(3)+MG
        46:          A(4)=A(4)+MG**2
        47:     30   CONTINUE

- after porting(`alps_run`)

        56:    ! subroutine alps_run
        57:    subroutine alps_run(caller)
        58:      use ising_mod
        59:      implicit none
        60:      include "alps/fortran/alps_fortran.h"
        61:      integer :: caller(2)
        62:      integer :: i, j, M
        63:      real*8 :: EN, MG
        64:
        65:      do i = 1, L
        66:         do j = 1, L
        67:            M = IS(IP(i), j) + IS(i, IP(j)) + IS(IM(i), j) + IS(i, IM(j))
        68:            IS(i, j) = -1
        69:
        70:            IX = IAND(IX * 5 * 11, 2147483647)
        71:            if(P(M).gt.V0*IX) IS(i, j) = 1
        72:         end do
        73:      end do
        74:
        75:      EN = 0.0D0
        76:      MG = 0.0D0
        77:      do i = 1, L
        78:         do j = 1, L
        79:            EN = EN + IS(i, j) * (IS(IP(i), j) + IS(i, IP(j)))
        80:            MG = MG + IS(i, j)
        81:         end do
        82:      end do
        83:
        84:      call alps_accumulate_observable(EN, 1, &
                ALPS_DOUBLE_PRECISION, "Energy", caller)
        85:      call alps_accumulate_observable(MG, 1, &
                                                                                                                                                                                                                                                                                                                                            ALPS_DOUBLE_PRECISION, "Magnetization", caller)
        86:      K = K + 1
        87:
        88:      return
        89:    end subroutine alps_run

Calculation process itself(Line 65 to 82) is the same as the original code, after porting will be called automatically alps_run repeatedly, the loop at line 25 of the Original Code is not writted.Instead, it counts the number of iterations in line 86.Also, save the results of the calculation using the ALPS function(line 84 and 85).In the original code (lines 43-46 the original code) are performed, such as calculating the integrated and square, but these are done automatically by `alps_accumulate_observable`.

- after porting(alps_progress)

        103:    ! alps_progerss
        104:    subroutine alps_progress(prgrs, caller)
        105:      use ising_mod
        106:      implicit none
        107:      include "alps/fortran/alps_fortran.h"
        108:      integer :: caller(2)
        109:      real*8 :: prgrs
        110:
        111:      prgrs = K / (INT + MCS)
        112:
        113:    end subroutine alps_progress
    
after porting, Alps_progress done in the control of the iterative calculation.prgrs value is greater than or equal to 1 is `alps_run` will no longer be called.Therefore, it is implemented as prgrs value is greater than or equal to 1 to monitor the value of (K), the number of times when you are running counter provision.

#### thermalized check

In the original code, hermalized-check has been run within the main loop (line 36).However,after porting,run for subroutine `alps_is_thermalized`.

- before porting

        36:          IF(K.LE.INT) GOTO 30

- after porting(`alps_is_thermalized`)：

        115:    ! alps_is_thermalized
        116:    subroutine alps_is_thermalized(thrmlz, caller)
        117:      use ising_mod
        118:      implicit none
        119:      include "alps/fortran/alps_fortran.h"
        120:      integer :: caller(2)
        121:      integer :: thrmlz
        122:
        123:      if(K >= INT) then
        124:         thrmlz = 1
        125:      else
        126:         thrmlz = 0
        127:      end if
        128:
        129:      return
        130:    end subroutine alps_is_thermalized
    
Similarly `alps_progress`, checks the thermalized from the value of (K) counter. are considered to have been completed thermalize and become value thrmlz=1.

#### output results

Post-processing and output of the results is done automatically when you use the ALPS.Therefore, the codes for output of calculation results and post-processing are not required.

- before porting

        48:    C STATISTICS
        49:          DO 50 I=1,4
        50:     50   A(I)=A(I)/MCS
        51:          C=(A(2)-A(1)**2)/L**2/TEMP**2
        52:          X=(A(4)-A(3)**2)/L**2/TEMP
        53:          ENG=A(1)/L**2
        54:          AMG=A(3)/L**2
        55:          WRITE(6,100) TEMP,L,ENG,C,AMG,X
        56:     100  FORMAT(' TEMP=',F10.5,' SIZE=',I5,
        57:         * /' ENG =',F10.5,' C   =',F10.5,
        58:         * /' MAG =',F10.5,' X   =',F10.5)

- after porting：code not available

#### Finalizing process

There is no end processing is not performed for allocate in the original code. However, after porting must be deallocate array that you allocate in `alps_init`.

- before porting：code not available

- after porting(`alps_finalize`)

        160:    ! alps_finalize
        161:    subroutine alps_finalize(caller)
        162:      use ising_mod
        163:      implicit none
        164:      include "alps/fortran/alps_fortran.h"
        165:      integer :: caller(2)
        166:
        167:      deallocate(IP)
        168:      deallocate(IM)
        169:      deallocate(P)
        170:      deallocate(IS)
        171:
        172:      return
        173:    end subroutine alps_finalize

#### restart function

Only to implement (`alps_save` / `alps_load`), you can add functionality to restart restart-file Program I / O function of when you use the ALPS.The original code does not have the ability to restart, describes an example implementation of I / O function of the restart-file according to the ALPS below.

- before porting：code not available
- after porting(`alps_save`)

        132:    ! alps_save
        133:    subroutine alps_save(caller)
        134:      use ising_mod
        135:      implicit none
        136:      include "alps/fortran/alps_fortran.h"
        137:      integer caller(2)
        138:
        139:      call alps_dump(K, 1, ALPS_INT, caller)
        140:      call alps_dump(IX, 1, ALPS_INT, caller)
        141:      call alps_dump(IS, L * L, ALPS_INT, caller)
        142:
        143:      return
        144:    end subroutine alps_save

`alps_save` writes in `alps_dump` the only variables that need to restart.Here, This section shows how to export counter (K) and data (IX, IS) calculating.

- after porting(`alps_load`)

        146:    ! alps_load
        147:    subroutine alps_load(caller)
        148:      use ising_mod
        149:      implicit none
        150:      include "alps/fortran/alps_fortran.h"
        151:      integer :: caller(2)
        152:
        153:      call alps_restore(K, 1, ALPS_INT, caller)
        154:      call alps_restore(IX, 1, ALPS_INT, caller)
        155:      call alps_restore(IS, L * L, ALPS_INT, caller)
        156:
        157:      return
        158:    end subroutine alps_load

There are (`alps_restore`) must be loaded in the order alps_save exported in (`alps_dump`) In `alps_load`.However, when you restart the ALPSProgram, `alps_init` will be called before `alps_load` is called. However, when you restart the ALPSProgram, `alps_init` will be called before `alps_load` is called. In other words, the initialization of the memory allocation K,IX,and IS and other variables is done in `alps_init`, need to do initialization, etc. within the `alps_load` is not available.

#### About support of multi-thread

If you want to run with multi-thread the ALPSProgram, must be thread-safe implementation of the Fortran code.If `tutorial.f90` described in this section, you can support multi-thread by thread-local variables to prepare in 2.4.2.

- after porting(multi-thread)

        1:    module ising_mod
        2:      implicit none
        3:      real, parameter :: V0 = .465661288D-9
        4:
        5:      integer, allocatable, dimension(:) :: IP, IM
        6:      integer, allocatable, dimension(:,:) :: IS
        7:      real*8, allocatable, dimension(:) :: P
        8:      integer :: K, MCS, INT, L, IX
        9:      real :: TEMP
        10:    !$omp threadprivate (K, MCS, INT, TEMP, IP, IM, P, IS, IX, L)
        11:    end module ising_mod
        12:

### About main.C　

`main.C` file is required to become entry point of the Program.But it is not necessary to change the contents of the main function. Configuration of `main.C`, change it if necessary. refer to 2.2.2.

### About `CMakeLists.txt`

change the `CMakeLists.txt` (see text 2.3). The following is an example of `CMakeLits.txt`.

    1:    cmake_minimum_required(VERSION 2.8.0 FATAL_ERROR)
    2:    
    3:    project(tutorial)
    4:    
    5:    find_package(ALPS REQUIRED NO_SYSTEM_ENVIRONMENT_PATH)
    6:    message(STATUS "ALPS version: ${ALPS_VERSION}")
    7:    include(${ALPS_USE_FILE})
    8:    
    9:    # Source code required to create and run file name
    10:    add_executable(tutorial main.C tutorial.f90)
    11:    target_link_libraries(tutorial ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
