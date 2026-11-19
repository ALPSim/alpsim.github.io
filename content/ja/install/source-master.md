---
title: 最新の開発版（master）のビルド
description: "masterブランチからのALPSのビルド"
weight: 4
toc: true
cascade:
    type: docs
---

このページは、`master`ブランチの最新の**未リリース**コードを使いたい開発者やテスター向けです。
ALPSへの貢献や、リリース前の修正を試す場合などが該当します。
`master`は頻繁に変更され、オプション、インターフェース、必要条件がコミットごとに変わることがあります。

> **ALPSを使いたいだけの場合：** [バイナリパッケージ](../binary)をインストールするか、
> [v3.0.0リリースをソースから](../source)ビルドしてください。リリース版の手順は`master`では
> **動作せず**、このページのコマンドもリリース版では動作しません。

`master`の正式で常に最新の手順は、リポジトリの
[CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md#getting-started-with-the-code)
にあります。以下の内容とこのファイルが食い違う場合は、ファイルに従ってください。
このページでは手順の概要と、リリース版との違いを説明します。

### リリース版との違い

| | リリース v3.0.0（[ソースインストール](../source)） | `master` |
|---|---|---|
| Boost | CMakeがBoost 1.87を自動でダウンロード・ビルド（オフラインでは`Boost_SRC_DIR`）。Boostを自分でインストールしない | **Boost 1.76以上をパッケージマネージャーで自分でインストール**。必要なのはヘッダーとCMakeパッケージファイルのみ。`Boost_SRC_DIR`は無視される |
| 追加のコンパイラフラグ | `-DBOOST_NO_AUTO_PTR -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` | 不要 |
| CMake | 3.22以上 | 3.27以上 |
| Eigen | 不要 | Eigen 3.3以上（アプリケーションのMaxEntに必要） |
| MPI | デフォルトで有効（見つかれば使用） | デフォルトで無効。`-DALPS_ENABLE_MPI=ON`で有効化 |
| Python（`pyalps`） | C++コードと一緒にビルド（Boost.Python） | `python/pyalps`の独立したpipパッケージ。インストール済みのC++ SDKに対してビルド |
| 削除されたオプション | | `ALPS_USE_SYSTEM_BOOST`、`Boost_SRC_DIR`、`ALPS_BUILD_TESTS`、`ALPS_BUILD_LIBS_ONLY`などは「no longer supported」という警告を表示します。[CHANGELOG](https://github.com/ALPSim/ALPS/blob/master/CHANGELOG.md)を参照してください |

{{% steps %}}

### 依存関係のインストール

C++17/C11コンパイラ（GCCまたはClang）、CMake 3.27以上、Boost 1.76以上、HDF5 1.10.5以上（Cライブラリ）、
BLAS/LAPACK、Eigen 3.3以上、テストと`pyalps`用のPython 3.10以上が必要です。例：

**Ubuntu 24.04 / Debian**
```ShellSession
sudo apt-get update
sudo apt-get install build-essential cmake libboost-dev libhdf5-dev \
                     libblas-dev liblapack-dev libeigen3-dev python3-venv
```

**macOS（Homebrew）**
```ShellSession
brew install cmake boost hdf5 openblas eigen
export CMAKE_PREFIX_PATH="$(brew --prefix boost):$(brew --prefix hdf5):$(brew --prefix openblas):$(brew --prefix eigen)"
```

**macOS（MacPorts）**
```ShellSession
sudo port install cmake boost hdf5 OpenBLAS eigen3
ls /opt/local/libexec/boost/       # バージョンのディレクトリを確認（例：1.87）
```
その後、下の`cmake`コマンドに`-DBoost_ROOT=/opt/local/libexec/boost/<version>`を追加してください。

> **古いディストリビューションのCMakeは古すぎます。** Ubuntu 22.04（CMake 3.22）とRocky/RHEL 9
> （CMake 3.26）は3.27未満です。Python環境に`python3 -m pip install "cmake>=3.27"`で新しいCMakeを
> インストールしてください。Rocky/RHEL 9のBoostは1.75で1.76未満のため、新しいBoostを
> （Spackや[boost.org](https://www.boost.org/)などから）インストールし、`-DBoost_ROOT`で指定してください。

> **CMakeが`Could not find a package configuration file provided by "Boost"`と報告する場合：**
> インストール済みのBoostが見つかっていません。上記のようにインストールするか、
> `-DBoost_ROOT=<boost prefix>`（`include/boost`と`lib/cmake/Boost-<version>`を含むディレクトリ）を
> 指定してください。展開しただけのBoostソースアーカイブにはCMakeパッケージファイルがないため使えません。

### ダウンロードとビルド

`master`（またはそのフォーク）をクローンし、C++ SDKとアプリケーションを設定・ビルド・テスト・インストールします：

```ShellSession
git clone https://github.com/ALPSim/ALPS alps-src
cmake -S alps-src -B alps-build -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>
cmake --build alps-build --parallel 4
ctest --test-dir alps-build
cmake --install alps-build
```

新しいビルドディレクトリを使ってください。リリース版や古い`master`のビルドディレクトリには古い設定が
残っているため、先に削除してください。DMFTとMaxEntの各翻訳単位は約1 GBのメモリを使うため、
メモリの少ないマシンでは`--parallel`の値を下げてください。

### `pyalps`のビルド（任意）

`pyalps`は、インストールしたSDKに対してpipでビルドします。Python仮想環境で：

```ShellSession
python3 -m venv .venv && . .venv/bin/activate
python -m pip install "scikit-build-core>=1.0" "nanobind==2.15.0" \
                      "patchelf>=0.14; sys_platform == 'linux'"
export ALPS_DIR=</path/to/install/dir>/share/alps
python -m pip install --no-build-isolation -e alps-src/python/pyalps
python -c "import pyalps; print(pyalps.__file__)"
```

`nanobind`のバージョンは
[`python/pyalps/pyproject.toml`](https://github.com/ALPSim/ALPS/blob/master/python/pyalps/pyproject.toml)
で固定されているものと一致させる必要があります。CMakeプリセット、編集後の再ビルド、Pythonテストについては
[CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md#getting-started-with-the-code)
を参照してください。

### 最新の状態に保つ

```ShellSession
git -C alps-src pull
cmake --build alps-build --parallel 4 && cmake --install alps-build
```

`git pull`で必要条件が変わった場合は
[CHANGELOG](https://github.com/ALPSim/ALPS/blob/master/CHANGELOG.md)を確認し、CMakeがエラーを
報告したら新しいビルドディレクトリで設定し直してください。

{{% /steps %}}
