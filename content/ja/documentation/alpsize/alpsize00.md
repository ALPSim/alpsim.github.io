
---
title: Integration-00 ユーザーコード統合
math: true
toc: true
weight: 1
---

## 既存プログラムを ALPS と統合する理由

すでに動作するシミュレーションコードをお持ちなら——外部依存のない単一の C や C++ ファイルであっても——書き直すことなく ALPS の恩恵を受けられます。コードを CMake でパッケージングし ALPS ライブラリとリンクすることで、既存プログラムに ALPS の **Parameters** パラメータファイル形式、**Alea** 測定・誤差解析ライブラリ、**Parapack** スケジューラへのアクセスを、物理計算のコードそのものは変えずに段階的に持たせることができます。各機能は独立に、自分のペースで導入できます。

ALPS スケジューラを使うと次のような利点があります。

- コードを追加することなくパラメータ並列化が可能：1 つのパラメータファイルに複数のパラメータセット（例えば複数の温度）を列挙でき、スケジューラがそれらすべての実行と管理を行います。
- 同一バイナリでノート PC・クラスタサーバー・スーパーコンピュータすべてで動作。
- 結果の集約と後処理が組み込み済みで、統計誤差の自動推定も含まれます。
- 既に並列化されたコードの多段並列化も簡単。
- レプリカ交換法などの高度な手法向けのアダプタがすぐに利用可能。

本チュートリアルでは、この移行が実際にどのようなものかを具体的に示します。ごく単純な C プログラムから出発し、CMake によるパッケージング、続いて `ALPS/parameters`、`ALPS/alea`、`ALPS/lattice`、最後に `ALPS/parapack` スケジューラという順に、ALPS の機能を 1 つずつ追加していきます。各段階で何がどう変わり、なぜそうするのかを具体的に確認できます。

## 題材：Wolff アルゴリズムによる 2 次元 Ising モデル

このチュートリアルを通して、同じ小さな物理の問題を題材として使います：周期境界条件を持つ $L \times L$ の 2 次元正方格子 Ising モデルを、Wolff の単一クラスターモンテカルロ法でシミュレートします。

Wolff アルゴリズムは、Metropolis 法のように 1 つずつスピンを反転させるのではなく、ランダムに選んだ種となるサイトから出発して、揃った向きのスピンからなる「クラスター」を成長させます。クラスターに隣接する、向きの揃ったスピンは、それぞれ確率

$$
p = 1 - e^{-2/T}
$$

（ここで結合定数 $J$ とボルツマン定数 $k_B$ はともに 1 とする単位系を用いています）でクラスターに追加され、最終的にクラスター全体が一括で反転されます。この方法は、1 スピンずつの更新に比べて相転移付近での*臨界減速*を大幅に軽減します——[古典モンテカルロチュートリアル](../../../start/mc)で解説されているのと同じ利点です。この例題プログラムは磁化とその 2 次モーメント・4 次モーメントを測定し、そこから相転移の位置を特定する標準的な指標である Binder 比 $\langle m^2\rangle^2/\langle m^4\rangle$ を計算します。

物理モデル自体はチュートリアルを通じて一切変わらないため、各ステップ間で見られる違いはすべて ALPS との統合によるものであり、アルゴリズム自体の変化ではありません。

## はじめる前に

