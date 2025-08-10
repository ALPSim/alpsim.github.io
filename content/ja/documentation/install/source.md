---
title: ソースからのMac/LinuxへのALPSインストール
description: "ALPSインストールガイド"
weight: 2
toc: true
cascade:
    type: docs
---

多くの場合、[バイナリからのALPSインストール](../binary)が推奨されます。ただし、より高度な制御と設定が必要な場合は、ソースからのインストールが適切な選択肢となります。
{{% steps %}}

### 必要な依存関係のインストール

ALPSはいくつかの外部ライブラリに依存しています。<br>
システムに適した **1つ** のMPI実装と **1つ** のBLASプロバイダを選択してください：

| 依存関係 | 最低バージョン | インストールパッケージ |
|----------|----------------|------------------------|
| HDF5     | 1.10.0 | `libhdf5-dev` |
| CMake | 2.8 | `cmake` |
| C++ コンパイラ | GCC 10.5.0 または Clang 13.0.1 | `build-essential` |
| Boost | 1.76 <br>*(NumPy ≥ 2.0 / Python ≥ 3.13 の場合は 1.87)* | 下記参照 |
| MPI | OpenMPI 4.0 **または** MPICH 4.0 | `libopenmpi-dev` / `libmpich-dev` |
| BLAS | 0.3 | `libopenblas-dev` |
| Python | 3.9 | [python.org](https://www.python.org/) |


<br>
      
<details>
<summary><strong> Ubuntu / Debian / WSL</strong> </summary>
 
```ShellSession
$ sudo apt update
$ sudo apt install build-essential cmake \
                   libhdf5-dev \
                   libopenblas-dev \
                   libopenmpi-dev openmpi-bin # または: libmpich-dev mpich

# Boost v1.81.0のダウンロードとインストール:
$ wget https://archives.boost.io/release/1.81.0/source/boost_1_81_0.tar.gz
$ tar -xzf boost_1_81_0.tar.gz

# Pythonライブラリのインストール:
$ pip install numpy scipy # Pythonライブラリ
# または
$ python3 -m pip install numpy scipy
```
</details> 

<details> <summary><strong> macOS (Homebrew経由)</strong> </summary>

```
$ brew update
$ brew install cmake hdf5 \
               openblas open-mpi # または: mpich

# Boostのインストール:
$ brew install boost

# Pythonライブラリのインストール:
$ pip3 install numpy scipy 
```
</details>

### 依存関係の確認
```
$ gcc -v # 10.5.0以上である必要あり
$ cmake --version # 3.18以上である必要あり
$ mpirun --version # OpenMPI 4.0 または MPICH 4
```

### ダウンロードとビルド

ALPSライブラリのダウンロードとビルドを開始します。
以下のコマンドでは、/path/to/install/directoryを実際のインストールディレクトリに置き換えてください。

```
$ git clone https://github.com/alpsim/ALPS alps-src
$ cmake -S alps-src -B alps-build                                     \
         -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
         -DBoost_SRC_DIR=</directory/with/boost/sources>/boost_1_81_0  \
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
$ cmake --build alps-build -j 8
$ cmake --build alps-build -t test
```

### ビデオチュートリアル

{{< youtube id="OHQGfDDaRMk" >}}

<details> 
<summary><strong>トラブルシューティング</strong></summary>
* **別のMPI/BLASが必要ですか？**
上記のパッケージ名をクラスタのモジュール（例: [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html), 等）に置き換えてください。[CMake](https://cmake.org/)はこれらのパッケージの位置を自動検出し、Makefileにコンパイル指示を生成します。

* **Pythonエラー**
Python 3.9以上を使用していることを確認してください。注意：一部の環境（macOSなど）ではpipの代わりにpip3を使用します。正しいバージョンのインストールサポートについては[Python](https://www.python.org/)公式サイトを参照してください。

* **MPIのバージョン不一致？**
CMakeが使用するMPIバージョンがmpirun --versionの結果と一致していることを確認してください。

* **Boostエラー**
ALPSはBoostバージョン1.76.0から1.81.0でビルドテスト済みです（サポートされるboostバージョンとコンパイラ・Pythonバージョンの組み合わせについてはビルド注意事項を参照）。

</details>

#### ビルド注意事項
{{% tabs items="Linux,Mac" %}}
{{% tab %}}
以下のBoost、Python、C++コンパイラの組み合わせがテスト済みです：
- GCC 10.5.0, Python 3.9.19, Boost 1.76.0

- GCC 11.4.0, Python 3.10.14, Boost 1.81.0, 1.86.0

- GCC 12.3.0, Python 3.10.14, Boost 1.81.0, 1.86.0

- Clang 13.0.1, Python 3.10.14, Boost 1.81.0, 1.86.0

- Clang 14.0.0, Python 3.10.14, Boost 1.81.0, 1.86.0

- Clang 15.0.7, Python 3.10.14, Boost 1.81.0, 1.86.0
{{% /tab %}}
{{% tab %}}

ALPSはARMベースのMacOSシステムで、デフォルトコンパイラとHomebrewのgccコンパイラ（Boost 1.86.0使用）の両方でテスト済みです。
MacOS ≥14.6でHomebrew gccコンパイラを使用してALPSをビルドする場合、以下の環境変数を設定する必要があります：

```
export SDKROOT=/Library/Developer/CommandLineTools/SDKs/MacOSX14.sdk/
```
{{% /tab %}}
{{% /tabs %}}

ステップ1で依存パッケージを非標準の場所にインストールした場合、CMakeがパッケージを見つけられない可能性があります。ALPSは標準のCMakeメカニズム（FindXXX.cmake）を使用してパッケージを検索します。以下の情報が役立つ場合があります：

  - MPI: [CMake MPIドキュメント](https://cmake.org/cmake/help/latest/module/FindMPI.html)
  - BLAS: [CMake BLASドキュメント](https://cmake.org/cmake/help/latest/module/FindBLAS.html)
  - HDF5: [CMake HDF5ドキュメント](https://cmake.org/cmake/help/latest/module/FindHDF5.html)

***

コードのビルドに成功したら、インストールを実行する必要があります。インストール先は設定時に-DCMAKE_INSTALL_PREFIX=/path/to/install/directoryパラメータで指定します。または、インストール段階で--prefixパラメータに新しいパスを明示的に指定することも可能です（[CMakeマニュアル参照](https://cmake.org/cmake/help/latest/manual/cmake.1.html#cmdoption-cmake--install-0)）。

インストールコマンド：

```ShellSession
$ cmake --install alps-build
```

インストールディレクトリが作成されます。すべてが正常に完了した場合、インストールパスのbinディレクトリにspinmcやfulldiagなどのALPS実行ファイルが見つかります。

{{% /steps %}}

