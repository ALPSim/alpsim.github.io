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
| CMake | 3.18 | `cmake` |
| C++ コンパイラ | GCC 10.5.0 または Clang 13.0.1 | `build-essential` |
| Boost | 1.76 <br>*(NumPy ≥ 2.0 の場合は 1.87 が必要)* | 下記参照 |
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

# Pythonライブラリのインストール:
$ pip install numpy scipy
# または
$ python3 -m pip install numpy scipy
```

> **`apt`でBoostをインストールしないでください。** ALPSはBoostをソースからコンパイルする必要があります。理由は2つあります：
> 1. **カスタムコンパイラフラグ** — ALPSはC++17/20互換性のために`-DBOOST_NO_AUTO_PTR`と`-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF`を必要としますが、`libboost-dev`パッケージはこれらを設定しないため、リンクエラーが発生します。
> 2. **Python ABIの一致** — `Boost.Python`コンポーネントはALPSが使用するPythonインタープリタと全く同じものに対してコンパイルされる必要があります。パッケージマネージャーのビルドはシステムPythonを対象としており、異なるインタープリタと一致しない場合があります。
>
> CMakeは両方を自動的に処理します：`Boost_SRC_DIR`が設定されていない場合、設定時にBoost 1.87をダウンロードしてコンパイルします（インターネット接続が必要）。オフラインビルドの代替については、ビルドステップを参照してください。
</details>

<details>
<summary><strong> macOS (Homebrew経由)</strong> </summary>

```ShellSession
$ brew update
$ brew install cmake hdf5 \
               openblas open-mpi # または: mpich

# Pythonライブラリのインストール:
$ pip3 install numpy scipy
```

> **HomebrewでBoostをインストールしないでください。** ALPSはBoostをソースからコンパイルする必要があります。理由は2つあります：
> 1. **カスタムコンパイラフラグ** — ALPSはC++17/20互換性のために`-DBOOST_NO_AUTO_PTR`と`-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF`を必要としますが、Homebrewの`boost`フォーミュラはこれらを設定しないため、リンクエラーが発生します。
> 2. **Python ABIの一致** — `Boost.Python`コンポーネントはALPSが使用するPythonインタープリタと全く同じものに対してコンパイルされる必要があります。HomebrewのBoostはHomebrew独自のPythonを対象としており、他のインタープリタと一致しない場合があります。
>
> CMakeは両方を自動的に処理します：`Boost_SRC_DIR`が設定されていない場合、設定時にBoost 1.87をダウンロードしてコンパイルします（インターネット接続が必要）。オフラインビルドまたは既存のアーカイブを使用する場合は、手動でダウンロードしてください：
> ```ShellSession
> $ curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> $ tar -xzf boost_1_87_0.tar.gz
> ```
</details>

<details>
<summary><strong> macOS (MacPorts経由)</strong> </summary>

```ShellSession
$ sudo port selfupdate
$ sudo port install cmake \
                   hdf5 \
                   OpenBLAS \
                   openmpi-clang20   # バリアントの選択については下記参照
$ sudo port select --set mpi openmpi-clang20-fortran

# Pythonライブラリのインストール:
$ pip3 install numpy scipy
```

> **OpenMPIバリアントの選択:** MacPortsはコンパイラバージョンごとに個別のポートを提供します（`openmpi-<compiler><version>`の形式、例：`openmpi-clang20`、`openmpi-gcc15`）。上記の`clang20`バリアントはLLVM Clang 20ポートに対応しており、XcodeのApple Clangと共存できます。異なるコンパイラを使用する場合は、対応するバリアントをインストールし、`port select`コマンドを適宜変更してください。
>
> `port select`ステップは必須です：これを実行しないと、CMakeが検索するベアの`mpirun`、`mpicc`、`mpicxx`ラッパーが存在しません。

> **MacPortsでBoostをインストールしないでください。** ALPSはBoostをソースからコンパイルする必要があります。理由は2つあります：
> 1. **カスタムコンパイラフラグ** — ALPSはC++17/20互換性のために`-DBOOST_NO_AUTO_PTR`と`-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF`を必要としますが、MacPortsの`boost`ポートはこれらを設定しないため、リンクエラーが発生します。
> 2. **Python ABIの一致** — `Boost.Python`コンポーネントはALPSが使用するPythonインタープリタと全く同じものに対してコンパイルされる必要があります。MacPortsのBoostはMacPorts独自のPythonを対象としており、他のインタープリタと一致しない場合があります。
>
> CMakeは両方を自動的に処理します：`Boost_SRC_DIR`が設定されていない場合、設定時にBoost 1.87をダウンロードしてコンパイルします（インターネット接続が必要）。オフラインビルドまたは既存のアーカイブを使用する場合は、手動でダウンロードしてください：
> ```ShellSession
> $ curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> $ tar -xzf boost_1_87_0.tar.gz
> ```
</details>

### 依存関係の確認

```ShellSession
$ gcc -v              # 10.5.0以上である必要あり
$ cmake --version     # 3.18以上である必要あり
$ mpirun --version    # OpenMPI 4.0 または MPICH 4
$ python3 --version   # 3.9以上である必要あり
$ python3 -c "import numpy, scipy; print('numpy', numpy.__version__, 'scipy', scipy.__version__)"
```

> **macOS — CMakeはどのPythonを使用しますか？** macOS上のCMakeはAppleのフレームワークパスを`$PATH`より先に検索するため、HomebrewやMacPortsに新しいPythonがインストールされていても、Xcodeに同梱されたPython 3.9を暗黙的に選択することがあります。`cmake`設定時に以下のような行を探してください：
> ```
> -- Found Python: /path/to/python (found version "X.Y.Z")
> ```
> パスまたはバージョンが期待通りでない場合は、`cmake`コマンドに`-DPython3_EXECUTABLE=/path/to/your/python3`を追加して明示的に指定してください。典型的なパスは`/opt/homebrew/bin/python3`（Homebrew）または`/opt/local/bin/python3`（MacPorts）です。CMakeが使用するPythonに`numpy`と`scipy`がインストールされていることを確認してください。

### ダウンロードとビルド

ALPSライブラリのダウンロードとビルドを開始します。
以下のコマンドでは、`</path/to/install/dir>`を実際のインストールディレクトリに置き換えてください。

> **これらのコマンドを実行する前に、2つの待機が予想されることを確認してください：**
> 1. **`cmake`設定（約1〜3分）：** CMakeは設定時にBoost 1.87（約130 MB）を暗黙的にダウンロードします。ダウンロード完了まで1〜2分間ターミナルに出力が表示されませんが、これは正常です。中断しないでください。
> 2. **`cmake --build`（5〜20分）：** ALPSとBoostをソースからコンパイルするには、全CPUコアを使用しても数分かかります。ターミナルはコンパイラの出力で埋め尽くされます — これも正常です。

```ShellSession
$ git clone https://github.com/alpsim/ALPS alps-src
$ cmake -S alps-src -B alps-build                                     \
       -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
       -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
       -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
