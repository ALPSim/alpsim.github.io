
---
title: Alpsize-01 CMake
math: true
toc: true
weight: 2
---

## CMake によるパッケージング

プログラムのパッケージングには CMake（バージョン 2.8 以降）を使用します。CMake はソフトウェアのビルドプロセスを管理するクロスプラットフォームのシステムです。設定ファイル **CMakeLists.txt** を用いて cmake & make でコンパイルできます。Makefile を直接手書きするよりも CMakeLists.txt の記述は一般的にずっと簡単です。以下の図はパッケージングの流れのイメージです。パッケージングは CMakeList.txt を編集することで行います。

パッケージングの流れ（図は未掲載）

CMakeList.txt はヘッダ、ALPS 環境のインポート、ターゲット依存関係の記述、および（必要に応じて）テストの記述から構成されます。
ALPS ライブラリは CMake 用の ALPS 設定ファイルを `/opt/alps/share/alps/ALPSConfig.cmake` に提供しています。このファイルをインクルードすると、ALPS のビルド時に使用するすべての設定変数が設定されます。さらに `/opt/alps/share/alps/UseALPS.cmake` をあなたの CMake ファイルにインクルードすると、ALPS を使用するためのコンパイラとリンカのオプションが自動的に設定されます。以下に `CMakeLists.txt` の例を示します。完全なソースコードは [tutorials/alpsize-01-cmake/]() にあります。

```
cmake_minimum_required(VERSION 2.8 FATAL_ERROR)
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

`find_package` の `NO_SYSTEM_ENVIRONMENT_PATH` オプションは必須です。これを省略すると、変数（コンパイラなど）がシステムのデフォルト値で上書きされてしまいます。

## CMake の実行

cmake を実行するときは、`-DALPS_ROOT_DIR` オプションで ALPS のインストール先を指定します。

    $ cmake -DALPS_ROOT_DIR=/opt/alps /somewhere/to/your/source/code

または、環境変数 `$ALPS_HOME` で ALPS の場所を cmake に伝えることもできます。

    $ export ALPS_HOME=/opt/alps
    $ cmake /somewhere/to/your/source/code
    -- Found ALPS: ...
    [snip]
    -- Configuring done
    -- Generating done
    -- Build files have been written to: /home/alps/tutorial

cmake は Makefile を生成します。次に make を実行してプログラムをビルドします。

    $ make
    [100%] Building CXX object CMakeFiles/hello.dir/hello.C.o
    Linking CXX executable hello
    [100%] Built target hello
    $ ./hello
    hello, world

CTest ツールを使ってテストを実行します。CTest は hello を実行し、その出力内容を `hello.op` の内容と比較します。

    $ ctest
    Test project /home/alps/tutorial
        Start 1: hello
    1/1 Test #1: hello ............................   Passed    0.07 sec

    100% tests passed, 0 tests failed out of 1

    Total Test time (real) =   0.07 sec
