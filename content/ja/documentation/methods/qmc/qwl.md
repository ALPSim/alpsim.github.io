
---
title: 量子 Wang-Landau アルゴリズム
math: true
weight: 7
---

## はじめに

`qwl` コードは、確率級数展開 (SSE) 量子モンテカルロ法に基づく量子 Wang-Landau (QWL) 法のマルチクラスター実装を提供します。QWL 法は、ALPS コラボレーションのメンバーである M. Troyer、S. Wessel、F. Alet によって、古典 Wang-Landau アルゴリズムを量子系へ拡張したものとして開発されました。その基礎となる SSE 法は A. Sandvik らによって考案されました。QWL の手法を用いると、分配関数の高温級数展開に基づく拡張アンサンブルでの 1 回のシミュレーションから、エネルギーやエントロピーなどの熱力学量を求めることができます。展開係数はシミュレーションの過程で高次まで計算されます。

現在の QWL 法の実装は、古典系の場合に C. Zhou と R. N. Bhatt によって提案された、元の手法の拡張に基づいています。このアルゴリズムでは、まずヒストグラムの平坦性の代わりに Zhou-Bhatt の判定条件を用いて、Wang-Landau の精密化ステップを何回か実行します。最終的なアンサンブルの重みが得られた後、その結果得られたアンサンブルで、観測量の測定を含む追加のシミュレーションを行います。

**注意：** この最初のバージョンでは、ゼロ磁場における、任意のフラストレーションのない格子上の等方的なスピン 1/2 ハイゼンベルク強磁性・反強磁性モデルのシミュレーションが可能です。今後、この制約を緩和するとともに、QWL 摂動展開の実装も提供する予定です。

## シミュレーションの実行

についてはチュートリアルで説明しています。`qwl` プログラムを使ってシミュレーションを実行した後、`qwl_evaluate` プログラムのスクリプトにより、以下に示す熱力学的性質および（測定した場合は）磁気的性質の XML プロットファイルが生成されます。

## 入力パラメータ

ここで説明した共通の入力パラメータに加えて、`qwl` アプリケーションは次の入力パラメータを受け取ります。

| **名前** | **デフォルト値** | **説明** |
| :------- | :---------- | :-------------- |
| CUTOFF | 500 | シミュレーション中に保持される最大の展開次数 |
| T_MIN | 0.1 | `qwl_evaluate` で観測量を計算する最低温度（コマンドラインオプション \[-T_MIN ...\] で上書きされます） |
| T_MAX | 10 | `qwl_evaluate` で観測量を計算する最高温度（コマンドラインオプション \[-T_MAX ...\] で上書きされます） |
| DELTA_T | 0.1 | `qwl_evaluate` で使われる温度の刻み幅（コマンドラインオプション \[-DELTA_T ...\] で上書きされます） |
| MEASURE_MAGNETIC_PROPERTIES | 1 | 一様な磁気的性質、および LATTICE が二部格子の場合には交替（スタガード）磁気的性質（以下に列挙）の測定を有効 (1) または無効 (0) にします |

### 上級者向けパラメータ

さらに、特に元の QWL 精密化スキームを用いたシミュレーションを行えるように、次のパラメータをアルゴリズムに指定できます。

| **名前** | **デフォルト値** | **説明** |
| :------- | :---------- | :-------------- |
| NUMBER_OF_WANG_LANDAU_STEPS | 16 | Wang-Landau 精密化ステップの回数 |
| SWEEPS | Wang-Landau 精密化中に決定 | 重みを固定した最終シミュレーションにおけるモンテカルロステップ数 |
| USE_ZHOU_BHATT_METHOD | 1 | Zhou-Bhatt 法の使用を有効 (1) または無効 (0) にします（無効 (0) の場合、FLATNESS_TRESHOLD と BLOCK_SWEEPS が適用されます） |
| FLATNESS_TRESHOLD | USE_ZHOU_BHATT_METHOD=1 の場合は N/A、USE_ZHOU_BHATT_METHOD=0 の場合は 0.2 | 増加因子を減少させる前に到達すべき、ヒストグラムの最大値・最小値の平均値からの最大偏差（USE_ZHOU_BHATT_METHOD=0 の場合のみ適用） |
| BLOCK_SWEEPS | USE_ZHOU_BHATT_METHOD=1 の場合は N/A、USE_ZHOU_BHATT_METHOD=0 の場合は 10000 | 平坦性を確認するまでに 1 つの Wang-Landau ステップ内で行うスイープ数（USE_ZHOU_BHATT_METHOD=0 の場合のみ適用） |
| INITIAL_MODIFICATION_FACTOR | USE_ZHOU_BHATT_METHOD=1 の場合は e、USE_ZHOU_BHATT_METHOD=0 の場合は他のパラメータから決定 | 最初の Wang-Landau 精密化ステップにおける展開係数の増加因子の初期値（後続のステップでは、この因子はその平方根をとることで減少させます） |
| EXPANSION_ORDER_MINIMUM | 0 | 決定する係数の最小展開次数 |
| EXPANSION_ORDER_MAXIMUM | CUTOFF | 決定する係数の最大展開次数。CUTOFF を超えてはいけません |
| START_STORING | NUMBER_OF_WANG_LANDAU_STEPS | 展開係数の保存を開始する Wang-Landau ステップの番号 |

