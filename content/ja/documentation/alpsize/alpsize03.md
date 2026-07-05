
---
title: Alpsize-03 Fortran アプリケーション開発
math: true
toc: true
weight: 4
---

ALPS Fortran は ALPS の Fortran インターフェースモジュールです。ALPS Fortran を使うと、必要ないくつかのサブルーチンを実装するだけで、Fortran のコードを ALPS 上で簡単に実行できます。本章では、ALPS 上で動作する Fortran コードを記述する手順を説明します。また、既存の ALPS Fortran へ移植するために `CMakeList.txt` ファイルの設定手順を変更し、Fortran コードをビルドする方法についても本章で説明します。

## ALPS Fortran の概要

次の図は、ALPS システム、ALPS Fortran、ユーザーの Fortran プログラムの関係を示す図です。

![ALPS Fortran モジュール](../figs/fortranmodule.png)

ALPS Fortran は ALPS から呼び出され、必要に応じてユーザープログラムのサブルーチンを呼び出します。これにより、ALPS は C++ プログラムと同様に、Fortran で実装されたプログラムを制御できます。一方、ALPS Fortran は ALPS の機能を呼び出すためのサブルーチンを提供します。そのため、ユーザープログラムは通常の Fortran サブルーチンを呼び出すのと同じように、ALPS の機能を利用できます。

## サブルーチンの呼び出しフロー

次の図は、ALPS システムとユーザープログラムのフローチャートを示しています。以下の各サブルーチンについては [2.3.3] を参照してください。

![呼び出しフロー](../figs/callflow.png)

## Fortran ソースコードの準備

ALPS Fortran を使ってプログラムを実装するには、次の 2 つのソースコードを準備する必要があります。

- プログラムのエントリーポイントとなる main 関数を実装する C++ ソースコード。
- ALPS Fortran の規則に従って実装する Fortran ソースコード。

### エントリーポイント　

このセクションでは、main 関数（プログラムのエントリーポイント）やワーカー名など、プログラムの設定について説明します。main 関数は固定の内容を記述するだけで、通常は変更する必要はありません。プログラムの設定については、以下のコードを参照してください。

- プログラムのバージョン番号
- プログラムの著作権表示
- ワーカー名
- エバリュエーター名

以下は C++ ソースコードの例です。

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

上記の例で変更が必要なのは、赤色で示された部分の文字です。

### Fortran ソースコード

Fortran ソースコードの主な内容は計算ロジックです。ただし、ALPS Fortran を使用するには、いくつかのサブルーチンを必ず実装する必要があります。パラメータの読み込みや計算結果の保存を行う際には、ALPS Fortran が提供するサブルーチンを介して ALPS の機能を呼び出します。

#### 必須サブルーチン　

ユーザープログラムから ALPS の機能を制御するには、Fortran ソースコード内にいくつかのサブルーチンが必要です。以下の各サブルーチンの説明を読み、適切に実装してください。これらを省略するとリンクエラーとなり、ビルドできません。これらのサブルーチンを実装する際は、次の点に注意してください。

- すべてのサブルーチンには引数として `integer :: caller(2)` が渡されます。caller は ALPS の機能を呼び出すために内部的に使用される変数です。そのため、caller の値を書き換えないでください。caller の値を変更した場合、動作は保証されません。

- 各サブルーチンで `alps/fortran/alps_fortran.h` を include してください。このファイルは、Fortran コードから ALPS の機能を呼び出すときに必要です。

したがって、必須サブルーチンについては、サブルーチンのシグネチャの直下に次の 3 行が必要です。

    1:    subroutine alps_init(caller)
    2:    implicit none
    3:    include "alps/fortran/alps_fortran.h"
    4:    integer :: caller(2)
    5:    
    6:    ! --- snip --- !