{{< callout type="info" >}}
本チュートリアルは、ALPS が既にインストール済みであり、コマンドラインで C/C++ コードをある程度コンパイルできることを前提としています。まだ ALPS をインストールしていない場合は、[インストールガイド](https://alps.comp-phys.org/install/)を参照してください。ステップ 1 以降では CMake 3.18 以降も必要になります。
{{< /callout >}}

各ステップのソースファイルは ALPS 本体と一緒に配布されており、`tutorials/alpsize-00-make` から `tutorials/alpsize-09-scheduler` までの名前を持つ、独立したサンプルディレクトリとして [ALPS リポジトリ](https://github.com/ALPSim/ALPS)に含まれています。各ディレクトリは単独でビルドできます。以下のコマンドを実行する前に、該当するステップのディレクトリに `cd` してください。

## チュートリアル：純粋な C から完全に統合された ALPS プログラムまでの 10 ステップ

以下のステップを順番に進めてください。各ステップは前のステップのコードを出発点とし、次の ALPS の概念を導入するために必要な部分だけを変更します。

### ステップ 0 — 素の Makefile でコンパイルする

ディレクトリ：`tutorials/alpsize-00-make`

CMake を導入する前に、このステップでは手書きの素の Makefile が ALPS のインストールを見つけてリンクできることを確認します。`hello.C` はまだ ALPS の関数を一切呼び出しません——コンパイラとリンカが正しく設定されていることを確認するためだけのものです。Makefile 自体は短いものです。

```make
include $(ALPS_HOME)/share/alps/include.mk

hello: hello.C
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) $(LDFLAGS) -o hello hello.C $(LIBS)
```

`$(ALPS_HOME)/share/alps/include.mk` を読み込むことで、ALPS に対してビルドするために必要なコンパイラ（`$(CXX)`）、プリプロセッサ・コンパイラフラグ（`$(CPPFLAGS)`、`$(CXXFLAGS)`）、リンカ設定（`$(LDFLAGS)`、`$(LIBS)`）が一括で設定されるため、自分で調べる必要がありません。

```bash
$ export ALPS_HOME=/path/to/alps
$ make
$ ./hello
hello, world
```

### ステップ 1 — CMake によるパッケージング

ディレクトリ：`tutorials/alpsize-01-cmake`

ここから先はすべて、手書きの Makefile ではなく CMake でビルドします。このステップではステップ 0 と同じ `hello.C` をビルドしますが、ALPS を自動的に検出しテストを登録する `CMakeLists.txt` を経由します。このファイルの詳しい仕組みについては、[Integration-01：CMake によるパッケージング](../alpsize01)を参照してください。

```bash
$ cmake -DALPS_ROOT_DIR=/path/to/alps .
$ make
$ ./hello
hello, world
```

### ステップ 2 — 純粋な C による Wolff アルゴリズムの実装

ディレクトリ：`tutorials/alpsize-02-original-c`

これが物理計算コードの出発点です：`wolff.c` は、ALPS や C++ の機能を一切使わない、自己完結した C 言語実装です。格子サイズ（`L = 32`）、温度（`T = 2.2`）、モンテカルロスイープ数はすべてハードコードされた `#define` 定数であり、近傍リスト・クラスタースタック・スピン配置はすべて普通の C 配列です。これは、多くの研究グループが最初に持っている類のコード——外部依存が一切ない、動作するシミュレーション——を表しています。

```bash
$ cmake .
$ make
$ ./wolff
```

### ステップ 3 — 慣用的な C++ への移行

ディレクトリ：`tutorials/alpsize-03-basic-cpp`

ステップ 2 の C コードを、動作を変えずに慣用的な C++ に変換します。

- `<math.h>` を `<cmath>` に置き換える（他の C ヘッダも同様に C++ 版に変更）
- `std` 名前空間の使用
- `printf`/`fprintf` を `std::cout`/`std::cerr` に置き換える
- C++ スタイルのコメントに変更

```bash
$ cmake .
$ make
$ ./wolff
```

### ステップ 4 — C++ 標準テンプレートライブラリの使用

ディレクトリ：`tutorials/alpsize-04-stl`

生の C 配列と手動のメモリ管理が標準コンテナに置き換えられ、手書きの添字計算ではなくコンパイラがメモリを管理するようになります。

- `std::vector<>` が固定サイズの近傍リストとスピン配列を置き換えます——サイズは自動的に確保・解放され、要素の型（ユーザー定義型を含む）はテンプレートパラメータで指定します
- `std::stack<>` が手書きのクラスタースタックを置き換え、同様に自動的なメモリ管理を行います

```bash
$ cmake .
$ make
$ ./wolff
```

### ステップ 5 — Boost C++ ライブラリの使用

ディレクトリ：`tutorials/alpsize-05-boost`

これまでの間に合わせの実装のうち 3 か所が、Boost が提供する対応部品に置き換えられます。

- `<boost/array.hpp>`：固定長配列。手書きの 4 要素近傍構造体を置き換える
- `<boost/random.hpp>`：本格的な乱数生成器（メルセンヌ・ツイスタ）。C 標準ライブラリの `rand()` を置き換え、一様分布・正規分布・ポアソン分布・指数分布などの分布も利用可能にする
- `<boost/timer.hpp>`：実行時間計測用タイマー。`clock()` の手動呼び出しを置き換える

```bash
$ cmake .
$ make
$ ./wolff
Magnetization = -0.000368834
Magnetization^2 = 0.626016
Magnetization^4 = 0.408456
Binder Ratio of Magnetization = 0.959457
```

この数値を覚えておいてください——物理モデルと乱数シードは変わらないため、ステップ 7 で ALPS が測定を管理するようになった後も、同じ中心値が再び現れます。

### ステップ 6 — ALPS/parameters によるパラメータ読み込み

ディレクトリ：`tutorials/alpsize-06-parameters`

ステップ 2 でハードコードされていた定数（`L`、`T`、スイープ数、熱化ステップ数、乱数シード）が、`alps::Parameters` を通じてパラメータファイルから読み込まれる値に置き換えられます。

```cpp
alps::Parameters params(std::cin);
const int L = params.value_or_default("L", 32);
const double T = params.value_or_default("T", 2.2);
```

`value_or_default` は、パラメータファイルに該当するパラメータが指定されていない場合、以前のハードコードされた値にフォールバックするため、パラメータファイルが不完全でもプログラムは動作し続けます。パラメータファイル自体は単なるテキストです。

```
L = 32
T = 2.2
```

```bash
$ cmake .
$ make
$ ./wolff <wolff.ip
Magnetization = -0.000368834
Magnetization^2 = 0.626016
Magnetization^4 = 0.408456
Binder Ratio of Magnetization = 0.959457
```

`wolff.ip` が指定する `L` と `T` は以前と同じ値なので、結果はステップ 5 と完全に一致します——変わったのはパラメータが*どのように*プログラムに渡されるかだけです。

### ステップ 7 — ALPS/alea による可観測量の測定

ディレクトリ：`tutorials/alpsize-07-alea`

`m`、`m2`、`m4` の手動での積算が `alps::ObservableSet` に置き換えられます。これは測定値を積算するだけでなく、その統計誤差も自動的に推定します。

```cpp
alps::ObservableSet measurements;
measurements << alps::RealObservable("Magnetization")
             << alps::RealObservable("Magnetization^2")
             << alps::RealObservable("Magnetization^4");
...
measurements["Magnetization"] << dsz;
```

Binder 比のような派生量は、`alps::RealObsevaluator` オブジェクトに対する通常の算術演算として直接計算できます——Alea は統計誤差をその計算の中で自動的に伝播させます。

```cpp
alps::RealObsevaluator m2 = measurements["Magnetization^2"];
alps::RealObsevaluator m4 = measurements["Magnetization^4"];
alps::RealObsevaluator binder("Binder Ratio of Magnetization");
binder = m2 * m2 / m4;
```

```bash
$ cmake .
$ make
$ ./wolff wolff.ip
Binder Ratio of Magnetization: 0.959454 +/- 0.000919
Magnetization: -0.000368834 +/- 0.00213; tau = -0.381
    bin #1   : 32768    entries: error = 0.004371
    bin #2   : 16384    entries: error = 0.0027974
    ...
```

ステップ 5 と比較すると、中心値（`-0.000368834`、`0.959454` ≈ `0.959457`）は同じですが、Alea は誤差棒と自己相関時間の推定値（`tau`）も報告するようになっています。これらはすべて自動的に行われるビニング（binning）解析によって計算されており、そのために追加のコードは一切必要ありませんでした。

### ステップ 8 — ALPS/lattice による格子の記述

ディレクトリ：`tutorials/alpsize-08-lattice`

これまでのステップで手書きされていた最近接近傍表が `alps::graph_helper<>` に置き換えられます。これはコードではなく `LATTICE` パラメータから格子の幾何構造を構築します。

```cpp
alps::graph_helper<> graph(params);
const int N = graph.num_sites();
...
BOOST_FOREACH(alps::graph_helper<>::site_descriptor const& sn, graph.neighbors(sc)) { ... }
```

これにより、「サイトとボンドがどこにあるか」（格子）と「そこで何が起きるか」（物理）が分離されます。これこそが `ALPS/lattice` ライブラリの狙いです：格子の幾何構造はハードコードされたロジックではなくパラメータになり、ソースコードではなくパラメータファイルを編集するだけで、まったく別の格子を使えるようになります。組み込みの格子の一覧については [ALPS 格子ライブラリ](../../intro/latticehowtos)を参照してください。

このステップには、読み込んだ幾何構造をそのまま表示するだけの、独立した 2 つ目のデモプログラム `lattice.C` も含まれています。

```
LATTICE = "square lattice"
L = 4
```

```bash
$ cmake .
$ make
$ ./lattice <lattice.ip
lattice name = square lattice
number of sites = 16
number of bonds = 32
...
$ ./wolff <wolff.ip
Binder Ratio of Magnetization: 0.959454 +/- 0.000919
...
```

$4\times4$ の周期的な正方格子には 16 個のサイトと $16 \times 4 / 2 = 32$ 本のボンドがあります（各サイトは 4 個の近傍を持ち、各ボンドは 2 個のサイトで共有されるため）——これはまさに `lattice.C` が報告する値と一致します。

### ステップ 9 — ALPS/Parapack スケジューラとの完全な統合

ディレクトリ：`tutorials/alpsize-09-scheduler`

最後のステップでは、シミュレーションの制御を完全に ALPS Parapack スケジューラに委ねます。シミュレーション全体を実行していた `main` 関数は、単にスケジューラを起動するだけになります。

```cpp
#include <alps/parapack/parapack.h>
int main(int argc, char** argv) { return alps::parapack::start(argc, argv); }
```

シミュレーションロジックはすべて `Worker` クラスに移り、スケジューラが必要に応じてそれを呼び出します。

- コンストラクタと `init_observables` がシミュレーションのセットアップと可観測量の登録を行う
- `run` が 1 単位のモンテカルロ処理（ここでは 1 回のクラスター更新）を実行する
- `is_thermalized` と `progress` が、熱化が完了したか、実行が終了までどれくらい進んだかをスケジューラに伝える
- `save` と `load` がチェックポイントデータの書き込みと読み込みを行い、これによって再起動サポートが無償で得られる

```cpp
class wolff_worker : public alps::parapack::lattice_mc_worker<> {
  ...
  void run(alps::ObservableSet& obs) { ... }
  bool is_thermalized() const { return mcs >= MCTHRM; }
  double progress() const { return 1.0 * mcs / (MCTHRM + MCSTEP); }
  void save(alps::ODump& dp) const { dp << mcs << spin << sz; }
  void load(alps::IDump& dp) { dp >> mcs >> spin >> sz; }
};
```

Worker はマクロを使ってスケジューラに登録されます。`lattice_mc_worker` は ALPS の `lattice_helper` と `rng_helper` の両方を組み合わせたクラスであるため、Worker はそこから格子へのアクセス（`neighbors`、`num_sites`）と乱数生成（`random_01`）をそのまま継承して直接利用できます。

```cpp
PARAPACK_REGISTER_WORKER(wolff_worker, "wolff");
```

ここに至って、このページ冒頭で挙げた最初の利点が具体的な形を取ります：スケジューラ用のパラメータファイルには複数のパラメータセットを列挙でき、スケジューラは追加のコードなしにそれらすべての実行と管理を行います。例えば `wolff_params` は、3 つの異なる温度それぞれについて 16 個の独立な並列レプリカ（「クローン」）を要求します。

```
ALGORITHM = "wolff"
LATTICE = "square lattice"
L = 32
NUM_CLONES = 16
{ T = 2.2 }
{ T = 2.4 }
{ T = 2.6 }
```

```bash
$ cmake .
$ make
$ ./hello <hello.ip
$ ./wolff <wolff.ip
```

## 次のステップ

既存のコードが C や C++ ではなく Fortran で書かれている場合、ALPS はここで紹介した方法とは別に専用のラッパーライブラリを提供しています。始めるには [Integration-02：Fortran 入門](../alpsize02)を、既存の Fortran プログラムを ALPS に移植する完全な実例については [Integration-03：Fortran アプリケーション開発](../alpsize03)を参照してください。このチュートリアルで使われている CMake ビルドシステムについてさらに詳しく知りたい場合は、[Integration-01：CMake によるパッケージング](../alpsize01)を参照してください。
