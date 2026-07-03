---
title: Alpsize-01 CMake
math: true
toc: true
weight: 2
---

## CMake によるパッケージング

ALPS はビルドシステムとして CMake（バージョン 3.18 以降）を使用しています。CMake はソフトウェアのビルドプロセスを管理するためのクロスプラットフォームツールです。**CMakeLists.txt** という設定ファイルをもとに `cmake` と `make` を実行してコードをコンパイルします。CMakeLists.txt の記述は、Makefile を手書きするよりも一般的にはるかに簡単です。

`CMakeLists.txt` はいくつかの部分で構成されています：ヘッダー、ALPS 環境のインポート、ターゲットの依存関係の記述、そして（必要に応じて）テストの定義です。
ALPS ライブラリは `${ALPS_ROOT}/share/alps/ALPSConfig.cmake`（`${ALPS_ROOT}` は ALPS のインストールプレフィックス、例：`/opt/alps`）に CMake 設定ファイルを提供しています。このファイルをインクルードすることで、ALPS のビルドに必要なすべての設定変数がセットされます。また `${ALPS_ROOT}/share/alps/UseALPS.cmake` をインクルードすると、ALPS を使用するためのコンパイラとリンカのオプションが自動的に設定されます。以下は `CMakeLists.txt` の例です。完全なソースファイルは [ALPS リポジトリ](https://github.com/ALPSim/ALPS) で入手できます：

```
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
    
`find_package` の `NO_SYSTEM_ENVIRONMENT_PATH` オプションは必須です。これを省略すると、コンパイラなどの変数がシステムのデフォルト値で上書きされてしまいます。

## CMake の実行

cmake を実行する際は、`-DALPS_ROOT_DIR` オプションで ALPS のインストールパスを指定します：

    $ cmake -DALPS_ROOT_DIR=/path/to/alps /path/to/your/source
    
または、`$ALPS_HOME` 環境変数を設定しておくと、CMake が自動的に ALPS を検出します：

    $ export ALPS_HOME=/path/to/alps
    $ cmake /path/to/your/source
    -- Found ALPS: ...
    [snip]
    -- Configuring done
    -- Generating done
    -- Build files have been written to: /home/alps/tutorial
    
CMake が Makefile を生成します。次に `make` を実行してプログラムをビルドします：

    $ make
    [100%] Building CXX object CMakeFiles/hello.dir/hello.C.o
    Linking CXX executable hello
    [100%] Built target hello
    $ ./hello
    hello, world
    
CTest ツールを使ってテストを実行します。CTest は hello を実行し、その出力を `hello.op` の内容と比較します：

    $ ctest
    Test project /home/alps/tutorial
        Start 1: hello
    1/1 Test #1: hello ............................   Passed    0.07 sec

    100% tests passed, 0 tests failed out of 1

    Total Test time (real) =   0.07 sec
