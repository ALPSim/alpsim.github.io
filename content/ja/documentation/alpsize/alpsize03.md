
---
title: Integration-03 Fortran アプリケーション開発
math: true
toc: true
weight: 4
---

ALPS Fortran は ALPS システム向けの Fortran インターフェースモジュールを提供します。少数の固定された必須サブルーチンを実装するだけで、Fortran プログラムを ALPS スケジューラの下で実行し、その並列化・パラメータ管理・結果集約機能を活用できます——これは [Integration-00](../alpsize00) で C++ を使って示したのと同じ利点であり、[Integration-02](../alpsize02) で "hello" サンプルを組み立てた際にも使われた仕組みです。本章ではそのサブルーチンインターフェースを詳しく説明し、実際に存在する完全な例を通してそれを実践します。すなわち、既存の、手を加えていない Fortran プログラム——1993 年に書かれた二次元 Ising モデルのモンテカルロシミュレーション——を ALPS Fortran フレームワークに移植します。

## ALPS Fortran の概要

次の図は、ALPS システム、ALPS Fortran、ユーザーの Fortran プログラムの関係を示しています。

![ALPS Fortran モジュール](../figs/fortranmodule.png)

ALPS Fortran は、C++ で書かれた ALPS スケジューラとあなたの Fortran コードの間に位置する薄い C++ の層です。ALPS は通常の C++ を使って ALPS Fortran を呼び出し、ALPS Fortran はそれを普通の Fortran サブルーチン呼び出しとしてあなたのプログラムのサブルーチンに橋渡しします——これにより、ALPS は C++ の `Worker` クラスをまったく同じ方法（ジョブスケジューリング、チェックポイント、プロセス制御）で制御するのとまったく同じように、Fortran プログラムを制御できます。詳しくは [Integration-00 のステップ 9](../alpsize00#ステップ-9--alpsparapack-スケジューラとの完全な統合)を参照してください。ALPS Fortran はその逆方向の経路も提供します。すなわち、あなたの Fortran コードが通常の Fortran サブルーチンであるかのように ALPS を呼び返せる一連のサブルーチン（`alps_get_parameter`、`alps_accumulate_observable` など）です。そのため、C++ を自分で書いたり呼び出したりする必要は一切ありません。

## 呼び出しフロー

次の図は、1 回の実行のライフサイクルにおける ALPS システムとユーザープログラムの呼び出しフローを、**初期化**・**計算ループ**・**終了処理**の 3 つのフェーズに分けて示しています。

![呼び出しフロー](../figs/callflow.png)

初期化フェーズでは、ALPS が `alps_init` を一度呼び出し、その中であなたのコードは通常 `alps_get_parameter` と `alps_parameter_defined` を呼び返してパラメータを読み込みます。続いて ALPS は `alps_init_observables` を呼び出し、その中であなたのコードは `alps_init_observable` を呼び出して各測定量を登録します。その後 ALPS は `alps_run`——実際の計算部分——を繰り返し呼び出し、その合間に `alps_is_thermalized` と `alps_progress` を呼び出します。これは進捗が 1.0 に達するまで続きます。各 `alps_run` は通常 `alps_accumulate_observable` を呼び返して測定結果を記録します。最後に、終了処理フェーズでは、ALPS は `alps_save`（内部で `alps_dump` を呼び出してチェックポイントデータを書き込みます）と `alps_finalize` を呼び出します。以下のサブルーチンリファレンスは、この図に描かれているすべての箱を説明しています。

[Integration-00](../alpsize00) を読んだ方は、これがまったく同じ 3 フェーズ構造であることに気づくでしょう——ステップ 9 の `wolff_worker` C++ クラスとまったく同じライフサイクルが、C++ のメンバ関数の代わりに Fortran のサブルーチンに分散しているだけです。

| ALPS Fortran サブルーチン | 対応する C++ `Worker` メソッド（Integration-00 ステップ 9） |
| :----------------------- | :------------------------------------------------------- |
| `alps_init`               | コンストラクタ |
| `alps_init_observables`   | `init_observables` |
| `alps_run`                | `run` |
| `alps_progress`           | `progress` |
| `alps_is_thermalized`     | `is_thermalized` |
| `alps_save`               | `save` |
| `alps_load`               | `load` |
| `alps_finalize`           | デストラクタ |

## Fortran ソースコードの準備

ALPS Fortran を使ってプログラムを実装するには、2 つのソースファイルを準備する必要があります。

- `main` 関数（プログラムのエントリーポイント）を定義する **C++ ソースファイル**。
- ALPS Fortran が要求するサブルーチンを実装する **Fortran ソースファイル**。

### エントリーポイント

`main` 関数は、バージョン番号、著作権表示、Worker 名、Evaluator 名といったプログラムのメタデータを設定します。ほとんどの場合、`main` 関数の本体自体を変更する必要はありません——これらのメタデータ文字列だけをあなたのプログラム用に更新してください。

以下は C++ エントリーポイントの例です——実際、これは [Integration-02](../alpsize02) の `hello.C` と `ising.C` そのものであり、メタデータ文字列と Worker 名が `"hello"`/`"ising"` の代わりにプレースホルダーになっているだけです。

```cpp
#include <alps/parapack/parapack.h>
#include "alps/fortran/fortran_wrapper.h"

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
```

サンプルの文字列（`"my version"`、`"my copyright"`、`"worker name"`、`"evaluator name"`）を、あなたのプログラムに適した値に置き換えてください。`alps::fortran_wrapper` こそが、これを実現している ALPS 提供の Worker クラスです。これは [Integration-00 のステップ 9](../alpsize00#ステップ-9--alpsparapack-スケジューラとの完全な統合)で手書きしたのと同じ Worker インターフェースを満たす C++ クラスですが、`run` や `is_thermalized` などを直接 C++ で実装する代わりに、各呼び出しを以下で実装する Fortran サブルーチンに転送します。

### Fortran ソースコード

Fortran ソースコードの主な内容は計算ロジックです。ただし、ALPS Fortran があなたのプログラムを制御できるように、固定された一連の必須サブルーチンを必ず実装する必要があります。パラメータを読み込んだり結果を保存したりする際は、自分で I/O を処理するのではなく、ALPS Fortran が提供するサブルーチンを呼び出します。

#### 必須サブルーチン

以下のサブルーチンは Fortran ソースファイルに必ず存在しなければなりません。いずれかが欠けていると、ビルド時にリンクエラーになります。

必須サブルーチンはすべて `caller` を引数として受け取ります。これは ALPS Fortran が内部で ALPS の機能を呼び出すために使用する整数配列です。**`caller` の値を変更しないでください。** 値を変更すると未定義の動作になります。

各サブルーチンは `alps/fortran/alps_fortran.h` を include する必要があります。

```fortran
subroutine alps_init(caller)
implicit none
include "alps/fortran/alps_fortran.h"
integer :: caller(2)

! --- your code here --- !
```

---

**`alps_init(caller)`**

| **型** | **名前** | **入出力** | **意味** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS ハンドル——変更しないこと |

計算が始まる前に一度だけ呼び出されます。ここで初期化を行います：配列の割り当てとパラメータの読み込みです。

---

**`alps_init_observables(caller)`**

| **型** | **名前** | **入出力** | **意味** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS ハンドル |

`alps_init` の後に一度だけ呼び出されます。ここで可観測量（測定量）を `alps::ObservableSet` に登録します。入力パラメータのセットごとに一度呼び出されます。`alps::ObservableSet` の詳細については [ALPS ドキュメント](https://alps.comp-phys.org)を参照してください。

---

**`alps_run(caller)`**

| **型** | **名前** | **入出力** | **意味** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS ハンドル |

計算のコアロジックを含みます。`alps_progress` が 1.0 以上の値を返すまで、ALPS はこのサブルーチンを繰り返し呼び出します。ループは ALPS が管理するため、**`alps_run` の内部で外側のループを書かないでください**。スレッドレベル並列で実行する場合、このサブルーチンは複数のスレッドで同時に実行されるため、スレッドセーフでなければなりません。

---

**`alps_progress(prgrs, caller)`**

| **型** | **名前** | **入出力** | **意味** |
| :------- | :------- | :------ | :---------- |
| real\*8  | prgrs    | out | 進捗指標（0.0 ≤ prgrs；prgrs ≥ 1.0 で計算終了） |
| integer  | caller(2) | in | 内部 ALPS ハンドル |

`alps_run` を呼び出すたびに、その後で ALPS から呼び出されます。`prgrs < 1.0` の間、ALPS は `alps_run` を呼び出し続けます。`prgrs ≥ 1.0` になると、ALPS は計算が完了したと判断して停止します。スレッドレベル並列で実行する場合はスレッドセーフでなければなりません。

---

**`alps_is_thermalized(thrmlz, caller)`**

| **型** | **名前** | **入出力** | **意味** |
| :------- | :------- | :------ | :---------- |
| integer  | thrmlz   | out | 熱化フラグ：0 = 未熱化、1 = 熱化済み |
| integer  | caller(2) | in | 内部 ALPS ハンドル |

各 `alps_run` の後に ALPS から呼び出されます。`thrmlz = 0` の間、ALPS は測定結果を保存しません（系はまだ熱化中です）。`thrmlz = 1` になると、ALPS は結果の保存を開始します。スレッドレベル並列で実行する場合はスレッドセーフでなければなりません。

---

**`alps_finalize(caller)`**

| **型** | **名前** | **入出力** | **意味** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS ハンドル |

`alps_progress` が 1.0 以上の値を返した後、一度だけ呼び出されます。ここでクリーンアップを行います：配列の解放やその他のリソースの解放です。

---

**`alps_save(caller)`**

| **型** | **名前** | **入出力** | **意味** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS ハンドル |

各 `alps_run` の後に ALPS から呼び出されます。`alps_dump` を使ってチェックポイントデータをリスタートファイルに書き込みます。スレッドレベル並列で実行する場合はスレッドセーフでなければなりません。

---

**`alps_load(caller)`**

| **型** | **名前** | **入出力** | **意味** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS ハンドル |

プログラムがリスタートするときに一度だけ呼び出されます。`alps_restore` を使ってリスタートファイルからチェックポイントデータを読み込みます。

---

#### ALPS Fortran が提供するサブルーチン

あなたの Fortran プログラムから ALPS の機能を呼び出すには、ALPS Fortran が提供するサブルーチンを使用します。それぞれ `caller(2)` を引数として受け取ります。外側の必須サブルーチンが受け取った `caller` 変数をそのまま渡してください。

以下の表で参照するデータ型定数は `alps_fortran.h` で定義されています：`ALPS_CHAR`（文字列。例えば [Integration-02](../alpsize02) の `WORLD` のような文字列型パラメータを読み込む場合）、`ALPS_INT`、`ALPS_LONG`、`ALPS_REAL`、`ALPS_DOUBLE_PRECISION` です。

---

**`alps_get_parameter(data, name, type, caller)`**

| **型**  | **名前**   | **入出力** | **意味** |
| :-------- | :--------- | :------ | :---------- |
| —         | data       | out | パラメータの値を受け取る変数 |
| character | name(\*)   | in  | パラメータ名 |
| integer   | type       | in  | データ型定数（`alps_fortran.h` で定義） |
| integer   | caller(2)  | in  | 内部 ALPS ハンドル |

指定した名前のパラメータを ALPS パラメータファイルから読み込み、`data` に格納します。通常は `alps_init` の中で呼び出します。利用可能な型定数は `alps_fortran.h` で定義されています。

---

**`alps_parameter_defined(res, name, caller)`**

| **型**  | **名前**   | **入出力** | **意味** |
| :-------- | :--------- | :------ | :---------- |
| integer   | res        | out | パラメータが定義されていれば 1、なければ 0 |
| character | name(\*)   | in  | パラメータ名 |
| integer   | caller(2)  | in  | 内部 ALPS ハンドル |

指定した名前のパラメータがパラメータファイル内に存在するかどうかを返します。通常は `alps_init` でオプションパラメータを扱う際に使用します。

---

**`alps_init_observable(count, type, name, caller)`**

| **型**  | **名前**   | **入出力** | **意味** |
| :-------- | :--------- | :------ | :---------- |
| integer   | count      | in | その可観測量の要素数 |
| integer   | type       | in | データ型定数 |
| character | name(\*)   | in | 登録する可観測量の名前 |
| integer   | caller(2)  | in | 内部 ALPS ハンドル |

`alps_init_observables` の中で、名前付きの可観測量を `alps::ObservableSet` に登録します。可観測量の型は `type` と `count` によって次のように決まります。

| **type** | **count** | **Observable の型** |
| :------- | :-------- | :------------------ |
| ALPS_INT                | 1   | IntObservable |
| ALPS_INT                | > 1 | IntVectorObservable |
| ALPS_REAL               | 1   | RealObservable |
| ALPS_REAL               | > 1 | RealVectorObservable |
| ALPS_DOUBLE_PRECISION   | 1   | RealObservable |
| ALPS_DOUBLE_PRECISION   | > 1 | RealVectorObservable |

---

**`alps_accumulate_observable(data, count, type, name, caller)`**

| **型**  | **名前**   | **入出力** | **意味** |
| :-------- | :--------- | :------ | :---------- |
| —         | data       | in  | 記録する値 |
| integer   | count      | in  | 要素数 |
| integer   | type       | in  | データ型定数 |
| character | name(\*)   | in  | 格納先の可観測量の名前 |
| integer   | caller(2)  | in  | 内部 ALPS ハンドル |

測定結果を名前付きの可観測量に記録します。`alps_run` の中で呼び出します。`count`、`type`、`name` は `alps_init_observable` で指定したものと一致していなければなりません。

---

**`alps_dump(data, count, type, caller)`**

| **型**  | **名前**  | **入出力** | **意味** |
| :-------- | :-------- | :------ | :---------- |
| —         | data      | in  | 保存するデータ |
| integer   | count     | in  | 要素数 |
| integer   | type      | in  | データ型定数 |
| integer   | caller(2) | in  | 内部 ALPS ハンドル |

データをリスタートファイルに書き込みます。`alps_save` の中で呼び出します。`alps_dump` で保存したデータは、`alps_restore` で同じ順序で復元しなければなりません。

---

**`alps_restore(data, count, type, caller)`**

| **型**  | **名前**  | **入出力** | **意味** |
| :-------- | :-------- | :------ | :---------- |
| —         | data      | out | 読み込んだデータの格納先 |
| integer   | count     | in  | 要素数 |
| integer   | type      | in  | データ型定数 |
| integer   | caller(2) | in  | 内部 ALPS ハンドル |

リスタートファイルからデータを読み込みます。`alps_load` の中で呼び出します。データは `alps_dump` で保存したときと同じ順序で復元しなければなりません。

---

### CMakeLists.txt の編集

ユーザープログラムは ALPS 自体と同様に CMake でビルドします——ALPS の CMake 統合の仕組みについての一般的な説明は [Integration-01](../alpsize01) を参照してください。以下は、[Integration-00](../alpsize00) と [Integration-02](../alpsize02) を通して使われてきたのと同じパターンに `Fortran` サポートを加えた `CMakeLists.txt` のサンプルです。`myproject`、`main.C`、`myprogram_impl.f90` を、あなたのプロジェクトの実際の名前に置き換えてください。

```cmake
cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(myproject NONE)

# find ALPS Library
find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)
message(STATUS "Found ALPS: ${ALPS_ROOT_DIR} (revision: ${ALPS_VERSION})")
include(${ALPS_USE_FILE})

# enable C, C++, and Fortran compilers
enable_language(C CXX Fortran)

# rule for generating the program
add_executable(myprogram main.C myprogram_impl.f90)
target_link_libraries(myprogram ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
```

{{< callout type="warning" >}}
`enable_language(... Fortran)` と `PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME}` を忘れないでください——これらがないと、CMake は Fortran コンパイラをまったく有効化しないか、（`NO_SYSTEM_ENVIRONMENT_PATH` に対応する `PATHS` 引数がないと）ALPS を見つけられない可能性があります。ここの各行がなぜ重要なのかについては、[Integration-01](../alpsize01#cmake-の実行) を参照してください。
{{< /callout >}}

## 既存の Fortran プログラムを移植する

このセクションでは、Ising モデルのプログラム `ising_original.f` を ALPS Fortran に移植する手順を説明します。ここで使うファイルはすべて、[ALPS リポジトリ](https://github.com/ALPSim/ALPS)内の `tutorials/alpsize-11-fortran-ising` ディレクトリの一部です——[Integration-00](../alpsize00) の C++ チュートリアルが由来する、同じリポジトリです。

### 移植の準備

以下のファイルをチュートリアルディレクトリからあなたの作業ディレクトリにコピーしてください。

- `ising_original.f` — 元のソースコード
- `template.f90` — ALPS Fortran プログラムのテンプレート
- `ising.C` — エントリーポイント（[Integration-02](../alpsize02) の `hello.C` エントリーポイントと構造は同一で、Worker/Evaluator 名として `"ising"` を使っているだけです）
- `CMakeLists.txt` — ビルド設定のテンプレート

`template.f90` には、必須サブルーチンすべてのスタブ定義が含まれています。新しいプログラムを開発する際は、サブルーチンをゼロから書くのではなく `template.f90` を出発点にしてください。

元のコードの構造は次のとおりです。

| 行番号   | 処理 |
| :------ | :--------- |
| 5–9     | 変数の宣言と初期化 |
| 10–25   | 配列要素の初期化 |
| 26–49   | メインループ |
| 27–36   | 計算 |
| 38      | 熱化チェック |
| 39–48   | 結果の保存 |
| 50–60   | 結果の出力 |

### Fortran コードの移植

`ising_original.f` の各ブロックは、対応する ALPS Fortran サブルーチンに割り当てられます。`ising_impl.f90` が移植を完了させたバージョンです。

#### 変数の宣言

`ising_original.f` で宣言されている変数は、複数のサブルーチンからアクセスできるように、ALPS Fortran モジュールに移す必要があります。

- 移植前：

  ```fortran
  6    DIMENSION IS(20,20),IP(20),IM(20),P(-4:4),A(4)
  7    C PARAMETERS
  8          DATA TEMP/2.5/, L/10/, MCS/1000/, INT/1000/
  9          DATA IX/1234567/, V0/.465661288D-9/
  ```

- 移植後：

  ```fortran
  module ising_mod
    implicit none
    real, parameter :: V0 = .465661288D-9

    integer, allocatable, dimension(:) :: IP, IM
    integer, allocatable, dimension(:,:) :: IS
    real*8, allocatable, dimension(:) :: P
    integer :: K, MCS, INT, L, IX
    real :: TEMP
  end module ising_mod
  ```

`IP`、`IM`、`IS`、`P` は `alps_init` で確保されるため、ここではサイズを固定していません。結果の累積に使われていた配列 `A` は ALPS の可観測量に置き換えられ、不要になります。各変数の値は実行時にパラメータファイルから読み込まれるようになります。反復回数を数えるために `K` が追加されました。移植後の熱化チェックは、`GOTO` を使ったループの代わりに `K` の値を監視することで行われます。（`!$omp threadprivate` の行は、後の[マルチスレッド対応](#マルチスレッド対応)で追加されます——チュートリアルで実際に提供されている `ising_impl.f90` は、完成した、スレッドセーフなプログラムを示しているため、すでにこの行を含んでいます。）

**注：この例の MPI 版はスレッドセーフである必要がないため、ここではスレッドセーフ性を考慮していません。**

#### 初期化

元のコードの初期化ブロック（配列の設定）は、移植後の `alps_init` に対応します。パラメータは `alps_get_parameter` によってパラメータファイルから読み込まれ、結果を格納するための可観測量は `alps_init_observables` の中で登録されます。これらのサブルーチンは ALPS によって自動的に呼び出されます——自分で呼び出す必要はありません。

- 移植前：

  ```fortran
  10   C TABLES
  11         DO 10 I=-4,4
  12         W=EXP(FLOAT(I)/TEMP)
  13    10   P(I)=W/(W+1/W)
  14         DO 11 I=1,L
  15         IP(I)=I+1
  16    11   IM(I)=I-1
  17         IP(L)=1
  18         IM(1)=L
  19   C INITIAL CONFIGURATION
  20         DO 20 I=1,L
  21         DO 20 J=1,L
  22    20   IS(I,J)=1
  23   C ACCUMULATION DATA RESET
  24         DO 21 I=1,4
  25    21   A(I)=0.0
  ```

- 移植後（`alps_init`）：

  ```fortran
  subroutine alps_init(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    integer :: i, j
    real*8 :: W

    call alps_get_parameter(TEMP, "TEMPERATURE", ALPS_REAL, caller)
    call alps_get_parameter(L, "L", ALPS_INT, caller)
    call alps_get_parameter(MCS, "MCS", ALPS_INT, caller)
    call alps_get_parameter(INT, "INT", ALPS_INT, caller)

    allocate( IP(L) )
    allocate( IM(L) )
    allocate( P(-4:4) )
    allocate( IS(L, L) )

    K = 0
    IX = 1234567

    do i = -4, 4
       W = exp(float(i)/TEMP)
       P(i) = W / (W + 1/W)
    end do

    do i = 1, L
       IP(i) = i + 1
       IM(i) = i - 1
    end do

    do i = 1, L
       do j = 1, L
          IS(i, j) = 1
       end do
    end do

    IP(L) = 1
    IM(1) = L

    return
  end subroutine alps_init
  ```

冒頭にある `alps_get_parameter` の呼び出しは、以前はハードコードされた `DATA` 文だった値を、代わりに ALPS パラメータファイルから読み込みます。それ以降の配列設定は元のコードとまったく同じです。

{{< callout type="info" >}}
`ising_impl.f90` に実際に含まれている `alps_init` は、`omp_get_thread_num()` も呼び出し、スレッド ID と読み込んだばかりのパラメータを出力します（例：`----- alps_init( 2 ) -----`）。これは、下記の[マルチスレッド対応](#マルチスレッド対応)まで進んだ際に、クローンが本当に別々のスレッドで動いていることを確認するための、ちょっとした診断用の仕掛けです。ここでは分かりやすさのために省略していますが、あなた自身のコードに加えても問題ありません。
{{< /callout >}}

- 移植後（`alps_init_observables`）：

  ```fortran
  subroutine alps_init_observables(caller)
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)

    call alps_init_observable(1, ALPS_REAL, "Energy", caller)
    call alps_init_observable(1, ALPS_REAL, "Magnetization", caller)

    return
  end subroutine alps_init_observables
  ```

`"Energy"` と `"Magnetization"` という名前の可観測量が、結果を格納するバッファとして登録されます。元のコードでは、合計と二乗和を配列 `A` に手動で累積していましたが、移植後はこれを `alps_accumulate_observable` が自動的に行います。

#### 計算と結果の保存

元のコードは反復に `DO` ループを使っていました。移植後は、`alps_run` が呼び出されるたびに 1 回の反復を実行します——ALPS は `alps_progress` が 1.0 以上を返すまで `alps_run` を繰り返し呼び出すことで、このループを管理します。

- 移植前：

  ```fortran
  26   C SIMULATION
  27         DO 30 K=1,MCS+INT
  28         KIJ=0
  29         DO 31 I=1,L
  30         DO 31 J=1,L
  31         M=IS(IP(I),J)+IS(I,IP(J))+IS(IM(I),J)+IS(I,IM(J))
  32         KIJ=KIJ+1
  33         IS(I,J)=-1
  34         IX=IAND(IX*5*11,2147483647)
  35         IF(P(M).GT.V0*IX) IS(I,J)=1
  36    31   CONTINUE
  37   C DATA
  38         IF(K.LE.INT) GOTO 30
  39         EN=0
  40         MG=0
  41         DO 40 I=1,L
  42         DO 40 J=1,L
  43         EN=EN+IS(I,J)*(IS(IP(I),J)+IS(I,IP(J)))
  44    40   MG=MG+IS(I,J)
  45         A(1)=A(1)+EN
  46         A(2)=A(2)+EN**2
  47         A(3)=A(3)+MG
  48         A(4)=A(4)+MG**2
  49    30   CONTINUE
  ```

- 移植後（`alps_run`）：

  ```fortran
  subroutine alps_run(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    integer :: i, j, M
    real*8 :: EN, MG

    do i = 1, L
       do j = 1, L
          M = IS(IP(i), j) + IS(i, IP(j)) + IS(IM(i), j) + IS(i, IM(j))
          IS(i, j) = -1

          IX = IAND(IX * 5 * 11, 2147483647)
          if(P(M).gt.V0*IX) IS(i, j) = 1
       end do
    end do

    EN = 0.0D0
    MG = 0.0D0
    do i = 1, L
       do j = 1, L
          EN = EN + IS(i, j) * (IS(IP(i), j) + IS(i, IP(j)))
          MG = MG + IS(i, j)
       end do
    end do

    call alps_accumulate_observable(EN, 1, &
         ALPS_DOUBLE_PRECISION, "Energy", caller)
    call alps_accumulate_observable(MG, 1, &
         ALPS_DOUBLE_PRECISION, "Magnetization", caller)
    K = K + 1

    return
  end subroutine alps_run
  ```

計算ループそのものは元のコードと同一です。外側の `DO 30 K=1,MCS+INT` ループはなくなり——代わりに ALPS が `alps_run` を繰り返し呼び出し、末尾の `K = K + 1` が呼び出された回数を記録します。`alps_accumulate_observable` の呼び出しが結果を直接記録します。元のコードで `A(1)`–`A(4)` に手動で行っていた合計と二乗の計算は、可観測量によって自動的に行われます。

- 移植後（`alps_progress`）：

  ```fortran
  subroutine alps_progress(prgrs, caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    real*8 :: prgrs

    prgrs = K / (INT + MCS)

  end subroutine alps_progress
  ```

`alps_progress` は反復をいつ止めるかを制御します。`prgrs ≥ 1.0`（すなわち `K ≥ INT + MCS`）になると、ALPS は `alps_run` の呼び出しを停止します。

#### 熱化チェック

元のコードでは、熱化チェックはメインループの中に埋め込まれていました。移植後は、独立したサブルーチンになります。

- 移植前：

  ```fortran
  38         IF(K.LE.INT) GOTO 30
  ```

- 移植後（`alps_is_thermalized`）：

  ```fortran
  subroutine alps_is_thermalized(thrmlz, caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    integer :: thrmlz

    if(K >= INT) then
       thrmlz = 1
    else
       thrmlz = 0
    end if

    return
  end subroutine alps_is_thermalized
  ```

`alps_progress` と同様に、熱化状態は反復カウンタ `K` から判定されます。`thrmlz = 1` になると、ALPS は測定結果の保存を開始します。

#### 出力と後処理

ALPS を使うと、出力と後処理は自動的に行われます。移植後は、元のプログラムにあった出力コードは不要になります。

- 移植前：

  ```fortran
  50   C STATISTICS
  51         DO 50 I=1,4
  52    50   A(I)=A(I)/MCS
  53         C=(A(2)-A(1)**2)/L**2/TEMP**2
  54         X=(A(4)-A(3)**2)/L**2/TEMP
  55         ENG=A(1)/L**2
  56         AMG=A(3)/L**2
  57         WRITE(6,100) TEMP,L,ENG,C,AMG,X
  58    100  FORMAT(' TEMP=',F10.5,' SIZE=',I5,
  59        * /' ENG =',F10.5,' C   =',F10.5,
  60        * /' MAG =',F10.5,' X   =',F10.5)
  ```

- 移植後：コードは不要です。スケジューラが `Energy` と `Magnetization` の可観測量を自動的に収集し、標準の ALPS 結果ファイルに書き出します——詳しくは下記の[移植したプログラムを実行する](#移植したプログラムを実行する)を参照してください。

#### 終了処理

元のコードは静的配列を使っているため、明示的なクリーンアップがありません。移植後は、動的に確保した配列を `alps_finalize` で解放しなければなりません。

- 移植前：コードは不要です。

- 移植後（`alps_finalize`）：

  ```fortran
  subroutine alps_finalize(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)

    deallocate(IP)
    deallocate(IM)
    deallocate(P)
    deallocate(IS)

    return
  end subroutine alps_finalize
  ```

#### リスタート対応

`alps_save` と `alps_load` を実装すると、チェックポイント／リスタート機能が追加されます。元のコードにはリスタート対応がありません。以下の例はそれを追加する方法を示しています。

- 移植前：コードは不要です。

- 移植後（`alps_save`）：

  ```fortran
  subroutine alps_save(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer caller(2)

    call alps_dump(K, 1, ALPS_INT, caller)
    call alps_dump(IX, 1, ALPS_INT, caller)
    call alps_dump(IS, L * L, ALPS_INT, caller)

    return
  end subroutine alps_save
  ```

計算を再開するために必要な変数（`K`、`IX`、`IS`）だけが保存されます。

- 移植後（`alps_load`）：

  ```fortran
  subroutine alps_load(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)

    call alps_restore(K, 1, ALPS_INT, caller)
    call alps_restore(IX, 1, ALPS_INT, caller)
    call alps_restore(IS, L * L, ALPS_INT, caller)

    return
  end subroutine alps_load
  ```

データは保存したときと同じ順序で復元しなければなりません。なお、ALPS プログラムがリスタートするとき、`alps_load` より前に `alps_init` が呼び出されるため、メモリの確保と変数の初期化はいつもどおり `alps_init` で行われます——`alps_load` は保存された値を復元するだけで済みます。

#### マルチスレッド対応

スレッドレベル並列で実行するには、並列サブルーチンからアクセスされるすべてのモジュール変数を `threadprivate` として宣言する必要があります。`ising_mod` に次の行を追加します。

- 移植後（マルチスレッド）：

  ```fortran
  module ising_mod
    implicit none
    real, parameter :: V0 = .465661288D-9

    integer, allocatable, dimension(:) :: IP, IM
    integer, allocatable, dimension(:,:) :: IS
    real*8, allocatable, dimension(:) :: P
    integer :: K, MCS, INT, L, IX
    real :: TEMP
    !$omp threadprivate (K, MCS, INT, TEMP, IP, IM, P, IS, IX, L)
  end module ising_mod
  ```

これは[変数の宣言](#変数の宣言)で示した `ising_mod` そのものです——チュートリアルで実際に提供されている `ising_impl.f90` は、中間段階のシングルスレッド版ではなく、完成したスレッドセーフなプログラムを示しているため、すでにこの行を含んでいます。

### `ising.C` について

`ising.C` ファイルはプログラムのエントリーポイントを提供します。内容は上記の[エントリーポイント](#エントリーポイント)で説明したものとまったく同じです。`main` 関数の本体自体は変更する必要はありません。あなた自身のプログラム用にメタデータ文字列だけを更新してください。

### `CMakeLists.txt` について

上記の[CMakeLists.txt の編集](#cmakeliststxt-の編集)で示したのと同じパターンに従って、`CMakeLists.txt` をあなた自身のソースファイル名に合わせて更新してください——以下は、実際にこのチュートリアルをビルドするために使われている `CMakeLists.txt` そのものです。

```cmake
cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(alpsize NONE)

# find ALPS Library
find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)
message(STATUS "Found ALPS: ${ALPS_ROOT_DIR} (revision: ${ALPS_VERSION})")
include(${ALPS_USE_FILE})

# enable C, C++, and Fortran compilers
enable_language(C CXX Fortran)

# rule for generating ising program
add_executable(ising ising.C ising_impl.f90)
target_link_libraries(ising ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
```

## 移植したプログラムを実行する

[Integration-02](../alpsize02) の `hello` サンプルと同じ方法でビルドします。

```bash
$ cmake -DALPS_ROOT_DIR=${ALPS_ROOT} .
$ make
```

チュートリアルのディレクトリには、それぞれ異なる温度・格子サイズ・スイープ数を持つ 4 つのクローンからなる `ising_params` パラメータファイルが用意されています。

```
ALGORITHM = "ising"
{ TEMPERATURE = 2.5; MCS = 1000; INT = 1000; L=10; }
{ TEMPERATURE = 2.3; MCS = 900; INT = 1100; L=20; }
{ TEMPERATURE = 2.1; MCS = 800; INT = 1200; L=30; }
{ TEMPERATURE = 1.9; MCS = 700; INT = 1300; L=40; }
```

Integration-02 とまったく同じように、これを XML に変換して実行します。

```bash
$ cp ${SAMPLES}/alpsize-11-fortran-ising/ising_params .
$ parameter2xml ising_params
$ ./ising ising_params.in.xml
```

チュートリアルで提供されている `ising_impl.f90` では、`alps_init` と `alps_finalize` が短い診断バナーを出力するため（上記の[初期化](#初期化)のコールアウトを参照）、各クローンは開始時と終了時にそれぞれ次のように自分自身を報告します。

```
----- alps_init( 0 ) -----
   TEMP =  2.5000000000000000
   MCS =  1000
   INT =  1000
   L =  10
```

4 つのクローンすべてが完了すると、ALPS は蓄積された `Energy` と `Magnetization` の可観測量を——C++ チュートリアルで `alps::alea` が提供するのとまったく同様に、自動的に計算された誤差付きで——標準の ALPS 結果ファイルに書き出します。これらは、[ALPS ドキュメント](https://alps.comp-phys.org)のいたるところで紹介されている通常の ALPS/`pyalps` ツールで確認できます。

## 次のステップ

これで ALPS 統合チュートリアルシリーズは完了です。パラメータ、可観測量、チェックポイント、並列クローンという同じ基盤のスケジューラが、純粋な C から駆動される様子（[Integration-00](../alpsize00)）、ビルドシステムのレベルで説明される様子（[Integration-01](../alpsize01)）、そして Fortran から駆動される様子（[Integration-02](../alpsize02) とこのページ）を、それぞれ見てきました。チュートリアルの一覧に戻るには[統合セクションの概要](../)を、あなた自身のコードの統合が終わった後に ALPS で他に何がシミュレートできるかを知るには [ALPS 格子ライブラリ](../../intro/latticehowtos)と[メソッドのドキュメント](../../methods)を参照してください。
