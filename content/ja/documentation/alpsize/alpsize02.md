---
title: Integration-02 Fortran 入門
math: true
toc: true
weight: 3
---

本章では ALPS Fortran のインストール方法と使い方を説明します。読者が Fortran プログラミングの基本的な知識を持っていることを前提としています。

## 動作環境

ALPS Fortran は ALPS システム上で Fortran コードを実行するためのラッパーライブラリです。使用には以下の環境が必要です。

|       |          |
| :---- | :------- |
| ALPS  | 動作環境の要件とインストール手順については [ALPS インストールページ](https://alps.comp-phys.org/install/) を参照してください。 |
| CMake | バージョン 3.18 以降。ALPS Fortran とクライアントコードのコンパイルに使用します。 |
| Fortran コンパイラ（GNU/Intel/Fujitsu） | ALPS のビルドに使用したものと同じコンパイラが必要です。インストール手順は各コンパイラのマニュアルを参照してください。 |

## インストール

ALPS Fortran は ALPS ソースツリーに適用するパッチファイルとして提供されます。

1. **パッチのダウンロード**

   [ALPS リポジトリ](https://github.com/ALPSim/ALPS) から ALPS Fortran アーカイブをダウンロードして展開します：

        $ cd ~/
        $ wget http://xxx.xxx/alps_fortran.tar.gz
        $ tar -zxvf alps_fortran.tar.gz

   以下のファイルとディレクトリが作成されます：

        alps_fortran/
            + alps_fortran.patch
            + samples/
                + hello/
                + ising/
                + looper-2/
                + tutorial/

2. **パッチの適用**

   ALPS ソースディレクトリ（`${ALPS_SRC}`）に移動し、パッチを適用します：

        $ cd ${ALPS_SRC}
        $ patch -p0 < ~/alps_fortran/alps_fortran.patch

3. **ALPS のビルドとインストール**

   [インストールドキュメント](https://alps.comp-phys.org/install/) に従って ALPS をビルドしてください。ALPS Fortran は ALPS と同時にインストールされ、以下のファイルが生成されます（`${ALPS_ROOT}` は ALPS のインストールプレフィックス）：

   - `${ALPS_ROOT}/lib/libalps_fortran.a`
   - `${ALPS_ROOT}/include/alps/fortran/alps_fortran.h`
   - `${ALPS_ROOT}/include/alps/fortran/fortran_wrapper.h`
   - `${ALPS_ROOT}/include/alps/fortran/fwrapper_impl.h`

## サンプルソースコード

ALPS Fortran には 3 つのサンプルアプリケーションが含まれています：

- **"hello"** — 計算は行わず、パラメータファイルの内容を標準出力に表示するだけのアプリケーション。
- **"ising"** — Ising モデル計算のサンプルアプリケーション。
- **"looper-2"** — 外部ライブラリの使用例を示すサンプルアプリケーション。

以降のセクションでは `hello` アプリケーションのビルドと実行方法を説明します。`ising` と `looper-2` も同じ手順でビルド・実行できます。

### "hello" アプリケーション

hello アプリケーションは以下のファイルで構成されています：

- `hello_impl.f90` — メインプログラム
- `hello.C` — エントリポイントの設定
- `hello_params` — パラメータファイル
- `CMakeLists.txt` — ビルド設定

### コンパイル

1. **ビルドディレクトリの作成**

        $ mkdir -p ${HOME}/alps_fortran_build/hello
        $ cd ${HOME}/alps_fortran_build/hello

2. **CMake の実行**

   ソースディレクトリを指定して cmake を実行します（`${SAMPLES}` は ALPS Fortran アーカイブを展開して生成されたサンプルフォルダ）：

        $ cmake -DALPS_ROOT:PATH=${ALPS_ROOT} \
        >       ${SAMPLES}/hello

3. **ビルド**

        $ make

   ビルドが完了すると、カレントディレクトリに実行ファイル `hello` が生成されます。

### スレッドレベルの並列化

1. **ビルドディレクトリへの移動**

        $ cd ${HOME}/alps_fortran_build/hello

   前回の実行結果ファイル（`hello_param.out.*`）が残っている場合は、次のステップに進む前にすべて削除してください。

2. **パラメータファイルの準備**

   パラメータファイルから XML 入力ファイルを生成します：

        $ cp ${SAMPLES}/hello/hello_params .
        $ parameter2xml hello_params

   `parameter2xml` コマンドの詳細は [ALPS ドキュメント](https://alps.comp-phys.org) を参照してください。

3. **実行**

        $ ./hello hello_params.in.xml

   `hello_params` で定義されたパラメータが標準出力に表示されます。実行結果の例：

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

1. **ビルドディレクトリへの移動**

        $ cd ${HOME}/alps_fortran_build/hello

   上記と同様に、実行前に結果ファイル（`hello_param.out.*`）が残っていないことを確認してください。

2. **パラメータファイルの準備**

        $ cp ${SAMPLES}/hello/hello_params .
        $ parameter2xml hello_params

3. **MPI での実行**

        $ mpirun -np 4 -x OMP_NUM_THREADS=1 ./hello --mpi hello_params.in.xml

   `hello_params` で定義されたパラメータが標準出力に表示されます（スレッドレベルの例と同様）。