**`alps_init(caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
|integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

このサブルーチンは、計算が実行される前に一度だけ呼び出されます。配列の割り当てなど、プログラムの初期化処理をここで行います。

**`alps_init_observables(caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

このサブルーチンは、`alps_init` が呼び出された後に一度だけ呼び出されます。ここで `alps::ObservableSet` を初期化します。このサブルーチンは、1 つの入力パラメータにつき一度呼び出されます。なお、`alps::ObservableSet` の詳細については ALPS のホームページを参照してください。

**`alps_run(caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

このサブルーチンには計算ロジックを実装します。alps_progress が 1.0 以上の値を返すまで、このサブルーチンは ALPS から繰り返し呼び出されます。そのため、このサブルーチン内でループ構造を記述する必要はありません。また、スレッドレベル並列で実行する場合、このサブルーチンはマルチスレッドで動作します。したがって、スレッドレベル並列で使用する場合は、スレッドセーフな実装を行う必要があります。

**`alps_progress(prgrs, caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| real\*8  |  prgrs  |  out  |  プログラムの進捗状態(0.0 ≦ prgrs) |
| integer  |  caller(2)  |  in   | ローカル変数 |

- 説明

このサブルーチンは `alps_run` の後に ALPS によって呼び出され、プログラムの進捗状況を ALPS に返します。prgrs の値が 1.0 未満の間、ALPS は `alps_run` を繰り返し呼び出します。`prgrs` に 1.0 以上の値が代入されると、ALPS は計算が完了したと判断し、プログラムを終了します。また、スレッドレベル並列で実行する場合、このサブルーチンはマルチスレッドで動作するため、スレッドレベル並列で使用する場合はスレッドセーフな実装を行う必要があります。

**`alps_is_thermalized(thrmlz, caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| real\*8  |  thrmlz   | out   | 熱平衡化の終了フラグ(0:未完了 / 1:完了) |
| integer  |  caller(2) |   in  |  ローカル変数 |

- 説明

このサブルーチンは alps_run の後に ALPS によって呼び出され、熱平衡化が未完了か完了かを返します。thrmlz の値が 0 のとき、プログラムは計算がまだ熱平衡化中であると判断し、計算結果データを保存しません。一方、値が 1 のとき、プログラムは熱平衡化が完了したと判断し、計算結果の保存を開始します。また、スレッドレベル並列で実行する場合、このサブルーチンはマルチスレッドで動作するため、スレッドレベル並列で使用する場合はスレッドセーフな実装を行う必要があります。

**`alps_finalize(caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

このサブルーチンは、計算完了後（alps_progress が 1.0 以上の値を返した後）に一度だけ呼び出されます。割り当てたメモリの解放など、終了処理をここで行います。

**`alps_save(caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in   | ローカル変数 |

- 説明

このサブルーチンは `alps_run` の後に ALPS から呼び出されます。ALPS の機能を使ってリスタートファイルを保存します。また、スレッドレベル並列で実行する場合、このサブルーチンはマルチスレッドで動作するため、スレッドレベル並列で使用する場合はスレッドセーフな実装を行う必要があります。

**`alps_load(caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

このサブルーチンは、プログラムがリスタートするときに一度だけ呼び出されます。ALPS の機能を使って、保存されたリスタートファイルを読み込みます。

#### ALPS Fortran が提供するサブルーチン

ユーザープログラムから ALPS の機能を呼び出すときは、ALPS Fortran が提供するサブルーチンを呼び出します。これらのサブルーチンは引数として `integer :: caller(2)` を必要とします。caller は ALPS Fortran から渡されるローカル変数であり、(2.2.3.1) の必須サブルーチンの引数として渡された変数を、そのまま提供サブルーチンに渡す必要があります。

**`alps_get_parameter(data, name, type, caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| -  |  data  |  out  |   値の格納先 |
| character   | name(\*)  |  in  |  取り出すパラメータ名 |
| integer  |  type  |  in  |  データ型 |
| integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

名前を指定して、ALPS からパラメータを受け取ります。パラメータ名、型、要素数はそれぞれ **name**、**type**、count で指定します。このサブルーチンは主に `alps_init` で配列や変数を初期化するために使用します。なお、type に指定できる値は `alps_fortran.h` で定義されています。

**`alps_parameter_defined(res, name, caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  res   | out  |  パラメータ定義の有無(1:定義なし / 0:定義あり) |
| character  |  name(\*)  |  in  |  パラメータ名 |
| integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

**name** で指定したパラメータが、パラメータファイルで定義されているかどうかを返します。定義されている場合は res に *1* が代入され、定義されていない場合は *0* が代入されます。このサブルーチンは主に `alps_init` で配列や変数を初期化するために使用します。

**`alps_init_observable(count, type, name, caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  count  |  in   | 格納する計算結果の要素数 |
| integer  |  type  |  in  |  データ型 |
| character  |  name(\*)  |  in  |  格納する Observable の名前 |
| integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

このサブルーチンは、`alps_init_observable` で指定した Observable の名前を `alps::ObservableSet` に登録するために使用します。Observable の型は **type** と **count** によって次のように決まります。

| **type** | **count** | **Observable** |
| :------- | :-------- | :------------- |
| ALPS_INT  |  1   | IntObservable |
| ALPS_INT  |  1\<  |  in |
| ALPS_REAL  |  1  |  RealObservable |
| ALPS_REAL  |  1\<  |  RealVectorObservable |
| ALPS_DOUBLE_PRECISION  |  1   | RealObservable |
| ALPS_DOUBLE_PRECISION  |  1\<  |  RealVectorObservable |


**`alps_accumulate_observable(data, count, type, name, caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| -   | data  |  in   | 格納する計算結果 |
| integer  |  count   | in  |  格納する計算結果の要素数 |
| integer  |  type  |  in  |  データ型 |
| character  |  name(\*)  |  in   | 格納する Observable の名前 |
| integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

指定した名前の Observable に結果データを保存します。このサブルーチンは `alps_run` で計算結果を格納するために使用します。count / name / type は `init_observable` で指定したものと一致している必要があります。

**`alps_dump(data, count, type, caller)`**

- 引数
| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| -  |  data  |  in  |  格納する値 |
| integer  |  count  |  in  |  格納する値の要素数 |
| integer  |  type  |  in  |  データ型 |
| integer  |  call(2)  |  in  |  ローカル変数 |

- 説明

このサブルーチンは `alps_save` でリスタートファイルを保存するために使用します。`alps_dump` を使って保存した中断データは、リスタート時に使用されます。

**`alps_restore(data, count, type, caller)`**

- 引数

| **型**  |  **名前**  |  **入出力**  |  **意味** |
| :-------  |  :-------  |  :------  |  :---------- |
| -  |  data   | out  |  読み込んだ値の格納先 |
| integer  |  count  |  in  |  読み込む値の要素数 |
| integer  |  type  |  in  |  データ型 |
| integer  |  caller(2)  |  in  |  ローカル変数 |

- 説明

このサブルーチンは `alps_load` でリスタートファイルを読み込むために使用します。リスタートファイルのデータは `alps_dump` で保存した順序で保存されています。したがって、`alps_restore` で読み込むときは、保存したときと同じ順序でデータを取り出してください。

### 設定ファイルの編集

ユーザープログラムは ALPS と同様に CMake を使ってビルドします。以下は、CMake でユーザープログラムをビルドするための設定ファイル(`CMakeLists.txt`)の例です。

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
    
上記の例で変更が必要なのは、\*\*...\*\* の内側の文字です。

## 既存プログラムコードの移植

このセクションでは、以下に示すイジングモデルのプログラムを例に、既存の Fortran プログラムを ALPS 上で動作させる手順を説明します。

### 移植の準備　

このセクションでは、`alps_fortran.tar.gz` を展開して生成される tutorial ディレクトリ内のファイルを使用します。移植作業の準備として、tutorial ディレクトリ内の次のファイルを作業ディレクトリにコピーしてください。

- `ising_original.f`：元のソースコード
- `template.f90`：ALPS Fortran プログラムのテンプレートソースコード
- `main.C`：プログラムのエントリーポイント
- `CMakeList.txt`：`CMakeList.txt` のテンプレート

ALPS プログラムの実装に必要なすべてのサブルーチンが `template.f90` に定義されています。そのため、新しいプログラムを開発する際は `template.f90` をもとに開発を進めることができます。

元のコードのおおまかな構造は次のとおりです。

|      | **処理内容** |
| :--- | :---------------------- |
| 4-7  |  変数の宣言と初期化 |
| 8-23  |  配列要素の初期化 |
| 24-47 |   メインループ |
| 25-34  |  計算 |
| 36   | 熱平衡化チェック |
| 37-46  |  計算結果の保存 |
| 48-58  |  結果の出力 |


### Fortran コードの移植

Fortran コードの移植では、`ising_original.f` の各ブロックで行われている処理をサブルーチンに割り当てます。このセクションでは、移植後のコードのサンプルとして `tutorial/alps_ising.f90` の例を説明します。

#### 変数の宣言

`ising_original.f` で宣言されている各変数は、移植時に ALPS モジュールにまとめられます。ALPS へ移植するには処理単位ごとにサブルーチンが必要になるため、各サブルーチンから変数へアクセスできるように変更します。

- 移植前

        4:    DIMENSION IS(20,20),IP(20),IM(20),P(-4:4),A(4)
        5:    C PARAMETERS
        6:          DATA TEMP/2.5/, L/10/, MCS/1000/, INT/1000/
        7:          DATA IX/1234567/, V0/.465661288D-9/


- 移植後

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

IP, IM, IS, P 配列は `alps_init` で初期化されるため、移植後はここでサイズを指定しません。また、元の配列 A は結果を格納するためのものですが、移植後はこの配列に ALPS の仕組みを使用します。そのため、移植後のコードでは配列 A は不要です。また、移植後の各変数の値はパラメータファイルから取得します。さらに、K は移植後に繰り返し回数を数えるための変数です。移植後の熱平衡化チェックは、ループを使わずに K の値で制御と繰り返しを行う役割を担います。
**このセクションでは MPI による並列実行を想定しているため、スレッドセーフについては考慮していません。**

#### 初期化処理

元のコードの初期化処理では配列の各要素を初期化する場合がありますが、移植後のコードでは初期化処理をサブルーチン `alps_init` で行います。まず `alps_get_parameter` を使って配列変数を初期化し、次に配列要素を初期化します。また、移植後は結果を格納する配列を用意せず、結果を保存するための Observable を `alps_init_observable` サブルーチンで用意します。なお、`alps_init` と `alps_init_observable` は ALPS によって自動的に呼び出されるため、移植後のコードで呼び出す必要はありません。

- 移植前

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

- 移植後(`alps_init`)

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

上記のコードでは、21〜24 行目で `alps_get_parameter` を呼び出し、ALPS を通じてパラメータファイルの内容を取得しています。また、34〜51 行目の処理は元のコードと同じです。

- 移植後(`alps_init_observables`)

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
    
移植後は、計算結果を格納するバッファとして "Magnetization" と "Energy" という名前の Observable が用意されます。元のコードでは Magnetization と Energy のそれぞれについて合計と二乗和を計算していましたが、移植後はこれらの計算が Observable によって自動的に行われます。

#### 計算と結果の保存

元のコードでは do ループによる繰り返し（元のコードの 25 行目）がありましたが、移植後は do ループを使わずに `alps_progress` サブルーチンと `alps_run` を使用します。

- 移植前

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

- 移植後(`alps_run`)

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

計算処理そのもの（65〜82 行目）は元のコードと同じです。移植後は alps_run が自動的に繰り返し呼び出されるため、元のコードの 25 行目のループは記述しません。代わりに、86 行目で繰り返し回数を数えます。また、ALPS の機能（84 行目と 85 行目）を使って計算結果を保存します。元のコード（43〜46 行目）では積算や二乗などの計算を行っていましたが、移植後はこれらが `alps_accumulate_observable` によって自動的に行われます。

- 移植後(alps_progress)

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
    
移植後は、alps_progress で繰り返し計算の制御を行います。prgrs の値が 1 以上になると `alps_run` は呼び出されなくなります。そのため、実行回数のカウンタである (K) の値を監視し、prgrs の値が 1 以上になるように実装します。

#### 熱平衡化チェック

元のコードでは、熱平衡化チェックはメインループ内（36 行目）で実行されていました。しかし移植後は、サブルーチン `alps_is_thermalized` で実行します。

- 移植前

        36:          IF(K.LE.INT) GOTO 30

- 移植後(`alps_is_thermalized`)：

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
    
`alps_progress` と同様に、カウンタ (K) の値から熱平衡化を判定します。熱平衡化が完了したとみなされると、thrmlz の値は 1 になります。

#### 結果の出力

結果の後処理と出力は、ALPS を使用すると自動的に行われます。そのため、計算結果の出力や後処理のコードは不要です。

- 移植前

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

- 移植後：該当コードなし

#### 終了処理

元のコードでは allocate に対する終了処理は行われていません。しかし移植後は、`alps_init` で allocate した配列を deallocate する必要があります。

- 移植前：該当コードなし

- 移植後(`alps_finalize`)

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

#### リスタート機能

(`alps_save` / `alps_load`) を実装するだけで、ALPS を使用したときのリスタートファイルの入出力機能によって、プログラムにリスタート機能を追加できます。元のコードにはリスタート機能がないため、以下では ALPS に従ったリスタートファイルの入出力機能の実装例を説明します。

- 移植前：該当コードなし
- 移植後(`alps_save`)

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

`alps_save` では、リスタートに必要な変数だけを `alps_dump` で書き出します。ここでは、カウンタ (K) と計算データ (IX, IS) を書き出す方法を示します。

- 移植後(`alps_load`)

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

`alps_load` では、`alps_save` が (`alps_dump`) で書き出した順序で (`alps_restore`) を使って読み込む必要があります。なお、ALPS プログラムをリスタートするとき、`alps_load` が呼び出される前に `alps_init` が呼び出されます。つまり、K, IX, IS などの変数のメモリ割り当てや初期化は `alps_init` で行われるため、`alps_load` 内で初期化などを行う必要はありません。

#### マルチスレッド対応について

ALPS プログラムをマルチスレッドで実行したい場合は、Fortran コードをスレッドセーフに実装する必要があります。このセクションで説明した `tutorial.f90` の場合、2.4.2 で用意するスレッドローカル変数によってマルチスレッドに対応できます。

- 移植後(マルチスレッド)

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

### main.C について　

`main.C` ファイルはプログラムのエントリーポイントとなるために必要です。ただし、main 関数の内容を変更する必要はありません。`main.C` の設定は必要に応じて変更してください。2.2.2 を参照してください。

### `CMakeLists.txt` について

`CMakeLists.txt` を変更します（本文 2.3 を参照）。以下は `CMakeLists.txt` の例です。

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