# ^ Boost（約130 MB）がここでダウンロードされます。1〜3分間出力がないのは正常です
$ cmake --build alps-build -j$(nproc 2>/dev/null || sysctl -n hw.logicalcpu)
$ cmake --build alps-build -t test
```

> **`-j`は並列コンパイル数を制御します。** 上記の式はLinux（`nproc`）とmacOS（`sysctl -n hw.logicalcpu`）の両方で全論理CPUコアを自動的に使用します。手動で設定することも可能です（例：8コアの場合は`-j 8`）。

> **オフラインまたは低速接続でのビルド：** デフォルトではCMakeが設定時にBoost 1.87をダウンロードします。ダウンロードを回避するには、先にアーカイブを手動で展開し、パスを指定してください：
> ```ShellSession
> $ cmake -S alps-src -B alps-build                                     \
>        -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
>        -DBoost_SRC_DIR=</path/to/boost_1_87_0>                        \
>        -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
>        -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
> ```

### トラブルシューティング
<details>

* **別のMPI/BLASが必要ですか？** <br> 上記のパッケージ名をクラスタのモジュール（例: [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html), 等）に置き換えてください。[CMake](https://cmake.org/)はこれらのパッケージの位置を自動検出し、Makefileにコンパイル指示を生成します。
* **Pythonエラー** <br> Python ≥ 3.9がインストールされており、CMakeが選択したPythonと同じものに`numpy`と`scipy`がインストールされていることを確認してください。macOSでは、CMakeがHomebrew/MacPortsのPythonではなくXcodeに同梱されたPythonを選択することがあります。CMake出力の`Found Python:`行を確認し、必要に応じて`-DPython3_EXECUTABLE=/path/to/python3`でインタープリタを指定してください（[依存関係の確認](#依存関係の確認)ステップを参照）。
* **MPIのバージョン不一致？** <br> CMakeが使用するMPIバージョンが`mpirun --version`の結果と一致していることを確認してください。
* **Boostエラー** <br> NumPy ≥ 2.0に対してALPSのPythonバインディングをビルドする場合はBoost ≥ 1.87が必要です（NumPy 2.0で導入されたAPIの変更はBoost 1.87以降のみが対応しています）。Boost 1.76〜1.86はNumPy < 2.0でのみ動作します。テスト済みの組み合わせについてはビルド注意事項を参照してください。

</details>

#### ビルド注意事項

{{% tabs items="Linux,Mac" %}}
{{% tab %}}
以下のBoost、Python、C++コンパイラの組み合わせがテスト済みです：
  - GCC 10.5.0, Python 3.9.19 (NumPy < 2.0), Boost 1.76.0
  - GCC 11.4.0, Python 3.10.14 (NumPy < 2.0), Boost 1.81.0, 1.86.0
  - GCC 12.3.0, Python 3.10.14 (NumPy < 2.0), Boost 1.81.0, 1.86.0
  - Clang 13.0.1, Python 3.10.14 (NumPy < 2.0), Boost 1.81.0, 1.86.0
  - Clang 14.0.0, Python 3.10.14 (NumPy < 2.0), Boost 1.81.0, 1.86.0
  - Clang 15.0.7, Python 3.10.14 (NumPy < 2.0), Boost 1.81.0, 1.86.0

  **NumPy ≥ 2.0** の場合、ALPSのBoost.PythonバインディングにはBoost 1.87.0以降が必要です（CMakeが自動でダウンロードします）。
{{% /tab %}}
{{% tab %}}
ALPSはARMベースのmacOSシステムで、Apple XcodeのClangとサードパーティコンパイラ（Homebrew GCC、MacPorts GCC/Clang）でBoost 1.86.0以降を使用してテスト済みです。

**`SDKROOT` — いつ、どのように設定するか**

`SDKROOT`はコンパイラにmacOSシステムヘッダーとフレームワークの場所を伝えます。
AppleのClang（XcodeまたはCommand Line Toolsのインストール後に利用できる`cc`/`c++`）はSDKを自動的に見つけます — **Apple Clangを使用する場合は`SDKROOT`を設定する必要はありません**。

サードパーティコンパイラ（Homebrew GCC、MacPorts GCCまたはLLVM Clangなど）はSDKの場所を知らないため、システムヘッダーが見つからないというエラーでビルドが失敗します。`cmake`を実行する前に以下を設定してください：

```ShellSession
export SDKROOT=$(xcrun --show-sdk-path)
```

`xcrun --show-sdk-path`は、インストールされているXcodeまたはCommand Line Toolsのバージョンに関わらず、常に正しいパスを返します。macOSのバージョンが更新されるたびに壊れる`MacOSX14.sdk`のようなバージョン固有のパスをハードコーディングしないでください。

CMakeが使用するコンパイラを確認するには、cmake出力の最初にある`C compiler identification`の行を確認してください。`AppleClang`と表示されている場合は`SDKROOT`は不要です。`GNU`または`Clang`（"Apple"なし）と表示されている場合は上記のように設定してください。

**Pythonの選択:** macOS上のCMakeはAppleのフレームワークパスを`$PATH`より先に検索するため、HomebrewやMacPortsに新しいPythonがインストールされていても、Xcodeに同梱されたPython 3.9（`/Applications/Xcode.app/.../python3.9`）を選択することがあります。設定時に出力される`Found Python:`行でCMakeが見つけたPythonを確認してください。期待するものでない場合は、`$(which python3)`に頼らず（依然として間違ったインタープリタを指す可能性があるため）、フルパスを使用して明示的に指定してください：

```ShellSession
# Homebrew（Apple Silicon）:
$ cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/opt/homebrew/bin/python3

