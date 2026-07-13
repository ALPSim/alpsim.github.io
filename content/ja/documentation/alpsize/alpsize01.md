
---
title: Integration-01 CMake
math: true
toc: true
weight: 2
---

## CMake とは何か、ALPS はなぜそれを使うのか

CMake はクロスプラットフォームのビルド構成ツールです。Makefile を手書きすると、すぐにプラットフォーム固有のコンパイラ・リンカオプションが絡み合った代物になってしまいますが、その代わりに **CMakeLists.txt** という短く可搬性のあるファイルで「何をビルドするか」を記述すれば、CMake がお使いのプラットフォーム向けの実際のビルドファイル（Linux/macOS なら Makefile、Windows なら Visual Studio プロジェクトなど）を生成してくれます。その後は `cmake` に続けて `make` を実行するだけでコンパイルできます。

ALPS 自体も CMake でビルドされており、ALPS を見つけてリンクする方法を記述した CMake 設定ファイル一式が付属しています。自分のプログラムにも CMake を使うことで、正しいコンパイラ・リンカオプションを自分で調べることなく、この基盤をそのまま再利用できます。ALPS は **CMake 3.18 以降**を必要とします——インストールや更新が必要な場合は[インストールガイド](https://alps.comp-phys.org/install/)を参照してください。

このページでは、[Integration-00](../alpsize00) で使われている `CMakeLists.txt` を 1 行ずつ解説します。動作するサンプルをコピーしてすぐ先に進みたい場合は下のコードブロックだけを見れば十分です。各行が何をしているのか理解したい場合は、このまま読み進めてください。

## CMakeLists.txt の構造

`CMakeLists.txt` はいくつかの部分で構成されています：ヘッダー、ALPS 環境のインポート、ビルドするターゲットの記述、そして（任意で）テストの定義です。以下は [Integration-00](../alpsize00) のステップ 1 で使われている完全なファイルです。完全なソースファイル一式は [ALPS リポジトリ](https://github.com/ALPSim/ALPS)で入手できます。

```cmake
cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(alpsize NONE)

# find ALPS Library
find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)
message(STATUS "Found ALPS: ${ALPS_ROOT_DIR} (revision: ${ALPS_VERSION})")
include(${ALPS_USE_FILE})

# enable C and C++ compilers
enable_language(C CXX)

# rule for generating 'hello world' program
add_executable(hello hello.C)
target_link_libraries(hello ${ALPS_LIBRARIES})
add_alps_test(hello)
```

- **`cmake_minimum_required` / `project(alpsize NONE)`** — 必要な CMake の最小バージョンを宣言し、プロジェクトに名前を付けます。引数 `NONE` は、プロジェクトのソースファイルから言語を自動検出*しない*よう CMake に指示するものです。どの言語を有効にするかは、次のブロックで明示的に指定します。

- **`find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)`** — インストールされている ALPS を探します。`PATHS` は CMake に 2 通りの探し方を与えます：コマンドラインの `-DALPS_ROOT_DIR` 変数、または環境変数 `$ALPS_HOME`（後述の[CMake の実行](#cmake-の実行)を参照）です。`REQUIRED` を指定すると、ALPS が見つからない場合にコンパイルやリンクの段階まで待たず、その場で明確なエラーとともに構成が失敗するようになります。

  {{< callout type="warning" >}}
  `NO_SYSTEM_ENVIRONMENT_PATH` は必須です。これを省略すると、`find_package` はシステムの標準的な場所も検索してしまい、実際にリンクしたものとは異なるコンパイラ・Boost インストール・ALPS バージョンを気づかないうちに拾ってしまうことがあります。その結果、リンク時に、あるいはさらに厄介なことに実行時に、原因の分かりにくい ABI の不整合が発生します。
  {{< /callout >}}

- **`include(${ALPS_USE_FILE})`** — ALPS に必要なコンパイラ・リンカ設定を適用します。内部的には、`find_package(ALPS ...)` が ALPS を `${ALPS_ROOT}/share/alps/ALPSConfig.cmake`（`${ALPS_ROOT}` は ALPS のインストールプレフィックス、例：`/opt/alps`）にインストールされた設定ファイルを読み込み、そこで `ALPS_INCLUDE_DIRS`、`ALPS_LIBRARIES`、`ALPS_USE_FILE` といった変数が定義されます。最後の変数は `${ALPS_ROOT}/share/alps/UseALPS.cmake` を指しており、これをインクルードすることでコンパイラ・リンカのフラグが自動的に設定されるため、正しい `-I` や `-L` のパスを自分で探す必要がありません。

- **`enable_language(C CXX)`** — C と C++ の両方のコンパイラを有効にします。`hello.C` 自体は C++ しか必要としませんが、このチュートリアルシリーズの後のステップでは C ファイル（`wolff.c`）や Fortran ファイルも追加されるため、同じ `CMakeLists.txt` テンプレートであらかじめ両方の言語を有効にしています。

- **`add_executable(hello hello.C)` / `target_link_libraries(hello ${ALPS_LIBRARIES})`** — ごく普通の CMake の記述です。`hello.C` から `hello` という名前の実行ファイルをビルドし、上で見つけた ALPS ライブラリとリンクします。

- **`add_alps_test(hello)`** — ALPS が提供するマクロを使って、`hello` を CTest のテストとして登録します。具体的には次のことを行います。（1）`hello` 実行ファイルを実行する。（2）ソースの隣に `hello.ip`（または `hello.input`）という名前のファイルがあれば、その内容を標準入力としてプログラムに渡す。（3）プログラムが標準出力に出力した内容を捕捉する。（4）`hello.op`（または `hello.output`）という名前のファイルがあれば、それと捕捉した出力をバイト単位で比較し、一致しなければテストを失敗させる。[Integration-00](../alpsize00) の各ステップで、期待どおりの数値が得られているかを検証しているのは、まさにこの仕組みです。

## CMake の実行

`cmake` を実行する際は、`-DALPS_ROOT_DIR` で ALPS のインストールパスを指定します。

```bash
$ cmake -DALPS_ROOT_DIR=/path/to/alps /path/to/your/source
```

あるいは、`$ALPS_HOME` 環境変数を設定しておけば、CMake が自動的に ALPS を検出します。同じシェルセッションで複数の ALPS ベースのプロジェクトをビルドする場合は、この方法が便利です。

```bash
$ export ALPS_HOME=/path/to/alps
$ cmake /path/to/your/source
-- Found ALPS: ...
[snip]
-- Configuring done
-- Generating done
-- Build files have been written to: /home/alps/tutorial
```

{{< callout type="info" >}}
このページの例では、チュートリアルを簡単にするために、ソースディレクトリ内で直接 `cmake`（例：`cmake .`）を実行する*イン・ソース*ビルドを行っています。継続して開発していくプロジェクトでは、代わりに*アウト・オブ・ソース*ビルドを採用することをお勧めします。別途ビルド用ディレクトリを作成し、その中から `cmake /path/to/source` を実行することで、生成されたファイルがソースファイルと混ざらないようにできます。
{{< /callout >}}

## ビルドとテスト

CMake は Makefile を生成します。`make` を実行してプログラムをビルドしてください。

```bash
$ make
[100%] Building CXX object CMakeFiles/hello.dir/hello.C.o
Linking CXX executable hello
[100%] Built target hello
$ ./hello
hello, world
```

`add_alps_test` によって登録されたテストは `ctest` ツールで実行します。

```bash
$ ctest
Test project /home/alps/tutorial
    Start 1: hello
1/1 Test #1: hello ............................   Passed    0.07 sec

100% tests passed, 0 tests failed out of 1

Total Test time (real) =   0.07 sec
```

これが成功するのは、チュートリアルのディレクトリに、CTest が期待する出力そのものである `hello, world` という内容の `hello.op` ファイルが同梱されているためです。今後 `hello.C` を変更して出力内容が変わった場合、`hello.op` を新しい内容に合わせて更新するまで、このテストは失敗し続けます。これはまさに意図された挙動です。意図しない動作の変化を検出するのが、このテストの目的だからです。

## 次のステップ

`CMakeLists.txt` と `add_alps_test` の仕組みを理解したところで、[Integration-00：はじめに・概要](../alpsize00)に戻り、同じ `cmake` / `make` / `ctest` のワークフローが、純粋な C コードから完全に ALPS と統合されたプログラムに至るまで、Wolff クラスターモンテカルロ法のチュートリアルの各ステップでどのように適用されているかを確認してください。