## 測定

`qwl_evaluate` プログラムは qwl シミュレーションの XML 出力ファイルを受け取り、

    qwl_evaluate [-T_MIN ...] [-T_MAX ...] [-DELTA_T ...] prefix.out.xml

次の量の温度依存性を表す XML プロットファイル（`prefix.plot.energy.xml` など）を生成します。

| **名前** | **説明** |
| :------- | :-------------- |
| Energy Density | サイトあたりのエネルギー |
| Free Energy Density | サイトあたりの自由エネルギー |
| Entropy Density | サイトあたりのエントロピー |
| Specific Heat per Site | サイトあたりの比熱 |
| Uniform Structure Factor per Site | 縦方向の一様構造因子（MEASURE_MAGNETIC_PROPERTIES=1 の場合） |
| Uniform Susceptibility per Site | 一様磁化率（MEASURE_MAGNETIC_PROPERTIES=1 の場合） |
| Staggered Structure Factor per Site | 縦方向の交替構造因子（MEASURE_MAGNETIC_PROPERTIES=1 かつ二部格子の場合のみ） |

次の量は `qwl` アプリケーションによって直接測定されるもので、主にアルゴリズム上の観点から重要です。

| **名前** | **説明** |
| :------- | :-------------- |
| Coefficients | 分配関数の高温級数展開 $Z= \sum_n g(n)\beta_n$ の係数 $g(n)$ の対数 $\ln[g(n)]$ の推定値。SWEEPS 回の重み固定スイープの後に、最終ヒストグラムを考慮して求めたもの（通常これが最良の推定値になります）|
| Coefficients # | #番目の Wang-Landau 精密化ステップ後の $\ln[g(n)]$ の推定値（# ≥ START_STORING） |
| Histogram | 重み固定スイープ中に訪れた展開次数の規格化されたヒストグラム |
| Fraction | 重み固定スイープ中に訪れた展開次数ごとの、上向きウォーカーの割合 |
| Time Up | 重み固定スイープ中に、最低の展開係数から最高の展開係数までトンネルするのにかかる時間 |
| Time Down | 重み固定スイープ中に、最高の展開係数から最低の展開係数までトンネルするのにかかる時間 |
| Time Total | 重み固定スイープ中に、最低の展開係数から最高の展開係数へトンネルし、再び最低の展開係数に戻るまでにかかる時間 |
| Total Sweeps | Wang-Landau 精密化を含む、シミュレーション全体で使われたスイープ数 |
| Total Sweeps # | #番目の Wang-Landau 精密化ステップで使われたスイープ数（# ≥ START_STORING） |
| Uniform Structure Factor Coefficients | 一様構造因子の展開係数（MEASURE_MAGNETIC_PROPERTIES=1 の場合） |
| Staggered Structure Factor Coefficients | 交替構造因子の展開係数（MEASURE_MAGNETIC_PROPERTIES=1 かつ二部格子の場合のみ） |

qwl アプリケーションの正確なバージョンによっては、他の量も利用できる場合があります。

## 参考文献

- M. Troyer, S. Wessel and F. Alet, Phys. Rev. Lett. 90, 120201 (2003)
- S. Wessel, N. Stoop, E. Gull, S. Trebst, and M. Troyer, J. Stat. Mech. P12005 (2007)
- S. Trebst, D. A. Huse, and M. Troyer, Phys. Rev. E 70, 046701 (2004)
- C. Zhou and R.N. Bhatt, Phys. Rev. E 72, 025701(R) (2005)
