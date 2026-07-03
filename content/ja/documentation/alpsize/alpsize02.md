
---
title: Alpsize-02 Fortran 入門
math: true
toc: true
weight: 3
---

これは ALPS Fortran のチュートリアルです。本章では ALPS Fortran のインストール方法と使い方を説明します。このチュートリアルは読者が Fortran プログラミングの知識を持っていることを前提としています。

## 動作環境

ALPS Fortran は Fortran コードを ALPS システム上で実行するためのラッパーライブラリです。そのため、ALPS Fortran を使用するには以下の環境が必要です。

|       |          |
| :---- | :------- |
| ALPS  | ALPS の動作環境とインストール手順については、こちらをご参照ください |
| CMake | クライアントコードと ALPS Fortran のコンパイルに CMake を使用します（CMake バージョン 2.8.0 以降） |
| Fortran コンパイラ（Gnu/Intel/Fujitsu） | ALPS のビルドに使用したものと同じコンパイラが必要です。各コンパイラのインストール手順については、それぞれのマニュアルをご参照ください |

## インストール

ALPS Fortran はパッチファイルとして提供されており、ALPS システムにパッチを適用することで使用できます。ALPS Fortran のパッチ適用手順は以下のとおりです。

1. パッチのダウンロード

以下の URL からダウンロードします。

    $ cd ~/
    $ wget http://xxx.xxx/alps_fortran.tar.gz
    $ tar –zxvf alps_fortran.tar.gz

上記の手順を実行すると、以下のファイルとディレクトリが作成されます。

    alps_fortran/
        + alps_fortran.patch
        +samples/
            +hello/
            +ising/
            +looper-2/
            +tutorial/

2. パッチの適用

ALPS ソースディレクトリ（${ALPS_SRC}）に移動し、パッチを適用します。

    $ cd ${ALPS_SRC}
    $ patch –p0 < ~/alps_fortran/alps_fortran.patch

3. ALPS システムのビルドとインストール

HP マニュアルに従って ALPS システムをビルドすると、ALPS Fortran も同時にインストールされます。

- ${ALPS_ROOT}/lib/libalps_fortran.a
- ${ALPS_ROOT}/include/alps/fortran/alps_fortran.h
- ${ALPS_ROOT}/include/alps/fortran/fortran_wrapper.h
- ${ALPS_ROOT}/include/alps/fortran/fwrapper_impl.h
- ${ALPS_ROOT} は ALPS のインストールディレクトリを示します

## サンプルソースコード

ALPS Fortran には以下のサンプルコードが含まれています。

"hello" アプリケーション

- 計算は行わず、パラメータファイルの内容を標準出力に表示するだけです。

"ising" アプリケーション
- Ising モデルの計算サンプルアプリケーションです。

"looper-2" アプリケーション
- 外部ライブラリを使用するアプリケーションのサンプルです。

次節以降では hello アプリケーションのビルドと実行方法を説明します。ising および looper-2 アプリケーションも hello と同じ手順でビルド・実行できます。

### "hello" アプリケーション

hello アプリケーションは以下のファイルから構成されています。
- `hello_impl.f90`：メインプログラム
- `hello.C`：エントリーポイントの設定
- `hello_params`：パラメータファイル
- `CMakeLists.txt`：設定ファイル

### コンパイル

コンパイル手順は以下のとおりです。

1. ビルド用作業ディレクトリの作成

"hello" アプリケーションのビルド結果を格納する作業ディレクトリを作成します。

    $ mkdir –p ${HOME}/alps_fortran_build/hello
    $ cd ${HOME}/alps_fortran_build/hello

2. cmake の実行

ソースコードのディレクトリを指定して cmake を実行します（${SAMPLES} は ALPS Fortran を展開した際に生成されるサンプルフォルダです）。

    $ cmake –DALPS_ROOT:PATH=${ALPS_ROOT} \
    >       ${SAMPLES}/hello

3. "hello" アプリケーションのビルド

cmake コマンドを実行すると Makefile などのビルドに必要なファイルが生成されます。その後 make を実行します。

    $ make

ビルド完了後、カレントディレクトリに実行ファイル "hello" が生成されます。

### スレッドレベルの並列化

スレッドレベルの並列化手順は以下のとおりです。

1. 作業ディレクトリへの移動

"hello" アプリケーションをビルドした作業ディレクトリに移動します。

    $ cd ${HOME}/alpls_fortran_build/hello

なお、作業ディレクトリ内に実行結果ファイル（`hello_param.out.*`）が存在するとアプリケーションを実行できません。そのようなファイルが存在する場合は、次の手順に進む前にすべて削除してください。

2. パラメータファイルの準備

{SAMPLES}/hello にあるパラメータファイルから XML ファイルを生成します。

    $ cp ${SAMPLES}/hello/hello_params .
    $ parameter2xml hello_params

`parameter2xml` コマンドの詳細については ALPS のホームページを参照してください。

3. "hello" の実行

以下のようにアプリケーションを実行します。

    $ ./hello hello_params.in.xml

hello アプリケーションを実行すると、`hello_params` で定義されたパラメータが標準出力に表示されます。以下は実行結果の抜粋です。

    ##### alps_init() #####
    parameter X     =    3.2000000000000002
    parameter Y     =            0
    parameter WORLD = world
    defined parameter Z =            1
    
[2011-May-13 11:45:42]: dispatching a new clone[1,1] on threadgroup[3]

    ##### alps_init() #####
    parameter X     =   -3.1000000000000001
    parameter Y     =            6
    parameter WORLD = alps
    defined parameter Z =            0
    
[2011-May-13 11:45:42]: dispatching a new clone[2,1] on threadgroup[8]

    ##### alps_init() #####
    parameter X     =   1.00000000000000002E-003
    parameter Y     =         -100
    parameter WORLD = looper
    defined parameter Z =            0
    
[2011-May-13 11:45:43]: dispatching a new clone[3,1] on threadgroup[7]
[2011-May-13 11:45:43]: clone[3,1] finished on threadgroup[7]

    ##### alps_init() #####
    parameter X     =    100.00000000000000
    parameter Y     =            2
    parameter WORLD = japan
    defined parameter Z =            0
    
[2011-May-13 11:45:43]: dispatching a new clone[4,1] on threadgroup[1]
[2011-May-13 11:45:43]: clone[4,1] finished on threadgroup[1]

    ##### alps_init() #####
    parameter X     =    3.0000000000000000
    parameter Y     =            0
    parameter WORLD = wistaria
    defined parameter Z =            0

### MPI 並列化

MPI 並列化の手順は以下のとおりです。

1. 作業ディレクトリへの移動

"hello" アプリケーションをビルドした作業ディレクトリに移動します。

    $ cd ${HOME}/alpls_fortran_build/hello

なお、作業ディレクトリ内に実行結果ファイル（`hello_param.out.*`）が存在するとアプリケーションを実行できません。そのようなファイルが存在する場合は、次の手順に進む前にすべて削除してください。

2. パラメータファイルの準備

{SAMPLES}/hello にあるパラメータファイルから XML ファイルを生成します。

    $ cp ${SAMPLES}/hello/hello_params .
    $ parameter2xml hello_params

3. アプリケーションの実行

以下のようにアプリケーションを実行します。

    $ mpirun -np 4 -x OMP_NUM_THREADS=1 ./hello --mpi hello_params.in.xml

上記と同様に、`hello_params` で定義されたパラメータが標準出力に表示されます。