# Homebrew（Intel）:
$ cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/usr/local/bin/python3

# MacPorts:
$ cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/opt/local/bin/python3
```

CMakeが使用するPythonに`numpy`と`scipy`がインストールされていることを確認してください（`/path/to/that/python3 -m pip install numpy scipy`）。

{{% /tab %}}

{{% /tabs %}}

依存パッケージを非標準の場所にインストールした場合、CMakeがパッケージを見つけられない可能性があります。ALPSは標準のCMakeメカニズム（FindXXX.cmake）を使用してパッケージを検索します。以下の情報が役立つ場合があります：
  - MPI: [CMake MPIドキュメント](https://cmake.org/cmake/help/latest/module/FindMPI.html)
  - BLAS: [CMake BLASドキュメント](https://cmake.org/cmake/help/latest/module/FindBLAS.html)
  - HDF5: [CMake HDF5ドキュメント](https://cmake.org/cmake/help/latest/module/FindHDF5.html)

***

コードのビルドに成功したら、インストールを実行する必要があります。インストール先は設定時に`-DCMAKE_INSTALL_PREFIX=/path/to/install/directory`パラメータで指定します。または、インストール段階で`--prefix`パラメータに新しいパスを明示的に指定することも可能です（[CMakeマニュアル参照](https://cmake.org/cmake/help/latest/manual/cmake.1.html#cmdoption-cmake--install-0)）。

インストールコマンド：

```ShellSession
$ cmake --install alps-build
```

### 環境設定

インストールディレクトリは自己完結していますが、シェルはその場所をまだ認識していません。ALPSは`PATH`、`LD_LIBRARY_PATH`、`PYTHONPATH`に適切なディレクトリを追加するセットアップスクリプトを提供しています。ALPSを使用する前に一度ソースとして読み込んでください：

```ShellSession
# bash / zsh:
$ source </path/to/install/dir>/bin/alpsvars.sh

# csh / tcsh:
$ source </path/to/install/dir>/bin/alpsvars.csh
```

すべてのターミナルセッションでこのコマンドを実行しなくて済むように、`source`行をシェルのスタートアップファイル（`~/.bashrc`、`~/.zshrc`、または`~/.cshrc`）に追加してください。

**インストールの確認** — ALPSの実行ファイルのいずれかを実行してください：

```ShellSession
$ spinmc --help
```

コマンドが見つかりヘルプメッセージが表示されれば、ALPSのインストールと環境設定は正常に完了しています。

{{% /steps %}}

### ビデオチュートリアル
<br>

{{< youtube id="OHQGfDDaRMk" >}}
