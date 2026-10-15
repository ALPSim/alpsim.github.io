---
title: 密度行列繰り込み群 (DMRG)
math: true
weight: 11
---

## はじめに

密度行列繰り込み群 (DMRG) 法は、量子多体問題に現れるような非常に大きな行列の低エネルギー固有値と固有ベクトルを求めるために広く用いられている高度なアルゴリズムです。DMRG は非常に強力な特徴を備えています。数百個の量子スピンや電子からなる系を扱うことができ、極めて高精度な基底状態エネルギーを与え、低次元系のギャップを計算することができます。量子モンテカルロ法とともに、強相関電子系の分野における数値的研究の大部分を占めています。
DMRG は特に 1 次元系に適しており、基底状態の性質や低エネルギー固有状態のみに関心がある場合には、間違いなく第一選択となる手法です。このアルゴリズムは、開放境界条件を持つ系や、円筒境界条件を持つ準 2 次元系（はしご系）において、はるかに効率的であり、比較的少ない状態数で収束が得られます。

## DMRG 固有のパラメータ

| **名前** | **説明** |
| :------- | :-------------- |
| NUMBER_EIGENVALUES | 計算する固有状態とエネルギーの数。デフォルトは 1 で、ギャップを計算するには 2 に設定する必要があります。 |
| SWEEPS | DMRG スイープの回数。各スイープは、左から右への半スイープと、右から左への半スイープからなります。 |
| NUM_WARMUP_STATES | DMRG ブロックを成長させるための初期状態数。指定しない場合、アルゴリズムはデフォルト値の 20 を使用します。 |
| STATES | 各半スイープで保持する DMRG 状態の数。ユーザーは、2\*SWEEPS 個の異なる STATES の値を指定するか、MAXSTATES または NUMSTATES の値を 1 つ指定する必要があります。 |
| MAXSTATES | 保持する DMRG 状態の最大数。ユーザーは、各半スイープについて STATES の値を指定するか、プログラムが基底を成長させるために用いる MAXSTATES または NUMSTATES を指定するかを選ぶ必要があります。プログラムは各スイープで用いる状態数を自動的に決定し、MAXSTATES に達するまで STATES/(2\*SWEEPS) ずつ増やしていきます。 |
| NUMSTATES | すべてのスイープで保持する DMRG 状態の一定数。 |
| TRUNCATION_ERROR | 状態数の代わりに、シミュレーションの許容誤差を設定することもできます。プログラムは、この許容誤差を満たすために保持すべき状態数を自動的に決定します。ただし、これにより基底のサイズが制御不能なほど大きくなり、その結果クラッシュする可能性があるため、注意が必要です。したがって、前述のように MAXSTATES または NUMSTATES を用いて、最大状態数も制約として指定しておくことをお勧めします。 |
| LANCZOS_TOLERANCE | シミュレーションの厳密対角化（Davidson/Lanczos）部分の許容誤差。デフォルト値は 10^-7 です。 |
| CONSERVED_QUANTUMNUMBERS | 対象とするモデルで保存される量子数。コード内で行列をブロック形式に縮約するために用いられます。ある量子数について値が指定されていない場合、プログラムは大正準で動作します。例えばスピン鎖で Sz_total を指定しない場合、プログラムは dim=2^N 個の状態を持つヒルベルト空間を用いて実行されます。「正準」で実行する（例えば Sz_total=0 と設定する）と、次元の小さい部分空間で計算するため、性能が大幅に向上します。設定方法の例については、dmrg コードに含まれている parms ファイルを参照してください。 |
| VERBOSE | 0 より大きい整数に設定すると、密度行列の固有値などの追加の出力情報を表示します。デバッグ用に最大 3 までの異なる詳細レベルがありますが、通常のユーザーが 1 より大きいレベルを必要とすることはないはずです。 |
| START_SWEEP | （v1.3b6 以降で利用可能）中断したシミュレーションを再開する場合や、新しい状態数の設定でシミュレーションを延長する場合の開始スイープ。 |
| START_DIR | 再開するシミュレーションの開始方向。0 または 1 の値を取り、それぞれ「左から右」と「右から左」を表します。START_SWEEP が指定されている場合にのみ有効です。デフォルト値は 0 です。 |
| START_ITER | 再開するシミュレーションの開始反復。START_SWEEP が指定されている場合にのみ有効です。デフォルト値は 1 です。 |
| TEMP_DIRECTORY | DMRG プログラムは、ローカルフォルダにある一時ファイルに情報を保存します。一時ファイルは大量になることがあり、特に NFS を使用している場合にはファイルシステムを圧迫する可能性があります。これらのファイルの保存場所は、パラメータファイルで変数 TEMP_DIRECTORY を設定することで変更できます。システムの環境変数 TMPDIR を設定する方法もあります。 |

## 参考文献

- S. R. White, Density matrix formulation for quantum renormalization groups, Phys. Rev. Lett. 69, 2863 (1992).
- S. R. White, Density-matrix algorithms for quantum renormalization groups, Phys. Rev. B 48, 10345 (1993).
- U. Schollwöck, The density-matrix renormalization group, Rev. Mod. Phys. 77, 259 (2005).
- K. Hallberg, Density Matrix Renormalization: A Review of the Method and its Applications, arXiv:cond-mat/0303557.
- R. Noack and S. Manmana, Diagonalization- and Numerical Renormalization-Group-Based Methods for Interacting Quantum Systems, arXiv:cond-mat/0510321
