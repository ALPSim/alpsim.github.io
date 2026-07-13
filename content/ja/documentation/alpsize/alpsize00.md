
---
title: Integration-00 ユーザーコード統合
math: true
toc: true
weight: 1
---

## 統合入門

CMake でパッケージングし ALPS ライブラリとリンクすることで、**Parameters** や **Alea** などの ALPS スケジューラ機能を最小限のセットアップで利用できます。ALPS スケジューラを使うと次のような利点があります。

- コードを追加することなくパラメータ並列化が可能。
- 同一バイナリでノートPC・クラスタサーバー・スーパーコンピュータすべてで動作。
- 結果の集約と後処理が組み込み済み。
- 既に並列化されたコードの多段並列化も簡単。
- レプリカ交換法などの高度な手法向けのアダプタがすぐに利用可能。

## チュートリアル

以下の各ステップは統合チュートリアルパッケージ内のサブディレクトリに対応しています。
順番に進めてください。各ステップは前のステップを土台として構築されています。

### CMake によるパッケージング

00_cmake — 最小限の "hello world" プログラムをコンパイル・実行して、CMake + ALPS のビルドシステムが正しく設定されていることを確認します。

    $ cmake .
    $ make
    $ ./hello

### Wolff アルゴリズムの C 言語による実装

01_original-c — ALPS や C++ の機能を一切使わない、Wolff クラスターアルゴリズムの純粋な C 実装です。ベースラインとなります。

    $ cmake .
    $ make
    $ ./wolff

### Wolff アルゴリズムの C++ 言語による実装

02_basic-cpp — C コードを慣用的な C++ に移行します。`<math.h>` を `<cmath>` に置き換え、`std::` I/O を使用し、C++ のコメントスタイルを採用します。

- `<math.h>` を `<cmath>` に置き換える（他の C ヘッダも同様に C++ 版に変更）
- `std` 名前空間の使用
- `printf`/`fprintf` を `std::cout`/`std::cerr` に置き換える
- C++ スタイルのコメントに変更

        $ cmake .
        $ make
        $ ./wolff

### 標準テンプレートライブラリ（STL）の使用

03_stl — 生の配列と手動メモリ管理を `std::vector` と `std::stack` に置き換え、メモリ確保・解放を標準ライブラリに任せます。

- `std::vector<>`：1 次元配列
    - サイズは自動的に確保・解放される
    - 要素の型（ユーザー定義型を含む）はテンプレートパラメータで指定
- `std::stack<>`：同様の自動メモリ管理を持つスタック

            $ cmake .
            $ make
            $ ./wolff

### Boost C++ ライブラリの使用

04_boost — 固定長配列・より優れた乱数生成器・タイマーを Boost で置き換えます。

- `<boost/array.hpp>`：固定長配列
- `<boost/random.hpp>`：乱数生成
    - メルセンヌ・ツイスタ、ラグドフィボナッチ法などの生成器
    - 一様分布、正規分布、ポアソン分布、指数分布など
- `<boost/timer.hpp>`：実行時間計測用タイマー

            $ cmake .
            $ make
            $ ./wolff

### ALPS/parameters の使用

05_parameters — ハードコードされた定数をなくし、`ALPS/parameters` を通じてファイルからシミュレーションパラメータを読み込みます。

    $ cmake .
    $ make
    $ ./wolff <wolff.ip

### ALPS/alea の使用

06_alea — `ALPS/alea` を使ってオブザーバブルデータを蓄積・解析し、統計誤差の自動推定を行います。

    $ cmake .
    $ make
    $ ./wolff wolff.ip

### ALPS/lattice の使用

07_lattice — `ALPS/lattice` を通じてシミュレーション格子を定義し、幾何学的な構造と物理を分離します。

    $ cmake .
    $ make
    $ ./lattice <lattice.ip
    $ ./wolff <wolff.ip

### ALPS/Parapack スケジューラを用いた完全な統合

08_scheduler — シミュレーションを Worker クラスに包み、ALPS Parapack スケジューラに制御を渡すことで、透過的な並列化を実現します。

- シミュレーションロジックを `Worker` クラスにカプセル化する
- Worker クラスで実装すべき関数：
    - コンストラクタと `init_observables` メンバ関数
    - `run` メンバ関数
    - `is_thermalized` と `progress` メンバ関数
    - `save` と `load` メンバ関数
- `PARAPACK_REGISTER_WORKER` マクロを使用して Worker をスケジューラに登録する
- スケジューラが `Parameters` と `ObservableSet` を準備し、コンストラクタ・`init_observables`・`run` 関数を呼び出す
- `lattice_mc_worker` は `lattice_helper` と `rng_helper` の両方を継承しているため、それらのメソッドを直接使用できる

        $ cmake .
        $ make
        $ ./hello < hello.ip
        $ ./wolff < wolff.ip
