---
title: 実装
math: true
weight: 3
---

## はじめに

`fulldiag` パッケージは、LAPACK ライブラリを用いてハミルトニアンの完全対角化を行います。そのため、ALPS ライブラリを用いて定義できるあらゆるモデルの熱力学的性質の計算に使用できます。主な制約はサイズです。すなわち、他のより特化したアプリケーションがまだ問題なく動作するサイズでも、メモリや CPU 時間が許容できないほど大きくなることがあります。

リリース 1.3 では、$-hS_z$ または $-\mu N$ の形の保存量への結合、すなわち SITETERM $-h S_z(i)$ または $-\mu n(i)$ を持つモデルについて、磁気的性質または電荷的性質を計算できるようになりました。実際、保存量への結合を持つ他の状況への適用も、ソースファイル fulldiag.h の数行を変更することで比較的簡単に行えるはずです（ただし、ユーザーが少なくとも 5 つの文字列を変更する必要があるため、現時点ではサポートしていません）。保存量が存在しない場合は、評価される量が 2 つ少なくなります（下記参照）。

**警告：** 保存量とされる量が実際にはハミルトニアンと交換しない場合、誤った結果が得られることがあります。また、係数が上記の形でない場合や、磁場 $h$ または化学ポテンシャル $\mu$ を `fulldiag_evaluate` で変更した場合にも、一般に誤った結果が得られます。


## 計算の実行

については `fulldiag` のチュートリアルで説明しています。`fulldiag` プログラムで全スペクトルを得た後、評価プログラム `fulldiag_evaluate` を用いて、以下に示す熱力学的性質および磁気的性質の XML プロットファイルを効率よく作成できます。

### 入力パラメータ

`fulldiag` アプリケーションのパラメータは、すべて共通入力パラメータの中で説明されています（特に厳密対角化のための追加パラメータに注意してください）。
以下のパラメータは `fulldiag_evaluate` でのみ使用されます。

| **パラメータ** | **デフォルト値** | **意味** |
| :------------ | :---------- | :---------- |
| T_MIN |  | 観測量を計算する最低温度 |
| T_MAX |  | 観測量を計算する最高温度 |
| DELTA_T | | 温度の刻み幅 |
| couple | | couple mu により、結合をデフォルトの $-h S_z$ から $-\ mu N$ に変更します。これにより、他のいくつかのパラメータや量の意味も変わります（下記参照）。 |
| H_MIN (MU_MIN) | | 観測量を計算する最小の磁場（--couple mu が指定された場合は化学ポテンシャル） |
| H_MAX (MU_MAX) | | 観測量を計算する最大の磁場（--couple mu が指定された場合は化学ポテンシャル） |
| DELTA_H (DELTA_MU) | | 磁場の刻み幅（--couple mu が指定された場合は化学ポテンシャルの刻み幅） |
| versus | | versus h（--couple mu が指定された場合は versus mu）により、温度の代わりに磁場（化学ポテンシャル）を $x$ 軸にとります |
| MEASURE_MAGNETIC_PROPERTIES (MEASURE_CHARGE_PROPERTIES) | 1 | 磁気的（または電荷的）性質の評価をオン (1) またはオフ (0) にします（下記参照）。現在のバージョンの `fulldiag` では、このような測定は全 $S_z$ または $N$ が保存されるモデルでのみ可能であることに注意してください。`fulldiag` のパラメータにも、対応する CONSERVED_QUANTUMNUMBERS=... を指定する必要があります。 |
| DENSITIES | 1 | 量をサイトあたりで規格化する (1) か、系全体の値とする (0) かを指定します |

これらのパラメータはすべて、同じ名前のコマンドライン引数で上書きできます。

## 熱力学的性質の評価

`fulldiag_evaluate` プログラムは、`fulldiag` の XML 出力ファイルを受け取ります。

    fulldiag_evaluate [--T_MIN ...] [--T_MAX ...] [--DELTA_T ...]
        [--H_MIN ...] [--H_MAX ... ] [--DELTA_H ... ] [--versus h]
        [--DENSITIES ...] inputfile [outputfileprefix]</tt>

または

    fulldiag_evaluate --couple mu [--T_MIN ...] [--T_MAX ...] [--DELTA_T ...]
        [--MU_MIN ...] [--MU_MAX ... ] [--DELTA_MU ...] [--versus mu]
        [--DENSITIES ...] inputfile [outputfileprefix]</tt>

温度（T_MIN, T_MAX, DELTA_T）と、磁場（H_MIN, H_MAX, DELTA_H）または化学ポテンシャル（MU_MIN, MU_MAX, DELTA_MU）について、2 つの範囲をオプションで指定できます。`fulldiag_evaluate` は、以下の量の温度依存性について XML プロットファイル（`outputfileprefix.plot.energy.xml` など。outputfileprefix が指定されていない場合は inputfile の名前から決まります）を出力します。

- エネルギー（Energy）[密度]
- 自由エネルギー（Free Energy）[密度]
- エントロピー（Entropy）[密度]
- 比熱（Specific Heat）[密度]
- 磁化（Magnetization）[密度]（MEASURE_MAGNETIC_PROPERTIES=1 で、couple mu を指定しない場合）
- 一様磁化率（Uniform Susceptibility）[密度]（MEASURE_MAGNETIC_PROPERTIES=1 で、couple mu を指定しない場合）
- 粒子数（Particle number）[密度]（MEASURE_CHARGE_PROPERTIES=1 で、couple mu を指定した場合）
- 圧縮率（Compressibility）[密度]（MEASURE_CHARGE_PROPERTIES=1 で、couple mu を指定した場合）

パラメータ DENSITIES=1 の場合、量は密度として、すなわちサイト数で規格化されて出力され、DENSITIES=0 の場合は系全体の値が出力されることに注意してください。デフォルトでは、温度を $x$ 軸にとったプロットが作成されます。磁場（化学ポテンシャル）を $x$ 軸にとったプロットを得るには、引数 --versus h（--versus mu）を使用してください。

`fulldiag` は、固有値や、計算可能な物理量の結果（系全体について測定したもの）などの情報を保存します。これらは主に専門家向けのものであり、必要な場合には説明なしでも理解できるものと期待しています。

## 貢献者

以下の方々が `fulldiag` アプリケーションに貢献しました。

- Matthias Troyer
- Andreas Honecker 



