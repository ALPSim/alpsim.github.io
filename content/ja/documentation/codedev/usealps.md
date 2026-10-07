
---
title: Code-00 自分のプロジェクトで ALPS を使う
math: true
toc: true
weight: 1
---

## CMake を使う

ALPS ライブラリには、CMake 用の ALPS 設定ファイル `/opt/alps/share/alps/ALPSConfig.cmake` も用意されています。このファイルをインクルードすると、ALPS のビルド時に使われたすべての設定変数が設定されます。さらにファイル `/opt/alps/share/alps/UseALPS.cmake` を CMake ファイルにインクルードすると、ALPS を使うためのコンパイラとリンカのオプションが自動的に設定されます。以下は `CMakeLists.txt` の例です。
 
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

find_package の NO_SYSTEM_ENVIRONMENT_PATH オプションは必須であることに注意してください。これがないと、変数（コンパイラなど）がシステムのデフォルトのもので上書きされてしまいます。
cmake を実行する際には、ALPS が置かれているパスを指定してください。

    cmake -DALPS_ROOT_DIR=/opt/alps /somewhere/to/your/source/code
    
あるいは、環境変数 $ALPS_HOME を使って ALPS の場所を cmake に伝えることもできます。

    export ALPS_HOME=/opt/alps
    cmake /somewhere/to/your/source/code

## make を使う

可能であれば、make ではなく cmake を使ってください。ALPS ライブラリには、ALPS を使うために必要なインクルードパス、リンクパス、リンクするライブラリをすべて設定する、Makefile 用のインクルードファイルが付属しています。このインクルードファイルは /opt/alps/share/alps/include.mk にあります（ALPS を /opt/alps 以外のパスにインストールした場合は、それに対応する場所にあります）。このインクルードファイルを使った Makefile の例は、C++ によるイジングモデルのチュートリアルの中で提供されています。
