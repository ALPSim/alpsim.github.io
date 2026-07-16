
---
title: Integration-02 Fortran 入門
math: true
toc: true
weight: 3
---

本章では、既存の Fortran シミュレーションコードを ALPS Parapack スケジューラと統合するための ALPS の機能である ALPS Fortran のビルド方法と使い方を説明します。読者が Fortran プログラミングの基本的な知識を持っていることを前提としています。ALPS の C++ インターフェースに事前に慣れている必要はありませんが、[Integration-00](../alpsize00) をすでに読んだ方は、そこで登場したのと同じスケジューラの概念（Worker クラス、可観測量、チェックポイント）が、ここでは Fortran の形で再び現れることに気づくでしょう。

具体的には、ALPS Fortran は小さな C++ の「ラッパー」Worker クラスである `alps::fortran_wrapper` を提供することで動作します。これは [Integration-00 のステップ 9](../alpsize00#ステップ-9--alpsparapack-スケジューラとの完全な統合)で手書きした `wolff_worker` クラスとまったく同じように ALPS Parapack スケジューラに組み込まれますが、C++ のメンバ関数の代わりに、あなたが実装する一連の Fortran サブルーチン（`alps_init`、`alps_run`、`alps_progress` など）を呼び出します。そのため、C++ を一切書かなくても、Fortran プログラムは [Integration-00 の冒頭](../alpsize00#既存プログラムを-alps-と統合する理由)で説明したのと同じ利点——パラメータ駆動の並列化、チェックポイント／再起動、結果の自動集約——を得られるのです。

## 動作環境

使用には以下の環境が必要です。

|       |          |
| :---- | :------- |
| ALPS  | `ALPS_BUILD_FORTRAN` という CMake オプションを有効にしてビルドしたもの（下記の[インストール](#インストール)を参照）。一般的な動作環境の要件については [ALPS インストールページ](https://alps.comp-phys.org/install/) を参照してください。 |
| CMake | バージョン 3.18 以降。ALPS 本体とあなたの Fortran クライアントコードの両方のコンパイルに使用します。 |
| Fortran コンパイラ（GNU/Intel/Fujitsu） | ALPS のビルドに使用したものと同じコンパイラが必要です。Fortran の名前修飾（name mangling）やランタイムライブラリはコンパイラ間で互換性がないためです。インストール手順は各コンパイラのマニュアルを参照してください。 |

## インストール

ALPS Fortran のサポートは ALPS のメインソースツリーに直接組み込まれており（`src/alps/fortran/` として）、別途ダウンロードやパッチ適用を行う必要はありません。デフォルトでは無効になっているだけなので、ALPS 自体をビルドする際に CMake オプションで有効にします。

```bash
$ cmake -DALPS_BUILD_FORTRAN=ON ...
```

（[ソースから ALPS をビルドする](https://alps.comp-phys.org/install/)際にすでに指定している他のオプションと一緒に追加してください）。このオプションを有効にして ALPS をビルドすると、以下のファイルが追加で生成されます（`${ALPS_ROOT}` は ALPS のインストールプレフィックス、例：`/opt/alps`）。

- `${ALPS_ROOT}/lib/libalps_fortran.a`
- `${ALPS_ROOT}/include/alps/fortran/alps_fortran.h`
- `${ALPS_ROOT}/include/alps/fortran/fortran_wrapper.h`
- `${ALPS_ROOT}/include/alps/fortran/fwrapper_impl.h`

また、`ALPS_FORTRAN_LIBRARIES` という CMake 変数も追加で定義され、通常の `ALPS_LIBRARIES` と合わせて、あなた自身のプロジェクトの `CMakeLists.txt` からリンクします（下記の[コンパイル](#コンパイル)を参照）。

## サンプルソースコード

ALPS には、[ALPS リポジトリ](https://github.com/ALPSim/ALPS)内の完全なチュートリアルディレクトリとして、2 つの Fortran サンプルアプリケーションが含まれています。

- **`tutorials/alpsize-10-fortran-scheduler`**（"hello"）— 実際の計算は行わず、パラメータファイルの内容をそのまま読み込んで表示するだけです。パラメータが正しく渡されているかを確認するのに便利です。
- **`tutorials/alpsize-11-fortran-ising`**（"ising"）— 既存の Fortran Ising モデルプログラムを ALPS Fortran に移植する、完全な実例です。詳しくは [Integration-03：Fortran アプリケーション開発](../alpsize03)で解説します。

このページの残りの部分では、`hello` アプリケーションのビルドと実行方法を説明します。`ising` アプリケーションも同じビルド・実行手順に従います。そのサブルーチンが実際に何をしているかは Integration-03 を参照してください。

### "hello" アプリケーション

hello アプリケーションは以下のファイルで構成されています。

- `hello_impl.f90` — ALPS が呼び出す Fortran サブルーチン（`alps_init`、`alps_run` など）
- `hello.C` — `PARAPACK_REGISTER_WORKER` を使って `alps::fortran_wrapper` をスケジューラに登録し、起動する短い C++ ファイル。[Integration-00 のステップ 9](../alpsize00#ステップ-9--alpsparapack-スケジューラとの完全な統合)で説明した通常の C++ Worker と同様に、バージョン・著作権表示の文字列以外はこのファイルを変更する必要はありません
- `hello_params` — [Integration-00](../alpsize00) で使われているのと同じテキスト形式の ALPS パラメータファイル
- `CMakeLists.txt` — ビルド設定

### コンパイル

1. **ビルドディレクトリの作成**

   ```bash
   $ mkdir -p ${HOME}/alps_fortran_build/hello
   $ cd ${HOME}/alps_fortran_build/hello
   ```

2. **CMake の実行**

   ソースディレクトリを指定します（`${SAMPLES}` は ALPS の `tutorials/` ディレクトリをチェックアウトまたは展開した場所です）。

   ```bash
   $ cmake -DALPS_ROOT_DIR=${ALPS_ROOT} \
   >       ${SAMPLES}/alpsize-10-fortran-scheduler
   ```

3. **ビルド**

   ```bash
   $ make
   ```

   ビルドが完了すると、カレントディレクトリに実行ファイル `hello` が生成されます。

### 簡単な動作確認

スレッドや MPI による並列化を設定する前に、ビルドそのものがきちんと動くことを確認しておく価値があります。`hello.C` は [Integration-00 のステップ 9](../alpsize00#ステップ-9--alpsparapack-スケジューラとの完全な統合)で使ったのと同じ Parapack スケジューラを起動するので、そのステップと同じように、パラメータファイルを標準入力から直接渡すことができます。

```bash
$ ./hello <hello_params
```

これによって `hello_params` 内の各パラメータセットにつき 1 ブロックの出力（下記のサンプルファイルの場合は 5 ブロック）が表示されれば、ビルドは正しく動作しています。次に説明する標準的な実行方法に進んでください。

### スレッドレベルの並列化

1. **ビルドディレクトリへの移動**

   ```bash
   $ cd ${HOME}/alps_fortran_build/hello
   ```

   前回の実行結果ファイル（`hello_param.out.*`）が残っている場合は、次のステップに進む前にすべて削除してください。

2. **パラメータファイルの準備**

   パラメータファイルから XML 入力ファイルを生成します。

   ```bash
   $ cp ${SAMPLES}/alpsize-10-fortran-scheduler/hello_params .
   $ parameter2xml hello_params
   ```

   `parameter2xml` コマンドの詳細は [ALPS ドキュメント](https://alps.comp-phys.org)を参照してください。上記の動作確認のように直接パイプで渡すのではなく、このように XML に変換することで、スケジューラは複数の並列クローンを管理し、構造化された再開可能な結果ファイルを書き出せるようになります。

   パラメータファイル自体には、`{ ... }` ブロックごとに 1 組、合計 5 組のパラメータセットが列挙されています。スケジューラはこの 5 組それぞれを独立したクローンとして実行します。

   ```
   ALGORITHM = "hello"
   { WORLD = "world"; X = 3.2; Y = 0; Z=defined }
   { WORLD = "alps"; X = -3.1; Y = 3*2 }
   { WORLD = "looper"; X = 0.001; Y = -100 }
   { WORLD = "japan"; X = 100.0; Y = 2 }
   { WORLD = "wistaria"; X = 3; Y = 0 }
   ```

3. **実行**

   ```bash
   $ ./hello hello_params.in.xml
   ```

   各クローンは `alps_init` を呼び出し、自分自身の `X`、`Y`、`WORLD` パラメータを読み込み、そのクローンで `Z` が定義されているかどうかを報告します（定義されているのは最初の 1 つだけです）。複数の CPU コアが使える場合、スケジューラは各クローンを別々の「スレッドグループ」に振り分け、複数を同時に実行します——これはまさに [Integration-00 の冒頭](../alpsize00#既存プログラムを-alps-と統合する理由)で挙げた「コードを追加することなくパラメータ並列化が可能」という利点が実際に働いている例です。実行結果の例：

   ```
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
   ```

   なお、パラメータファイル中の `Y = 3*2` は ALPS のパラメータパーサによって `6` と評価され、`X = 0.001` は Fortran の指数表記で `1.00000000000000002E-003` と表示されます。どちらも想定通りの挙動であり、バグではありません。

### MPI 並列化

1. **ビルドディレクトリへの移動**

   ```bash
   $ cd ${HOME}/alps_fortran_build/hello
   ```

   上記と同様に、実行前に結果ファイル（`hello_param.out.*`）が残っていないことを確認してください。

2. **パラメータファイルの準備**

   ```bash
   $ cp ${SAMPLES}/alpsize-10-fortran-scheduler/hello_params .
   $ parameter2xml hello_params
   ```

3. **MPI での実行**

   ```bash
   $ mpirun -np 4 -x OMP_NUM_THREADS=1 ./hello --mpi hello_params.in.xml
   ```

   `--mpi` フラグは、1 プロセス内のスレッドだけでなく（あるいはそれに加えて）4 つの MPI プロセスに 5 つのクローンを分散させるようスケジューラに指示します。1 台のマシンのコア数だけでは足りなくなった場合に役立ちます。`hello_params` で定義されたパラメータは、スレッドレベルの例と同様に標準出力に表示されます。

## 次のステップ

`hello` サンプルのビルドと実行がうまくいったら、[Integration-03：Fortran アプリケーション開発](../alpsize03)に進んでください。そこでは、上で使った一連の `alps_*` サブルーチンについて詳しく説明するとともに、実際に存在する既存の Fortran Ising モデルプログラム（`tutorials/alpsize-11-fortran-ising` にある `ising_original.f`）をこのフレームワークに移植する手順を、一歩ずつ解説しています。
